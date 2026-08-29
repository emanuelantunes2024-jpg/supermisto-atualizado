import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { siteConfig } from "@/lib/config";
import { sendPurchaseEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
// El webhook necesita el cuerpo crudo para verificar la firma.
export const dynamic = "force-dynamic";

/**
 * Webhook de Stripe.
 *
 * Es el único punto donde un pedido pasa a `paid` y, por tanto, el único
 * que libera la descarga. Verifica siempre la firma antes de tocar nada.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la cabecera stripe-signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe-webhook] Firma inválida:", error);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    console.error("[stripe-webhook] Supabase service role no configurado.");
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 503 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // `paid` solo cuando Stripe confirma el cobro (algunos métodos son diferidos).
        if (session.payment_status !== "paid") break;
        await fulfillOrder(session);
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        await fulfillOrder(event.data.object);
        break;
      }

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.client_reference_id ?? session.metadata?.order_id;
        if (orderId) {
          await supabase.from("orders").update({ status: "failed" }).eq("id", orderId).eq("status", "pending");
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        if (charge.payment_intent) {
          await supabase
            .from("orders")
            .update({ status: "refunded" })
            .eq("stripe_payment_intent_id", String(charge.payment_intent));
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    // Devolver 500 hace que Stripe reintente la entrega.
    console.error(`[stripe-webhook] Error procesando ${event.type}:`, error);
    return NextResponse.json({ error: "Error procesando el evento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });

  /** Marca el pedido como pagado (idempotente) y envía el email de descarga. */
  async function fulfillOrder(session: Stripe.Checkout.Session) {
    const orderId = session.client_reference_id ?? session.metadata?.order_id;
    if (!orderId || !supabase) return;

    const { data: existing } = await supabase
      .from("orders")
      .select("id, status, customer_id, download_token, buyer_email, buyer_name, amount_cents, template_id")
      .eq("id", orderId)
      .maybeSingle();

    if (!existing) {
      console.error(`[stripe-webhook] Pedido ${orderId} no encontrado.`);
      return;
    }

    // Stripe reintenta eventos: no reenviar el email si ya estaba pagado.
    if (existing.status === "paid") return;

    const amountCents = session.amount_total ?? existing.amount_cents;

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        stripe_payment_intent_id: session.payment_intent ? String(session.payment_intent) : null,
        amount_cents: amountCents,
        paid_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) throw updateError;

    const { data: items } = await supabase
      .from("order_items")
      .select("id, template_id, title_snapshot, unit_price_cents, quantity")
      .eq("order_id", orderId);

    // Compatibilidad: pedidos antiguos de una sola plantilla sin `order_items`.
    let lines = items ?? [];
    if (lines.length === 0 && existing.template_id) {
      const { data: template } = await supabase
        .from("templates")
        .select("title")
        .eq("id", existing.template_id)
        .maybeSingle();
      lines = [
        {
          id: "",
          template_id: existing.template_id,
          title_snapshot: template?.title ?? "tu plantilla",
          unit_price_cents: amountCents,
          quantity: 1,
        },
      ];
    }

    // Emite una licencia por cada línea del pedido: es lo que da derecho a
    // descargar desde "Mis templates" / "Licencias" en el área de cliente.
    const licenseRows = lines
      .filter((line) => line.id)
      .map((line) => ({
        order_item_id: line.id,
        customer_id: existing.customer_id,
        template_id: line.template_id,
      }));
    if (licenseRows.length > 0) {
      await supabase.from("licenses").insert(licenseRows);
    }

    await sendPurchaseEmail({
      to: session.customer_details?.email ?? existing.buyer_email,
      buyerName: session.customer_details?.name ?? existing.buyer_name,
      items: lines.map((line) => ({ title: line.title_snapshot, priceCents: line.unit_price_cents * line.quantity })),
      amountCents,
      orderId,
      downloadUrl: `${siteConfig.url}/api/descargar/${existing.download_token}`,
    });
  }
}

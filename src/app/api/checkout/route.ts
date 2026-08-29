import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { getStripe, stripeTaxEnabled } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublishedTemplates } from "@/lib/queries";
import type { TemplateWithCategory } from "@/lib/types";

export const runtime = "nodejs";

interface CartItemInput {
  slug?: string;
  quantity?: number;
}

interface CheckoutBody {
  items?: CartItemInput[];
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Crea el pedido (con sus líneas en `order_items`) en estado `pending` y
 * devuelve la URL de Stripe Checkout con una línea por producto del
 * carrito. El archivo NO se libera aquí: solo el webhook, tras confirmar
 * el cobro, marca el pedido como `paid` y emite las licencias.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CheckoutBody;

  const email = (body.email ?? "").trim().toLowerCase();
  const requestedItems = (body.items ?? []).filter((item): item is Required<CartItemInput> =>
    Boolean(item.slug && (item.quantity ?? 0) > 0),
  );

  if (requestedItems.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Introduce un correo electrónico válido." }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Los pagos todavía no están configurados. Añade STRIPE_SECRET_KEY en el entorno." },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "La base de datos no está configurada. Añade las claves de Supabase en el entorno." },
      { status: 503 },
    );
  }

  // Los precios siempre se recalculan en el servidor a partir del catálogo
  // publicado: nunca se confía en el precio que venga del navegador.
  const catalog = await getPublishedTemplates();
  const bySlug = new Map(catalog.map((t) => [t.slug, t]));

  const lines: { template: TemplateWithCategory; quantity: number }[] = [];
  for (const item of requestedItems) {
    const template = bySlug.get(item.slug);
    if (!template) {
      return NextResponse.json({ error: `La plantilla "${item.slug}" ya no está disponible.` }, { status: 404 });
    }
    lines.push({ template, quantity: Math.min(item.quantity, 20) });
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.template.price_cents * line.quantity, 0);
  const { user } = await getSession();
  const downloadToken = randomUUID();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: user?.id ?? null,
      template_id: lines.length === 1 ? lines[0].template.id : null,
      amount_cents: subtotalCents,
      subtotal_cents: subtotalCents,
      discount_cents: 0,
      currency: "eur",
      status: "pending",
      buyer_email: email,
      buyer_name: body.fullName?.trim() || null,
      buyer_country: body.country?.trim() || null,
      buyer_phone: body.phone?.trim() || null,
      download_token: downloadToken,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[checkout] No se pudo crear el pedido:", orderError);
    return NextResponse.json({ error: "No hemos podido registrar el pedido. Inténtalo de nuevo." }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      template_id: line.template.id,
      title_snapshot: line.template.title,
      unit_price_cents: line.template.price_cents,
      quantity: line.quantity,
    })),
  );

  if (itemsError) {
    console.error("[checkout] No se pudieron guardar las líneas del pedido:", itemsError);
    return NextResponse.json({ error: "No hemos podido registrar el pedido. Inténtalo de nuevo." }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: order.id,
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "eur",
          unit_amount: line.template.price_cents,
          // El precio mostrado ya incluye impuestos (normativa de consumo UE).
          ...(stripeTaxEnabled ? { tax_behavior: "inclusive" as const } : {}),
          product_data: {
            name: line.template.title,
            description: line.template.short_description,
            // Stripe exige una URL absoluta; thumbnail_url en la base de datos
            // es una ruta relativa (ej. "/thumbnails/foo.jpg").
            ...(line.template.thumbnail_url
              ? {
                  images: [
                    line.template.thumbnail_url.startsWith("http")
                      ? line.template.thumbnail_url
                      : `${siteConfig.url}${line.template.thumbnail_url}`,
                  ],
                }
              : {}),
          },
        },
      })),
      ...(stripeTaxEnabled
        ? { automatic_tax: { enabled: true }, customer_creation: "always" as const }
        : {}),
      metadata: {
        order_id: order.id,
        buyer_country: body.country ?? "",
        item_count: String(lines.length),
      },
      success_url: `${siteConfig.url}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.url}/carrito?cancelado=1`,
      locale: "es",
    });

    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Error creando la sesión de Stripe:", error);
    await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json({ error: "No hemos podido iniciar el pago. Inténtalo de nuevo." }, { status: 500 });
  }
}

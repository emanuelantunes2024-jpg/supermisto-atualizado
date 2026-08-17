import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { getStripe, stripeTaxEnabled } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTemplateBySlug } from "@/lib/queries";

export const runtime = "nodejs";

interface CheckoutBody {
  templateSlug?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Crea el pedido en estado `pending` y devuelve la URL de Stripe Checkout.
 * El archivo NO se libera aquí: solo el webhook, tras confirmar el cobro,
 * marca el pedido como `paid`.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CheckoutBody;

  const email = (body.email ?? "").trim().toLowerCase();
  const templateSlug = (body.templateSlug ?? "").trim();

  if (!templateSlug) {
    return NextResponse.json({ error: "Falta la plantilla a comprar." }, { status: 400 });
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

  const template = await getTemplateBySlug(templateSlug);
  if (!template || template.status !== "published") {
    return NextResponse.json({ error: "Esta plantilla ya no está disponible." }, { status: 404 });
  }

  const { user } = await getSession();
  const downloadToken = randomUUID();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: user?.id ?? null,
      template_id: template.id,
      amount_cents: template.price_cents,
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: order.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: template.price_cents,
            // El precio mostrado ya incluye impuestos (normativa de consumo UE).
            ...(stripeTaxEnabled ? { tax_behavior: "inclusive" as const } : {}),
            product_data: {
              name: template.title,
              description: template.short_description,
              // Stripe exige una URL absoluta; thumbnail_url en la base de datos
              // es una ruta relativa (ej. "/thumbnails/foo.jpg").
              ...(template.thumbnail_url
                ? {
                    images: [
                      template.thumbnail_url.startsWith("http")
                        ? template.thumbnail_url
                        : `${siteConfig.url}${template.thumbnail_url}`,
                    ],
                  }
                : {}),
            },
          },
        },
      ],
      ...(stripeTaxEnabled
        ? { automatic_tax: { enabled: true }, customer_creation: "always" as const }
        : {}),
      metadata: {
        order_id: order.id,
        template_id: template.id,
        template_title: template.title,
        buyer_country: body.country ?? "",
      },
      success_url: `${siteConfig.url}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.url}/checkout/${template.slug}?cancelado=1`,
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

import type { Metadata } from "next";
import Link from "next/link";

import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";
import { formatPrice } from "@/lib/format";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compra confirmada",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

interface Confirmation {
  items: { title: string }[];
  amountCents: number;
  email: string;
  downloadToken: string | null;
  paid: boolean;
}

/**
 * Página de retorno de Stripe. La descarga se libera cuando el webhook marca
 * el pedido como pagado; aquí solo se lee ese estado (nunca se concede acceso
 * a partir de la vuelta del navegador, que es manipulable).
 */
async function loadConfirmation(sessionId: string): Promise<Confirmation | null> {
  const stripe = getStripe();
  const supabase = createAdminClient();
  if (!stripe || !supabase) return null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.client_reference_id ?? session.metadata?.order_id;
    if (!orderId) return null;

    const { data: order } = await supabase
      .from("orders")
      .select("status, amount_cents, buyer_email, download_token, templates(title)")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) return null;

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("title_snapshot")
      .eq("order_id", orderId);

    const legacyTemplate = Array.isArray(order.templates) ? order.templates[0] : order.templates;
    const items =
      orderItems && orderItems.length > 0
        ? orderItems.map((item) => ({ title: item.title_snapshot }))
        : [{ title: (legacyTemplate as { title?: string } | null)?.title ?? "Tu plantilla" }];

    const paid = order.status === "paid";

    return {
      items,
      amountCents: order.amount_cents,
      email: order.buyer_email,
      downloadToken: paid ? order.download_token : null,
      paid,
    };
  } catch (error) {
    console.error("[checkout/exito] No se pudo leer la sesión:", error);
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;
  const confirmation = sessionId ? await loadConfirmation(sessionId) : null;

  return (
    <section className="py-20">
      {confirmation?.paid && <ClearCartOnMount />}
      <div className="container-shell max-w-[680px]">
        <div className="panel text-center">
          <span
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{ background: "rgba(255,122,26,0.14)" }}
          >
            {confirmation?.paid ? "✅" : "⏳"}
          </span>

          {confirmation?.paid ? (
            <>
              <h1 className="mb-3 text-[28px]">¡Gracias por tu compra!</h1>
              <p className="mb-2 text-[15px] text-ink-muted">
                Tu pago de <strong className="text-gold-500">{formatPrice(confirmation.amountCents)}</strong> se ha
                confirmado. Te hemos enviado el enlace de descarga a{" "}
                <strong className="text-ink">{confirmation.email}</strong>.
              </p>
              <ul className="mx-auto mb-6 max-w-sm text-[13.5px] text-ink-muted">
                {confirmation.items.map((item) => (
                  <li key={item.title}>• {item.title}</li>
                ))}
              </ul>

              {confirmation.downloadToken && confirmation.items.length === 1 && (
                <a href={`/api/descargar/${confirmation.downloadToken}`} className="btn btn-gold btn-lg">
                  Descargar mi plantilla
                </a>
              )}
              {confirmation.downloadToken && confirmation.items.length > 1 && (
                <Link href="/cuenta/descargas" className="btn btn-gold btn-lg">
                  Ir a mis descargas
                </Link>
              )}

              <p className="mt-6 text-[13px] text-ink-muted">
                También puedes descargarlas cuando quieras desde{" "}
                <Link href="/cuenta/descargas" className="text-gold-500 hover:underline">
                  Mis templates
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-3 text-[28px]">Estamos confirmando tu pago</h1>
              <p className="mb-6 text-[15px] text-ink-muted">
                {confirmation
                  ? "Tu pedido está registrado y el pago se está verificando. En cuanto se confirme recibirás el enlace de descarga por email — normalmente tarda unos segundos."
                  : "No hemos podido leer los datos de esta compra. Si el cobro se realizó, recibirás el enlace de descarga por email en unos minutos."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/cuenta/compras" className="btn btn-gold">
                  Ir a mis compras
                </Link>
                <Link href="/contacto" className="btn btn-ghost">
                  Contactar con soporte
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "📦", title: "Archivos completos", text: "HTML, CSS, JS y guía de instalación." },
            { icon: "🛠️", title: "Soporte 30 días", text: "Te ayudamos a publicar tu sitio." },
            { icon: "♾️", title: "Licencia permanente", text: "Pago único, sin mensualidades." },
          ].map((item) => (
            <div key={item.title} className="surface p-5 text-center">
              <div className="mb-2 text-2xl">{item.icon}</div>
              <h4 className="mb-1 text-[14px]">{item.title}</h4>
              <p className="text-[12.5px] text-ink-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getSession } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/config";
import { formatPrice, vatIncludedCents } from "@/lib/format";
import { getTemplateBySlug } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const steps = ["Plantilla", "Datos", "Pago", "Descarga"];

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) notFound();

  const { user, customer } = await getSession();
  const vat = vatIncludedCents(template.price_cents);

  return (
    <section className="pb-20 pt-9">
      <div className="container-shell">
        <h1 className="mb-1.5 text-2xl">Finalizar compra</h1>
        <p className="mb-6 text-[13.5px] text-ink-muted">🔒 Pago 100% seguro y encriptado con Stripe</p>

        <ol className="mb-8 flex flex-wrap items-center gap-2.5 text-[12.5px] text-ink-muted">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  index <= 1 ? "bg-gold-500 text-navy-950" : "border border-line"
                }`}
              >
                {index + 1}
              </span>
              <span>{step}</span>
              {index < steps.length - 1 && <span className="h-px w-6 bg-[rgba(255,255,255,0.12)]" />}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
          <div className="panel h-fit">
            <h3 className="mb-4 text-lg">Tu pedido</h3>
            <div className="flex items-center gap-3.5">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-2xl"
                style={{ background: "rgba(240,167,48,0.12)" }}
              >
                {template.category?.icon ?? "🎨"}
              </span>
              <div>
                <h4 className="text-[15px]">{template.title}</h4>
                <span className="text-[12.5px] text-ink-muted">
                  {formatPrice(template.price_cents)} · Plantilla web
                </span>
              </div>
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-muted">
              ✓ Acceso inmediato tras el pago
              <br />✓ Archivos completos HTML/CSS/JS
              <br />✓ Soporte técnico 30 días incluido
            </p>
            <Link
              href={`/plantillas/${template.slug}`}
              className="mt-4 inline-block text-[12.5px] text-gold-400 hover:underline"
            >
              ← Volver a la plantilla
            </Link>
          </div>

          <CheckoutForm
            templateSlug={template.slug}
            defaults={{
              email: user?.email ?? "",
              fullName: customer?.full_name ?? "",
            }}
            paymentsEnabled={isStripeConfigured}
          />

          <div className="panel h-fit lg:sticky lg:top-24">
            <h3 className="mb-4 text-lg">Resumen</h3>
            <div className="flex justify-between py-2 text-[13.5px] text-ink-muted">
              <span>Subtotal</span>
              <span>{formatPrice(template.price_cents - vat)}</span>
            </div>
            <div className="flex justify-between py-2 text-[13.5px] text-ink-muted">
              <span>IVA (incluido)</span>
              <span>{formatPrice(vat)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-4 font-display text-lg font-extrabold">
              <span>Total</span>
              <span className="text-gold-400">{formatPrice(template.price_cents)}</span>
            </div>
            <p className="mt-4 text-[11.5px] leading-relaxed text-ink-muted">
              El IVA final se calcula según tu país de residencia en la pasarela de pago. Al continuar aceptas
              los{" "}
              <Link href="/legal/terminos" className="text-gold-400 hover:underline">
                términos y condiciones
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

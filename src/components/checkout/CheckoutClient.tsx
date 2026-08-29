"use client";

import Link from "next/link";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

interface CheckoutClientProps {
  defaults: { email: string; fullName: string };
  paymentsEnabled: boolean;
}

const steps = ["Carrito", "Datos", "Pago", "Descarga"];

export function CheckoutClient({ defaults, paymentsEnabled }: CheckoutClientProps) {
  const { items, subtotalCents, discountCents, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <section className="py-20">
        <div className="container-shell max-w-[560px]">
          <div className="panel text-center">
            <h1 className="mb-3 text-2xl">Tu carrito está vacío</h1>
            <p className="mb-6 text-[14px] text-ink-muted">Añade algún template antes de pagar.</p>
            <Link href="/plantillas" className="btn btn-gold">
              Explorar templates
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
                  index <= 1 ? "bg-gold-500 text-white" : "border border-line"
                }`}
              >
                {index + 1}
              </span>
              <span>{step}</span>
              {index < steps.length - 1 && <span className="h-px w-6 bg-line" />}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
          <div className="panel h-fit">
            <h3 className="mb-4 text-lg">Tu pedido</h3>
            <div className="space-y-3.5">
              {items.map((item) => (
                <div key={item.slug} className="flex items-center gap-3.5">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg text-xl"
                    style={{ background: "rgba(255,122,26,0.1)" }}
                  >
                    {item.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnail_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      item.category_icon ?? "🎨"
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-[14px]">{item.title}</h4>
                    <span className="text-[12px] text-ink-muted">
                      {item.quantity} × {formatPrice(item.price_cents)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/carrito" className="mt-4 inline-block text-[12.5px] text-gold-500 hover:underline">
              ← Editar carrito
            </Link>
          </div>

          <CheckoutForm items={items} defaults={defaults} paymentsEnabled={paymentsEnabled} />

          <div className="panel h-fit lg:sticky lg:top-24">
            <h3 className="mb-4 text-lg">Resumen</h3>
            <div className="flex justify-between py-2 text-[13.5px] text-ink-muted">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            {discountCents > 0 && (
              <div className="flex justify-between py-2 text-[13.5px] text-emerald-600">
                <span>Descuento</span>
                <span>−{formatPrice(discountCents)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-line pt-4 font-display text-lg font-extrabold">
              <span>Total</span>
              <span className="text-gold-500">{formatPrice(totalCents)}</span>
            </div>
            <p className="mt-4 text-[11.5px] leading-relaxed text-ink-muted">
              El IVA final se calcula según tu país de residencia en la pasarela de pago. Al continuar aceptas
              los{" "}
              <Link href="/legal/terminos" className="text-gold-500 hover:underline">
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

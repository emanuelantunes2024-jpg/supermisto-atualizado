"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CarritoPage() {
  const { items, subtotalCents, discountCents, totalCents, removeItem, setQuantity, clear } = useCart();

  return (
    <section className="py-14">
      <div className="container-shell">
        <div className="breadcrumb">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <span>Carrito</span>
        </div>

        <h1 className="mb-8 mt-3 text-[28px]">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="panel text-center">
            <p className="mb-4 text-ink-muted">Tu carrito está vacío.</p>
            <Link href="/plantillas" className="btn btn-gold">
              Explorar templates
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.slug} className="surface flex items-center gap-4 p-4">
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg text-2xl"
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
                    <Link href={`/plantillas/${item.slug}`} className="text-[15px] font-semibold hover:text-gold-500">
                      {item.title}
                    </Link>
                    <div className="mt-1 text-[13px] text-ink-muted">{formatPrice(item.price_cents)} c/u</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-muted hover:border-gold-500 hover:text-gold-500"
                      aria-label="Reducir cantidad"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-[14px]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-muted hover:border-gold-500 hover:text-gold-500"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                  <div className="w-24 shrink-0 text-right font-display font-bold text-gold-500">
                    {formatPrice(item.price_cents * item.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    aria-label="Quitar del carrito"
                    className="shrink-0 text-ink-muted hover:text-red-400"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                    </svg>
                  </button>
                </div>
              ))}

              <button onClick={clear} className="text-[12.5px] text-ink-muted hover:text-red-400">
                Vaciar carrito
              </button>
            </div>

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
              <Link href="/checkout" className="btn btn-gold btn-block btn-lg mt-6">
                Ir al pago →
              </Link>
              <Link href="/plantillas" className="mt-3 block text-center text-[12.5px] text-ink-muted hover:text-gold-500">
                Seguir explorando
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

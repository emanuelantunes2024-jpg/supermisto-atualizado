"use client";

import Image from "next/image";
import Link from "next/link";

import { CategoryIcon } from "@/components/templates/CategoryIcon";

import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { formatPriceShort } from "@/lib/format";
import { templateGradients } from "@/lib/seed-data";
import type { TemplateWithCategory } from "@/lib/types";

const FALLBACK_GRADIENT = "linear-gradient(160deg,#101522,#182238 55%,#0a0e18)";

interface TemplateCardProps {
  template: TemplateWithCategory;
  /** Muestra "pago único" bajo el precio (portada). */
  showPriceNote?: boolean;
  /** Las primeras tarjetas visibles cargan la imagen con prioridad. */
  priority?: boolean;
}

export function TemplateCard({ template, showPriceNote = false, priority = false }: TemplateCardProps) {
  const gradient = templateGradients[template.slug] ?? FALLBACK_GRADIENT;
  // Con demo lista, la miniatura entra directo en la demo navegable.
  const demoHref = template.preview_url
    ? `/plantillas/${template.slug}/demo`
    : `/plantillas/${template.slug}`;

  const { addItem, isInCart } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(template.slug);
  const inCart = isInCart(template.slug);

  return (
    <article className="surface flex flex-col overflow-hidden transition-all duration-[250ms] hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg">
      <Link
        href={demoHref}
        className="group relative flex h-[170px] items-end overflow-hidden p-[18px]"
        style={template.thumbnail_url ? undefined : { background: gradient }}
        aria-label={template.preview_url ? `Ver la demo de ${template.title}` : `Ver ${template.title}`}
      >
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggle(template.slug);
          }}
          aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          aria-pressed={favorite}
          className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0f1115] shadow-sm transition-transform hover:scale-105"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? "#ff7a1a" : "none"} stroke={favorite ? "#ff7a1a" : "currentColor"} strokeWidth="1.8">
            <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />
          </svg>
        </button>
        {template.thumbnail_url ? (
          <Image
            src={template.thumbnail_url}
            alt={`Vista del diseño de ${template.title}`}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 380px"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="pointer-events-none absolute -right-3 -top-3 text-gold-400 opacity-[0.14]">
            <CategoryIcon slug={template.category?.slug ?? ""} name={template.category?.name} size={140} />
          </span>
        )}

        {/* Velo inferior: mantiene legible la etiqueta de categoría sin apagar el diseño. */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background: template.thumbnail_url
              ? "linear-gradient(180deg,transparent 48%,rgba(4,8,16,0.78))"
              : "linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.65))",
          }}
        />

        {template.category && (
          <span className="relative z-10 rounded-[5px] bg-gold-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#1a1200]">
            {template.category.name}
          </span>
        )}

        {/* Aviso de demo navegable: aparece al pasar el ratón por la miniatura. */}
        {template.preview_url && (
          <span
            aria-hidden
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            <span className="rounded-[7px] bg-gold-500 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#1a1200]">
              Ver demo
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-[18px] pb-5">
        <h3 className="mb-1.5 text-[16.5px]">
          <Link href={`/plantillas/${template.slug}`} className="transition-colors hover:text-gold-400">
            {template.title}
          </Link>
        </h3>
        <p className="mb-3.5 flex-1 text-[13px] text-ink-muted">{template.short_description}</p>

        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-base font-extrabold text-gold-400">
            {formatPriceShort(template.price_cents)}
            {showPriceNote && <small className="ml-1 text-[11px] font-normal text-ink-muted">pago único</small>}
          </div>
          <span className="flex items-center gap-3">
            {template.preview_url && (
              <Link
                href={`/plantillas/${template.slug}/demo`}
                className="rounded-md border border-line px-2.5 py-1 text-[12px] font-semibold text-ink transition-colors hover:border-gold-500 hover:text-gold-400"
              >
                Ver demo
              </Link>
            )}
            <Link
              href={`/plantillas/${template.slug}`}
              className="border-b border-gold-500 pb-px text-[12.5px] font-semibold text-ink transition-colors hover:text-gold-400"
            >
              Ver detalle →
            </Link>
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            addItem({
              slug: template.slug,
              title: template.title,
              price_cents: template.price_cents,
              compare_at_price_cents: template.compare_at_price_cents,
              thumbnail_url: template.thumbnail_url,
              category_icon: template.category?.icon,
            })
          }
          className={`btn btn-block text-[12.5px] ${inCart ? "btn-ghost" : "btn-gold"}`}
        >
          {inCart ? "✓ En el carrito — añadir otra vez" : "Añadir al carrito"}
        </button>
      </div>
    </article>
  );
}

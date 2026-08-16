import Image from "next/image";
import Link from "next/link";

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
  const icon = template.category?.icon ?? "🎨";

  return (
    <article className="surface flex flex-col overflow-hidden transition-all duration-[250ms] hover:-translate-y-1 hover:border-gold-500 hover:shadow-lg">
      <Link
        href={`/plantillas/${template.slug}`}
        className="group relative flex h-[170px] items-end overflow-hidden p-[18px]"
        style={template.thumbnail_url ? undefined : { background: gradient }}
        aria-label={`Ver ${template.title}`}
      >
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
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2.5 -top-2.5 text-[120px] leading-none opacity-[0.16]"
          >
            {icon}
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
      </Link>

      <div className="flex flex-1 flex-col p-[18px] pb-5">
        <h3 className="mb-1.5 text-[16.5px]">
          <Link href={`/plantillas/${template.slug}`} className="transition-colors hover:text-gold-400">
            {template.title}
          </Link>
        </h3>
        <p className="mb-3.5 flex-1 text-[13px] text-ink-muted">{template.short_description}</p>

        <div className="flex items-center justify-between">
          <div className="font-display text-base font-extrabold text-gold-400">
            {formatPriceShort(template.price_cents)}
            {showPriceNote && <small className="ml-1 text-[11px] font-normal text-ink-muted">pago único</small>}
          </div>
          <Link
            href={`/plantillas/${template.slug}`}
            className="border-b border-gold-500 pb-px text-[12.5px] font-semibold text-ink transition-colors hover:text-gold-400"
          >
            Ver detalle →
          </Link>
        </div>
      </div>
    </article>
  );
}

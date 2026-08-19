import Link from "next/link";

import { CategoryIcon } from "@/components/templates/CategoryIcon";
import type { Category } from "@/lib/types";

/**
 * Franja de categorías bajo el hero: etiqueta + los ocho iconos de línea
 * dorados + "Ver todas", tal cual la referencia de marca.
 */
export function CategoryStrip({ categories }: { categories: Category[] }) {
  const shown = categories.slice(0, 8);
  if (shown.length === 0) return null;

  return (
    <section className="pb-10">
      <div className="container-shell">
        <div
          className="anim-in flex flex-wrap items-center justify-center gap-x-4 gap-y-6 rounded-[14px] border border-line px-7 py-5 lg:flex-nowrap lg:justify-between"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          <span className="shrink-0 text-[12.5px] font-bold uppercase leading-tight tracking-[0.03em] text-gold-400">
            Explora nuestras
            <br />
            categorías premium
          </span>

          {shown.map((category) => (
            <Link
              key={category.id}
              href={`/plantillas?cat=${category.slug}`}
              className="group flex min-w-[78px] flex-col items-center gap-2 px-1 text-center"
            >
              <span className="text-gold-400 transition-transform duration-200 group-hover:-translate-y-0.5">
                <CategoryIcon slug={category.slug} />
              </span>
              <span className="text-[11.5px] font-medium leading-tight text-ink transition-colors group-hover:text-gold-400">
                {category.name}
              </span>
            </Link>
          ))}

          <Link
            href="/plantillas"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.04em] text-ink transition-colors hover:border-gold-500 hover:text-gold-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Ver todas
          </Link>
        </div>
      </div>
    </section>
  );
}

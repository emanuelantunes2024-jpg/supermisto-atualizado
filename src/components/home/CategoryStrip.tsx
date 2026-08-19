import Link from "next/link";

import type { Category } from "@/lib/types";

/**
 * Franja horizontal de categorías bajo el hero (icono + nombre).
 * Muestra las primeras 8 y enlaza al catálogo completo.
 */
export function CategoryStrip({ categories }: { categories: Category[] }) {
  const shown = categories.slice(0, 8);

  return (
    <section className="pb-14 pt-2">
      <div className="container-shell">
        <div
          className="anim-in flex flex-wrap items-center justify-center gap-x-2 gap-y-4 rounded-[16px] border border-line px-5 py-5 sm:justify-between"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          {shown.map((category) => (
            <Link
              key={category.id}
              href={`/plantillas?cat=${category.slug}`}
              className="group flex min-w-[92px] flex-col items-center gap-2 px-2 text-center"
            >
              <span className="text-[26px] transition-transform duration-200 group-hover:-translate-y-0.5">
                {category.icon}
              </span>
              <span className="text-[12.5px] font-medium text-ink-muted transition-colors group-hover:text-gold-400">
                {category.name}
              </span>
            </Link>
          ))}

          <Link
            href="/plantillas"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-gold-500 px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-[0.03em] text-gold-400 transition-colors hover:bg-gold-500 hover:text-[#1a1200]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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

import Link from "next/link";

import type { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
  counts: Record<string, number>;
}

export function CategoryGrid({ categories, counts }: CategoryGridProps) {
  return (
    <section id="categorias" className="py-20">
      <div className="container-shell">
        <div className="section-head">
          <div className="eyebrow">Categorías</div>
          <h2>Elige el tipo de negocio</h2>
          <p>
            Cada plantilla está pensada para un rubro específico, con las secciones que ese negocio realmente
            necesita.
          </p>
        </div>

        <div
          className="anim-in flex flex-wrap items-center gap-3 rounded-[18px] border border-line p-4"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          {categories.map((category) => {
            const count = counts[category.slug] ?? 0;
            return (
              <Link
                key={category.id}
                href={`/plantillas?cat=${category.slug}`}
                className="group flex items-center gap-2.5 rounded-full border border-line bg-navy-800 px-4 py-2.5 transition-all duration-200 hover:-translate-y-[2px] hover:border-gold-500"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
                  style={{ background: "rgba(240,167,48,0.14)" }}
                >
                  {category.icon}
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-semibold leading-tight group-hover:text-gold-400">
                    {category.name}
                  </span>
                  <span className="text-[11px] leading-tight text-ink-muted">
                    {count === 1 ? "1 plantilla" : `${count} plantillas`}
                  </span>
                </span>
              </Link>
            );
          })}

          <Link
            href="/plantillas"
            className="flex items-center gap-2 rounded-full border border-gold-500 px-4 py-2.5 text-[13px] font-semibold text-gold-400 transition-colors hover:bg-gold-500 hover:text-[#1a1200]"
          >
            Ver todas →
          </Link>
        </div>
      </div>
    </section>
  );
}

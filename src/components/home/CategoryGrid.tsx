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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const count = counts[category.slug] ?? 0;
            return (
              <Link
                key={category.id}
                href={`/plantillas?cat=${category.slug}`}
                className="surface px-4 py-6 text-center transition-all duration-200 hover:-translate-y-[3px] hover:border-gold-500"
              >
                <span
                  className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-[10px] text-xl"
                  style={{ background: "rgba(231,166,60,0.12)" }}
                >
                  {category.icon}
                </span>
                <h4 className="mb-1 text-[13.5px] font-semibold">{category.name}</h4>
                <span className="text-[11.5px] text-ink-muted">
                  {count === 1 ? "1 plantilla" : `${count} plantillas`}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

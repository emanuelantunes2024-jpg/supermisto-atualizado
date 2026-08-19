import Link from "next/link";

import { CategoryIcon } from "@/components/templates/CategoryIcon";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  active?: string;
}

/**
 * Filtro del catálogo con el lenguaje visual de la marca: fichas con el
 * icono de línea dorado, la activa en dorado macizo. Sin emojis.
 */
export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  const tile = (isActive: boolean) =>
    `flex flex-col items-center justify-center gap-2 rounded-[12px] border px-3 py-4 text-center transition-all duration-200 ${
      isActive
        ? "border-gold-500 bg-gold-500 text-[#1a1200]"
        : "border-line text-ink hover:-translate-y-0.5 hover:border-gold-500 hover:text-gold-400"
    }`;

  return (
    <div className="mb-10 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
      <Link href="/plantillas" className={tile(!active)}>
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span className="text-[11.5px] font-semibold leading-tight">Todas</span>
      </Link>

      {categories.map((category) => (
        <Link key={category.id} href={`/plantillas?cat=${category.slug}`} className={tile(active === category.slug)}>
          <span className={active === category.slug ? "" : "text-gold-400"}>
            <CategoryIcon slug={category.slug} name={category.name} />
          </span>
          <span className="text-[11.5px] font-medium leading-tight">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

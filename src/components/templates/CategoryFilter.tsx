import Link from "next/link";

import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  active?: string;
}

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  const chip = (isActive: boolean) =>
    `inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] transition-colors ${
      isActive
        ? "border-gold-500 bg-gold-500 font-semibold text-navy-950"
        : "border-line text-ink-muted hover:border-gold-500 hover:text-gold-400"
    }`;

  return (
    <div className="mb-9 flex flex-wrap gap-2.5">
      <Link href="/plantillas" className={chip(!active)}>
        Todas
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/plantillas?cat=${category.slug}`}
          className={chip(active === category.slug)}
        >
          <span aria-hidden>{category.icon}</span>
          {category.name}
        </Link>
      ))}
    </div>
  );
}

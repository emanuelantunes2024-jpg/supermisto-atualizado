import Link from "next/link";

import { getCategories, getCategoryCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryCounts()]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Categorías ({categories.length})</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          Las categorías se gestionan directamente en Supabase (tabla <code>categories</code>). Aquí puedes ver
          cuántas plantillas publicadas tiene cada una.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="surface p-5">
            <div className="mb-2 text-2xl">{category.icon}</div>
            <h3 className="text-[15px]">{category.name}</h3>
            <p className="mt-1 text-[12.5px] text-ink-muted">/{category.slug}</p>
            <div className="mt-3 flex items-center justify-between text-[12.5px]">
              <span className="text-ink-muted">
                {counts[category.slug] ?? 0} publicadas
              </span>
              <Link href={`/plantillas?cat=${category.slug}`} className="text-gold-400 hover:underline">
                Ver en la tienda →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { CategoryCard } from "@/components/admin/CategoryCard";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategories, getCategoryCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const [categories, counts] = await Promise.all([getCategories(), getCategoryCounts()]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Categorías ({categories.length})</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          Crea aquí las categorías nuevas. Después, al crear una plantilla, ya aparecerán en el desplegable
          &quot;Categoría&quot;.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          No se pudo eliminar: {error}
          {error.toLowerCase().includes("foreign key") && (
            <> — tiene plantillas asociadas. Muévelas a otra categoría antes de borrarla.</>
          )}
        </p>
      )}

      <div className="panel max-w-2xl space-y-4">
        <h3 className="text-[15px]">Nueva categoría</h3>
        <CategoryForm />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} count={counts[category.slug] ?? 0} />
        ))}
      </div>
    </div>
  );
}

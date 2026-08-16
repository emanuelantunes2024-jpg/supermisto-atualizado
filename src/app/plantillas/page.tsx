import type { Metadata } from "next";
import Link from "next/link";

import { CategoryFilter } from "@/components/templates/CategoryFilter";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { getCategories, getPublishedTemplates } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Plantillas web profesionales",
  description:
    "Catálogo completo de plantillas web para barberías, cafeterías, restaurantes, tiendas y servicios. Pago único, descarga inmediata.",
  alternates: { canonical: "/plantillas" },
};

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const { cat } = await searchParams;

  const [categories, templates] = await Promise.all([getCategories(), getPublishedTemplates(cat)]);
  const activeCategory = categories.find((category) => category.slug === cat);

  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        {activeCategory ? (
          <>
            <Link href="/plantillas">Plantillas</Link>
            <span>/</span>
            <span>{activeCategory.name}</span>
          </>
        ) : (
          <span>Plantillas</span>
        )}
      </div>

      <section className="pb-20 pt-8">
        <div className="container-shell">
          <div className="section-head">
            <div className="eyebrow">Catálogo completo</div>
            <h2>
              {templates.length} {templates.length === 1 ? "plantilla" : "plantillas"}
              {activeCategory ? ` para ${activeCategory.name.toLowerCase()}` : " profesionales"}
            </h2>
            <p>
              Filtra por categoría y encuentra el diseño ideal para tu negocio. Todas incluyen versión móvil y son
              100% editables.
            </p>
          </div>

          <CategoryFilter categories={categories} active={cat} />

          {templates.length === 0 ? (
            <div className="panel text-center">
              <p className="mb-4 text-ink-muted">
                Todavía no hay plantillas publicadas en esta categoría. Estamos preparando nuevos diseños.
              </p>
              <Link href="/plantillas" className="btn btn-ghost">
                Ver todo el catálogo
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

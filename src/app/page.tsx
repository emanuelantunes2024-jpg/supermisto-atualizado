import Link from "next/link";

import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CtaBand } from "@/components/home/CtaBand";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsBand } from "@/components/home/StatsBand";
import { Testimonials } from "@/components/home/Testimonials";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { siteConfig } from "@/lib/config";
import { getCategories, getCategoryCounts, getPublishedTemplates } from "@/lib/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [templates, categories, counts] = await Promise.all([
    getPublishedTemplates(),
    getCategories(),
    getCategoryCounts(),
  ]);

  const featured = templates.slice(0, 6);
  const fromPriceCents = templates.length
    ? Math.min(...templates.map((template) => template.price_cents))
    : 9900;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
          }),
        }}
      />

      <Hero templateCount={templates.length} />
      <StatsBand templateCount={templates.length} />
      <CategoryGrid categories={categories} counts={counts} />

      <section id="destacadas" className="py-20">
        <div className="container-shell">
          <div className="section-head">
            <div className="eyebrow">Plantillas destacadas</div>
            <h2>Diseños listos para publicar hoy</h2>
            <p>
              Cada plantilla incluye todas las páginas del negocio, es 100% editable y funciona perfecto en móvil.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((template) => (
              <TemplateCard key={template.id} template={template} showPriceNote />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/plantillas" className="btn btn-ghost btn-lg">
              Ver el catálogo completo
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
      <CtaBand templateCount={templates.length} fromPriceCents={fromPriceCents} />
      <Testimonials />
    </>
  );
}

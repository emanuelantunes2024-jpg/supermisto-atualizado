import Link from "next/link";

import { BenefitsStrip } from "@/components/home/BenefitsStrip";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { Hero } from "@/components/home/Hero";
import { ProductPillars } from "@/components/home/ProductPillars";
import { StatsBand } from "@/components/home/StatsBand";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { siteConfig } from "@/lib/config";
import { getCategories, getPublishedTemplates } from "@/lib/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [templates, categories] = await Promise.all([getPublishedTemplates(), getCategories()]);

  const featured = templates.slice(0, 6);

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

      <Hero />
      <CategoryStrip categories={categories} />
      <ProductPillars templateCount={templates.length} />
      <BenefitsStrip />
      <StatsBand />

      {featured.length > 0 && (
        <section id="destacadas" className="pb-20">
          <div className="container-shell">
            <div className="section-head">
              <div className="eyebrow">Sitios web premium</div>
              <h2>Diseños listos para publicar hoy</h2>
              <p>
                Cada plantilla incluye todas las páginas del negocio, es 100% editable y funciona perfecto en
                móvil.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((template, index) => (
                <TemplateCard key={template.id} template={template} showPriceNote priority={index < 3} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/plantillas" className="btn btn-ghost btn-lg">
                Ver el catálogo completo
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

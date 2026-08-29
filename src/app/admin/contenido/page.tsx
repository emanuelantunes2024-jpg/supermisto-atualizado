import {
  BenefitsForm,
  FeaturedSelectionForm,
  HeroForm,
  NewsletterForm,
  WhyUsForm,
} from "@/components/admin/ContenidoForms";
import { getAllTemplates, getCategories, getHomepageContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminContenidoPage() {
  const [content, categories, templates] = await Promise.all([
    getHomepageContent(),
    getCategories(),
    getAllTemplates(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Contenido del sitio</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          Edita aquí la portada pública. Cada bloque se guarda por separado y se ve reflejado en el sitio en
          cuanto pulsas &quot;Guardar cambios&quot;.
        </p>
      </div>

      <HeroForm hero={content.hero} />
      <BenefitsForm benefits={content.benefits} />
      <FeaturedSelectionForm
        categories={categories}
        templates={templates.filter((t) => t.status === "published")}
        selectedCategories={content.featured_categories}
        selectedTemplates={content.featured_templates}
      />
      <WhyUsForm whyUs={content.why_us} />
      <NewsletterForm newsletter={content.newsletter} />
    </div>
  );
}

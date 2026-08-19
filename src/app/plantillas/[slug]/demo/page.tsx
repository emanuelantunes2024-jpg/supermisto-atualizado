import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DemoViewer } from "@/components/templates/DemoViewer";
import { formatPriceShort } from "@/lib/format";
import { getPublishedTemplates, getTemplateBySlug } from "@/lib/queries";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const templates = await getPublishedTemplates();
  return templates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) return { title: "Demo no encontrada" };

  return {
    title: `Demo de ${template.title}`,
    description: template.short_description,
    // La ficha es la página que se indexa; la demo es la misma plantilla.
    alternates: { canonical: `/plantillas/${template.slug}` },
    robots: { index: false, follow: true },
  };
}

/** Demo a pantalla completa con la barra de compra siempre visible. */
export default async function TemplateDemoPage({ params }: PageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) notFound();

  return (
    <DemoViewer
      slug={template.slug}
      title={template.title}
      categoryName={template.category?.name}
      priceLabel={formatPriceShort(template.price_cents)}
      src={template.preview_url}
    />
  );
}

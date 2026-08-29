import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DemoViewer } from "@/components/templates/DemoViewer";
import { formatPriceShort } from "@/lib/format";
import { getDemoParts } from "@/lib/demo-parts";
import { getPublishedTemplates, getTemplateBySlug } from "@/lib/queries";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ parte?: string }>;
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
export default async function TemplateDemoPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { parte } = await searchParams;
  const template = await getTemplateBySlug(slug);

  if (!template) notFound();

  const parts = getDemoParts(template.tags, template.slug);
  const initialIndex = parte ? Math.max(parts.findIndex((p) => p.src.includes(`/${parte}/`)), 0) : 0;

  return (
    <DemoViewer
      slug={template.slug}
      title={template.title}
      categoryName={template.category?.name}
      priceLabel={formatPriceShort(template.price_cents)}
      src={parts[initialIndex]?.src ?? template.preview_url}
      parts={parts}
      initialPartIndex={initialIndex}
      template={template}
    />
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/templates/AddToCartButton";
import { PreviewFrame } from "@/components/templates/PreviewFrame";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { siteConfig } from "@/lib/config";
import { getDemoParts } from "@/lib/demo-parts";
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

  if (!template) return { title: "Plantilla no encontrada" };

  return {
    title: template.title,
    description: template.short_description,
    alternates: { canonical: `/plantillas/${template.slug}` },
    openGraph: {
      type: "website",
      title: `${template.title} · ${siteConfig.name}`,
      description: template.short_description,
      url: `${siteConfig.url}/plantillas/${template.slug}`,
      ...(template.thumbnail_url ? { images: [template.thumbnail_url] } : {}),
    },
  };
}

const check = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0 text-gold-400">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) notFound();

  const demoParts = getDemoParts(template.tags, template.slug);

  const all = await getPublishedTemplates();
  const related = all
    .filter((item) => item.id !== template.id && item.category_id === template.category_id)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: template.title,
            description: template.short_description,
            category: template.category?.name,
            offers: {
              "@type": "Offer",
              price: (template.price_cents / 100).toFixed(2),
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `${siteConfig.url}/plantillas/${template.slug}`,
            },
          }),
        }}
      />

      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href="/plantillas">Plantillas</Link>
        <span>/</span>
        <span>{template.title}</span>
      </div>

      <section className="pb-16 pt-8">
        <div className="container-shell grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <PreviewFrame
              src={template.preview_url}
              title={template.title}
              slug={template.slug}
              thumbnail={template.thumbnail_url}
            />

            <div className="panel mt-6">
              <h2 className="mb-3 text-lg">Sobre esta plantilla</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                {template.full_description || template.short_description}
              </p>
            </div>
          </div>

          <aside className="panel lg:sticky lg:top-24">
            {template.category && <span className="badge-pill">{template.category.name}</span>}
            <h1 className="mt-3 text-[26px]">{template.title}</h1>
            <p className="mt-2 text-sm text-ink-muted">{template.short_description}</p>

            <ul className="my-6 space-y-2.5">
              {template.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-[13.5px]">
                  {check}
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-2.5">
              <div className="font-display text-[34px] font-extrabold text-gold-400">
                {formatPriceShort(template.price_cents)}
              </div>
              {Boolean(template.compare_at_price_cents && template.compare_at_price_cents > template.price_cents) && (
                <div className="text-[16px] text-ink-muted line-through">
                  {formatPriceShort(template.compare_at_price_cents!)}
                </div>
              )}
            </div>
            <div className="mb-5 text-[12.5px] text-ink-muted">
              Pago único · sin mensualidades · IVA incluido
            </div>

            <AddToCartButton template={template} goToCart className="btn btn-gold btn-block btn-lg" />
            {demoParts.length > 1 ? (
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                {demoParts.map((part) => (
                  <Link key={part.href} href={part.href} className="btn btn-ghost btn-block">
                    Ver demo{part.label === "Sistema PDV" ? " del PDV" : " del sitio"}
                  </Link>
                ))}
              </div>
            ) : (
              template.preview_url && (
                <Link href={`/plantillas/${template.slug}/demo`} className="btn btn-ghost btn-block mt-2.5">
                  Ver la demo completa
                </Link>
              )
            )}

            <div className="on-dark mt-6 rounded-xl border border-line bg-navy-900 p-4">
              <h5 className="mb-3 text-[12.5px] uppercase tracking-[0.06em] text-ink-muted">
                Qué incluye tu compra
              </h5>
              <ul className="space-y-2">
                {[
                  "Archivos completos (HTML/CSS/JS)",
                  "Guía de instalación paso a paso",
                  "Soporte técnico por 30 días",
                  "Descarga inmediata tras el pago",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[13px] text-ink-muted">
                    {check}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-[11.5px] leading-relaxed text-ink-muted">
              Al ser contenido digital de descarga inmediata, aceptas la ejecución del contrato al instante y
              renuncias al desistimiento una vez descargado el archivo. Consulta la{" "}
              <Link href="/legal/reembolsos" className="text-gold-400 hover:underline">
                política de reembolso
              </Link>
              .
            </p>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-20">
          <div className="container-shell">
            <div className="section-head">
              <div className="eyebrow">También te puede servir</div>
              <h2>Otras plantillas de {template.category?.name.toLowerCase() ?? "esta categoría"}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TemplateCard key={item.id} template={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

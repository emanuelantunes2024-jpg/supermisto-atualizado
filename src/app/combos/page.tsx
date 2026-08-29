import type { Metadata } from "next";
import Link from "next/link";

import { TemplateCard } from "@/components/templates/TemplateCard";
import { getPublishedTemplates } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Combos premium",
  description: "Sitio web + sistema PDV en un solo paquete, con mejor precio que comprados por separado.",
  alternates: { canonical: "/combos" },
};

export default async function CombosPage() {
  const templates = await getPublishedTemplates("combos");

  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>Combos</span>
      </div>

      <section className="pb-20 pt-8">
        <div className="container-shell">
          <div className="section-head">
            <div className="eyebrow">Ahorra comprando junto</div>
            <h2>Combos: sitio web + PDV</h2>
            <p>
              El sitio web de tu negocio y el sistema de punto de venta, en una sola compra y con descuento frente a
              comprarlos por separado.
            </p>
          </div>

          {templates.length === 0 ? (
            <div className="panel text-center">
              <p className="mb-4 text-ink-muted">Estamos preparando nuevos combos. Vuelve pronto.</p>
              <Link href="/contacto" className="btn btn-ghost">
                Avísenme cuando esté listo
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template, index) => (
                <TemplateCard key={template.id} template={template} priority={index < 3} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

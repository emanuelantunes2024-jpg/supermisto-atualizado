import type { Metadata } from "next";
import Link from "next/link";

import { TemplateCard } from "@/components/templates/TemplateCard";
import { getPublishedTemplates } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sistemas PDV",
  description: "Sistemas de punto de venta listos para tiendas, cafeterías y kioscos. Pago único, descarga inmediata.",
  alternates: { canonical: "/pdvs" },
};

export default async function PdvsPage() {
  const templates = await getPublishedTemplates("pdv");

  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>PDVs</span>
      </div>

      <section className="pb-20 pt-8">
        <div className="container-shell">
          <div className="section-head">
            <div className="eyebrow">Punto de venta</div>
            <h2>Sistemas PDV para tu mostrador</h2>
            <p>
              Interfaces de venta táctiles, listas para tablet o pantalla: catálogo, carrito y cobro en un solo
              lugar. Se personalizan igual que cualquier plantilla, sin conocimientos técnicos.
            </p>
          </div>

          {templates.length === 0 ? (
            <div className="panel text-center">
              <p className="mb-4 text-ink-muted">Estamos preparando nuevos sistemas PDV. Vuelve pronto.</p>
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

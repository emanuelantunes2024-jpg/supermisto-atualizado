import type { Metadata } from "next";
import Link from "next/link";

import { TemplateCard } from "@/components/templates/TemplateCard";
import { getPublishedTemplates } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sistemas PDV",
  description: "Sistemas de punto de venta listos para tiendas, talleres, concesionarias y restaurantes. Pago único, descarga inmediata.",
  alternates: { canonical: "/pdvs" },
};

/** Nombre visible de cada rubro — mismas palabras que usan las categorías del catálogo. */
const RUBRO_LABELS: Record<string, string> = {
  concesionaria: "Concesionaria",
  "taller-mecanico": "Taller mecánico",
  retail: "Tiendas / Retail",
  restaurante: "Restaurantes",
};

function rubroLabel(tag: string): string {
  return RUBRO_LABELS[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, " ");
}

interface PageProps {
  searchParams: Promise<{ rubro?: string }>;
}

export default async function PdvsPage({ searchParams }: PageProps) {
  const { rubro } = await searchParams;
  const todos = await getPublishedTemplates("pdv");

  // Rubros disponibles: cualquier tag de un PDV que no sea "pdv" en sí.
  const rubros = Array.from(new Set(todos.flatMap((t) => (t.tags ?? []).filter((tag) => tag !== "pdv")))).sort();

  const templates = rubro ? todos.filter((t) => (t.tags ?? []).includes(rubro)) : todos;

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
              Interfaces de venta listas para tablet o pantalla: catálogo, órdenes y cobro en un solo lugar. Se
              personalizan igual que cualquier plantilla, sin conocimientos técnicos.
            </p>
          </div>

          {rubros.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/pdvs"
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                  !rubro ? "border-gold-500 bg-gold-500 text-[#1a1200]" : "border-line text-ink hover:border-gold-500"
                }`}
              >
                Todos
              </Link>
              {rubros.map((tag) => (
                <Link
                  key={tag}
                  href={`/pdvs?rubro=${tag}`}
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                    rubro === tag ? "border-gold-500 bg-gold-500 text-[#1a1200]" : "border-line text-ink hover:border-gold-500"
                  }`}
                >
                  {rubroLabel(tag)}
                </Link>
              ))}
            </div>
          )}

          {templates.length === 0 ? (
            <div className="panel text-center">
              <p className="mb-4 text-ink-muted">Todavía no hay un PDV para este rubro. Estamos preparando más.</p>
              <Link href="/pdvs" className="btn btn-ghost">
                Ver todos los PDV
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

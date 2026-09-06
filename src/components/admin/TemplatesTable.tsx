"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { downloadTemplatePackage, duplicateTemplate, setTemplateStatus, toggleFeatured } from "@/app/admin/actions";
import { DeleteTemplateButton } from "@/components/admin/DeleteTemplateButton";
import { formatPrice } from "@/lib/format";
import type { TemplateStatus, TemplateWithCategory } from "@/lib/types";

const statusStyles: Record<TemplateStatus, string> = {
  published: "bg-emerald-500/15 text-emerald-300",
  draft: "bg-amber-500/15 text-amber-300",
  archived: "bg-navy-700 text-ink-muted",
};

const statusLabels: Record<TemplateStatus, string> = {
  published: "Publicada",
  draft: "Borrador",
  archived: "Archivada",
};

/** Quita acentos para que "espana" encuentre "España". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface TemplatesTableProps {
  templates: TemplateWithCategory[];
}

export function TemplatesTable({ templates }: TemplatesTableProps) {
  const [busqueda, setBusqueda] = useState("");

  const filtradas = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q) return templates;
    return templates.filter((t) => {
      const campos = [t.title, t.slug, t.category?.name ?? ""].map(normalizar);
      return campos.some((campo) => campo.includes(q));
    });
  }, [templates, busqueda]);

  return (
    <div className="panel overflow-x-auto">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por nombre, categoría o slug… (ej. inmobiliaria)"
            className="field-input"
            aria-label="Buscar plantilla"
          />
        </div>
        {busqueda && (
          <span className="text-[12.5px] text-ink-muted">
            {filtradas.length} de {templates.length}
          </span>
        )}
      </div>

      <table className="w-full min-w-[820px] text-left text-[13px]">
        <thead className="text-[12px] uppercase tracking-[0.05em] text-ink-muted">
          <tr className="border-b border-line">
            <th className="pb-3 pr-4 font-medium">Plantilla</th>
            <th className="pb-3 pr-4 font-medium">Categoría</th>
            <th className="pb-3 pr-4 font-medium">Precio</th>
            <th className="pb-3 pr-4 font-medium">Estado</th>
            <th className="pb-3 pr-4 font-medium">Paquete</th>
            <th className="pb-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((template) => (
            <tr key={template.id} className="border-b border-line/60 last:border-0">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-1.5 font-medium">
                  {template.featured && <span title="Destacada">⭐</span>}
                  {template.title}
                </div>
                <div className="text-[12px] text-ink-muted">/{template.slug}</div>
              </td>
              <td className="py-3 pr-4 text-ink-muted">{template.category?.name ?? "—"}</td>
              <td className="py-3 pr-4">{formatPrice(template.price_cents)}</td>
              <td className="py-3 pr-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${statusStyles[template.status]}`}
                >
                  {statusLabels[template.status]}
                </span>
              </td>
              <td className="py-3 pr-4">
                {template.file_url ? (
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-300">
                    Con paquete
                  </span>
                ) : (
                  <span className="rounded-full bg-navy-700 px-2.5 py-1 text-[11.5px] font-semibold text-ink-muted">
                    Sin paquete
                  </span>
                )}
              </td>
              <td className="py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={`/admin/plantillas/${template.id}`} className="text-gold-400 hover:underline">
                    Editar
                  </Link>

                  <form action={setTemplateStatus}>
                    <input type="hidden" name="id" value={template.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={template.status === "published" ? "archived" : "published"}
                    />
                    <button type="submit" className="text-ink-muted hover:text-gold-400">
                      {template.status === "published" ? "Archivar" : "Publicar"}
                    </button>
                  </form>

                  <form action={toggleFeatured}>
                    <input type="hidden" name="id" value={template.id} />
                    <input type="hidden" name="featured" value={template.featured ? "0" : "1"} />
                    <button type="submit" className="text-ink-muted hover:text-gold-400">
                      {template.featured ? "Quitar destacado" : "Destacar"}
                    </button>
                  </form>

                  <form action={duplicateTemplate}>
                    <input type="hidden" name="id" value={template.id} />
                    <button type="submit" className="text-ink-muted hover:text-gold-400">
                      Duplicar
                    </button>
                  </form>

                  {template.file_url && (
                    <form action={downloadTemplatePackage}>
                      <input type="hidden" name="id" value={template.id} />
                      <button type="submit" className="text-gold-400 hover:underline">
                        Descargar paquete
                      </button>
                    </form>
                  )}

                  <Link
                    href={`/plantillas/${template.slug}`}
                    target="_blank"
                    className="text-ink-muted hover:text-gold-400"
                  >
                    Ver
                  </Link>

                  <DeleteTemplateButton id={template.id} title={template.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {templates.length === 0 && (
        <p className="py-6 text-center text-[13.5px] text-ink-muted">
          Todavía no hay plantillas. Crea la primera con el botón de arriba.
        </p>
      )}

      {templates.length > 0 && filtradas.length === 0 && (
        <p className="py-6 text-center text-[13.5px] text-ink-muted">
          Ninguna plantilla coincide con &quot;{busqueda}&quot;.
        </p>
      )}
    </div>
  );
}

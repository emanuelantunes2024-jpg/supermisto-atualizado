import Link from "next/link";

import { downloadTemplatePackage, setTemplateStatus } from "@/app/admin/actions";
import { formatPrice } from "@/lib/format";
import { getAllTemplates } from "@/lib/queries";
import type { TemplateStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

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

export default async function AdminTemplatesPage() {
  const templates = await getAllTemplates();
  const conPaquete = templates.filter((t) => !!t.file_url).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl">Plantillas ({templates.length})</h2>
        <Link href="/admin/plantillas/nueva" className="btn btn-gold">
          + Nueva plantilla
        </Link>
      </div>

      <div className="panel space-y-2">
        <h3 className="text-[15px] font-semibold">📦 Bóveda de paquetes</h3>
        <p className="text-[13px] text-ink-muted">
          Esta zona es privada: solo la ve quien entra con tu cuenta de administrador. Aquí tienes, por
          categoría, el .zip final que subiste con &quot;Subir .zip&quot; en cada plantilla. Descárgalo cuando
          lo necesites &mdash;por ejemplo para subirlo también a Hotmart&mdash; sin depender de que hayas
          guardado la copia en tu ordenador.
        </p>
        <p className="text-[13px] font-medium">
          {conPaquete} de {templates.length} categorías tienen ya su paquete final subido.
        </p>
      </div>

      <div className="panel overflow-x-auto">
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
            {templates.map((template) => (
              <tr key={template.id} className="border-b border-line/60 last:border-0">
                <td className="py-3 pr-4">
                  <div className="font-medium">{template.title}</div>
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
      </div>
    </div>
  );
}

import Link from "next/link";

import { TemplatesTable } from "@/components/admin/TemplatesTable";
import { getAllTemplates } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ error?: string; eliminado?: string; guardado?: string; duplicado?: string }>;
}

export default async function AdminTemplatesPage({ searchParams }: PageProps) {
  const { error, eliminado, guardado, duplicado } = await searchParams;
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

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          No se pudo eliminar: {error}
          {error.toLowerCase().includes("foreign key") && (
            <> — probablemente tiene pedidos asociados. Archívala en vez de eliminarla, o bórrala primero de la tabla &quot;orders&quot; en Supabase.</>
          )}
        </p>
      )}
      {eliminado && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
          ✓ Plantilla eliminada.
        </p>
      )}
      {guardado && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
          ✓ Cambios guardados.
        </p>
      )}
      {duplicado && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
          ✓ Plantilla duplicada como borrador.
        </p>
      )}

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

      <TemplatesTable templates={templates} />
    </div>
  );
}

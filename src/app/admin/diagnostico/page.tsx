import { getAllTemplates } from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * Página de solo lectura para ver EXACTAMENTE lo que hay guardado en cada
 * plantilla (slug, estado, preview_url…) en texto plano, sin depender de
 * capturas de pantalla ni de traducciones del navegador. Protegida por el
 * layout de /admin (requireAdmin ya se aplica ahí a todas las subrutas).
 */
export default async function DiagnosticoPage() {
  const templates = await getAllTemplates();

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Diagnóstico — datos reales guardados</h2>
      <p className="text-[13px] text-ink-muted">
        Esto es exactamente lo que hay en la base de datos ahora mismo, sin adivinar. Copia y pega el bloque de la
        plantilla que te interese.
      </p>

      <div className="space-y-4">
        {templates.map((t) => (
          <div key={t.id} className="panel space-y-1 font-mono text-[12.5px]">
            <div className="mb-2 text-[14px] font-sans font-semibold text-gold-400">{t.title}</div>
            <div>id: {t.id}</div>
            <div>slug: {t.slug}</div>
            <div>
              status:{" "}
              <span className={t.status === "published" ? "text-emerald-300" : "text-amber-300"}>{t.status}</span>
            </div>
            <div className="break-all">preview_url: {t.preview_url ? t.preview_url : <em className="text-red-400">(vacío)</em>}</div>
            <div className="break-all">thumbnail_url: {t.thumbnail_url ? t.thumbnail_url : <em className="text-red-400">(vacío)</em>}</div>
            <div className="break-all">file_url: {t.file_url ? t.file_url : <em className="text-red-400">(vacío)</em>}</div>
            <div>categoría: {t.category?.name ?? "—"} ({t.category?.slug ?? "—"})</div>
          </div>
        ))}
      </div>

      {templates.length === 0 && <p className="text-[13.5px] text-ink-muted">No hay ninguna plantilla creada todavía.</p>}
    </div>
  );
}

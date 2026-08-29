import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracionPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Configuración del sitio</h2>
        <p className="mt-1 text-[13px] text-ink-muted">
          Estos datos se usan en todo el sitio: cabecera, pie de página, botones de contacto y metadatos.
        </p>
      </div>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}

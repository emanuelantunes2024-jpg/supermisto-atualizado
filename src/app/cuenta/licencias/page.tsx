import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getMyLicenses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LicenciasPage() {
  const { user } = await getSession();
  const licenses = user ? await getMyLicenses(user.id) : [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Licencias</h2>
      <p className="text-[13.5px] text-ink-muted">
        Cada plantilla comprada tiene una licencia de uso permanente, sin mensualidades.
      </p>

      {licenses.length === 0 ? (
        <div className="panel text-center text-ink-muted">
          Todavía no tienes licencias emitidas. Aparecerán aquí automáticamente después de tu primera compra.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {licenses.map((license) => (
            <div key={license.id} className="surface p-5">
              <h3 className="text-[15px] font-semibold">{license.template?.title ?? "Plantilla"}</h3>
              <p className="mt-1 text-[12px] text-ink-muted">Emitida el {formatDate(license.created_at ?? "")}</p>
              <div className="mt-3 rounded-lg border border-line bg-[color:var(--field-bg)] px-3 py-2 font-mono text-[12.5px]">
                {license.license_key}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

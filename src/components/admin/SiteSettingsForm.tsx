"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveSiteSettings, type ActionState } from "@/app/admin/actions";
import { UploadField } from "@/components/admin/UploadField";
import type { SiteSettings } from "@/lib/types";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold btn-lg">
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveSiteSettings, {});
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");
  const [faviconUrl, setFaviconUrl] = useState(settings.favicon_url ?? "");

  return (
    <form action={formAction} className="space-y-6">
      <div className="panel space-y-4">
        <h3 className="text-[15px] font-semibold">Empresa</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Nombre de la empresa</label>
            <input name="company_name" defaultValue={settings.company_name} className="field-input" />
          </div>
          <div>
            <label className="field-label">Email de contacto</label>
            <input name="email" type="email" defaultValue={settings.email ?? ""} className="field-input" />
          </div>
          <div>
            <label className="field-label">Teléfono</label>
            <input name="phone" defaultValue={settings.phone ?? ""} className="field-input" />
          </div>
          <div>
            <label className="field-label">WhatsApp (con código de país, sin +)</label>
            <input name="whatsapp" defaultValue={settings.whatsapp ?? ""} placeholder="34600123456" className="field-input" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Dirección</label>
            <input name="address" defaultValue={settings.address ?? ""} className="field-input" />
          </div>
        </div>
      </div>

      <div className="panel space-y-4">
        <h3 className="text-[15px] font-semibold">Marca</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Logo</label>
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="mb-2 h-10 rounded border border-line bg-white/5 object-contain p-1" />
            )}
            <input type="hidden" name="logo_url" value={logoUrl} />
            <UploadField slug="marca" label={logoUrl ? "Cambiar logo" : "Subir logo"} onUploaded={setLogoUrl} />
          </div>
          <div>
            <label className="field-label">Favicon</label>
            {faviconUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={faviconUrl} alt="" className="mb-2 h-8 w-8 rounded border border-line object-contain" />
            )}
            <input type="hidden" name="favicon_url" value={faviconUrl} />
            <UploadField slug="marca" label={faviconUrl ? "Cambiar favicon" : "Subir favicon"} onUploaded={setFaviconUrl} />
          </div>
        </div>
      </div>

      <div className="panel space-y-4">
        <h3 className="text-[15px] font-semibold">Redes sociales</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["facebook", "instagram", "twitter", "youtube"] as const).map((key) => (
            <div key={key}>
              <label className="field-label capitalize">{key}</label>
              <input
                name={`social_${key}`}
                defaultValue={settings.social?.[key] ?? ""}
                placeholder={`https://${key}.com/tu-marca`}
                className="field-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="panel space-y-4">
        <h3 className="text-[15px] font-semibold">Regional y pie de página</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Moneda</label>
            <select name="currency" defaultValue={settings.currency} className="field-input">
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="BRL">BRL (R$)</option>
            </select>
          </div>
          <div>
            <label className="field-label">Idioma</label>
            <select name="language" defaultValue={settings.language} className="field-input">
              <option value="es">Español</option>
              <option value="pt">Português</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        <div>
          <label className="field-label">Texto del pie de página</label>
          <textarea
            name="footer_text"
            defaultValue={settings.footer_text ?? ""}
            rows={2}
            className="field-input resize-y"
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
          {state.success}
        </p>
      )}

      <SaveButton />
    </form>
  );
}

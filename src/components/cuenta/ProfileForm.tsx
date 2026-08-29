"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateProfile, type ActionState } from "@/app/cuenta/actions";
import { countries } from "@/lib/config";
import type { Customer } from "@/lib/types";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold">
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export function ProfileForm({ customer, email }: { customer: Customer | null; email: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateProfile, {});

  return (
    <form action={formAction} className="panel max-w-xl space-y-4">
      <div>
        <label className="field-label">Correo electrónico</label>
        <input value={email} disabled className="field-input opacity-70" />
        <p className="mt-1.5 text-[11.5px] text-ink-muted">El correo no se puede cambiar aquí.</p>
      </div>
      <div>
        <label className="field-label" htmlFor="full_name">
          Nombre completo
        </label>
        <input
          id="full_name"
          name="full_name"
          defaultValue={customer?.full_name ?? ""}
          className="field-input"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="phone">
            Teléfono
          </label>
          <input id="phone" name="phone" defaultValue={customer?.phone ?? ""} className="field-input" />
        </div>
        <div>
          <label className="field-label" htmlFor="country">
            País
          </label>
          <select id="country" name="country" defaultValue={customer?.country ?? ""} className="field-input">
            <option value="">Selecciona…</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.error && <p className="text-[13px] text-red-500">{state.error}</p>}
      {state.success && <p className="text-[13px] text-emerald-600">{state.success}</p>}

      <SaveButton />
    </form>
  );
}

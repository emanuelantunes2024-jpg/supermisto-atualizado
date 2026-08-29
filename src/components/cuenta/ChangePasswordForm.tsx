"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updatePassword, type ActionState } from "@/app/cuenta/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-gold">
      {pending ? "Guardando…" : "Cambiar contraseña"}
    </button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(updatePassword, {});

  return (
    <form action={formAction} className="panel max-w-xl space-y-4">
      <div>
        <h3 className="text-base font-semibold">Contraseña</h3>
        <p className="mt-1 text-[13px] text-ink-muted">
          Define una contraseña que solo tú conozcas. Se aplica de inmediato.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="password">
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password_confirm">
            Confirmar contraseña
          </label>
          <input
            id="password_confirm"
            name="password_confirm"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            className="field-input"
          />
        </div>
      </div>

      {state.error && <p className="text-[13px] text-red-500">{state.error}</p>}
      {state.success && <p className="text-[13px] text-emerald-600">{state.success}</p>}

      <SaveButton />
    </form>
  );
}

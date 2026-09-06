"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * Formulario de "elige tu nueva contraseña", para cuando ya hay una sesión
 * de recuperación activa (el usuario llegó desde el enlace del email).
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const confirm = String(formData.get("confirm"));

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      if (updateError.message.toLowerCase().includes("password should be")) {
        setError("La contraseña debe tener al menos 8 caracteres.");
      } else {
        setError("El enlace ha caducado o ya se usó. Pide uno nuevo desde \"Recuperar contraseña\".");
      }
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/cuenta/perfil");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <div className="panel">
        <h1 className="mb-1.5 text-2xl">Contraseña actualizada</h1>
        <p className="text-[13.5px] text-ink-muted">Ya puedes entrar con tu nueva contraseña. Te llevamos a tu cuenta…</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h1 className="mb-1.5 text-2xl">Elige tu nueva contraseña</h1>
      <p className="mb-6 text-[13.5px] text-ink-muted">Escribe la contraseña que quieres usar a partir de ahora.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="field-label" htmlFor="password">
            Contraseña nueva
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            className="field-input"
          />
        </div>

        <div className="mb-5">
          <label className="field-label" htmlFor="confirm">
            Repite la contraseña
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repite la contraseña"
            className="field-input"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn btn-gold btn-block btn-lg">
          {loading ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
}

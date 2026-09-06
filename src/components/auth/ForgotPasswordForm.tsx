"use client";

import Link from "next/link";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

/** Pide el email y envía el enlace de recuperación de contraseña de Supabase. */
export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const email = String(new FormData(event.currentTarget).get("email"));
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/restablecer")}`,
    });

    setLoading(false);

    // No revelamos si el email existe o no: siempre mostramos el mismo
    // mensaje de éxito, salvo un error real (p. ej. límite de envíos).
    if (resetError && !resetError.message.toLowerCase().includes("rate limit")) {
      setSent(true);
      return;
    }
    if (resetError) {
      setError("Demasiados intentos. Espera unos minutos e inténtalo de nuevo.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="panel">
      <h1 className="mb-1.5 text-2xl">Recuperar contraseña</h1>
      <p className="mb-6 text-[13.5px] text-ink-muted">
        Escribe el email de tu cuenta y te enviamos un enlace para elegir una contraseña nueva.
      </p>

      {sent ? (
        <p className="mb-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
          Si ese email tiene una cuenta, te hemos enviado un enlace para restablecer la contraseña. Revisa tu
          bandeja de entrada (y la carpeta de spam).
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="field-label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              className="field-input"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-gold btn-block btn-lg">
            {loading ? "Enviando…" : "Enviar enlace de recuperación"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-[13px] text-ink-muted">
        <Link href="/entrar" className="text-gold-400 hover:underline">
          Volver a entrar
        </Link>
      </p>
    </div>
  );
}

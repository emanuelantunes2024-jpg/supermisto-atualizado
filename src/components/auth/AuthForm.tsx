"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "register";
  redirectTo: string;
}

export function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isRegister = mode === "register";

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading("email");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const fullName = String(formData.get("fullName") ?? "");

    const supabase = createClient();

    if (isRegister) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signUpError) {
        setError(translateAuthError(signUpError.message));
        setLoading(null);
        return;
      }

      setNotice(
        "Cuenta creada. Si tu proyecto exige confirmación por email, revisa tu bandeja de entrada para activarla.",
      );
      setLoading(null);
      router.refresh();
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(translateAuthError(signInError.message));
      setLoading(null);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleGoogle() {
    setError(null);
    setLoading("google");

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (oauthError) {
      setError("No hemos podido conectar con Google. Inténtalo de nuevo.");
      setLoading(null);
    }
  }

  return (
    <div className="panel">
      <h1 className="mb-1.5 text-2xl">{isRegister ? "Crear cuenta" : "Entrar en tu cuenta"}</h1>
      <p className="mb-6 text-[13.5px] text-ink-muted">
        {isRegister
          ? "Crea tu cuenta para gestionar tus compras y descargar tus plantillas cuando quieras."
          : "Accede para ver tus compras y volver a descargar tus plantillas."}
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading !== null}
        className="btn btn-ghost btn-block"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"
          />
          <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 010-4.22V7.05H2.18a11 11 0 000 9.9l3.66-2.84z" />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"
          />
        </svg>
        {loading === "google" ? "Conectando…" : "Continuar con Google"}
      </button>

      <div className="my-5 flex items-center gap-3 text-[12px] text-ink-muted">
        <span className="h-px flex-1 bg-[rgba(255,255,255,0.09)]" />o con tu email
        <span className="h-px flex-1 bg-[rgba(255,255,255,0.09)]" />
      </div>

      <form onSubmit={handleEmailSubmit}>
        {isRegister && (
          <div className="mb-4">
            <label className="field-label" htmlFor="fullName">
              Nombre completo
            </label>
            <input id="fullName" name="fullName" required placeholder="Tu nombre" className="field-input" />
          </div>
        )}

        <div className="mb-4">
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

        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="field-label !mb-0" htmlFor="password">
              Contraseña
            </label>
            {!isRegister && (
              <Link href="/recuperar" className="text-[12.5px] text-gold-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="Mínimo 8 caracteres"
            className="field-input"
          />
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            {error}
          </p>
        )}
        {notice && (
          <p className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
            {notice}
          </p>
        )}

        <button type="submit" disabled={loading !== null} className="btn btn-gold btn-block btn-lg">
          {loading === "email" ? "Un momento…" : isRegister ? "Crear mi cuenta" : "Entrar"}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-muted">
        {isRegister ? (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/entrar" className="text-gold-400 hover:underline">
              Entrar
            </Link>
          </>
        ) : (
          <>
            ¿Aún no tienes cuenta?{" "}
            <Link href="/registro" className="text-gold-400 hover:underline">
              Crear una gratis
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

/** Mensajes de Supabase Auth traducidos al español. */
function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) return "Email o contraseña incorrectos.";
  if (normalized.includes("email not confirmed")) return "Confirma tu email antes de entrar.";
  if (normalized.includes("user already registered")) return "Ya existe una cuenta con este email.";
  if (normalized.includes("password should be")) return "La contraseña debe tener al menos 8 caracteres.";
  if (normalized.includes("rate limit")) return "Demasiados intentos. Espera unos minutos.";

  return "No hemos podido completar la operación. Inténtalo de nuevo.";
}

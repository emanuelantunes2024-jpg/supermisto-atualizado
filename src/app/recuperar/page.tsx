import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default function RecuperarPage() {
  return (
    <section className="py-16">
      <div className="container-shell max-w-[460px]">
        {isSupabaseConfigured ? (
          <ForgotPasswordForm />
        ) : (
          <div className="panel text-center">
            <h1 className="mb-3 text-2xl">Autenticación no configurada</h1>
            <p className="text-[14px] text-ink-muted">
              Añade las claves de Supabase en <code>.env.local</code> para activar la recuperación de contraseña.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

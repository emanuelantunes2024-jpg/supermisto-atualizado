import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false, follow: false },
};

export default async function RestablecerPage() {
  if (isSupabaseConfigured) {
    // El enlace del email pasa por /auth/callback, que ya deja una sesión
    // activa antes de traer al usuario aquí. Si alguien abre esta URL sin
    // esa sesión (enlace caducado, o entró directo), lo mandamos a pedir uno
    // nuevo en vez de mostrar un formulario que solo va a fallar.
    const { user } = await getSession();
    if (!user) redirect("/recuperar");
  }

  return (
    <section className="py-16">
      <div className="container-shell max-w-[460px]">
        {isSupabaseConfigured ? (
          <ResetPasswordForm />
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

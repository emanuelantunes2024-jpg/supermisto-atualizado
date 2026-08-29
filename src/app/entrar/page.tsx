import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/AuthForm";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { redirect: redirectParam } = await searchParams;
  // Solo rutas internas, para evitar redirecciones abiertas.
  const redirectTo = redirectParam?.startsWith("/") ? redirectParam : "/cuenta/perfil";

  if (isSupabaseConfigured) {
    const { user } = await getSession();
    if (user) redirect(redirectTo);
  }

  return (
    <section className="py-16">
      <div className="container-shell max-w-[460px]">
        {isSupabaseConfigured ? (
          <AuthForm mode="login" redirectTo={redirectTo} />
        ) : (
          <div className="panel text-center">
            <h1 className="mb-3 text-2xl">Autenticación no configurada</h1>
            <p className="text-[14px] text-ink-muted">
              Añade las claves de Supabase en <code>.env.local</code> para activar el registro y el acceso de
              clientes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

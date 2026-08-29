import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/cuenta/perfil", label: "Mi perfil", icon: "👤" },
  { href: "/cuenta/compras", label: "Mis compras", icon: "🧾" },
  { href: "/cuenta/templates", label: "Mis templates", icon: "🎨" },
  { href: "/cuenta/descargas", label: "Descargas", icon: "⬇️" },
  { href: "/cuenta/licencias", label: "Licencias", icon: "📜" },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: "❤️" },
  { href: "/cuenta/soporte", label: "Soporte", icon: "💬" },
];

export default async function CuentaLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <section className="py-20">
        <div className="container-shell max-w-[680px]">
          <div className="panel text-center">
            <h1 className="mb-3 text-2xl">Área de cliente</h1>
            <p className="text-[14px] text-ink-muted">
              El área de cliente necesita Supabase configurado. Añade <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en <code>.env.local</code>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { user, customer } = await getSession();
  if (!user) redirect("/entrar?redirect=/cuenta/perfil");

  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Área de cliente</div>
            <h1 className="text-[28px]">Hola{customer?.full_name ? `, ${customer.full_name}` : ""}</h1>
          </div>
          <form action="/auth/salir" method="post">
            <button type="submit" className="btn btn-ghost">
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex flex-wrap gap-2 lg:flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg border border-line px-4 py-2.5 text-[13.5px] text-ink-muted transition-colors hover:border-gold-500 hover:text-gold-500"
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

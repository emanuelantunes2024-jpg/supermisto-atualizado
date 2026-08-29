import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/plantillas", label: "Plantillas", icon: "🎨" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "🧾" },
  { href: "/admin/categorias", label: "Categorías", icon: "🏷️" },
  { href: "/admin/contenido", label: "Contenido del sitio", icon: "🏠" },
  { href: "/admin/testimonios", label: "Testimonios", icon: "💬" },
  { href: "/admin/configuracion", label: "Configuración", icon: "⚙️" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <div className="panel">
          <h1 className="mb-3 text-2xl">Panel no disponible</h1>
          <p className="text-[14px] text-ink-muted">
            El panel de administración necesita Supabase. Añade las claves en <code>.env.local</code> y ejecuta
            las migraciones de <code>supabase/migrations</code>.
          </p>
        </div>
      </AdminShell>
    );
  }

  const session = await requireAdmin();

  if (!session) {
    return (
      <AdminShell>
        <div className="panel">
          <h1 className="mb-3 text-2xl">Acceso restringido</h1>
          <p className="mb-4 text-[14px] text-ink-muted">
            Esta zona es solo para administradores. Entra con una cuenta cuyo email esté en{" "}
            <code>ADMIN_EMAILS</code> o que tenga <code>role = &apos;admin&apos;</code> en la tabla{" "}
            <code>customers</code>.
          </p>
          <Link href="/entrar?redirect=/admin" className="btn btn-gold">
            Entrar con otra cuenta
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <div className="on-dark min-h-screen" style={{ background: "var(--page-bg)" }}>
    <div className="container-shell py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Administración</div>
          <h1 className="text-[26px]">Leuname Software</h1>
        </div>
        <div className="flex items-center gap-3 text-[13px] text-ink-muted">
          <span>{session.user?.email}</span>
          <form action="/auth/salir" method="post">
            <button type="submit" className="btn btn-ghost">
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-2 lg:flex-col">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg border border-line px-4 py-2.5 text-[13.5px] text-ink-muted transition-colors hover:border-gold-500 hover:text-gold-400"
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13.5px] text-ink-muted transition-colors hover:text-gold-400"
          >
            <span aria-hidden>↩</span> Ver la tienda
          </Link>
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="on-dark min-h-screen" style={{ background: "var(--page-bg)" }}>
      <div className="container-shell max-w-[680px] py-20">{children}</div>
    </div>
  );
}

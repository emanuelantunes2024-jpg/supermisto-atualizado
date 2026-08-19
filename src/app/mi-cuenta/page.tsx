import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";
import { formatDate, formatPrice } from "@/lib/format";
import { getMyOrders } from "@/lib/queries";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mis compras",
  robots: { index: false, follow: false },
};

const statusLabels: Record<OrderStatus, { label: string; className: string }> = {
  paid: { label: "Pagado", className: "bg-emerald-500/15 text-emerald-300" },
  pending: { label: "Pendiente", className: "bg-amber-500/15 text-amber-300" },
  refunded: { label: "Reembolsado", className: "bg-sky-500/15 text-sky-300" },
  failed: { label: "Fallido", className: "bg-red-500/15 text-red-300" },
};

export default async function MyAccountPage() {
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
  if (!user) redirect("/entrar?redirect=/mi-cuenta");

  const orders = await getMyOrders(user.id);
  const paidOrders = orders.filter((order) => order.status === "paid");

  return (
    <section className="py-14">
      <div className="container-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Área de cliente</div>
            <h1 className="text-[30px]">Mis compras</h1>
            <p className="mt-1.5 text-[14px] text-ink-muted">
              Hola{customer?.full_name ? `, ${customer.full_name}` : ""} — aquí tienes tus plantillas y sus
              descargas.
            </p>
          </div>
          <form action="/auth/salir" method="post">
            <button type="submit" className="btn btn-ghost">
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Plantillas compradas" value={String(paidOrders.length)} />
          <StatCard
            label="Total invertido"
            value={formatPrice(paidOrders.reduce((sum, order) => sum + order.amount_cents, 0))}
          />
          <StatCard label="Soporte" value="30 días por compra" />
        </div>

        {orders.length === 0 ? (
          <div className="panel text-center">
            <p className="mb-4 text-ink-muted">Todavía no has comprado ninguna plantilla.</p>
            <Link href="/plantillas" className="btn btn-gold">
              Explorar el catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusLabels[order.status];
              return (
                <article key={order.id} className="panel flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-2xl"
                      style={{ background: "rgba(240,167,48,0.12)" }}
                    >
                      {order.template?.category?.icon ?? "🎨"}
                    </span>
                    <div>
                      <h3 className="text-[16px]">{order.template?.title ?? "Plantilla"}</h3>
                      <p className="mt-0.5 text-[12.5px] text-ink-muted">
                        {formatDate(order.created_at)} · {formatPrice(order.amount_cents)} · Pedido{" "}
                        {order.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                    {order.status === "paid" ? (
                      <a href={`/api/descargar/${order.download_token}`} className="btn btn-gold">
                        Descargar
                      </a>
                    ) : (
                      <span className="text-[12.5px] text-ink-muted">Descarga no disponible</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-[13px] text-ink-muted">
          ¿Algún problema con una descarga?{" "}
          <Link href="/contacto" className="text-gold-400 hover:underline">
            Escríbenos
          </Link>{" "}
          y lo resolvemos.
        </p>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-5">
      <div className="font-display text-[22px] font-extrabold text-gold-400">{value}</div>
      <div className="mt-1 text-[12.5px] text-ink-muted">{label}</div>
    </div>
  );
}

import Link from "next/link";

import { formatDate, formatPrice } from "@/lib/format";
import { getMyOrders } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusLabels: Record<OrderStatus, { label: string; className: string }> = {
  paid: { label: "Pagado", className: "bg-emerald-500/15 text-emerald-600" },
  pending: { label: "Pendiente", className: "bg-amber-500/15 text-amber-600" },
  refunded: { label: "Reembolsado", className: "bg-sky-500/15 text-sky-600" },
  failed: { label: "Fallido", className: "bg-red-500/15 text-red-600" },
};

export default async function ComprasPage() {
  const { user } = await getSession();
  const orders = user ? await getMyOrders(user.id) : [];
  const paidOrders = orders.filter((order) => order.status === "paid");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl">Mis compras</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pedidos pagados" value={String(paidOrders.length)} />
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
            const lines =
              order.items && order.items.length > 0
                ? order.items.map((item) => item.title_snapshot)
                : [order.template?.title ?? "Plantilla"];

            return (
              <article key={order.id} className="panel flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-[15px]">{lines.join(", ")}</h3>
                  <p className="mt-0.5 text-[12.5px] text-ink-muted">
                    {formatDate(order.created_at)} · {formatPrice(order.amount_cents)} · Pedido{" "}
                    {order.id.slice(0, 8)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${status.className}`}>
                  {status.label}
                </span>
              </article>
            );
          })}
        </div>
      )}

      <p className="text-[13px] text-ink-muted">
        ¿Algún problema con una descarga?{" "}
        <Link href="/cuenta/soporte" className="text-gold-500 hover:underline">
          Escríbenos
        </Link>{" "}
        y lo resolvemos.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-5">
      <div className="font-display text-[22px] font-extrabold text-gold-500">{value}</div>
      <div className="mt-1 text-[12.5px] text-ink-muted">{label}</div>
    </div>
  );
}

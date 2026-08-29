import Link from "next/link";

import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatDate, formatPrice } from "@/lib/format";
import { getAllOrders, getDashboardStats, getRecentDownloadsCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, orders, recentDownloads] = await Promise.all([
    getDashboardStats(),
    getAllOrders(),
    getRecentDownloadsCount(),
  ]);
  const recent = orders.slice(0, 8);

  const cards = [
    { label: "Ventas totales", value: formatPrice(stats.totalRevenueCents), hint: `${stats.paidOrders} pedidos pagados` },
    {
      label: "Este mes",
      value: formatPrice(stats.revenueThisMonthCents),
      hint: `${stats.ordersThisMonth} ${stats.ordersThisMonth === 1 ? "pedido" : "pedidos"}`,
    },
    { label: "Clientes", value: String(stats.totalCustomers), hint: "cuentas registradas" },
    { label: "Plantillas publicadas", value: String(stats.publishedTemplates), hint: "visibles en la tienda" },
    { label: "Descargas (7 días)", value: String(recentDownloads), hint: "descargas recientes" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="surface p-5">
            <div className="text-[12px] uppercase tracking-[0.06em] text-ink-muted">{card.label}</div>
            <div className="mt-2 truncate font-display text-[22px] font-extrabold text-gold-400" title={card.value}>
              {card.value}
            </div>
            <div className="mt-1 text-[12px] text-ink-muted">{card.hint}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2 className="mb-4 text-lg">Templates más vendidos</h2>
        {stats.topSellers.length === 0 ? (
          <p className="text-[13.5px] text-ink-muted">Todavía no hay ventas.</p>
        ) : (
          <ol className="space-y-2.5">
            {stats.topSellers.map((seller, index) => (
              <li key={seller.title} className="flex items-center justify-between text-[13.5px]">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-700 text-[11.5px] text-ink-muted">
                    {index + 1}
                  </span>
                  {seller.title}
                </span>
                <span className="text-ink-muted">{seller.count} ventas</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="panel">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-[13px] text-gold-400 hover:underline">
            Ver todos →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-[13.5px] text-ink-muted">
            Aún no hay pedidos. Cuando llegue la primera venta aparecerá aquí automáticamente.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead className="text-[12px] uppercase tracking-[0.05em] text-ink-muted">
                <tr className="border-b border-line">
                  <th className="pb-3 pr-4 font-medium">Fecha</th>
                  <th className="pb-3 pr-4 font-medium">Plantilla</th>
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Importe</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id} className="border-b border-line/60 last:border-0">
                    <td className="py-3 pr-4 text-ink-muted">{formatDate(order.created_at)}</td>
                    <td className="py-3 pr-4">{order.template?.title ?? "—"}</td>
                    <td className="py-3 pr-4 text-ink-muted">{order.buyer_email}</td>
                    <td className="py-3 pr-4">{formatPrice(order.amount_cents)}</td>
                    <td className="py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h2 className="mb-3 text-lg">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/plantillas/nueva" className="btn btn-gold">
            + Nueva plantilla
          </Link>
          <Link href="/admin/plantillas" className="btn btn-ghost">
            Gestionar catálogo
          </Link>
          <Link href="/admin/pedidos" className="btn btn-ghost">
            Ver pedidos
          </Link>
          <Link href="/admin/contenido" className="btn btn-ghost">
            Editar portada
          </Link>
        </div>
      </div>
    </div>
  );
}

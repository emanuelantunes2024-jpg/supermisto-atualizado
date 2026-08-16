import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getAllOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  const paid = orders.filter((order) => order.status === "paid");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl">Pedidos ({orders.length})</h2>
        <span className="text-[13px] text-ink-muted">
          Facturado: <strong className="text-gold-400">
            {formatPrice(paid.reduce((sum, order) => sum + order.amount_cents, 0))}
          </strong>
        </span>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="text-[12px] uppercase tracking-[0.05em] text-ink-muted">
            <tr className="border-b border-line">
              <th className="pb-3 pr-4 font-medium">Fecha</th>
              <th className="pb-3 pr-4 font-medium">Plantilla</th>
              <th className="pb-3 pr-4 font-medium">Cliente</th>
              <th className="pb-3 pr-4 font-medium">País</th>
              <th className="pb-3 pr-4 font-medium">Importe</th>
              <th className="pb-3 pr-4 font-medium">Estado</th>
              <th className="pb-3 font-medium">Stripe</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line/60 last:border-0">
                <td className="py-3 pr-4 whitespace-nowrap text-ink-muted">{formatDateTime(order.created_at)}</td>
                <td className="py-3 pr-4">{order.template?.title ?? "—"}</td>
                <td className="py-3 pr-4">
                  <div>{order.buyer_name ?? "—"}</div>
                  <div className="text-[12px] text-ink-muted">{order.buyer_email}</div>
                </td>
                <td className="py-3 pr-4 text-ink-muted">{order.buyer_country ?? "—"}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{formatPrice(order.amount_cents)}</td>
                <td className="py-3 pr-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-3 font-mono text-[11.5px] text-ink-muted">
                  {order.stripe_payment_intent_id?.slice(0, 18) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="py-6 text-center text-[13.5px] text-ink-muted">
            Todavía no hay pedidos registrados.
          </p>
        )}
      </div>
    </div>
  );
}

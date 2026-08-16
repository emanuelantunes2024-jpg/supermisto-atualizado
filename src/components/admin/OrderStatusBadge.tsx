import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-300",
  pending: "bg-amber-500/15 text-amber-300",
  refunded: "bg-sky-500/15 text-sky-300",
  failed: "bg-red-500/15 text-red-300",
};

const labels: Record<OrderStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  refunded: "Reembolsado",
  failed: "Fallido",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

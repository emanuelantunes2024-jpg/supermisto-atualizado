import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getMyOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DescargasPage() {
  const { user } = await getSession();
  const orders = user ? await getMyOrders(user.id) : [];
  const paid = orders.filter((o) => o.status === "paid");

  const rows = paid.flatMap((order) => {
    const items =
      order.items && order.items.length > 0
        ? order.items.map((item) => ({ title: item.title_snapshot, templateId: item.template_id }))
        : order.template_id
          ? [{ title: order.template?.title ?? "Plantilla", templateId: order.template_id }]
          : [];

    return items.map((item) => ({
      ...item,
      date: order.created_at,
      downloadToken: order.download_token,
    }));
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Descargas</h2>
      <p className="text-[13.5px] text-ink-muted">
        El enlace de descarga es siempre el mismo y no caduca mientras el pedido siga pagado.
      </p>

      {rows.length === 0 ? (
        <div className="panel text-center text-ink-muted">Todavía no tienes archivos para descargar.</div>
      ) : (
        <div className="panel overflow-x-auto p-0">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead className="text-[12px] uppercase tracking-[0.05em] text-ink-muted">
              <tr className="border-b border-line">
                <th className="px-5 py-3 font-medium">Plantilla</th>
                <th className="px-5 py-3 font-medium">Comprado</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.templateId}-${index}`} className="border-b border-line/60 last:border-0">
                  <td className="px-5 py-3">{row.title}</td>
                  <td className="px-5 py-3 text-ink-muted">{formatDate(row.date)}</td>
                  <td className="px-5 py-3 text-right">
                    <a
                      href={`/api/descargar/${row.downloadToken}?template=${row.templateId}`}
                      className="btn btn-gold text-[12px]"
                    >
                      Descargar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

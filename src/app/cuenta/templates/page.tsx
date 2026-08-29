import Link from "next/link";

import { getSession } from "@/lib/auth";
import { getMyOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Cada plantilla pagada, sea cual sea el pedido en el que llegó. */
export default async function MisTemplatesPage() {
  const { user } = await getSession();
  const orders = user ? await getMyOrders(user.id) : [];
  const paid = orders.filter((o) => o.status === "paid");

  const purchases = paid.flatMap((order) => {
    if (order.items && order.items.length > 0) {
      return order.items.map((item) => ({
        key: item.id,
        title: item.title_snapshot,
        templateId: item.template_id,
        slug: item.template?.slug,
        icon: item.template?.category?.icon,
        downloadToken: order.download_token,
      }));
    }
    if (order.template_id) {
      return [
        {
          key: order.id,
          title: order.template?.title ?? "Plantilla",
          templateId: order.template_id,
          slug: order.template?.slug,
          icon: order.template?.category?.icon,
          downloadToken: order.download_token,
        },
      ];
    }
    return [];
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Mis templates</h2>

      {purchases.length === 0 ? (
        <div className="panel text-center">
          <p className="mb-4 text-ink-muted">Todavía no tienes ninguna plantilla comprada.</p>
          <Link href="/plantillas" className="btn btn-gold">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((item) => (
            <div key={item.key} className="surface flex flex-col gap-3 p-5">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg text-xl"
                style={{ background: "rgba(255,122,26,0.1)" }}
              >
                {item.icon ?? "🎨"}
              </span>
              <h3 className="text-[15px] font-semibold">{item.title}</h3>
              <div className="mt-auto flex gap-3 text-[12.5px]">
                {item.slug && (
                  <Link href={`/plantillas/${item.slug}`} className="text-ink-muted hover:text-gold-500">
                    Ver ficha
                  </Link>
                )}
                <a
                  href={`/api/descargar/${item.downloadToken}?template=${item.templateId}`}
                  className="font-semibold text-gold-500 hover:underline"
                >
                  Descargar →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sistemas PDV",
  description: "Sistemas de punto de venta para todos los rubros de tu negocio — en desarrollo.",
  alternates: { canonical: "/pdvs" },
};

export default function PdvsPage() {
  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>PDVs</span>
      </div>

      <section className="pb-24 pt-10">
        <div className="container-shell max-w-[640px] text-center">
          <span className="badge-pill mb-4">En desarrollo</span>
          <h1 className="mb-4 text-[clamp(28px,4vw,40px)]">Sistemas PDV, muy pronto</h1>
          <p className="mb-8 text-[16px] text-ink-muted">
            Estamos construyendo sistemas de punto de venta modernos para cada tipo de negocio: ventas rápidas,
            gestión de stock, reportes y multi-dispositivo. Todavía no están a la venta, pero puedes dejarnos tu
            contacto para avisarte en cuanto estén listos.
          </p>
          <Link href="/contacto" className="btn btn-gold btn-lg">
            Avísenme cuando esté listo
          </Link>
        </div>
      </section>
    </>
  );
}

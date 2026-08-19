import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Combos premium",
  description: "Sitio web + sistema PDV en un solo paquete, con mejor precio — en desarrollo.",
  alternates: { canonical: "/combos" },
};

export default function CombosPage() {
  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>Combos</span>
      </div>

      <section className="pb-24 pt-10">
        <div className="container-shell max-w-[640px] text-center">
          <span className="badge-pill mb-4">En desarrollo</span>
          <h1 className="mb-4 text-[clamp(28px,4vw,40px)]">Combos premium, muy pronto</h1>
          <p className="mb-8 text-[16px] text-ink-muted">
            Estamos preparando los paquetes que juntan tu sitio web y tu sistema PDV en una sola compra: mejor
            precio, todo integrado, instalación incluida y soporte prioritario. Déjanos tu contacto y te avisamos
            en cuanto estén disponibles.
          </p>
          <Link href="/contacto" className="btn btn-gold btn-lg">
            Avísenme cuando esté listo
          </Link>
        </div>
      </section>
    </>
  );
}

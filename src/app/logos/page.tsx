import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diseño de Logos",
  description: "Diseño de logos profesionales a medida para tu negocio — muy pronto.",
  alternates: { canonical: "/logos" },
};

export default function LogosPage() {
  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>Diseño de Logos</span>
      </div>

      <section className="pb-24 pt-10">
        <div className="container-shell max-w-[640px] text-center">
          <span className="badge-pill mb-4">Muy pronto</span>
          <h1 className="mb-4 text-[clamp(28px,4vw,40px)]">Diseño de logos, muy pronto</h1>
          <p className="mb-8 text-[16px] text-ink-muted">
            Estamos preparando un servicio de diseño de logos profesionales, a medida para tu negocio, para
            complementar tu sitio web o tu PDV. Todavía no está a la venta, pero puedes dejarnos tu contacto para
            avisarte en cuanto esté listo.
          </p>
          <Link href="/contacto" className="btn btn-gold btn-lg">
            Avísenme cuando esté listo
          </Link>
        </div>
      </section>
    </>
  );
}

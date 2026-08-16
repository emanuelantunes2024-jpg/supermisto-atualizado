import Link from "next/link";

interface LegalPageProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

/** Envoltorio común de las páginas legales. */
export function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  return (
    <>
      <div className="container-shell breadcrumb">
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span>{title}</span>
      </div>

      <section className="pb-20 pt-8">
        <div className="container-shell max-w-[820px]">
          <h1 className="mb-2 text-[32px]">{title}</h1>
          <p className="mb-8 text-[12.5px] text-ink-muted">Última actualización: {updatedAt}</p>

          <div className="legal-body space-y-6 text-[14.5px] leading-relaxed text-ink-muted">{children}</div>

          <p className="mt-10 text-[13px] text-ink-muted">
            ¿Dudas sobre este documento?{" "}
            <Link href="/contacto" className="text-gold-400 hover:underline">
              Contáctanos
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

/** Sección con título — mantiene consistente la jerarquía en los legales. */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-[19px] text-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

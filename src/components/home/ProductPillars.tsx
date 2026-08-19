import Link from "next/link";

interface ProductPillarsProps {
  templateCount: number;
}

/**
 * Los tres pilares del catálogo. Sitios web está a la venta; PDVs y Combos
 * llevan la estructura lista pero marcada "Próximamente", sin botón de compra:
 * el producto todavía no existe y no se puede ofrecer.
 */
export function ProductPillars({ templateCount }: ProductPillarsProps) {
  return (
    <section id="servicios" className="pb-12">
      <div className="container-shell grid gap-5 lg:grid-cols-3">
        {/* Sitios web premium */}
        <article
          className="group relative flex flex-col overflow-hidden rounded-[16px] border border-line p-7 transition-all duration-200 hover:-translate-y-1 hover:border-gold-500"
          style={{ background: "linear-gradient(150deg,#111c2c,#0b0e14 72%)" }}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-2 text-[20px] uppercase leading-none">Sitios web premium</h3>
              <p className="text-[13px] text-ink-muted">
                Diseños profesionales, responsivos y optimizados para convertir visitantes en clientes.
              </p>
            </div>
            <BrowserMock accent="#3f83f8" label="Inmobiliaria" />
          </div>

          <ul className="mb-6 space-y-2 text-[13px]">
            {["100% personalizables", "Listos para usar", "SEO optimizado", "Soporte incluido"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-gold-400">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <Link href="/plantillas" className="btn btn-gold btn-block mt-auto uppercase tracking-[0.04em]">
            Ver sitios {templateCount > 0 && `(${templateCount})`} →
          </Link>
        </article>

        {/* Sistemas PDV */}
        <article
          className="relative flex flex-col overflow-hidden rounded-[16px] border border-line p-7"
          style={{ background: "linear-gradient(150deg,#0f2018,#0b0e14 72%)" }}
        >
          <span className="absolute right-6 top-7 rounded-full border border-line bg-navy-900/80 px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
            Próximamente
          </span>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="max-w-[62%]">
              <h3 className="mb-2 text-[20px] uppercase leading-none text-ink/75">Sistemas PDV</h3>
              <p className="text-[13px] text-ink-muted/80">
                Puntos de venta modernos y fáciles de usar para gestionar tu negocio de forma eficiente.
              </p>
            </div>
          </div>

          <ul className="mb-6 space-y-2 text-[13px] text-ink-muted/80">
            {["Ventas rápidas", "Gestión de stock", "Reportes completos", "Multi-dispositivo"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-gold-400/50">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mb-6 overflow-hidden rounded-lg border border-line opacity-55">
            <div className="grid grid-cols-4 gap-1.5 p-3" style={{ background: "var(--navy-900)" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="aspect-square rounded border border-line bg-navy-800" />
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-line px-3 py-2">
              <span className="text-[8px] text-ink-muted/60">TOTAL</span>
              <span className="rounded bg-gold-500/20 px-2 py-1 text-[8px] font-bold text-gold-400/70">COBRAR</span>
            </div>
          </div>

          <Link href="/pdvs" className="btn btn-ghost btn-block mt-auto uppercase tracking-[0.04em]">
            Avisarme →
          </Link>
        </article>

        {/* Combos */}
        <article
          className="relative flex flex-col overflow-hidden rounded-[16px] border border-line p-7"
          style={{ background: "linear-gradient(150deg,#1a1226,#0b0e14 72%)" }}
        >
          <span className="absolute right-6 top-7 rounded-full border border-line bg-navy-900/80 px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
            Próximamente
          </span>
          <div className="mb-5 max-w-[62%]">
            <h3 className="mb-2 text-[20px] uppercase leading-none text-ink/75">Combos premium</h3>
            <p className="text-[13px] text-ink-muted/80">
              Obtén tu sitio web + PDV y ahorra dinero con nuestros paquetes especiales.
            </p>
          </div>

          <ul className="mb-6 space-y-2 text-[13px] text-ink-muted/80">
            {["Mejor precio", "Todo integrado", "Instalación incluida", "Soporte prioritario"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-gold-400/50">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mb-6 flex items-center justify-center gap-4 rounded-lg border border-line px-4 py-7 opacity-55">
            <span className="rounded border border-line bg-navy-800 px-4 py-5 text-[9px] text-ink-muted">Sitio</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-navy-800 font-display text-lg font-extrabold text-gold-400/70">
              +
            </span>
            <span className="rounded border border-line bg-navy-800 px-4 py-5 text-[9px] text-ink-muted">PDV</span>
          </div>

          <Link href="/pdvs" className="btn btn-ghost btn-block mt-auto uppercase tracking-[0.04em]">
            Avisarme →
          </Link>
        </article>
      </div>
    </section>
  );
}

function BrowserMock({ accent, label }: { accent: string; label: string }) {
  return (
    <div className="hidden w-[38%] shrink-0 overflow-hidden rounded-md border border-line sm:block">
      <div className="flex gap-1 bg-navy-700 px-2 py-1.5">
        {[0, 1, 2].map((d) => (
          <span key={d} className="h-[4px] w-[4px] rounded-full bg-[#3a3a42]" />
        ))}
      </div>
      <div className="px-2.5 py-3" style={{ background: "linear-gradient(150deg,#152033,#0b0e14)" }}>
        <div className="mb-1 text-[6px] uppercase tracking-[0.14em]" style={{ color: accent }}>
          {label}
        </div>
        <div className="mb-2 h-[4px] w-3/4 rounded-full bg-white/25" />
        <div className="mb-2.5 h-[3px] w-1/2 rounded-full bg-white/12" />
        <span className="inline-block rounded px-2 py-1 text-[5.5px] font-bold text-[#1a1200]" style={{ background: "var(--gold-500)" }}>
          BUSCAR
        </span>
      </div>
    </div>
  );
}

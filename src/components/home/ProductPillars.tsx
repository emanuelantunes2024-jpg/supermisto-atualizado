import Link from "next/link";

/**
 * Los tres pilares del catálogo: sitios web (a la venta hoy), PDV y combos
 * (estructura lista, producto todavía no disponible → marcados "Pronto"
 * y sin botón de compra, para no ofrecer algo que no se puede comprar).
 */
export function ProductPillars({ templateCount }: { templateCount: number }) {
  return (
    <section id="servicios" className="py-16">
      <div className="container-shell">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Sitios web premium — disponible */}
          <article
            className="relative flex flex-col overflow-hidden rounded-[16px] border border-line p-7 transition-all duration-200 hover:-translate-y-1 hover:border-gold-500"
            style={{ background: "linear-gradient(150deg,#131a24,#0d0f12 70%)" }}
          >
            <h3 className="mb-2.5 text-[21px] uppercase">Sitios web premium</h3>
            <p className="mb-5 text-[13.5px] text-ink-muted">
              Diseños profesionales, responsivos y optimizados para convertir visitantes en clientes.
            </p>
            <ul className="mb-6 space-y-2 text-[13px]">
              {["100% personalizables", "Listos para usar", "SEO optimizado", "Soporte incluido"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-gold-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mb-6 mt-auto overflow-hidden rounded-lg border border-line">
              <div className="flex gap-1 bg-navy-700 px-2.5 py-2">
                {[0, 1, 2].map((dot) => (
                  <span key={dot} className="h-[5px] w-[5px] rounded-full bg-[#3a3a42]" />
                ))}
              </div>
              <div className="px-4 py-4" style={{ background: "linear-gradient(150deg,#151d2b,#0d0f12)" }}>
                <div className="mb-1.5 text-[8px] uppercase tracking-[0.16em] text-gold-400">Inmobiliaria</div>
                <div className="mb-2 font-display text-[15px] font-extrabold leading-tight">
                  Tu próxima <span className="text-gold-400">casa te espera</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="rounded bg-navy-800 px-2 py-1 text-[8px] text-ink-muted">Comprar</span>
                  <span className="rounded bg-navy-800 px-2 py-1 text-[8px] text-ink-muted">Alquilar</span>
                  <span className="rounded bg-gold-500 px-2 py-1 text-[8px] font-bold text-[#1a1200]">Buscar</span>
                </div>
              </div>
            </div>

            <Link href="/plantillas" className="btn btn-gold btn-block uppercase tracking-[0.03em]">
              Ver los {templateCount} sitios →
            </Link>
          </article>

          {/* Sistemas PDV — próximamente */}
          <article
            className="relative flex flex-col overflow-hidden rounded-[16px] border border-line p-7"
            style={{ background: "linear-gradient(150deg,#12211a,#0d0f12 70%)" }}
          >
            <span className="absolute right-5 top-6 rounded-full border border-line bg-navy-900/80 px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
              Próximamente
            </span>
            <h3 className="mb-2.5 text-[21px] uppercase text-ink/70">Sistemas PDV</h3>
            <p className="mb-5 text-[13.5px] text-ink-muted/80">
              Puntos de venta modernos y fáciles de usar para gestionar tu negocio de forma eficiente.
            </p>
            <ul className="mb-6 space-y-2 text-[13px] text-ink-muted/80">
              {["Ventas rápidas", "Gestión de stock", "Reportes completos", "Multi-dispositivo"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-gold-400/50">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mb-6 mt-auto overflow-hidden rounded-lg border border-line opacity-55">
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-gold-400/70">PDV</span>
                <span className="text-[8px] text-ink-muted/60">Caja 01</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-3" style={{ background: "var(--navy-900)" }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <span key={index} className="aspect-square rounded border border-line bg-navy-800" />
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-line px-3 py-2">
                <span className="text-[8px] text-ink-muted/60">Total</span>
                <span className="rounded bg-gold-500/20 px-2 py-1 text-[8px] font-bold text-gold-400/70">Cobrar</span>
              </div>
            </div>

            <span className="btn btn-ghost btn-block cursor-default uppercase tracking-[0.03em] opacity-55">
              En desarrollo
            </span>
          </article>

          {/* Combos — próximamente (dependen del PDV) */}
          <article
            className="relative flex flex-col overflow-hidden rounded-[16px] border border-line p-7"
            style={{ background: "linear-gradient(150deg,#1c1526,#0d0f12 70%)" }}
          >
            <span className="absolute right-5 top-6 rounded-full border border-line bg-navy-900/80 px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
              Próximamente
            </span>
            <h3 className="mb-2.5 text-[21px] uppercase text-ink/70">Combos premium</h3>
            <p className="mb-5 text-[13.5px] text-ink-muted/80">
              Sitio web + PDV en un solo paquete, con mejor precio que comprándolos por separado.
            </p>
            <ul className="mb-6 space-y-2 text-[13px] text-ink-muted/80">
              {["Mejor precio", "Todo integrado", "Instalación incluida", "Soporte prioritario"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-gold-400/50">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mb-6 mt-auto flex items-center justify-center gap-3 rounded-lg border border-line px-4 py-6 opacity-55">
              <span className="rounded border border-line bg-navy-800 px-3 py-4 text-[9px] text-ink-muted">Sitio</span>
              <span className="font-display text-xl font-extrabold text-gold-400/70">+</span>
              <span className="rounded border border-line bg-navy-800 px-3 py-4 text-[9px] text-ink-muted">PDV</span>
            </div>

            <span className="btn btn-ghost btn-block cursor-default uppercase tracking-[0.03em] opacity-55">
              En desarrollo
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}

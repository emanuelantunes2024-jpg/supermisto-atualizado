import Link from "next/link";

interface HeroProps {
  categoryCount: number;
}

export function Hero({ categoryCount }: HeroProps) {
  const highlights = [
    {
      icon: (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      ),
      title: `${categoryCount}+`,
      lines: ["Categorías", "Premium"],
    },
    {
      icon: (
        <>
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </>
      ),
      title: "PDVs",
      lines: ["para cada", "tipo de negocio"],
      soon: true,
    },
    {
      icon: (
        <>
          <rect x="3" y="9" width="18" height="12" rx="1.5" />
          <path d="M3 13h18M12 9v12" />
          <path d="M12 9S9.5 4 7.5 5.2 8.6 9 12 9zM12 9s2.5-5 4.5-3.8S15.4 9 12 9z" />
        </>
      ),
      title: "Combos",
      lines: ["Ahorra", "comprando juntos"],
      soon: true,
    },
  ];

  return (
    <section className="relative overflow-hidden pb-14 pt-16">
      <div
        className="pointer-events-none absolute inset-x-[-15%] top-[-30%] h-[700px]"
        style={{ background: "radial-gradient(circle at 28% 30%,rgba(240,167,48,0.16),transparent 60%)" }}
      />

      <div className="container-shell relative z-10 grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="anim-in">
          <h1 className="mb-5 text-[clamp(30px,3.9vw,48px)] uppercase leading-[1.08]">
            Todo lo que tu negocio
            <br />
            necesita, <span className="text-gold-400">en un solo lugar</span>
          </h1>
          <p className="mb-9 max-w-[470px] text-[15.5px] text-ink-muted">
            Sitios web premium, sistemas PDV y soluciones completas para llevar tu negocio al siguiente nivel.
          </p>

          <div className="mb-9 flex flex-wrap gap-x-9 gap-y-6">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`mt-0.5 shrink-0 ${item.soon ? "text-gold-400/45" : "text-gold-400"}`}
                >
                  {item.icon}
                </svg>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-display text-[19px] font-extrabold leading-tight ${
                        item.soon ? "text-ink/50" : "text-gold-400"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.soon && (
                      <span className="rounded-full border border-line px-1.5 py-px text-[9px] font-semibold text-ink-muted/70">
                        Pronto
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[12.5px] leading-tight ${item.soon ? "text-ink-muted/55" : "text-ink-muted"}`}
                  >
                    {item.lines[0]}
                    <br />
                    {item.lines[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3.5">
            <Link href="/plantillas" className="btn btn-gold btn-lg uppercase tracking-[0.04em]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Ver categorías
            </Link>
            <Link href="/#servicios" className="btn btn-ghost btn-lg uppercase tracking-[0.04em]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.6 13.4L11 3.8V3H4v7h.8l9.6 9.6a1.5 1.5 0 0 0 2.1 0l4.1-4.1a1.5 1.5 0 0 0 0-2.1z" />
                <circle cx="7.5" cy="6.5" r="1" />
              </svg>
              Ver combos
            </Link>
          </div>
        </div>

        <DeviceComposition />
      </div>
    </section>
  );
}

/**
 * Composición portátil + tablet + móvil de la portada.
 * El portátil y el móvil muestran diseños de sitio web (lo que se vende);
 * la tablet reserva el hueco del PDV, marcado como "Pronto".
 */
function DeviceComposition() {
  return (
    <div className="anim-in relative min-h-[330px] pb-4 pt-2 sm:min-h-[380px]" style={{ animationDelay: ".2s" }}>
      {/* Arcos dorados del fondo */}
      <div
        className="pointer-events-none absolute right-[-14%] top-[-16%] h-[420px] w-[420px] animate-pulseGlow rounded-full"
        style={{
          background: "conic-gradient(from 200deg,transparent 0deg,rgba(240,167,48,.5) 60deg,transparent 150deg)",
          maskImage: "radial-gradient(circle,transparent 62%,#000 63%,#000 70%,transparent 71%)",
          WebkitMaskImage: "radial-gradient(circle,transparent 62%,#000 63%,#000 70%,transparent 71%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-[-6%] bottom-[6%] top-[-4%] blur-[16px]"
        style={{ background: "radial-gradient(ellipse at 55% 50%,rgba(240,167,48,0.2),transparent 65%)" }}
      />

      {/* Portátil — sitio web premium */}
      <div className="relative z-10 w-[72%] animate-floatY">
        <div className="overflow-hidden rounded-t-[11px] border-[8px] border-b-0 border-[#1b1b1f] bg-[#050506] shadow-lg">
          <div className="flex items-center gap-1.5 bg-navy-700 px-3 py-2">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-[6px] w-[6px] rounded-full bg-[#3a3a42]" />
            ))}
            <span className="ml-2 flex gap-2.5 text-[6.5px] uppercase tracking-[0.1em] text-ink-muted/60">
              <i className="not-italic">Menú</i>
              <i className="not-italic">Reservas</i>
              <i className="not-italic">Galería</i>
              <i className="not-italic">Contacto</i>
            </span>
          </div>
          <div
            className="min-h-[196px] px-5 py-5"
            style={{ background: "linear-gradient(160deg,#1a1410,#241a12 55%,#0d0a07)" }}
          >
            <div className="mb-2 font-display text-[21px] font-extrabold uppercase leading-[1.04] text-[#f5efe3]">
              Restaurante
              <br />
              <span className="text-gold-400">Premium</span>
            </div>
            <p className="mb-4 max-w-[190px] text-[10.5px] leading-snug text-[#c7bda6]">
              Sitio web completo para tu restaurante: carta, reservas y eventos.
            </p>
            <span className="inline-block rounded bg-gold-500 px-3.5 py-2 text-[9.5px] font-bold text-[#1a1200]">
              VER DEMO
            </span>
          </div>
        </div>
        <div
          className="h-[8px]"
          style={{
            background: "linear-gradient(180deg,#141416,#0a0a0b)",
            clipPath: "polygon(6% 0,94% 0,100% 100%,0 100%)",
          }}
        />
        <div className="relative h-3 rounded-b-[8px]" style={{ background: "linear-gradient(180deg,#202329,#0d0f12)" }}>
          <span className="absolute left-1/2 top-0 h-[4px] w-[52px] -translate-x-1/2 rounded-b bg-[#0a0a0b]" />
        </div>
      </div>

      {/* Tablet — hueco reservado para el PDV */}
      <div
        className="absolute right-[13%] top-[13%] z-20 hidden w-[36%] animate-floatY sm:block"
        style={{ animationDelay: ".35s" }}
      >
        <div className="overflow-hidden rounded-[9px] border-[6px] border-[#1b1b1f] bg-[#0d0f12] shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
            <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-gold-400">Venta actual</span>
            <span className="rounded-full border border-line px-1.5 py-px text-[6px] font-semibold text-ink-muted/70">
              Pronto
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-2.5">
            {["Bebidas", "Entradas", "Platos", "Postres", "Extras", "Menús", "Cafés", "Copas", "Otros"].map(
              (label, i) => (
                <span
                  key={label}
                  className="flex aspect-[4/3] items-center justify-center rounded border border-line bg-navy-800 text-[5.5px] text-ink-muted/70"
                  style={{ opacity: 0.45 + (i % 3) * 0.14 }}
                >
                  {label}
                </span>
              ),
            )}
          </div>
          <div className="flex items-center justify-between border-t border-line px-2.5 py-1.5">
            <span className="text-[7px] text-ink-muted/60">TOTAL</span>
            <span className="rounded bg-gold-500/25 px-2 py-1 text-[7px] font-bold text-gold-400">PAGAR</span>
          </div>
        </div>
      </div>

      {/* Móvil — otro sitio web del catálogo */}
      <div
        className="absolute -bottom-1 right-0 z-30 hidden w-[17.5%] min-w-[86px] animate-floatY overflow-hidden rounded-[16px] border-[5px] border-[#1b1b1f] bg-[#050506] shadow-lg sm:block"
        style={{ animationDelay: ".5s" }}
      >
        <div
          className="flex aspect-[9/17] flex-col justify-end px-2.5 pb-3"
          style={{ background: "linear-gradient(165deg,#241a1e,#0c0a08)" }}
        >
          <div className="mb-1 font-display text-[11px] font-extrabold uppercase leading-[1.05] text-[#f5efe3]">
            Moda
            <br />
            <span className="text-gold-400">Premium</span>
          </div>
          <p className="mb-2 text-[6px] text-[#c7bda6]">Nueva colección</p>
          <span className="rounded bg-gold-500 px-2 py-1 text-center text-[6px] font-bold text-[#1a1200]">
            VER TIENDA
          </span>
        </div>
      </div>
    </div>
  );
}

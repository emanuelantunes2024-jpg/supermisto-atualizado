import Link from "next/link";

interface HeroProps {
  templateCount: number;
  categoryCount: number;
}

export function Hero({ templateCount, categoryCount }: HeroProps) {
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
      title: `+${categoryCount}`,
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
          <rect x="3" y="8" width="18" height="13" rx="1.5" />
          <path d="M3 12h18M12 8v13" />
          <path d="M12 8S9 3 7 4.5 8.5 8 12 8zM12 8s3-5 5-3.5S15.5 8 12 8z" />
        </>
      ),
      title: "Combos",
      lines: ["Ahorra", "comprando juntos"],
      soon: true,
    },
  ];

  return (
    <section className="relative overflow-hidden pb-[60px] pt-[70px]">
      <div
        className="pointer-events-none absolute inset-x-[-10%] top-[-20%] h-[620px]"
        style={{ background: "radial-gradient(circle at 28% 22%,rgba(240,167,48,0.15),transparent 62%)" }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-[-5%] h-[560px] w-[60%]"
        style={{ background: "radial-gradient(ellipse at 60% 45%,rgba(255,122,61,0.12),transparent 65%)" }}
      />

      <div className="container-shell relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="anim-in">
          <h1 className="mb-5 text-[clamp(32px,4.1vw,52px)] uppercase leading-[1.06]">
            Todo lo que tu negocio
            <br />
            necesita, <span className="text-gold-400">en un solo lugar</span>
          </h1>
          <p className="mb-9 max-w-[500px] text-[16.5px] text-ink-muted">
            Sitios web premium, sistemas PDV y soluciones digitales completas para llevar tu negocio al
            siguiente nivel.
          </p>

          <div className="mb-9 flex flex-wrap gap-x-10 gap-y-6">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className={`mt-0.5 shrink-0 ${item.soon ? "text-gold-400/50" : "text-gold-400"}`}
                >
                  {item.icon}
                </svg>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-display text-[19px] font-extrabold ${
                        item.soon ? "text-ink/55" : "text-ink"
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
                  <div className={`text-[13px] leading-tight ${item.soon ? "text-ink-muted/55" : "text-ink-muted"}`}>
                    {item.lines[0]}
                    <br />
                    {item.lines[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3.5">
            <Link href="/plantillas" className="btn btn-gold btn-lg uppercase tracking-[0.03em]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Ver categorías
            </Link>
            <Link href="/#como-funciona" className="btn btn-ghost btn-lg uppercase tracking-[0.03em]">
              Cómo funciona
            </Link>
          </div>
        </div>

        <HeroComposition templateCount={templateCount} />
      </div>
    </section>
  );
}

/**
 * Composición portátil + tablet + móvil, con diseños reales del catálogo.
 * La tablet muestra el hueco del PDV marcado como "Pronto": la estructura
 * queda lista, pero no se anuncia un producto que aún no se vende.
 */
function HeroComposition({ templateCount }: { templateCount: number }) {
  return (
    <div className="anim-in relative min-h-[380px] pb-6 pt-4" style={{ animationDelay: ".2s" }}>
      <div
        className="pointer-events-none absolute inset-x-[-8%] bottom-[8%] top-[-6%] animate-pulseGlow blur-[12px]"
        style={{ background: "radial-gradient(ellipse at 55% 45%,rgba(240,167,48,0.22),transparent 66%)" }}
      />

      {/* Portátil — Sitio web premium */}
      <div className="relative z-10 w-[76%] animate-floatY">
        <div className="overflow-hidden rounded-t-[12px] border-[9px] border-b-0 border-[#1b1b1f] bg-[#050506] shadow-lg">
          <div className="flex gap-1.5 bg-navy-700 px-3 py-2.5">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="h-[7px] w-[7px] rounded-full bg-[#3a3a42]" />
            ))}
          </div>
          <div
            className="min-h-[220px] px-5 py-5"
            style={{ background: "linear-gradient(160deg,#12100b,#1c1712 55%,#0c0a08)" }}
          >
            <div className="mb-2 text-[9px] uppercase tracking-[0.18em] text-gold-400">Restaurante</div>
            <div className="mb-2 font-display text-[22px] font-extrabold leading-[1.05] text-[#f5efe3]">
              CADA PLATO,
              <br />
              <span className="text-gold-400">UNA HISTORIA</span>
            </div>
            <p className="mb-4 max-w-[230px] text-[11px] leading-snug text-[#c7bda6]">
              Sitio web completo para tu restaurante: carta, reservas y eventos.
            </p>
            <span className="inline-block rounded bg-gold-500 px-3.5 py-2 text-[10px] font-bold text-[#1a1200]">
              VER DEMO
            </span>
          </div>
        </div>
        <div
          className="h-[9px]"
          style={{
            background: "linear-gradient(180deg,#141416,#0a0a0b)",
            clipPath: "polygon(6% 0,94% 0,100% 100%,0 100%)",
          }}
        />
        <div className="relative h-3 rounded-b-[9px]" style={{ background: "linear-gradient(180deg,#202329,#0d0f12)" }}>
          <span className="absolute left-1/2 top-0 h-[4px] w-[58px] -translate-x-1/2 rounded-b bg-[#0a0a0b]" />
        </div>
      </div>

      {/* Tablet — hueco reservado para el PDV */}
      <div
        className="absolute right-[9%] top-[16%] z-20 hidden w-[38%] animate-floatY sm:block"
        style={{ animationDelay: ".35s" }}
      >
        <div className="overflow-hidden rounded-[10px] border-[7px] border-[#1b1b1f] bg-[#0d0f12] shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-gold-400">PDV</span>
            <span className="rounded-full border border-line px-1.5 py-px text-[7px] font-semibold text-ink-muted/70">
              Pronto
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className="aspect-square rounded border border-line bg-navy-800"
                style={{ opacity: 0.35 + (index % 3) * 0.12 }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line px-3 py-2">
            <span className="text-[8px] text-ink-muted/60">Total</span>
            <span className="rounded bg-gold-500/25 px-2.5 py-1 text-[8px] font-bold text-gold-400">Cobrar</span>
          </div>
        </div>
      </div>

      {/* Móvil — otro diseño real del catálogo */}
      <div
        className="absolute -bottom-1 right-0 z-30 hidden w-[19%] min-w-[92px] animate-floatY overflow-hidden rounded-[18px] border-[5px] border-[#1b1b1f] bg-[#050506] shadow-lg sm:block"
        style={{ animationDelay: ".5s" }}
      >
        <div
          className="flex aspect-[9/17] flex-col justify-end px-2.5 pb-3"
          style={{ background: "linear-gradient(165deg,#241a1e,#0c0a08)" }}
        >
          <div className="mb-1 text-[6.5px] uppercase tracking-[0.16em] text-gold-400">Moda</div>
          <div className="mb-2 font-display text-[12px] font-extrabold leading-[1.05] text-[#f5efe3]">
            PRIMAVERA
            <br />
            <span className="text-gold-400">EN CALMA</span>
          </div>
          <span className="rounded bg-gold-500 px-2 py-1 text-center text-[6.5px] font-bold text-[#1a1200]">
            VER TIENDA
          </span>
        </div>
      </div>

      <div className="absolute -top-1 left-0 z-30 flex animate-floatY items-center gap-2.5 rounded-xl border border-line bg-navy-700/95 px-3.5 py-2.5 shadow-lg">
        <span className="font-display text-[17px] font-extrabold text-gold-400">{templateCount}+</span>
        <span className="text-[10px] leading-tight text-ink-muted">
          sitios web
          <br />
          disponibles
        </span>
      </div>
    </div>
  );
}

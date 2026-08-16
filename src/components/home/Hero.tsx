import Link from "next/link";

const trust = [
  {
    label: "Pago 100% seguro",
    icon: (
      <>
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </>
    ),
  },
  {
    label: "Entrega inmediata",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    label: "100% editable",
    icon: <path d="M3 12h18M3 6h18M3 18h18" />,
  },
];

export function Hero({ templateCount }: { templateCount: number }) {
  return (
    <section className="relative overflow-hidden pb-[70px] pt-[88px]">
      <div
        className="pointer-events-none absolute inset-x-[-10%] top-[-20%] h-[600px]"
        style={{
          background: "radial-gradient(circle at 30% 20%,rgba(231,166,60,0.14),transparent 60%)",
        }}
      />

      <div className="container-shell relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="anim-in">
          <div className="eyebrow">Plantillas profesionales · Europa</div>
          <h1 className="mb-5 text-[clamp(34px,4.2vw,54px)]">
            Tu negocio necesita un sitio web. <span className="text-gold-400">El nuestro ya está listo.</span>
          </h1>
          <p className="mb-8 max-w-[520px] text-[17px] text-ink-muted">
            Plantillas completas y personalizables para barberías, cafeterías, tiendas y más. Elige un diseño,
            cámbialo a tu gusto y publícalo el mismo día — sin programar nada.
          </p>

          <div className="mb-9 flex flex-wrap gap-3.5">
            <Link href="/plantillas" className="btn btn-gold btn-lg">
              Ver plantillas disponibles
            </Link>
            <Link href="/#como-funciona" className="btn btn-ghost btn-lg">
              Cómo funciona
            </Link>
          </div>

          <div className="flex flex-wrap gap-7">
            {trust.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-[13px] text-ink-muted">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 text-gold-400"
                >
                  {item.icon}
                </svg>
                {item.label}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-[18px]">
            <span className="tracking-[2px] text-[13px] text-gold-400">★★★★★</span>
            <span className="text-[12.5px] text-ink-muted">
              <strong className="text-ink">4.9/5</strong> basado en +1.200 reseñas de clientes
            </span>
          </div>
        </div>

        <HeroDevice templateCount={templateCount} />
      </div>
    </section>
  );
}

/** Mockup de portátil con una demo de barbería dentro — igual que el prototipo. */
function HeroDevice({ templateCount }: { templateCount: number }) {
  return (
    <div className="anim-in relative px-2.5 pb-12 pt-5" style={{ animationDelay: ".25s" }}>
      <div
        className="pointer-events-none absolute inset-x-[-5%] bottom-[10%] top-[-10%] animate-pulseGlow blur-[10px]"
        style={{
          background: "radial-gradient(ellipse at 50% 40%,rgba(231,166,60,0.28),transparent 65%)",
        }}
      />

      <div className="relative z-10 animate-floatY">
        <div className="overflow-hidden rounded-t-[14px] border-[10px] border-b-0 border-[#1b2338] bg-[#050708] shadow-lg">
          <div className="flex gap-1.5 bg-navy-700 px-3.5 py-3">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="h-[9px] w-[9px] rounded-full bg-[#3a4a6b]" />
            ))}
          </div>
          <div
            className="min-h-[280px] px-6 py-6"
            style={{ background: "linear-gradient(160deg,#12100b,#1c1712 55%,#0c0a08)" }}
          >
            <div className="mb-2.5 text-[10px] uppercase tracking-[0.16em] text-gold-400">Barbería Premium</div>
            <div className="mb-2 font-display text-[26px] font-extrabold leading-tight text-[#f5efe3]">
              ESTILO QUE
              <br />
              <span className="text-gold-400">TE DEFINE</span>
            </div>
            <p className="mb-[18px] max-w-[260px] text-xs text-[#c7bda6]">
              Cortes modernos, clásicos y afeitados premium en un ambiente exclusivo.
            </p>
            <div className="flex gap-2.5">
              <span className="rounded-md bg-gold-500 px-4 py-2.5 text-[11px] font-bold text-[#1a1200]">
                RESERVAR CITA
              </span>
              <span className="rounded-md border border-[#4a4030] px-4 py-2.5 text-[11px] font-bold text-[#e9e0cc]">
                VER SERVICIOS
              </span>
            </div>
          </div>
        </div>
        <div
          className="h-[11px]"
          style={{
            background: "linear-gradient(180deg,#141b2c,#0a0e18)",
            clipPath: "polygon(6% 0,94% 0,100% 100%,0 100%)",
          }}
        />
        <div
          className="relative h-4 rounded-b-[10px]"
          style={{ background: "linear-gradient(180deg,#20293f,#0f1524)" }}
        >
          <span className="absolute left-1/2 top-0 h-[5px] w-[70px] -translate-x-1/2 rounded-b-md bg-[#0a0e18]" />
        </div>
      </div>

      <div className="absolute -top-[2%] left-0 z-20 flex animate-floatY items-center gap-2.5 rounded-xl border border-line bg-navy-700 px-4 py-3 shadow-lg lg:left-[-6%]">
        <span className="text-lg">⭐</span>
        <div>
          <div className="font-display text-[15px] font-extrabold">4.9/5</div>
          <div className="tracking-[1px] text-xs text-gold-400">★★★★★</div>
        </div>
      </div>

      <div className="absolute bottom-[6%] right-0 z-20 flex animate-floatY items-center gap-2.5 rounded-xl border border-line bg-navy-700 px-4 py-3 shadow-lg lg:right-[-5%]">
        <span className="font-display text-lg font-extrabold text-gold-400">{templateCount}+</span>
        <span className="text-[10.5px] leading-tight text-ink-muted">
          plantillas
          <br />
          disponibles
        </span>
      </div>
    </div>
  );
}

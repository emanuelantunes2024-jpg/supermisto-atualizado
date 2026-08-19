import Link from "next/link";

import { socialLinks } from "@/lib/config";

const checklist = ["Practicidad", "Calidad", "Productividad", "Seguridad", "Resultados", "Rentabilidad"];

export function Hero({ templateCount }: { templateCount: number }) {
  const whatsappHref = socialLinks.whatsapp || "/contacto";

  return (
    <section className="relative overflow-hidden pb-[60px] pt-[56px]">
      <div
        className="pointer-events-none absolute inset-x-[-15%] top-[-25%] h-[650px]"
        style={{ background: "radial-gradient(circle at 30% 25%,rgba(240,167,48,0.18),transparent 62%)" }}
      />
      <div
        className="pointer-events-none absolute right-[-15%] top-[10%] h-[500px] w-[55%]"
        style={{ background: "radial-gradient(ellipse at 60% 45%,rgba(255,122,61,0.14),transparent 65%)" }}
      />

      <div className="container-shell relative z-10 grid items-center gap-12 lg:grid-cols-[0.95fr_1.1fr]">
        <div className="anim-in">
          <h1 className="mb-5 text-[clamp(30px,3.6vw,46px)] leading-[1.1]">
            Soluciones Digitales que
            <br />
            <span className="text-gold-400">Impulsan tu Negocio</span>
          </h1>
          <p className="mb-7 max-w-[460px] text-[16px] text-ink-muted">
            Plantillas profesionales, sistemas PDV completos y soluciones inteligentes para hacer crecer tu
            negocio.
          </p>

          <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-2.5">
            {checklist.map((item) => (
              <div key={item} className="flex items-center gap-2 text-[14px] text-ink">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-[11px] font-bold text-gold-400">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3.5">
            <Link href="/plantillas" className="btn btn-gold btn-lg">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
                <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              Ver productos
            </Link>
            <a
              href={whatsappHref}
              target={socialLinks.whatsapp ? "_blank" : undefined}
              rel={socialLinks.whatsapp ? "noreferrer" : undefined}
              className="btn btn-lg"
              style={{ background: "#22c55e", color: "#052e12" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2zm5.6 14.3c-.2.6-1.4 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.3c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.7.8 1.9.1.2.1.4 0 .6-.1.2-.2.4-.3.5-.2.2-.3.4-.1.7.2.4.9 1.5 1.9 2.3 1.3 1.1 2.3 1.5 2.7 1.6.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.2.1.6-.1 1.2z" />
              </svg>
              Hablar por WhatsApp
            </a>
          </div>
        </div>

        <HeroDashboard templateCount={templateCount} />
      </div>
    </section>
  );
}

/** Mockup de portátil con un panel de gestión + selo de calidad, como en la referencia de marca. */
function HeroDashboard({ templateCount }: { templateCount: number }) {
  return (
    <div className="anim-in relative pb-8 pt-4" style={{ animationDelay: ".2s" }}>
      <div
        className="pointer-events-none absolute inset-x-[-8%] bottom-[6%] top-[-8%] animate-pulseGlow blur-[14px]"
        style={{ background: "radial-gradient(ellipse at 55% 45%,rgba(240,167,48,0.24),transparent 66%)" }}
      />

      <div className="relative z-10 animate-floatY">
        <div className="overflow-hidden rounded-t-[14px] border-[10px] border-b-0 border-[#1b1b1f] bg-[#050506] shadow-lg">
          <div className="flex items-center justify-between bg-navy-700 px-4 py-2.5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-[8px] w-[8px] rounded-full bg-[#3a3a42]" />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-ink-muted">Panel de gestión</span>
          </div>

          <div className="min-h-[300px] p-5" style={{ background: "var(--navy-900)" }}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-400">
                Leuname · Dashboard
              </span>
              <span className="text-[10px] text-ink-muted">Hola, Administrador</span>
            </div>

            <div className="mb-4 grid grid-cols-4 gap-2">
              {[
                { label: "Ventas hoy", value: "€1.248", color: "#22c55e" },
                { label: "Clientes", value: "324", color: "#3b82f6" },
                { label: "Productos", value: "128", color: "#a855f7" },
                { label: "Stock", value: "87%", color: "#f0a730" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-line px-2.5 py-2" style={{ background: "var(--navy-800)" }}>
                  <div className="text-[13px] font-extrabold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-[8px] text-ink-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-4 rounded-lg border border-line p-3" style={{ background: "var(--navy-800)" }}>
              <div className="mb-2 text-[9px] font-semibold text-ink-muted">Ventas (últimos 7 días)</div>
              <svg viewBox="0 0 220 50" className="w-full" preserveAspectRatio="none">
                <polyline
                  points="0,42 30,36 60,38 90,26 120,30 150,14 180,18 220,6"
                  fill="none"
                  stroke="#f0a730"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Clientes activos", value: "324" },
                { label: "Pedidos", value: "56" },
                { label: "Facturación", value: "€12.4k" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-line py-2" style={{ background: "var(--navy-800)" }}>
                  <div className="text-[12px] font-extrabold text-gold-400">{stat.value}</div>
                  <div className="text-[7.5px] text-ink-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="h-[11px]"
          style={{
            background: "linear-gradient(180deg,#141416,#0a0a0b)",
            clipPath: "polygon(6% 0,94% 0,100% 100%,0 100%)",
          }}
        />
        <div className="relative h-4 rounded-b-[10px]" style={{ background: "linear-gradient(180deg,#202329,#0d0f12)" }}>
          <span className="absolute left-1/2 top-0 h-[5px] w-[70px] -translate-x-1/2 rounded-b-md bg-[#0a0a0b]" />
        </div>
      </div>

      {/* Sello de calidad */}
      <div
        className="absolute -bottom-3 right-[2%] z-20 flex h-[110px] w-[110px] animate-floatY flex-col items-center justify-center rounded-full border-2 border-gold-500 text-center shadow-lg"
        style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-950))", animationDelay: ".4s" }}
      >
        <span className="text-[11px] leading-tight text-gold-400">★★★★★</span>
        <span className="mt-1 px-2 text-[10.5px] font-bold leading-tight">Calidad que Transforma</span>
      </div>

      <div className="absolute -top-1 left-0 z-20 flex animate-floatY items-center gap-2.5 rounded-xl border border-line bg-navy-700/95 px-3.5 py-2.5 shadow-lg">
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

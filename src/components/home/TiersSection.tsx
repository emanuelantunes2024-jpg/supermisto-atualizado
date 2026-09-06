import Link from "next/link";

/**
 * "Elige tu plan": la misma idea de nivel (Premium / Especializado / Esencial)
 * aplicada a los tres tipos de producto (sitio, PDV, combo). Los enlaces van
 * al catálogo real de cada tipo — todavía no hay filtro propio por nivel, así
 * que de momento los tres llevan al mismo listado en vez de a un resultado
 * vacío.
 */
const TIERS = [
  { key: "premium", label: "Premium", accent: "#e6b422", accentSoft: "rgba(230,180,34,.12)" },
  { key: "especializado", label: "Especializado", accent: "#a855f7", accentSoft: "rgba(168,85,247,.14)" },
  { key: "esencial", label: "Esencial", accent: "#22c55e", accentSoft: "rgba(34,197,94,.12)" },
] as const;

const ROWS = [
  {
    kind: "Sitio",
    href: "/plantillas",
    cards: {
      premium: {
        desc: "Sitio completo con todas las funcionalidades para destacar tu empresa.",
        features: ["Todas las funciones", "Diseño profesional", "Optimizado para SEO", "Soporte prioritario"],
        cta: "Ver sitios premium",
      },
      especializado: {
        desc: "Sitio enfocado en un servicio o especialidad específica para mejores resultados.",
        features: ["Enfoque en tu especialidad", "Contenido estratégico", "Conversión optimizada", "Ideal para destacar"],
        cta: "Ver sitios especializados",
      },
      esencial: {
        desc: "Sitio simple y efectivo con lo esencial para presentar tu negocio profesionalmente.",
        features: ["Información esencial", "Diseño limpio y moderno", "Rápido y ligero", "Fácil de administrar"],
        cta: "Ver sitios esenciales",
      },
    },
  },
  {
    kind: "PDV",
    href: "/pdvs",
    cards: {
      premium: {
        desc: "Sistema completo para gestionar ventas, inventario y clientes sin límites.",
        features: ["Ventas e inventario", "Reportes avanzados", "Multiusuario y permisos", "Integración completa"],
        cta: "Ver PDV premium",
      },
      especializado: {
        desc: "PDV diseñado para un tipo de negocio o rubro específico.",
        features: ["Funciones específicas", "Flujo optimizado", "Fácil de usar", "Ideal para tu especialidad"],
        cta: "Ver PDV especializado",
      },
      esencial: {
        desc: "PDV simple y práctico con lo esencial para tu día a día.",
        features: ["Ventas básicas", "Inventario simple", "Control de caja", "Fácil y rápido"],
        cta: "Ver PDV esencial",
      },
    },
  },
  {
    kind: "Combo",
    href: "/combos",
    cards: {
      premium: {
        desc: "Sitio Premium + PDV Premium: la solución completa para llevar tu negocio al máximo nivel.",
        features: ["Incluye sitio y PDV premium", "Mejor precio combinado", "Un solo lugar para todo", "Soporte prioritario"],
        cta: "Ver combo premium",
      },
      especializado: {
        desc: "Sitio Especializado + PDV Especializado, enfocados en tu rubro para máxima eficiencia.",
        features: ["Pensado para tu especialidad", "Mejor precio combinado", "Web y venta integradas", "Resultados enfocados"],
        cta: "Ver combo especializado",
      },
      esencial: {
        desc: "Sitio Esencial + PDV Esencial: todo lo esencial que necesitas para comenzar y crecer.",
        features: ["Lo esencial de ambos mundos", "Mejor precio combinado", "Ideal para empezar", "Crece cuando lo necesites"],
        cta: "Ver combo esencial",
      },
    },
  },
] as const;

const TRUST = [
  "Diseños modernos y responsivos",
  "100% seguro y confiable",
  "Soporte especializado siempre contigo",
  "Actualizaciones constantes",
  "Instalación rápida y fácil",
  "Satisfacción garantizada",
];

const check = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5 shrink-0">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

function HexIcon({ accent, kind }: { accent: string; kind: (typeof ROWS)[number]["kind"] }) {
  const icon =
    kind === "Sitio" ? (
      <path d="M3 5.5h18v13H3z M3 9h18 M8 5.5v13" />
    ) : kind === "PDV" ? (
      <>
        <circle cx="9.5" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3.5h2.7l2.4 11h11l2-8H6.3" />
      </>
    ) : (
      <path d="M12 5v14M5 12h14" />
    );
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {icon}
    </svg>
  );
}

export function TiersSection() {
  return (
    <section className="on-dark bg-navy-950 py-16">
      <div className="container-shell">
        <div className="section-head text-center">
          <div className="eyebrow">Elige tu plan</div>
          <h2>Un plan para cada etapa de tu negocio</h2>
          <p>Premium, Especializado o Esencial — para sitios web, sistemas PDV y combos de los dos juntos.</p>
        </div>

        <div className="space-y-10">
          {ROWS.map((row) => (
            <div key={row.kind}>
              <h3 className="mb-4 text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink-muted">
                {row.kind === "Sitio" ? "Sitios profesionales" : row.kind === "PDV" ? "Sistemas PDV" : "Combos completos (Sitio + PDV)"}
              </h3>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                {TIERS.map((tier) => {
                  const card = row.cards[tier.key];
                  return (
                    <div
                      key={tier.key}
                      className="flex flex-col rounded-xl border p-3 sm:p-6"
                      style={{ borderColor: `${tier.accent}55`, background: `linear-gradient(160deg, ${tier.accentSoft}, transparent 60%)` }}
                    >
                      <div className="mb-2.5 flex items-center gap-2 sm:mb-4 sm:gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:h-11 sm:w-11 sm:rounded-[10px]"
                          style={{ borderColor: `${tier.accent}66`, background: tier.accentSoft }}
                        >
                          <HexIcon accent={tier.accent} kind={row.kind} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-ink-muted sm:text-[11px]">
                            {row.kind}
                          </div>
                          <div className="truncate text-[13px] font-extrabold sm:text-[17px]" style={{ color: tier.accent }}>
                            {tier.label}
                          </div>
                        </div>
                      </div>
                      <p className="mb-2.5 text-[11.5px] text-ink-muted sm:mb-4 sm:text-[13.5px]">{card.desc}</p>
                      <ul className="mb-3 space-y-1.5 sm:mb-5 sm:space-y-2">
                        {card.features.map((feature) => (
                          <li key={feature} className="flex gap-1.5 text-[11px] sm:gap-2 sm:text-[13px]" style={{ color: tier.accent }}>
                            {check}
                            <span className="text-ink">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={row.href}
                        className="btn btn-block mt-auto text-[11.5px] sm:text-[13px]"
                        style={{ background: tier.accent, color: "#12140f" }}
                      >
                        {card.cta} →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-10 text-center sm:grid-cols-3 lg:grid-cols-6">
          {TRUST.map((item) => (
            <span key={item} className="text-[12px] font-semibold text-ink-muted">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

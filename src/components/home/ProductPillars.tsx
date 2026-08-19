import Link from "next/link";

interface ProductPillarsProps {
  templateCount: number;
}

/** Lista con los ticks dorados de las tarjetas. */
function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mb-6 space-y-[7px] text-[13px]">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 text-gold-400">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Botón inferior de cada tarjeta. */
function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-auto inline-flex w-fit items-center gap-2.5 rounded-[9px] border border-line px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.04em] text-ink transition-colors hover:border-gold-500 hover:text-gold-400"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

/**
 * Los tres pilares del catálogo: sitios web, sistemas PDV y combos.
 * Cada tarjeta lleva la maqueta del dispositivo a la derecha, como en la
 * referencia de marca.
 */
/**
 * Una tarjeta: texto a la izquierda (título, descripción, ticks y botón) y la
 * maqueta del aparato ocupando toda la banda derecha, como en la referencia.
 */
function PillarCard({
  background,
  title,
  description,
  items,
  href,
  cta,
  mock,
}: {
  background: string;
  title: string;
  description: string;
  items: string[];
  href: string;
  cta: string;
  mock: React.ReactNode;
}) {
  return (
    <article
      className="group relative flex overflow-hidden rounded-[14px] border border-line p-6 transition-all duration-200 hover:-translate-y-1 hover:border-gold-500/60"
      style={{ background }}
    >
      <div className="flex flex-1 flex-col pr-3">
        <h3 className="mb-2 whitespace-nowrap text-[18px] uppercase leading-none">{title}</h3>
        <p className="mb-4 min-h-[54px] text-[12.5px] leading-snug text-ink-muted">{description}</p>
        <Checklist items={items} />
        <CardLink href={href}>{cta}</CardLink>
      </div>

      <div className="hidden w-[41%] shrink-0 items-center sm:flex">{mock}</div>
    </article>
  );
}

export function ProductPillars({ templateCount }: ProductPillarsProps) {
  return (
    <section id="servicios" className="pb-4">
      <div className="container-shell grid items-stretch gap-5 lg:grid-cols-3">
        <PillarCard
          background="linear-gradient(150deg,#0e1b2c,#0a0d13 74%)"
          title="Sitios web premium"
          description="Diseños profesionales, responsivos y optimizados para convertir visitantes en clientes."
          items={[
            "100% Personalizables",
            "Listos para usar",
            "SEO Optimizado",
            "Soporte incluido",
            "Rendimiento superior",
          ]}
          href="/plantillas"
          cta={`Ver sitios${templateCount > 0 ? ` (${templateCount})` : ""}`}
          mock={<LaptopMock />}
        />

        <PillarCard
          background="linear-gradient(150deg,#0d2018,#0a0d13 74%)"
          title="Sistemas PDV"
          description="Puntos de venta modernos y fáciles de usar para gestionar tu negocio de forma eficiente."
          items={[
            "Ventas rápidas",
            "Gestión de stock",
            "Clientes y productos",
            "Reportes completos",
            "Multi-dispositivo",
            "Fácil de usar",
          ]}
          href="/pdvs"
          cta="Ver PDVs"
          mock={<PdvMock />}
        />

        <PillarCard
          background="linear-gradient(150deg,#1a0f26,#0a0d13 74%)"
          title="Combos premium"
          description="Obtén tu sitio web + PDV y ahorra dinero con nuestros paquetes especiales."
          items={[
            "Mejor precio",
            "Todo integrado",
            "Instalación incluida",
            "Soporte prioritario",
            "Actualizaciones gratuitas",
          ]}
          href="/combos"
          cta="Ver combos"
          mock={<ComboMock />}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Maquetas de las tarjetas                                           */
/* ------------------------------------------------------------------ */

function LaptopMock() {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-t-[5px] border-[3px] border-b-0 border-[#2a2c31]">
        <div className="flex gap-1 bg-[#141920] px-1.5 py-1">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-[3px] w-[3px] rounded-full bg-[#3a3a42]" />
          ))}
        </div>
        <div
          className="flex min-h-[86px] flex-col justify-center px-2.5 py-2.5"
          style={{ background: "radial-gradient(ellipse at 78% 60%,#2c3f57,#141c28 55%,#080b10)" }}
        >
          <div className="mb-1 font-display text-[8px] font-extrabold uppercase leading-[1.05] text-white/90">
            Agencia
            <br />
            Inmobiliaria
            <br />
            <span className="text-gold-400">Premium</span>
          </div>
          <p className="mb-1.5 text-[4.5px] leading-tight text-white/55">
            Encuentra la propiedad perfecta para ti
          </p>
          <span className="w-fit rounded-[2px] bg-white/90 px-1.5 py-[3px] text-[4.5px] font-bold uppercase text-[#0d1420]">
            Ver demo
          </span>
        </div>
      </div>
      <div
        className="h-[4px]"
        style={{ background: "linear-gradient(180deg,#2f3238,#1a1c20)", clipPath: "polygon(5% 0,95% 0,100% 100%,0 100%)" }}
      />
    </div>
  );
}

function PdvMock() {
  const tiles = Array.from({ length: 12 });
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-[5px] border-[3px] border-[#2a2c31] bg-[#0e1116]">
        <div className="flex items-center justify-between border-b border-line px-1.5 py-1">
          <span className="text-[4px] font-bold uppercase tracking-[0.1em] text-gold-400">Leuname</span>
          <span className="flex gap-[3px]">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-[3px] w-[3px] rounded-full bg-[#3a3a42]" />
            ))}
          </span>
        </div>
        <div className="flex gap-1 p-1">
          <div className="grid flex-1 grid-cols-4 gap-[3px]">
            {tiles.map((_, i) => (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded-[2px] border border-gold-500/25"
                style={{ background: "linear-gradient(160deg,#2a2113,#171208)" }}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-gold-500/70" />
              </span>
            ))}
          </div>
          <div className="flex w-[38%] flex-col rounded-[2px] border border-line bg-[#12151a] p-1">
            <span className="mb-[2px] border-b border-line pb-[2px] text-[4px] font-bold uppercase text-ink-muted">
              Carrito
            </span>
            {[
              ["Pan", "2,50 €"],
              ["Leche", "1,90 €"],
              ["Manzanas", "2,10 €"],
              ["Huevos", "1,80 €"],
            ].map(([name, price]) => (
              <span key={name} className="flex justify-between py-[1px] text-[3.8px] text-ink/80">
                {name}
                <i className="not-italic text-ink-muted">{price}</i>
              </span>
            ))}
            <span className="mt-[3px] flex justify-between border-t border-line pt-[2px] text-[4.2px] font-bold text-ink">
              TOTAL
              <i className="not-italic">7,70 €</i>
            </span>
            <span className="mt-[3px] rounded-[2px] bg-[#22a35a] py-[3px] text-center text-[4.2px] font-extrabold uppercase text-white">
              Pagar
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto h-[6px] w-[14%] bg-[#25272c]" />
      <div className="mx-auto h-[3px] w-[42%] rounded-[2px] bg-[#2f3238]" />
    </div>
  );
}

function ComboMock() {
  return (
    <div className="relative w-full">
      {/* Ventana del sitio web */}
      <div className="overflow-hidden rounded-[5px] border border-[#7c3ecf]/50" style={{ background: "linear-gradient(150deg,#6d2bbf,#3d1a70)" }}>
        <div className="flex gap-1 border-b border-white/15 px-1.5 py-1">
          {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
            <span key={color} className="h-[3px] w-[3px] rounded-full" style={{ background: color }} />
          ))}
        </div>
        <div className="space-y-[3px] px-2 py-2.5">
          <span className="block h-[3px] w-4/5 rounded-full bg-white/45" />
          <span className="block h-[3px] w-3/5 rounded-full bg-white/30" />
          <span className="block h-[3px] w-2/3 rounded-full bg-white/20" />
          <span className="block h-[3px] w-1/2 rounded-full bg-white/15" />
        </div>
      </div>

      {/* Monitor PDV superpuesto */}
      <div className="absolute -bottom-1 right-0 w-[52%]">
        <div className="overflow-hidden rounded-[4px] border-[2px] border-[#3a2a55] bg-[#180f26]">
          <div className="grid grid-cols-3 gap-[2px] p-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="aspect-square rounded-[2px] bg-white/10" />
            ))}
          </div>
        </div>
        <div className="mx-auto h-[4px] w-[16%] bg-[#3a2a55]" />
        <div className="mx-auto h-[2.5px] w-[46%] rounded-[2px] bg-[#4a3568]" />
      </div>

      {/* Símbolo + */}
      <span className="absolute bottom-[18%] left-[26%] flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-[#1a1226] font-display text-[13px] font-extrabold leading-none text-white">
        +
      </span>
    </div>
  );
}

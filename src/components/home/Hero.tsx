import Link from "next/link";

import type { HeroContent, TemplateWithCategory } from "@/lib/types";

interface HeroProps {
  hero: HeroContent;
  categories: { slug: string; name: string }[];
  mockups: TemplateWithCategory[];
}

/**
 * Portada: todo el texto y la imagen se editan en `/admin/contenido` → Hero.
 * Sin imagen propia, se arma una maqueta con las miniaturas de los
 * templates destacados, para que nunca se vea un hueco vacío.
 */
export function Hero({ hero, categories, mockups }: HeroProps) {
  const laptopShot = hero.image_url ?? mockups[0]?.thumbnail_url ?? null;
  const phoneShot = mockups[1]?.thumbnail_url ?? mockups[0]?.thumbnail_url ?? null;

  return (
    <section className="on-dark relative overflow-hidden bg-navy-950 pb-14 pt-12">
      <div
        className="pointer-events-none absolute inset-x-[-15%] top-[-35%] h-[640px]"
        style={{ background: "radial-gradient(circle at 30% 30%,rgba(255,122,26,0.22),transparent 62%)" }}
      />

      <div className="container-shell relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="anim-in">
          {hero.eyebrow && <div className="eyebrow">{hero.eyebrow}</div>}
          <h1 className="mb-4 text-[clamp(28px,3.6vw,44px)] leading-[1.12]">{hero.title}</h1>
          <p className="mb-7 max-w-[480px] text-[15.5px] leading-relaxed text-ink-muted">{hero.subtitle}</p>

          <form action="/plantillas" className="mb-6 flex max-w-[480px] gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white/[0.04] px-4 py-3">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-ink-muted">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                name="q"
                placeholder={hero.search_placeholder}
                className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
            <button type="submit" className="btn btn-gold px-5">
              Buscar
            </button>
          </form>

          {hero.trust_badges.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-ink-muted">
              {hero.trust_badges.map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gold-400">
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link href={hero.button_href} className="btn btn-gold btn-lg">
              {hero.button_text}
            </Link>
            {categories.slice(0, 1).map((cat) => (
              <Link key={cat.slug} href={`/plantillas?cat=${cat.slug}`} className="btn btn-ghost btn-lg">
                Ver {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <HeroMockup laptopShot={laptopShot} phoneShot={phoneShot} />
      </div>
    </section>
  );
}

/** Maqueta portátil + móvil con capturas reales de templates (o un placeholder si aún no hay). */
function HeroMockup({ laptopShot, phoneShot }: { laptopShot: string | null; phoneShot: string | null }) {
  return (
    <div className="anim-in relative mx-auto w-full max-w-[480px]" style={{ animationDelay: ".15s" }}>
      <div
        className="relative z-10 rounded-t-[14px] p-[9px] pb-[7px]"
        style={{ background: "linear-gradient(160deg,#4a4d55,#26282e 40%,#15171a)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-[#0b0d10]">
          {laptopShot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={laptopShot} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[12px] text-ink-muted">
              Tu template aquí
            </div>
          )}
        </div>
      </div>
      <div
        className="relative z-10 mx-[-4%] h-[16px] rounded-b-[4px]"
        style={{
          background: "linear-gradient(180deg,#3c3f46,#23262b 55%,#15171a)",
          clipPath: "polygon(3.5% 0,96.5% 0,100% 100%,0 100%)",
        }}
      />
      <div
        className="relative z-10 mx-[-6%] h-[9px] rounded-b-[10px]"
        style={{ background: "linear-gradient(180deg,#2a2d33,#101215)" }}
      />

      <div className="absolute -bottom-6 -right-3 z-20 w-[26%] animate-floatY sm:-right-8">
        <div
          className="rounded-[17px] p-[4px]"
          style={{ background: "linear-gradient(160deg,#4a4d55,#26282e 45%,#15171a)", boxShadow: "var(--shadow-lg)" }}
        >
          <div className="aspect-[9/18.5] overflow-hidden rounded-[14px] bg-[#0b0d10]">
            {phoneShot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={phoneShot} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

import { CategoryIcon } from "@/components/templates/CategoryIcon";
import { TemplateCard } from "@/components/templates/TemplateCard";
import type { BenefitContent, Category, Testimonial, TemplateWithCategory, WhyUsContent } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Beneficios                                                          */
/* ------------------------------------------------------------------ */

const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  sparkles: (
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  ),
  pencil: (
    <>
      <path d="M14.5 4.5l5 5L8 21H3v-5z" />
    </>
  ),
  devices: (
    <>
      <rect x="2.5" y="4" width="15" height="10" rx="1.5" />
      <path d="M7 20h6" />
      <rect x="14.5" y="12" width="7" height="9" rx="1.3" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M4 20v-4h4M20 4v4h-4" />
    </>
  ),
  shield: (
    <path d="M12 2.5l8 3.5v6c0 4.7-3.3 8.9-8 10.2-4.7-1.3-8-5.5-8-10.2V6z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  star: <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />,
  gift: (
    <>
      <rect x="3" y="9" width="18" height="12" rx="1.5" />
      <path d="M3 13h18M12 9v12" />
      <path d="M12 9S9.5 4 7.5 5.2 8.6 9 12 9zM12 9s2.5-5 4.5-3.8S15.4 9 12 9z" />
    </>
  ),
};

export function BenefitsRow({ benefits }: { benefits: BenefitContent[] }) {
  if (benefits.length === 0) return null;

  return (
    <section className="py-14">
      <div className="container-shell grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="anim-in flex items-start gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-gold-500"
              style={{ background: "rgba(255,122,26,0.12)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {BENEFIT_ICONS[benefit.icon] ?? BENEFIT_ICONS.sparkles}
              </svg>
            </span>
            <div>
              <h3 className="mb-1 text-[15.5px] font-semibold">{benefit.title}</h3>
              <p className="text-[13px] leading-snug text-ink-muted">{benefit.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Categorías                                                          */
/* ------------------------------------------------------------------ */

interface CategoryGridProps {
  categories: Category[];
  counts: Record<string, number>;
}

export function CategoryGrid({ categories, counts }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="pb-14">
      <div className="container-shell">
        <div className="section-head section-head-center mx-auto">
          <div className="eyebrow justify-center">Catálogo</div>
          <h2>Explora por Categorías</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/plantillas?cat=${category.slug}`}
              className="surface anim-in flex flex-col items-center gap-2.5 px-4 py-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-gold-500"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-gold-500"
                style={{ background: "rgba(255,122,26,0.1)" }}
              >
                <CategoryIcon slug={category.slug} name={category.name} size={22} />
              </span>
              <span className="text-[13px] font-semibold leading-tight">{category.name}</span>
              <span className="text-[11.5px] text-ink-muted">{counts[category.slug] ?? 0}+ templates</span>
            </Link>
          ))}
          <Link
            href="/plantillas"
            className="surface anim-in flex flex-col items-center justify-center gap-1 px-4 py-6 text-center text-gold-500 transition-all duration-200 hover:-translate-y-1 hover:border-gold-500"
          >
            <span className="text-[22px]">→</span>
            <span className="text-[13px] font-semibold">Ver todas</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Templates populares                                                 */
/* ------------------------------------------------------------------ */

export function PopularTemplates({ templates }: { templates: TemplateWithCategory[] }) {
  if (templates.length === 0) return null;

  return (
    <section className="pb-16">
      <div className="container-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="section-head mb-0">
            <div className="eyebrow">Catálogo</div>
            <h2>Templates Más Populares</h2>
          </div>
          <Link href="/plantillas" className="btn btn-ghost">
            Ver todos →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, index) => (
            <TemplateCard key={template.id} template={template} showPriceNote priority={index < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Por qué elegirnos                                                   */
/* ------------------------------------------------------------------ */

export function WhyUsBand({ whyUs }: { whyUs: WhyUsContent }) {
  return (
    <section className="on-dark bg-navy-950 py-16">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="mb-3 text-[clamp(24px,3vw,32px)]">{whyUs.title}</h2>
          <p className="mb-6 max-w-md text-[14.5px] leading-relaxed text-ink-muted">{whyUs.text}</p>
          <Link href={whyUs.button_href} className="btn btn-gold">
            {whyUs.button_text}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {whyUs.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-[32px] font-extrabold leading-none text-gold-400">{stat.value}</div>
              <div className="mt-2 text-[12px] uppercase tracking-[0.04em] text-ink-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonios                                                         */
/* ------------------------------------------------------------------ */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-[2px] text-gold-500" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
        </svg>
      ))}
    </span>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container-shell">
        <div className="section-head section-head-center mx-auto">
          <div className="eyebrow justify-center">Opiniones</div>
          <h2>Lo que dicen nuestros clientes</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="surface anim-in p-6">
              <Stars rating={testimonial.rating} />
              <p className="mb-5 mt-3 text-[14px] leading-relaxed text-ink-muted">&ldquo;{testimonial.comment}&rdquo;</p>
              <div className="flex items-center gap-3">
                {testimonial.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={testimonial.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold text-gold-600"
                    style={{ background: "rgba(255,122,26,0.12)" }}
                  >
                    {testimonial.customer_name.charAt(0)}
                  </span>
                )}
                <div>
                  <div className="text-[13.5px] font-semibold">{testimonial.customer_name}</div>
                  {testimonial.role && <div className="text-[12px] text-ink-muted">{testimonial.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */

export function NewsletterSection({
  newsletter,
}: {
  newsletter: { title: string; subtitle: string; button_text: string };
}) {
  return (
    <section className="pb-16">
      <div className="container-shell">
        <div className="surface flex flex-col items-center gap-5 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="mb-1.5 text-[19px]">{newsletter.title}</h3>
            <p className="text-[13.5px] text-ink-muted">{newsletter.subtitle}</p>
          </div>
          <form className="flex w-full max-w-sm gap-2 sm:w-auto">
            <input
              type="email"
              required
              placeholder="Tu correo electrónico"
              className="field-input"
              aria-label="Correo electrónico"
            />
            <button type="submit" className="btn btn-gold shrink-0">
              {newsletter.button_text}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

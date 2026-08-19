import Link from "next/link";

import type { Category } from "@/lib/types";

/**
 * Franja de categorías bajo el hero: etiqueta + 8 iconos + "Ver todas".
 *
 * Los ocho grupos son los de la referencia de marca. Cada uno enlaza a la
 * categoría real del catálogo cuando existe (`slug`); si todavía no está
 * creada, lleva al catálogo completo.
 */
const groups: { label: string; slug: string; icon: React.ReactNode }[] = [
  {
    label: "Restaurantes",
    slug: "restaurante",
    icon: (
      <>
        <path d="M7 3v8M4.5 3v4a2.5 2.5 0 0 0 5 0V3M7 11v10" />
        <path d="M17.5 3c-1.4 1.4-2 3-2 5s.6 3 2 3.4V21" />
      </>
    ),
  },
  {
    label: "Clínicas",
    slug: "clinica-dental",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
  {
    label: "Inmobiliarias",
    slug: "inmobiliaria",
    icon: (
      <>
        <path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
        <path d="M9.5 21v-6h5v6" />
      </>
    ),
  },
  {
    label: "Hoteles",
    slug: "hotel",
    icon: (
      <>
        <path d="M4 20h16M5 20v-6a7 7 0 0 1 14 0v6" />
        <path d="M12 7V4.5" />
      </>
    ),
  },
  {
    label: "Tiendas Online",
    slug: "boutique-moda",
    icon: (
      <>
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3.5h2.8l2.4 11h11l2-8H6.6" />
      </>
    ),
  },
  {
    label: "Automotriz",
    slug: "taller-mecanico",
    icon: (
      <>
        <path d="M4 16v-3l1.8-4.4A2 2 0 0 1 7.7 7h8.6a2 2 0 0 1 1.9 1.6L20 13v3" />
        <path d="M3 16h18v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16M7.5 16v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V16" />
      </>
    ),
  },
  {
    label: "Salud & Belleza",
    slug: "perfumeria",
    icon: (
      <>
        <path d="M12 20.5S3.5 15.5 3.5 9.8A4.8 4.8 0 0 1 12 6.9a4.8 4.8 0 0 1 8.5 2.9c0 5.7-8.5 10.7-8.5 10.7z" />
        <path d="M6.5 12h3l1.5-2.5 2 5 1.5-2.5h3" />
      </>
    ),
  },
  {
    label: "Educación",
    slug: "instrumentos-musicales",
    icon: (
      <>
        <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
        <path d="M6.5 10.8V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5.2" />
        <path d="M21.5 8.5v5" />
      </>
    ),
  },
];

export function CategoryStrip({ categories }: { categories: Category[] }) {
  const exists = new Set(categories.map((category) => category.slug));
  const hrefFor = (slug: string) => (exists.has(slug) ? `/plantillas?cat=${slug}` : "/plantillas");

  return (
    <section className="pb-10">
      <div className="container-shell">
        <div
          className="anim-in flex flex-wrap items-center justify-center gap-x-4 gap-y-6 rounded-[14px] border border-line px-7 py-5 lg:flex-nowrap lg:justify-between"
          style={{ background: "linear-gradient(120deg,var(--navy-900),var(--navy-800))" }}
        >
          <span className="shrink-0 text-[12.5px] font-bold uppercase leading-tight tracking-[0.03em] text-gold-400">
            Explora nuestras
            <br />
            categorías premium
          </span>

          {groups.map((group) => (
            <Link
              key={group.label}
              href={hrefFor(group.slug)}
              className="group flex min-w-[78px] flex-col items-center gap-2 px-1 text-center"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gold-400 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden
              >
                {group.icon}
              </svg>
              <span className="text-[11.5px] font-medium leading-tight text-ink transition-colors group-hover:text-gold-400">
                {group.label}
              </span>
            </Link>
          ))}

          <Link
            href="/plantillas"
            className="flex shrink-0 items-center gap-2 rounded-lg border border-line px-4 py-3 text-[12px] font-bold uppercase tracking-[0.04em] text-ink transition-colors hover:border-gold-500 hover:text-gold-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Ver todas
          </Link>
        </div>
      </div>
    </section>
  );
}

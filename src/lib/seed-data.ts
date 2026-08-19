import type { Category, TemplateWithCategory } from "@/lib/types";

/**
 * Catálogo de ejemplo.
 *
 * Cumple dos funciones:
 *  1. Es la fuente de `supabase/seed.sql` (mismos ids y slugs).
 *  2. Alimenta la vitrine cuando todavía no hay Supabase configurado,
 *     para poder ver y revisar el sitio antes de crear las cuentas.
 *
 * Las categorías son las ocho de la referencia de marca. Cada plantilla se
 * añade a `seed` según llega su paquete (foto + prompt).
 */

const CAT = "11111111-1111-4111-8111-0000000000";

/** Las ocho categorías premium, en el orden de la referencia de marca. */
export const seedCategories: Category[] = [
  { id: `${CAT}01`, name: "Restaurantes", slug: "restaurantes", icon: "🍴" },
  { id: `${CAT}02`, name: "Clínicas", slug: "clinicas", icon: "🩺" },
  { id: `${CAT}03`, name: "Inmobiliarias", slug: "inmobiliarias", icon: "🏡" },
  { id: `${CAT}04`, name: "Hoteles", slug: "hoteles", icon: "🏨" },
  { id: `${CAT}05`, name: "Tiendas Online", slug: "tiendas-online", icon: "🛒" },
  { id: `${CAT}06`, name: "Automotriz", slug: "automotriz", icon: "🚗" },
  { id: `${CAT}07`, name: "Salud & Belleza", slug: "salud-belleza", icon: "💆" },
  { id: `${CAT}08`, name: "Educación", slug: "educacion", icon: "🎓" },
];

const byslug = (slug: string) => seedCategories.find((c) => c.slug === slug)!;

interface SeedTemplate {
  id: string;
  categorySlug: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  price_cents: number;
  preview_url: string | null;
  /** Degradado de respaldo si algún día falta la miniatura. */
  gradient: string;
  features: string[];
}

const TPL = "22222222-2222-4222-8222-0000000000";

const RESPONSIVE = "Responsive (móvil, tablet y desktop)";
const SEO = "Optimizado para Google (SEO)";

/**
 * Catálogo en construcción: cada plantilla se añade cuando llega su
 * paquete (imagen de referencia + prompt) y su demo está terminada.
 */
const seed: SeedTemplate[] = [
  {
    id: `${TPL}01`,
    categorySlug: "clinicas",
    title: "Clínica Dental Premium",
    slug: "clinica-dental-premium",
    short_description: "Clínica dental completa: tratamientos, equipo, urgencias y cita previa online.",
    full_description:
      "Para clínicas dentales y consultas privadas: catálogo de 6 tratamientos con ficha propia, equipo de especialistas, franja de urgencias 24h, promoción de bienvenida, preguntas frecuentes y formulario de cita previa. Paleta blanco + azul que transmite confianza, higiene y tecnología.",
    price_cents: 19900,
    preview_url: "/demos/clinica-dental-premium/index.html",
    gradient: "linear-gradient(160deg,#0a1e3d,#1d5fb8 55%,#081428)",
    features: [
      "Cita previa online con formulario validado",
      "6 tratamientos con ficha propia",
      "Equipo de especialistas",
      "Urgencias 24h y financiación",
      "Preguntas frecuentes (acordeón)",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}02`,
    categorySlug: "agencia-viajes",
    title: "Agencia de Viajes Premium",
    slug: "agencia-viajes-premium",
    short_description: "Agencia de viajes con buscador, destinos, paquetes y planificación a medida.",
    full_description:
      "Para agencias de viajes y turoperadores: buscador de viajes, carrusel de destinos destacados con precios y valoraciones, tarjetas de cruceros y ofertas, 8 tipos de viaje filtrables, paquetes preparados, testimonios, preguntas frecuentes, blog y formulario de propuesta a medida con validación. Paleta verde azulado + coral, tipografía Playfair Display.",
    price_cents: 21900,
    preview_url: "/demos/agencia-viajes-premium/index.html",
    gradient: "linear-gradient(160deg,#0b3b3c,#1a5f60 55%,#08292a)",
    features: [
      "Buscador de viajes funcional",
      "Carrusel de destinos con valoraciones",
      "8 tipos de viaje filtrables",
      "Paquetes y ofertas destacadas",
      "Formulario de propuesta con validación",
      "Preguntas frecuentes y blog",
      RESPONSIVE,
      SEO,
    ],
  },
];

/** Degradado por slug — respaldo de miniatura en las tarjetas. */
export const templateGradients: Record<string, string> = Object.fromEntries(
  seed.map((t) => [t.slug, t.gradient]),
);

export const seedTemplates: TemplateWithCategory[] = seed.map((t) => ({
  id: t.id,
  category_id: byslug(t.categorySlug).id,
  title: t.title,
  slug: t.slug,
  short_description: t.short_description,
  full_description: t.full_description,
  price_cents: t.price_cents,
  preview_url: t.preview_url,
  // Maqueta del diseño real, generada por scripts/generate-thumbnails.mjs.
  thumbnail_url: `/thumbnails/${t.slug}.jpg`,
  features: t.features,
  file_url: null,
  status: "published",
  category: byslug(t.categorySlug),
}));

import type { Category, TemplateWithCategory } from "@/lib/types";

/**
 * Catálogo de ejemplo.
 *
 * Cumple dos funciones:
 *  1. Es la fuente de `supabase/seed.sql` (mismos ids y slugs).
 *  2. Alimenta la vitrine cuando todavía no hay Supabase configurado,
 *     para poder ver y revisar el sitio antes de crear las cuentas.
 */

export const seedCategories: Category[] = [
  { id: "11111111-1111-4111-8111-000000000001", name: "Barberías", slug: "barberias", icon: "💈" },
  { id: "11111111-1111-4111-8111-000000000002", name: "Cafeterías", slug: "cafeterias", icon: "☕" },
  { id: "11111111-1111-4111-8111-000000000003", name: "Restaurantes", slug: "restaurantes", icon: "🍽️" },
  { id: "11111111-1111-4111-8111-000000000004", name: "Tiendas de ropa", slug: "ropa", icon: "👕" },
  { id: "11111111-1111-4111-8111-000000000005", name: "Prod. de limpieza", slug: "limpieza", icon: "🧴" },
  { id: "11111111-1111-4111-8111-000000000006", name: "Belleza", slug: "belleza", icon: "💆" },
  { id: "11111111-1111-4111-8111-000000000007", name: "Servicios profesionales", slug: "servicios", icon: "💼" },
  { id: "11111111-1111-4111-8111-000000000008", name: "E-commerce", slug: "ecommerce", icon: "🛍️" },
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
  /** Degradado usado como miniatura mientras no hay imagen subida. */
  gradient: string;
  features: string[];
}

const seed: SeedTemplate[] = [
  {
    id: "22222222-2222-4222-8222-000000000001",
    categorySlug: "barberias",
    title: "Barbería Premium",
    slug: "barberia-premium",
    short_description: "Diseño moderno y elegante con reservas integradas y galería de trabajos.",
    full_description:
      "Diseño moderno y elegante, perfecto para barberías que quieren destacar online y llenar su agenda de reservas. Incluye página de inicio con hero de impacto, listado de servicios con precios, presentación del equipo, galería de trabajos, testimonios y formulario de contacto con botón directo de WhatsApp.",
    price_cents: 14900,
    preview_url: "/demos/barberia/index.html",
    gradient: "linear-gradient(160deg,#12100b,#1c1712 55%,#0c0a08)",
    features: [
      "Diseño 100% personalizable",
      "Responsive (móvil, tablet y desktop)",
      "Sistema de reservas integrado",
      "Galería de trabajos",
      "Botón directo de WhatsApp",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000002",
    categorySlug: "barberias",
    title: "Barbería Clásica",
    slug: "barberia-clasica",
    short_description: "Estilo vintage, ideal para barberías tradicionales con historia.",
    full_description:
      "Estética vintage con tipografía de máquina de escribir y paleta cálida. Pensada para barberías tradicionales que quieren transmitir oficio y años de experiencia sin renunciar a una web rápida y moderna.",
    price_cents: 13900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#1b1512,#2a1f18 55%,#100c0a)",
    features: [
      "Diseño 100% personalizable",
      "Responsive (móvil, tablet y desktop)",
      "Sección de historia de la barbería",
      "Lista de precios por servicio",
      "Mapa de ubicación integrado",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000003",
    categorySlug: "cafeterias",
    title: "Cafetería Artesanal",
    slug: "cafeteria-artesanal",
    short_description: "Menú digital, pedidos online y ambiente cálido para cafeterías boutique.",
    full_description:
      "Pensada para cafeterías de especialidad: carta digital por categorías, historia del tostado, galería del local y formulario de reserva. Ambiente cálido, tipografía amable y fotografía como protagonista.",
    price_cents: 12900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#231a10,#3a2a16 55%,#1c140b)",
    features: [
      "Menú digital editable",
      "Pedidos online por WhatsApp",
      "Galería del local",
      "Horarios y ubicación",
      "Responsive (móvil, tablet y desktop)",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000004",
    categorySlug: "restaurantes",
    title: "Restaurante Gourmet",
    slug: "restaurante-gourmet",
    short_description: "Carta interactiva, reservas de mesa y sección de eventos privados.",
    full_description:
      "Plantilla premium para restaurantes: carta interactiva con filtros por tipo de plato, reserva de mesa, presentación del chef, sección de eventos privados y galería de sala. Diseño oscuro y elegante que hace destacar la fotografía de los platos.",
    price_cents: 15900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#1a1410,#2c2117 55%,#120d0a)",
    features: [
      "Carta interactiva con filtros",
      "Reserva de mesa online",
      "Sección de eventos privados",
      "Galería de sala y platos",
      "Multi-idioma preparado",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000005",
    categorySlug: "ropa",
    title: "Tienda Urbana",
    slug: "tienda-urbana",
    short_description: "Catálogo de productos, carrito de compra y checkout listo para usar.",
    full_description:
      "Tienda de ropa con catálogo por colecciones, ficha de producto con selector de talla y color, carrito de compra y checkout preparado para conectar con tu pasarela de pago. Estética urbana y limpia.",
    price_cents: 13900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#14171f,#1c2130 55%,#0d1018)",
    features: [
      "Catálogo por colecciones",
      "Ficha de producto con tallas y colores",
      "Carrito de compra",
      "Checkout preparado para pasarela de pago",
      "Responsive (móvil, tablet y desktop)",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000006",
    categorySlug: "limpieza",
    title: "Clean Pro Services",
    slug: "clean-pro-services",
    short_description: "Presenta servicios de limpieza con solicitud de presupuesto en un clic.",
    full_description:
      "Ideal para empresas de limpieza y mantenimiento: listado de servicios con iconos, formulario de presupuesto en varios pasos, zona de cobertura y galería de antes/después. Transmite confianza y profesionalidad.",
    price_cents: 11900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#101a12,#182b1a 55%,#0b120c)",
    features: [
      "Formulario de presupuesto en varios pasos",
      "Listado de servicios con iconos",
      "Galería antes / después",
      "Zona de cobertura",
      "Responsive (móvil, tablet y desktop)",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000007",
    categorySlug: "belleza",
    title: "Studio Belleza",
    slug: "studio-belleza",
    short_description: "Agenda de citas, catálogo de tratamientos y testimonios de clientas.",
    full_description:
      "Plantilla para centros de estética y peluquerías: catálogo de tratamientos con duración y precio, agenda de citas, presentación del equipo y testimonios. Paleta suave y elegante, totalmente editable.",
    price_cents: 13500,
    preview_url: null,
    gradient: "linear-gradient(160deg,#1a1015,#2c1824 55%,#120a0e)",
    features: [
      "Agenda de citas online",
      "Catálogo de tratamientos con precios",
      "Presentación del equipo",
      "Testimonios de clientas",
      "Responsive (móvil, tablet y desktop)",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000008",
    categorySlug: "servicios",
    title: "Consultora Pro",
    slug: "consultora-pro",
    short_description: "Presenta servicios profesionales y agenda consultas online.",
    full_description:
      "Para consultoras, despachos y profesionales independientes: propuesta de valor clara, servicios detallados, casos de éxito, equipo y agenda de consultas. Diseño corporativo sobrio y muy legible.",
    price_cents: 14500,
    preview_url: null,
    gradient: "linear-gradient(160deg,#101522,#182238 55%,#0a0e18)",
    features: [
      "Agenda de consultas online",
      "Sección de casos de éxito",
      "Presentación del equipo",
      "Blog / recursos incluido",
      "Responsive (móvil, tablet y desktop)",
      "Optimizado para Google (SEO)",
    ],
  },
  {
    id: "22222222-2222-4222-8222-000000000009",
    categorySlug: "ecommerce",
    title: "Market Plus",
    slug: "market-plus",
    short_description: "Tienda online completa multi-categoría con pagos integrados.",
    full_description:
      "E-commerce completo multi-categoría: buscador, filtros, ficha de producto, carrito, cupones de descuento y checkout. La plantilla más completa del catálogo, preparada para catálogos grandes.",
    price_cents: 16900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#1c1508,#2e2210 55%,#120d05)",
    features: [
      "Catálogo multi-categoría con buscador",
      "Filtros por precio y atributos",
      "Carrito y cupones de descuento",
      "Checkout preparado para pasarela de pago",
      "Panel de pedidos incluido",
      "Optimizado para Google (SEO)",
    ],
  },
];

/** Degradado por slug — usado como miniatura de respaldo en las tarjetas. */
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
  thumbnail_url: null,
  features: t.features,
  file_url: null,
  status: "published",
  category: byslug(t.categorySlug),
}));

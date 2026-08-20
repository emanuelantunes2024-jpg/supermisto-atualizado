import type { Category, TemplateWithCategory } from "@/lib/types";

/**
 * Catálogo de ejemplo.
 *
 * Cumple dos funciones:
 *  1. Es la fuente de `supabase/seed.sql` (mismos ids y slugs).
 *  2. Alimenta la vitrine cuando todavía no hay Supabase configurado,
 *     para poder ver y revisar el sitio antes de crear las cuentas.
 *
 * Una categoría por oficio. Dentro de cada una conviven varias plantillas
 * de distinto nivel y distinto precio: por ejemplo, en "Restaurantes" está
 * la Premium completa y, más adelante, versiones más sencillas y más
 * baratas. La categoría agrupa; la plantilla es lo que se compra.
 */

const CAT = "11111111-1111-4111-8111-0000000000";

/** Las categorías del catálogo, en el orden de la referencia de marca. */
export const seedCategories: Category[] = [
  { id: `${CAT}01`, name: "Clínica Dental", slug: "clinica-dental", icon: "🦷" },
  { id: `${CAT}02`, name: "Clínica Veterinaria", slug: "clinica-veterinaria", icon: "🐾" },
  { id: `${CAT}03`, name: "Pet Shop", slug: "pet-shop", icon: "🐕" },
  { id: `${CAT}04`, name: "Agencia Inmobiliaria", slug: "inmobiliaria", icon: "🏡" },
  { id: `${CAT}05`, name: "Agencia de Viajes", slug: "agencia-viajes", icon: "✈️" },
  { id: `${CAT}06`, name: "Hotel", slug: "hotel", icon: "🏨" },
  { id: `${CAT}07`, name: "Restaurantes", slug: "restaurante", icon: "🍽️" },
  { id: `${CAT}08`, name: "Panadería", slug: "panaderia", icon: "🥖" },
  { id: `${CAT}09`, name: "Boutique de Moda", slug: "boutique-moda", icon: "👗" },
  { id: `${CAT}10`, name: "Muebles y Decoración", slug: "muebles-decoracion", icon: "🛋️" },
  { id: `${CAT}11`, name: "Taller Mecánico", slug: "taller-mecanico", icon: "🔧" },
  { id: `${CAT}12`, name: "Piezas Automotrices", slug: "piezas-auto", icon: "⚙️" },
  { id: `${CAT}13`, name: "Taller de Motos", slug: "taller-motos", icon: "🏍️" },
  { id: `${CAT}14`, name: "Piezas para Moto", slug: "piezas-moto", icon: "🔩" },
  { id: `${CAT}15`, name: "Pizzería", slug: "pizzeria", icon: "🍕" },
  { id: `${CAT}16`, name: "Materiales de Construcción", slug: "materiales-construccion", icon: "🧱" },
  { id: `${CAT}17`, name: "Obras y Construcción", slug: "obras-construccion", icon: "🏗️" },
  { id: `${CAT}18`, name: "Pesca", slug: "pesca", icon: "🎣" },
  { id: `${CAT}21`, name: "Energía Solar", slug: "energia-solar", icon: "☀️" },
  { id: `${CAT}22`, name: "Mudanzas y Transportes", slug: "mudanzas-transportes", icon: "🚚" },
  { id: `${CAT}23`, name: "Electrónica", slug: "electronica", icon: "📱" },
  { id: `${CAT}24`, name: "Hamburguesería", slug: "hamburgueseria", icon: "🍔" },
  { id: `${CAT}25`, name: "Alquiler de Coches", slug: "alquiler-coches", icon: "🚗" },
  { id: `${CAT}26`, name: "Concesionaria de Automóviles", slug: "concesionaria", icon: "🚘" },
  { id: `${CAT}27`, name: "Instrumentos Musicales", slug: "instrumentos-musicales", icon: "🎸" },
  { id: `${CAT}28`, name: "Perfumería", slug: "perfumeria", icon: "🧴" },
  { id: `${CAT}29`, name: "Relojería", slug: "relojeria", icon: "⌚" },
  { id: `${CAT}30`, name: "Frutería y Verdulería", slug: "fruteria", icon: "🥬" },
  { id: `${CAT}31`, name: "Abogados y Consultoría Legal", slug: "abogados", icon: "⚖️" },
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
    categorySlug: "clinica-dental",
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
  {
    id: `${TPL}03`,
    categorySlug: "abogados",
    title: "Consultoría Legal & Empresarial Premium",
    slug: "consultoria-legal-premium",
    short_description:
      "Despacho de abogados con 10 áreas de especialización, blog jurídico y formulario de consulta.",
    full_description:
      "Para despachos de abogados y consultoras: las 10 áreas más demandadas del derecho con ficha propia (empresarial, laboral, familia, inmobiliario, civil, penal, fiscal, comercial, propiedad intelectual y consultoría), proceso de trabajo en cuatro pasos, opiniones de clientes, blog jurídico, preguntas frecuentes y formulario de consulta con validación. Paleta azul noche + oro, tipografía Playfair Display. No necesita fotos: la balanza de la portada y los iconos de las áreas están dibujados en vectores, así que se ven nítidos en cualquier pantalla y la web carga al instante.",
    price_cents: 24900,
    preview_url: "/demos/consultoria-legal-premium/index.html",
    gradient: "linear-gradient(160deg,#0b1424,#16243d 55%,#080e1a)",
    features: [
      "10 áreas de especialización con icono propio",
      "Formulario de consulta con validación",
      "Proceso de trabajo en cuatro pasos",
      "Blog jurídico y preguntas frecuentes",
      "Botones de WhatsApp, teléfono y email",
      "Sin fotos: todo en vectores, carga al instante",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}04`,
    categorySlug: "restaurante",
    title: "Restaurante Premium",
    slug: "restaurante-premium",
    short_description:
      "Restaurante de cocina de autor: carta con precios, reservas, galería y blog.",
    full_description:
      "Para restaurantes de cocina de autor y locales con carta de vinos: portada con carrusel de fotos, buscador de disponibilidad, seis secciones con foto propia, carta completa agrupada en entrantes, principales y postres con sus precios, cifras del local, opiniones que van rotando solas, galería, blog y formulario de reserva con validación (email, teléfono y fechas pasadas). Paleta negro + terracota + oro, tipografía Playfair Display. El dueño cambia la carta entera desde el panel escribiendo una línea por plato.",
    price_cents: 24900,
    preview_url: "/demos/restaurante-premium/index.html",
    gradient: "linear-gradient(160deg,#141418,#2a2118 55%,#0d0d10)",
    features: [
      "Carta completa con precios, editable línea a línea",
      "Portada con carrusel de hasta 4 fotos",
      "Buscador de disponibilidad y formulario de reserva",
      "Galería de 8 fotos y blog",
      "Opiniones de clientes que rotan solas",
      "Botón de WhatsApp para reservas",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}05`,
    categorySlug: "panaderia",
    title: "Panadería con Pedidos Online",
    slug: "panaderia-premium",
    short_description:
      "Panadería con catálogo de productos, cesta y pedidos que llegan por WhatsApp.",
    full_description:
      "Para panaderías, pastelerías y cafeterías que quieren vender sin depender de las plataformas de reparto: catálogo de productos por categorías con filtros, cesta de la compra que recuerda lo que has elegido aunque cierres la página, elección entre recoger en tienda o entrega a domicilio con su coste y su pedido mínimo, y un formulario que arma el pedido completo y lo manda al WhatsApp del negocio, con productos, cantidades, totales, dirección y hora. Sin comisiones por pedido y sin pasarela de pago que configurar. Paleta crema + ámbar, tipografía Playfair Display.",
    price_cents: 19900,
    preview_url: "/demos/panaderia-premium/index.html",
    gradient: "linear-gradient(160deg,#f8f1e6,#e8a33d 55%,#c9821f)",
    features: [
      "Catálogo de productos con filtros por categoría",
      "Cesta de la compra que no se pierde al cerrar",
      "Recogida en tienda o entrega, con pedido mínimo",
      "El pedido llega entero por WhatsApp",
      "Sin comisiones y sin pasarela que configurar",
      "Horarios, historia del negocio y contacto",
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

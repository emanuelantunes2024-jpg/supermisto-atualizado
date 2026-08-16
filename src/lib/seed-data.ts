import type { Category, TemplateWithCategory } from "@/lib/types";

/**
 * Catálogo de ejemplo.
 *
 * Cumple dos funciones:
 *  1. Es la fuente de `supabase/seed.sql` (mismos ids y slugs).
 *  2. Alimenta la vitrine cuando todavía no hay Supabase configurado,
 *     para poder ver y revisar el sitio antes de crear las cuentas.
 *
 * Las categorías siguen los rubros que más encargan web en Europa:
 * hostelería, belleza, inmobiliaria, salud, turismo rural y autónomos.
 */

const CAT = "11111111-1111-4111-8111-0000000000";

export const seedCategories: Category[] = [
  { id: `${CAT}01`, name: "Peluquería y Belleza", slug: "peluqueria", icon: "💇‍♀️" },
  { id: `${CAT}02`, name: "Barberías", slug: "barberias", icon: "💈" },
  { id: `${CAT}03`, name: "Restaurantes", slug: "restaurantes", icon: "🍽️" },
  { id: `${CAT}04`, name: "Cafeterías y Panaderías", slug: "cafeterias", icon: "☕" },
  { id: `${CAT}05`, name: "Moda y Boutiques", slug: "moda", icon: "👗" },
  { id: `${CAT}06`, name: "Inmobiliarias", slug: "inmobiliarias", icon: "🏡" },
  { id: `${CAT}07`, name: "Clínicas y Salud", slug: "salud", icon: "🩺" },
  { id: `${CAT}08`, name: "Gimnasios y Bienestar", slug: "fitness", icon: "🧘" },
  { id: `${CAT}09`, name: "Turismo y Alojamiento", slug: "turismo", icon: "🏖️" },
  { id: `${CAT}10`, name: "Servicios y Oficios", slug: "servicios", icon: "🔧" },
  { id: `${CAT}11`, name: "Asesorías y Abogados", slug: "asesorias", icon: "⚖️" },
  { id: `${CAT}12`, name: "Tiendas Online", slug: "ecommerce", icon: "🛒" },
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

const seed: SeedTemplate[] = [
  {
    id: `${TPL}01`,
    categorySlug: "peluqueria",
    title: "Salón Élite",
    slug: "salon-elite",
    short_description: "Peluquería femenina con reserva de cita, tarifas por servicio y galería de looks.",
    full_description:
      "Pensada para peluquerías y salones de belleza femeninos que quieren llenar la agenda. Incluye reserva de cita online paso a paso, tarifas separadas por corte, color y tratamientos, galería de looks antes y después, presentación del equipo de estilistas y opiniones de clientas. Estética elegante en tonos nude y dorado.",
    price_cents: 15900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#2a1620,#4a2436 55%,#1a0e14)",
    features: [
      "Reserva de cita online",
      "Tarifas por servicio (corte, color, tratamientos)",
      "Galería de looks antes / después",
      "Ficha de cada estilista",
      "Opiniones de clientas",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}02`,
    categorySlug: "peluqueria",
    title: "Studio Belleza",
    slug: "studio-belleza",
    short_description: "Centro de estética con catálogo de tratamientos y agenda de citas.",
    full_description:
      "Para centros de estética, uñas y cuidado facial: catálogo de tratamientos con duración y precio, agenda de citas, presentación del equipo y testimonios. Paleta suave y elegante, totalmente editable.",
    price_cents: 13500,
    preview_url: null,
    gradient: "linear-gradient(160deg,#1a1015,#2c1824 55%,#120a0e)",
    features: [
      "Agenda de citas online",
      "Catálogo de tratamientos con precios",
      "Presentación del equipo",
      "Testimonios de clientas",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}03`,
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
      RESPONSIVE,
      "Sistema de reservas integrado",
      "Galería de trabajos",
      "Botón directo de WhatsApp",
      SEO,
    ],
  },
  {
    id: `${TPL}04`,
    categorySlug: "barberias",
    title: "Barbería Clásica",
    slug: "barberia-clasica",
    short_description: "Estilo vintage, ideal para barberías tradicionales con historia.",
    full_description:
      "Estética vintage con tipografía clásica y paleta cálida. Pensada para barberías tradicionales que quieren transmitir oficio y años de experiencia sin renunciar a una web rápida y moderna.",
    price_cents: 13900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#1b1512,#2a1f18 55%,#100c0a)",
    features: [
      "Diseño 100% personalizable",
      RESPONSIVE,
      "Sección de historia de la barbería",
      "Lista de precios por servicio",
      "Mapa de ubicación integrado",
      SEO,
    ],
  },
  {
    id: `${TPL}05`,
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
      SEO,
    ],
  },
  {
    id: `${TPL}06`,
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
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}07`,
    categorySlug: "cafeterias",
    title: "Panadería del Horno",
    slug: "panaderia-horno",
    short_description: "Obrador artesano con catálogo de productos y encargos por WhatsApp.",
    full_description:
      "Para panaderías y pastelerías artesanas: catálogo de panes, bollería y tartas con precios, encargos para fechas señaladas, historia del obrador y horarios por local. Tonos cálidos de harina y horno de leña.",
    price_cents: 11900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#2b1e12,#48331d 55%,#1d150c)",
    features: [
      "Catálogo de productos con precios",
      "Encargos por WhatsApp",
      "Tartas por encargo con formulario",
      "Varios locales con horarios",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}08`,
    categorySlug: "moda",
    title: "Boutique Moda",
    slug: "boutique-moda",
    short_description: "Boutique femenina con colecciones por temporada y carrito de compra.",
    full_description:
      "Boutique de moda femenina con portada editorial, colecciones por temporada, ficha de producto con tallas y colores, lista de deseos y carrito de compra. Diseño limpio y elegante donde manda la fotografía de producto.",
    price_cents: 15500,
    preview_url: null,
    gradient: "linear-gradient(160deg,#241a20,#3d2a33 55%,#171016)",
    features: [
      "Colecciones por temporada",
      "Ficha de producto con tallas y colores",
      "Lista de deseos",
      "Carrito y checkout preparado",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}09`,
    categorySlug: "moda",
    title: "Tienda Urbana",
    slug: "tienda-urbana",
    short_description: "Streetwear con lanzamientos por drops y checkout listo para usar.",
    full_description:
      "Tienda de ropa urbana con lanzamientos por drops, catálogo por colecciones, ficha de producto con selector de talla y color, carrito de compra y checkout preparado para conectar con tu pasarela de pago.",
    price_cents: 13900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#14171f,#1c2130 55%,#0d1018)",
    features: [
      "Lanzamientos por drops",
      "Catálogo por colecciones",
      "Carrito de compra",
      "Checkout preparado para pasarela de pago",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}10`,
    categorySlug: "inmobiliarias",
    title: "Inmobiliaria Prime",
    slug: "inmobiliaria-prime",
    short_description: "Portal de propiedades con buscador por zona, precio y habitaciones.",
    full_description:
      "Portal inmobiliario completo: buscador por zona, precio, habitaciones y superficie, ficha de propiedad con galería y plano, formulario de visita, valoración gratuita de tu vivienda y ficha de cada agente. El rubro que más web encarga en España y Portugal.",
    price_cents: 17900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#101a26,#1b2f42 55%,#0a1119)",
    features: [
      "Buscador por zona, precio y habitaciones",
      "Ficha de propiedad con galería y plano",
      "Solicitud de visita",
      "Formulario de valoración gratuita",
      "Ficha de cada agente",
      SEO,
    ],
  },
  {
    id: `${TPL}11`,
    categorySlug: "salud",
    title: "Clínica Dental",
    slug: "clinica-dental",
    short_description: "Clínica con tratamientos, cuadro médico y cita previa online.",
    full_description:
      "Para clínicas dentales, fisioterapia y consultas privadas: tratamientos explicados uno a uno, cuadro médico con titulación, cita previa online, financiación y avisos legales sanitarios. Diseño limpio que transmite confianza.",
    price_cents: 16500,
    preview_url: null,
    gradient: "linear-gradient(160deg,#0d1c26,#12384a 55%,#081319)",
    features: [
      "Cita previa online",
      "Tratamientos explicados uno a uno",
      "Cuadro médico con titulación",
      "Sección de financiación",
      "Preparada para avisos legales sanitarios",
      SEO,
    ],
  },
  {
    id: `${TPL}12`,
    categorySlug: "fitness",
    title: "Studio Fitness",
    slug: "studio-fitness",
    short_description: "Gimnasio y yoga con horario de clases, bonos y alta de socios.",
    full_description:
      "Para gimnasios, boxes y estudios de yoga o pilates: horario semanal de clases, bonos y cuotas comparadas, ficha de entrenadores, reserva de plaza y alta de socio online. Estética enérgica y muy legible en móvil.",
    price_cents: 14500,
    preview_url: null,
    gradient: "linear-gradient(160deg,#141c14,#1f3320 55%,#0b120c)",
    features: [
      "Horario semanal de clases",
      "Bonos y cuotas comparadas",
      "Reserva de plaza en clase",
      "Ficha de entrenadores",
      "Alta de socio online",
      SEO,
    ],
  },
  {
    id: `${TPL}13`,
    categorySlug: "turismo",
    title: "Casa Rural",
    slug: "casa-rural",
    short_description: "Alojamiento rural con calendario de disponibilidad y reserva directa.",
    full_description:
      "Para casas rurales, apartamentos turísticos y pequeños hoteles: calendario de disponibilidad, reserva directa sin comisiones de portales, galería por estancias, qué hacer en la zona y opiniones de huéspedes. Preparada para varios idiomas.",
    price_cents: 16900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#16211c,#274033 55%,#0c1310)",
    features: [
      "Calendario de disponibilidad",
      "Reserva directa sin comisiones",
      "Galería por estancias",
      "Qué hacer en la zona",
      "Multi-idioma preparado",
      SEO,
    ],
  },
  {
    id: `${TPL}14`,
    categorySlug: "servicios",
    title: "Clean Pro Services",
    slug: "clean-pro-services",
    short_description: "Servicios de limpieza y mantenimiento con presupuesto en un clic.",
    full_description:
      "Ideal para empresas de limpieza, reformas y autónomos: listado de servicios con iconos, formulario de presupuesto en varios pasos, zona de cobertura y galería de antes/después. Transmite confianza y profesionalidad.",
    price_cents: 11900,
    preview_url: null,
    gradient: "linear-gradient(160deg,#101a12,#182b1a 55%,#0b120c)",
    features: [
      "Formulario de presupuesto en varios pasos",
      "Listado de servicios con iconos",
      "Galería antes / después",
      "Zona de cobertura",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}15`,
    categorySlug: "asesorias",
    title: "Asesoría & Abogados",
    slug: "asesoria-abogados",
    short_description: "Despacho con áreas de práctica, equipo y primera consulta gratuita.",
    full_description:
      "Para despachos de abogados, gestorías y asesorías fiscales: áreas de práctica detalladas, equipo con colegiación, casos resueltos, primera consulta gratuita y blog de actualidad legal. Diseño corporativo sobrio y muy legible.",
    price_cents: 15500,
    preview_url: null,
    gradient: "linear-gradient(160deg,#101522,#182238 55%,#0a0e18)",
    features: [
      "Áreas de práctica detalladas",
      "Equipo con colegiación",
      "Primera consulta gratuita",
      "Blog de actualidad legal",
      "Formulario de contacto confidencial",
      SEO,
    ],
  },
  {
    id: `${TPL}16`,
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

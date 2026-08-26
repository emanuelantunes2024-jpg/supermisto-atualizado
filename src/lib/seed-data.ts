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
  {
    id: `${TPL}06`,
    categorySlug: "clinica-veterinaria",
    title: "Clínica Veterinaria Premium",
    slug: "veterinaria-premium",
    short_description:
      "Clínica veterinaria con urgencias 24h, planes de salud mensuales y cita online.",
    full_description:
      "Para clínicas veterinarias y centros de salud animal: ocho servicios con ficha propia, franja de urgencias 24 horas con llamada directa, tres planes de salud por cuota mensual (cachorro, adulto y sénior) con el plan destacado resaltado en color, equipo con su especialidad, formulario de cita que pregunta qué animal es y valida teléfono, correo y fechas pasadas, opiniones y preguntas frecuentes. Paleta verde + melocotón, tipografía Playfair Display. No necesita fotos: la portada dibuja un perro y un gato ilustrados, los servicios llevan iconos y el equipo se muestra con sus iniciales, así que se ve nítido en cualquier pantalla y carga al instante.",
    price_cents: 22900,
    preview_url: "/demos/veterinaria-premium/index.html",
    gradient: "linear-gradient(160deg,#e3f2ee,#12786a 55%,#0b5a4f)",
    features: [
      "Tres planes de salud por cuota mensual",
      "Franja de urgencias 24h con llamada directa",
      "8 servicios con icono propio",
      "Cita online que pregunta qué animal es",
      "Sin fotos: todo ilustrado, carga al instante",
      "Equipo, opiniones y preguntas frecuentes",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}07`,
    categorySlug: "pet-shop",
    title: "Pet Shop Premium",
    slug: "pet-shop-premium",
    short_description:
      "Tienda de mascotas con catálogo, carrito, favoritos y servicios de peluquería y hotel.",
    full_description:
      "Para tiendas de animales y centros de estética canina: catálogo de productos con etiquetas de oferta y novedad, valoraciones con estrellas, carrito de la compra con favoritos que recuerda lo elegido, ocho categorías filtrables (perros, gatos, pequeños animales...), franja de servicios (baño y peluquería, hotel, guardería, adiestramiento) y pedido que se envía por WhatsApp. Paleta azul petróleo + terracota, tipografía Inter.",
    price_cents: 21900,
    preview_url: "/demos/pet-shop-premium/index.html",
    gradient: "linear-gradient(160deg,#0e4c6b,#3b7a9c 55%,#0a3650)",
    features: [
      "Catálogo con ofertas, novedades y valoraciones",
      "Carrito de la compra con favoritos",
      "8 categorías filtrables",
      "Servicios de peluquería, hotel y guardería",
      "El pedido llega por WhatsApp",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}08`,
    categorySlug: "fruteria",
    title: "Frutería y Verdulería Premium",
    slug: "fruteria-premium",
    short_description: "Frutería online con catálogo de productos frescos, ofertas y carrito de compra.",
    full_description:
      "Para fruterías, verdulerías y tiendas de productos ecológicos: catálogo con ofertas y novedades, ocho categorías filtrables (frutas, verduras, frutos secos, ecológicos...), carrito de la compra con favoritos y pedido que se envía por WhatsApp. Paleta verde + terracota, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios, así que carga al instante.",
    price_cents: 19900,
    preview_url: "/demos/fruteria-premium/index.html",
    gradient: "linear-gradient(160deg,#1f5c3a,#4a9d7f 55%,#123b26)",
    features: [
      "Catálogo con ofertas y novedades",
      "8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}09`,
    categorySlug: "relojeria",
    title: "Relojería Premium",
    slug: "relojeria-premium",
    short_description: "Relojería online con catálogo de marcas, valoraciones y carrito de compra.",
    full_description:
      "Para relojerías y joyerías: catálogo de relojes con etiquetas de oferta y novedad, valoraciones con estrellas, ocho categorías filtrables (hombre, mujer, smartwatch, joyería...), carrito de la compra con favoritos y pedido que se envía por WhatsApp. Paleta azul noche + dorado, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios.",
    price_cents: 21900,
    preview_url: "/demos/relojeria-premium/index.html",
    gradient: "linear-gradient(160deg,#0e4c6b,#e0b64a 55%,#0a3650)",
    features: [
      "Catálogo con ofertas, novedades y valoraciones",
      "8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}10`,
    categorySlug: "piezas-auto",
    title: "Piezas Automotrices Premium",
    slug: "piezas-auto-premium",
    short_description: "Tienda de piezas de automóvil con catálogo, ofertas y carrito de compra.",
    full_description:
      "Para tiendas de recambios y piezas de automóvil: catálogo con descuentos destacados, ocho categorías filtrables (frenos, motor, suspensión, electricidad...), carrito de la compra con favoritos y pedido que se envía por WhatsApp. Paleta roja + gris oscuro, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios.",
    price_cents: 21900,
    preview_url: "/demos/piezas-auto-premium/index.html",
    gradient: "linear-gradient(160deg,#141418,#c0392b 55%,#0d0d10)",
    features: [
      "Catálogo con descuentos destacados",
      "8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}11`,
    categorySlug: "piezas-moto",
    title: "Piezas para Moto Premium",
    slug: "piezas-moto-premium",
    short_description: "Tienda de recambios de moto con catálogo, ofertas y carrito de compra.",
    full_description:
      "Para tiendas de recambios de motocicleta: catálogo con descuentos destacados, ocho categorías filtrables (frenos, motor, escapes, equipación...), carrito de la compra con favoritos y pedido que se envía por WhatsApp. Paleta roja + gris oscuro, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios.",
    price_cents: 19900,
    preview_url: "/demos/piezas-moto-premium/index.html",
    gradient: "linear-gradient(160deg,#141418,#e2694a 55%,#0d0d10)",
    features: [
      "Catálogo con descuentos destacados",
      "8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}12`,
    categorySlug: "muebles-decoracion",
    title: "Muebles y Decoración Premium",
    slug: "muebles-decoracion-premium",
    short_description: "Tienda de muebles y decoración con catálogo, ofertas y carrito de compra.",
    full_description:
      "Para tiendas de muebles y decoración del hogar: catálogo con descuentos destacados, ocho categorías filtrables (salón, dormitorio, iluminación, textiles...), carrito de la compra con favoritos y pedido que se envía por WhatsApp. Paleta terracota + crema, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios.",
    price_cents: 21900,
    preview_url: "/demos/muebles-decoracion-premium/index.html",
    gradient: "linear-gradient(160deg,#8a6bb0,#e2694a 55%,#5a4478)",
    features: [
      "Catálogo con descuentos destacados",
      "8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}13`,
    categorySlug: "perfumeria",
    title: "Perfumería Premium",
    slug: "perfumeria-premium",
    short_description: "Perfumería online con catálogo de fragancias, ofertas y carrito de compra.",
    full_description:
      "Para perfumerías y tiendas de cosmética: catálogo con descuentos destacados, ocho categorías filtrables (mujer, hombre, unisex, cosmética...), carrito de la compra con favoritos y pedido que se envía por WhatsApp. Paleta morada + rosa, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios.",
    price_cents: 19900,
    preview_url: "/demos/perfumeria-premium/index.html",
    gradient: "linear-gradient(160deg,#8a6bb0,#d97ba0 55%,#5a4478)",
    features: [
      "Catálogo con descuentos destacados",
      "8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}14`,
    categorySlug: "pesca",
    title: "Pesca Premium",
    slug: "pesca-premium",
    short_description: "Tienda de artículos de pesca con catálogo, ofertas y carrito de compra.",
    full_description:
      "Para tiendas de artículos de pesca: catálogo con descuentos destacados, ocho categorías filtrables (cañas, carretes, señuelos, ropa...), carrito de la compra con favoritos y pedido que se envía por WhatsApp. Paleta azul + verde, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios.",
    price_cents: 19900,
    preview_url: "/demos/pesca-premium/index.html",
    gradient: "linear-gradient(160deg,#0e4c6b,#4a9d7f 55%,#0a3650)",
    features: [
      "Catálogo con descuentos destacados",
      "8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}15`,
    categorySlug: "energia-solar",
    title: "Energía Solar Premium",
    slug: "energia-solar-premium",
    short_description: "Tienda de energía solar con catálogo de productos y solicitud de presupuesto.",
    full_description:
      "Para instaladoras y tiendas de energía solar: catálogo de placas, inversores, baterías y kits solares, ocho categorías filtrables, carrito de la compra con favoritos y pedido o solicitud de presupuesto que se envía por WhatsApp. Paleta azul noche + amarillo solar, tipografía Inter. No necesita fotos de producto: todo se muestra con iconos propios.",
    price_cents: 22900,
    preview_url: "/demos/energia-solar-premium/index.html",
    gradient: "linear-gradient(160deg,#0e4c6b,#e0a838 55%,#0a3650)",
    features: [
      "Catálogo con 8 categorías filtrables",
      "Carrito de la compra con favoritos",
      "El pedido o presupuesto llega por WhatsApp",
      "Sin fotos: todo ilustrado, carga al instante",
      "Newsletter y franja de confianza",
      "Pensado para instaladoras y tiendas técnicas",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}16`,
    categorySlug: "taller-mecanico",
    title: "Taller Mecánico Premium",
    slug: "taller-mecanico-premium",
    short_description: "Taller mecánico con cita online, 10 servicios y formulario de presupuesto.",
    full_description:
      "Para talleres mecánicos y centros de diagnóstico: diez áreas de servicio con ficha propia (diagnóstico electrónico, frenos, neumáticos, ITV...), proceso de trabajo en cuatro pasos, cifras del taller, opiniones de clientes, blog y formulario de cita con validación. Paleta azul noche + dorado, tipografía Playfair Display. No necesita fotos: todo en vectores, carga al instante.",
    price_cents: 22900,
    preview_url: "/demos/taller-mecanico-premium/index.html",
    gradient: "linear-gradient(160deg,#0b1424,#16243d 55%,#080e1a)",
    features: [
      "10 áreas de servicio con icono propio",
      "Formulario de cita con validación",
      "Proceso de trabajo en cuatro pasos",
      "Blog y preguntas frecuentes",
      "Botones de WhatsApp, teléfono y email",
      "Sin fotos: todo en vectores, carga al instante",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}17`,
    categorySlug: "taller-motos",
    title: "Taller de Motos Premium",
    slug: "taller-motos-premium",
    short_description: "Taller de motos con cita online, 10 servicios y formulario de presupuesto.",
    full_description:
      "Para talleres especializados en motocicletas: diez áreas de servicio con ficha propia (mantenimiento, neumáticos, cadena, restauración...), proceso de trabajo en cuatro pasos, cifras del taller, opiniones de clientes, blog y formulario de cita con validación. Paleta azul noche + dorado, tipografía Playfair Display. No necesita fotos: todo en vectores, carga al instante.",
    price_cents: 22900,
    preview_url: "/demos/taller-motos-premium/index.html",
    gradient: "linear-gradient(160deg,#0b1424,#16243d 55%,#080e1a)",
    features: [
      "10 áreas de servicio con icono propio",
      "Formulario de cita con validación",
      "Proceso de trabajo en cuatro pasos",
      "Blog y preguntas frecuentes",
      "Botones de WhatsApp, teléfono y email",
      "Sin fotos: todo en vectores, carga al instante",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}18`,
    categorySlug: "mudanzas-transportes",
    title: "Mudanzas y Transportes Premium",
    slug: "mudanzas-transportes-premium",
    short_description: "Empresa de mudanzas con 10 servicios y formulario de solicitud de presupuesto.",
    full_description:
      "Para empresas de mudanzas y transporte: diez áreas de servicio con ficha propia (mudanzas particulares, internacionales, guarda-muebles...), proceso de trabajo en cuatro pasos, cifras de la empresa, opiniones de clientes, blog y formulario de presupuesto con validación. Paleta azul noche + dorado, tipografía Playfair Display. No necesita fotos: todo en vectores, carga al instante.",
    price_cents: 22900,
    preview_url: "/demos/mudanzas-transportes-premium/index.html",
    gradient: "linear-gradient(160deg,#0b1424,#16243d 55%,#080e1a)",
    features: [
      "10 áreas de servicio con icono propio",
      "Formulario de presupuesto con validación",
      "Proceso de trabajo en cuatro pasos",
      "Blog y preguntas frecuentes",
      "Botones de WhatsApp, teléfono y email",
      "Sin fotos: todo en vectores, carga al instante",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}19`,
    categorySlug: "obras-construccion",
    title: "Obras y Construcción Premium",
    slug: "obras-construccion-premium",
    short_description: "Empresa de construcción con 10 servicios y formulario de solicitud de presupuesto.",
    full_description:
      "Para empresas de obras y construcción: diez áreas de servicio con ficha propia (reformas integrales, obra nueva, rehabilitación...), proceso de trabajo en cuatro pasos, cifras de la empresa, opiniones de clientes, blog y formulario de presupuesto con validación. Paleta azul noche + dorado, tipografía Playfair Display. No necesita fotos: todo en vectores, carga al instante.",
    price_cents: 24900,
    preview_url: "/demos/obras-construccion-premium/index.html",
    gradient: "linear-gradient(160deg,#0b1424,#16243d 55%,#080e1a)",
    features: [
      "10 áreas de servicio con icono propio",
      "Formulario de presupuesto con validación",
      "Proceso de trabajo en cuatro pasos",
      "Blog y preguntas frecuentes",
      "Botones de WhatsApp, teléfono y email",
      "Sin fotos: todo en vectores, carga al instante",
      RESPONSIVE,
      SEO,
    ],
  },
  {
    id: `${TPL}20`,
    categorySlug: "pizzeria",
    title: "Pizzería Premium",
    slug: "pizzeria-premium",
    short_description: "Pizzería con pedidos online, cesta de la compra y entrega o recogida en tienda.",
    full_description:
      "Para pizzerías y restaurantes italianos que quieren vender sin depender de las plataformas de reparto: catálogo de pizzas por categorías con filtros, cesta de la compra que recuerda lo elegido, elección entre recoger en tienda o entrega a domicilio con su coste y su pedido mínimo, y un formulario que arma el pedido completo y lo manda al WhatsApp del negocio. Sin comisiones por pedido. Paleta negro + rojo italiano, tipografía Playfair Display.",
    price_cents: 19900,
    preview_url: "/demos/pizzeria-premium/index.html",
    gradient: "linear-gradient(160deg,#1a1210,#c0392b 55%,#0d0d0d)",
    features: [
      "Catálogo de pizzas con filtros por categoría",
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

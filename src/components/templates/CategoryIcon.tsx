/**
 * Iconos de línea dorados de las categorías.
 *
 * Es la única fuente de iconos del catálogo: la franja de la portada, el
 * filtro y las tarjetas usan estos trazos, nunca emojis.
 *
 * Cómo se elige el icono, en este orden:
 *   1. Por el slug exacto de la categoría (`bySlug`). Es lo que manda: cada
 *      una de las categorías del catálogo tiene su dibujo propio.
 *   2. Si el slug no está en la lista (categoría nueva, escrita a mano desde
 *      el panel), se busca por palabras del nombre o del slug (`rules`), en
 *      español y en portugués.
 *   3. Si tampoco encaja, una etiqueta genérica.
 *
 * Así una categoría nueva nunca sale sin icono, pero las del catálogo llevan
 * siempre el suyo y no el que más se le parezca.
 */

type Icon = React.ReactNode;

/* ------------------------------------------------------------------ */
/*  Salud                                                              */
/* ------------------------------------------------------------------ */

const diente: Icon = (
  <>
    <path d="M12 5.4C10.6 4.2 9 3.5 7.4 3.5 5.2 3.5 3.5 5.4 3.5 8c0 1.5.4 2.7.8 4 .5 1.7.7 3 .9 4.6.2 1.6.6 3.9 2 3.9 1.3 0 1.6-1.8 1.9-3.6.3-1.7.6-3 2.9-3s2.6 1.3 2.9 3c.3 1.8.6 3.6 1.9 3.6 1.4 0 1.8-2.3 2-3.9.2-1.6.4-2.9.9-4.6.4-1.3.8-2.5.8-4 0-2.6-1.7-4.5-3.9-4.5-1.6 0-3.2.7-4.6 1.9z" />
  </>
);

const veterinaria: Icon = (
  <>
    <path d="M12 20.8S3.2 15.4 3.2 9.4A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8.8 2.3c0 6-8.8 11.4-8.8 11.4z" />
    <ellipse cx="12" cy="14.2" rx="2.1" ry="1.7" />
    <ellipse cx="9.2" cy="11.5" rx="1" ry="1.3" />
    <ellipse cx="14.8" cy="11.5" rx="1" ry="1.3" />
    <ellipse cx="11" cy="9.8" rx=".9" ry="1.2" />
    <ellipse cx="13.4" cy="9.9" rx=".8" ry="1.1" />
  </>
);

const huella: Icon = (
  <>
    <ellipse cx="12" cy="16" rx="4" ry="3.5" />
    <ellipse cx="6.5" cy="10.5" rx="2" ry="2.6" />
    <ellipse cx="17.5" cy="10.5" rx="2" ry="2.6" />
    <ellipse cx="10" cy="6.5" rx="1.8" ry="2.4" />
    <ellipse cx="15.5" cy="7" rx="1.6" ry="2.2" />
  </>
);

/* ------------------------------------------------------------------ */
/*  Casa y viajes                                                      */
/* ------------------------------------------------------------------ */

const casaLlave: Icon = (
  <>
    <path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1H12" />
    <circle cx="7.5" cy="16" r="2.2" />
    <path d="M9.3 17.2 12.5 20l1-1 1 1 1.5-1.5-3.4-3" />
  </>
);

const avion: Icon = (
  <>
    <path d="M12 2.4c1 0 1.7 1.4 1.7 3.1v4.1l7.6 4.4v2.3l-7.6-2.4v4.5l2.4 1.8v1.6L12 20.5l-4.1 1.3v-1.6l2.4-1.8v-4.5l-7.6 2.4v-2.3l7.6-4.4V5.5c0-1.7.7-3.1 1.7-3.1z" />
  </>
);

const cama: Icon = (
  <>
    <path d="M3 20v-9M3 15h18v5M21 20v-5" />
    <path d="M6.5 11V8.5h11V11" />
    <circle cx="8" cy="12.8" r="1.6" />
  </>
);

const camion: Icon = (
  <>
    <path d="M2.5 6.5h10.5v10H2.5z" />
    <path d="M13 9.5h4l3.5 3.5v3.5H13z" />
    <circle cx="7" cy="18.5" r="1.9" />
    <circle cx="17" cy="18.5" r="1.9" />
  </>
);

/* ------------------------------------------------------------------ */
/*  Comida                                                             */
/* ------------------------------------------------------------------ */

const cubiertos: Icon = (
  <>
    <path d="M7 3v8M4.5 3v4a2.5 2.5 0 0 0 5 0V3M7 11v10" />
    <path d="M17.5 3c-1.4 1.4-2 3-2 5s.6 3 2 3.4V21" />
  </>
);

const cloche: Icon = (
  <>
    <path d="M2.5 18h19" />
    <path d="M4.5 15a7.5 7.5 0 0 1 15 0" />
    <path d="M12 7.5V6" />
    <circle cx="12" cy="5" r="1.2" />
    <path d="M2.5 18v1.5h19V18" />
  </>
);

const copa: Icon = (
  <>
    <path d="M6.5 3.5h11l-.7 5.2a4.8 4.8 0 0 1-9.6 0z" />
    <path d="M12 13.5V20M8.5 20h7" />
  </>
);

const pan: Icon = (
  <>
    <path d="M4.2 11.5c-1.2-1-1.2-2.8 0-3.8l2-1.7a3 3 0 0 1 2-.7h7.6a3 3 0 0 1 2 .7l2 1.7c1.2 1 1.2 2.8 0 3.8l-1.2 1v5.7a1.5 1.5 0 0 1-1.5 1.5H6.9a1.5 1.5 0 0 1-1.5-1.5v-5.7z" />
    <path d="M9.5 6v5.5M14.5 6v5.5" />
  </>
);

const pizza: Icon = (
  <>
    <path d="M12 3 3.5 20.5l8.5-2.2 8.5 2.2z" />
    <circle cx="10" cy="12" r="1.1" />
    <circle cx="14" cy="13.5" r="1.1" />
    <circle cx="12" cy="8" r="1" />
  </>
);

const hamburguesa: Icon = (
  <>
    <path d="M3 9a9 5.5 0 0 1 18 0z" />
    <path d="M3 12.5h18" />
    <path d="M3.5 15.5h17a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4z" />
  </>
);

const manzana: Icon = (
  <>
    <path d="M12 8c-1.3-1.3-3-1.6-4.6-1C5.4 7.8 4 9.9 4 12.7c0 4 2.7 8 5 8 1 0 1.9-.6 3-.6s2 .6 3 .6c2.3 0 5-4 5-8 0-2.8-1.4-4.9-3.4-5.7-1.6-.6-3.3-.3-4.6 1z" />
    <path d="M12 8V5.5a2.5 2.5 0 0 1 2.5-2.5" />
  </>
);

const pez: Icon = (
  <>
    <path d="M2.5 12c2.8-3.6 6-5.4 9.5-5.4s6.7 1.8 9.5 5.4c-2.8 3.6-6 5.4-9.5 5.4S5.3 15.6 2.5 12z" />
    <circle cx="7.5" cy="12" r="1.1" />
    <path d="M17 8.5V6M17 15.5V18" />
  </>
);

/* ------------------------------------------------------------------ */
/*  Tienda y moda                                                      */
/* ------------------------------------------------------------------ */

const vestido: Icon = (
  <>
    <path d="M6 8.5 9.5 4h5L18 8.5 15.5 10v10h-7V10z" />
    <path d="M9.5 4a2.5 2.5 0 0 0 5 0" />
  </>
);

const sillon: Icon = (
  <>
    <path d="M5 11V8a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 8v3" />
    <path d="M3.5 11a2 2 0 0 1 2 2v3h13v-3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5.5h-21V13a2 2 0 0 1 2-2z" />
    <path d="M5 21v-1.5M19 21v-1.5" />
  </>
);

const perfume: Icon = (
  <>
    <path d="M9 7.5h6a3 3 0 0 1 3 3v7.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 18v-7.5a3 3 0 0 1 3-3z" />
    <path d="M10 7.5V5.5h4v2" />
    <path d="M14 3.5h3v2" />
    <path d="M9 12.5h6" />
  </>
);

const reloj: Icon = (
  <>
    <circle cx="12" cy="12" r="5.5" />
    <path d="M12 9.5V12l1.8 1.2" />
    <path d="M9 6.8 9.5 3h5l.5 3.8M9 17.2 9.5 21h5l.5-3.8" />
  </>
);

const carrito: Icon = (
  <>
    <circle cx="10" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3.5h2.8l2.4 11h11l2-8H6.6" />
  </>
);

/* ------------------------------------------------------------------ */
/*  Motor                                                              */
/* ------------------------------------------------------------------ */

const llave: Icon = (
  <>
    <path d="M15.5 3.5a5 5 0 0 0-4.4 7.4L3.5 18.5 5.5 20.5l7.6-7.6a5 5 0 0 0 6.4-6.6L16.8 9 15 7.2l2.7-2.7a5 5 0 0 0-2.2-1z" />
  </>
);

const coche: Icon = (
  <>
    <path d="M4 16v-3l1.8-4.4A2 2 0 0 1 7.7 7h8.6a2 2 0 0 1 1.9 1.6L20 13v3" />
    <path d="M3 16h18v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16M7.5 16v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V16" />
    <path d="M6.5 13h11" />
  </>
);

const cocheLlave: Icon = (
  <>
    <path d="M3 14.5v-2.5l1.6-4A1.8 1.8 0 0 1 6.3 7h7.4a1.8 1.8 0 0 1 1.7 1l1.6 4v2.5" />
    <path d="M2.5 14.5h15v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-2M6 14.5v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2" />
    <circle cx="19" cy="17" r="2.3" />
    <path d="M20.6 18.6 22.5 20.5" />
  </>
);

const engranaje: Icon = (
  <>
    <path d="M13.9 2.6h-3.8l-.4 2.5c-.6.2-1.2.4-1.8.7L5.8 4.3 3.1 7l1.5 2.1c-.3.6-.5 1.2-.7 1.8l-2.5.4v3.8l2.5.4c.2.6.4 1.2.7 1.8L3.1 19.3l2.7 2.7 2.1-1.5c.6.3 1.2.5 1.8.7l.4 2.5h3.8l.4-2.5c.6-.2 1.2-.4 1.8-.7l2.1 1.5 2.7-2.7-1.5-2.1c.3-.6.5-1.2.7-1.8l2.5-.4v-3.8l-2.5-.4c-.2-.6-.4-1.2-.7-1.8L20.9 7l-2.7-2.7-2.1 1.5c-.6-.3-1.2-.5-1.8-.7z" />
    <circle cx="12" cy="13.1" r="3" />
  </>
);

const moto: Icon = (
  <>
    <circle cx="5.2" cy="16.9" r="3.5" />
    <circle cx="18.8" cy="16.9" r="3.5" />
    <rect x="8.6" y="12.2" width="5" height="3.6" rx="1.1" />
    <path d="M5.2 16.9h3.4" />
    <path d="M13.6 15.6h1.7l2.3-3.2" />
    <path d="M9.4 12.2 7.9 9.3h4.8l1.4 2.9" />
    <path d="M13.6 9.3h2.7l1.6 2.6" />
    <path d="M15.8 7.6h4.1" />
  </>
);

const casco: Icon = (
  <>
    <path d="M3.5 13.5a8.5 8.5 0 0 1 17 0v1.7a2 2 0 0 1-2 2H12l-6 2.3a2.5 2.5 0 0 1-2.5-2.3z" />
    <path d="M9 13.5h11.4" />
  </>
);

/* ------------------------------------------------------------------ */
/*  Obra, energía y oficio                                             */
/* ------------------------------------------------------------------ */

const ladrillos: Icon = (
  <>
    <rect x="2.5" y="5" width="19" height="4.5" rx="1" />
    <rect x="2.5" y="9.5" width="19" height="4.5" rx="1" />
    <rect x="2.5" y="14" width="19" height="4.5" rx="1" />
    <path d="M9 5v4.5M15 5v4.5M6 9.5V14M12 9.5V14M18 9.5V14M9 14v4.5M15 14v4.5" />
  </>
);

const grua: Icon = (
  <>
    <path d="M2.5 21h19" />
    <path d="M8 21V6.5M10 21V6.5" />
    <path d="M3 6.5h17" />
    <path d="M9 3.2 3 6.5h12z" />
    <path d="M16.5 6.5v4.2" />
    <rect x="14.8" y="10.7" width="3.4" height="2.8" rx=".5" />
  </>
);

const sol: Icon = (
  <>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M12 1.8v1.6M12 12.6v1.4M5.6 8H4M20 8h-1.6M7.5 3.5 6.4 2.4M17.6 2.4l-1.1 1.1M7.5 12.5l-1.1 1.1M16.5 12.5l1.1 1.1" />
    <path d="M4 21.5 6.5 16h11l2.5 5.5z" />
    <path d="M5.2 19h13.6M11 16v5.5" />
  </>
);

const movil: Icon = (
  <>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M10.5 5.5h3M11 18.5h2" />
  </>
);

const guitarra: Icon = (
  <>
    <rect x="10.7" y="2.2" width="2.6" height="2.5" rx=".7" />
    <path d="M11.2 3.4h-1M13.8 3.4h1" />
    <path d="M12 4.7v5.6" />
    <path d="M10.1 10.3h3.8" />
    <path d="M12 10.3c-2 0-3.4 1-3.4 2.4 0 .8.6 1.4.6 2.1 0 .8-1 1.2-1.6 2-.6.7-.9 1.6-.9 2.5 0 2.1 2.1 3.4 5.3 3.4s5.3-1.3 5.3-3.4c0-.9-.3-1.8-.9-2.5-.6-.8-1.6-1.2-1.6-2 0-.7.6-1.3.6-2.1 0-1.4-1.4-2.4-3.4-2.4z" />
    <circle cx="12" cy="17.4" r="1.5" />
  </>
);

const balanza: Icon = (
  <>
    <path d="M12 3.5v17M7.5 20.5h9" />
    <path d="M3.5 8h17" />
    <path d="M3.5 8 1 14a2.5 2.5 0 0 0 5 0zM20.5 8 18 14a2.5 2.5 0 0 0 5 0z" />
  </>
);

/* ------------------------------------------------------------------ */
/*  Marketplace general (categorías "paraguas")                        */
/* ------------------------------------------------------------------ */

const maletin: Icon = (
  <>
    <rect x="3" y="7.5" width="18" height="12" rx="2" />
    <path d="M8.5 7.5V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
    <path d="M3 12.5h18" />
  </>
);

const marco: Icon = (
  <>
    <rect x="3" y="3.5" width="18" height="17" rx="1.5" />
    <circle cx="9" cy="10" r="2" />
    <path d="M4 18.5 9.5 13l3.5 3.5 3-3 4 5" />
  </>
);

const periodico: Icon = (
  <>
    <path d="M4 4.5h13a2.5 2.5 0 0 1 2.5 2.5v11.5H6.5A2.5 2.5 0 0 1 4 16z" />
    <path d="M19.5 18.5a2.5 2.5 0 0 1-2.5-2.5V7" />
    <path d="M7.5 8.5h6M7.5 11.5h6M7.5 14.5h4" />
  </>
);

/* ------------------------------------------------------------------ */
/*  Iconos de respaldo, para categorías escritas a mano                */
/* ------------------------------------------------------------------ */

const cafeteria: Icon = (
  <>
    <path d="M4 8h12v5.5a4.5 4.5 0 0 1-4.5 4.5h-3A4.5 4.5 0 0 1 4 13.5z" />
    <path d="M16 9.5h1.8a2.4 2.4 0 0 1 0 4.8H16" />
    <path d="M4 21h13" />
    <path d="M8 5.2c.6-.7.6-1.4 0-2.2M11.8 5.2c.6-.7.6-1.4 0-2.2" />
  </>
);

const clinica: Icon = (
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M12 8v8M8 12h8" />
  </>
);

const belleza: Icon = (
  <>
    <path d="M12 20.5S3.5 15.5 3.5 9.8A4.8 4.8 0 0 1 12 6.9a4.8 4.8 0 0 1 8.5 2.9c0 5.7-8.5 10.7-8.5 10.7z" />
    <path d="M6.5 12h3l1.5-2.5 2 5 1.5-2.5h3" />
  </>
);

const barberia: Icon = (
  <>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8 16.2 19 4M16 16.2 5 4" />
  </>
);

const gimnasio: Icon = (
  <>
    <path d="M3 9.5v5M6 7v10M18 7v10M21 9.5v5M6 12h12" />
  </>
);

const educacion: Icon = (
  <>
    <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
    <path d="M6.5 10.8V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5.2" />
    <path d="M21.5 8.5v5" />
  </>
);

const eventos: Icon = (
  <>
    <path d="M4 21 12 3l8 18z" />
    <path d="M8.5 13h7" />
  </>
);

/* ------------------------------------------------------------------ */

/**
 * Cada categoría del catálogo con su icono. Es lo primero que se mira,
 * así que aquí nunca hay sorpresas: el slug manda.
 */
const bySlug: Record<string, Icon> = {
  "clinica-dental": diente,
  "clinica-veterinaria": veterinaria,
  "pet-shop": huella,
  inmobiliaria: casaLlave,
  "agencia-viajes": avion,
  hotel: cama,
  restaurante: cubiertos,
  panaderia: pan,
  "boutique-moda": vestido,
  "muebles-decoracion": sillon,
  "taller-mecanico": llave,
  "piezas-auto": engranaje,
  "taller-motos": moto,
  "piezas-moto": casco,
  pizzeria: pizza,
  "materiales-construccion": ladrillos,
  "obras-construccion": grua,
  pesca: pez,
  restaurantes: cloche,
  "restaurante-premium": copa,
  "energia-solar": sol,
  "mudanzas-transportes": camion,
  electronica: movil,
  hamburgueseria: hamburguesa,
  "alquiler-coches": cocheLlave,
  concesionaria: coche,
  "instrumentos-musicales": guitarra,
  perfumeria: perfume,
  relojeria: reloj,
  fruteria: manzana,
  abogados: balanza,
  negocios: maletin,
  "servicios-profesionales": maletin,
  "tienda-online": carrito,
  "salud-belleza": belleza,
  portafolios: marco,
  "blogs-revistas": periodico,
  pdv: carrito,
  combos: maletin,
};

/**
 * Palabras que llevan a cada icono, para categorías que no están arriba.
 * Se buscan dentro del slug y del nombre, sin acentos, en español y portugués.
 * El orden manda: lo más específico primero.
 */
const rules: { icon: Icon; words: string[] }[] = [
  { icon: balanza, words: ["abogad", "advocac", "juridic", "legal", "notari", "asesoria juridica"] },
  { icon: barberia, words: ["barbear", "barberia", "barbero"] },
  { icon: guitarra, words: ["music", "instrument", "guitarr", "piano"] },
  { icon: perfume, words: ["perfum"] },
  { icon: reloj, words: ["reloj", "relogio", "joyeria", "joalheria"] },
  { icon: cafeteria, words: ["cafe", "cafeteria", "padaria", "confeitaria", "pasteleria", "brunch", "heladeria", "sorveteria"] },
  { icon: pan, words: ["panaderia", "pan ", "horno"] },
  { icon: pizza, words: ["pizzeria", "pizzaria", "pizza"] },
  { icon: hamburguesa, words: ["hamburgues", "burger", "lanchonete"] },
  { icon: cubiertos, words: ["restaurante", "comida", "gastronom", "churrasc", "bistro", "tapas"] },
  { icon: belleza, words: ["belleza", "beleza", "estetica", "cabelei", "peluqueria", "salao", "salon", "spa", "unhas"] },
  { icon: gimnasio, words: ["academia", "gimnasio", "fitness", "bienestar", "gym", "crossfit", "pilates", "yoga"] },
  { icon: diente, words: ["dental", "odonto", "dentist"] },
  { icon: clinica, words: ["clinica", "salud", "saude", "medic", "farmacia", "fisio", "psic"] },
  { icon: veterinaria, words: ["veterin"] },
  { icon: huella, words: ["pet", "mascota", "animal"] },
  { icon: casaLlave, words: ["inmobil", "imobil", "imovel", "inmueble", "corretor", "arquitect", "arquitet"] },
  { icon: cama, words: ["hotel", "pousada", "posada", "hostal", "hosped", "turismo"] },
  { icon: avion, words: ["viaje", "viagem", "vuelo"] },
  { icon: sillon, words: ["mueble", "movel", "decorac", "sofa", "interior"] },
  { icon: vestido, words: ["moda", "boutique", "ropa", "roupa", "vestuario"] },
  { icon: manzana, words: ["fruteria", "hortifruti", "verdul", "fruta"] },
  { icon: carrito, words: ["tienda", "loja", "shop", "ecommerce", "e-commerce", "mercado", "supermerc"] },
  { icon: pez, words: ["pesca", "pescad", "marisc"] },
  { icon: sol, words: ["solar", "energia", "fotovolt", "placa"] },
  { icon: camion, words: ["mudanza", "transport", "logistic", "flete", "envio"] },
  { icon: moto, words: ["moto"] },
  { icon: cocheLlave, words: ["alquiler", "aluguel", "rent"] },
  { icon: coche, words: ["auto", "carro", "coche", "concesion", "lava"] },
  { icon: llave, words: ["mecanic", "taller", "oficina", "reparac"] },
  { icon: engranaje, words: ["pieza", "peca", "repuesto", "recambio"] },
  { icon: grua, words: ["obra", "construc", "reforma"] },
  { icon: ladrillos, words: ["material", "marmor", "vidrac", "serralher", "ferreteria"] },
  { icon: educacion, words: ["educa", "escola", "escuela", "curso", "colegio", "idioma", "aula", "formacao"] },
  { icon: movil, words: ["tecnolog", "informatic", "electron", "eletronic", "celular", "software", "assistencia"] },
  { icon: eventos, words: ["evento", "festa", "fiesta", "buffet", "casamento", "boda", "foto"] },
];

/** Trazo de respaldo: una etiqueta, cuando ninguna palabra encaja. */
const fallback: Icon = (
  <>
    <path d="M20.6 13.4 11 3.8V3H4v7h.8l9.6 9.6a1.5 1.5 0 0 0 2.1 0l4.1-4.1a1.5 1.5 0 0 0 0-2.1z" />
    <circle cx="7.5" cy="6.5" r="1" />
  </>
);

/** Quita acentos y pasa a minúscula, para comparar sin sorpresas. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function pickCategoryIcon(slug: string, name?: string): Icon {
  const exacto = bySlug[normalize(slug)];
  if (exacto) return exacto;

  const haystack = `${normalize(slug)} ${normalize(name ?? "")}`;
  const match = rules.find((rule) => rule.words.some((word) => haystack.includes(word)));
  return match?.icon ?? fallback;
}

interface CategoryIconProps {
  slug: string;
  /** El nombre visible ayuda a acertar el icono cuando el slug es opaco. */
  name?: string;
  size?: number;
}

export function CategoryIcon({ slug, name, size = 27 }: CategoryIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {pickCategoryIcon(slug, name)}
    </svg>
  );
}

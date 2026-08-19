/**
 * Iconos de línea dorados de las categorías — los de la referencia de marca.
 *
 * Es la única fuente de iconos del catálogo: la franja de la portada, el
 * filtro y las tarjetas usan estos trazos, nunca emojis.
 *
 * El icono NO se elige por un slug fijo, sino por las palabras del nombre o
 * del slug de la categoría. Así funciona con el catálogo real venga como
 * venga escrito ("Cafés e Padarias", "cafeterias-panaderias", "Barbearias"…)
 * y no hay que tocar código cada vez que se añade una categoría.
 */

type Icon = React.ReactNode;

const restaurante: Icon = (
  <>
    <path d="M7 3v8M4.5 3v4a2.5 2.5 0 0 0 5 0V3M7 11v10" />
    <path d="M17.5 3c-1.4 1.4-2 3-2 5s.6 3 2 3.4V21" />
  </>
);

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

const inmobiliaria: Icon = (
  <>
    <path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
    <path d="M9.5 21v-6h5v6" />
  </>
);

const hotel: Icon = (
  <>
    <path d="M4 20h16M5 20v-6a7 7 0 0 1 14 0v6" />
    <path d="M12 7V4.5" />
  </>
);

const tienda: Icon = (
  <>
    <circle cx="10" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3.5h2.8l2.4 11h11l2-8H6.6" />
  </>
);

const moda: Icon = (
  <>
    <path d="M6 8.5 9.5 4h5L18 8.5 15.5 10v10h-7V10z" />
    <path d="M9.5 4a2.5 2.5 0 0 0 5 0" />
  </>
);

const automotriz: Icon = (
  <>
    <path d="M4 16v-3l1.8-4.4A2 2 0 0 1 7.7 7h8.6a2 2 0 0 1 1.9 1.6L20 13v3" />
    <path d="M3 16h18v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16M7.5 16v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V16" />
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

const mascotas: Icon = (
  <>
    <ellipse cx="12" cy="16" rx="4" ry="3.5" />
    <ellipse cx="6.5" cy="10.5" rx="2" ry="2.6" />
    <ellipse cx="17.5" cy="10.5" rx="2" ry="2.6" />
    <ellipse cx="10" cy="6.5" rx="1.8" ry="2.4" />
    <ellipse cx="15.5" cy="7" rx="1.6" ry="2.2" />
  </>
);

const construccion: Icon = (
  <>
    <path d="M3 20h18" />
    <path d="M5 20V9.5l7-4.5 7 4.5V20" />
    <path d="M9 20v-5h6v5" />
  </>
);

const viajes: Icon = (
  <>
    <path d="M3 14.5 21 8l-2 6.5-9 1.5-2 4-2-1z" />
    <path d="M10 16 8 20" />
  </>
);

const tecnologia: Icon = (
  <>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M10.5 5.5h3M11 18.5h2" />
  </>
);

const eventos: Icon = (
  <>
    <path d="M4 21 12 3l8 18z" />
    <path d="M8.5 13h7" />
  </>
);

/**
 * Palabras que llevan a cada icono. Se buscan dentro del slug y del nombre,
 * sin acentos y en minúscula, en español y en portugués.
 */
const rules: { icon: Icon; words: string[] }[] = [
  // El orden manda: lo más específico primero ("barbearia" no puede caer en
  // la regla del bar, ni "cafeteria" en la de restaurante).
  { icon: barberia, words: ["barbear", "barberia", "barbero"] },
  { icon: cafeteria, words: ["cafe", "cafeteria", "padaria", "panaderia", "confeitaria", "pasteleria", "brunch", "heladeria", "sorveteria"] },
  { icon: restaurante, words: ["restaurante", "pizzeria", "pizzaria", "hamburgues", "lanchonete", "comida", "gastronom", "churrasc"] },
  { icon: belleza, words: ["belleza", "beleza", "estetica", "cabelei", "peluqueria", "salao", "salon", "spa", "unhas", "perfum"] },
  { icon: gimnasio, words: ["academia", "gimnasio", "fitness", "bem-estar", "bienestar", "gym", "crossfit", "pilates", "yoga"] },
  { icon: clinica, words: ["clinica", "salud", "saude", "dental", "odonto", "medic", "farmacia", "fisio", "psic"] },
  { icon: mascotas, words: ["pet", "mascota", "veterin", "animal"] },
  { icon: inmobiliaria, words: ["inmobil", "imobil", "imovel", "inmueble", "corretor", "arquitect", "arquitet"] },
  { icon: hotel, words: ["hotel", "pousada", "posada", "hostal", "hosped", "turismo"] },
  { icon: viajes, words: ["viaje", "viagem", "agencia de viaj"] },
  { icon: moda, words: ["moda", "boutique", "ropa", "roupa", "vestuario", "joyeria", "joalheria", "relojeria"] },
  { icon: tienda, words: ["tienda", "loja", "shop", "ecommerce", "e-commerce", "online", "mercado", "supermerc", "fruteria", "hortifruti"] },
  { icon: automotriz, words: ["auto", "carro", "coche", "mecanic", "moto", "oficina", "taller", "concesion", "lava"] },
  { icon: construccion, words: ["construc", "obra", "reforma", "material", "marmor", "vidrac", "serralher"] },
  { icon: educacion, words: ["educa", "escola", "escuela", "curso", "colegio", "idioma", "aula", "formacao"] },
  { icon: tecnologia, words: ["tecnolog", "informatic", "electron", "eletronic", "celular", "software", "assistencia"] },
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
    .replace(/[\u0300-\u036f]/g, "");
}

export function pickCategoryIcon(slug: string, name?: string): Icon {
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

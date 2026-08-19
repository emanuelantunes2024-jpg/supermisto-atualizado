/** Configuración central del sitio y detección de integraciones disponibles. */

export const siteConfig = {
  name: "Leuname Software",
  shortName: "Leuname",
  tagline: "Sitios web profesionales listos para vender",
  description:
    "Plantillas de sitios web profesionales para barberías, cafeterías, restaurantes y más. Elige, compra y publica en minutos.",
  locale: "es_ES",
  lang: "es",
  currency: "EUR",
  supportEmail: "hola@leunamesoftware.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

/**
 * ─────────────────────────────────────────────────────────────
 *  TU LOGOTIPO
 * ─────────────────────────────────────────────────────────────
 * Por defecto se dibuja el distintivo "LE" + el nombre en texto.
 *
 * Para usar tu logotipo real:
 *   1. Copia el archivo dentro de la carpeta `public/`
 *      (ej. `public/logo.png` — sirve .png, .jpg, .svg o .webp).
 *   2. Cambia `null` por los datos de tu archivo, por ejemplo:
 *
 *        export const brandLogo: BrandLogo = {
 *          src: "/logo.png",
 *          width: 160,
 *          height: 40,
 *          includesName: true,
 *        };
 *
 * `width` y `height` son las medidas reales del archivo en píxeles.
 * `includesName: true` si el logotipo ya lleva escrito "Leuname Software"
 * (así no se repite el nombre al lado); ponlo en `false` si es solo el
 * símbolo y quieres que el nombre siga apareciendo en texto.
 */
export interface BrandLogo {
  src: string;
  width: number;
  height: number;
  includesName: boolean;
}

export const brandLogo: BrandLogo | null = {
  src: "/logo-mark.png",
  width: 492,
  height: 380,
  includesName: false,
};

/**
 * Versión completa del logotipo (símbolo + "LEUNAME SOLUCIONES DIGITALES"),
 * con fondo transparente. Útil para el pie de página, facturas o el email.
 * En la cabecera se usa solo el símbolo porque el logotipo completo quedaría
 * ilegible a 40 px de alto.
 */
export const brandLogoFull = { src: "/logo.png", width: 1042, height: 657 } as const;

/** Menú principal. `soon` marca lo que aún no está a la venta. */
export const mainNav = [
  { href: "/", label: "Inicio" },
  { href: "/plantillas", label: "Categorías" },
  { href: "/pdvs", label: "PDVs", soon: true },
  { href: "/combos", label: "Combos", soon: true },
  { href: "/legal/terminos", label: "Licencias" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/contacto", label: "Soporte" },
  { href: "/contacto", label: "Contacto" },
] as const;

/** Teléfono de atención. Deja "" para ocultarlo de la barra superior. */
export const contactPhone: string = "";

/**
 * Cifras de la banda "Líderes en soluciones digitales premium".
 * EDITA AQUÍ cuando tengas los números reales de clientes y entregas.
 * Deja `value: ""` para que esa columna no se muestre.
 */
export const siteStats: { value: string; label: string }[] = [
  { value: "+30", label: "Categorías\npremium" },
  { value: "", label: "Clientes\nsatisfechos" },
  { value: "", label: "Sitios\nentregados" },
  { value: "", label: "PDVs\ndisponibles" },
  { value: "", label: "Valoración de\nnuestros clientes" },
];

/** Países de la UE + vecinos, para el formulario de compra. */
export const countries = [
  "España",
  "Portugal",
  "Francia",
  "Italia",
  "Alemania",
  "Países Bajos",
  "Bélgica",
  "Austria",
  "Irlanda",
  "Suiza",
  "Reino Unido",
  "Polonia",
  "Suecia",
  "Dinamarca",
  "Grecia",
  "Otro",
] as const;

/**
 * El proyecto arranca sin credenciales: si Supabase o Stripe no están
 * configurados, la vitrine funciona igual con los datos de ejemplo y el
 * checkout avisa en vez de romperse. Así se puede ver el sitio antes de
 * crear las cuentas externas.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const hasSupabaseServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export const isResendConfigured = Boolean(process.env.RESEND_API_KEY);

/** Emails con acceso al panel /admin (además del rol `admin` en la BD). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

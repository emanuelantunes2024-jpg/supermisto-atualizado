/**
 * Iconos de línea dorados de las categorías — los de la referencia de marca.
 *
 * Es la única fuente de iconos del catálogo: la franja de la portada, el
 * filtro y cualquier listado usan estos trazos, nunca emojis.
 */
const paths: Record<string, React.ReactNode> = {
  restaurantes: (
    <>
      <path d="M7 3v8M4.5 3v4a2.5 2.5 0 0 0 5 0V3M7 11v10" />
      <path d="M17.5 3c-1.4 1.4-2 3-2 5s.6 3 2 3.4V21" />
    </>
  ),
  clinicas: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  inmobiliarias: (
    <>
      <path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  hoteles: (
    <>
      <path d="M4 20h16M5 20v-6a7 7 0 0 1 14 0v6" />
      <path d="M12 7V4.5" />
    </>
  ),
  "tiendas-online": (
    <>
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.8l2.4 11h11l2-8H6.6" />
    </>
  ),
  automotriz: (
    <>
      <path d="M4 16v-3l1.8-4.4A2 2 0 0 1 7.7 7h8.6a2 2 0 0 1 1.9 1.6L20 13v3" />
      <path d="M3 16h18v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16M7.5 16v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V16" />
    </>
  ),
  "salud-belleza": (
    <>
      <path d="M12 20.5S3.5 15.5 3.5 9.8A4.8 4.8 0 0 1 12 6.9a4.8 4.8 0 0 1 8.5 2.9c0 5.7-8.5 10.7-8.5 10.7z" />
      <path d="M6.5 12h3l1.5-2.5 2 5 1.5-2.5h3" />
    </>
  ),
  educacion: (
    <>
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
      <path d="M6.5 10.8V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-5.2" />
      <path d="M21.5 8.5v5" />
    </>
  ),
};

/** Trazo de respaldo: una etiqueta, para una categoría sin icono propio. */
const fallback = (
  <>
    <path d="M20.6 13.4 11 3.8V3H4v7h.8l9.6 9.6a1.5 1.5 0 0 0 2.1 0l4.1-4.1a1.5 1.5 0 0 0 0-2.1z" />
    <circle cx="7.5" cy="6.5" r="1" />
  </>
);

export function CategoryIcon({ slug, size = 27 }: { slug: string; size?: number }) {
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
      {paths[slug] ?? fallback}
    </svg>
  );
}

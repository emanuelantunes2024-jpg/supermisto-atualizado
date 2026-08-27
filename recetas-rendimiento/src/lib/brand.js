// Configuración de marca centralizada — un solo lugar para nombre, producto y logo.
// Para reemplazar el logo en el futuro: agregar el archivo a /public/brand/ y cambiar
// `logoSrc` a esa ruta (o dejar en null para usar el emoji de respaldo).

export const BRAND = {
  producto: 'Recetas & Rendimiento',
  empresa: 'Leuname Software',
  // Ruta a un logo-imagen (PNG/SVG) dentro de /public. Si es null, se usa `logoEmoji`.
  logoSrc: null,
  logoEmoji: '👩‍🍳',
};

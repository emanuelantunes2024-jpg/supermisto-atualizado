// Las 11 categorías del libro "Sabores de España" — 207 recetas repartidas
// entre ellas. El emoji funciona como imagen de respaldo (placeholder) en
// cualquier tarjeta que todavía no tenga foto real cargada desde el admin.

export const CATEGORIES = [
  { slug: 'arroces-paellas', name: 'Arroces y Paellas', icon: '🥘', color: '#A8433A' },
  { slug: 'tapas', name: 'Tapas y Aperitivos', icon: '🍤', color: '#D8A02F' },
  { slug: 'sopas-cocidos', name: 'Sopas, Cremas y Cocidos', icon: '🍲', color: '#7A2620' },
  { slug: 'huevos-tortillas', name: 'Huevos y Tortillas', icon: '🍳', color: '#E6B84E' },
  { slug: 'carnes', name: 'Carnes', icon: '🥩', color: '#5E1D18' },
  { slug: 'pescados-mariscos', name: 'Pescados y Mariscos', icon: '🐟', color: '#2F6E8C' },
  { slug: 'legumbres-guisos', name: 'Legumbres y Guisos', icon: '🫘', color: '#8C5A2F' },
  { slug: 'verduras-ensaladas', name: 'Verduras y Ensaladas', icon: '🥗', color: '#4E8C3F' },
  { slug: 'panes-masas', name: 'Panes y Masas Saladas', icon: '🥖', color: '#B45309' },
  { slug: 'postres-dulces', name: 'Postres y Dulces', icon: '🍮', color: '#C97169' },
  { slug: 'bebidas', name: 'Bebidas', icon: '🍷', color: '#7A2620' },
];

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}

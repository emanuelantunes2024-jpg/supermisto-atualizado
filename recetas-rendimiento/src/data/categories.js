export const CATEGORIES = [
  { slug: 'dulces', name: 'Dulces', icon: '🍬', color: '#8B5CF6' },
  { slug: 'pasteles', name: 'Pasteles', icon: '🎂', color: '#EE5A24' },
  { slug: 'postres', name: 'Postres', icon: '🍮', color: '#EC4899' },
  { slug: 'salados', name: 'Salados', icon: '🥟', color: '#EF4444' },
  { slug: 'panes', name: 'Panes', icon: '🍞', color: '#B45309' },
  { slug: 'bebidas', name: 'Bebidas', icon: '🥤', color: '#0EA5E9' },
  { slug: 'para-vender', name: 'Recetas para vender', icon: '💰', color: '#16A34A' },
];

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}

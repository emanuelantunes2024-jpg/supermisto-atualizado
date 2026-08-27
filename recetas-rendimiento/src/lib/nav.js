// Menú lateral — lista plana, en el mismo orden que la referencia visual.
// `key` apunta al diccionario de idiomas (src/lib/i18n.js).

export const NAV_PRINCIPAL = [
  { to: '/', key: 'nav.inicio', icon: 'home', end: true },
  { to: '/recetas', key: 'nav.recetas', icon: 'book' },
  { to: '/categorias', key: 'nav.categorias', icon: 'grid' },
  { to: '/buscar', key: 'nav.buscar', icon: 'search' },
  { to: '/calculadoras', key: 'nav.calculadoras', icon: 'calculator' },
  { to: '/lista-compras', key: 'nav.lista', icon: 'cart' },
  { to: '/central-de-rendimiento', key: 'nav.central', icon: 'trending' },
  { to: '/favoritos', key: 'nav.favoritos', icon: 'heart' },
  { to: '/colecciones', key: 'nav.colecciones', icon: 'folder' },
  { to: '/novedades', key: 'nav.novedades', icon: 'bell' },
  { to: '/mi-plan', key: 'nav.plan', icon: 'crown' },
  { to: '/asistente-ia', key: 'nav.ia', icon: 'sparkles', badgeKey: 'nav.nuevo' },
];

export const NAV_PIE = [
  { to: '/configuracion', key: 'nav.config', icon: 'settings' },
  { to: '/entrar', key: 'nav.salir', icon: 'logout', accion: 'salir' },
];

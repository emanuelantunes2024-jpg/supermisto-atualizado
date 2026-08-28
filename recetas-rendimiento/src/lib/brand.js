// Configuración de marca centralizada — un solo lugar para el nombre y el logo.
// Para cambiar el logo en el futuro: poné el archivo en /public/brand/ y apuntá
// `logoSrc` a esa ruta. Ningún componente tiene el logo escrito a mano.

export const BRAND = {
  // El nombre se muestra en tres líneas, como en la referencia visual.
  prefijo: 'Central de',
  nombreA: 'Receitas',
  nombreB: '& Renda',
  producto: 'Receitas & Renda',
  empresa: 'Leuname Software',
  logoSrc: null,
  // Link de checkout de Hotmart al que mandamos a quien todavía no compró.
  // Reemplazar por la URL real del producto/oferta cuando esté creada en Hotmart.
  hotmartCheckoutUrl: 'https://pay.hotmart.com/',
};

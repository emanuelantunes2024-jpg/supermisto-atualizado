// Favoritos — dato propio de cada visitante (no hace falta que el servidor
// lo sepa), guardado en localStorage. Funciona igual sin conexión.

const CLAVE = 'sabores-espana:favoritos';

function leer() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : [];
  } catch {
    return [];
  }
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent('favoritos:cambio'));
  } catch {
    // localStorage no disponible (modo privado, cuota llena…): no rompe la app.
  }
}

export function obtenerFavoritos() {
  return leer();
}

export function esFavorito(id) {
  return leer().includes(id);
}

export function alternarFavorito(id) {
  const actuales = leer();
  const nuevos = actuales.includes(id)
    ? actuales.filter((x) => x !== id)
    : [...actuales, id];
  guardar(nuevos);
  return nuevos.includes(id);
}

// Capa de persistencia — localStorage funciona como base de datos de la app.
// Estructura organizada para que, en el futuro, se pueda reemplazar por una API real
// sin tocar los componentes (todas las páginas usan solo las funciones de este módulo
// y del StoreContext).

import { RECETAS_SEED } from '../data/recipes.js';

const KEYS = {
  recetas: 'rr.recetas',
  favoritos: 'rr.favoritos',
  colecciones: 'rr.colecciones',
  lista: 'rr.lista-compras',
  compras: 'rr.compras-recetas',
  version: 'rr.seed-version',
};

const SEED_VERSION = '2';

function leer(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function escribir(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento no disponible (modo privado, cuota excedida, etc.)
  }
}

export function inicializarDatos() {
  const versionActual = leer(KEYS.version, null);
  if (versionActual !== SEED_VERSION || !localStorage.getItem(KEYS.recetas)) {
    // Al actualizar el catálogo de demostración se conservan las recetas que
    // haya creado la persona usuaria (las que no pertenecen a la semilla).
    const previas = leer(KEYS.recetas, []);
    const idsSemilla = new Set(RECETAS_SEED.map((r) => r.id));
    const propias = Array.isArray(previas) ? previas.filter((r) => !idsSemilla.has(r.id)) : [];
    escribir(KEYS.recetas, [...propias, ...RECETAS_SEED]);
    escribir(KEYS.version, SEED_VERSION);
  }
  if (!localStorage.getItem(KEYS.favoritos)) escribir(KEYS.favoritos, []);
  if (!localStorage.getItem(KEYS.colecciones)) escribir(KEYS.colecciones, []);
  if (!localStorage.getItem(KEYS.lista)) escribir(KEYS.lista, []);
}

// ---------- Recetas ----------
export function obtenerRecetas() {
  return leer(KEYS.recetas, RECETAS_SEED);
}

export function guardarRecetas(recetas) {
  escribir(KEYS.recetas, recetas);
}

export function guardarReceta(receta) {
  const recetas = obtenerRecetas();
  const idx = recetas.findIndex((r) => r.id === receta.id);
  if (idx >= 0) {
    recetas[idx] = receta;
  } else {
    recetas.unshift(receta);
  }
  guardarRecetas(recetas);
  return recetas;
}

export function eliminarReceta(id) {
  const recetas = obtenerRecetas().filter((r) => r.id !== id);
  guardarRecetas(recetas);
  return recetas;
}

// ---------- Favoritos ----------
export function obtenerFavoritos() {
  return leer(KEYS.favoritos, []);
}

export function alternarFavorito(id) {
  const favoritos = obtenerFavoritos();
  const nuevo = favoritos.includes(id)
    ? favoritos.filter((f) => f !== id)
    : [...favoritos, id];
  escribir(KEYS.favoritos, nuevo);
  return nuevo;
}

// ---------- Colecciones ----------
export function obtenerColecciones() {
  return leer(KEYS.colecciones, []);
}

export function crearColeccion(nombre) {
  const colecciones = obtenerColecciones();
  const nueva = { id: `c${Date.now()}`, nombre, recetaIds: [] };
  const actualizadas = [...colecciones, nueva];
  escribir(KEYS.colecciones, actualizadas);
  return { colecciones: actualizadas, nueva };
}

export function eliminarColeccion(id) {
  const actualizadas = obtenerColecciones().filter((c) => c.id !== id);
  escribir(KEYS.colecciones, actualizadas);
  return actualizadas;
}

export function alternarRecetaEnColeccion(coleccionId, recetaId) {
  const colecciones = obtenerColecciones().map((c) => {
    if (c.id !== coleccionId) return c;
    const tiene = c.recetaIds.includes(recetaId);
    return {
      ...c,
      recetaIds: tiene ? c.recetaIds.filter((r) => r !== recetaId) : [...c.recetaIds, recetaId],
    };
  });
  escribir(KEYS.colecciones, colecciones);
  return colecciones;
}

// ---------- Lista de compras ----------
export function obtenerListaCompras() {
  return leer(KEYS.lista, []);
}

export function agregarAListaCompras(items) {
  const lista = obtenerListaCompras();
  const nuevos = items.map((i) => ({
    id: `i${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    marcado: false,
    ...i,
  }));
  const actualizada = [...lista, ...nuevos];
  escribir(KEYS.lista, actualizada);
  return actualizada;
}

export function alternarItemLista(itemId) {
  const lista = obtenerListaCompras().map((i) =>
    i.id === itemId ? { ...i, marcado: !i.marcado } : i
  );
  escribir(KEYS.lista, lista);
  return lista;
}

export function eliminarItemLista(itemId) {
  const lista = obtenerListaCompras().filter((i) => i.id !== itemId);
  escribir(KEYS.lista, lista);
  return lista;
}

export function vaciarLista() {
  escribir(KEYS.lista, []);
  return [];
}

// ---------- Mis compras por receta ----------
// Cuánto pagó CADA visitante por los ingredientes que compró para una receta.
// Es un dato propio del dispositivo (no del admin, no se comparte entre
// personas): cada quien carga sus propios precios, y con eso la receta
// calcula sola cuánto le costó hacerla y cuánto le sobró.

export function normalizarNombreIngrediente(nombre) {
  return (nombre || '').trim().toLowerCase();
}

export function obtenerComprasReceta(recetaId) {
  const todas = leer(KEYS.compras, {});
  return todas[recetaId] || {};
}

export function guardarCompraIngrediente(recetaId, nombreIngrediente, datos) {
  const todas = leer(KEYS.compras, {});
  const deEstaReceta = { ...(todas[recetaId] || {}) };
  const clave = normalizarNombreIngrediente(nombreIngrediente);
  deEstaReceta[clave] = { ...deEstaReceta[clave], ...datos };
  const actualizadas = { ...todas, [recetaId]: deEstaReceta };
  escribir(KEYS.compras, actualizadas);
  return deEstaReceta;
}

export function borrarComprasReceta(recetaId) {
  const todas = leer(KEYS.compras, {});
  const actualizadas = { ...todas };
  delete actualizadas[recetaId];
  escribir(KEYS.compras, actualizadas);
  return {};
}

// Persistencia del contenido administrable (recetas y categorías) en Redis
// (Upstash) — mismo servicio ya usado para el acceso de Hotmart. Si Redis
// todavía no está configurado, la lectura cae de vuelta al catálogo semilla
// (el sitio público nunca se rompe); la escritura sí exige Redis, porque no
// hay dónde persistir un cambio sin él.

import { redis } from './redis.js';
import { RECETAS_SEED } from '../../src/data/recipes.js';
import { CATEGORIES as CATEGORIAS_SEED } from '../../src/data/categories.js';

const CLAVE_RECETAS = 'contenido:recetas';
const CLAVE_CATEGORIAS = 'contenido:categorias';
const CLAVE_CONFIG_SITIO = 'contenido:config-sitio';
const CLAVE_ETIQUETAS = 'contenido:etiquetas';
const CLAVE_VISTAS = 'contenido:vistas';

// Imágenes de portada por defecto (las que ya traía el diseño original) —
// se usan hasta que el admin suba las suyas propias desde el panel.
const CONFIG_SITIO_POR_DEFECTO = {
  bannerBibliotecaImagen: '/images/hero/torta-chocolate.png',
  bannerNovedadesImagen: '/images/hero/cupcake.png',
};

export async function obtenerRecetasDB() {
  try {
    const guardadas = await redis().get(CLAVE_RECETAS);
    if (Array.isArray(guardadas) && guardadas.length > 0) return guardadas;
    await redis().set(CLAVE_RECETAS, RECETAS_SEED);
    return RECETAS_SEED;
  } catch {
    return RECETAS_SEED;
  }
}

export async function guardarRecetasDB(lista) {
  await redis().set(CLAVE_RECETAS, lista);
  return lista;
}

export async function obtenerCategoriasDB() {
  try {
    const guardadas = await redis().get(CLAVE_CATEGORIAS);
    if (Array.isArray(guardadas) && guardadas.length > 0) return guardadas;
    await redis().set(CLAVE_CATEGORIAS, CATEGORIAS_SEED);
    return CATEGORIAS_SEED;
  } catch {
    return CATEGORIAS_SEED;
  }
}

export async function guardarCategoriasDB(lista) {
  await redis().set(CLAVE_CATEGORIAS, lista);
  return lista;
}

export async function obtenerConfigSitioDB() {
  try {
    const guardada = await redis().get(CLAVE_CONFIG_SITIO);
    if (guardada && typeof guardada === 'object') return { ...CONFIG_SITIO_POR_DEFECTO, ...guardada };
    return CONFIG_SITIO_POR_DEFECTO;
  } catch {
    return CONFIG_SITIO_POR_DEFECTO;
  }
}

export async function guardarConfigSitioDB(config) {
  const actual = await obtenerConfigSitioDB();
  const nueva = { ...actual, ...config };
  await redis().set(CLAVE_CONFIG_SITIO, nueva);
  return nueva;
}

// Etiquetas (tags) libres que el admin arma y aplica a las recetas — el
// cliente después puede filtrar el catálogo por ellas. No hay semilla: el
// admin las va creando desde cero.
export async function obtenerEtiquetasDB() {
  try {
    const guardadas = await redis().get(CLAVE_ETIQUETAS);
    return Array.isArray(guardadas) ? guardadas : [];
  } catch {
    return [];
  }
}

export async function guardarEtiquetasDB(lista) {
  await redis().set(CLAVE_ETIQUETAS, lista);
  return lista;
}

// Conteo de vistas por receta — un contador agregado (sin identificar
// visitantes) que alimenta el reporte de "recetas más vistas". Se guarda en
// un hash de Redis: campo = id de receta, valor = cantidad de vistas.
export async function registrarVistaDB(recetaId) {
  try {
    await redis().hincrby(CLAVE_VISTAS, recetaId, 1);
  } catch {
    // Sin Redis configurado no hay dónde contar — se ignora, no debe romper
    // la carga de la receta para el visitante.
  }
}

export async function obtenerVistasDB() {
  try {
    const mapa = await redis().hgetall(CLAVE_VISTAS);
    return mapa || {};
  } catch {
    return {};
  }
}

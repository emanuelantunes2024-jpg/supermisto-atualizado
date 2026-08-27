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

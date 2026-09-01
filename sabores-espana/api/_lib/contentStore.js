// Ediciones de recetas hechas desde /admin — texto y foto — guardadas
// aparte del catálogo de fábrica (src/data/recipes.js). Se combinan recién
// al mostrarse (ver src/lib/useRecipes.js), así el catálogo de fábrica
// nunca se pierde aunque Redis falle o todavía no esté conectado.
//
// Forma guardada: { [id]: { ...campos editados, esNueva?, publicada? } }

import { redis } from './redis.js';

const CLAVE_OVERRIDES = 'contenido:recetas:overrides';

export async function obtenerOverrides() {
  try {
    const guardados = await redis().get(CLAVE_OVERRIDES);
    return guardados && typeof guardados === 'object' ? guardados : {};
  } catch {
    return {};
  }
}

export async function guardarOverride(id, datos) {
  const actuales = await obtenerOverrides();
  const nuevos = { ...actuales, [id]: { ...actuales[id], ...datos, id } };
  await redis().set(CLAVE_OVERRIDES, nuevos);
  return nuevos[id];
}

// Ediciones de recetas hechas desde /admin — texto y foto — guardadas
// aparte del catálogo de fábrica (src/data/recipes.js). Se combinan recién
// al mostrarse (ver src/lib/useRecipes.js), así el catálogo de fábrica
// nunca se pierde aunque KV falle o todavía no esté conectado.
//
// Forma guardada: { [id]: { ...campos editados, esNueva?, publicada? } }

const CLAVE_OVERRIDES = 'contenido:recetas:overrides';

export async function obtenerOverrides(env) {
  try {
    const crudo = await env.SABORES_KV.get(CLAVE_OVERRIDES);
    if (!crudo) return {};
    const datos = JSON.parse(crudo);
    return datos && typeof datos === 'object' ? datos : {};
  } catch {
    return {};
  }
}

export async function guardarOverride(env, id, datos) {
  const actuales = await obtenerOverrides(env);
  const nuevos = { ...actuales, [id]: { ...actuales[id], ...datos, id } };
  await env.SABORES_KV.put(CLAVE_OVERRIDES, JSON.stringify(nuevos));
  return nuevos[id];
}

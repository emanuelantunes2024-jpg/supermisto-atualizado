// GET público → devuelve las ediciones guardadas desde /admin (overrides).
// El catálogo de fábrica completo ya viaja en el propio bundle del sitio
// (src/data/recipes.js) — acá solo se piden los cambios, para no depender
// de que KV esté configurado para que el sitio funcione.

import { obtenerOverrides } from '../_lib/contentStore.js';
import { json } from '../_lib/http.js';

export async function onRequestGet({ env }) {
  const overrides = await obtenerOverrides(env);
  return json({ ok: true, overrides }, { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } });
}

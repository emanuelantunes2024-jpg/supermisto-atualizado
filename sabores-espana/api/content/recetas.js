// GET público → devuelve las ediciones guardadas desde /admin (overrides).
// El catálogo de fábrica completo ya viaja en el propio bundle del sitio
// (src/data/recipes.js) — acá solo se piden los cambios, para no depender
// de que Redis esté configurado para que el sitio funcione.

import { obtenerOverrides } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  const overrides = await obtenerOverrides();
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).json({ ok: true, overrides });
}

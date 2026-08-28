// GET público — catálogo de recetas persistido (o el catálogo semilla si
// Redis todavía no está configurado). Los mismos datos que hoy viajaban
// embebidos en el bundle de JS, así que no es una superficie nueva de datos
// confidenciales: solo pasan a persistir del lado del servidor.

import { obtenerRecetasDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  const recetas = await obtenerRecetasDB();
  res.status(200).json({ ok: true, recetas });
}

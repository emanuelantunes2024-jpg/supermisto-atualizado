// GET público — catálogo de etiquetas persistido.
import { obtenerEtiquetasDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  const etiquetas = await obtenerEtiquetasDB();
  res.status(200).json({ ok: true, etiquetas });
}

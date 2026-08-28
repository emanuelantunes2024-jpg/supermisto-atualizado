// GET público — catálogo de categorías persistido (o el catálogo semilla).
import { obtenerCategoriasDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  const categorias = await obtenerCategoriasDB();
  res.status(200).json({ ok: true, categorias });
}

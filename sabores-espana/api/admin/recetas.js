// POST { id, data } → guarda (o crea) la edición de una receta. Protegido:
// exige una sesión de admin real y vigente (ver _lib/adminAuth.js).

import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { guardarOverride } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  const admin = await obtenerAdminDeSesion(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const { id, data } = req.body || {};
  if (!id || !data || typeof data !== 'object') {
    res.status(400).json({ ok: false, error: 'datos_invalidos' });
    return;
  }

  try {
    const guardado = await guardarOverride(id, data);
    res.status(200).json({ ok: true, receta: guardado });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'redis_no_configurado', detalle: err.message });
  }
}

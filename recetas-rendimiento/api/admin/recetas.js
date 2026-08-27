// POST (crear/editar, upsert por id) y DELETE (?id=) — protegidos por sesión
// real de administrador, revalidada en cada request (nunca solo en el
// frontend).

import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { obtenerRecetasDB, guardarRecetasDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  const admin = await obtenerAdminDeSesion(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  try {
    if (req.method === 'POST') {
      const receta = req.body;
      if (!receta?.id || !String(receta?.nombre || '').trim() || !receta?.slug) {
        res.status(400).json({ ok: false, error: 'datos_invalidos' });
        return;
      }
      const actuales = await obtenerRecetasDB();
      const idx = actuales.findIndex((r) => r.id === receta.id);
      const nuevas = idx >= 0 ? actuales.map((r, i) => (i === idx ? receta : r)) : [receta, ...actuales];
      await guardarRecetasDB(nuevas);
      res.status(200).json({ ok: true, recetas: nuevas });
      return;
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        res.status(400).json({ ok: false, error: 'id_requerido' });
        return;
      }
      const actuales = await obtenerRecetasDB();
      const nuevas = actuales.filter((r) => r.id !== id);
      await guardarRecetasDB(nuevas);
      res.status(200).json({ ok: true, recetas: nuevas });
      return;
    }

    res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('[admin/recetas]', err);
    res.status(500).json({ ok: false, error: 'error_al_guardar', detalle: err.message });
  }
}

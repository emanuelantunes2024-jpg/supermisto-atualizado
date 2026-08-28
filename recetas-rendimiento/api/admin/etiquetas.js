// POST (crear/editar, upsert por id) y DELETE (?id=) — protegidos por
// sesión real de administrador. A diferencia de las categorías (donde una
// receta tiene una sola), una etiqueta es de "muchos a muchos": al borrarla
// simplemente se la saca de las recetas que la tenían, no hace falta
// bloquear el borrado.
import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { obtenerEtiquetasDB, guardarEtiquetasDB, obtenerRecetasDB, guardarRecetasDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  const admin = await obtenerAdminDeSesion(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  try {
    if (req.method === 'POST') {
      const etiqueta = req.body;
      if (!etiqueta?.id || !String(etiqueta?.nombre || '').trim()) {
        res.status(400).json({ ok: false, error: 'datos_invalidos' });
        return;
      }
      const actuales = await obtenerEtiquetasDB();
      const idx = actuales.findIndex((e) => e.id === etiqueta.id);
      const nuevas = idx >= 0 ? actuales.map((e, i) => (i === idx ? etiqueta : e)) : [...actuales, etiqueta];
      await guardarEtiquetasDB(nuevas);
      res.status(200).json({ ok: true, etiquetas: nuevas });
      return;
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        res.status(400).json({ ok: false, error: 'id_requerido' });
        return;
      }
      const actuales = await obtenerEtiquetasDB();
      const nuevas = actuales.filter((e) => e.id !== id);
      await guardarEtiquetasDB(nuevas);

      // Se saca la etiqueta de cualquier receta que la tuviera asignada.
      const recetas = await obtenerRecetasDB();
      const recetasActualizadas = recetas.map((r) =>
        r.etiquetas?.includes(id) ? { ...r, etiquetas: r.etiquetas.filter((e) => e !== id) } : r
      );
      await guardarRecetasDB(recetasActualizadas);

      res.status(200).json({ ok: true, etiquetas: nuevas });
      return;
    }

    res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('[admin/etiquetas]', err);
    res.status(500).json({ ok: false, error: 'error_al_guardar', detalle: err.message });
  }
}

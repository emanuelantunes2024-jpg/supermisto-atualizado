// POST (crear/editar, upsert por slug) y DELETE (?slug=) — protegidos por
// sesión real de administrador.

import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { obtenerCategoriasDB, guardarCategoriasDB, obtenerRecetasDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  const admin = obtenerAdminDeSesion(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  try {
    if (req.method === 'POST') {
      const categoria = req.body;
      if (!categoria?.slug || !String(categoria?.name || '').trim()) {
        res.status(400).json({ ok: false, error: 'datos_invalidos' });
        return;
      }
      const actuales = await obtenerCategoriasDB();
      const idx = actuales.findIndex((c) => c.slug === categoria.slug);
      const nuevas = idx >= 0 ? actuales.map((c, i) => (i === idx ? categoria : c)) : [...actuales, categoria];
      await guardarCategoriasDB(nuevas);
      res.status(200).json({ ok: true, categorias: nuevas });
      return;
    }

    if (req.method === 'DELETE') {
      const slug = req.query?.slug || req.body?.slug;
      if (!slug) {
        res.status(400).json({ ok: false, error: 'slug_requerido' });
        return;
      }
      const recetas = await obtenerRecetasDB();
      if (recetas.some((r) => r.categoria === slug)) {
        res.status(409).json({ ok: false, error: 'categoria_en_uso' });
        return;
      }
      const actuales = await obtenerCategoriasDB();
      const nuevas = actuales.filter((c) => c.slug !== slug);
      await guardarCategoriasDB(nuevas);
      res.status(200).json({ ok: true, categorias: nuevas });
      return;
    }

    res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('[admin/categorias]', err);
    res.status(500).json({ ok: false, error: 'error_al_guardar', detalle: err.message });
  }
}

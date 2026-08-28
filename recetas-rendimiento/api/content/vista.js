// POST público — registra una vista de receta (contador agregado, sin
// identificar al visitante). Es "mejor esfuerzo": si falla, no debe romper
// la carga de la página para quien la está mirando.
import { registrarVistaDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  const recetaId = req.body?.recetaId;
  if (!recetaId || typeof recetaId !== 'string') {
    res.status(400).json({ ok: false, error: 'receta_id_requerido' });
    return;
  }
  await registrarVistaDB(recetaId);
  res.status(200).json({ ok: true });
}

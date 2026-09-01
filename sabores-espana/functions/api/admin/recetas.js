// POST { id, data } → guarda (o crea) la edición de una receta. Protegido:
// exige una sesión de admin real y vigente (ver _lib/adminAuth.js).

import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { guardarOverride } from '../_lib/contentStore.js';
import { json } from '../_lib/http.js';

export async function onRequestPost({ request, env }) {
  const admin = await obtenerAdminDeSesion(request, env);
  if (!admin) {
    return json({ ok: false, error: 'no_autorizado' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { id, data } = body || {};
  if (!id || !data || typeof data !== 'object') {
    return json({ ok: false, error: 'datos_invalidos' }, { status: 400 });
  }

  try {
    const guardado = await guardarOverride(env, id, data);
    return json({ ok: true, receta: guardado });
  } catch (err) {
    return json({ ok: false, error: 'kv_no_configurado', detalle: err.message }, { status: 500 });
  }
}

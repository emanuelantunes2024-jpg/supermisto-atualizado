// GET → revalida contra KV en cada llamada (no confía solo en la cookie),
// así una cancelación en Hotmart corta el acceso de inmediato.

import { leerSesionMiembro } from '../_lib/cookie.js';
import { obtenerAcceso } from '../_lib/kv.js';
import { accesoConfigurado } from '../_lib/config.js';
import { emailsAdmin } from '../_lib/adminAuth.js';
import { json } from '../_lib/http.js';

export async function onRequestGet({ request, env }) {
  const sesion = leerSesionMiembro(request, env);
  if (!sesion?.email) {
    return json({ ok: true, email: null, activo: false });
  }

  if (!accesoConfigurado(env)) {
    return json({ ok: true, email: sesion.email, activo: true, modo: 'abierto' });
  }

  const esAdmin = emailsAdmin(env).includes(sesion.email);
  const acceso = await obtenerAcceso(env, sesion.email);
  const activo = Boolean(acceso?.active) || esAdmin;

  return json({ ok: true, email: sesion.email, activo });
}

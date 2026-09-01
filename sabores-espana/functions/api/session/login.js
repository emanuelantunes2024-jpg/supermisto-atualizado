// POST { email } → si el email tiene acceso activo (según el último webhook
// de Hotmart), emite la cookie de sesión de miembro.

import { obtenerAcceso } from '../_lib/kv.js';
import { crearCookieMiembro } from '../_lib/cookie.js';
import { accesoConfigurado } from '../_lib/config.js';
import { emailsAdmin } from '../_lib/adminAuth.js';
import { json } from '../_lib/http.js';

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const email = String(body?.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return json({ ok: false, error: 'email_invalido' }, { status: 400 });
  }

  if (!accesoConfigurado(env)) {
    // Todavía no se conectó KV/Hotmart: se deja pasar para poder
    // previsualizar la app. Ver "Antes de lanzar" en el README.
    return json(
      { ok: true, email, modo: 'abierto' },
      { headers: { 'Set-Cookie': crearCookieMiembro({ email }, env) } },
    );
  }

  const esAdmin = emailsAdmin(env).includes(email);
  const acceso = await obtenerAcceso(env, email);

  if (!acceso?.active && !esAdmin) {
    return json({ ok: false, error: 'sin_acceso' }, { status: 403 });
  }

  return json({ ok: true, email }, { headers: { 'Set-Cookie': crearCookieMiembro({ email }, env) } });
}

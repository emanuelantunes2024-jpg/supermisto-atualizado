import { crearCookieAdmin } from '../_lib/cookie.js';
import { credencialesActuales, emailAutorizado, verificarSenha } from '../_lib/adminAuth.js';
import { json } from '../_lib/http.js';

export async function onRequestPost({ request, env }) {
  if (!env?.SESSION_SECRET) {
    return json({ ok: false, error: 'servidor_no_configurado' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');

  const credenciales = await credencialesActuales(env);

  if (
    !emailAutorizado(email, credenciales) ||
    !credenciales.passwordHash ||
    !verificarSenha(password, credenciales.passwordHash)
  ) {
    return json({ ok: false, error: 'credenciales_invalidas' }, { status: 401 });
  }

  return json(
    { ok: true, email },
    { headers: { 'Set-Cookie': crearCookieAdmin({ email, credVersion: credenciales.version }, env) } },
  );
}

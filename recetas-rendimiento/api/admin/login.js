// POST { email, password } → si coincide con la credencial vigente (la
// guardada en Redis por el propio admin, o si no la de ADMIN_EMAILS +
// ADMIN_PASSWORD_HASH), emite la cookie de sesión CON role:'admin'. Es el
// único lugar del sistema que puede otorgar ese rol — el login de suscriptor
// (/api/session/login) nunca lo hace, aunque el email esté en ADMIN_EMAILS.

import { crearCookie } from '../_lib/cookie.js';
import { credencialesActuales, emailAutorizado, verificarSenha } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  if (!process.env.SESSION_SECRET) {
    res.status(500).json({ ok: false, error: 'falta_session_secret' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) {
    res.status(400).json({ ok: false, error: 'datos_incompletos' });
    return;
  }

  const credenciales = await credencialesActuales();
  if (!credenciales.passwordHash) {
    res.status(500).json({ ok: false, error: 'falta_admin_password_hash' });
    return;
  }

  if (!emailAutorizado(email, credenciales) || !verificarSenha(password, credenciales.passwordHash)) {
    res.status(401).json({ ok: false, error: 'credenciales_invalidas' });
    return;
  }

  res.setHeader('Set-Cookie', crearCookie({ email, role: 'admin', credVersion: credenciales.version }));
  res.status(200).json({ ok: true, email, isAdmin: true });
}

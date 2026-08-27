// POST { email, password } → si coincide con ADMIN_EMAILS + ADMIN_PASSWORD_HASH,
// emite la cookie de sesión CON role:'admin'. Es el único lugar del sistema
// que puede otorgar ese rol — el login de suscriptor (/api/session/login)
// nunca lo hace, aunque el email esté en ADMIN_EMAILS.

import { crearCookie } from '../_lib/cookie.js';
import { emailsAdmin, verificarSenha } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  if (!process.env.SESSION_SECRET) {
    res.status(500).json({ ok: false, error: 'falta_session_secret' });
    return;
  }
  const hashConfigurado = process.env.ADMIN_PASSWORD_HASH;
  if (!hashConfigurado) {
    res.status(500).json({ ok: false, error: 'falta_admin_password_hash' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) {
    res.status(400).json({ ok: false, error: 'datos_incompletos' });
    return;
  }

  if (!emailsAdmin().includes(email) || !verificarSenha(password, hashConfigurado)) {
    res.status(401).json({ ok: false, error: 'credenciales_invalidas' });
    return;
  }

  res.setHeader('Set-Cookie', crearCookie({ email, role: 'admin' }));
  res.status(200).json({ ok: true, email, isAdmin: true });
}

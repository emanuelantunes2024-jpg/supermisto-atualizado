import { crearCookieAdmin } from '../_lib/cookie.js';
import { credencialesActuales, emailAutorizado, verificarSenha } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  if (!process.env.SESSION_SECRET) {
    res.status(500).json({ ok: false, error: 'servidor_no_configurado' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  const credenciales = await credencialesActuales();

  if (
    !emailAutorizado(email, credenciales) ||
    !credenciales.passwordHash ||
    !verificarSenha(password, credenciales.passwordHash)
  ) {
    res.status(401).json({ ok: false, error: 'credenciales_invalidas' });
    return;
  }

  res.setHeader('Set-Cookie', crearCookieAdmin({ email, credVersion: credenciales.version }));
  res.status(200).json({ ok: true, email });
}

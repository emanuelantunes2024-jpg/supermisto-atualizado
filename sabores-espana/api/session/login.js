// POST { email } → si el email tiene acceso activo (según el último webhook
// de Hotmart), emite la cookie de sesión de miembro.

import { obtenerAcceso } from '../_lib/redis.js';
import { crearCookieMiembro } from '../_lib/cookie.js';
import { accesoConfigurado } from '../_lib/config.js';
import { emailsAdmin } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    res.status(400).json({ ok: false, error: 'email_invalido' });
    return;
  }

  if (!accesoConfigurado()) {
    // Todavía no se conectó Redis/Hotmart: se deja pasar para poder
    // previsualizar la app. Ver "Antes de lanzar" en el README.
    res.setHeader('Set-Cookie', crearCookieMiembro({ email }));
    res.status(200).json({ ok: true, email, modo: 'abierto' });
    return;
  }

  const esAdmin = emailsAdmin().includes(email);
  const acceso = await obtenerAcceso(email);

  if (!acceso?.active && !esAdmin) {
    res.status(403).json({ ok: false, error: 'sin_acceso' });
    return;
  }

  res.setHeader('Set-Cookie', crearCookieMiembro({ email }));
  res.status(200).json({ ok: true, email });
}

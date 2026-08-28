// POST { email } → si el email tiene una suscripción activa (según el último
// webhook de Hotmart recibido), emite la cookie de sesión.

import { obtenerAcceso } from '../_lib/redis.js';
import { crearCookie } from '../_lib/cookie.js';
import { suscripcionConfigurada } from '../_lib/config.js';
import { emailsAdmin } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  if (!suscripcionConfigurada()) {
    // Sitio abierto para suscriptores (todavía no se configuró Hotmart/Redis),
    // pero el panel admin nunca se concede por acá — ver /api/admin/login.
    res.status(200).json({ ok: true, email: null, isAdmin: false, modo: 'abierto' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    res.status(400).json({ ok: false, error: 'email_invalido' });
    return;
  }

  const esAdmin = emailsAdmin().includes(email);
  const acceso = await obtenerAcceso(email);

  if (!acceso?.active && !esAdmin) {
    res.status(403).json({ ok: false, error: 'sin_suscripcion' });
    return;
  }

  // Este login es de suscriptor: nunca otorga el rol de administrador, aunque
  // el email esté en ADMIN_EMAILS (eso solo bypassea la exigencia de compra
  // en Hotmart). El acceso al panel /admin exige /api/admin/login con clave.
  res.setHeader('Set-Cookie', crearCookie({ email }));
  res.status(200).json({ ok: true, email, isAdmin: false });
}

// GET → revalida contra Redis en cada llamada (no confía solo en la
// cookie), así una cancelación en Hotmart corta el acceso de inmediato.

import { leerSesionMiembro } from '../_lib/cookie.js';
import { obtenerAcceso } from '../_lib/redis.js';
import { accesoConfigurado } from '../_lib/config.js';
import { emailsAdmin } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  const sesion = leerSesionMiembro(req);
  if (!sesion?.email) {
    res.status(200).json({ ok: true, email: null, activo: false });
    return;
  }

  if (!accesoConfigurado()) {
    res.status(200).json({ ok: true, email: sesion.email, activo: true, modo: 'abierto' });
    return;
  }

  const esAdmin = emailsAdmin().includes(sesion.email);
  const acceso = await obtenerAcceso(sesion.email);
  const activo = Boolean(acceso?.active) || esAdmin;

  res.status(200).json({ ok: true, email: sesion.email, activo });
}

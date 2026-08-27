// GET → revalida contra Redis en cada llamada (no confía únicamente en la
// cookie), así una cancelación en Hotmart corta el acceso de inmediato.

import { leerSesion } from '../_lib/cookie.js';
import { obtenerAcceso } from '../_lib/redis.js';
import { suscripcionConfigurada } from '../_lib/config.js';

function emailsAdmin() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export default async function handler(req, res) {
  // Todavía no se configuró Hotmart/Redis en Vercel: la app queda abierta
  // (nadie se traba esperando una función que no puede evaluar nada).
  if (!suscripcionConfigurada()) {
    res.status(200).json({ ok: true, email: null, isAdmin: true, modo: 'abierto' });
    return;
  }

  const sesion = leerSesion(req);
  if (!sesion?.email) {
    res.status(401).json({ ok: false });
    return;
  }

  const esAdmin = emailsAdmin().includes(sesion.email);
  const acceso = await obtenerAcceso(sesion.email);

  if (!acceso?.active && !esAdmin) {
    res.status(401).json({ ok: false, error: 'suscripcion_inactiva' });
    return;
  }

  res.status(200).json({ ok: true, email: sesion.email, isAdmin: esAdmin });
}

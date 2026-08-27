// GET → revalida contra Redis en cada llamada (no confía únicamente en la
// cookie), así una cancelación en Hotmart corta el acceso de inmediato.

import { leerSesion } from '../_lib/cookie.js';
import { obtenerAcceso } from '../_lib/redis.js';
import { suscripcionConfigurada } from '../_lib/config.js';
import { emailsAdmin, obtenerAdminDeSesion } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  // Todavía no se configuró Hotmart/Redis en Vercel: la app queda abierta
  // (nadie se traba esperando una función que no puede evaluar nada). El
  // panel admin NO se beneficia de este modo abierto — isAdmin siempre es
  // false acá; solo /api/admin/login (con clave) puede otorgar ese rol.
  if (!suscripcionConfigurada()) {
    res.status(200).json({ ok: true, email: null, isAdmin: false, modo: 'abierto' });
    return;
  }

  const sesion = leerSesion(req);
  if (!sesion?.email) {
    res.status(401).json({ ok: false });
    return;
  }

  const emailEsAdminLegado = emailsAdmin().includes(sesion.email); // bypass histórico vía ADMIN_EMAILS
  // Revalida también contra la credencial vigente (ADMIN_EMAILS/ADMIN_PASSWORD_HASH
  // o la que el propio admin haya guardado desde /admin/configuracion) — así un
  // admin que cambió su email/contraseña nunca queda afuera de su propio panel.
  const adminVigente = await obtenerAdminDeSesion(req);
  const acceso = await obtenerAcceso(sesion.email);

  if (!acceso?.active && !emailEsAdminLegado && !adminVigente) {
    res.status(401).json({ ok: false, error: 'suscripcion_inactiva' });
    return;
  }

  // isAdmin (lo que habilita /admin en el frontend) exige una sesión de admin
  // real y vigente, con la versión de credenciales al día.
  res.status(200).json({ ok: true, email: sesion.email, isAdmin: Boolean(adminVigente) });
}

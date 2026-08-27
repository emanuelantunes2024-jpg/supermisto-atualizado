// POST { currentPassword, newEmail?, newPassword? } — cambia el email y/o la
// contraseña del panel administrativo. Protegido en dos capas:
//   1. Exige una sesión de admin real y vigente (obtenerAdminDeSesion).
//   2. Exige además la contraseña ACTUAL, para que una sesión robada (por
//      ejemplo por XSS) no alcance por sí sola para tomar control de la
//      cuenta sin conocer la clave.
// La contraseña nueva se transforma en hash (scrypt + salt) antes de
// guardarse — nunca se persiste en texto plano. Se guarda en Redis (mismo
// almacenamiento persistente que ya usa el resto del panel), así que
// sobrevive redeploys y no depende de nada del navegador.
//
// Guardar una credencial nueva incrementa la "versión" de credenciales, lo
// que invalida automáticamente cualquier sesión de admin ya abierta (incluida
// esta misma) — hay que volver a entrar con el email y la contraseña nuevos.

import { cookieDeCierre } from '../_lib/cookie.js';
import {
  obtenerAdminDeSesion,
  credencialesActuales,
  verificarSenha,
  hashSenha,
  definirCredenciales,
} from '../_lib/adminAuth.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const adminActual = await obtenerAdminDeSesion(req);
  if (!adminActual) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  const currentPassword = String(req.body?.currentPassword || '');
  const newEmailRaw = req.body?.newEmail;
  const newPasswordRaw = req.body?.newPassword;
  const newEmail = newEmailRaw != null && String(newEmailRaw).trim() !== '' ? String(newEmailRaw).trim().toLowerCase() : null;
  const newPassword = newPasswordRaw != null && String(newPasswordRaw) !== '' ? String(newPasswordRaw) : null;

  if (!currentPassword) {
    res.status(400).json({ ok: false, error: 'falta_password_actual' });
    return;
  }
  if (!newEmail && !newPassword) {
    res.status(400).json({ ok: false, error: 'nada_para_cambiar' });
    return;
  }
  if (newEmail && !EMAIL_RE.test(newEmail)) {
    res.status(400).json({ ok: false, error: 'email_invalido' });
    return;
  }
  if (newPassword && newPassword.length < 8) {
    res.status(400).json({ ok: false, error: 'password_muy_corta' });
    return;
  }

  let credenciales;
  try {
    credenciales = await credencialesActuales();
  } catch {
    res.status(500).json({ ok: false, error: 'error_redis' });
    return;
  }
  if (!credenciales.passwordHash) {
    res.status(500).json({ ok: false, error: 'falta_admin_password_hash' });
    return;
  }
  if (!verificarSenha(currentPassword, credenciales.passwordHash)) {
    res.status(401).json({ ok: false, error: 'password_actual_incorrecta' });
    return;
  }

  const emailFinal = newEmail || adminActual;
  const hashFinal = newPassword ? hashSenha(newPassword) : credenciales.passwordHash;

  try {
    const nueva = await definirCredenciales({ email: emailFinal, passwordHash: hashFinal, versionBase: credenciales.version });
    // Cierra la sesión actual: hay que volver a entrar con la credencial nueva.
    res.setHeader('Set-Cookie', cookieDeCierre());
    res.status(200).json({ ok: true, email: nueva.email });
  } catch (err) {
    // definirCredenciales() solo hace una escritura en Redis: cualquier error
    // acá es un problema de almacenamiento (Redis no conectado, mal
    // configurado, o inaccesible en este momento) — nunca un bug de lógica.
    console.error('[admin/credentials] fallo al guardar en Redis:', err);
    res.status(500).json({ ok: false, error: 'redis_no_configurado' });
  }
}

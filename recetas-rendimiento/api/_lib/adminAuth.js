// Autenticación real del panel administrativo — separada por completo del
// "modo abierto" de la suscripción (ver config.js). El admin NUNCA se concede
// automáticamente: exige SESSION_SECRET configurado, una sesión firmada con
// role:'admin', y que el email esté en ADMIN_EMAILS. La contraseña se guarda
// como hash (scrypt + salt) en ADMIN_PASSWORD_HASH — nunca en texto plano ni
// en el código.

import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { leerSesion } from './cookie.js';

export function emailsAdmin() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Genera un hash "salt:hash" listo para pegar en ADMIN_PASSWORD_HASH. */
export function hashSenha(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/** Compara una contraseña contra el hash guardado, en tiempo constante. */
export function verificarSenha(senha, hashGuardado) {
  if (!senha || !hashGuardado) return false;
  const [salt, hashEsperadoHex] = hashGuardado.split(':');
  if (!salt || !hashEsperadoHex) return false;
  try {
    const hashEsperado = Buffer.from(hashEsperadoHex, 'hex');
    const hashCalculado = scryptSync(senha, salt, 64);
    if (hashCalculado.length !== hashEsperado.length) return false;
    return timingSafeEqual(hashCalculado, hashEsperado);
  } catch {
    return false;
  }
}

/**
 * Verifica que la request tenga una sesión de administrador real y vigente.
 * Devuelve el email si es válida, o null. Nunca "falla abierto": si falta
 * SESSION_SECRET, si la cookie no está o no está firmada, si el rol no es
 * 'admin', o si el email no está en ADMIN_EMAILS, es null.
 */
export function obtenerAdminDeSesion(req) {
  let sesion;
  try {
    sesion = leerSesion(req);
  } catch {
    return null;
  }
  if (!sesion?.email || sesion.role !== 'admin') return null;
  if (!emailsAdmin().includes(sesion.email)) return null;
  return sesion.email;
}

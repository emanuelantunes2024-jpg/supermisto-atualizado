// Autenticación real del panel administrativo — separada por completo del
// login de miembro. El admin NUNCA se concede automáticamente: exige
// SESSION_SECRET configurado, una sesión firmada válida, y un email+
// contraseña que coincidan con la credencial vigente. La contraseña se
// guarda SIEMPRE como hash (scrypt + salt), nunca en texto plano.

import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { leerSesionAdmin } from './cookie.js';
import { redis } from './redis.js';

const CLAVE_CREDENCIALES = 'admin:credenciales';

export function emailsAdmin() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function hashSenha(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

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

/** Credencial vigente: la guardada en Redis (override), o si no, la de las variables de entorno. */
export async function credencialesActuales() {
  try {
    const guardadas = await redis().get(CLAVE_CREDENCIALES);
    if (guardadas?.email && guardadas?.passwordHash) {
      return {
        origen: 'override',
        emails: [guardadas.email],
        passwordHash: guardadas.passwordHash,
        version: Number.isFinite(guardadas.version) ? guardadas.version : 1,
      };
    }
  } catch {
    // Redis no configurado/inaccesible: seguimos con el modo legado (env vars).
  }
  return {
    origen: 'env',
    emails: emailsAdmin(),
    passwordHash: process.env.ADMIN_PASSWORD_HASH || null,
    version: 0,
  };
}

export function emailAutorizado(email, credenciales) {
  const normalizado = String(email || '').trim().toLowerCase();
  return Boolean(normalizado) && credenciales.emails.includes(normalizado);
}

/** Verifica que la request tenga una sesión de admin real y vigente. Devuelve el email o null. */
export async function obtenerAdminDeSesion(req) {
  let sesion;
  try {
    sesion = leerSesionAdmin(req);
  } catch {
    return null;
  }
  if (!sesion?.email) return null;

  const credenciales = await credencialesActuales();
  if (!emailAutorizado(sesion.email, credenciales)) return null;

  const versionSesion = Number.isFinite(sesion.credVersion) ? sesion.credVersion : 0;
  if (versionSesion !== credenciales.version) return null;

  return sesion.email;
}

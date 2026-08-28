// Autenticación real del panel administrativo — separada por completo del
// "modo abierto" de la suscripción (ver config.js). El admin NUNCA se concede
// automáticamente: exige SESSION_SECRET configurado, una sesión firmada con
// role:'admin', y un email+contraseña que coincidan con la credencial vigente.
// La contraseña se guarda SIEMPRE como hash (scrypt + salt) — nunca en texto
// plano ni en el código.
//
// La credencial vigente tiene dos orígenes posibles:
//   - "env"      → ADMIN_EMAILS + ADMIN_PASSWORD_HASH (variables de Vercel).
//                  Es la credencial inicial/de arranque.
//   - "override" → guardada en Redis por el propio admin desde
//                  /admin/configuracion (email único + hash). En cuanto existe,
//                  reemplaza por completo a la de "env" para el login del panel.
// Cada vez que se guarda una credencial nueva se incrementa `version`; esa
// versión viaja firmada dentro de la cookie de sesión, así que cambiar la
// contraseña/email invalida automáticamente cualquier sesión de admin abierta
// en otro lugar (deja de coincidir con la versión vigente).

import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { leerSesion } from './cookie.js';
import { redis } from './redis.js';

const CLAVE_CREDENCIALES = 'admin:credenciales';

export function emailsAdmin() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Genera un hash "salt:hash" listo para guardar (nunca la contraseña en texto plano). */
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
 * Devuelve la credencial vigente del panel: la guardada en Redis (override) si
 * existe, o si no la de las variables de entorno (legado). Nunca lanza: ante
 * cualquier problema con Redis cae al modo legado, que sigue exigiendo la
 * contraseña real (no es un "fail-open").
 */
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
    // Redis no configurado o inaccesible: seguimos con el modo legado.
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

/**
 * Guarda una nueva credencial de administrador (email y/o hash) en Redis,
 * incrementando la versión — eso invalida cualquier sesión de admin firmada
 * con una versión anterior, en cualquier dispositivo.
 */
export async function definirCredenciales({ email, passwordHash, versionBase }) {
  const registro = {
    email: String(email).trim().toLowerCase(),
    passwordHash,
    version: (Number.isFinite(versionBase) ? versionBase : 0) + 1,
    actualizadoEn: new Date().toISOString(),
  };
  await redis().set(CLAVE_CREDENCIALES, registro);
  return registro;
}

/**
 * Verifica que la request tenga una sesión de administrador real y vigente.
 * Devuelve el email si es válida, o null. Nunca "falla abierto": si falta
 * SESSION_SECRET, si la cookie no está o no está firmada, si el rol no es
 * 'admin', si el email no está autorizado, o si la sesión fue firmada con una
 * credencial ya reemplazada (versión distinta), es null.
 */
export async function obtenerAdminDeSesion(req) {
  let sesion;
  try {
    sesion = leerSesion(req);
  } catch {
    return null;
  }
  if (!sesion?.email || sesion.role !== 'admin') return null;

  const credenciales = await credencialesActuales();
  if (!emailAutorizado(sesion.email, credenciales)) return null;

  const versionSesion = Number.isFinite(sesion.credVersion) ? sesion.credVersion : 0;
  if (versionSesion !== credenciales.version) return null;

  return sesion.email;
}

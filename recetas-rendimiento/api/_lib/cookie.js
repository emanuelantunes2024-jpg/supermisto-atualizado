// Cookie de sesión firmada con HMAC (sin dependencias externas). El valor es
// `<payload en base64url>.<firma>`; cualquier alteración invalida la firma.

import { createHmac, timingSafeEqual } from 'node:crypto';

const NOMBRE_COOKIE = 'rr_session';
const DURACION_SEGUNDOS = 60 * 60 * 24 * 30; // 30 días

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('Falta la variable de entorno SESSION_SECRET.');
  return s;
}

function firmar(payloadB64) {
  return createHmac('sha256', secreto()).update(payloadB64).digest('base64url');
}

export function crearCookie(payload) {
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const firma = firmar(payloadB64);
  const valor = `${payloadB64}.${firma}`;
  return `${NOMBRE_COOKIE}=${valor}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DURACION_SEGUNDOS}`;
}

export function cookieDeCierre() {
  return `${NOMBRE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function leerCookieCruda(req, nombre) {
  const encabezado = req.headers.cookie || '';
  for (const parte of encabezado.split(';')) {
    const [k, ...v] = parte.trim().split('=');
    if (k === nombre) return v.join('=');
  }
  return null;
}

/** Lee y verifica la cookie de sesión de la request. Devuelve el payload o null. */
export function leerSesion(req) {
  const valor = leerCookieCruda(req, NOMBRE_COOKIE);
  if (!valor) return null;

  const [payloadB64, firma] = valor.split('.');
  if (!payloadB64 || !firma) return null;

  const firmaEsperada = firmar(payloadB64);
  const a = Buffer.from(firma);
  const b = Buffer.from(firmaEsperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

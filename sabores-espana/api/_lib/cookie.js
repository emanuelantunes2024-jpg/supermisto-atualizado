// Cookies de sesión firmadas con HMAC (sin dependencias externas). El valor
// es `<payload en base64url>.<firma>`; cualquier alteración invalida la
// firma. Se usan dos cookies con nombres distintos — una para el miembro
// (comprador) y otra para el admin — así cerrar sesión en una nunca afecta
// a la otra.

import { createHmac, timingSafeEqual } from 'node:crypto';

const DURACION_MIEMBRO = 60 * 60 * 24 * 365; // 1 año — acceso "para siempre" mientras la suscripción siga activa
const DURACION_ADMIN = 60 * 60 * 24 * 7; // 7 días

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('Falta la variable de entorno SESSION_SECRET.');
  return s;
}

function firmar(payloadB64) {
  return createHmac('sha256', secreto()).update(payloadB64).digest('base64url');
}

function crear(nombreCookie, payload, duracionSegundos) {
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const firma = firmar(payloadB64);
  const valor = `${payloadB64}.${firma}`;
  return `${nombreCookie}=${valor}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${duracionSegundos}`;
}

function cerrar(nombreCookie) {
  return `${nombreCookie}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function leerCruda(req, nombreCookie) {
  const encabezado = req.headers.cookie || '';
  for (const parte of encabezado.split(';')) {
    const [k, ...v] = parte.trim().split('=');
    if (k === nombreCookie) return v.join('=');
  }
  return null;
}

function leer(req, nombreCookie) {
  const valor = leerCruda(req, nombreCookie);
  if (!valor) return null;

  const [payloadB64, firma] = valor.split('.');
  if (!payloadB64 || !firma) return null;

  let firmaEsperada;
  try {
    firmaEsperada = firmar(payloadB64);
  } catch {
    return null;
  }
  const a = Buffer.from(firma);
  const b = Buffer.from(firmaEsperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

const COOKIE_MIEMBRO = 'se_session';
const COOKIE_ADMIN = 'se_admin';

export const crearCookieMiembro = (payload) => crear(COOKIE_MIEMBRO, payload, DURACION_MIEMBRO);
export const cookieCierreMiembro = () => cerrar(COOKIE_MIEMBRO);
export const leerSesionMiembro = (req) => leer(req, COOKIE_MIEMBRO);

export const crearCookieAdmin = (payload) => crear(COOKIE_ADMIN, payload, DURACION_ADMIN);
export const cookieCierreAdmin = () => cerrar(COOKIE_ADMIN);
export const leerSesionAdmin = (req) => leer(req, COOKIE_ADMIN);

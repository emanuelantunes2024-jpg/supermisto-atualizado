// Cliente Redis (Upstash) — persiste qué emails tienen una suscripción activa
// de Hotmart. En Vercel: Storage → Marketplace → Redis (Upstash), plan Free.
// La integración inyecta KV_REST_API_URL / KV_REST_API_TOKEN automáticamente
// (o UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN según el flujo de alta).

import { Redis } from '@upstash/redis';

let cliente = null;

export function redis() {
  if (cliente) return cliente;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Redis no configurado: falta agregar la integración de Redis en Vercel (Storage → Marketplace → Redis).'
    );
  }

  // Pipelining automático deshabilitado: el volumen de comandos es bajo
  // (login/webhook), así que preferimos el formato de respuesta simple.
  cliente = new Redis({ url, token, enableAutoPipelining: false });
  return cliente;
}

const clavePorEmail = (email) => `hotmart:acceso:${email.trim().toLowerCase()}`;
const CLAVE_INDICE_CLIENTES = 'clientes:emails';

/**
 * Guarda o actualiza el registro de un cliente (llamado por el webhook de
 * Hotmart). `datos` es la "ficha" del cliente: email, status (activo /
 * cancelado / expirado), plan, fechas, identificadores de Hotmart, etc. —
 * ver hotmart-webhook.js para el detalle de qué se guarda en cada evento.
 * También indexa el email en un set aparte para poder listar todos los
 * clientes desde el panel admin sin tener que recorrer todo Redis.
 */
export async function guardarAcceso(email, datos) {
  const emailNormalizado = email.trim().toLowerCase();
  await redis().set(clavePorEmail(emailNormalizado), {
    email: emailNormalizado,
    ...datos,
    actualizadoEn: new Date().toISOString(),
  });
  await redis().sadd(CLAVE_INDICE_CLIENTES, emailNormalizado);
}

/** Devuelve el registro de acceso de un email, o null si nunca compró. */
export async function obtenerAcceso(email) {
  return redis().get(clavePorEmail(email));
}

/** Lista todos los clientes conocidos (para el panel admin — nunca se usa para decidir acceso). */
export async function listarClientes() {
  const emails = await redis().smembers(CLAVE_INDICE_CLIENTES);
  if (!emails?.length) return [];
  const registros = await Promise.all(emails.map((e) => obtenerAcceso(e)));
  return registros
    .filter(Boolean)
    .sort((a, b) => (b.actualizadoEn || '').localeCompare(a.actualizadoEn || ''));
}

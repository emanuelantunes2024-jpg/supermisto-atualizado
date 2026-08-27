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

/** Guarda o actualiza el estado de acceso de un email (llamado por el webhook). */
export async function guardarAcceso(email, datos) {
  await redis().set(clavePorEmail(email), { ...datos, actualizadoEn: new Date().toISOString() });
}

/** Devuelve el estado de acceso de un email, o null si nunca compró. */
export async function obtenerAcceso(email) {
  return redis().get(clavePorEmail(email));
}

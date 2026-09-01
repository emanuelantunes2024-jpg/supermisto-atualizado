// Cliente Redis (Upstash) — persiste qué emails tienen acceso activo
// (comprado vía Hotmart) y las ediciones de contenido hechas desde /admin.
// En Vercel: Storage → Marketplace → Redis (Upstash), plan Free. La
// integración inyecta KV_REST_API_URL / KV_REST_API_TOKEN automáticamente.

import { Redis } from '@upstash/redis';

let cliente = null;

export function redis() {
  if (cliente) return cliente;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Redis no configurado: falta agregar la integración de Redis en Vercel (Storage → Marketplace → Redis).',
    );
  }

  cliente = new Redis({ url, token, enableAutoPipelining: false });
  return cliente;
}

const clavePorEmail = (email) => `hotmart:acceso:${email.trim().toLowerCase()}`;
const CLAVE_INDICE_CLIENTES = 'clientes:emails';

export async function guardarAcceso(email, datos) {
  const emailNormalizado = email.trim().toLowerCase();
  await redis().set(clavePorEmail(emailNormalizado), {
    email: emailNormalizado,
    ...datos,
    actualizadoEn: new Date().toISOString(),
  });
  await redis().sadd(CLAVE_INDICE_CLIENTES, emailNormalizado);
}

export async function obtenerAcceso(email) {
  return redis().get(clavePorEmail(email));
}

export async function listarClientes() {
  const emails = await redis().smembers(CLAVE_INDICE_CLIENTES);
  if (!emails?.length) return [];
  const registros = await Promise.all(emails.map((e) => obtenerAcceso(e)));
  return registros
    .filter(Boolean)
    .sort((a, b) => (b.actualizadoEn || '').localeCompare(a.actualizadoEn || ''));
}

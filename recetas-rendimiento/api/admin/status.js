// GET — diagnóstico de configuración del panel, protegido por sesión de
// admin vigente. No devuelve ningún secreto, solo si cada pieza está
// presente/conectada — sirve para confirmar en producción, sin adivinar,
// qué falta configurar en Vercel (Redis, Hotmart, etc.).

import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { redis } from '../_lib/redis.js';

export default async function handler(req, res) {
  const admin = await obtenerAdminDeSesion(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  const redisEnvPresente = Boolean(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
      (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );

  let redisConectado = false;
  if (redisEnvPresente) {
    try {
      await redis().set('admin:diagnostico', new Date().toISOString());
      redisConectado = true;
    } catch {
      redisConectado = false;
    }
  }

  res.status(200).json({
    ok: true,
    sessionSecret: Boolean(process.env.SESSION_SECRET),
    adminPasswordHash: Boolean(process.env.ADMIN_PASSWORD_HASH),
    redisEnvPresente,
    redisConectado,
    hotmartHottok: Boolean(process.env.HOTMART_HOTTOK),
  });
}

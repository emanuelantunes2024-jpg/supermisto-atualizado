// Indica si ya hay backend real conectado (Redis + secreto de sesión). Sin
// esto configurado, el login de miembro queda en "modo abierto" (para poder
// previsualizar el diseño antes de dar de alta las cuentas externas) — el
// panel /admin, en cambio, NUNCA se abre sin credenciales reales (ver
// adminAuth.js).

export function accesoConfigurado() {
  return Boolean(process.env.SESSION_SECRET) &&
    Boolean(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
}

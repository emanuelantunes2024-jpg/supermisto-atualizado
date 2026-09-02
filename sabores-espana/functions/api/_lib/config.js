// Indica si ya hay backend real conectado (KV + secreto de sesión). Sin
// esto configurado, el login de miembro queda en "modo abierto" (para poder
// previsualizar el diseño antes de dar de alta las cuentas externas) — el
// panel /admin, en cambio, NUNCA se abre sin credenciales reales (ver
// adminAuth.js).

export function accesoConfigurado(env) {
  return Boolean(env?.SESSION_SECRET) && Boolean(env?.SABORES_KV);
}

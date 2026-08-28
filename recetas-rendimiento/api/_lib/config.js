// El gate de suscripción se activa SOLO cuando está totalmente configurado
// (Redis + SESSION_SECRET). Si falta algo, la app queda abierta —así nadie,
// ni el propio dueño, se queda afuera de su sitio por una configuración a
// medio hacer. En cuanto se completen las 3 variables en Vercel, el login
// empieza a exigirse solo, sin tocar código.

export function suscripcionConfigurada() {
  const tieneRedis = Boolean(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
      (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  );
  const tieneSecreto = Boolean(process.env.SESSION_SECRET);
  return tieneRedis && tieneSecreto;
}

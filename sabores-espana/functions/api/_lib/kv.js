// Cloudflare KV — persiste qué emails tienen acceso activo (comprado vía
// Hotmart). Usa el binding nativo de Cloudflare Pages ("SABORES_KV"),
// creado en el propio dashboard de Cloudflare — sin depender de ningún
// servicio externo (ni Redis, ni Upstash, ni nada fuera de Cloudflare).

const clavePorEmail = (email) => `hotmart:acceso:${email.trim().toLowerCase()}`;

function kvDe(env) {
  const kv = env?.SABORES_KV;
  if (!kv) {
    throw new Error(
      'KV no configurado: falta enlazar el namespace "SABORES_KV" en Cloudflare Pages (Settings → Functions → KV namespace bindings).',
    );
  }
  return kv;
}

export async function guardarAcceso(env, email, datos) {
  const emailNormalizado = email.trim().toLowerCase();
  const registro = { email: emailNormalizado, ...datos, actualizadoEn: new Date().toISOString() };
  await kvDe(env).put(clavePorEmail(emailNormalizado), JSON.stringify(registro));
  return registro;
}

export async function obtenerAcceso(env, email) {
  const crudo = await kvDe(env).get(clavePorEmail(email));
  return crudo ? JSON.parse(crudo) : null;
}

/** Lista todos los clientes conocidos (para el panel admin), recorriendo las claves por prefijo. */
export async function listarClientes(env) {
  const kv = kvDe(env);
  const registros = [];
  let cursor;
  do {
    const pagina = await kv.list({ prefix: 'hotmart:acceso:', cursor });
    for (const k of pagina.keys) {
      const crudo = await kv.get(k.name);
      if (crudo) registros.push(JSON.parse(crudo));
    }
    cursor = pagina.list_complete ? undefined : pagina.cursor;
  } while (cursor);
  return registros.sort((a, b) => (b.actualizadoEn || '').localeCompare(a.actualizadoEn || ''));
}

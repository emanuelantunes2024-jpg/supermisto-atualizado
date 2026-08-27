// GET — lista de clientes/suscriptores, protegida por sesión de admin
// vigente. Es de solo lectura: el estado real de cada suscripción lo
// controla Hotmart (vía api/hotmart-webhook.js); el admin la consulta acá,
// no la edita a mano, para que nunca quede desincronizada de Hotmart.

import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { listarClientes } from '../_lib/redis.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const admin = await obtenerAdminDeSesion(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  try {
    const clientes = await listarClientes();
    res.status(200).json({ ok: true, clientes });
  } catch (err) {
    console.error('[admin/clientes]', err);
    res.status(500).json({ ok: false, error: 'redis_no_configurado' });
  }
}

// GET — protegido por sesión de administrador. Junta, en una sola llamada,
// los números de clientes (de Hotmart) y las vistas por receta (contador
// agregado, sin identificar visitantes) para armar el ranking de más vistas.
import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { listarClientes } from '../_lib/redis.js';
import { obtenerVistasDB } from '../_lib/contentStore.js';

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
    const [clientes, vistas] = await Promise.all([listarClientes(), obtenerVistasDB()]);

    const clientesPorEstado = clientes.reduce(
      (acc, c) => {
        const estado = c.status === 'activo' ? 'activos' : c.status === 'cancelado' ? 'cancelados' : 'otros';
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      },
      { activos: 0, cancelados: 0, otros: 0 }
    );

    res.status(200).json({
      ok: true,
      clientes: { total: clientes.length, ...clientesPorEstado },
      vistas,
    });
  } catch (err) {
    console.error('[admin/reportes]', err);
    res.status(500).json({ ok: false, error: 'redis_no_configurado' });
  }
}

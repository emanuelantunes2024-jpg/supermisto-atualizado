// POST — actualiza la configuración del sitio (imágenes de portada de la
// home). Protegido por sesión de admin real, revalidada en cada request.

import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { guardarConfigSitioDB } from '../_lib/contentStore.js';

const CAMPOS_PERMITIDOS = [
  'bannerBibliotecaImagen',
  'bannerNovedadesImagen',
  'marcaPrefijo',
  'marcaNombreA',
  'marcaNombreB',
  'marcaEmpresa',
  'marcaLogo',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const admin = await obtenerAdminDeSesion(req);
  if (!admin) {
    res.status(401).json({ ok: false, error: 'no_autorizado' });
    return;
  }

  const cambios = {};
  for (const campo of CAMPOS_PERMITIDOS) {
    if (typeof req.body?.[campo] === 'string' && req.body[campo].trim()) {
      cambios[campo] = req.body[campo];
    }
  }
  if (Object.keys(cambios).length === 0) {
    res.status(400).json({ ok: false, error: 'nada_para_cambiar' });
    return;
  }

  try {
    const config = await guardarConfigSitioDB(cambios);
    res.status(200).json({ ok: true, config });
  } catch (err) {
    console.error('[admin/config]', err);
    res.status(500).json({ ok: false, error: 'redis_no_configurado' });
  }
}

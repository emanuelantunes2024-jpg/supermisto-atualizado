// GET público — configuración del sitio (por ahora, las imágenes de los
// banners de portada de la home) persistida en Redis, o la que trae el
// diseño original si Redis todavía no está configurado.

import { obtenerConfigSitioDB } from '../_lib/contentStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }
  const config = await obtenerConfigSitioDB();
  res.status(200).json({ ok: true, config });
}

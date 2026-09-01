import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';

export default async function handler(req, res) {
  const email = await obtenerAdminDeSesion(req);
  if (!email) {
    res.status(401).json({ ok: false, email: null });
    return;
  }
  res.status(200).json({ ok: true, email });
}

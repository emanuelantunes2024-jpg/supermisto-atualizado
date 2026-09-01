import { obtenerAdminDeSesion } from '../_lib/adminAuth.js';
import { json } from '../_lib/http.js';

export async function onRequestGet({ request, env }) {
  const email = await obtenerAdminDeSesion(request, env);
  if (!email) return json({ ok: false, email: null }, { status: 401 });
  return json({ ok: true, email });
}

import { cookieCierreAdmin } from '../_lib/cookie.js';
import { json } from '../_lib/http.js';

export async function onRequestPost() {
  return json({ ok: true }, { headers: { 'Set-Cookie': cookieCierreAdmin() } });
}

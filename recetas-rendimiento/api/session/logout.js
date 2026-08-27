import { cookieDeCierre } from '../_lib/cookie.js';

export default async function handler(req, res) {
  res.setHeader('Set-Cookie', cookieDeCierre());
  res.status(200).json({ ok: true });
}

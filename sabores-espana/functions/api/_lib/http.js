// Pequeño helper para responder JSON sin repetir el boilerplate de Headers
// en cada función. `init.headers` puede traer, por ejemplo, un Set-Cookie.

export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(data), { ...init, headers });
}

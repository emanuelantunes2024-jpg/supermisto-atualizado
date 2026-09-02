// Service worker mínimo — cachea el shell de la app para que abra rápido y
// funcione offline con lo último visto. El contenido dinámico (/api/*)
// nunca se cachea, así el acceso y las recetas del admin siempre están al día.

const CACHE = 'sabores-espana-v1';
const SHELL = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) return; // nunca cachear datos dinámicos

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((resp) => {
            if (resp.ok && url.origin === self.location.origin) {
              const copia = resp.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copia));
            }
            return resp;
          })
          .catch(() => cached),
    ),
  );
});

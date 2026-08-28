const CACHE_NAME = 'recetas-rendimiento-v2';
const APP_SHELL = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first para pedidos GET del mismo origen: siempre se prioriza la
// versión más nueva del sitio; el cache solo sirve de respaldo si no hay
// conexión. (Antes era "stale-while-revalidate" — mostraba la versión vieja
// guardada y recién actualizaba el cache para la próxima visita, así que un
// cambio recién publicado no se veía hasta la segunda vez que se entraba.)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copia = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

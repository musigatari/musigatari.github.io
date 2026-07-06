/* ============================================================
   SERVICE WORKER — Musigatari PWA
   Guarda todos los archivos en caché para funcionar offline.
   ============================================================ */

const CACHE = 'musigatari-v1';

const ARCHIVOS = [
  './',
  './index.html',
  './config/config.js',
  './config/icon.svg',
  './config/qr.svg',
  './config/explicacion.html',
  './manifest.json'
];

/* Al instalar: guarda todos los archivos en caché */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

/* Al activar: elimina cachés viejos */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Al hacer fetch: responde desde caché, si no está lo busca en red */
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        /* Guarda en caché las respuestas nuevas */
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

const CACHE_NAME = 'miwallet-pro-cache-v1';
const urlsToCache = [
  './',
  './MiWallet_Pro.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback offline (since it's SPA, return main HTML if navigation)
          if (event.request.mode === 'navigate') {
            return caches.match('./MiWallet_Pro.html');
          }
        });
      })
  );
});

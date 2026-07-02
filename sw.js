/* Service Worker MDL Viollet-le-Duc */
var CACHE = 'mdl-v1';
var ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/mdl-core.js',
  '/assets/logo.png',
  '/assets/lycee-entree.jpg',
  '/favicon.ico',
  '/favicon-32.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        // Mettre en cache les nouvelles ressources
        if (response.ok && e.request.method === 'GET') {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline fallback
        if (e.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
});

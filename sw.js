/* Service Worker MDL Viollet-le-Duc */
/* IMPORTANT : incrémenter ce numéro à CHAQUE déploiement pour pousser
   les nouvelles versions des fichiers aux visiteurs déjà venus. */
var VERSION = 'mdl-v2';
var CACHE = VERSION;

var CORE = [
  '/',
  '/index.html',
  '/style.css',
  '/mdl-core.js',
  '/assets/logo.png',
  '/favicon.ico',
  '/favicon-32.png',
];

// --- Installation : pré-cache du noyau ---
self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) { return cache.addAll(CORE); })
  );
});

// --- Activation : suppression des anciens caches + prise de contrôle ---
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

function isFreshFirst(req) {
  // HTML (navigation) + CSS + JS : on veut toujours la dernière version
  if (req.mode === 'navigate') return true;
  return req.destination === 'style' || req.destination === 'script' || req.destination === 'document';
}

self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  // Réseau d'abord pour HTML/CSS/JS (avec repli cache hors-ligne)
  if (isFreshFirst(req)) {
    e.respondWith(
      fetch(req).then(function(res) {
        if (res && res.ok) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(req, clone); });
        }
        return res;
      }).catch(function() {
        return caches.match(req).then(function(cached) {
          return cached || (req.mode === 'navigate' ? caches.match('/index.html') : undefined);
        });
      })
    );
    return;
  }

  // Cache d'abord pour le reste (images, polices…), avec mise à jour en arrière-plan
  e.respondWith(
    caches.match(req).then(function(cached) {
      var network = fetch(req).then(function(res) {
        if (res && res.ok) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(req, clone); });
        }
        return res;
      }).catch(function() { return cached; });
      return cached || network;
    })
  );
});

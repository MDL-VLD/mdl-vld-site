/* Service worker "reseau d'abord" (network-first).
   Toujours servir la version en ligne la plus fraiche ; le cache ne sert
   qu'en secours hors-ligne. Gere uniquement les fichiers du site (meme
   origine) : les appels a Supabase et aux CDN passent directement au reseau.
   Presence d'un handler fetch = le site devient installable (Android/Chrome). */
const CACHE = 'mdl-rt-v2';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return; // Supabase / CDN : reseau direct
  e.respondWith((async function () {
    try {
      const net = await fetch(req);
      if (net && net.status === 200 && net.type === 'basic') {
        const c = await caches.open(CACHE); c.put(req, net.clone());
      }
      return net;
    } catch (_) {
      const m = await caches.match(req);
      if (m) return m;
      if (req.mode === 'navigate') { const f = await caches.match('index.html'); if (f) return f; }
      return new Response('', { status: 504, statusText: 'Hors ligne' });
    }
  })());
});

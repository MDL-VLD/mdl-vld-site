/* Service worker "auto-destructeur".
   L'ancien site installait un service worker qui gardait les pages en cache.
   Ce fichier remplace l'ancien au meme emplacement (/sw.js) : au prochain
   passage d'un visiteur, il vide tous les caches, se desinscrit, puis
   recharge les onglets ouverts pour afficher le nouveau site.
   A NE PAS SUPPRIMER du depot : c'est lui qui nettoie l'ancien cache. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      await self.registration.unregister();
      var clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function (c) { try { c.navigate(c.url); } catch (e) {} });
    } catch (e) {}
  })());
});

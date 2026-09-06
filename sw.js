const CACHE_NAME = 'prestacar-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/logo.png',
  '/logo.jpg'
];

// 1. Installation du Service Worker et mise en cache des fichiers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Fichiers mis en cache avec succès');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Interception des requêtes (Sert le cache si disponible, sinon va sur le réseau)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne la version en cache si elle existe
        if (response) {
          return response;
        }
        // Sinon, fait la requête sur le réseau
        return fetch(event.request);
      })
  );
});

// 3. Activation et nettoyage des anciens caches (lors d'une mise à jour)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

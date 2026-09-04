const CACHE_NAME = "prestacar-services-v2"; // Mise à jour de la version du cache
const FILES_TO_CACHE = [ 
    "./", 
    "./index.html", 
    "./styles.css", 
    "./script.js", 
    "./manifest.json", 
    "./favicon.ico", 
    "./favicon-16x16.png", 
    "./favicon-32x32.png", 
    "./apple-touch-icon.png",
    "./android-chrome-192x192.png",
    "./android-chrome-512x512.png",
    "./logo.jpg" // Conservé pour les images de la page
];

self.addEventListener("install", (event) => {
    console.log("Prestacar Services : installation du cache.");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    console.log("Prestacar Services : activation du Service Worker.");
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque") {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                return networkResponse;
            }).catch(() => {
                if (event.request.destination === "document") return caches.match("./index.html");
                return new Response("Contenu indisponible hors connexion.", {
                    status: 503, statusText: "Service Unavailable", headers: { "Content-Type": "text/plain; charset=utf-8" }
                });
            });
        })
    );
});

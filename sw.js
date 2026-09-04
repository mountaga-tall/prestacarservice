// ========================================
// PRESTACAR SERVICES
// Service Worker - PWA
// ========================================

const CACHE_NAME = "prestacar-services-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./logo.jpg"
];

// ----------------------------------------
// INSTALLATION
// ----------------------------------------
self.addEventListener("install", (event) => {
    console.log("Prestacar Services : installation du cache.");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// ----------------------------------------
// ACTIVATION
// ----------------------------------------
self.addEventListener("activate", (event) => {
    console.log("Prestacar Services : activation du Service Worker.");

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME)
                        .map((cacheName) => caches.delete(cacheName))
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// ----------------------------------------
// RÉCUPÉRATION DES FICHIERS
// Stratégie : Cache First
// ----------------------------------------
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Ne gérer que les requêtes GET
    if (request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((networkResponse) => {

                        // Vérifier que la réponse est valide
                        if (
                            !networkResponse ||
                            networkResponse.status !== 200 ||
                            networkResponse.type === "opaque"
                        ) {
                            return networkResponse;
                        }

                        const responseToCache =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        // Si Internet est indisponible
                        // et qu'il s'agit d'une page HTML,
                        // retourner index.html depuis le cache.
                        if (
                            request.destination === "document"
                        ) {
                            return caches.match("./index.html");
                        }

                        return new Response(
                            "Contenu indisponible hors connexion.",
                            {
                                status: 503,
                                statusText: "Service Unavailable",
                                headers: {
                                    "Content-Type": "text/plain; charset=utf-8"
                                }
                            }
                        );
                    });
            })
    );
});
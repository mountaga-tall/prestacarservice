/* ==========================================================
   PRESTACAR SERVICES
   SERVICE WORKER V49 — fast PWA install prompt + installed detection
========================================================== */

const CACHE_NAME = "prestacar-services-v49";
const OFFLINE_URL = "./offline.html";

const APP_SHELL = [
    "./",
    "./index.html",
    "./offline.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./icons/prestacar-192.png",
    "./icons/prestacar-512.png",
    "./icons/prestacar-192.svg",
    "./icons/prestacar-512.svg",
    "./logo.jpg?v=5",
    "./logos%20sites/neo.webp",
    "./logos%20sites/lashish.webp",
    "./logos%20sites/logo.webp",
    "./logos%20sites/keurdia.webp",
    "./logos%20sites/atelierkadja.webp",
    "./logos%20sites/amore.webp",
    "./logos%20sites/billardvip.webp",
    "./logos%20sites/jackers.webp",
    "./logos%20sites/elpatron.webp",
    "./fr/",
    "./fr/contact/",
    "./fr/services/",
    "./fr/realisations/",
    "./fr/references/",
    "./fr/erc/",
    "./fr/formation-linguistique/",
    "./fr/marketing-digital/",
    "./fr/catalogue/univers-1/",
    "./fr/catalogue/univers-2/",
    "./fr/catalogue/univers-3/",
    "./fr/catalogue/univers-4/",
    "./fr/electronique-embarquee/",
    "./en/",
    "./en/contact/",
    "./en/services/",
    "./en/realisations/",
    "./en/references/",
    "./en/erc/",
    "./en/formation-linguistique/",
    "./en/marketing-digital/",
    "./en/electronique-embarquee/",
    "./es/",
    "./es/contacto/",
    "./es/services/",
    "./es/realizaciones/",
    "./es/referencias/",
    "./es/erc/",
    "./es/formation-linguistique/",
    "./es/marketing-digital/",
    "./es/electronique-embarquee/"
];

const STATIC_DESTINATIONS = new Set(["style", "script", "image", "font"]);
const STATIC_EXTENSIONS = /\.(?:css|js|mjs|png|jpe?g|svg|webp|gif|ico|woff2?|ttf|otf|json)$/i;

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(name => name.startsWith("prestacar-services-") && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET") return;

    const requestURL = new URL(request.url);
    // Leave other origins (e.g. Google Fonts and WhatsApp) to the browser.
    if (requestURL.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        const networkPromise = fetch(request);
        const cacheUpdatePromise = networkPromise.then(response => {
            if (!response || !response.ok) return;
            const cacheKey = new Request(requestURL.origin + requestURL.pathname);
            return caches.open(CACHE_NAME)
                .then(cache => cache.put(cacheKey, response.clone()));
        });
        // Extend the worker lifetime for writes without delaying the network response.
        event.waitUntil(cacheUpdatePromise.catch(() => {}));

        event.respondWith(
            networkPromise.catch(() =>
                caches.open(CACHE_NAME).then(cache =>
                    cache.match(request, { ignoreSearch: true })
                        .then(cached => {
                            if (cached) return cached;
                            const normalizedRequest = new Request(requestURL.origin + requestURL.pathname);
                            return cache.match(normalizedRequest)
                                .then(normalized => {
                                    if (normalized) return normalized;
                                    return cache.match(new URL(OFFLINE_URL, self.registration.scope).href)
                                        .then(offline => offline || Response.error());
                                });
                        })
                )
            )
        );
        return;
    }

    const isStaticResource =
        STATIC_DESTINATIONS.has(request.destination) ||
        STATIC_EXTENSIONS.test(requestURL.pathname);
    if (!isStaticResource) return;

    // Core assets are pre-cached; later visits can load them without waiting for the network.
    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(request).then(cached => {
                if (cached) return cached;

                return fetch(request).then(response => {
                    if (!response || !response.ok) return response;
                    return cache.put(request, response.clone()).then(() => response);
                });
            })
        ).catch(() =>
            caches.open(CACHE_NAME)
                .then(cache => cache.match(request))
                .then(cached => cached || Response.error())
        )
    );
});

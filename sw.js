/* =========================================================
   PRESTACAR SERVICES
   SERVICE WORKER / PWA
========================================================= */

const CACHE_NAME = "prestacar-cache-v2";

const CORE_FILES = [
    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./logo.svg",
    "./logo.png",
    "./logo.jpg"
];


/* =========================================================
   INSTALLATION
========================================================= */

self.addEventListener(
    "install",
    (event) => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(async (cache) => {

                    /*
                     * On met chaque fichier en cache
                     * individuellement.
                     *
                     * Si un fichier n'existe pas,
                     * cela ne bloque pas toute
                     * l'installation du Service Worker.
                     */

                    await Promise.all(

                        CORE_FILES.map(
                            async (url) => {

                                try {

                                    const response =
                                        await fetch(
                                            url,
                                            {
                                                cache:
                                                    "no-cache"
                                            }
                                        );

                                    if (
                                        response.ok
                                    ) {

                                        await cache.put(
                                            url,
                                            response
                                        );

                                    }

                                } catch (error) {

                                    console.warn(
                                        "Fichier non mis en cache :",
                                        url
                                    );

                                }

                            }
                        )

                    );

                })

        );

        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATION
========================================================= */

self.addEventListener(
    "activate",
    (event) => {

        event.waitUntil(

            caches
                .keys()
                .then((cacheNames) => {

                    return Promise.all(

                        cacheNames.map(
                            (cacheName) => {

                                if (
                                    cacheName !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }

                                return null;

                            }
                        )

                    );

                })

        );

        self.clients.claim();

    }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
    "fetch",
    (event) => {

        /*
         * On ne traite que les requêtes GET.
         */

        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }


        event.respondWith(

            caches
                .match(event.request)
                .then((cachedResponse) => {

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    return fetch(
                        event.request
                    )
                        .then((networkResponse) => {

                            /*
                             * On ne met en cache
                             * que les réponses valides.
                             */

                            if (
                                networkResponse &&
                                networkResponse.status === 200
                            ) {

                                const responseClone =
                                    networkResponse.clone();

                                caches
                                    .open(CACHE_NAME)
                                    .then((cache) => {

                                        cache.put(
                                            event.request,
                                            responseClone
                                        );

                                    });

                            }

                            return networkResponse;

                        })
                        .catch(() => {

                            /*
                             * Fallback hors-ligne
                             */

                            return caches.match(
                                "./index.html"
                            );

                        });

                })

        );

    }
);

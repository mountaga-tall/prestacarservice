/* ==========================================================
   PRESTACAR SERVICES
   SERVICE WORKER V3
========================================================== */

const CACHE_NAME =
    "prestacar-services-v3";


const APP_SHELL = [

    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./logo.jpg"

];


/* ==========================================================
   INSTALLATION
========================================================== */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(
                            APP_SHELL
                        )
                )
                .then(
                    () =>
                        self.skipWaiting()
                )

        );

    }
);


/* ==========================================================
   ACTIVATION
========================================================== */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    cacheName =>
                                        cacheName !==
                                        CACHE_NAME
                                )
                                .map(
                                    cacheName =>
                                        caches.delete(
                                            cacheName
                                        )
                                )

                        );

                    }
                )
                .then(
                    () =>
                        self.clients.claim()
                )

        );

    }
);


/* ==========================================================
   FETCH
========================================================== */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        event.respondWith(

            fetch(event.request)

                .then(
                    response => {

                        /*
                         * Mise en cache des ressources
                         * provenant du même domaine.
                         */

                        if (
                            response &&
                            response.status === 200
                        ) {

                            const requestURL =
                                new URL(
                                    event.request.url
                                );


                            if (
                                requestURL.origin ===
                                self.location.origin
                            ) {

                                const responseClone =
                                    response.clone();


                                caches
                                    .open(
                                        CACHE_NAME
                                    )
                                    .then(
                                        cache => {

                                            cache.put(
                                                event.request,
                                                responseClone
                                            );

                                        }
                                    );

                            }

                        }


                        return response;

                    }
                )

                .catch(
                    () => {

                        return caches
                            .match(
                                event.request
                            )
                            .then(
                                cachedResponse => {

                                    if (
                                        cachedResponse
                                    ) {

                                        return cachedResponse;

                                    }


                                    return caches.match(
                                        "./index.html"
                                    );

                                }
                            );

                    }
                )

        );

    }
);

/* ==========================================================
   PRESTACAR SERVICES
   SERVICE WORKER V39
========================================================== */

const CACHE_NAME =
    "prestacar-services-v39";


const APP_SHELL = [

    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./manifest.json",
    "./logo.jpg?v=5",
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
    "./es/electronique-embarquee/",

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

                                    if (cachedResponse) {
                                        return cachedResponse;
                                    }

                                    /*
                                     * En mode hors ligne, ne renvoyer la page HTML
                                     * de secours qu'à une navigation du même domaine.
                                     * Une image, une police, un script ou une requête
                                     * externe non disponible doit rester en échec,
                                     * jamais recevoir du HTML à la place.
                                     */
                                    const requestURL = new URL(event.request.url);
                                    const isSameOrigin =
                                        requestURL.origin === self.location.origin;
                                    const isNavigation =
                                        event.request.mode === "navigate";

                                    if (isSameOrigin && isNavigation) {
                                        const cleanURL =
                                            requestURL.origin + requestURL.pathname;

                                        return caches
                                            .match(cleanURL)
                                            .then(pageResponse => {
                                                if (pageResponse) {
                                                    return pageResponse;
                                                }

                                                return caches.match(
                                                    new URL("./index.html", self.registration.scope).href
                                                ).then(fallback => fallback || Response.error());
                                            });
                                    }

                                    return Response.error();

                                }
                            );

                    }
                )

        );

    }
);

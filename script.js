/* ==========================================================
   PRESTACAR SERVICES
   PREMIUM JS V3
========================================================== */

"use strict";


/* ==========================================================
   ELEMENTS
========================================================== */

const header =
    document.getElementById("header");

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

const yearElement =
    document.getElementById("year");


/* ==========================================================
   ANNÉE AUTOMATIQUE
========================================================== */

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* ==========================================================
   HEADER AU SCROLL
========================================================== */

function updateHeader() {

    if (!header) return;

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* ==========================================================
   MENU MOBILE
========================================================== */

function openMenu() {

    if (!mainNav || !menuToggle) return;

    mainNav.classList.add("active");

    menuToggle.classList.add("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.style.overflow =
        "hidden";

}


function closeMenu() {

    if (!mainNav || !menuToggle) return;

    mainNav.classList.remove("active");

    menuToggle.classList.remove("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.style.overflow =
        "";

}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                mainNav.classList.contains("active");

            if (isOpen) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );

}


if (mainNav) {

    mainNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });

}


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeMenu();

        }

    }
);


/* ==========================================================
   REVEAL AU SCROLL
========================================================== */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "active"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        element => {

            element.classList.add(
                "active"
            );

        }
    );

}


/* ==========================================================
   DÉLAI PROGRESSIF DES CARTES
========================================================== */

document
    .querySelectorAll(
        ".expertise-grid .modern-card, .services-grid .service-box"
    )
    .forEach(
        (element, index) => {

            element.style.transitionDelay =
                `${index * 70}ms`;

        }
    );


/* ==========================================================
   EFFET 3D HERO
========================================================== */

const heroVisual =
    document.querySelector(".hero-visual");


const heroLogo =
    document.querySelector(".hero-logo");


if (
    heroVisual &&
    heroLogo &&
    window.matchMedia("(pointer:fine)").matches
) {

    heroVisual.addEventListener(
        "mousemove",
        event => {

            const rect =
                heroVisual.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -6;

            const rotateY =
                ((x - centerX) / centerX) * 6;

            heroLogo.style.transform =
                `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        }
    );


    heroVisual.addEventListener(
        "mouseleave",
        () => {

            heroLogo.style.transform =
                "";

        }
    );

}


/* ==========================================================
   EFFET TILT CARTES
========================================================== */

const tiltCards =
    document.querySelectorAll(
        ".modern-card, .service-box"
    );


if (
    window.matchMedia("(pointer:fine)").matches
) {

    tiltCards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const rotateX =
                    ((y - rect.height / 2) /
                        (rect.height / 2)) * -2.5;

                const rotateY =
                    ((x - rect.width / 2) /
                        (rect.width / 2)) * 2.5;

                card.style.transform =
                    `perspective(900px) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });

}


/* ==========================================================
   EFFET SOURIS GLOBAL
========================================================== */

if (
    window.matchMedia("(pointer:fine)").matches
) {

    document.addEventListener(
        "pointermove",
        event => {

            document.documentElement.style.setProperty(
                "--mouse-x",
                `${event.clientX}px`
            );

            document.documentElement.style.setProperty(
                "--mouse-y",
                `${event.clientY}px`
            );

        },
        { passive: true }
    );

}


/* ==========================================================
   FORMULAIRE — TRANSMISSION VIA WHATSAPP
========================================================== */

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const values = new FormData(contactForm);
        const language = document.documentElement.lang || "fr";
        const isEnglish = language === "en";
        const isSpanish = language === "es";
        const name = String(values.get("name") || "").trim();
        const email = String(values.get("email") || "").trim();
        const subject = String(values.get("subject") || "").trim();
        const message = String(values.get("message") || "").trim();

        const whatsappMessage = isEnglish
            ? [
                "Hello Prestacar Services, I would like to make a request.",
                "",
                "Name: " + name,
                "Email: " + email,
                "Subject: " + subject,
                "Message: " + message
            ].join("\n")
            : isSpanish
            ? [
                "Hola Prestacar Services, quisiera realizar una solicitud.",
                "",
                "Nombre: " + name,
                "Correo electrónico: " + email,
                "Asunto: " + subject,
                "Mensaje: " + message
            ].join("\n")
            : [
                "Bonjour Prestacar Services, je souhaite faire une demande.",
                "",
                "Nom : " + name,
                "Email : " + email,
                "Sujet : " + subject,
                "Message : " + message
            ].join("\n");

        const whatsappUrl = "https://wa.me/2250778615861?text=" + encodeURIComponent(whatsappMessage);

        if (formMessage) {
            formMessage.textContent = isEnglish
                ? "Opening WhatsApp with your pre-filled request…"
                : isSpanish
                ? "Abriendo WhatsApp con su solicitud preparada…"
                : "Ouverture de WhatsApp avec votre demande préremplie…";
        }

        /* WhatsApp opens with the request; the visitor confirms sending it there. */
        window.location.href = whatsappUrl;
    });
}


/* ==========================================================
   SMOOTH SCROLL
========================================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) return;


                    event.preventDefault();


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight -
                        20;


                    window.scrollTo(
                        {
                            top: targetPosition,
                            behavior: "smooth"
                        }
                    );

                }
            );

        }
    );


/* ==========================================================
   SERVICE WORKER
========================================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            const rootScript = document.querySelector('script[src*="script.js"]');
            const scriptUrl = rootScript
                ? new URL(rootScript.getAttribute("src"), window.location.href)
                : new URL("./script.js", window.location.href);
            const serviceWorkerUrl = new URL("./sw.js", scriptUrl);
            navigator.serviceWorker
                .register(
                    serviceWorkerUrl.pathname + serviceWorkerUrl.search
                )
                .then(
                    registration => {

                        console.log(
                            "Prestacar Services : Service Worker actif.",
                            registration.scope
                        );

                        /*
                         * Vérifie régulièrement si une
                         * nouvelle version est disponible.
                         */

                        registration.update();

                    }
                )
                .catch(
                    error => {

                        console.warn(
                            "Service Worker non disponible :",
                            error
                        );

                    }
                );

        }
    );

}


/* ==========================================================
   LOG
========================================================== */

console.log(
    "%c PRESTACAR SERVICES ",
    "background:#ff2448;color:white;font-weight:bold;padding:8px 12px;border-radius:6px;"
);

console.log(
    "Version Premium Marketing chargée."
);



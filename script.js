/* ==========================================================
   PRESTACAR SERVICES
   PREMIUM JS V3
========================================================== */

"use strict";

/* ==========================================================
   WHATSAPP — official brand mark, consistent on every page
========================================================== */
const PRESTACAR_WHATSAPP_MARK_PATH = "M380.9 97.1C339 55.1 283.2 32 223.9 32 101.5 32 1.4 132.1 1.4 254.5c0 39.2 10.2 77.5 29.5 111.2L0 480l117.1-30.7c32.2 17.6 68.4 26.9 106.8 26.9h.1c122.3 0 223.9-100.1 223.9-222.5 0-59.3-25-114.6-67-156.6zM223.9 438.7c-33.3 0-65.9-8.9-94.4-25.7l-6.8-4.1-69.5 18.2 18.5-67.8-4.4-7c-18.4-29.3-28.1-63.1-28.1-97.8 0-101.3 82.5-183.8 184-183.8 49.1 0 95.3 19.1 129.9 53.8 34.7 34.6 56.8 80.8 56.8 129.9 0 101.3-83.2 184.3-184 184.3zm101.2-138.3c-5.5-2.8-32.5-16-37.6-17.8-5-1.9-8.7-2.8-12.4 2.8-3.7 5.6-14.2 17.8-17.4 21.5-3.2 3.7-6.4 4.2-11.9 1.4-32.3-16.1-53.4-28.7-74.7-65.1-5.7-9.8 5.7-9.1 16.1-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-40.9-4.5-10.8-9.1-9.3-12.4-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.7 6.9-5.1 5.5-19.3 18.8-19.3 45.8 0 27 19.7 53.1 22.4 56.8 2.8 3.7 38.7 59.1 93.8 82.8 34.8 15 48.5 16.3 65.9 13.7 10.6-1.6 32.5-13.3 37.1-26.1 4.6-12.9 4.6-23.9 3.2-26.1-1.4-2.3-5.1-3.7-10.6-6.5z";

function normalizeWhatsAppBrandMarks() {
    const selectors = [
        ".whatsapp-icon svg",
        ".contact-icon-whatsapp svg",
        ".nav-whatsapp svg",
        ".social-whatsapp svg",
        'a[href*="wa.me"] svg',
        'a[href*="whatsapp.com"] svg',
        '[aria-label*="WhatsApp"] svg'
    ].join(", ");

    document.querySelectorAll(selectors).forEach((svg) => {
        svg.setAttribute("viewBox", "0 0 448 512");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("aria-hidden", "true");
        svg.removeAttribute("role");
        svg.innerHTML = '<path fill="currentColor" d="' + PRESTACAR_WHATSAPP_MARK_PATH + '"></path>';
    });
}

normalizeWhatsAppBrandMarks();



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
   MENU MOBILE — accessible, outside click, Escape, resize
========================================================== */

const menuBackdrop = document.createElement("button");
menuBackdrop.type = "button";
menuBackdrop.className = "menu-backdrop";
menuBackdrop.setAttribute("aria-label", "Fermer le menu");
menuBackdrop.tabIndex = -1;
document.body.appendChild(menuBackdrop);

function openMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.add("active");
    menuToggle.classList.add("active");
    if (header) header.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fermer le menu");
    menuBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
    const firstLink = mainNav.querySelector("a");
    if (firstLink && window.matchMedia("(max-width: 1180px)").matches) {
        window.setTimeout(() => firstLink.focus({ preventScroll: true }), 80);
    }
}

function closeMenu({ restoreFocus = false } = {}) {
    if (!mainNav || !menuToggle) return;
    const wasOpen = mainNav.classList.contains("active");
    mainNav.classList.remove("active");
    menuToggle.classList.remove("active");
    if (header) header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    menuBackdrop.classList.remove("active");
    document.body.style.overflow = "";
    if (restoreFocus && wasOpen) menuToggle.focus({ preventScroll: true });
}

if (menuToggle && mainNav) {
    menuToggle.setAttribute("aria-controls", "mainNav");
    menuToggle.addEventListener("click", () => {
        mainNav.classList.contains("active") ? closeMenu() : openMenu();
    });
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeMenu()));
    menuBackdrop.addEventListener("click", () => closeMenu({ restoreFocus: true }));
    document.addEventListener("keydown", event => {
        if (!mainNav.classList.contains("active")) return;

        if (event.key === "Escape") {
            event.preventDefault();
            closeMenu({ restoreFocus: true });
            return;
        }

        if (event.key !== "Tab") return;

        const focusableItems = Array.from(
            mainNav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter(element => element.getClientRects().length > 0);

        if (!focusableItems.length) return;

        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];

        if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
        }
    });
    window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 1181px)").matches) closeMenu();
    }, { passive: true });
}

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



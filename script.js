/* =========================================================
   PRESTACAR SERVICES
   PREMIUM JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. LOGO FALLBACK
       logo.svg → logo.png → logo.jpg
    ===================================================== */

    const logoImages =
        document.querySelectorAll("img[data-logo-fallback]");

    logoImages.forEach((img) => {

        let fallbackStep = 0;

        img.addEventListener("error", () => {

            fallbackStep++;

            if (fallbackStep === 1) {

                const fallback =
                    img.dataset.logoFallback;

                if (fallback) {
                    img.src = fallback;
                }

            } else if (fallbackStep === 2) {

                const fallback2 =
                    img.dataset.logoFallback2;

                if (fallback2) {
                    img.src = fallback2;
                }

            }

        });

    });


    /* =====================================================
       2. MENU MOBILE
    ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const nav =
        document.getElementById("main-navigation");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                nav.classList.toggle("active");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });


        const navLinks =
            nav.querySelectorAll("a");

        navLinks.forEach((link) => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");

                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );

            });

        });

    }


    /* =====================================================
       3. HEADER AU SCROLL
    ===================================================== */

    const header =
        document.querySelector(".header");

    const handleHeaderScroll = () => {

        if (!header) return;

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };

    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );

    handleHeaderScroll();


    /* =====================================================
       4. SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "active"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });


    /* =====================================================
       5. BARRES DE PERFORMANCE
    ===================================================== */

    const progressBars =
        document.querySelectorAll(
            ".progress-fill"
        );


    const progressObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting)
                        return;

                    const bar =
                        entry.target;

                    const width =
                        bar.dataset.width;

                    if (width) {

                        setTimeout(() => {

                            bar.style.width =
                                width;

                        }, 250);

                    }

                    observer.unobserve(bar);

                });

            },
            {
                threshold: 0.5
            }
        );


    progressBars.forEach((bar) => {

        progressObserver.observe(bar);

    });


    /* =====================================================
       6. EFFET 3D SUR LA CARTE HERO
    ===================================================== */

    const glassCard =
        document.querySelector(
            ".main-glass-card"
        );


    if (
        glassCard &&
        window.matchMedia(
            "(hover: hover)"
        ).matches
    ) {

        glassCard.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    glassCard.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) /
                        centerY) * -5;

                const rotateY =
                    ((x - centerX) /
                        centerX) * 5;

                glassCard.style.transform =
                    `
                    perspective(1200px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-5px)
                    `;
            }
        );


        glassCard.addEventListener(
            "mouseleave",
            () => {

                glassCard.style.transform =
                    "";

            }
        );

    }


    /* =====================================================
       7. ANNÉE AUTOMATIQUE
    ===================================================== */

    const yearElement =
        document.getElementById(
            "current-year"
        );

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       8. FORMULAIRE
    ===================================================== */

    const contactForm =
        document.getElementById(
            "contact-form"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const button =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );

                if (!button) return;

                const originalHTML =
                    button.innerHTML;

                button.disabled = true;

                button.innerHTML =
                    `
                    Préparation de votre demande
                    <span>✓</span>
                    `;

                button.style.background =
                    "var(--green)";


                setTimeout(() => {

                    button.disabled = false;

                    button.innerHTML =
                        originalHTML;

                    button.style.background =
                        "";

                    /*
                     * Pour l'instant le formulaire
                     * ne possède pas de backend.
                     *
                     * On remet simplement le formulaire
                     * à zéro après validation.
                     */

                    contactForm.reset();

                }, 2500);

            }
        );

    }


    /* =====================================================
       9. SERVICE WORKER / PWA
    ===================================================== */

    if ("serviceWorker" in navigator) {

        window.addEventListener(
            "load",
            () => {

                navigator.serviceWorker
                    .register("sw.js")
                    .then((registration) => {

                        console.log(
                            "Prestacar PWA active :",
                            registration.scope
                        );

                    })
                    .catch((error) => {

                        console.warn(
                            "Service Worker non disponible :",
                            error
                        );

                    });

            }
        );

    }


    /* =====================================================
       10. SMOOTH SCROLL
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((anchor) => {

            anchor.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        anchor.getAttribute("href");

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

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

});

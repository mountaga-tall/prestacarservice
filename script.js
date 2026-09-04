// ========================================
// PRESTACAR SERVICES
// Script principal du site
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------
    // MENU MOBILE
    // ----------------------------------------
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");

            const isOpen = nav.classList.contains("active");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        // Fermer le menu après avoir cliqué sur un lien
        const navLinks = nav.querySelectorAll("a");

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ----------------------------------------
    // HEADER AU SCROLL
    // ----------------------------------------
    const header = document.querySelector(".header");

    if (header) {
        const updateHeader = () => {
            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };

        window.addEventListener("scroll", updateHeader);
        updateHeader();
    }

    // ----------------------------------------
    // ANNÉE AUTOMATIQUE DANS LE FOOTER
    // ----------------------------------------
    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ----------------------------------------
    // SCROLL DOUX
    // ----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                const headerHeight = header
                    ? header.offsetHeight
                    : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                // Mettre à jour l'URL sans provoquer de saut
                history.pushState(null, "", targetId);
            }
        });
    });

    // ----------------------------------------
    // ANIMATION DES ÉLÉMENTS AU SCROLL
    // ----------------------------------------
    const animatedElements = document.querySelectorAll(
        ".pole-card, .service-card, .training-card, .about-content, .contact-content"
    );

    if ("IntersectionObserver" in window && animatedElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        animatedElements.forEach((element) => {
            element.classList.add("animate-on-scroll");
            observer.observe(element);
        });
    }

    // ----------------------------------------
    // FORMULAIRE DE CONTACT
    // ----------------------------------------
    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.querySelector("#name");
            const email = document.querySelector("#email");
            const phone = document.querySelector("#phone");
            const service = document.querySelector("#service");
            const message = document.querySelector("#message");

            // Vérification des champs
            if (!name || !email || !message) {
                return;
            }

            if (!name.value.trim()) {
                showFormMessage("Veuillez renseigner votre nom ou entreprise.", "error");
                name.focus();
                return;
            }

            if (!email.value.trim()) {
                showFormMessage("Veuillez renseigner votre adresse e-mail.", "error");
                email.focus();
                return;
            }

            if (!isValidEmail(email.value.trim())) {
                showFormMessage("Veuillez renseigner une adresse e-mail valide.", "error");
                email.focus();
                return;
            }

            if (!message.value.trim()) {
                showFormMessage("Veuillez saisir votre message.", "error");
                message.focus();
                return;
            }

            // Préparation du message
            const subject = service && service.value
                ? `Demande de contact - ${service.value}`
                : "Demande de contact - Prestacar Services";

            const body = `
Bonjour Prestacar Services,

Nom / Entreprise : ${name.value.trim()}
E-mail : ${email.value.trim()}
Téléphone : ${phone ? phone.value.trim() : ""}

Service demandé :
${service && service.value ? service.value : "Non précisé"}

Message :
${message.value.trim()}
            `.trim();

            // Adresse e-mail Prestacar Services
            const emailAddress = "prestacarservice@gmail.com";

            // Ouverture du logiciel de messagerie
            const mailtoUrl =
                `mailto:${emailAddress}` +
                `?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoUrl;

            showFormMessage(
                "Votre messagerie va s'ouvrir pour envoyer votre demande.",
                "success"
            );
        });
    }

    // ----------------------------------------
    // VALIDATION E-MAIL
    // ----------------------------------------
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ----------------------------------------
    // MESSAGE FORMULAIRE
    // ----------------------------------------
    function showFormMessage(message, type) {
        let messageElement = document.querySelector(".form-message");

        if (!messageElement && contactForm) {
            messageElement = document.createElement("div");
            messageElement.className = "form-message";
            contactForm.appendChild(messageElement);
        }

        if (!messageElement) {
            return;
        }

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;

        setTimeout(() => {
            messageElement.className = "form-message";
            messageElement.textContent = "";
        }, 6000);
    }

    // ----------------------------------------
    // BOUTON RETOUR EN HAUT
    // ----------------------------------------
    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 500) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        };

        window.addEventListener("scroll", toggleBackToTop);
        toggleBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ----------------------------------------
    // SERVICE WORKER / PWA
    // ----------------------------------------
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("./sw.js")
                .then((registration) => {
                    console.log(
                        "Prestacar Services : Service Worker enregistré.",
                        registration.scope
                    );
                })
                .catch((error) => {
                    console.error(
                        "Prestacar Services : erreur Service Worker.",
                        error
                    );
                });
        });
    }
});

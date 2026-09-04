document.addEventListener("DOMContentLoaded", () => {
    // Menu mobile
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", nav.classList.contains("active"));
        });
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Header au scroll
    const header = document.querySelector(".header");
    if (header) {
        const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 30);
        window.addEventListener("scroll", updateHeader);
        updateHeader();
    }

    // Année dynamique
    const currentYear = document.querySelector("#current-year");
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // Scroll doux
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: "smooth" });
                history.pushState(null, "", targetId);
            }
        });
    });

    // Animation au scroll
    const animatedElements = document.querySelectorAll(".pole-card, .service-card, .training-card, .about-content, .contact-content");
    if ("IntersectionObserver" in window && animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        animatedElements.forEach((element) => {
            element.classList.add("animate-on-scroll");
            observer.observe(element);
        });
    }

    // Formulaire de contact
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.querySelector("#name"), email = document.querySelector("#email");
            const phone = document.querySelector("#phone"), service = document.querySelector("#service");
            const message = document.querySelector("#message");

            if (!name || !email || !message) return;
            if (!name.value.trim()) return showFormMessage("Veuillez renseigner votre nom ou entreprise.", "error", name);
            if (!email.value.trim() || !isValidEmail(email.value.trim())) return showFormMessage("Veuillez renseigner un e-mail valide.", "error", email);
            if (!message.value.trim()) return showFormMessage("Veuillez saisir votre message.", "error", message);

            const subject = service && service.value ? `Demande de contact - ${service.value}` : "Demande de contact - Prestacar Services";
            const body = `Bonjour Prestacar Services,\n\nNom / Entreprise : ${name.value.trim()}\nE-mail : ${email.value.trim()}\nTéléphone : ${phone ? phone.value.trim() : ""}\n\nService demandé :\n${service && service.value ? service.value : "Non précisé"}\n\nMessage :\n${message.value.trim()}`;
            
            window.location.href = `mailto:prestacarservice@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            showFormMessage("Votre messagerie va s'ouvrir pour envoyer votre demande.", "success");
        });
    }

    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    function showFormMessage(message, type, field = null) {
        let messageElement = document.querySelector(".form-message");
        if (!messageElement && contactForm) {
            messageElement = document.createElement("div");
            messageElement.className = "form-message";
            contactForm.appendChild(messageElement);
        }
        if (!messageElement) return;
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        if (field) field.focus();
        setTimeout(() => { messageElement.className = "form-message"; messageElement.textContent = ""; }, 6000);
    }

    // Retour en haut
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        const toggleBackToTop = () => backToTop.classList.toggle("show", window.scrollY > 500);
        window.addEventListener("scroll", toggleBackToTop);
        toggleBackToTop();
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // PWA Service Worker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./sw.js")
                .then((reg) => console.log("Prestacar Services : Service Worker enregistré.", reg.scope))
                .catch((err) => console.error("Prestacar Services : erreur Service Worker.", err));
        });
    }
});

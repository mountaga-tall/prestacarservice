/* =========================================================
   PRESTACAR SERVICES
   JAVASCRIPT
========================================================= */


/* =========================================================
   MENU MOBILE
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const menuLinks = document.querySelectorAll(".menu a");


if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

        nav.classList.toggle("active");

        const isOpen = nav.classList.contains("active");

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Fermer le menu"
                : "Ouvrir le menu"
        );

    });

}


/* Fermer le menu lorsqu'on clique sur un lien */

menuLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (nav) {
            nav.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.setAttribute(
                "aria-label",
                "Ouvrir le menu"
            );
        }

    });

});


/* =========================================================
   FORMULAIRE DE CONTACT
========================================================= */

const form = document.querySelector(".contact-form");


if (form) {

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document
            .querySelector("#name")
            .value
            .trim();

        const email = document
            .querySelector("#email")
            .value
            .trim();

        const phone = document
            .querySelector("#phone")
            .value
            .trim();

        const service = document
            .querySelector("#service")
            .value
            .trim();

        const message = document
            .querySelector("#message")
            .value
            .trim();


        if (!name || !email || !message) {

            alert(
                "Veuillez remplir les champs obligatoires."
            );

            return;
        }


        /*
         * Pour le moment, le formulaire prépare un message
         * WhatsApp avec les informations saisies.
         */

        const whatsappNumber = "2250778615861";


        const whatsappMessage =
            "Bonjour Prestacar Services,%0A%0A" +

            "*Nouvelle demande de contact*%0A%0A" +

            "*Nom / Entreprise :* " +
            encodeURIComponent(name) +

            "%0A" +

            "*Email :* " +
            encodeURIComponent(email) +

            "%0A" +

            "*Téléphone :* " +
            encodeURIComponent(phone || "Non renseigné") +

            "%0A" +

            "*Service :* " +
            encodeURIComponent(service || "Non précisé") +

            "%0A%0A" +

            "*Message :*%0A" +
            encodeURIComponent(message);


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            whatsappMessage;


        const confirmation = confirm(
            "Votre demande est prête. Voulez-vous l'envoyer à Prestacar Services via WhatsApp ?"
        );


        if (confirmation) {

            window.open(
                whatsappURL,
                "_blank"
            );

            form.reset();

        }

    });

}


/* =========================================================
   ANNÉE AUTOMATIQUE DU FOOTER
========================================================= */

const footerYear = document.querySelector(
    ".footer-bottom p"
);

if (footerYear) {

    const currentYear = new Date().getFullYear();

    footerYear.innerHTML =
        "© " +
        currentYear +
        " Prestacar Services. Tous droits réservés.";

}


/* =========================================================
   ANIMATION SIMPLE AU SCROLL
========================================================= */

const animatedElements = document.querySelectorAll(
    ".pole-card, .service-card, .training-card"
);


const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    },
    {
        threshold: 0.1
    }
);


animatedElements.forEach((element) => {

    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

});

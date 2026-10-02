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
   FORMULAIRE
========================================================== */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const submitButton =
                contactForm.querySelector(
                    ".form-submit"
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.style.opacity =
                    ".65";

                submitButton.innerHTML =
                    languageState.language === "en"
                        ? "Sending..."
                        : "Envoi en cours...";

            }


            setTimeout(
                () => {

                    if (formMessage) {

                        formMessage.textContent =
                            languageState.language === "en"
                                ? "Thank you! Your request has been received."
                                : "Merci ! Votre demande a bien été prise en compte.";

                    }


                    contactForm.reset();


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.style.opacity =
                            "1";

                        submitButton.innerHTML =
                            languageState.language === "en"
                                ? "Send message <span>→</span>"
                                : "Envoyer le message <span>→</span>";

                    }

                },
                900
            );

        }
    );

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

            navigator.serviceWorker
                .register("./sw.js")
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
    "Version Premium V3 chargée."
);


/* ==========================================================
   LANGUAGE SWITCH — FR / EN
   Inspired by the Keur Dia language pattern
========================================================== */

const languageState = {
    language:
        localStorage.getItem("prestacar-lang") === "en"
            ? "en"
            : "fr"
};

const languageTranslations = new Map([
    ["Solutions professionnelles", "Professional solutions"],
    ["SOLUTIONS PROFESSIONNELLES", "PROFESSIONAL SOLUTIONS"],
    ["Votre partenaire pour", "Your partner for"],
    ["transformer", "turning"],
    ["vos ambitions en résultats.", "your ambitions into results."],
    ["Prestacar Services propose des solutions", "Prestacar Services provides professional"],
    ["professionnelles en digitalisation, formation,", "solutions in digitalization, training,"],
    ["relation client, solutions techniques et sécurité.", "customer relations, technical services, and security."],
    ["Découvrir nos services", "Discover our services"],
    ["Nous contacter", "Contact us"],
    ["Domaines d'expertise", "Areas of expertise"],
    ["Engagement", "Commitment"],
    ["Disponibilité", "Availability"],
    ["Logo Prestacar Services", "Prestacar Services Logo"],
    ["Des solutions efficaces", "Effective solutions"],
    ["Professionnalisme", "Professionalism"],
    ["Une approche structurée", "A structured approach"],
    ["Des solutions modernes", "Modern solutions"],
    ["NOTRE EXPERTISE", "OUR EXPERTISE"],
    ["Des solutions pensées pour", "Solutions designed to"],
    ["faire la différence.", "make a difference."],
    ["Nous combinons expertise, technologie et", "We combine expertise, technology, and"],
    ["accompagnement humain pour répondre aux", "human support to meet the"],
    ["besoins réels des professionnels.", "real needs of professionals."],
    ["Digitalisation", "Digitalization"],
    ["Nous aidons les entreprises à moderniser", "We help businesses modernize"],
    ["leurs outils, processus et présence digitale.", "their tools, processes, and digital presence."],
    ["En savoir plus →", "Learn more →"],
    ["Formation", "Training"],
    ["Des formations adaptées aux besoins", "Training tailored to professional"],
    ["professionnels pour développer les compétences.", "needs to develop skills."],
    ["Relation client", "Customer relations"],
    ["Amélioration de l'expérience client,", "Improving customer experience,"],
    ["satisfaction et fidélisation.", "satisfaction and loyalty."],
    ["Solutions techniques", "Technical solutions"],
    ["Des solutions techniques adaptées à vos", "Technical solutions tailored to your"],
    ["contraintes et à votre environnement.", "constraints and environment."],
    ["Sécurité", "Security"],
    ["Des solutions et conseils pour renforcer", "Solutions and guidance to strengthen"],
    ["la sécurité de vos activités.", "the security of your operations."],
    ["Accompagnement", "Support"],
    ["Un accompagnement personnalisé pour", "Personalized support to"],
    ["structurer et accélérer vos projets.", "structure and accelerate your projects."],
    ["Démarrer un projet →", "Start a project →"],
    ["À PROPOS", "ABOUT US"],
    ["Plus qu'un prestataire,", "More than a service provider,"],
    ["un partenaire.", "a partner."],
    ["Prestacar Services accompagne les entreprises,", "Prestacar Services supports businesses,"],
    ["entrepreneurs et particuliers dans leurs projets", "entrepreneurs and individuals with their projects"],
    ["en apportant des solutions concrètes, modernes", "by providing practical, modern"],
    ["et adaptées.", "and tailored solutions."],
    ["Notre approche repose sur l'écoute,", "Our approach is based on listening,"],
    ["la rigueur, l'innovation et la recherche", "rigor, innovation, and a continuous"],
    ["permanente de résultats.", "pursuit of results."],
    ["Approche personnalisée", "Personalized approach"],
    ["Chaque projet bénéficie d'une", "Every project benefits from an"],
    ["approche adaptée à ses besoins.", "approach tailored to its needs."],
    ["Solutions concrètes", "Practical solutions"],
    ["Nous privilégions les solutions", "We prioritize solutions"],
    ["directement applicables.", "that can be applied directly."],
    ["Orientation résultats", "Results-driven approach"],
    ["Notre objectif est de créer", "Our goal is to create"],
    ["une valeur mesurable.", "measurable value."],
    ["NOS SERVICES", "OUR SERVICES"],
    ["Une offre conçue autour", "An offering built around"],
    ["de vos", "your"],
    ["besoins.", "needs."],
    ["Sites web, outils numériques,", "Websites, digital tools,"],
    ["automatisation et accompagnement digital.", "automation, and digital support."],
    ["Conseil & stratégie", "Consulting & strategy"],
    ["Analyse, conseil et accompagnement", "Analysis, consulting, and strategic"],
    ["stratégique pour vos projets.", "support for your projects."],
    ["Développement des compétences et", "Skills development and"],
    ["formations professionnelles.", "professional training."],
    ["Expérience client", "Customer experience"],
    ["Relation client, satisfaction,", "Customer relations, satisfaction,"],
    ["fidélisation et optimisation du parcours.", "loyalty, and journey optimization."],
    ["Technique", "Technical"],
    ["Solutions techniques adaptées", "Technical solutions tailored"],
    ["aux besoins de votre activité.", "to your business needs."],
    ["Conseil et solutions pour renforcer", "Advice and solutions to strengthen"],
    ["UN PROJET ?", "HAVE A PROJECT?"],
    ["Parlons de votre", "Let’s talk about your"],
    ["prochain projet.", "next project."],
    ["Expliquez-nous votre besoin et nous", "Tell us what you need and we"],
    ["vous aiderons à identifier la meilleure", "will help you identify the best"],
    ["solution.", "solution."],
    ["Démarrer la discussion →", "Start the conversation →"],
    ["Construisons quelque chose", "Let’s build something"],
    ["solide.", "solid."],
    ["Téléphone", "Phone"],
    ["Nom", "Name"],
    ["Votre nom", "Your name"],
    ["Sujet", "Subject"],
    ["Comment pouvons-nous vous aider ?", "How can we help you?"],
    ["Décrivez votre projet...", "Describe your project..."],
    ["Envoyer le message", "Send message"],
    ["Contacter Prestacar Services sur WhatsApp", "Contact Prestacar Services on WhatsApp"],
    ["Contactez-nous", "Contact us"],
    ["Des solutions professionnelles pour", "Professional solutions to"],
    ["accompagner vos projets et votre croissance.", "support your projects and growth."],
    ["Accueil", "Home"],
    ["À propos", "About"],
    ["Tous droits réservés.", "All rights reserved."],
    ["Excellence • Innovation • Résultats", "Excellence • Innovation • Results"]
]);

const originalTextNodes = new Map();
const originalAttributes = new Map();

const normalizeLanguageText = value =>
    value.replace(/\s+/g, " ").trim();

const preserveWhitespace = (original, translated) => {
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    return leading + translated + trailing;
};

{
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;

    while (node = walker.nextNode()) {
        if (node.parentElement?.closest("script, style")) {
            continue;
        }

        originalTextNodes.set(node, node.nodeValue);
    }
}

document
    .querySelectorAll("input, textarea, button, a, img, [aria-label]")
    .forEach(element => {
        const attrs = {};

        ["placeholder", "aria-label", "alt"].forEach(name => {
            if (element.hasAttribute(name)) {
                attrs[name] = element.getAttribute(name);
            }
        });

        if (Object.keys(attrs).length) {
            originalAttributes.set(element, attrs);
        }
    });

const pageMeta = {
    title: [
        "Prestacar Services | Solutions Professionnelles",
        "Prestacar Services | Professional Solutions"
    ],
    description: [
        "Prestacar Services accompagne les entreprises et particuliers avec des solutions professionnelles en digitalisation, formation, relation client, technique et sécurité.",
        "Prestacar Services supports businesses and individuals with professional solutions in digitalization, training, customer relations, technical services, and security."
    ]
};

const sortedTranslations = [...languageTranslations.entries()]
    .sort((a, b) => b[0].length - a[0].length);

function replaceFrenchText(value) {
    let result = value;

    sortedTranslations.forEach(([fr, en]) => {
        result = result.split(fr).join(en);
    });

    return result;
}

function translateTextNodes(language) {
    originalTextNodes.forEach((original, node) => {
        if (!normalizeLanguageText(original)) {
            node.nodeValue = original;
            return;
        }

        node.nodeValue =
            language === "en"
                ? replaceFrenchText(original)
                : original;
    });
}

function translateAttributes(language) {
    originalAttributes.forEach((attrs, element) => {
        Object.entries(attrs).forEach(([name, original]) => {
            element.setAttribute(
                name,
                language === "en"
                    ? replaceFrenchText(original)
                    : original
            );
        });
    });
}

function translateCompoundContent(language) {
    const aboutHeading =
        document.querySelector(".about-content h2");

    if (aboutHeading) {
        aboutHeading.innerHTML =
            language === "en"
                ? "More than a service provider,<br><span>a partner.</span>"
                : "Plus qu'un prestataire,<br><span>un partenaire.</span>";
    }

    const servicesHeading =
        document.querySelector(".services .section-heading h2");

    if (servicesHeading) {
        servicesHeading.innerHTML =
            language === "en"
                ? "An offering built around<br>your <span>needs.</span>"
                : "Une offre conçue autour<br>de vos <span>besoins.</span>";
    }

    const contactHeading =
        document.querySelector(".contact .section-heading h2");

    if (contactHeading) {
        contactHeading.innerHTML =
            language === "en"
                ? "Let’s build something<br>truly <span>solid.</span>"
                : "Construisons quelque chose<br>de <span>solide.</span>";
    }
}

function updateFormLanguage(language) {
    const submitButton =
        document.querySelector(".form-submit");

    if (submitButton && !submitButton.disabled) {
        submitButton.innerHTML =
            language === "en"
                ? 'Send message <span>→</span>'
                : 'Envoyer le message <span>→</span>';
    }

    if (formMessage && formMessage.textContent.trim()) {
        formMessage.textContent =
            language === "en"
                ? "Thank you! Your request has been received."
                : "Merci ! Votre demande a bien été prise en compte.";
    }
}

function updateLanguageUi(language) {
    document.documentElement.lang = language;

    const meta = document.querySelector('meta[name="description"]');

    document.title =
        language === "en"
            ? pageMeta.title[1]
            : pageMeta.title[0];

    if (meta) {
        meta.content =
            language === "en"
                ? pageMeta.description[1]
                : pageMeta.description[0];
    }

    document
        .querySelectorAll("[data-lang]")
        .forEach(button => {
            const active =
                button.dataset.lang === language;

            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

    const languageSwitch =
        document.getElementById("langSwitch");

    if (languageSwitch) {
        languageSwitch.setAttribute(
            "aria-label",
            language === "en"
                ? "Language"
                : "Langue"
        );
    }
}

function translatePage(language) {
    translateTextNodes(language);
    translateAttributes(language);
    translateCompoundContent(language);
    updateFormLanguage(language);
    updateLanguageUi(language);

    languageState.language = language;
    localStorage.setItem("prestacar-lang", language);
}

document
    .querySelectorAll("[data-lang]")
    .forEach(button => {
        button.addEventListener(
            "click",
            () => translatePage(button.dataset.lang)
        );
    });

translatePage(languageState.language);

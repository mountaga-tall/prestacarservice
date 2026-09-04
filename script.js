document.addEventListener("DOMContentLoaded", () => {
    // 1. Menu Mobile Glassmorphism
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            const spans = menuToggle.querySelectorAll("span");
            if (nav.classList.contains("active")) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });
        
        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                const spans = menuToggle.querySelectorAll("span");
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            });
        });
    }

    // 2. Header dynamique au scroll
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 3. Scroll Reveal (Animation au défilement)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    setTimeout(() => {
        document.querySelectorAll('#accueil .reveal').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    // 4. Gestion du formulaire
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const service = document.getElementById("service").value;
            const message = document.getElementById("message").value;

            const subject = encodeURIComponent(`Nouveau projet - ${service} - ${name}`);
            const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nService souhaité: ${service}\n\nMessage:\n${message}`);
            
            window.location.href = `mailto:prestacarservice@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    // 5. Année dynamique
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

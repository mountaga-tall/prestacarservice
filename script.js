document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestion du Menu Mobile (Responsive)
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-navigation');

    if (menuToggle && nav) {
        // Ouvre ou ferme le menu au clic sur le bouton burger
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Ferme le menu automatiquement quand on clique sur un lien (très utile sur mobile)
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }

    // 2. Changement de style du Header au défilement (Scroll)
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Déclenchement des animations "Wow" au défilement (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si l'élément devient visible à l'écran
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // Déclenche l'animation CSS
                observer.unobserve(entry.target); // Arrête d'observer pour ne le jouer qu'une fois
            }
        });
    }, {
        threshold: 0.15, // Se déclenche quand 15% de l'élément est visible
        rootMargin: "0px 0px -50px 0px" // Décale légèrement le déclenchement
    });

    // On applique l'observateur à tous nos éléments cachés
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Mise à jour automatique de l'année dans le footer (pas besoin de le changer chaque année !)
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // 5. Petit bonus : empêcher le rechargement de la page lors de la soumission du formulaire 
    // (en attendant d'y brancher un vrai backend)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // Effet visuel d'envoi réussi
            btn.textContent = "✓ Message envoyé !";
            btn.style.background = "var(--green)";
            
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = originalText;
                btn.style.background = "";
            }, 3000);
        });
    }
});

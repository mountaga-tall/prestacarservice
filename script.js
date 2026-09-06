document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Mobile (Responsive)
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-navigation');

    if (menuToggle && nav) {
        // Ouvre/Ferme le menu au clic sur le bouton burger
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Ferme le menu automatiquement quand on clique sur un lien
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }

    // 2. Header dynamique (Glassmorphism) au scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Effet "Wow" - Apparition au scroll pour les éléments .reveal
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe .active qui déclenche l'animation CSS
                entry.target.classList.add('active');
                
                // On arrête d'observer l'élément pour que l'animation ne se joue qu'une fois
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15, // Se déclenche quand 15% de l'élément est visible à l'écran
        rootMargin: "0px 0px -50px 0px"
    });

    // Applique l'observateur à tous les éléments contenant la classe .reveal
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Mise à jour automatique de l'année dans le footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

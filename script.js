// ================= MENU MOBILE =================

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});


// Fermer le menu après avoir cliqué sur un lien

document.querySelectorAll(".menu a").forEach(link => {

    link.addEventListener("click", () => {
        menu.classList.remove("active");
    });

});


// ================= FORMULAIRE =================

const form = document.querySelector(".contact-form");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = form.querySelector('input[type="text"]').value;

    alert(
        "Merci " + name +
        " ! Votre demande a bien été enregistrée. " +
        "Prestacar Services vous contactera prochainement."
    );

    form.reset();

});
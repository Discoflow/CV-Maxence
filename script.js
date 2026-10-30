"use strict";

/* =========================================================
   NAVIGATION MOBILE
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");

  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Ouvrir le menu" : "Fermer le menu"
    );

    mainNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}


/* =========================================================
   ANIMATIONS AU DÉFILEMENT
   ========================================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}


/* =========================================================
   NAVIGATION ACTIVE
   ========================================================= */

const navigationLinks = document.querySelectorAll(
  '.main-nav a[href^="#"]'
);

const sections = document.querySelectorAll(
  "main section[id]"
);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const sectionId = entry.target.id;

        navigationLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${sectionId}`;

          if (isActive) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


/* =========================================================
   ANNÉE AUTOMATIQUE
   ========================================================= */

const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   FORMULAIRE DE CONTACT
   ========================================================= */

/*
  GitHub Pages ne traite pas directement les formulaires.
  Cette version prépare un e-mail dans le logiciel de messagerie
  du visiteur. Aucun service tiers n'est nécessaire.

  Pour un formulaire envoyé directement depuis le site,
  il faudra ensuite connecter un service adapté.
*/

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const recipient = "maxence.vincentpro@outlook.com";

    const subject = encodeURIComponent(
      `Prise de contact depuis le portfolio — ${name}`
    );

    const body = encodeURIComponent(
      `Bonjour Maxence,\n\n` +
      `${message}\n\n` +
      `Cordialement,\n${name}\n` +
      `E-mail : ${email}`
    );

    const mailto =
      `mailto:${recipient}?subject=${subject}&body=${body}`;

    if (formStatus) {
      formStatus.textContent =
        "Votre logiciel de messagerie va s'ouvrir. Vérifiez le message avant de l'envoyer.";
    }

    window.location.href = mailto;
  });
}

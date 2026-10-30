```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  const revealElements = document.querySelectorAll(".reveal");
  const yearElements = document.querySelectorAll("[data-year]");

  /*
   * 1. ANNÉE AUTOMATIQUE
   */
  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /*
   * 2. NAVIGATION MOBILE
   */
  if (menuToggle && navigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      navigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );

      menuToggle.setAttribute(
        "aria-label",
        isExpanded ? "Ouvrir le menu" : "Fermer le menu"
      );

      navigation.classList.toggle("is-open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  /*
   * 3. ANIMATION D'APPARITION AU DÉFILEMENT
   *
   * Les éléments restent visibles si IntersectionObserver
   * n'est pas disponible ou si les animations sont désactivées.
   */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    revealElements.length > 0 &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    /*
     * On active le masquage uniquement après avoir initialisé
     * l'observateur : en cas d'erreur, le contenu reste visible.
     */
    root.classList.add("reveal-ready");

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /*
   * 4. NAVIGATION ACTIVE AU DÉFILEMENT
   */
  const sections = document.querySelectorAll(
    "main section[id], section[id]"
  );

  const navLinks = document.querySelectorAll(
    '.main-nav a[href^="#"]'
  );

  if (
    sections.length > 0 &&
    navLinks.length > 0 &&
    "IntersectionObserver" in window
  ) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
});
```

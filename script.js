"use strict";
// Progressive enhancement: content and navigation remain usable without JavaScript.
const menu = document.querySelector(".menu-toggle");
const links = document.querySelector("#nav-links");
if (menu && links) {
  document.documentElement.classList.add("js");
  menu.hidden = false;
  function closeMenu(returnFocus = false) {
    links.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    if (returnFocus) menu.focus();
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    links.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (!anchor) return;
    closeMenu();
    // Keep keyboard focus in the selected section after the mobile menu closes.
    if (
      window.matchMedia("(max-width: 760px)").matches &&
      anchor.hash &&
      anchor.origin === location.origin
    ) {
      const target = document.querySelector(anchor.hash);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          { once: true },
        );
      }
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.classList.contains("open"))
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  window
    .matchMedia("(max-width: 760px)")
    .addEventListener("change", () => closeMenu());
}
if ("IntersectionObserver" in window) {
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          if (anchor.hash === "#" + entry.target.id)
            anchor.setAttribute("aria-current", "location");
          else anchor.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
  );
  navAnchors.forEach((anchor) => {
    const section = document.querySelector(anchor.hash);
    if (section) sectionObserver.observe(section);
  });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal, .skill-card, .milestones article, .timeline li, .github-section")
      .forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
      });
  }
}

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
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealTargets = document.querySelectorAll(
    ".section-heading, .project-card, .about-photo, .about-copy, .skill-card, .milestones article, .journey-grid > div, .timeline li, .exploring, .github-section, .contact-section"
  );
  // Only enhance after an observer exists; the page remains visible without JS.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else if (entry.boundingClientRect.bottom <= 0 ||
                 entry.boundingClientRect.top >= window.innerHeight) {
        // Replay on the next visit, but never hide a partially visible section.
        entry.target.classList.remove("is-visible");
      }
    });
  }, { threshold: 0, rootMargin: "0px" });
  function configureScrollMotion() {
    revealObserver.disconnect();
    revealTargets.forEach((element) => {
      element.classList.remove("reveal", "visible", "scroll-reveal", "is-visible");
      if (motionPreference.matches) return;
      const siblings = [...element.parentElement.children];
      const isCardGroup = element.matches(".project-card, .skill-card, .milestones article");
      element.style.setProperty("--reveal-delay", isCardGroup ? `${siblings.indexOf(element) % 4 * 110}ms` : "0ms");
      // Preserve anything already on screen when loading or restoring a page.
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        element.classList.add("is-visible");
      }
      element.dataset.reveal = element.matches(".about-photo, .featured:first-child") ? "left" :
        element.matches(".about-copy, .featured:nth-child(2)") ? "right" :
        element.matches(".section-heading, .journey-grid > div, .contact-section") ? "heading" : "up";
      element.classList.add("scroll-reveal");
      revealObserver.observe(element);
    });
  }
  configureScrollMotion();
  motionPreference.addEventListener("change", configureScrollMotion);
}

// Scroll progress and restrained depth effects. No animation loop runs while idle.
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const progress = document.createElement("div");
progress.className = "reading-progress";
progress.setAttribute("aria-hidden", "true");
document.body.append(progress);
const heroPhoto = document.querySelector(".portrait-frame picture");
let scrollFrame = 0;
function updateScrollEffects() {
  scrollFrame = 0;
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  if (heroPhoto) {
    const offset = motionQuery.matches ? 0 : Math.min(window.scrollY * .045, 18);
    heroPhoto.style.translate = `0 ${offset}px`;
  }
}
function scheduleScrollEffects() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
}
window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
window.addEventListener("resize", scheduleScrollEffects, { passive: true });
motionQuery.addEventListener("change", scheduleScrollEffects);
updateScrollEffects();
document.querySelectorAll(".project-card").forEach((card) => {
  let pointerFrame = 0;
  let pointerX = 0, pointerY = 0;
  function resetDepth() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
    card.classList.remove("pointer-active");
  }
  card.addEventListener("pointermove", (event) => {
    if (motionQuery.matches || !finePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width;
    pointerY = (event.clientY - bounds.top) / bounds.height;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      card.style.setProperty("--tilt-x", `${(0.5 - pointerY) * 3}deg`);
      card.style.setProperty("--tilt-y", `${(pointerX - 0.5) * 3}deg`);
      card.classList.add("pointer-active");
    });
  });
  card.addEventListener("pointerleave", resetDepth);
  motionQuery.addEventListener("change", resetDepth);
});

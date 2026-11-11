/* Base interactions for the portfolio. No passwords or keys live here. */
(function () {
  document.documentElement.classList.add("js");

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Profile photo: if images/profile.jpg is not in the repo yet, show initials
  var pic = document.getElementById("profilePic");
  if (pic) {
    var noImg = function () { pic.parentElement.classList.add("no-img"); };
    pic.addEventListener("error", noImg);
    if (pic.complete && pic.naturalWidth === 0) noImg();
  }

  // Menu bar: shadow after scrolling
  var nav = document.getElementById("nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 20); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // Reveal on scroll. Extra elements below the hero also get the effect.
  document.querySelectorAll(
    ".section .eyebrow, .section__title, .about__text, .about__facts li, .work__card, .contact__title, .contact__links"
  ).forEach(function (el) { el.classList.add("reveal"); });

  var items = document.querySelectorAll(".reveal");
  var agents = window.Agents;               // from js/agents.js (optional)
  if (agents) agents.setTotal(items.length);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (agents) agents.build(en.target);
        else en.target.classList.add("is-in");
      });
    }, { threshold: 0.15 });
    items.forEach(function (el, i) {
      if (!agents) el.style.transitionDelay = Math.min(i * 90, 540) + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Highlight the current section in the menu
  var sections = ["home", "about", "work", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var topLinks = links.querySelectorAll(":scope > a, :scope > .nav__drop > a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        topLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();

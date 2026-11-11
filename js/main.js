/* Renders the content and handles menu, popups and animations.
   No passwords or keys live here. */
(function () {
  document.documentElement.classList.add("js");
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var safeUrl = function (u) {
    u = String(u || "").trim();
    return /^(https?:|mailto:|tel:)/i.test(u) ? u : "#";
  };

  var content = {};
  var LISTS = {
    leadership: { no: "01.", title: "Leadership" },
    awards:     { no: "02.", title: "Awards" }
  };

  /* ---------- render ---------- */
  function render(saved) {
    var d = window.DEFAULT_CONTENT, c = {};
    Object.keys(d).forEach(function (k) { c[k] = saved && saved[k] != null ? saved[k] : d[k]; });
    content = c;

    $("heroName").textContent = c.hero.name || "";
    var full = c.hero.fullName || window.DEFAULT_CONTENT.hero.fullName;
    $("brand").textContent = full; $("navName").textContent = full;
    $("heroTagline").textContent = c.hero.tagline || "";
    $("heroBadge").textContent = c.hero.badge || "";
    $("heroDesc").innerHTML = esc(c.hero.description).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    $("aboutText").textContent = c.about.text || "";

    var pic = $("profilePic"), src = "images/" + (c.hero.photo || "profile.jpg");
    if (pic.getAttribute("src") !== src) {
      pic.parentElement.classList.remove("no-img");
      pic.setAttribute("src", src);
    }

    // {awards} and {leadership} in a number are replaced by how many entries those lists have
    var count = function (v) {
      return String(v == null ? "" : v).replace("{awards}", c.awards.length).replace("{leadership}", c.leadership.length);
    };
    $("stats").innerHTML = c.stats.map(function (s, i) {
      return "<li><b" + (i === 0 ? ' class="accent"' : "") + ">" + esc(count(s.value)) + "</b><span>" + esc(s.label) + "</span></li>";
    }).join("");

    $("tags").innerHTML = c.tags.map(function (t) { return "<li>" + esc(t.text) + "</li>"; }).join("");

    $("cards").innerHTML = Object.keys(LISTS).map(function (key) {
      var items = c[key] || [], L = LISTS[key];
      return '<div class="card" data-open="' + key + '">' +
        '<div class="card__top"><span>' + L.no + "</span><em>" + L.title + "</em></div>" +
        '<ul class="card__list">' + items.slice(0, 2).map(function (it) {
          return "<li><h3>" + esc(it.title) + "</h3><p>" + esc(it.sub) + "</p></li>";
        }).join("") + "</ul>" +
        '<button type="button" class="card__more">See all ' + items.length + " <span>→</span></button></div>";
    }).join("");

    var T = window.SOCIAL_TYPES;
    $("socials").innerHTML = c.socials.map(function (s) {
      var t = T[s.type] || T.website, url = safeUrl(s.url);
      var ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";
      return '<a class="social" href="' + esc(url) + '"' + ext + '><i class="' + t.icon + '" aria-hidden="true"></i><span>' +
        esc(s.label || t.label) + "</span></a>";
    }).join("");
  }

  window.Site = { render: render };
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem("site-content")); } catch (e) {}
  render(cached);

  /* ---------- "See all" popup ---------- */
  var modal = $("modal");
  function openList(key) {
    var items = content[key] || [], L = LISTS[key];
    $("modalKicker").textContent = L.no + " " + items.length + " entries";
    $("modalTitle").textContent = L.title;
    $("modalList").innerHTML = items.map(function (it, i) {
      return "<li><span class='modal__no'>" + String(i + 1).padStart(2, "0") + "</span><div><h3>" + esc(it.title) +
        "</h3><p>" + esc(it.sub) + "</p></div><em>" + esc(it.tag) + "</em></li>";
    }).join("");
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    $("modalList").scrollTop = 0;
  }
  function closeModal() { if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  $("cards").addEventListener("click", function (e) {
    var card = e.target.closest("[data-open]");
    if (card) openList(card.getAttribute("data-open"));
  });
  $("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); }); // click outside

  /* ---------- small things ---------- */
  $("year").textContent = new Date().getFullYear();

  var pic = $("profilePic");
  var noImg = function () { pic.parentElement.classList.add("no-img"); };
  pic.addEventListener("error", noImg);
  if (pic.complete && pic.naturalWidth === 0) noImg();

  var nav = $("nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 20); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = $("burger"), links = $("navLinks");
  burger.addEventListener("click", function () {
    burger.setAttribute("aria-expanded", links.classList.toggle("is-open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- reveal on scroll (with the agent cursors, if loaded) ---------- */
  document.querySelectorAll(
    ".section .eyebrow, .section__title, .about__text, .about__facts li, .work__card, .contact__title, .contact__links"
  ).forEach(function (el) { el.classList.add("reveal"); });

  // Elements appear when they scroll into view and hide again when they leave,
  // so the effect replays whether you scroll down or back up.
  var items = document.querySelectorAll(".reveal");
  var agents = window.Agents;
  var showEl = function (el) {
    if (el._want) return;
    el._want = true;
    if (agents) agents.build(el); else el.classList.add("is-in");
  };
  var hideEl = function (el) { el._want = false; el.classList.remove("is-in"); };

  if ("IntersectionObserver" in window) {
    var showIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) showEl(en.target); });
    }, { threshold: 0.15 });
    // hide only once it is well outside the screen (80px), so it can't flicker at the edge
    var hideIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (!en.isIntersecting) hideEl(en.target); });
    }, { rootMargin: "80px 0px 80px 0px" });
    items.forEach(function (el) { showIO.observe(el); hideIO.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- highlight current section in the menu ---------- */
  var sections = ["home", "about", "work", "contact"].map($).filter(Boolean);
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

/* Home page: shows the content and handles popups. No passwords or keys live here. */
(function () {
  var C = window.Core, esc = C.esc;
  var $ = function (id) { return document.getElementById(id); };

  var content = {};
  var LISTS = {
    leadership: { no: "01.", title: "Leadership" },
    awards:     { no: "02.", title: "Awards" }
  };

  /* ---------- photo: tries the chosen file, then the usual names ---------- */
  var pic = $("profilePic"), tries = [];
  function loadPhoto(name) {
    tries = [name, "profile.png", "profile.jpg", "profile.jpeg", "profile.webp"].filter(function (n, i, a) {
      return n && a.indexOf(n) === i;
    });
    pic.parentElement.classList.remove("no-img");
    pic.src = "images/" + tries.shift();
  }
  pic.addEventListener("error", function () {
    if (tries.length) pic.src = "images/" + tries.shift();
    else pic.parentElement.classList.add("no-img");
  });

  /* ---------- render ---------- */
  function render(saved) {
    var c = content = C.merge(saved);
    var count = function (v) {
      return String(v == null ? "" : v).replace(/\{(\w+)\}/g, function (m, k) {
        return Array.isArray(c[k]) ? c[k].length : m;
      });
    };

    $("heroName").textContent = c.hero.name;
    $("brand").textContent = c.hero.fullName;
    $("navName").textContent = c.hero.fullName;
    $("heroTagline").textContent = c.hero.tagline;
    $("heroDesc").innerHTML = esc(c.hero.description).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    $("aboutText").textContent = c.about.text;
    $("cvDownload").href = "files/" + encodeURIComponent(c.cv.file || "CV_Ratul.pdf");

    if (pic.dataset.name !== c.hero.photo) { pic.dataset.name = c.hero.photo; loadPhoto(c.hero.photo); }
    var frame = pic.parentElement, num = function (v, d) { v = parseFloat(v); return isFinite(v) ? v : d; };
    frame.style.setProperty("--px", num(c.hero.photoX, 0) + "%");
    frame.style.setProperty("--py", num(c.hero.photoY, 0) + "%");
    frame.style.setProperty("--pz", num(c.hero.photoZoom, 1));

    $("stats").innerHTML = c.stats.map(function (s, i) {
      return "<li><b" + (i === 0 ? ' class="accent"' : "") + ">" + esc(count(s.value)) + "</b><span>" + esc(s.label) + "</span></li>";
    }).join("");

    $("tags").innerHTML = c.tags.map(function (t) { return "<li>" + esc(t.text) + "</li>"; }).join("");

    $("cards").innerHTML = Object.keys(LISTS).map(function (key) {
      var items = c[key], L = LISTS[key];
      return '<div class="card" data-open="' + key + '">' +
        '<div class="card__top"><span>' + L.no + "</span><em>" + L.title + "</em></div>" +
        '<ul class="card__list">' + items.slice(0, 2).map(function (it) {
          return "<li><h3>" + esc(it.title) + "</h3><p>" + esc(it.sub) + "</p></li>";
        }).join("") + "</ul>" +
        '<button type="button" class="card__more">See all ' + items.length + " <span>→</span></button></div>";
    }).join("");

    $("eduList").innerHTML = c.education.map(function (e, i) {
      return '<li class="edu__item reveal"><span class="edu__no">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<em class="edu__tag">' + esc(e.tag) + "</em><h3>" + esc(e.title) + "</h3><p>" + esc(e.sub) + "</p>" +
        (e.note ? '<span class="edu__note">' + esc(e.note) + "</span>" : "") + "</li>";
    }).join("");

    $("xpList").innerHTML = c.experience.map(function (x) {
      return '<li class="xp__item reveal"><em class="xp__tag">' + esc(x.tag) + "</em><div><h3>" + esc(x.title) +
        '</h3><p class="xp__org">' + esc(x.sub) + "</p>" +
        (x.details ? '<ul class="xp__details">' + C.lines(x.details) + "</ul>" : "") + "</div></li>";
    }).join("");

    var T = window.SOCIAL_TYPES;
    $("socials").innerHTML = c.socials.map(function (s) {
      var t = T[s.type] || T.website, url = C.safeUrl(s.url);
      var ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";
      return '<a class="social reveal" href="' + esc(url) + '"' + ext + '><i class="' + t.icon +
        '" aria-hidden="true"></i><span>' + esc(s.label || t.label) + "</span></a>";
    }).join("");

    C.observe();
  }

  window.Site = { render: render };

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
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  /* ---------- start ---------- */
  $("year").textContent = new Date().getFullYear();
  C.nav();
  document.querySelectorAll(
    ".section .eyebrow, .section__title, .about__text, .about__actions, .work__card, .contact__title, .contact__lead, .orbit"
  ).forEach(function (el) { el.classList.add("reveal"); });
  render(C.cached());

  // cursors gather in a ring around the contact circle while it is on screen
  var orbit = $("orbit");
  if (window.Agents && orbit && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      window.Agents.formation(en[0].isIntersecting ? orbit : null);
    }, { threshold: 0.35 }).observe(orbit);
  }

  // highlight the current section in the menu
  var links = $("navLinks");
  var sections = ["home", "about", "experience", "work", "contact"].map($).filter(Boolean);
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

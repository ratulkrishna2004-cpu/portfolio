/* Shared helpers for index.html and cv.html */
window.Core = (function () {
  document.documentElement.classList.add("js");

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var safeUrl = function (u) {
    u = String(u || "").trim();
    return /^(https?:|mailto:|tel:)/i.test(u) ? u : "#";
  };

  // saved content laid over the defaults (anything missing falls back to js/content.js)
  function merge(saved) {
    var d = window.DEFAULT_CONTENT, c = {};
    Object.keys(d).forEach(function (k) {
      var v = saved && saved[k] != null ? saved[k] : d[k];
      if (!Array.isArray(d[k])) {            // objects: fill in missing fields
        var o = {};
        Object.keys(d[k]).forEach(function (f) { o[f] = v[f] != null ? v[f] : d[k][f]; });
        Object.keys(v).forEach(function (f) { if (!(f in o)) o[f] = v[f]; });
        v = o;
      }
      c[k] = v;
    });
    return c;
  }
  function cached() {
    try { return JSON.parse(localStorage.getItem("site-content")); } catch (e) { return null; }
  }

  /* Elements with class "reveal" appear when they scroll into view and hide again when
     they leave, so the build effect replays scrolling down or back up. */
  var showIO = null, hideIO = null;
  if ("IntersectionObserver" in window) {
    showIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (!en.isIntersecting || el._want) return;
        el._want = true;
        if (window.Agents) window.Agents.build(el); else el.classList.add("is-in");
      });
    }, { threshold: 0.12 });
    // hide only once well outside the screen (80px) so nothing flickers at the edge
    hideIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) return;
        en.target._want = false;
        en.target.classList.remove("is-in");
      });
    }, { rootMargin: "80px 0px 80px 0px" });
  }
  function observe() {
    document.querySelectorAll(".reveal").forEach(function (el) {
      if (el._obs) return;
      el._obs = true;
      if (showIO) { showIO.observe(el); hideIO.observe(el); }
      else el.classList.add("is-in");
    });
  }

  function nav() {
    var bar = document.getElementById("nav");
    var onScroll = function () { bar.classList.toggle("is-scrolled", window.scrollY > 20); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    var burger = document.getElementById("burger"), links = document.getElementById("navLinks");
    if (!burger) return;
    burger.addEventListener("click", function () {
      burger.setAttribute("aria-expanded", links.classList.toggle("is-open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // "a\nb" -> <li>a</li><li>b</li>
  function lines(text) {
    return String(text || "").split("\n").map(function (l) { return l.trim(); }).filter(Boolean)
      .map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("");
  }

  return { esc: esc, safeUrl: safeUrl, merge: merge, cached: cached, observe: observe, nav: nav, lines: lines };
})();

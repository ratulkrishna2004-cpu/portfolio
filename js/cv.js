/* CV page: every block of the CV is built from the same content as the home page. */
(function () {
  var C = window.Core, esc = C.esc;
  var $ = function (id) { return document.getElementById(id); };

  function group(items) {            // [{sub:"Olympiad",...}] -> { Olympiad: [...] } in first-seen order
    var order = [], map = {};
    items.forEach(function (it) {
      var k = it.sub || "Other";
      if (!map[k]) { map[k] = []; order.push(k); }
      map[k].push(it);
    });
    return order.map(function (k) { return { name: k, items: map[k] }; });
  }
  var row = function (main, sub, tag, extra) {
    return '<li class="cv__row reveal"><div><h3>' + esc(main) + "</h3>" + (sub ? "<p>" + esc(sub) + "</p>" : "") +
      (extra || "") + "</div>" + (tag ? "<em>" + esc(tag) + "</em>" : "") + "</li>";
  };

  function render(saved) {
    var c = C.merge(saved), cv = c.cv;
    var file = "files/" + encodeURIComponent(cv.file || "CV_Ratul.pdf");
    document.querySelectorAll("[data-cv-file]").forEach(function (a) { a.href = file; });

    $("cvName").textContent = c.hero.fullName;
    $("cvTagline").textContent = c.hero.tagline;
    $("cvProfile").textContent = c.about.cvProfile;

    var contact = [];
    if (cv.phone) contact.push(['fa-solid fa-phone', cv.phone, "tel:" + cv.phone.replace(/[^+\d]/g, "")]);
    if (cv.email) contact.push(['fa-solid fa-envelope', cv.email, "mailto:" + cv.email]);
    if (cv.address) contact.push(['fa-solid fa-location-dot', cv.address, ""]);
    if (cv.linkedin) contact.push(['fa-brands fa-linkedin-in', "LinkedIn", cv.linkedin]);
    $("cvContact").innerHTML = contact.map(function (k) {
      var inner = '<i class="' + k[0] + '" aria-hidden="true"></i>' + esc(k[1]);
      return k[2] ? '<a class="reveal" href="' + esc(C.safeUrl(k[2])) + '">' + inner + "</a>" : '<span class="reveal">' + inner + "</span>";
    }).join("");

    $("cvEducation").innerHTML = c.education.map(function (e) {
      return row(e.title, e.sub + (e.note ? "  |  " + e.note : ""), e.tag);
    }).join("");

    $("cvExperience").innerHTML = c.experience.map(function (x) {
      return row(x.title, x.sub, x.tag, x.details ? '<ul class="cv__bullets">' + C.lines(x.details) + "</ul>" : "");
    }).join("");

    $("cvLeadership").innerHTML = c.leadership.map(function (l) { return row(l.title, l.sub, l.tag); }).join("");

    $("cvAwards").innerHTML = group(c.awards).map(function (g) {
      return '<div class="cv__group"><h3 class="cv__sub reveal">' + esc(g.name) + '</h3><ul class="cv__list">' +
        g.items.map(function (a) { return row(a.title, "", a.tag); }).join("") + "</ul></div>";
    }).join("");

    $("cvProjects").innerHTML = group(c.projects).map(function (g) {
      return '<div class="cv__group"><h3 class="cv__sub reveal">' + esc(g.name) + '</h3><ul class="cv__list">' +
        g.items.map(function (p) {
          var link = p.url ? '<a class="cv__link" href="' + esc(C.safeUrl(p.url)) + '" target="_blank" rel="noopener">' +
            esc(p.url.replace(/^https?:\/\//, "")) + " ↗</a>" : "";
          return row(p.title, "", "", link);
        }).join("") + "</ul></div>";
    }).join("");

    $("cvSkills").innerHTML = c.skills.map(function (s) {
      return '<li class="cv__skill reveal"><span>' + esc(s.label) + "</span><p>" + esc(s.value) + "</p></li>";
    }).join("");

    $("cvLanguages").innerHTML = c.languages.map(function (l) {
      return '<li class="cv__lang reveal"><b>' + esc(l.title) + "</b><span>" + esc(l.sub) + "</span></li>";
    }).join("");

    C.observe();
  }

  window.Site = { render: render };
  $("year").textContent = new Date().getFullYear();
  C.nav();
  document.querySelectorAll(".cv__head h1, .cv__head .tagline, .cv__section > h2, .cv__profile, .cv__end").forEach(function (el) {
    el.classList.add("reveal");
  });
  render(C.cached());
})();

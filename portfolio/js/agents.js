/* "Agentic build" effect: coloured cursors fly in, select each element,
   and the element appears. Runs on load and again as you scroll down.
   To turn the effect off, remove the agents.js <script> line from index.html. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var COLORS = ["#4ade80", "#f472b6", "#facc15", "#60a5fa", "#c084fc"];
  var COUNT = window.innerWidth < 720 ? 3 : 5;
  var MOVE_MS = 480;     // cursor flight time (keep in sync with .agent transition)
  var HOLD_MS = 620;     // how long the selection box stays

  var layer = document.createElement("div");
  layer.className = "agents";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  // bottom status pill
  var hud = document.createElement("div");
  hud.className = "hud";
  hud.setAttribute("aria-hidden", "true");
  hud.innerHTML =
    '<span class="hud__dots"></span>' +
    '<span class="hud__txt"><b>' + COUNT + '</b> agents</span>' +
    '<span class="hud__txt"><b id="hudDone">0</b> / <span id="hudTotal">0</span> layers</span>' +
    '<span class="hud__bar"><i id="hudBar"></i></span>' +
    '<span class="hud__state" id="hudState">Building</span>';
  document.body.appendChild(hud);
  var dots = hud.querySelector(".hud__dots");

  var agents = [];
  for (var i = 0; i < COUNT; i++) {
    var el = document.createElement("div");
    el.className = "agent";
    el.innerHTML =
      '<svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 2l15 8.2-6.6 1.7L7 18.5z" fill="' +
      COLORS[i] + '" stroke="#0b0b0d" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    layer.appendChild(el);
    var a = { el: el, x: 0, y: 0, busy: false };
    agents.push(a);
    place(a, Math.random() * window.innerWidth, window.scrollY + window.innerHeight + 60, true);

    var d = document.createElement("i");
    d.style.background = COLORS[i];
    dots.appendChild(d);
  }

  var queue = [], total = 0, done = 0, finished = false;

  function place(a, x, y, instant) {
    a.x = x; a.y = y;
    if (instant) a.el.style.transition = "none";
    a.el.style.transform = "translate(" + x + "px," + y + "px)";
    if (instant) { a.el.offsetWidth; a.el.style.transition = ""; }
  }

  function inView(a) {
    return a.y > window.scrollY - 150 && a.y < window.scrollY + window.innerHeight + 150;
  }

  function updateHud() {
    document.getElementById("hudDone").textContent = done;
    document.getElementById("hudTotal").textContent = total;
    document.getElementById("hudBar").style.width = (total ? (done / total) * 100 : 0) + "%";
  }

  function run(a, target) {
    a.busy = true;
    // if this cursor was left far up the page, bring it in from the screen edge
    if (!inView(a)) {
      var fromLeft = Math.random() < 0.5;
      place(a, fromLeft ? -30 : window.innerWidth + 10,
               window.scrollY + Math.random() * window.innerHeight, true);
    }
    var r = target.getBoundingClientRect();
    // -22: the element still sits 22px low before it is revealed (see .reveal in CSS)
    var left = r.left + window.scrollX, top = r.top + window.scrollY - 22;
    place(a, left + r.width - 4, top + r.height - 4);

    setTimeout(function () {
      var box = document.createElement("div");
      box.className = "sel";
      box.style.cssText = "left:" + left + "px;top:" + top + "px;width:" + r.width + "px;height:" + r.height + "px";
      box.innerHTML = "<i></i><i></i><i></i><i></i><span>" + Math.round(r.width) + " × " + Math.round(r.height) + "</span>";
      layer.appendChild(box);

      setTimeout(function () { target.classList.add("is-in"); }, 160);
      setTimeout(function () {
        box.classList.add("is-out");
        setTimeout(function () { box.remove(); }, 300);
        done++; updateHud();
        a.busy = false;
        pump();
        if (done >= total) finish();
      }, HOLD_MS);
    }, MOVE_MS);
  }

  function pump() {
    for (var i = 0; i < agents.length && queue.length; i++) {
      if (!agents[i].busy) run(agents[i], queue.shift());
    }
  }

  // idle cursors drift around the screen so the page feels "live"
  var drift = setInterval(function () {
    agents.forEach(function (a) {
      if (a.busy || Math.random() < 0.4) return;
      place(a, 40 + Math.random() * (window.innerWidth - 80),
               window.scrollY + 80 + Math.random() * (window.innerHeight - 160));
    });
  }, 1700);

  function finish() {
    if (finished) return;
    finished = true;
    clearInterval(drift);
    document.getElementById("hudState").textContent = "Build complete";
    hud.classList.add("is-done");
    setTimeout(function () {
      hud.classList.add("is-hidden");
      layer.classList.add("is-hidden");
    }, 2600);
  }

  window.Agents = {
    setTotal: function (n) { total = n; updateHud(); },
    build: function (target) { queue.push(target); pump(); }
  };

  requestAnimationFrame(function () { hud.classList.add("is-on"); });
})();

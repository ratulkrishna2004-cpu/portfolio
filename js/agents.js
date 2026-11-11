/* "Agentic build" effect + magic sparks.
   Coloured cursors fly in, cast a small spell ring, select each element and the
   element appears. Works every time an element comes into view, scrolling down or up.
   To turn everything off, remove the agents.js <script> line from index.html. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var COLORS = ["#4ade80", "#f472b6", "#facc15", "#60a5fa", "#c084fc", "#fb923c", "#2dd4bf", "#f87171", "#a3e635", "#e879f9"];
  var PHONE = window.innerWidth < 720;
  var COUNT = PHONE ? 6 : 10;
  var MOVE_MS = PHONE ? 260 : 380;   // cursor flight time
  var HOLD_MS = PHONE ? 300 : 420;   // how long the selection box stays
  var MAX_SPARKS = 500;

  var layer = document.createElement("div");
  layer.className = "agents";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  /* ---------- cursors ---------- */
  var agents = [];
  for (var i = 0; i < COUNT; i++) {
    var el = document.createElement("div");
    el.className = "agent";
    el.style.transitionDuration = MOVE_MS + "ms";
    el.innerHTML =
      '<svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 2l15 8.2-6.6 1.7L7 18.5z" fill="' +
      COLORS[i] + '" stroke="#0b0b0d" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    layer.appendChild(el);
    var a = { el: el, x: 0, y: 0, busy: false, px: null, py: null };
    agents.push(a);
    place(a, Math.random() * window.innerWidth, window.scrollY + window.innerHeight + 60, true);
  }

  function place(a, x, y, instant) {
    a.x = x; a.y = y;
    if (instant) { a.el.style.transition = "none"; a.px = null; }
    a.el.style.transform = "translate(" + x + "px," + y + "px)";
    if (instant) { a.el.offsetWidth; a.el.style.transition = ""; a.el.style.transitionDuration = MOVE_MS + "ms"; }
  }
  function inView(a) {
    return a.y > window.scrollY - 150 && a.y < window.scrollY + window.innerHeight + 150;
  }

  /* ---------- magic: sparks + spell rings on a canvas ---------- */
  var cv = document.createElement("canvas");
  cv.className = "magic";
  cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(cv);
  var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() {
    cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  var sparks = [], rings = [], dirty = false;
  function spark(x, y, power) {
    if (sparks.length >= MAX_SPARKS) return;
    var ang = Math.random() * Math.PI * 2, sp = (0.3 + Math.random()) * power;
    sparks.push({
      x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 0.3,
      life: 0, max: 22 + Math.random() * 30, r: 0.6 + Math.random() * 1.5,
      hue: Math.random() < 0.75 ? 28 + Math.random() * 22 : 265 + Math.random() * 30   // gold, some violet
    });
  }
  function burstBox(l, t, w, h) {           // sparks along the box outline (viewport coords)
    var n = Math.min(70, 16 + Math.round((w + h) / 14));
    for (var i = 0; i < n; i++) {
      var p = Math.random() * (2 * w + 2 * h), x, y;
      if (p < w) { x = l + p; y = t; }
      else if (p < w + h) { x = l + w; y = t + p - w; }
      else if (p < 2 * w + h) { x = l + p - w - h; y = t + h; }
      else { x = l; y = t + p - 2 * w - h; }
      spark(x, y, 1.6);
    }
  }

  function drawRing(r) {
    var k = r.life / r.max, rad = 10 + k * 34, alpha = (1 - k) * 0.9;
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.strokeStyle = "hsla(36,100%,62%," + alpha + ")";
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.72, 0, Math.PI * 2); ctx.stroke();
    for (var s = 0; s < 2; s++) {           // two squares turning opposite ways
      ctx.rotate((s ? -1 : 1) * (r.life * 0.09) + s * Math.PI / 4);
      var q = rad * 0.72 * Math.SQRT1_2;
      ctx.strokeRect(-q, -q, q * 2, q * 2);
    }
    ctx.setLineDash([2, 7]); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, rad * 1.18, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var had = dirty;
    dirty = sparks.length > 0 || rings.length > 0;
    if (had || dirty) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // moving cursors leave a trail
    agents.forEach(function (a) {
      var r = a.el.getBoundingClientRect();
      if (a.px !== null) {
        var d = Math.abs(r.left - a.px) + Math.abs(r.top - a.py);
        if (d > 2.5) for (var n = 0; n < Math.min(3, d / 6); n++) spark(r.left + 4, r.top + 4, 0.7);
      }
      a.px = r.left; a.py = r.top;
    });

    ctx.globalCompositeOperation = "lighter";
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.life++; s.x += s.vx; s.y += s.vy; s.vy += 0.035; s.vx *= 0.98;
      if (s.life >= s.max) { sparks.splice(i, 1); continue; }
      var al = 1 - s.life / s.max;
      ctx.fillStyle = "hsla(" + s.hue + ",100%," + (60 + al * 25) + "%," + al + ")";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (0.5 + al), 0, Math.PI * 2); ctx.fill();
    }
    for (var j = rings.length - 1; j >= 0; j--) {
      var g = rings[j];
      g.life++;
      if (g.life >= g.max) { rings.splice(j, 1); continue; }
      drawRing(g);
    }
    ctx.globalCompositeOperation = "source-over";
  }
  requestAnimationFrame(frame);

  /* ---------- building ---------- */
  var queue = [];

  function run(a, target) {
    target._queued = false;
    if (!target._want) return;               // it scrolled away before its turn
    a.busy = true;
    if (!inView(a)) {                        // bring far-away cursors in from the screen edge
      place(a, Math.random() < 0.5 ? -30 : window.innerWidth + 10,
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

      var vx = left - window.scrollX, vy = top - window.scrollY;
      burstBox(vx, vy, r.width, r.height);
      rings.push({ x: vx + r.width, y: vy + r.height, life: 0, max: 34 });

      setTimeout(function () { if (target._want) target.classList.add("is-in"); }, 120);
      setTimeout(function () {
        box.classList.add("is-out");
        setTimeout(function () { box.remove(); }, 300);
        a.busy = false;
        pump();
      }, HOLD_MS);
    }, MOVE_MS);
  }

  function pump() {
    for (var i = 0; i < agents.length; i++) {
      while (!agents[i].busy && queue.length) run(agents[i], queue.shift());
    }
  }

  /* ---------- your own mouse joins in: sparks follow it, a click casts a ring ---------- */
  var mouse = { x: 0, y: 0, t: 0 };
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.t = Date.now();
    spark(e.clientX, e.clientY, 0.6);
  }, { passive: true });
  window.addEventListener("pointerdown", function (e) {
    rings.push({ x: e.clientX, y: e.clientY, life: 0, max: 34 });
    for (var n = 0; n < 26; n++) spark(e.clientX, e.clientY, 2.4);
  }, { passive: true });

  /* ---------- idle cursors: circle a target, follow your mouse, or wander ---------- */
  var form = null, turn = 0;
  setInterval(function () {
    if (document.hidden || !form) return;
    var r = form.getBoundingClientRect();
    var cx = r.left + r.width / 2 + window.scrollX, cy = r.top + r.height / 2 + window.scrollY;
    var rad = Math.min(r.width, r.height) / 2 - 6, idle = agents.filter(function (a) { return !a.busy; });
    turn += 0.2;
    idle.forEach(function (a, i) {
      var ang = turn + (i / idle.length) * Math.PI * 2;
      place(a, cx + Math.cos(ang) * rad - 6, cy + Math.sin(ang) * rad - 6);
    });
  }, 380);

  setInterval(function () {
    if (document.hidden || form) return;
    var near = Date.now() - mouse.t < 4000;
    agents.forEach(function (a) {
      if (a.busy || Math.random() < 0.4) return;
      if (near && Math.random() < 0.6) {
        place(a, mouse.x + (Math.random() - 0.5) * 320, window.scrollY + mouse.y + (Math.random() - 0.5) * 260);
      } else {
        place(a, 40 + Math.random() * (window.innerWidth - 80),
                 window.scrollY + 80 + Math.random() * (window.innerHeight - 160));
      }
    });
  }, 1700);

  window.Agents = {
    formation: function (el) { form = el; },
    build: function (target) {
      if (target._queued) return;
      target._queued = true;
      queue.push(target);
      pump();
    }
  };
})();

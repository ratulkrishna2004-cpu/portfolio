/* The ring of sparks behind the photo. */
(function () {
  var cv = document.getElementById("portal");
  if (!cv) return;
  var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
  var S = 0, parts = [], visible = true;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function size() {
    S = cv.getBoundingClientRect().width;
    cv.width = cv.height = Math.round(S * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (still) drawStill();
  }
  function drawStill() {
    ctx.clearRect(0, 0, S, S);
    ctx.strokeStyle = "rgba(255,150,40,.7)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(S / 2, S / 2, S * 0.36, 0, Math.PI * 2); ctx.stroke();
  }

  function emit() {
    var a = Math.random() * Math.PI * 2, k = S / 420;
    var R = S * 0.36 * (1 + (Math.random() - 0.5) * 0.07);
    var sp = (1.4 + Math.random() * 3.6) * k, out = (Math.random() * 1.5 - 0.25) * k;
    parts.push({
      x: S / 2 + Math.cos(a) * R, y: S / 2 + Math.sin(a) * R,
      vx: -Math.sin(a) * sp + Math.cos(a) * out, vy: Math.cos(a) * sp + Math.sin(a) * out,
      life: 0, max: 12 + Math.random() * 30, w: (0.5 + Math.random() * 1.7) * k, hue: 16 + Math.random() * 30
    });
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden || !S) return;
    // fade the previous frame a little so sparks leave streaks
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fillRect(0, 0, S, S);
    ctx.globalCompositeOperation = "lighter";

    // the glowing core of the ring, drawn as a few flickering arcs
    for (var i = 0; i < 4; i++) {
      var st = Math.random() * Math.PI * 2;
      ctx.strokeStyle = "hsla(" + (22 + Math.random() * 18) + ",100%,58%,.22)";
      ctx.lineWidth = (1 + Math.random() * 3.5) * S / 420;
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S * 0.36 * (1 + (Math.random() - 0.5) * 0.035), st, st + 0.6 + Math.random() * 1.6);
      ctx.stroke();
    }

    for (var n = 0; n < 16; n++) emit();
    ctx.lineCap = "round";
    for (var j = parts.length - 1; j >= 0; j--) {
      var p = parts[j], px = p.x, py = p.y;
      p.life++; p.x += p.vx; p.y += p.vy; p.vx *= 0.985; p.vy *= 0.985;
      if (p.life >= p.max) { parts.splice(j, 1); continue; }
      var al = 1 - p.life / p.max;
      ctx.strokeStyle = "hsla(" + p.hue + ",100%," + (52 + al * 30) + "%," + al + ")";
      ctx.lineWidth = p.w;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
  }

  size();
  window.addEventListener("resize", size);
  if (still) return;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
  }
  requestAnimationFrame(frame);
})();

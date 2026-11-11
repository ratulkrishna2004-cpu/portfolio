/* Admin panel: login with Firebase Authentication, edit content, save to Firestore.
   The password is checked by Firebase's servers. It is not stored anywhere in this repo. */
import { firebaseConfig, isConfigured, ADMIN_EMAIL, SDK } from "../js/firebase-config.js";

const $ = (id) => document.getElementById(id);
const show = (id) => ["viewSetup", "viewLogin", "viewEditor"].forEach((v) => ($(v).hidden = v !== id));

/* What can be edited. Add a section here and it appears in the panel. */
const ITEM = [
  { name: "title", label: "Title" },
  { name: "sub", label: "Organisation / category" },
  { name: "tag", label: "Date / year" }
];
const SECTIONS = [
  { key: "hero", title: "Home — main text", fields: [
    { name: "fullName", label: "Full name (top left + CV)" },
    { name: "name", label: "Name (in the coloured box)" },
    { name: "tagline", label: "Tagline" },
    { name: "photo", label: "Photo file name (inside images/ folder)" },
    { name: "description", label: "Description (**text** = bold)", type: "textarea" } ] },
  { key: "stats", title: "Home — numbers", hint: "Type {awards}, {leadership}, {projects} or {experience} as the number to count that list automatically.", list: true, fields: [
    { name: "value", label: "Number" }, { name: "label", label: "Label" } ] },
  { key: "about", title: "About / profile", fields: [
    { name: "text", label: "About text (home page)", type: "textarea" },
    { name: "cvProfile", label: "Profile text (CV page)", type: "textarea" } ] },
  { key: "education", title: "Education", list: true, fields: [
    { name: "title", label: "School / college / university" },
    { name: "sub", label: "Degree / certificate" },
    { name: "tag", label: "Year" },
    { name: "note", label: "Result (optional)" } ] },
  { key: "experience", title: "Experience", list: true, fields: [
    { name: "title", label: "Role" },
    { name: "sub", label: "Organisation" },
    { name: "tag", label: "Period" },
    { name: "details", label: "Details (one point per line)", type: "textarea" } ] },
  { key: "leadership", title: "Leadership", hint: "The first two show on the home card; all show in the popup and on the CV.", list: true, fields: ITEM },
  { key: "awards", title: "Awards", hint: "The first two show on the home card. On the CV they are grouped by category.", list: true, fields: [
    { name: "title", label: "Award" }, { name: "sub", label: "Category (e.g. Olympiad)" }, { name: "tag", label: "Year" } ] },
  { key: "projects", title: "Projects (CV)", hint: "Grouped by category on the CV.", list: true, fields: [
    { name: "title", label: "Project" }, { name: "sub", label: "Category (e.g. Robotics)" }, { name: "url", label: "Link (optional)" } ] },
  { key: "skills", title: "Skills (CV)", list: true, fields: [
    { name: "label", label: "Group" }, { name: "value", label: "Skills" } ] },
  { key: "languages", title: "Languages (CV)", list: true, fields: [
    { name: "title", label: "Language" }, { name: "sub", label: "Level" } ] },
  { key: "tags", title: "Skill tags (home)", list: true, fields: [{ name: "text", label: "Tag" }] },
  { key: "cv", title: "CV — contact line and PDF", hint: "Upload the PDF into the files/ folder of the repo, then type its file name here.", fields: [
    { name: "phone", label: "Phone" }, { name: "email", label: "Email" },
    { name: "address", label: "Address" }, { name: "linkedin", label: "LinkedIn link" },
    { name: "file", label: "PDF file name (inside files/ folder)" } ] },
  { key: "socials", title: "Contact buttons", hint: "Link must be full: https://… For email use mailto:you@gmail.com, for WhatsApp use https://wa.me/8801XXXXXXXXX", list: true, fields: [
    { name: "type", label: "Icon", type: "select", options: Object.keys(window.SOCIAL_TYPES) },
    { name: "label", label: "Button text" },
    { name: "url", label: "Link" } ] }
];

let data = {};

/* ---------- editor UI ---------- */
function field(f, obj) {
  const label = document.createElement("label");
  label.textContent = f.label;
  if (f.type === "textarea") label.className = "wide";
  let input;
  if (f.type === "select") {
    input = document.createElement("select");
    f.options.forEach((o) => {
      const opt = document.createElement("option");
      opt.value = o; opt.textContent = window.SOCIAL_TYPES[o].label;
      input.appendChild(opt);
    });
  } else {
    input = document.createElement(f.type === "textarea" ? "textarea" : "input");
  }
  input.value = obj[f.name] ?? "";
  input.addEventListener("input", () => { obj[f.name] = input.value; dirty(); });
  label.appendChild(input);
  return label;
}

function panel(sec) {
  const el = document.createElement("section");
  el.className = "panel";
  const draw = () => {
    el.innerHTML = "";
    const h = document.createElement("h2"); h.textContent = sec.title; el.appendChild(h);
    const p = document.createElement("p"); p.textContent = sec.hint || ""; el.appendChild(p);

    if (!sec.list) {
      const g = document.createElement("div"); g.className = "grid";
      sec.fields.forEach((f) => g.appendChild(field(f, data[sec.key])));
      el.appendChild(g);
      return;
    }
    const list = data[sec.key];
    list.forEach((item, i) => {
      const row = document.createElement("div"); row.className = "row";
      const g = document.createElement("div"); g.className = "grid";
      sec.fields.forEach((f) => g.appendChild(field(f, item)));
      const tools = document.createElement("div"); tools.className = "row__tools";
      const tool = (txt, title, fn, cls) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = txt; b.title = title; b.setAttribute("aria-label", title);
        if (cls) b.className = cls;
        b.addEventListener("click", () => { fn(); dirty(); draw(); });
        tools.appendChild(b);
      };
      tool("↑", "Move up", () => { if (i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]]; });
      tool("↓", "Move down", () => { if (i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]]; });
      tool("✕", "Delete", () => { list.splice(i, 1); }, "del");
      row.append(g, tools);
      el.appendChild(row);
    });
    const add = document.createElement("button");
    add.type = "button"; add.className = "btn btn--ghost add"; add.textContent = "+ Add";
    add.addEventListener("click", () => {
      const item = {};
      sec.fields.forEach((f) => (item[f.name] = f.type === "select" ? f.options[0] : ""));
      list.push(item); dirty(); draw();
    });
    el.appendChild(add);
  };
  draw();
  return el;
}

/* Photo: drag to move, scroll or slider to zoom, optional "no box" for transparent photos */
function photoPanel() {
  const h = data.hero;
  h.photoZoom = parseFloat(h.photoZoom) || 1;
  h.photoX = parseFloat(h.photoX) || 0;
  h.photoY = parseFloat(h.photoY) || 0;
  delete h.photoFrame; delete h.badge;   // no longer used

  const el = document.createElement("section");
  el.className = "panel";
  el.innerHTML = `
    <h2>Home — photo position</h2>
    <p>Drag the photo to move it. Scroll on it or use the slider to zoom. The photo file itself is the name typed in "Photo file name" above.</p>
    <div class="pp">
      <div class="pp__stage"><div class="pp__frame no-frame" id="ppFrame"><img id="ppImg" alt="" draggable="false"></div></div>
      <div class="pp__side">
        <label>Zoom <span id="ppZoomTxt"></span><input type="range" id="ppZoom" min="0.4" max="3" step="0.01"></label>
        <p class="pp__tip">Use a transparent (cut-out) PNG so the ring design shows behind you.</p>
        <button type="button" class="btn btn--ghost" id="ppReset">Reset position</button>
        <p class="msg" id="ppMsg"></p>
      </div>
    </div>`;
  const q = (id) => el.querySelector("#" + id);
  const frame = q("ppFrame"), img = q("ppImg");

  const apply = () => {
    img.style.transform = `translate(${h.photoX}%, ${h.photoY}%) scale(${h.photoZoom})`;
    q("ppZoom").value = h.photoZoom;
    q("ppZoomTxt").textContent = Math.round(h.photoZoom * 100) + "%";
  };
  const load = () => {
    q("ppMsg").textContent = "";
    img.hidden = false;
    img.src = "../images/" + (h.photo || "profile.jpg");
  };
  img.addEventListener("error", () => {
    img.hidden = true;
    q("ppMsg").textContent = `"${h.photo}" was not found in the images folder.`;
  });
  el._reloadPhoto = load;

  let start = null;
  frame.addEventListener("pointerdown", (e) => {
    start = { x: e.clientX, y: e.clientY, px: h.photoX, py: h.photoY };
    frame.setPointerCapture(e.pointerId);
    frame.classList.add("is-drag");
  });
  frame.addEventListener("pointermove", (e) => {
    if (!start) return;
    const r = frame.getBoundingClientRect();
    h.photoX = Math.round((start.px + ((e.clientX - start.x) / r.width) * 100) * 10) / 10;
    h.photoY = Math.round((start.py + ((e.clientY - start.y) / r.height) * 100) * 10) / 10;
    apply(); dirty();
  });
  const end = () => { start = null; frame.classList.remove("is-drag"); };
  frame.addEventListener("pointerup", end);
  frame.addEventListener("pointercancel", end);

  const zoomTo = (z) => { h.photoZoom = Math.round(Math.min(3, Math.max(0.4, z)) * 100) / 100; apply(); dirty(); };
  frame.addEventListener("wheel", (e) => { e.preventDefault(); zoomTo(h.photoZoom * (e.deltaY < 0 ? 1.06 : 1 / 1.06)); }, { passive: false });
  q("ppZoom").addEventListener("input", (e) => zoomTo(parseFloat(e.target.value)));
  q("ppReset").addEventListener("click", () => { h.photoX = 0; h.photoY = 0; h.photoZoom = 1; apply(); dirty(); });

  apply(); load();
  return el;
}

function drawEditor() {
  const root = $("editor");
  root.innerHTML = "";
  let photo;
  SECTIONS.forEach((s) => {
    const p = panel(s);
    root.appendChild(p);
    if (s.key === "hero") {
      photo = photoPanel();
      root.appendChild(photo);
      // typing a new file name reloads the preview
      p.addEventListener("change", () => photo._reloadPhoto());
    }
  });
}

function dirty() {
  $("saveMsg").className = "bar__msg";
  $("saveMsg").textContent = "Unsaved changes";
}

const nice = (err) => ({
  "auth/invalid-credential": "Wrong email or password.",
  "auth/wrong-password": "Wrong password.",
  "auth/user-not-found": "No account with this email.",
  "auth/too-many-requests": "Too many tries. Wait a few minutes.",
  "auth/weak-password": "New password is too short (min 6).",
  "auth/network-request-failed": "No internet connection.",
  "permission-denied": "Not allowed. Check the Firestore rules."
}[err.code] || err.message || "Something went wrong.");

/* ---------- start ---------- */
if (!isConfigured) {
  show("viewSetup");
} else {
  const [appM, authM, fsM] = await Promise.all([
    import(SDK + "firebase-app.js"), import(SDK + "firebase-auth.js"), import(SDK + "firebase-firestore.js")
  ]);
  const app = appM.initializeApp(firebaseConfig);
  const auth = authM.getAuth(app);
  const ref = fsM.doc(fsM.getFirestore(app), "site", "content");

  authM.onAuthStateChanged(auth, async (user) => {
    if (!user) { show("viewLogin"); return; }
    if (user.email !== ADMIN_EMAIL) {
      await authM.signOut(auth);
      $("loginMsg").textContent = "This account is not the admin.";
      return;
    }
    // start from defaults, then lay the saved content on top
    data = JSON.parse(JSON.stringify(window.DEFAULT_CONTENT));
    try {
      const snap = await fsM.getDoc(ref);
      if (snap.exists()) {
        const saved = snap.data();
        Object.keys(saved).forEach((k) => {
          if (Array.isArray(saved[k]) || typeof data[k] !== "object") data[k] = saved[k];
          else Object.assign(data[k], saved[k]);
        });
      }
    } catch (err) {
      $("saveMsg").className = "bar__msg err";
      $("saveMsg").textContent = "Could not load saved content: " + nice(err);
    }
    drawEditor();
    show("viewEditor");
  });

  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("loginMsg"); msg.className = "msg"; msg.textContent = "";
    try { await authM.signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value); }
    catch (err) { msg.textContent = nice(err); }
  });

  $("forgot").addEventListener("click", async () => {
    const msg = $("loginMsg"); msg.className = "msg";
    const email = $("email").value.trim();
    if (!email) { msg.textContent = "Type your email first."; return; }
    try {
      await authM.sendPasswordResetEmail(auth, email);
      msg.className = "msg ok";
      msg.textContent = "Reset link sent. Check your inbox (and spam).";
    } catch (err) { msg.textContent = nice(err); }
  });

  $("save").addEventListener("click", async () => {
    const btn = $("save"), msg = $("saveMsg");
    btn.disabled = true; msg.className = "bar__msg"; msg.textContent = "Saving…";
    try {
      await fsM.setDoc(ref, data);
      try { localStorage.setItem("site-content", JSON.stringify(data)); } catch (e) {}
      msg.textContent = "Saved ✓ — refresh the site to see it.";
    } catch (err) {
      msg.className = "bar__msg err"; msg.textContent = "Not saved: " + nice(err);
    }
    btn.disabled = false;
  });

  $("logout").addEventListener("click", () => authM.signOut(auth));

  $("pwForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("pwMsg"); msg.className = "msg"; msg.textContent = "";
    try {
      const user = auth.currentUser;
      await authM.reauthenticateWithCredential(user, authM.EmailAuthProvider.credential(user.email, $("pwOld").value));
      await authM.updatePassword(user, $("pwNew").value);
      msg.className = "msg ok"; msg.textContent = "Password changed.";
      e.target.reset();
    } catch (err) { msg.textContent = nice(err); }
  });
}

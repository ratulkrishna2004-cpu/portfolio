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
    { name: "fullName", label: "Full name (top left)" },
    { name: "name", label: "Name (in the coloured box)" },
    { name: "tagline", label: "Tagline" },
    { name: "badge", label: "Text under photo" },
    { name: "photo", label: "Photo file name (inside images/ folder)" },
    { name: "description", label: "Description (**text** = bold)", type: "textarea" } ] },
  { key: "stats", title: "Home — numbers", hint: "Type {awards} as the number to show the awards count automatically.", list: true, fields: [
    { name: "value", label: "Number" }, { name: "label", label: "Label" } ] },
  { key: "leadership", title: "Leadership", hint: "The first two show on the home card; all show in the popup.", list: true, fields: ITEM },
  { key: "awards", title: "Awards", hint: "The first two show on the home card; all show in the popup.", list: true, fields: ITEM },
  { key: "tags", title: "Skill tags", list: true, fields: [{ name: "text", label: "Tag" }] },
  { key: "about", title: "About", fields: [{ name: "text", label: "About text", type: "textarea" }] },
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

function drawEditor() {
  const root = $("editor");
  root.innerHTML = "";
  SECTIONS.forEach((s) => root.appendChild(panel(s)));
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
      if (snap.exists()) Object.assign(data, snap.data());
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

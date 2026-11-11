/* Loads the saved content from Firebase (if connected) and shows it. */
import { firebaseConfig, isConfigured, SDK } from "./firebase-config.js";

if (isConfigured) {
  Promise.all([import(SDK + "firebase-app.js"), import(SDK + "firebase-firestore.js")])
    .then(([app, fs]) => {
      const db = fs.getFirestore(app.initializeApp(firebaseConfig));
      return fs.getDoc(fs.doc(db, "site", "content"));
    })
    .then((snap) => {
      if (!snap.exists()) return;
      window.Site.render(snap.data());
      try { localStorage.setItem("site-content", JSON.stringify(snap.data())); } catch (e) {}
    })
    .catch((err) => console.warn("Could not load saved content, showing defaults.", err));
}

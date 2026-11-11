/* Firebase connection. Paste the values from
   Firebase console → Project settings → Your apps → Web app → "firebaseConfig".
   These values are NOT secret (every Firebase website shows them);
   your password is never stored in this repo. */

export const firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};

// Only this account may use /admin (also enforced by the Firestore rules).
export const ADMIN_EMAIL = "ratulkrishna2004@gmail.com";

export const isConfigured = !firebaseConfig.apiKey.startsWith("PASTE");
export const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

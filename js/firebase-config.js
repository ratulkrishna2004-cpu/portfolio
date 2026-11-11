/* Firebase connection (values from Firebase console → Project settings → Your apps).
   These values are NOT secret (every Firebase website shows them);
   your password is never stored in this repo. */

export const firebaseConfig = {
  apiKey: "AIzaSyA9cqp7iwR21D2rUFkU9BWWgZBhkXk0I0E",
  authDomain: "ratul-krishna.firebaseapp.com",
  projectId: "ratul-krishna",
  storageBucket: "ratul-krishna.firebasestorage.app",
  messagingSenderId: "1016386683608",
  appId: "1:1016386683608:web:c3754ea7f0bb93f6088dad",
  measurementId: "G-YB4LFP4NRL"
};

// Only this account may use /admin (also enforced by the Firestore rules).
export const ADMIN_EMAIL = "ratulkrishna2004@gmail.com";

export const isConfigured = !firebaseConfig.apiKey.startsWith("PASTE");
export const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

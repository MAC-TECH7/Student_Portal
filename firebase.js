// firebase.js - CORRECTED (Using v9.23.0 to match auth.js)
// ============================================

// Import from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

// Your Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS6oOnLAjBUAVTaasgzKXCMMSgNaVpbpg",
  authDomain: "studentportal-607ef.firebaseapp.com",
  projectId: "studentportal-607ef",
  storageBucket: "studentportal-607ef.firebasestorage.app",
  messagingSenderId: "964701629358",
  appId: "1:964701629358:web:3c1553cc3452325481f63f",
  measurementId: "G-38DM1NLT9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export services
export { app, auth, db, storage, analytics };


// Add this to the END of firebase.js (after your exports)

// Make auth and db available globally for debugging
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseApp = app;

console.log("Firebase initialized. For debugging, use:");
console.log("- window.firebaseAuth");
console.log("- window.firebaseDb");
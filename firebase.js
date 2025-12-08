// firebase.js - CDN VERSION
// ============================================

// Import from CDN instead
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration (SAME AS BEFORE)
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services you need
export { app, auth, db, storage, analytics };
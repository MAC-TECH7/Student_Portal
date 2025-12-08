// firebase.js - CORRECTED VERSION
// ============================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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
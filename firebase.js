// firebase.js - Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBS6oOnLAjBUAVTaasgzKXCMMSgNaVpbpg",
    authDomain: "studentportal-607ef.firebaseapp.com",
    projectId: "studentportal-607ef",
    storageBucket: "studentportal-607ef.firebasestorage.app",
    messagingSenderId: "964701629358",
    appId: "1:964701629358:web:3c1553cc3452325481f63f",
    measurementId: "G-38DM1NLT9Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
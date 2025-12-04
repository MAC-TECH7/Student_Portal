// auth.js
// ------------------------------------------------
// This file handles:
// - Student Signup
// - Admin Login
// - Normal Login
// - Saving user info to Firestore
// - Logout
// ------------------------------------------------

import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// ==============================
// SIGNUP FUNCTION
// ==============================
export async function signupUser(name, email, password, role = "student") {
    try {
        // Create User Auth Account
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        // Save user profile in Firestore
        await setDoc(doc(db, "users", uid), {
            name,
            email,
            role,
            createdAt: new Date()
        });

        return { success: true, uid };

    } catch (error) {
        return { success: false, message: error.message };
    }
}



// ==============================
// LOGIN FUNCTION
// ==============================
export async function loginUser(email, password) {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        // Get the user role
        const snap = await getDoc(doc(db, "users", uid));
        const user = snap.data();

        return { success: true, role: user.role };

    } catch (error) {
        return { success: false, message: error.message };
    }
}



// ==============================
// LOGOUT FUNCTION
// ==============================
export async function logoutUser() {
    await signOut(auth);
}



// ==============================
// AUTH STATE LISTENER
// Runs on every page that wants
// to check if the user is logged in
// ==============================
export function onUserStateChanged(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

// auth.js - Keep as is (using v9.23.0)
// ============================================

import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export async function signupUser(name, email, password, role = "student") {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

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

export async function loginUser(email, password) {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        const snap = await getDoc(doc(db, "users", uid));
        const user = snap.data();

        return { success: true, role: user.role };

    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function logoutUser() {
    await signOut(auth);
}

export function onUserStateChanged(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
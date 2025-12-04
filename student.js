// student.js
// ------------------------------------------------
// This file contains functions for the student
// dashboard such as:
// - Loading student profile
// - Updating profile
// - Uploading profile photo
// ------------------------------------------------

import { auth, db, storage } from "./firebase.js";
import { onUserStateChanged } from "./auth.js";
import {
    getDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";


// =============== CHECK USER ROLE ===============
onUserStateChanged(async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data();

    if (data.role !== "student") {
        alert("Only students can access this page!");
        window.location.href = "admin_dashboard.html";
    }
});



// =============== LOAD STUDENT PROFILE ===============
export async function loadStudentProfile(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.data();
}



// =============== UPDATE STUDENT PROFILE ===============
export async function updateStudentProfile(uid, updatedData) {
    await updateDoc(doc(db, "users", uid), updatedData);
}



// =============== UPLOAD PROFILE PHOTO ===============
export async function uploadStudentPhoto(uid, file) {
    const storageRef = ref(storage, `students/${uid}.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Save new photo URL in database
    await updateDoc(doc(db, "users", uid), { photoURL: downloadURL });

    return downloadURL;
}

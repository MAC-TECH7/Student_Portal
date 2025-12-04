// admin.js
// ------------------------------------------------
// Admin functions:
// - Restrict admin-only pages
// - View list of students
// - Delete students
// ------------------------------------------------

import { auth, db } from "./firebase.js";
import { onUserStateChanged } from "./auth.js";
import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// =============== CHECK ADMIN ROLE ===============
onUserStateChanged(async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data();

    if (data.role !== "admin") {
        alert("Admins only!");
        window.location.href = "student_dashboard.html";
    }
});



// =============== GET ALL STUDENTS ===============
export async function getAllStudents() {
    const students = [];
    const querySnap = await getDocs(collection(db, "users"));

    querySnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.role === "student") {
            students.push({ id: docSnap.id, ...data });
        }
    });

    return students;
}



// =============== DELETE A STUDENT ===============
export async function deleteStudent(uid) {
    await deleteDoc(doc(db, "users", uid));
}

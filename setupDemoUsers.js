// setupDemoUsers.js
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function createDemoUsers() {
  try {
    console.log("🚀 Starting demo user creation...");
    
    // 1. Create student user
    const studentCredential = await createUserWithEmailAndPassword(
      auth,
      "student@school.com",
      "student123"
    );
    
    console.log("✅ Student auth created:", studentCredential.user.uid);
    
    // Store student data in Firestore
    await setDoc(doc(db, "users", studentCredential.user.uid), {
      email: "student@school.com",
      role: "student",
      name: "Demo Student",
      createdAt: new Date(),
      isActive: true,
      studentId: "STU001"
    });
    
    console.log("✅ Student Firestore document created");
    
    // 2. Create admin user
    const adminCredential = await createUserWithEmailAndPassword(
      auth,
      "admin@school.com",
      "admin123"
    );
    
    console.log("✅ Admin auth created:", adminCredential.user.uid);
    
    await setDoc(doc(db, "users", adminCredential.user.uid), {
      email: "admin@school.com",
      role: "admin",
      name: "Demo Admin",
      createdAt: new Date(),
      isActive: true
    });
    
    console.log("✅ Admin Firestore document created");
    
    console.log("🎉 Demo users setup complete!");
    console.log("📧 Student: student@school.com / student123");
    console.log("📧 Admin: admin@school.com / admin123");
    
  } catch (error) {
    console.error("❌ Error:", error.code, error.message);
    
    // Handle specific errors
    if (error.code === 'auth/email-already-in-use') {
      console.log("ℹ️ Users already exist. You can proceed to login.");
    }
  }
}

// Make function available globally
window.createDemoUsers = createDemoUsers;
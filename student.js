// student.js - Student Dashboard Functions
// ============================================

// Import Firebase functions
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Import firebase config
import { app } from "./firebase.js";

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Global variables
let currentUser = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("📚 Student Dashboard loaded");
    initDashboard();
});

async function initDashboard() {
    console.log("🚀 Initializing dashboard...");
    updateLoadingStatus('Checking authentication...');
    
    // Check authentication state
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log("❌ No user found, redirecting to login");
            window.location.href = "login.html";
            return;
        }
        
        console.log("✅ User authenticated:", user.email);
        updateLoadingStatus('Loading user data...');
        
        try {
            // Get user document from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (!userDoc.exists()) {
                showError("User account not found in database");
                return;
            }
            
            const userData = userDoc.data();
            console.log("📊 User data loaded:", userData);
            
            // Check if student
            if (userData.role !== "student") {
                alert("Access denied. Students only.");
                window.location.href = "admin.html";
                return;
            }
            
            currentUser = {
                uid: user.uid,
                email: user.email,
                ...userData
            };
            
            console.log("✅ Authentication successful, showing dashboard...");
            
            // Show dashboard
            showDashboard();
            
            // Load all data
            await loadAllData();
            
        } catch (error) {
            console.error("❌ Error loading user data:", error);
            showError("Failed to load user data: " + error.message);
        }
    });
}

function showDashboard() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('studentDashboard').classList.remove('hidden');
    
    // Update student name
    if (currentUser) {
        document.getElementById('studentName').textContent = currentUser.name || currentUser.email;
    }
}

function updateLoadingStatus(message) {
    const statusEl = document.getElementById('loadingStatus');
    if (statusEl) {
        statusEl.textContent = message;
    }
}

function showError(message) {
    console.error("❌ Error:", message);
    alert("Error: " + message);
}

async function loadAllData() {
    try {
        console.log("📊 Loading all dashboard data...");
        
        // Load overview data
        await loadOverview();
        
        // Load courses
        await loadCourses();
        
        // Load grades
        await loadGrades();
        
        // Load attendance
        await loadAttendance();
        
        // Load profile
        loadProfile();
        
        console.log("✅ All data loaded successfully");
        
    } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
        showError("Failed to load dashboard data: " + error.message);
    }
}

async function loadOverview() {
    try {
        console.log("📈 Loading overview...");
        
        // Get student's courses count
        const coursesQuery = query(
            collection(db, "enrollments"),
            where("studentId", "==", currentUser.uid)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesCount = coursesSnapshot.size;
        
        document.getElementById('enrolledCoursesCount').textContent = coursesCount;
        
        // Get average grade
        const gradesQuery = query(
            collection(db, "grades"),
            where("studentId", "==", currentUser.uid)
        );
        const gradesSnapshot = await getDocs(gradesQuery);
        
        let totalGrade = 0;
        let gradeCount = 0;
        
        gradesSnapshot.forEach(doc => {
            const grade = doc.data().grade || doc.data().score;
            if (grade) {
                totalGrade += parseFloat(grade);
                gradeCount++;
            }
        });
        
        const averageGrade = gradeCount > 0 ? (totalGrade / gradeCount).toFixed(1) : 0;
        document.getElementById('averageGrade').textContent = averageGrade;
        
        // Load announcements
        await loadAnnouncements();
        
    } catch (error) {
        console.error("❌ Error loading overview:", error);
    }
}

async function loadAnnouncements() {
    try {
        console.log("📢 Loading announcements...");
        
        const container = document.getElementById('recentAnnouncements');
        
        // Get recent announcements
        const announcementsQuery = query(
            collection(db, "announcements")
        );
        const announcementsSnapshot = await getDocs(announcementsQuery);
        
        if (announcementsSnapshot.empty) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-bullhorn fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No announcements</h5>
                </div>
            `;
            return;
        }
        
        let announcementsHTML = '';
        announcementsSnapshot.forEach(doc => {
            const announcement = doc.data();
            announcementsHTML += `
                <div class="announcement-item mb-3">
                    <h5 class="mb-2">${announcement.title || 'Announcement'}</h5>
                    <p class="mb-2">${announcement.content || 'No content'}</p>
                    <small class="text-muted">
                        <i class="fas fa-calendar me-1"></i> ${announcement.date || 'Recent'}
                    </small>
                </div>
            `;
        });
        
        container.innerHTML = announcementsHTML;
        
    } catch (error) {
        console.error("❌ Error loading announcements:", error);
    }
}

function loadProfile() {
    try {
        console.log("👤 Loading profile...");
        
        const container = document.getElementById('profileDisplay');
        
        if (!currentUser) {
            container.innerHTML = '<div class="alert alert-danger">No user data available</div>';
            return;
        }
        
        container.innerHTML = `
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="profile-field">
                        <strong><i class="fas fa-user me-2"></i>Full Name</strong>
                        <p>${currentUser.name || 'Not provided'}</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="profile-field">
                        <strong><i class="fas fa-envelope me-2"></i>Email</strong>
                        <p>${currentUser.email || 'Not provided'}</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="profile-field">
                        <strong><i class="fas fa-id-badge me-2"></i>Student ID</strong>
                        <p>${currentUser.studentId || 'Not assigned'}</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <button class="btn btn-primary" onclick="editProfile()">
                    <i class="fas fa-edit me-2"></i>Edit Profile
                </button>
            </div>
        `;
        
    } catch (error) {
        console.error("❌ Error loading profile:", error);
    }
}

async function loadCourses() {
    try {
        console.log("📚 Loading courses...");
        
        const container = document.getElementById('enrolledCoursesList');
        container.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading courses...</span>
                </div>
            </div>
        `;
        
        // Simulate loading courses
        setTimeout(() => {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-book fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No courses enrolled</h5>
                    <p class="text-muted">You haven't enrolled in any courses yet.</p>
                </div>
            `;
        }, 1000);
        
    } catch (error) {
        console.error("❌ Error loading courses:", error);
    }
}

async function loadGrades() {
    try {
        console.log("📊 Loading grades...");
        
        const container = document.getElementById('gradesContent');
        container.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading grades...</span>
                </div>
            </div>
        `;
        
        // Simulate loading grades
        setTimeout(() => {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No grades available</h5>
                    <p class="text-muted">Your grades will appear here once they're posted.</p>
                </div>
            `;
        }, 1000);
        
    } catch (error) {
        console.error("❌ Error loading grades:", error);
    }
}

async function loadAttendance() {
    try {
        console.log("📅 Loading attendance...");
        
        const container = document.getElementById('attendanceContent');
        container.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading attendance...</span>
                </div>
            </div>
        `;
        
        // Simulate loading attendance
        setTimeout(() => {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No attendance records</h5>
                    <p class="text-muted">Your attendance records will appear here.</p>
                </div>
            `;
        }, 1000);
        
    } catch (error) {
        console.error("❌ Error loading attendance:", error);
    }
}

function editProfile() {
    alert('Profile editing will be implemented soon!');
}

// Global logout function
window.logout = async function() {
    try {
        console.log("🚪 Logging out...");
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("❌ Logout error:", error);
        alert("Error logging out. Please try again.");
    }
};
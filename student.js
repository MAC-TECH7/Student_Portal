// student.js - CORRECTED VERSION
// ============================================

// Import the auth function
import { onUserStateChanged } from './auth.js';
import { db } from './firebase.js';

// Check if user is logged in
onUserStateChanged(async (user) => {
    console.log("Auth state changed. User:", user ? user.email : "No user");
    
    if (!user) {
        console.log("No user found, redirecting to login...");
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Student logged in:', user.email);
    // Check if user is student
    await checkStudentRole(user.uid);
});

async function checkStudentRole(uid) {
    try {
        console.log("Checking role for UID:", uid);
        
        // Update loading status
        const loadingStatus = document.getElementById('loadingStatus');
        if (loadingStatus) {
            loadingStatus.textContent = 'Loading your data...';
        }
        
        // Import Firestore functions
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js');
        
        const snap = await getDoc(doc(db, "users", uid));
        
        if (!snap.exists()) {
            console.log("User document not found");
            alert('User profile not found. Please contact administrator.');
            window.location.href = 'login.html';
            return;
        }
        
        const userData = snap.data();
        console.log("User data loaded:", userData);
        
        if (userData.role !== 'student') {
            console.log("User is not student, redirecting...");
            alert('Access denied! Students only.');
            window.location.href = 'login.html';
        } else {
            console.log('Student logged in:', userData.email);
            // Show dashboard and load data
            showDashboard(userData);
            await loadStudentData(uid, userData);
        }
    } catch (error) {
        console.error('Error checking role:', error);
        alert('Error loading dashboard: ' + error.message);
        window.location.href = 'login.html';
    }
}

function showDashboard(userData) {
    console.log("Showing dashboard...");
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    const studentDashboard = document.getElementById('studentDashboard');
    
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        console.log("Loading screen hidden");
    }
    
    if (studentDashboard) {
        studentDashboard.classList.remove('hidden');
        console.log("Dashboard shown");
    }
    
    // Update student name
    if (userData && document.getElementById('studentName')) {
        document.getElementById('studentName').textContent = userData.name || userData.email;
        console.log("Student name updated:", userData.name || userData.email);
    }
}

async function loadStudentData(uid, userData) {
    console.log("Loading data for student:", uid);
    
    try {
        // Load all data
        await Promise.all([
            loadOverview(uid),
            loadCourses(uid),
            loadGrades(uid),
            loadAttendance(uid),
            loadProfile(userData)
        ]);
        
        console.log("All data loaded successfully");
    } catch (error) {
        console.error("Error loading student data:", error);
    }
}

// === DASHBOARD FUNCTIONS ===
async function loadOverview(uid) {
    try {
        console.log("Loading overview...");
        
        // Update stats
        if (document.getElementById('enrolledCoursesCount')) {
            document.getElementById('enrolledCoursesCount').textContent = '4';
        }
        if (document.getElementById('averageGrade')) {
            document.getElementById('averageGrade').textContent = '3.8';
        }
        if (document.getElementById('attendanceRate')) {
            document.getElementById('attendanceRate').textContent = '95%';
        }
        
        // Load announcements
        await loadAnnouncements();
        
    } catch (error) {
        console.error("Error loading overview:", error);
    }
}

async function loadAnnouncements() {
    try {
        const container = document.getElementById('recentAnnouncements');
        if (!container) return;
        
        // Clear spinner
        container.innerHTML = '';
        
        // Add sample announcements
        const announcements = [
            {
                title: 'Midterm Exams Schedule',
                message: 'Midterm exams will be held from March 15-20. Please check your schedule.',
                date: '2024-03-01',
                priority: 'high'
            },
            {
                title: 'Library Hours Extended',
                message: 'Library will be open until 10 PM during exam season.',
                date: '2024-02-28',
                priority: 'medium'
            }
        ];
        
        announcements.forEach(ann => {
            const div = document.createElement('div');
            div.className = 'announcement-item';
            div.innerHTML = `
                <h5><i class="fas fa-bell ${ann.priority === 'high' ? 'text-danger' : 'text-warning'} me-2"></i>${ann.title}</h5>
                <p>${ann.message}</p>
                <small><i class="far fa-calendar me-1"></i>${ann.date}</small>
            `;
            container.appendChild(div);
        });
        
    } catch (error) {
        console.error("Error loading announcements:", error);
    }
}

function loadProfile(userData) {
    try {
        const container = document.getElementById('profileDisplay');
        if (!container) return;
        
        // Clear spinner
        container.innerHTML = '';
        
        const profileHTML = `
            <div class="profile-field">
                <strong>Full Name</strong>
                <p>${userData.name || 'Demo Student'}</p>
            </div>
            <div class="profile-field">
                <strong>Email Address</strong>
                <p>${userData.email || 'student@school.com'}</p>
            </div>
            <div class="profile-field">
                <strong>Student ID</strong>
                <p>${userData.studentId || 'STU001'}</p>
            </div>
            <div class="profile-field">
                <strong>Role</strong>
                <p>${userData.role || 'student'}</p>
            </div>
            <div class="profile-field">
                <strong>Account Status</strong>
                <p><span class="badge bg-success">Active</span></p>
            </div>
        `;
        
        container.innerHTML = profileHTML;
        
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

async function loadCourses(uid) {
    try {
        const container = document.getElementById('enrolledCoursesList');
        if (!container) return;
        
        // Clear spinner
        container.innerHTML = '';
        
        // Sample courses data
        const courses = [
            { code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Smith', credits: 3 },
            { code: 'MATH201', name: 'Calculus II', instructor: 'Prof. Johnson', credits: 4 },
            { code: 'ENG102', name: 'English Composition', instructor: 'Dr. Williams', credits: 3 },
            { code: 'PHYS150', name: 'Physics Fundamentals', instructor: 'Prof. Brown', credits: 4 }
        ];
        
        courses.forEach(course => {
            const div = document.createElement('div');
            div.className = 'course-card enrolled';
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="mb-0">${course.code}: ${course.name}</h5>
                    <span class="badge bg-primary">${course.credits} Credits</span>
                </div>
                <p class="text-muted mb-2"><i class="fas fa-chalkboard-teacher me-1"></i>${course.instructor}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold">Status: Enrolled</span>
                    <button class="btn btn-sm btn-outline-primary">View Details</button>
                </div>
            `;
            container.appendChild(div);
        });
        
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

async function loadGrades(uid) {
    try {
        const container = document.getElementById('gradesContent');
        if (!container) return;
        
        // Clear spinner
        container.innerHTML = '';
        
        const gradesHTML = `
            <div class="mb-4">
                <h5 class="mb-3">Grade Summary</h5>
                <div class="progress mb-2">
                    <div class="progress-bar" style="width: 85%">CS101: 85%</div>
                </div>
                <div class="progress mb-2">
                    <div class="progress-bar" style="width: 78%">MATH201: 78%</div>
                </div>
                <div class="progress mb-2">
                    <div class="progress-bar" style="width: 90%">ENG102: 90%</div>
                </div>
                <div class="progress mb-2">
                    <div class="progress-bar" style="width: 82%">PHYS150: 82%</div>
                </div>
            </div>
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                Your current GPA is 3.8. Midterm grades will be available next week.
            </div>
        `;
        
        container.innerHTML = gradesHTML;
        
    } catch (error) {
        console.error("Error loading grades:", error);
    }
}

async function loadAttendance(uid) {
    try {
        const container = document.getElementById('attendanceContent');
        if (!container) return;
        
        // Clear spinner
        container.innerHTML = '';
        
        const attendanceHTML = `
            <div class="mb-4">
                <h5 class="mb-3">Attendance Overview</h5>
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    Overall Attendance: 95%
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>CS101</td>
                            <td>28/30</td>
                            <td>2</td>
                            <td><span class="badge bg-success">93%</span></td>
                        </tr>
                        <tr>
                            <td>MATH201</td>
                            <td>29/30</td>
                            <td>1</td>
                            <td><span class="badge bg-success">97%</span></td>
                        </tr>
                        <tr>
                            <td>ENG102</td>
                            <td>30/30</td>
                            <td>0</td>
                            <td><span class="badge bg-success">100%</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = attendanceHTML;
        
    } catch (error) {
        console.error("Error loading attendance:", error);
    }
}

// Global logout function
window.logout = async function() {
    try {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js');
        const { auth } = await import('./firebase.js');
        
        console.log("Logging out...");
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout error:", error);
        alert("Error logging out. Please try again.");
    }
};

// Add error handling for module loading
window.addEventListener('error', function(e) {
    console.error('Script error:', e.message, 'at', e.filename, ':', e.lineno);
});
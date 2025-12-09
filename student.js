// student.js - Complete Student Dashboard with all functionality
console.log("student.js loaded successfully!");

// Global variables
let currentUserData = null;
let selectedFormat = 'pdf';

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing student dashboard...");
    
    // Get user data from localStorage
    const userStr = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!userStr || isLoggedIn !== 'true') {
        console.log("Not authenticated, redirecting to login...");
        window.location.href = 'login.html';
        return;
    }
    
    currentUserData = JSON.parse(userStr);
    const userRole = currentUserData.role;
    
    console.log("User authenticated:", currentUserData.email, "Role:", userRole);
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    const studentDashboard = document.getElementById('studentDashboard');
    
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        console.log("Loading screen hidden");
    }
    
    if (studentDashboard) {
        studentDashboard.classList.remove('hidden');
        console.log("Dashboard shown");
    }
    
    // Update user name in header
    if (currentUserData && document.getElementById('studentName')) {
        const name = currentUserData.name || currentUserData.email || 'Student';
        document.getElementById('studentName').textContent = name;
        console.log("Student name updated:", name);
    }
    
    // Initialize Bootstrap tabs
    const tabTriggers = [].slice.call(document.querySelectorAll('#dashboardTabs button[data-bs-toggle="tab"]'));
    tabTriggers.forEach(function (triggerEl) {
        triggerEl.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('data-bs-target');
            const tabId = target.replace('#', '');
            loadTabContent(tabId);
        });
    });
    
    // Load initial tab content
    loadTabContent('overview');
    
    // Setup modal close buttons
    setupModalButtons();
    
    // Pre-fill edit profile form
    prefillEditForm();
});

function loadTabContent(tabId) {
    console.log("Loading tab:", tabId);
    
    const tabContent = document.getElementById(tabId);
    if (!tabContent) return;
    
    // Show loading state
    tabContent.innerHTML = `
        <div class="spinner-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Load content based on tab
    setTimeout(() => {
        switch(tabId) {
            case 'overview':
                loadOverviewTab();
                break;
            case 'courses':
                loadCoursesTab();
                break;
            case 'grades':
                loadGradesTab();
                break;
            case 'attendance':
                loadAttendanceTab();
                break;
            case 'profile':
                loadProfileTab();
                break;
            default:
                loadOverviewTab();
        }
    }, 300);
}

function loadOverviewTab() {
    const tabContent = document.getElementById('overview');
    if (!tabContent) return;
    
    // Sample data
    const enrolledCourses = 5;
    const averageGrade = 3.65;
    const attendanceRate = '96.7%';
    
    // Update statistics
    const enrolledCoursesCount = document.getElementById('enrolledCoursesCount');
    const averageGradeEl = document.getElementById('averageGrade');
    const attendanceRateEl = document.getElementById('attendanceRate');
    
    if (enrolledCoursesCount) enrolledCoursesCount.textContent = enrolledCourses;
    if (averageGradeEl) averageGradeEl.textContent = averageGrade;
    if (attendanceRateEl) attendanceRateEl.textContent = attendanceRate;
    
    // Recent announcements
    const recentAnnouncements = document.getElementById('recentAnnouncements');
    if (recentAnnouncements) {
        recentAnnouncements.innerHTML = `
            <div class="announcement-item">
                <h5>Midterm Exams Schedule</h5>
                <p>Midterm exams begin next Monday. Please check your exam schedule on the notice board.</p>
                <small><i class="far fa-calendar me-1"></i>Posted: March 10, 2024</small>
            </div>
            <div class="announcement-item">
                <h5>Library Maintenance</h5>
                <p>Main library will be closed this Saturday for maintenance. Please plan your studies accordingly.</p>
                <small><i class="far fa-calendar me-1"></i>Posted: March 8, 2024</small>
            </div>
            <div class="announcement-item">
                <h5>Career Counseling Session</h5>
                <p>Career counseling session will be held next Wednesday at 2 PM in the auditorium.</p>
                <small><i class="far fa-calendar me-1"></i>Posted: March 12, 2024</small>
            </div>
        `;
    }
}

function loadCoursesTab() {
    const tabContent = document.getElementById('enrolledCoursesList');
    if (!tabContent) return;
    
    // Sample course data
    const courses = [
        { code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Smith', credits: 3, progress: 65, status: 'In Progress' },
        { code: 'MATH201', name: 'Calculus II', instructor: 'Prof. Johnson', credits: 4, progress: 42, status: 'In Progress' },
        { code: 'ENG102', name: 'English Composition', instructor: 'Dr. Williams', credits: 3, progress: 85, status: 'In Progress' },
        { code: 'PHY101', name: 'Physics I', instructor: 'Prof. Brown', credits: 4, progress: 30, status: 'In Progress' },
        { code: 'BUS201', name: 'Business Management', instructor: 'Prof. Davis', credits: 3, progress: 90, status: 'Completed' }
    ];
    
    tabContent.innerHTML = `
        <div class="course-list">
            ${courses.map(course => `
                <div class="course-card ${course.status === 'Completed' ? 'enrolled' : ''}">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h4 class="text-gradient">${course.code} - ${course.name}</h4>
                            <p class="mb-1"><i class="fas fa-chalkboard-teacher me-2"></i>${course.instructor}</p>
                            <p class="mb-2"><i class="fas fa-star me-2"></i>${course.credits} Credits</p>
                        </div>
                        <span class="badge ${course.status === 'Completed' ? 'bg-success' : 'bg-primary'}">${course.status}</span>
                    </div>
                    
                    <div class="progress mb-2" style="height: 10px;">
                        <div class="progress-bar" role="progressbar" style="width: ${course.progress}%" 
                             aria-valuenow="${course.progress}" aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Progress: ${course.progress}% complete</small>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewCourseDetails('${course.code}')">
                            <i class="fas fa-info-circle me-1"></i>View Details
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="mt-4">
            <button class="btn btn-primary" onclick="showModal('Enroll in Course', 'Browse and enroll in available courses')">
                <i class="fas fa-plus-circle me-2"></i>Enroll in New Course
            </button>
        </div>
    `;
}

function loadGradesTab() {
    const tabContent = document.getElementById('gradesContent');
    if (!tabContent) return;
    
    // Sample grades data
    const grades = [
        { course: 'CS101 - Programming', assignment: 'Midterm Exam', score: 92, grade: 'A', date: '2024-03-01' },
        { course: 'CS101 - Programming', assignment: 'Assignment 3', score: 85, grade: 'B', date: '2024-02-25' },
        { course: 'MATH201 - Calculus II', assignment: 'Quiz 2', score: 88, grade: 'B+', date: '2024-03-03' },
        { course: 'ENG102 - English', assignment: 'Research Paper', score: 95, grade: 'A', date: '2024-02-28' },
        { course: 'PHY101 - Physics I', assignment: 'Lab Report 1', score: 78, grade: 'C+', date: '2024-02-20' }
    ];
    
    tabContent.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h4 class="mb-4">Recent Grades</h4>
                <div class="grade-list">
                    ${grades.map(grade => `
                        <div class="grade-item">
                            <div>
                                <h5 class="mb-1">${grade.assignment}</h5>
                                <p class="text-muted mb-0">${grade.course}</p>
                                <small class="text-muted">${formatDate(new Date(grade.date))}</small>
                            </div>
                            <div class="text-end">
                                <div class="score-display">
                                    <span class="badge ${getGradeColor(grade.grade)} p-2" style="font-size: 1.2rem;">
                                        ${grade.grade}
                                    </span>
                                    <div class="mt-1">
                                        <strong>${grade.score}%</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-chart-pie me-2"></i>Grade Summary</h5>
                        <div class="mt-3">
                            <p><strong>Current GPA:</strong> <span class="float-end">3.65</span></p>
                            <p><strong>Total Credits:</strong> <span class="float-end">15</span></p>
                            <p><strong>Credits Completed:</strong> <span class="float-end">9</span></p>
                            <hr>
                            <p><strong>Grade Distribution:</strong></p>
                            <p>A: <span class="float-end">2 courses</span></p>
                            <p>B: <span class="float-end">2 courses</span></p>
                            <p>C: <span class="float-end">1 course</span></p>
                        </div>
                        <button class="btn btn-outline-primary w-100 mt-3" onclick="showModal('View All Grades', 'View complete grade history and transcript')">
                            <i class="fas fa-file-alt me-2"></i>View Transcript
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadAttendanceTab() {
    const tabContent = document.getElementById('attendanceContent');
    if (!tabContent) return;
    
    // Sample attendance data
    const attendanceData = {
        overall: '96.7%',
        courses: [
            { name: 'CS101 - Programming', present: 28, total: 30, rate: '93.3%' },
            { name: 'MATH201 - Calculus', present: 29, total: 30, rate: '96.7%' },
            { name: 'ENG102 - English', present: 30, total: 30, rate: '100%' },
            { name: 'PHY101 - Physics', present: 27, total: 30, rate: '90%' },
            { name: 'BUS201 - Business', present: 29, total: 30, rate: '96.7%' }
        ]
    };
    
    tabContent.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 class="text-gradient">${attendanceData.overall}</h3>
                        <p class="text-muted">Overall Attendance Rate</p>
                        <div class="mt-3">
                            <div class="progress" style="height: 20px;">
                                <div class="progress-bar bg-success" role="progressbar" 
                                     style="width: ${parseFloat(attendanceData.overall)}%" 
                                     aria-valuenow="${parseFloat(attendanceData.overall)}" 
                                     aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <h4 class="mb-4">Attendance by Course</h4>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Present</th>
                                <th>Total</th>
                                <th>Rate</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${attendanceData.courses.map(course => `
                                <tr>
                                    <td>${course.name}</td>
                                    <td>${course.present}</td>
                                    <td>${course.total}</td>
                                    <td>${course.rate}</td>
                                    <td>
                                        <span class="badge ${parseFloat(course.rate) >= 90 ? 'bg-success' : 'bg-warning'}">
                                            ${parseFloat(course.rate) >= 90 ? 'Good' : 'Needs Improvement'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="alert alert-info mt-4">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Note:</strong> Attendance is calculated based on class participation. Contact your instructor if there are any discrepancies.
        </div>
    `;
}

function loadProfileTab() {
    const tabContent = document.getElementById('profileDisplay');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
        <div class="profile-display">
            <div class="profile-field">
                <strong>Full Name</strong>
                <p>${currentUserData.name || 'John Doe'}</p>
            </div>
            
            <div class="profile-field">
                <strong>Student ID</strong>
                <p>${currentUserData.studentId || 'STU2024001'}</p>
            </div>
            
            <div class="profile-field">
                <strong>Email Address</strong>
                <p>${currentUserData.email || 'student@school.com'}</p>
            </div>
            
            <div class="profile-field">
                <strong>Program</strong>
                <p>${currentUserData.program || 'Computer Science'}</p>
            </div>
            
            <div class="profile-field">
                <strong>Year</strong>
                <p>${currentUserData.year || '2nd Year'}</p>
            </div>
            
            <div class="profile-field">
                <strong>Enrollment Date</strong>
                <p>${formatDate(new Date('2023-09-01'))}</p>
            </div>
        </div>
        
        <!-- Profile Actions Section -->
        <div class="profile-actions-section mt-4">
            <h5><i class="fas fa-cogs me-2"></i>Profile Actions</h5>
            <div class="profile-actions-grid">
                <button class="profile-action-btn" onclick="openEditProfileModal()">
                    <i class="fas fa-user-edit"></i>
                    <span>Edit Profile</span>
                    <small>Update your personal information</small>
                </button>
                <button class="profile-action-btn" onclick="openChangePasswordModal()">
                    <i class="fas fa-key"></i>
                    <span>Change Password</span>
                    <small>Update your login password</small>
                </button>
                <button class="profile-action-btn" onclick="openDownloadProfileModal()">
                    <i class="fas fa-download"></i>
                    <span>Download Profile</span>
                    <small>Export your profile data</small>
                </button>
            </div>
        </div>
    `;
}

// Utility Functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getGradeColor(grade) {
    if (grade.includes('A')) return 'bg-success';
    if (grade.includes('B')) return 'bg-info';
    if (grade.includes('C')) return 'bg-warning';
    return 'bg-danger';
}

function viewCourseDetails(courseCode) {
    showModal(`Course Details: ${courseCode}`, `Viewing details for ${courseCode}. This feature will show complete course information, syllabus, and materials.`);
}

function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.add('active');
}

function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.add('active');
}

function openDownloadProfileModal() {
    const modal = document.getElementById('downloadProfileModal');
    if (modal) modal.classList.add('active');
}

function showModal(title, message) {
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modal = document.getElementById('comingSoonModal');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) modal.classList.remove('active');
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.remove('active');
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.remove('active');
}

function closeDownloadProfileModal() {
    const modal = document.getElementById('downloadProfileModal');
    if (modal) modal.classList.remove('active');
}

function prefillEditForm() {
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editStudentId = document.getElementById('editStudentId');
    const editProgram = document.getElementById('editProgram');
    const editYear = document.getElementById('editYear');
    
    if (editName) editName.value = currentUserData.name || '';
    if (editEmail) editEmail.value = currentUserData.email || '';
    if (editStudentId) editStudentId.value = currentUserData.studentId || '';
    if (editProgram) editProgram.value = currentUserData.program || 'Computer Science';
    if (editYear) editYear.value = currentUserData.year || '2nd Year';
}

function setupModalButtons() {
    // Edit Profile Form Submit
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update user data
            currentUserData.name = document.getElementById('editName').value;
            currentUserData.email = document.getElementById('editEmail').value;
            currentUserData.studentId = document.getElementById('editStudentId').value;
            currentUserData.program = document.getElementById('editProgram').value;
            currentUserData.year = document.getElementById('editYear').value;
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUserData));
            
            // Show success message
            showNotification('Profile updated successfully!', 'success');
            
            // Close modal
            closeEditProfileModal();
            
            // Reload profile tab
            loadProfileTab();
            
            // Update header name
            if (document.getElementById('studentName')) {
                document.getElementById('studentName').textContent = currentUserData.name;
            }
        });
    }
    
    // Change Password Form Submit
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('Password must be at least 8 characters long!');
                return;
            }
            
            // In a real app, you would validate current password with server
            // For demo, just show success
            showNotification('Password changed successfully! Please login again.', 'success');
            
            // Clear form
            changePasswordForm.reset();
            
            // Close modal
            closeChangePasswordModal();
            
            // Auto logout after 2 seconds
            setTimeout(() => {
                logout();
            }, 2000);
        });
    }
    
    // Download Profile
    const downloadButtons = document.querySelectorAll('[onclick*="downloadProfileData"]');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            downloadProfileData();
        });
    });
    
    // Format selection
    const formatOptions = document.querySelectorAll('.format-option');
    formatOptions.forEach(option => {
        option.addEventListener('click', function() {
            formatOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedFormat = this.id.replace('Option', '');
        });
    });
}

function downloadProfileData() {
    const includePersonal = document.getElementById('includePersonal')?.checked || true;
    const includeCourses = document.getElementById('includeCourses')?.checked || true;
    const includeGrades = document.getElementById('includeGrades')?.checked || true;
    const includeAttendance = document.getElementById('includeAttendance')?.checked || true;
    
    // Create profile data object
    const profileData = {
        personal: includePersonal ? currentUserData : null,
        courses: includeCourses ? [
            { code: 'CS101', name: 'Introduction to Programming', progress: '65%' },
            { code: 'MATH201', name: 'Calculus II', progress: '42%' }
        ] : null,
        grades: includeGrades ? [
            { course: 'CS101', grade: 'A', score: 92 },
            { course: 'MATH201', grade: 'B+', score: 88 }
        ] : null,
        attendance: includeAttendance ? { rate: '96.7%', courses: [] } : null,
        exportedAt: new Date().toISOString()
    };
    
    // Show success message
    showNotification(`Profile downloaded in ${selectedFormat.toUpperCase()} format!`, 'success');
    
    // Close modal
    closeDownloadProfileModal();
    
    // In a real app, you would generate and download the file
    console.log('Profile data for download:', profileData);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const typeStyles = {
        'success': { color: '#4caf50', icon: 'fa-check-circle' },
        'error': { color: '#f44336', icon: 'fa-exclamation-circle' },
        'warning': { color: '#ff9800', icon: 'fa-exclamation-triangle' },
        'info': { color: '#2196F3', icon: 'fa-info-circle' }
    };
    
    const style = typeStyles[type] || typeStyles.success;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-left: 4px solid ${style.color};
    `;
    
    notification.innerHTML = `
        <i class="fas ${style.icon}" style="color: ${style.color}; font-size: 20px;"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Make functions available globally
window.showModal = showModal;
window.closeModal = closeModal;
window.openEditProfileModal = openEditProfileModal;
window.openChangePasswordModal = openChangePasswordModal;
window.openDownloadProfileModal = openDownloadProfileModal;
window.viewCourseDetails = viewCourseDetails;
window.downloadProfileData = downloadProfileData;
window.selectFormat = function(format) {
    selectedFormat = format;
    const formatOptions = document.querySelectorAll('.format-option');
    formatOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.id === format + 'Option') {
            option.classList.add('selected');
        }
    });
};
window.logout = logout;
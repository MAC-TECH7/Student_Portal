// admin.js - Complete Admin Dashboard with all functionality
console.log("admin.js loaded successfully!");

// Global variables
let currentUserData = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing admin dashboard...");
    
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
    
    if (userRole !== 'admin') {
        console.log("Not an admin, redirecting...");
        alert("Access denied. Admin privileges required.");
        window.location.href = 'student.html';
        return;
    }
    
    console.log("Admin authenticated:", currentUserData.email, "Role:", userRole);
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        console.log("Loading screen hidden");
    }
    
    if (adminDashboard) {
        adminDashboard.classList.remove('hidden');
        console.log("Dashboard shown");
    }
    
    // Update user name in header
    if (currentUserData && document.getElementById('adminName')) {
        const name = currentUserData.name || currentUserData.email || 'Administrator';
        document.getElementById('adminName').textContent = name;
        console.log("Admin name updated:", name);
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
    
    // Setup modal buttons
    setupModalButtons();
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
            case 'users':
                loadUsersTab();
                break;
            case 'courses':
                loadCoursesTab();
                break;
            case 'reports':
                loadReportsTab();
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
    
    // Get statistics data
    const stats = {
        totalUsers: 156,
        activeStudents: 142,
        totalCourses: 24,
        systemHealth: '98%'
    };
    
    // Update statistics
    const totalUsersEl = document.getElementById('totalUsers');
    const activeStudentsEl = document.getElementById('activeStudents');
    const totalCoursesEl = document.getElementById('totalCourses');
    const systemHealthEl = document.getElementById('systemHealth');
    
    if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers;
    if (activeStudentsEl) activeStudentsEl.textContent = stats.activeStudents;
    if (totalCoursesEl) totalCoursesEl.textContent = stats.totalCourses;
    if (systemHealthEl) systemHealthEl.textContent = stats.systemHealth;
    
    // System alerts
    const systemAlerts = document.getElementById('systemAlerts');
    if (systemAlerts) {
        systemAlerts.innerHTML = `
            <div class="announcement-item">
                <h5><i class="fas fa-exclamation-triangle text-warning me-2"></i>System Maintenance</h5>
                <p>Scheduled maintenance on Saturday, 2 AM - 4 AM.</p>
                <small><i class="far fa-calendar me-1"></i>${formatDate(new Date())}</small>
            </div>
            <div class="announcement-item">
                <h5><i class="fas fa-check-circle text-success me-2"></i>Backup Completed</h5>
                <p>Daily system backup completed successfully.</p>
                <small><i class="far fa-calendar me-1"></i>${formatDate(new Date(Date.now() - 86400000))}</small>
            </div>
        `;
    }
    
    // Set quick actions HTML
    const quickActionsContainer = tabContent.querySelector('.quick-actions');
    if (quickActionsContainer) {
        quickActionsContainer.innerHTML = `
            <div class="action-btn" onclick="openAddUserModal()">
                <i class="fas fa-user-plus"></i>
                <span>Add New User</span>
            </div>
            <div class="action-btn" onclick="openAddCourseModal()">
                <i class="fas fa-plus-circle"></i>
                <span>Create Course</span>
            </div>
            <div class="action-btn" onclick="downloadReport('user')">
                <i class="fas fa-file-export"></i>
                <span>Generate Report</span>
            </div>
            <div class="action-btn" onclick="openSystemSettingsModal()">
                <i class="fas fa-cog"></i>
                <span>System Settings</span>
            </div>
        `;
    }
}

function loadUsersTab() {
    const tabContent = document.getElementById('users');
    if (!tabContent) return;
    
    // Sample user data
    const users = [
        { id: 'STU001', name: 'John Doe', email: 'john@school.com', role: 'Student', status: 'Active' },
        { id: 'STU002', name: 'Jane Smith', email: 'jane@school.com', role: 'Student', status: 'Active' },
        { id: 'ADM001', name: 'Admin User', email: 'admin@school.com', role: 'Admin', status: 'Active' },
        { id: 'STU003', name: 'Bob Johnson', email: 'bob@school.com', role: 'Student', status: 'Inactive' },
        { id: 'STU004', name: 'Alice Brown', email: 'alice@school.com', role: 'Student', status: 'Active' }
    ];
    
    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h3><i class="fas fa-users me-2"></i>User Management</h3>
                    <button class="btn btn-primary" onclick="openAddUserModal()">
                        <i class="fas fa-user-plus me-2"></i>Add User
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            ${users.map(user => {
                                const roleClass = user.role === 'Admin' ? 'bg-primary' : 'bg-success';
                                const statusClass = user.status === 'Active' ? 'bg-success' : 'bg-danger';
                                return `
                                    <tr>
                                        <td>${user.id}</td>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td><span class="badge ${roleClass}">${user.role}</span></td>
                                        <td><span class="badge ${statusClass}">${user.status}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditUserModal('${user.id}', '${user.name}', '${user.email}', '${user.role}', '${user.status}')">
                                                <i class="fas fa-edit"></i> Edit
                                            </button>
                                            ${user.role === 'Admin' ? 
                                                '<button class="btn btn-sm btn-outline-secondary" disabled><i class="fas fa-trash"></i> Delete</button>' : 
                                                `<button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.id}', '${user.name}')">
                                                    <i class="fas fa-trash"></i> Delete
                                                </button>`
                                            }
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function loadCoursesTab() {
    const tabContent = document.getElementById('courses');
    if (!tabContent) return;
    
    // Sample course data
    const courses = [
        { code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Smith', credits: 3, students: 45, status: 'Active' },
        { code: 'MATH201', name: 'Calculus II', instructor: 'Prof. Johnson', credits: 4, students: 38, status: 'Active' },
        { code: 'ENG102', name: 'English Composition', instructor: 'Dr. Williams', credits: 3, students: 52, status: 'Active' },
        { code: 'PHY101', name: 'Physics I', instructor: 'Prof. Brown', credits: 4, students: 29, status: 'Inactive' }
    ];
    
    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h3><i class="fas fa-book me-2"></i>Course Management</h3>
                    <button class="btn btn-primary" onclick="openAddCourseModal()">
                        <i class="fas fa-plus-circle me-2"></i>Add Course
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Instructor</th>
                                <th>Credits</th>
                                <th>Students</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${courses.map(course => {
                                const statusClass = course.status === 'Active' ? 'bg-success' : 'bg-secondary';
                                return `
                                    <tr>
                                        <td>${course.code}</td>
                                        <td>${course.name}</td>
                                        <td>${course.instructor}</td>
                                        <td>${course.credits}</td>
                                        <td>${course.students}</td>
                                        <td><span class="badge ${statusClass}">${course.status}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditCourseModal('${course.code}', '${course.name}', '${course.instructor}', ${course.credits}, '${course.status}')">
                                                <i class="fas fa-edit"></i> Edit
                                            </button>
                                            <button class="btn btn-sm btn-outline-info" onclick="viewCourseDetails('${course.code}', '${course.name}')">
                                                <i class="fas fa-eye"></i> View
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function loadReportsTab() {
    const tabContent = document.getElementById('reports');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-chart-bar me-2"></i>Reports & Analytics</h3>
            </div>
            <div class="card-body">
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5><i class="fas fa-file-pdf text-danger me-2"></i>User Report</h5>
                                <p class="text-muted">Download complete user list</p>
                                <button class="btn btn-outline-danger" onclick="downloadReport('user')">
                                    <i class="fas fa-download me-2"></i>Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5><i class="fas fa-file-excel text-success me-2"></i>Course Report</h5>
                                <p class="text-muted">Export course data</p>
                                <button class="btn btn-outline-success" onclick="downloadReport('course')">
                                    <i class="fas fa-download me-2"></i>Download Excel
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5><i class="fas fa-chart-line text-primary me-2"></i>Analytics</h5>
                                <p class="text-muted">View system analytics</p>
                                <button class="btn btn-outline-primary" onclick="openAnalyticsModal()">
                                    <i class="fas fa-chart-bar me-2"></i>View Analytics
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Note:</strong> Full reporting features are currently under development. Basic exports are available now.
                </div>
            </div>
        </div>
    `;
}

function loadProfileTab() {
    const tabContent = document.getElementById('profile');
    if (!tabContent) return;
    
    tabContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3><i class="fas fa-user-tie me-2"></i>Admin Profile</h3>
            </div>
            <div class="card-body">
                <div class="profile-display">
                    <div class="profile-field">
                        <strong>Full Name</strong>
                        <p>${currentUserData.name || 'Administrator'}</p>
                    </div>
                    
                    <div class="profile-field">
                        <strong>Email Address</strong>
                        <p>${currentUserData.email || 'admin@school.com'}</p>
                    </div>
                    
                    <div class="profile-field">
                        <strong>Role</strong>
                        <p><span class="badge bg-primary">Administrator</span></p>
                    </div>
                    
                    <div class="profile-field">
                        <strong>Account Created</strong>
                        <p>${formatDate(new Date())}</p>
                    </div>
                </div>
                
                <!-- Admin Actions Section -->
                <div class="profile-actions-section mt-4">
                    <h5><i class="fas fa-user-shield me-2"></i>Admin Actions</h5>
                    <div class="profile-actions-grid">
                        <button class="profile-action-btn" onclick="loadTabContent('users')">
                            <i class="fas fa-users-cog"></i>
                            <span>Manage Users</span>
                            <small>View and manage all users</small>
                        </button>
                        <button class="profile-action-btn" onclick="openSystemSettingsModal()">
                            <i class="fas fa-cogs"></i>
                            <span>System Settings</span>
                            <small>Configure system settings</small>
                        </button>
                        <button class="profile-action-btn" onclick="downloadReport('system')">
                            <i class="fas fa-database"></i>
                            <span>Export Data</span>
                            <small>Export system data</small>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Modal Functions
function openAddUserModal() {
    document.getElementById('addUserModalTitle').textContent = 'Add New User';
    document.getElementById('addUserForm').reset();
    document.getElementById('addUserModal').classList.add('active');
}

function openEditUserModal(userId, userName, userEmail, userRole, userStatus) {
    document.getElementById('editUserModalTitle').textContent = `Edit User: ${userName}`;
    
    // Store user ID for form submission
    document.getElementById('editUserForm').dataset.userId = userId;
    
    // Pre-fill form
    document.getElementById('editUserName').value = userName;
    document.getElementById('editUserEmail').value = userEmail;
    document.getElementById('editUserRole').value = userRole.toLowerCase();
    document.getElementById('editUserStatus').value = userStatus.toLowerCase();
    
    document.getElementById('editUserModal').classList.add('active');
}

function openAddCourseModal() {
    document.getElementById('addCourseModalTitle').textContent = 'Add New Course';
    document.getElementById('addCourseForm').reset();
    document.getElementById('addCourseModal').classList.add('active');
}

function openEditCourseModal(courseCode, courseName, instructor, credits, status) {
    document.getElementById('editCourseModalTitle').textContent = `Edit Course: ${courseCode}`;
    
    // Store course code for form submission
    document.getElementById('editCourseForm').dataset.courseCode = courseCode;
    
    // Pre-fill form
    document.getElementById('editCourseCode').value = courseCode;
    document.getElementById('editCourseName').value = courseName;
    document.getElementById('editCourseInstructor').value = instructor;
    document.getElementById('editCourseCredits').value = credits;
    document.getElementById('editCourseStatus').value = status.toLowerCase();
    
    document.getElementById('editCourseModal').classList.add('active');
}

function openSystemSettingsModal() {
    document.getElementById('systemSettingsModalTitle').textContent = 'System Settings';
    document.getElementById('systemSettingsModal').classList.add('active');
}

function openAnalyticsModal() {
    document.getElementById('analyticsModalTitle').textContent = 'System Analytics';
    document.getElementById('analyticsModal').classList.add('active');
}

function viewCourseDetails(courseCode, courseName) {
    document.getElementById('courseDetailsTitle').textContent = `${courseCode} - ${courseName}`;
    document.getElementById('courseDetailsModal').classList.add('active');
}

// Close Modal Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// User Management Functions
function deleteUser(userId, userName) {
    if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
        // In a real app, you would make an API call here
        showNotification(`User ${userName} deleted successfully!`, 'success');
        
        // Reload users tab
        loadUsersTab();
    }
}

// Utility Functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function downloadReport(type) {
    const reports = {
        'user': { name: 'User_Report', type: 'PDF' },
        'course': { name: 'Course_Report', type: 'Excel' },
        'system': { name: 'System_Data_Export', type: 'CSV' }
    };
    
    const report = reports[type];
    if (report) {
        showNotification(`${report.type} report "${report.name}" downloaded successfully!`, 'success');
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Set type-based styles
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

function setupModalButtons() {
    // Add User Form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('addUserName').value;
            const email = document.getElementById('addUserEmail').value;
            const role = document.getElementById('addUserRole').value;
            const status = document.getElementById('addUserStatus').value;
            
            // Generate user ID
            const userId = role === 'admin' ? 'ADM' : 'STU' + String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
            
            showNotification(`User ${name} added successfully!`, 'success');
            closeModal('addUserModal');
            addUserForm.reset();
            
            // Reload users tab
            loadUsersTab();
        });
    }
    
    // Edit User Form
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = this.dataset.userId;
            const name = document.getElementById('editUserName').value;
            const email = document.getElementById('editUserEmail').value;
            const role = document.getElementById('editUserRole').value;
            const status = document.getElementById('editUserStatus').value;
            
            showNotification(`User ${name} updated successfully!`, 'success');
            closeModal('editUserModal');
            
            // Reload users tab
            loadUsersTab();
        });
    }
    
    // Add Course Form
    const addCourseForm = document.getElementById('addCourseForm');
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const code = document.getElementById('addCourseCode').value;
            const name = document.getElementById('addCourseName').value;
            const instructor = document.getElementById('addCourseInstructor').value;
            const credits = document.getElementById('addCourseCredits').value;
            const status = document.getElementById('addCourseStatus').value;
            
            showNotification(`Course ${code} added successfully!`, 'success');
            closeModal('addCourseModal');
            addCourseForm.reset();
            
            // Reload courses tab
            loadCoursesTab();
        });
    }
    
    // Edit Course Form
    const editCourseForm = document.getElementById('editCourseForm');
    if (editCourseForm) {
        editCourseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const courseCode = this.dataset.courseCode;
            const code = document.getElementById('editCourseCode').value;
            const name = document.getElementById('editCourseName').value;
            const instructor = document.getElementById('editCourseInstructor').value;
            const credits = document.getElementById('editCourseCredits').value;
            const status = document.getElementById('editCourseStatus').value;
            
            showNotification(`Course ${code} updated successfully!`, 'success');
            closeModal('editCourseModal');
            
            // Reload courses tab
            loadCoursesTab();
        });
    }
    
    // Close buttons for all modals
    const closeButtons = document.querySelectorAll('[onclick^="closeModal"]');
    closeButtons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        const match = onclick.match(/closeModal\('([^']+)'\)/);
        if (match) {
            const modalId = match[1];
            button.addEventListener('click', () => closeModal(modalId));
        }
    });
    
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Make functions available globally
window.openAddUserModal = openAddUserModal;
window.openEditUserModal = openEditUserModal;
window.openAddCourseModal = openAddCourseModal;
window.openEditCourseModal = openEditCourseModal;
window.openSystemSettingsModal = openSystemSettingsModal;
window.openAnalyticsModal = openAnalyticsModal;
window.viewCourseDetails = viewCourseDetails;
window.deleteUser = deleteUser;
window.downloadReport = downloadReport;
window.logout = logout;
window.closeModal = closeModal;
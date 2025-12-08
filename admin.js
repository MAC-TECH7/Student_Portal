// admin.js - Add these imports at the TOP of the file
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { app } from "./firebase.js";

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Add authentication check at the start
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
});

async function checkAdminAuth() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }
        
        try {
            // Get user document from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (!userDoc.exists()) {
                window.location.href = "login.html";
                return;
            }
            
            const userData = userDoc.data();
            
            // Check if admin
            if (userData.role !== "admin") {
                alert("Access denied. Admins only.");
                window.location.href = "student.html";
                return;
            }
            
            // Update admin name in the UI
            updateAdminUI(userData);
            
            // Initialize your existing admin dashboard
            initializeAdminDashboard();
            
        } catch (error) {
            console.error("Admin auth error:", error);
            window.location.href = "login.html";
        }
    });
}

function updateAdminUI(userData) {
    const adminName = document.getElementById('adminName');
    const adminNameHeader = document.getElementById('adminNameHeader');
    const adminEmail = document.getElementById('adminEmail');
    
    if (adminName) adminName.textContent = userData.name || 'Administrator';
    if (adminNameHeader) adminNameHeader.textContent = userData.name || 'Administrator';
    if (adminEmail) adminEmail.textContent = userData.email || 'admin@school.com';
}

function initializeAdminDashboard() {
    // Your existing initialization code from admin.js
    // Set up menu click handlers
    document.querySelectorAll('.menu-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                navigateTo(pageId);
            }
        });
    });
    
    // Initialize with dashboard
    navigateTo('dashboard');
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Add logout functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.logout-btn')) {
            logoutAdmin();
        }
    });
}

async function logoutAdmin() {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout error:", error);
        alert("Error logging out. Please try again.");
    }
}


// admin.js - Complete Admin Dashboard Functionality

// Main Application State
const AppState = {
    currentPage: 'dashboard',
    students: [
        { id: 'S001', firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', course: 'CS101', status: 'active', enrollmentDate: '2023-01-15', phone: '(123) 456-7890', address: '123 Main St, City' },
        { id: 'S002', firstName: 'Emma', lastName: 'Johnson', email: 'emma.j@email.com', course: 'BA201', status: 'active', enrollmentDate: '2023-02-10', phone: '(234) 567-8901', address: '456 Oak Ave, Town' },
        { id: 'S003', firstName: 'Michael', lastName: 'Brown', email: 'm.brown@email.com', course: 'EE301', status: 'inactive', enrollmentDate: '2022-11-05', phone: '(345) 678-9012', address: '789 Pine Rd, Village' },
        { id: 'S004', firstName: 'Sarah', lastName: 'Williams', email: 'sarah.w@email.com', course: 'PSY101', status: 'active', enrollmentDate: '2023-03-22', phone: '(456) 789-0123', address: '321 Elm St, County' }
    ],
    courses: [
        { code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Alan Turing', department: 'Computer Science', students: 45, credits: 3, description: 'Fundamental programming concepts' },
        { code: 'BA201', name: 'Business Management', instructor: 'Prof. Jane Doe', department: 'Business', students: 38, credits: 4, description: 'Principles of business management' },
        { code: 'EE301', name: 'Circuit Analysis', instructor: 'Dr. Robert Johnson', department: 'Engineering', students: 32, credits: 4, description: 'Analysis of electrical circuits' },
        { code: 'PSY101', name: 'Introduction to Psychology', instructor: 'Dr. Sarah Miller', department: 'Psychology', students: 42, credits: 3, description: 'Basic psychological principles' }
    ],
    grades: [
        { id: 'G001', studentId: 'S001', studentName: 'John Smith', course: 'CS101', midterm: 85, final: 90, assignments: 88, overall: 'A-' },
        { id: 'G002', studentId: 'S002', studentName: 'Emma Johnson', course: 'BA201', midterm: 92, final: 88, assignments: 95, overall: 'A' },
        { id: 'G003', studentId: 'S003', studentName: 'Michael Brown', course: 'EE301', midterm: 78, final: 82, assignments: 80, overall: 'B-' },
        { id: 'G004', studentId: 'S004', studentName: 'Sarah Williams', course: 'PSY101', midterm: 88, final: 91, assignments: 89, overall: 'A-' }
    ],
    attendance: [
        { id: 'A001', date: '2023-04-20', course: 'CS101', totalStudents: 45, present: 42, absent: 3, percentage: '93.3%', notes: 'Regular class' },
        { id: 'A002', date: '2023-04-19', course: 'BA201', totalStudents: 38, present: 35, absent: 3, percentage: '92.1%', notes: 'Guest lecture' },
        { id: 'A003', date: '2023-04-18', course: 'EE301', totalStudents: 32, present: 30, absent: 2, percentage: '93.8%', notes: 'Lab session' },
        { id: 'A004', date: '2023-04-17', course: 'PSY101', totalStudents: 42, present: 40, absent: 2, percentage: '95.2%', notes: 'Group discussion' }
    ],
    announcements: [
        { id: 'AN001', title: 'Midterm Exams Schedule', content: 'The midterm exam schedule has been published. Please check the course pages for specific dates and times.', date: '2023-04-15' },
        { id: 'AN002', title: 'New Library Hours', content: 'Starting next week, the library will extend its hours to 10 PM on weekdays.', date: '2023-04-12' },
        { id: 'AN003', title: 'Registration for Fall 2023', content: 'Registration for the Fall 2023 semester will open on May 1st. Please ensure all prerequisites are met.', date: '2023-04-10' },
        { id: 'AN004', title: 'Campus Maintenance', content: 'There will be scheduled maintenance in the science building this weekend. Please avoid the area.', date: '2023-04-08' }
    ],
    reports: [
        { id: 'R001', name: 'Monthly Student Report', type: 'PDF', generated: '2023-04-01', size: '2.4 MB' },
        { id: 'R002', name: 'Attendance Summary', type: 'Excel', generated: '2023-04-05', size: '1.8 MB' },
        { id: 'R003', name: 'Grade Distribution', type: 'PDF', generated: '2023-04-10', size: '3.1 MB' },
        { id: 'R004', name: 'Course Enrollment', type: 'CSV', generated: '2023-04-15', size: '1.2 MB' }
    ]
};

// Page Templates
const PageTemplates = {
    dashboard: () => `
        <div class="stats-cards">
            <div class="stat-card" onclick="navigateTo('students')">
                <h3>Total Students</h3>
                <div class="value">${AppState.students.length}</div>
                <div class="change positive"><i class="fas fa-arrow-up"></i> 5.2% from last month</div>
            </div>
            <div class="stat-card" onclick="navigateTo('students')">
                <h3>Active Students</h3>
                <div class="value">${AppState.students.filter(s => s.status === 'active').length}</div>
                <div class="change positive"><i class="fas fa-arrow-up"></i> 4.1% from last month</div>
            </div>
            <div class="stat-card" onclick="navigateTo('courses')">
                <h3>Courses Offered</h3>
                <div class="value">${AppState.courses.length}</div>
                <div class="change positive"><i class="fas fa-arrow-up"></i> 2 new this term</div>
            </div>
            <div class="stat-card" onclick="navigateTo('grades')">
                <h3>Average GPA</h3>
                <div class="value">3.42</div>
                <div class="change positive"><i class="fas fa-arrow-up"></i> 0.08 from last term</div>
            </div>
            <div class="stat-card" onclick="navigateTo('attendance')">
                <h3>Attendance Rate</h3>
                <div class="value">94.7%</div>
                <div class="change negative"><i class="fas fa-arrow-down"></i> 1.3% from last week</div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="showAddStudentForm()">
                            <i class="fas fa-user-plus"></i> Add New Student
                        </a>
                        <span class="badge">New</span>
                    </li>
                    <li>
                        <a onclick="showAddCourseForm()">
                            <i class="fas fa-plus-circle"></i> Create Course
                        </a>
                    </li>
                    <li>
                        <a onclick="generateReport()">
                            <i class="fas fa-file-export"></i> Export Report
                        </a>
                    </li>
                    <li>
                        <a onclick="showAddAnnouncementForm()">
                            <i class="fas fa-bullhorn"></i> Send Announcement
                        </a>
                    </li>
                </ul>
            </div>

            <div class="dashboard-card">
                <h3><i class="fas fa-history"></i> Recent Activity</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="navigateTo('grades')">
                            <i class="fas fa-edit"></i> Grades updated for Math 101
                        </a>
                        <span class="badge">Today</span>
                    </li>
                    <li>
                        <a onclick="navigateTo('students')">
                            <i class="fas fa-user-check"></i> 5 new student registrations
                        </a>
                        <span class="badge">Yesterday</span>
                    </li>
                    <li>
                        <a onclick="navigateTo('attendance')">
                            <i class="fas fa-exclamation-triangle"></i> Low attendance alert
                        </a>
                        <span class="badge">2 days ago</span>
                    </li>
                    <li>
                        <a onclick="navigateTo('reports')">
                            <i class="fas fa-file-pdf"></i> Monthly report generated
                        </a>
                        <span class="badge">3 days ago</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="announcement-section">
            <h3><i class="fas fa-bullhorn"></i> Recent Announcements</h3>
            ${AppState.announcements.slice(0, 3).map(announcement => `
                <div class="announcement-item">
                    <h4>${announcement.title}</h4>
                    <p>${announcement.content}</p>
                    <div class="date">Posted: ${announcement.date}</div>
                </div>
            `).join('')}
        </div>
    `,

    students: () => `
        <div class="page-header">
            <h2><i class="fas fa-users"></i> Manage Students</h2>
            <button class="btn" onclick="showAddStudentForm()">
                <i class="fas fa-user-plus"></i> Add New Student
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Enrollment Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppState.students.map(student => {
                        const course = AppState.courses.find(c => c.code === student.course);
                        const courseName = course ? course.name : student.course;
                        return `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.firstName} ${student.lastName}</td>
                                <td>${student.email}</td>
                                <td>${courseName}</td>
                                <td><span class="status-${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span></td>
                                <td>${student.enrollmentDate}</td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn edit-btn" onclick="editStudent('${student.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="action-btn view-btn" onclick="viewStudentDetails('${student.id}')">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                        <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `,

    courses: () => `
        <div class="page-header">
            <h2><i class="fas fa-book-open"></i> Manage Courses</h2>
            <button class="btn" onclick="showAddCourseForm()">
                <i class="fas fa-plus-circle"></i> Add New Course
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Instructor</th>
                        <th>Department</th>
                        <th>Students Enrolled</th>
                        <th>Credits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppState.courses.map(course => `
                        <tr>
                            <td>${course.code}</td>
                            <td>${course.name}</td>
                            <td>${course.instructor}</td>
                            <td>${course.department}</td>
                            <td>${course.students}</td>
                            <td>${course.credits}</td>
                            <td>
                                <div class="action-btns">
                                    <button class="action-btn edit-btn" onclick="editCourse('${course.code}')">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="action-btn view-btn" onclick="viewCourseDetails('${course.code}')">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    <button class="action-btn delete-btn" onclick="deleteCourse('${course.code}')">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `,

    grades: () => `
        <div class="page-header">
            <h2><i class="fas fa-chart-bar"></i> Manage Grades</h2>
            <button class="btn" onclick="showAddGradeForm()">
                <i class="fas fa-plus"></i> Add Grade
            </button>
            <button class="btn btn-secondary" onclick="importGrades()">
                <i class="fas fa-upload"></i> Import Grades
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Midterm</th>
                        <th>Final</th>
                        <th>Assignments</th>
                        <th>Overall Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppState.grades.map(grade => {
                        const course = AppState.courses.find(c => c.code === grade.course);
                        const courseName = course ? course.name : grade.course;
                        return `
                            <tr>
                                <td>${grade.studentName}</td>
                                <td>${courseName}</td>
                                <td>${grade.midterm}</td>
                                <td>${grade.final}</td>
                                <td>${grade.assignments}</td>
                                <td><strong>${grade.overall}</strong></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn edit-btn" onclick="editGrade('${grade.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="action-btn delete-btn" onclick="deleteGrade('${grade.id}')">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `,

    attendance: () => `
        <div class="page-header">
            <h2><i class="fas fa-calendar-check"></i> Attendance Management</h2>
            <button class="btn" onclick="showAddAttendanceForm()">
                <i class="fas fa-calendar-plus"></i> Mark Attendance
            </button>
            <button class="btn btn-secondary" onclick="generateAttendanceReport()">
                <i class="fas fa-file-pdf"></i> Generate Report
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Total Students</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Attendance %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${AppState.attendance.map(record => {
                        const course = AppState.courses.find(c => c.code === record.course);
                        const courseName = course ? course.name : record.course;
                        return `
                            <tr>
                                <td>${record.date}</td>
                                <td>${courseName}</td>
                                <td>${record.totalStudents}</td>
                                <td>${record.present}</td>
                                <td>${record.absent}</td>
                                <td><strong>${record.percentage}</strong></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn view-btn" onclick="viewAttendanceDetails('${record.id}')">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                        <button class="action-btn edit-btn" onclick="editAttendance('${record.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `,

    announcements: () => `
        <div class="page-header">
            <h2><i class="fas fa-bullhorn"></i> Announcements</h2>
            <button class="btn" onclick="showAddAnnouncementForm()">
                <i class="fas fa-plus"></i> Create Announcement
            </button>
        </div>

        <div class="announcement-section">
            ${AppState.announcements.map(announcement => `
                <div class="announcement-item">
                    <h4>${announcement.title}</h4>
                    <p>${announcement.content}</p>
                    <div class="date">Posted: ${announcement.date}</div>
                    <div style="margin-top: 10px;">
                        <button class="action-btn edit-btn" onclick="editAnnouncement('${announcement.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteAnnouncement('${announcement.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `,

    reports: () => `
        <div class="page-header">
            <h2><i class="fas fa-file-alt"></i> Generate Reports</h2>
            <button class="btn" onclick="generateStudentReport()">
                <i class="fas fa-user-graduate"></i> Student Report
            </button>
            <button class="btn btn-secondary" onclick="generateGradeReport()">
                <i class="fas fa-chart-bar"></i> Grade Report
            </button>
            <button class="btn" onclick="generateAttendanceReport()">
                <i class="fas fa-calendar-check"></i> Attendance Report
            </button>
        </div>

        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-history"></i> Recent Reports</h3>
                <ul class="card-links">
                    ${AppState.reports.map(report => `
                        <li>
                            <a onclick="downloadReport('${report.id}')">
                                <i class="fas fa-file-${report.type.toLowerCase()}"></i> ${report.name}
                            </a>
                            <span class="badge">${report.type}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="dashboard-card">
                <h3><i class="fas fa-cogs"></i> Report Options</h3>
                <div style="padding: 15px;">
                    <div class="form-group">
                        <label>Report Type</label>
                        <select id="reportType" class="form-control">
                            <option value="student">Student Report</option>
                            <option value="grade">Grade Report</option>
                            <option value="attendance">Attendance Report</option>
                            <option value="course">Course Report</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Format</label>
                        <select id="reportFormat" class="form-control">
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date Range</label>
                        <div class="form-row">
                            <input type="date" id="startDate" class="form-control" value="2023-04-01">
                            <input type="date" id="endDate" class="form-control" value="2023-04-30">
                        </div>
                    </div>
                    <button class="btn btn-secondary" onclick="generateCustomReport()" style="width: 100%; margin-top: 20px;">
                        <i class="fas fa-file-download"></i> Generate Custom Report
                    </button>
                </div>
            </div>
        </div>
    `
};

// Navigation Functions
function navigateTo(pageId) {
    AppState.currentPage = pageId;
    
    // Update page title
    const titles = {
        'dashboard': 'Admin Dashboard',
        'students': 'Manage Students',
        'courses': 'Manage Courses',
        'grades': 'Manage Grades',
        'attendance': 'Attendance Management',
        'announcements': 'Announcements',
        'reports': 'Generate Reports'
    };
    
    document.getElementById('pageTitle').textContent = titles[pageId] || 'Admin Dashboard';
    
    // Update active menu item
    document.querySelectorAll('.menu-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Load page content
    const pageContent = document.getElementById('pageContent');
    if (PageTemplates[pageId]) {
        pageContent.innerHTML = PageTemplates[pageId]();
    } else {
        pageContent.innerHTML = `<div class="page-content">Page not found</div>`;
    }
}

// Modal Functions
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set color based on type
    if (type === 'error') {
        toast.style.backgroundColor = '#e74c3c';
    } else if (type === 'warning') {
        toast.style.backgroundColor = '#f39c12';
    } else {
        toast.style.backgroundColor = '#2ecc71';
    }
    
    toastMessage.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Student Management Functions
function showAddStudentForm() {
    const formContent = `
        <form id="addStudentForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">First Name *</label>
                    <input type="text" id="firstName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name *</label>
                    <input type="text" id="lastName" class="form-control" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" class="form-control">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="course">Course *</label>
                    <select id="course" class="form-control" required>
                        <option value="">Select a course</option>
                        ${AppState.courses.map(course => `<option value="${course.code}">${course.name} (${course.code})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="enrollmentDate">Enrollment Date *</label>
                    <input type="date" id="enrollmentDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" class="form-control" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label for="status">Status *</label>
                <select id="status" class="form-control" required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="saveStudent()">
                    <i class="fas fa-save"></i> Save Student
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Add New Student', formContent);
}

function saveStudent() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const course = document.getElementById('course').value;
    
    if (!firstName || !lastName || !email || !course) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Generate new student ID
    const newId = 'S' + String(AppState.students.length + 1).padStart(3, '0');
    
    // Add new student
    AppState.students.push({
        id: newId,
        firstName,
        lastName,
        email,
        course: course,
        status: document.getElementById('status').value,
        enrollmentDate: document.getElementById('enrollmentDate').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    });
    
    closeModal();
    showToast(`Student ${firstName} ${lastName} added successfully!`);
    navigateTo('students');
}

function editStudent(studentId) {
    const student = AppState.students.find(s => s.id === studentId);
    if (!student) return;
    
    const formContent = `
        <form id="editStudentForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="editFirstName">First Name *</label>
                    <input type="text" id="editFirstName" class="form-control" value="${student.firstName}" required>
                </div>
                <div class="form-group">
                    <label for="editLastName">Last Name *</label>
                    <input type="text" id="editLastName" class="form-control" value="${student.lastName}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editEmail">Email Address *</label>
                    <input type="email" id="editEmail" class="form-control" value="${student.email}" required>
                </div>
                <div class="form-group">
                    <label for="editPhone">Phone Number</label>
                    <input type="tel" id="editPhone" class="form-control" value="${student.phone || ''}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editCourse">Course *</label>
                    <select id="editCourse" class="form-control" required>
                        <option value="">Select a course</option>
                        ${AppState.courses.map(course => `
                            <option value="${course.code}" ${course.code === student.course ? 'selected' : ''}>${course.name} (${course.code})</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editStatus">Status *</label>
                    <select id="editStatus" class="form-control" required>
                        <option value="active" ${student.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${student.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="editAddress">Address</label>
                <textarea id="editAddress" class="form-control" rows="3">${student.address || ''}</textarea>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="updateStudent('${studentId}')">
                    <i class="fas fa-save"></i> Update Student
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Edit Student', formContent);
}

function updateStudent(studentId) {
    const studentIndex = AppState.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;
    
    AppState.students[studentIndex] = {
        ...AppState.students[studentIndex],
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        course: document.getElementById('editCourse').value,
        status: document.getElementById('editStatus').value,
        phone: document.getElementById('editPhone').value,
        address: document.getElementById('editAddress').value
    };
    
    closeModal();
    showToast('Student updated successfully!');
    navigateTo('students');
}

function viewStudentDetails(studentId) {
    const student = AppState.students.find(s => s.id === studentId);
    if (!student) return;
    
    const course = AppState.courses.find(c => c.code === student.course);
    const courseName = course ? course.name : student.course;
    
    const content = `
        <div style="padding: 20px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">${student.firstName} ${student.lastName}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Student ID</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${student.id}</div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <div class="form-control" style="background-color: #f8f9fa;">
                        <span class="status-${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span>
                    </div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${student.email}</div>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${student.phone || 'N/A'}</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Course</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${courseName}</div>
                </div>
                <div class="form-group">
                    <label>Enrollment Date</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${student.enrollmentDate}</div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Address</label>
                <div class="form-control" style="background-color: #f8f9fa; min-height: 60px;">${student.address || 'N/A'}</div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button class="btn" onclick="editStudent('${studentId}')">
                    <i class="fas fa-edit"></i> Edit Student
                </button>
            </div>
        </div>
    `;
    
    showModal('Student Details', content);
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        AppState.students = AppState.students.filter(s => s.id !== studentId);
        showToast('Student deleted successfully!');
        navigateTo('students');
    }
}

// Course Management Functions
function showAddCourseForm() {
    const formContent = `
        <form id="addCourseForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="courseCode">Course Code *</label>
                    <input type="text" id="courseCode" class="form-control" placeholder="e.g., CS101" required>
                </div>
                <div class="form-group">
                    <label for="courseName">Course Name *</label>
                    <input type="text" id="courseName" class="form-control" placeholder="e.g., Introduction to Programming" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="instructor">Instructor *</label>
                    <input type="text" id="instructor" class="form-control" placeholder="e.g., Dr. John Doe" required>
                </div>
                <div class="form-group">
                    <label for="department">Department *</label>
                    <select id="department" class="form-control" required>
                        <option value="">Select department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business">Business</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Psychology">Psychology</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="credits">Credits *</label>
                    <input type="number" id="credits" class="form-control" min="1" max="6" value="3" required>
                </div>
                <div class="form-group">
                    <label for="maxStudents">Maximum Students</label>
                    <input type="number" id="maxStudents" class="form-control" min="1" max="100" value="50">
                </div>
            </div>
            
            <div class="form-group">
                <label for="courseDescription">Course Description</label>
                <textarea id="courseDescription" class="form-control" rows="4" placeholder="Enter course description..."></textarea>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="saveCourse()">
                    <i class="fas fa-save"></i> Save Course
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Add New Course', formContent);
}

function saveCourse() {
    const courseCode = document.getElementById('courseCode').value;
    const courseName = document.getElementById('courseName').value;
    
    if (!courseCode || !courseName) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if course code already exists
    if (AppState.courses.find(c => c.code === courseCode)) {
        showToast('Course code already exists!', 'error');
        return;
    }
    
    // Add new course
    AppState.courses.push({
        code: courseCode,
        name: courseName,
        instructor: document.getElementById('instructor').value,
        department: document.getElementById('department').value,
        students: 0,
        credits: parseInt(document.getElementById('credits').value),
        description: document.getElementById('courseDescription').value,
        maxStudents: parseInt(document.getElementById('maxStudents').value) || 50
    });
    
    closeModal();
    showToast(`Course ${courseCode} added successfully!`);
    navigateTo('courses');
}

function editCourse(courseCode) {
    const course = AppState.courses.find(c => c.code === courseCode);
    if (!course) return;
    
    const formContent = `
        <form id="editCourseForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="editCourseCode">Course Code</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${course.code}</div>
                </div>
                <div class="form-group">
                    <label for="editCourseName">Course Name *</label>
                    <input type="text" id="editCourseName" class="form-control" value="${course.name}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editInstructor">Instructor *</label>
                    <input type="text" id="editInstructor" class="form-control" value="${course.instructor}" required>
                </div>
                <div class="form-group">
                    <label for="editDepartment">Department *</label>
                    <select id="editDepartment" class="form-control" required>
                        <option value="Computer Science" ${course.department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
                        <option value="Business" ${course.department === 'Business' ? 'selected' : ''}>Business</option>
                        <option value="Engineering" ${course.department === 'Engineering' ? 'selected' : ''}>Engineering</option>
                        <option value="Psychology" ${course.department === 'Psychology' ? 'selected' : ''}>Psychology</option>
                        <option value="Mathematics" ${course.department === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
                        <option value="Physics" ${course.department === 'Physics' ? 'selected' : ''}>Physics</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editCredits">Credits *</label>
                    <input type="number" id="editCredits" class="form-control" min="1" max="6" value="${course.credits}" required>
                </div>
                <div class="form-group">
                    <label for="editStudents">Students Enrolled</label>
                    <input type="number" id="editStudents" class="form-control" min="0" max="100" value="${course.students}">
                </div>
            </div>
            
            <div class="form-group">
                <label for="editCourseDescription">Course Description</label>
                <textarea id="editCourseDescription" class="form-control" rows="4">${course.description || ''}</textarea>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="updateCourse('${courseCode}')">
                    <i class="fas fa-save"></i> Update Course
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Edit Course', formContent);
}

function updateCourse(courseCode) {
    const courseIndex = AppState.courses.findIndex(c => c.code === courseCode);
    if (courseIndex === -1) return;
    
    AppState.courses[courseIndex] = {
        ...AppState.courses[courseIndex],
        name: document.getElementById('editCourseName').value,
        instructor: document.getElementById('editInstructor').value,
        department: document.getElementById('editDepartment').value,
        credits: parseInt(document.getElementById('editCredits').value),
        students: parseInt(document.getElementById('editStudents').value),
        description: document.getElementById('editCourseDescription').value
    };
    
    closeModal();
    showToast('Course updated successfully!');
    navigateTo('courses');
}

function viewCourseDetails(courseCode) {
    const course = AppState.courses.find(c => c.code === courseCode);
    if (!course) return;
    
    // Count students in this course
    const studentsInCourse = AppState.students.filter(s => s.course === courseCode).length;
    
    const content = `
        <div style="padding: 20px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">${course.name} (${course.code})</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Instructor</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${course.instructor}</div>
                </div>
                <div class="form-group">
                    <label>Department</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${course.department}</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Credits</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${course.credits}</div>
                </div>
                <div class="form-group">
                    <label>Students Enrolled</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${studentsInCourse} / ${course.students}</div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Description</label>
                <div class="form-control" style="background-color: #f8f9fa; min-height: 100px;">${course.description || 'No description available'}</div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button class="btn" onclick="editCourse('${courseCode}')">
                    <i class="fas fa-edit"></i> Edit Course
                </button>
            </div>
        </div>
    `;
    
    showModal('Course Details', content);
}

function deleteCourse(courseCode) {
    if (confirm('Are you sure you want to delete this course? This will also remove all students enrolled in this course.')) {
        // Remove course
        AppState.courses = AppState.courses.filter(c => c.code !== courseCode);
        
        // Remove students from this course
        AppState.students = AppState.students.filter(s => s.course !== courseCode);
        
        showToast('Course deleted successfully!');
        navigateTo('courses');
    }
}

// Grade Management Functions
function showAddGradeForm() {
    const formContent = `
        <form id="addGradeForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="gradeStudent">Student *</label>
                    <select id="gradeStudent" class="form-control" required>
                        <option value="">Select student</option>
                        ${AppState.students.map(student => `
                            <option value="${student.id}">${student.firstName} ${student.lastName} (${student.id})</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="gradeCourse">Course *</label>
                    <select id="gradeCourse" class="form-control" required>
                        <option value="">Select course</option>
                        ${AppState.courses.map(course => `
                            <option value="${course.code}">${course.name} (${course.code})</option>
                        `).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="midtermGrade">Midterm Grade (0-100)</label>
                    <input type="number" id="midtermGrade" class="form-control" min="0" max="100" value="0">
                </div>
                <div class="form-group">
                    <label for="finalGrade">Final Grade (0-100)</label>
                    <input type="number" id="finalGrade" class="form-control" min="0" max="100" value="0">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="assignmentsGrade">Assignments Grade (0-100)</label>
                    <input type="number" id="assignmentsGrade" class="form-control" min="0" max="100" value="0">
                </div>
                <div class="form-group">
                    <label for="overallGrade">Overall Grade (Letter)</label>
                    <select id="overallGrade" class="form-control">
                        <option value="">Select grade</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="C-">C-</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="saveGrade()">
                    <i class="fas fa-save"></i> Save Grade
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Add Grade', formContent);
}

function saveGrade() {
    const studentId = document.getElementById('gradeStudent').value;
    const courseCode = document.getElementById('gradeCourse').value;
    
    if (!studentId || !courseCode) {
        showToast('Please select student and course', 'error');
        return;
    }
    
    // Check if grade already exists for this student and course
    const existingGrade = AppState.grades.find(g => g.studentId === studentId && g.course === courseCode);
    if (existingGrade) {
        showToast('Grade already exists for this student and course!', 'error');
        return;
    }
    
    const student = AppState.students.find(s => s.id === studentId);
    if (!student) {
        showToast('Student not found!', 'error');
        return;
    }
    
    // Generate new grade ID
    const newId = 'G' + String(AppState.grades.length + 1).padStart(3, '0');
    
    // Add new grade
    AppState.grades.push({
        id: newId,
        studentId: studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        course: courseCode,
        midterm: parseInt(document.getElementById('midtermGrade').value) || 0,
        final: parseInt(document.getElementById('finalGrade').value) || 0,
        assignments: parseInt(document.getElementById('assignmentsGrade').value) || 0,
        overall: document.getElementById('overallGrade').value || 'N/A'
    });
    
    closeModal();
    showToast('Grade added successfully!');
    navigateTo('grades');
}

function editGrade(gradeId) {
    const grade = AppState.grades.find(g => g.id === gradeId);
    if (!grade) return;
    
    const formContent = `
        <form id="editGradeForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Student</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${grade.studentName}</div>
                </div>
                <div class="form-group">
                    <label>Course</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${grade.course}</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editMidtermGrade">Midterm Grade (0-100)</label>
                    <input type="number" id="editMidtermGrade" class="form-control" min="0" max="100" value="${grade.midterm}">
                </div>
                <div class="form-group">
                    <label for="editFinalGrade">Final Grade (0-100)</label>
                    <input type="number" id="editFinalGrade" class="form-control" min="0" max="100" value="${grade.final}">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editAssignmentsGrade">Assignments Grade (0-100)</label>
                    <input type="number" id="editAssignmentsGrade" class="form-control" min="0" max="100" value="${grade.assignments}">
                </div>
                <div class="form-group">
                    <label for="editOverallGrade">Overall Grade (Letter)</label>
                    <select id="editOverallGrade" class="form-control">
                        <option value="">Select grade</option>
                        <option value="A" ${grade.overall === 'A' ? 'selected' : ''}>A</option>
                        <option value="A-" ${grade.overall === 'A-' ? 'selected' : ''}>A-</option>
                        <option value="B+" ${grade.overall === 'B+' ? 'selected' : ''}>B+</option>
                        <option value="B" ${grade.overall === 'B' ? 'selected' : ''}>B</option>
                        <option value="B-" ${grade.overall === 'B-' ? 'selected' : ''}>B-</option>
                        <option value="C+" ${grade.overall === 'C+' ? 'selected' : ''}>C+</option>
                        <option value="C" ${grade.overall === 'C' ? 'selected' : ''}>C</option>
                        <option value="C-" ${grade.overall === 'C-' ? 'selected' : ''}>C-</option>
                        <option value="D" ${grade.overall === 'D' ? 'selected' : ''}>D</option>
                        <option value="F" ${grade.overall === 'F' ? 'selected' : ''}>F</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="updateGrade('${gradeId}')">
                    <i class="fas fa-save"></i> Update Grade
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Edit Grade', formContent);
}

function updateGrade(gradeId) {
    const gradeIndex = AppState.grades.findIndex(g => g.id === gradeId);
    if (gradeIndex === -1) return;
    
    AppState.grades[gradeIndex] = {
        ...AppState.grades[gradeIndex],
        midterm: parseInt(document.getElementById('editMidtermGrade').value) || 0,
        final: parseInt(document.getElementById('editFinalGrade').value) || 0,
        assignments: parseInt(document.getElementById('editAssignmentsGrade').value) || 0,
        overall: document.getElementById('editOverallGrade').value || 'N/A'
    };
    
    closeModal();
    showToast('Grade updated successfully!');
    navigateTo('grades');
}

function deleteGrade(gradeId) {
    if (confirm('Are you sure you want to delete this grade?')) {
        AppState.grades = AppState.grades.filter(g => g.id !== gradeId);
        showToast('Grade deleted successfully!');
        navigateTo('grades');
    }
}

function importGrades() {
    showToast('Import grades functionality would open here', 'warning');
}

// Attendance Management Functions
function showAddAttendanceForm() {
    const formContent = `
        <form id="addAttendanceForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="attendanceDate">Date *</label>
                    <input type="date" id="attendanceDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label for="attendanceCourse">Course *</label>
                    <select id="attendanceCourse" class="form-control" required>
                        <option value="">Select course</option>
                        ${AppState.courses.map(course => `
                            <option value="${course.code}">${course.name} (${course.code})</option>
                        `).join('')}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="totalStudents">Total Students</label>
                    <input type="number" id="totalStudents" class="form-control" min="1" max="100" value="30">
                </div>
                <div class="form-group">
                    <label for="presentStudents">Present Students</label>
                    <input type="number" id="presentStudents" class="form-control" min="0" max="100" value="28">
                </div>
            </div>
            
            <div class="form-group">
                <label for="attendanceNotes">Notes</label>
                <textarea id="attendanceNotes" class="form-control" rows="3" placeholder="Any additional notes..."></textarea>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="saveAttendance()">
                    <i class="fas fa-save"></i> Save Attendance
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Mark Attendance', formContent);
}

function saveAttendance() {
    const date = document.getElementById('attendanceDate').value;
    const course = document.getElementById('attendanceCourse').value;
    
    if (!date || !course) {
        showToast('Please select date and course', 'error');
        return;
    }
    
    const totalStudents = parseInt(document.getElementById('totalStudents').value) || 0;
    const presentStudents = parseInt(document.getElementById('presentStudents').value) || 0;
    const absentStudents = totalStudents - presentStudents;
    const percentage = totalStudents > 0 ? ((presentStudents / totalStudents) * 100).toFixed(1) + '%' : '0%';
    
    // Generate new attendance ID
    const newId = 'A' + String(AppState.attendance.length + 1).padStart(3, '0');
    
    // Add new attendance record
    AppState.attendance.push({
        id: newId,
        date: date,
        course: course,
        totalStudents: totalStudents,
        present: presentStudents,
        absent: absentStudents,
        percentage: percentage,
        notes: document.getElementById('attendanceNotes').value
    });
    
    closeModal();
    showToast('Attendance recorded successfully!');
    navigateTo('attendance');
}

function editAttendance(attendanceId) {
    const record = AppState.attendance.find(a => a.id === attendanceId);
    if (!record) return;
    
    const formContent = `
        <form id="editAttendanceForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="editAttendanceDate">Date *</label>
                    <input type="date" id="editAttendanceDate" class="form-control" value="${record.date}" required>
                </div>
                <div class="form-group">
                    <label>Course</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${record.course}</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editTotalStudents">Total Students</label>
                    <input type="number" id="editTotalStudents" class="form-control" min="1" max="100" value="${record.totalStudents}">
                </div>
                <div class="form-group">
                    <label for="editPresentStudents">Present Students</label>
                    <input type="number" id="editPresentStudents" class="form-control" min="0" max="100" value="${record.present}">
                </div>
            </div>
            
            <div class="form-group">
                <label for="editAttendanceNotes">Notes</label>
                <textarea id="editAttendanceNotes" class="form-control" rows="3">${record.notes || ''}</textarea>
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="updateAttendance('${attendanceId}')">
                    <i class="fas fa-save"></i> Update Attendance
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Edit Attendance', formContent);
}

function updateAttendance(attendanceId) {
    const recordIndex = AppState.attendance.findIndex(a => a.id === attendanceId);
    if (recordIndex === -1) return;
    
    const totalStudents = parseInt(document.getElementById('editTotalStudents').value) || 0;
    const presentStudents = parseInt(document.getElementById('editPresentStudents').value) || 0;
    const absentStudents = totalStudents - presentStudents;
    const percentage = totalStudents > 0 ? ((presentStudents / totalStudents) * 100).toFixed(1) + '%' : '0%';
    
    AppState.attendance[recordIndex] = {
        ...AppState.attendance[recordIndex],
        date: document.getElementById('editAttendanceDate').value,
        totalStudents: totalStudents,
        present: presentStudents,
        absent: absentStudents,
        percentage: percentage,
        notes: document.getElementById('editAttendanceNotes').value
    };
    
    closeModal();
    showToast('Attendance updated successfully!');
    navigateTo('attendance');
}

function viewAttendanceDetails(attendanceId) {
    const record = AppState.attendance.find(a => a.id === attendanceId);
    if (!record) return;
    
    const course = AppState.courses.find(c => c.code === record.course);
    const courseName = course ? course.name : record.course;
    
    const content = `
        <div style="padding: 20px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">Attendance Record</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Date</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${record.date}</div>
                </div>
                <div class="form-group">
                    <label>Course</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${courseName}</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Total Students</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${record.totalStudents}</div>
                </div>
                <div class="form-group">
                    <label>Present</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${record.present}</div>
                </div>
                <div class="form-group">
                    <label>Absent</label>
                    <div class="form-control" style="background-color: #f8f9fa;">${record.absent}</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Attendance Percentage</label>
                    <div class="form-control" style="background-color: #f8f9fa; font-weight: bold;">${record.percentage}</div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Notes</label>
                <div class="form-control" style="background-color: #f8f9fa; min-height: 60px;">${record.notes || 'No notes'}</div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
                <button class="btn" onclick="editAttendance('${attendanceId}')">
                    <i class="fas fa-edit"></i> Edit Attendance
                </button>
            </div>
        </div>
    `;
    
    showModal('Attendance Details', content);
}

// Announcement Functions
function showAddAnnouncementForm() {
    const formContent = `
        <form id="addAnnouncementForm">
            <div class="form-group">
                <label for="announcementTitle">Title *</label>
                <input type="text" id="announcementTitle" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="announcementContent">Content *</label>
                <textarea id="announcementContent" class="form-control" rows="6" required></textarea>
            </div>
            
            <div class="form-group">
                <label for="announcementDate">Date</label>
                <input type="date" id="announcementDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="saveAnnouncement()">
                    <i class="fas fa-save"></i> Publish Announcement
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Create Announcement', formContent);
}

function saveAnnouncement() {
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    
    if (!title || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Generate new announcement ID
    const newId = 'AN' + String(AppState.announcements.length + 1).padStart(3, '0');
    
    // Add new announcement at the beginning
    AppState.announcements.unshift({
        id: newId,
        title,
        content,
        date: document.getElementById('announcementDate').value || new Date().toISOString().split('T')[0]
    });
    
    closeModal();
    showToast('Announcement published successfully!');
    navigateTo('announcements');
}

function editAnnouncement(announcementId) {
    const announcement = AppState.announcements.find(a => a.id === announcementId);
    if (!announcement) return;
    
    const formContent = `
        <form id="editAnnouncementForm">
            <div class="form-group">
                <label for="editAnnouncementTitle">Title *</label>
                <input type="text" id="editAnnouncementTitle" class="form-control" value="${announcement.title}" required>
            </div>
            
            <div class="form-group">
                <label for="editAnnouncementContent">Content *</label>
                <textarea id="editAnnouncementContent" class="form-control" rows="6" required>${announcement.content}</textarea>
            </div>
            
            <div class="form-group">
                <label for="editAnnouncementDate">Date</label>
                <input type="date" id="editAnnouncementDate" class="form-control" value="${announcement.date}">
            </div>
            
            <div class="form-group" style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="button" class="btn btn-secondary" onclick="updateAnnouncement('${announcementId}')">
                    <i class="fas fa-save"></i> Update Announcement
                </button>
                <button type="button" class="btn" onclick="closeModal()" style="background-color: #95a5a6;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    showModal('Edit Announcement', formContent);
}

function updateAnnouncement(announcementId) {
    const announcementIndex = AppState.announcements.findIndex(a => a.id === announcementId);
    if (announcementIndex === -1) return;
    
    AppState.announcements[announcementIndex] = {
        ...AppState.announcements[announcementIndex],
        title: document.getElementById('editAnnouncementTitle').value,
        content: document.getElementById('editAnnouncementContent').value,
        date: document.getElementById('editAnnouncementDate').value
    };
    
    closeModal();
    showToast('Announcement updated successfully!');
    navigateTo('announcements');
}

function deleteAnnouncement(announcementId) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        AppState.announcements = AppState.announcements.filter(a => a.id !== announcementId);
        showToast('Announcement deleted successfully!');
        navigateTo('announcements');
    }
}

// Report Functions
function generateReport() {
    showToast('Report generation started. It will be available for download shortly.');
}

function generateStudentReport() {
    showToast('Student report generated successfully!');
}

function generateGradeReport() {
    showToast('Grade report generated successfully!');
}

function generateAttendanceReport() {
    showToast('Attendance report generated successfully!');
}

function downloadReport(reportId) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        showToast(`Downloading ${report.name}...`);
    }
}

function generateCustomReport() {
    const type = document.getElementById('reportType').value;
    const format = document.getElementById('reportFormat').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    showToast(`Generating ${type} report in ${format} format for ${startDate} to ${endDate}`);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up menu click handlers
    document.querySelectorAll('.menu-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                navigateTo(pageId);
            }
        });
    });
    
    // Initialize with dashboard
    navigateTo('dashboard');
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    });
});
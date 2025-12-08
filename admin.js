// ====== ADMIN DASHBOARD JAVASCRIPT ======

// ====== DATA PERSISTENCE ======
// Initialize data storage
const STORAGE_KEYS = {
    STUDENTS: 'eduadmin_students',
    COURSES: 'eduadmin_courses',
    GRADES: 'eduadmin_grades',
    ATTENDANCE: 'eduadmin_attendance',
    ANNOUNCEMENTS: 'eduadmin_announcements',
    SETTINGS: 'eduadmin_settings'
};

// Sample initial data
const INITIAL_DATA = {
    students: [
        { id: 'ST001', name: 'John Smith', email: 'john.smith@email.com', phone: '555-0101', course: 'CS101', status: 'active', enrollmentDate: '2024-01-15', gpa: 3.8 },
        { id: 'ST002', name: 'Emma Johnson', email: 'emma.j@email.com', phone: '555-0102', course: 'BUS202', status: 'active', enrollmentDate: '2024-01-20', gpa: 3.9 },
        { id: 'ST003', name: 'Michael Brown', email: 'm.brown@email.com', phone: '555-0103', course: 'ENG150', status: 'inactive', enrollmentDate: '2023-09-10', gpa: 3.2 },
        { id: 'ST004', name: 'Sarah Wilson', email: 'sarah.w@email.com', phone: '555-0104', course: 'CS101', status: 'active', enrollmentDate: '2024-02-01', gpa: 3.5 },
        { id: 'ST005', name: 'David Miller', email: 'd.miller@email.com', phone: '555-0105', course: 'BUS202', status: 'active', enrollmentDate: '2024-01-25', gpa: 3.7 }
    ],
    courses: [
        { code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Sarah Miller', credits: 3, students: 45, capacity: 50, description: 'Basic programming concepts using Python', status: 'active' },
        { code: 'BUS202', name: 'Business Management', instructor: 'Prof. James Wilson', credits: 4, students: 32, capacity: 40, description: 'Fundamentals of business administration', status: 'active' },
        { code: 'ENG150', name: 'Engineering Mathematics', instructor: 'Dr. Robert Chen', credits: 4, students: 38, capacity: 45, description: 'Mathematics for engineering students', status: 'active' },
        { code: 'ART110', name: 'Art History', instructor: 'Prof. Maria Garcia', credits: 3, students: 28, capacity: 35, description: 'Survey of art history from ancient to modern', status: 'active' }
    ],
    grades: [
        { studentId: 'ST001', courseCode: 'CS101', midterm: 85, final: 90, assignments: 88, total: 87.5, grade: 'A-' },
        { studentId: 'ST002', courseCode: 'BUS202', midterm: 92, final: 88, assignments: 90, total: 90.0, grade: 'A' },
        { studentId: 'ST003', courseCode: 'ENG150', midterm: 78, final: 82, assignments: 80, total: 80.0, grade: 'B' },
        { studentId: 'ST004', courseCode: 'CS101', midterm: 88, final: 85, assignments: 86, total: 86.5, grade: 'B+' },
        { studentId: 'ST001', courseCode: 'ENG150', midterm: 90, final: 92, assignments: 91, total: 91.0, grade: 'A' }
    ],
    attendance: [
        { studentId: 'ST001', date: '2024-04-01', status: 'present' },
        { studentId: 'ST002', date: '2024-04-01', status: 'present' },
        { studentId: 'ST003', date: '2024-04-01', status: 'absent' },
        { studentId: 'ST004', date: '2024-04-01', status: 'present' },
        { studentId: 'ST005', date: '2024-04-01', status: 'late' }
    ],
    announcements: [
        { id: 1, title: 'Midterm Exams Schedule', content: 'Midterm exams will begin next Monday. Please check the schedule on the notice board.', type: 'academic', priority: 'high', date: '2024-03-25', author: 'Admin' },
        { id: 2, title: 'Campus Maintenance', content: 'The library will be closed this Saturday for maintenance work.', type: 'general', priority: 'normal', date: '2024-03-20', author: 'Admin' },
        { id: 3, title: 'Scholarship Applications', content: 'Applications for the Spring semester scholarships are now open.', type: 'academic', priority: 'high', date: '2024-03-15', author: 'Admin' }
    ]
};

// Initialize storage
function initializeStorage() {
    Object.keys(STORAGE_KEYS).forEach(key => {
        const storageKey = STORAGE_KEYS[key];
        if (!localStorage.getItem(storageKey)) {
            const dataKey = key.toLowerCase().slice(0, -1); // Remove 's' from key
            localStorage.setItem(storageKey, JSON.stringify(INITIAL_DATA[dataKey] || []));
        }
    });
}

// Data CRUD operations
function getData(key) {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : [];
}

function saveData(key, data) {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
}

function addStudent(student) {
    const students = getData('STUDENTS');
    students.push(student);
    saveData('STUDENTS', students);
    return student;
}

function addCourse(course) {
    const courses = getData('COURSES');
    courses.push(course);
    saveData('COURSES', courses);
    return course;
}

function addAnnouncement(announcement) {
    const announcements = getData('ANNOUNCEMENTS');
    announcement.id = announcements.length + 1;
    announcement.date = new Date().toISOString().split('T')[0];
    announcement.author = 'Administrator';
    announcements.unshift(announcement); // Add to beginning
    saveData('ANNOUNCEMENTS', announcements);
    return announcement;
}

function updateGrade(studentId, courseCode, gradeData) {
    const grades = getData('GRADES');
    const index = grades.findIndex(g => g.studentId === studentId && g.courseCode === courseCode);
    
    if (index !== -1) {
        grades[index] = { ...grades[index], ...gradeData };
    } else {
        grades.push({ studentId, courseCode, ...gradeData });
    }
    
    saveData('GRADES', grades);
}

// Analytics functions
function calculateStats() {
    const students = getData('STUDENTS');
    const courses = getData('COURSES');
    const grades = getData('GRADES');
    const attendance = getData('ATTENDANCE');
    
    const activeStudents = students.filter(s => s.status === 'active').length;
    const totalCourses = courses.length;
    const activeCourses = courses.filter(c => c.status === 'active').length;
    
    // Calculate average GPA
    const studentGPAs = students.map(s => s.gpa || 0).filter(gpa => gpa > 0);
    const averageGPA = studentGPAs.length > 0 
        ? (studentGPAs.reduce((a, b) => a + b, 0) / studentGPAs.length).toFixed(2)
        : '0.00';
    
    // Calculate attendance rate
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentCount = todayAttendance.filter(a => a.status === 'present').length;
    const attendanceRate = todayAttendance.length > 0 
        ? ((presentCount / todayAttendance.length) * 100).toFixed(1)
        : '0.0';
    
    return {
        totalStudents: students.length,
        activeStudents,
        totalCourses,
        activeCourses,
        averageGPA,
        attendanceRate: attendanceRate + '%',
        newStudentsThisMonth: Math.floor(students.length * 0.12), // 12% growth
        graduatingThisYear: Math.floor(students.length * 0.27) // 27% graduating
    };
}

// ====== CHART FUNCTIONS ======
let charts = {}; // Store chart instances

function destroyChart(chartId) {
    if (charts[chartId]) {
        charts[chartId].destroy();
        delete charts[chartId];
    }
}

function renderStudentDistributionChart() {
    const students = getData('STUDENTS');
    const courses = getData('COURSES');
    
    const courseCounts = {};
    courses.forEach(course => {
        const count = students.filter(s => s.course === course.code).length;
        courseCounts[course.name] = count;
    });
    
    const ctx = document.getElementById('studentDistributionChart');
    if (!ctx) return;
    
    destroyChart('studentDistributionChart');
    
    charts['studentDistributionChart'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(courseCounts),
            datasets: [{
                data: Object.values(courseCounts),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Students by Course'
                }
            }
        }
    });
}

function renderGradeDistributionChart() {
    const grades = getData('GRADES');
    
    const gradeCounts = {
        'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0,
        'C+': 0, 'C': 0, 'C-': 0, 'D': 0, 'F': 0
    };
    
    grades.forEach(grade => {
        if (gradeCounts.hasOwnProperty(grade.grade)) {
            gradeCounts[grade.grade]++;
        }
    });
    
    const ctx = document.getElementById('gradeDistributionChart');
    if (!ctx) return;
    
    destroyChart('gradeDistributionChart');
    
    charts['gradeDistributionChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(gradeCounts).filter(k => gradeCounts[k] > 0),
            datasets: [{
                label: 'Number of Grades',
                data: Object.values(gradeCounts).filter(v => v > 0),
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Grades'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Grade'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Grade Distribution'
                }
            }
        }
    });
}

function renderAttendanceTrendChart() {
    const attendance = getData('ATTENDANCE');
    
    // Group by date
    const dateGroups = {};
    attendance.forEach(record => {
        if (!dateGroups[record.date]) {
            dateGroups[record.date] = { present: 0, total: 0 };
        }
        dateGroups[record.date].total++;
        if (record.status === 'present') {
            dateGroups[record.date].present++;
        }
    });
    
    const dates = Object.keys(dateGroups).sort();
    const rates = dates.map(date => {
        const group = dateGroups[date];
        return (group.present / group.total) * 100;
    });
    
    const ctx = document.getElementById('attendanceTrendChart');
    if (!ctx) return;
    
    destroyChart('attendanceTrendChart');
    
    charts['attendanceTrendChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Attendance Rate (%)',
                data: rates,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Attendance Rate (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Attendance Trends'
                }
            }
        }
    });
}

function renderCourseEnrollmentChart() {
    const courses = getData('COURSES');
    
    const ctx = document.getElementById('courseEnrollmentChart');
    if (!ctx) return;
    
    destroyChart('courseEnrollmentChart');
    
    charts['courseEnrollmentChart'] = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: courses.map(c => c.name),
            datasets: [{
                label: 'Enrollment',
                data: courses.map(c => c.students),
                backgroundColor: courses.map((_, i) => 
                    ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'][i % 5]
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Course Enrollment'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// ====== INITIALIZE THE DASHBOARD ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loading...');
    
    // Initialize data storage
    initializeStorage();
    
    // Load the dashboard when page loads
    loadPage('dashboard');
    
    // Add click event listeners to all menu items
    const menuItems = document.querySelectorAll('.menu-links a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            console.log('Loading page:', page);
            loadPage(page);
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ====== PAGE LOADING FUNCTION ======
function loadPage(page) {
    const pageContent = document.getElementById('pageContent');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!pageContent) {
        console.error('pageContent element not found!');
        return;
    }
    
    // Show loading indicator
    pageContent.innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p>Loading ${page.replace('-', ' ')}...</p>
        </div>
    `;
    
    // Update page title
    if (pageTitle) {
        const titles = {
            'dashboard': 'Admin Dashboard',
            'students': 'Manage Students',
            'courses': 'Manage Courses',
            'grades': 'Manage Grades',
            'attendance': 'Attendance Management',
            'announcements': 'Announcements',
            'reports': 'Generate Reports',
            'analytics': 'Analytics Dashboard',
            'settings': 'System Settings'
        };
        pageTitle.textContent = titles[page] || 'Admin Dashboard';
    }
    
    // Load content after a short delay
    setTimeout(() => {
        switch(page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'students':
                loadStudentsPage();
                break;
            case 'courses':
                loadCoursesPage();
                break;
            case 'grades':
                loadGradesPage();
                break;
            case 'attendance':
                loadAttendancePage();
                break;
            case 'announcements':
                loadAnnouncementsPage();
                break;
            case 'reports':
                loadReportsPage();
                break;
            case 'analytics':
                loadAnalyticsPage();
                break;
            case 'settings':
                loadSettingsPage();
                break;
            default:
                loadDashboard();
        }
    }, 300);
}

// ====== DASHBOARD CONTENT ======
function loadDashboard() {
    const stats = calculateStats();
    
    const pageContent = document.getElementById('pageContent');
    
    pageContent.innerHTML = `
        <div class="stats-cards">
            <div class="stat-card" onclick="loadPage('students')">
                <h3>Total Students</h3>
                <div class="value">${stats.totalStudents}</div>
                <div class="change positive"><i class="fas fa-arrow-up"></i> ${stats.newStudentsThisMonth} new this month</div>
            </div>
            <div class="stat-card" onclick="loadPage('courses')">
                <h3>Active Courses</h3>
                <div class="value">${stats.activeCourses}</div>
                <div class="change positive"><i class="fas fa-arrow-up"></i> ${stats.activeCourses}/${stats.totalCourses} active</div>
            </div>
            <div class="stat-card" onclick="loadPage('attendance')">
                <h3>Today's Attendance</h3>
                <div class="value">${stats.attendanceRate}</div>
                <div class="change ${parseFloat(stats.attendanceRate) > 95 ? 'positive' : 'negative'}">
                    <i class="fas fa-arrow-${parseFloat(stats.attendanceRate) > 95 ? 'up' : 'down'}"></i> 
                    ${parseFloat(stats.attendanceRate) > 95 ? 'Excellent' : 'Needs improvement'}
                </div>
            </div>
            <div class="stat-card" onclick="loadPage('grades')">
                <h3>Average GPA</h3>
                <div class="value">${stats.averageGPA}</div>
                <div class="change positive"><i class="fas fa-arrow-up"></i> Good academic performance</div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="generateReport('student')">
                            <i class="fas fa-file-export"></i> Generate Student Report
                        </a>
                        <span class="badge">NEW</span>
                    </li>
                    <li>
                        <a onclick="sendBulkEmail()">
                            <i class="fas fa-envelope"></i> Send Bulk Email
                        </a>
                    </li>
                    <li>
                        <a onclick="uploadGrades()">
                            <i class="fas fa-upload"></i> Upload Grades
                        </a>
                    </li>
                    <li>
                        <a onclick="markAttendance()">
                            <i class="fas fa-check-circle"></i> Mark Today's Attendance
                        </a>
                    </li>
                    <li>
                        <a onclick="loadPage('analytics')">
                            <i class="fas fa-chart-bar"></i> View Analytics
                        </a>
                    </li>
                </ul>
            </div>

            <div class="dashboard-card">
                <h3><i class="fas fa-bullhorn"></i> Recent Announcements</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="openAnnouncementModal()">
                            <i class="fas fa-plus-circle"></i> Create New Announcement
                        </a>
                    </li>
                    <li>
                        <a onclick="scheduleAnnouncement()">
                            <i class="fas fa-clock"></i> Schedule Announcement
                        </a>
                    </li>
                    <li>
                        <a onclick="sendEmailBlast()">
                            <i class="fas fa-paper-plane"></i> Send Email Blast
                        </a>
                    </li>
                </ul>
                ${renderRecentAnnouncements()}
            </div>

            <div class="dashboard-card">
                <h3><i class="fas fa-chart-line"></i> Reports & Analytics</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="generateStudentReport()">
                            <i class="fas fa-user-graduate"></i> Student Performance
                        </a>
                    </li>
                    <li>
                        <a onclick="generateCourseReport()">
                            <i class="fas fa-book"></i> Course Analytics
                        </a>
                    </li>
                    <li>
                        <a onclick="generateAttendanceReport()">
                            <i class="fas fa-calendar-alt"></i> Attendance Trends
                        </a>
                    </li>
                    <li>
                        <a onclick="generateFinancialReport()">
                            <i class="fas fa-dollar-sign"></i> Financial Report
                        </a>
                    </li>
                    <li>
                        <a onclick="exportAllData()">
                            <i class="fas fa-download"></i> Export All Data
                        </a>
                    </li>
                </ul>
            </div>

            <div class="dashboard-card">
                <h3><i class="fas fa-cog"></i> System Tasks</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="assignInstructors()">
                            <i class="fas fa-chalkboard-teacher"></i> Assign Instructors
                        </a>
                    </li>
                    <li>
                        <a onclick="calculateGPA()">
                            <i class="fas fa-calculator"></i> Calculate GPAs
                        </a>
                    </li>
                    <li>
                        <a onclick="sendAbsenceAlerts()">
                            <i class="fas fa-bell"></i> Send Absence Alerts
                        </a>
                    </li>
                    <li>
                        <a onclick="backupData()">
                            <i class="fas fa-database"></i> Backup Data
                        </a>
                    </li>
                    <li>
                        <a onclick="loadPage('settings')">
                            <i class="fas fa-sliders-h"></i> System Settings
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- Quick Charts -->
        <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <h4 style="color: #2c3e50; margin-bottom: 15px;">Student Distribution</h4>
                <canvas id="studentDistributionChart" height="200"></canvas>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <h4 style="color: #2c3e50; margin-bottom: 15px;">Course Enrollment</h4>
                <canvas id="courseEnrollmentChart" height="200"></canvas>
            </div>
        </div>
    `;
    
    // Render charts after content is loaded
    setTimeout(() => {
        renderStudentDistributionChart();
        renderCourseEnrollmentChart();
    }, 100);
}

function renderRecentAnnouncements() {
    const announcements = getData('ANNOUNCEMENTS').slice(0, 2); // Get latest 2
    if (announcements.length === 0) {
        return '<div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #7f8c8d;">No announcements yet</div>';
    }
    
    return announcements.map(ann => `
        <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${ann.priority === 'high' ? '#e74c3c' : '#3498db'};">
            <h4 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 0.95rem;">${ann.title}</h4>
            <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #666; line-height: 1.4;">${ann.content.substring(0, 80)}...</p>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #999;">
                <span>${ann.date}</span>
                <span style="background: ${ann.type === 'academic' ? '#d4edda' : '#d1ecf1'}; color: ${ann.type === 'academic' ? '#155724' : '#0c5460'}; padding: 2px 8px; border-radius: 12px;">${ann.type}</span>
            </div>
        </div>
    `).join('');
}

// ====== ANALYTICS PAGE ======
function loadAnalyticsPage() {
    const pageContent = document.getElementById('pageContent');
    const stats = calculateStats();
    
    pageContent.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-chart-bar"></i> Analytics Dashboard</h2>
            <div>
                <button class="btn" onclick="refreshAnalytics()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
                <button class="btn btn-secondary" onclick="exportAnalytics()">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>
        
        <div class="stats-cards">
            <div class="stat-card">
                <h3>Active Students</h3>
                <div class="value">${stats.activeStudents}</div>
                <div class="change positive"><i class="fas fa-user-check"></i> ${stats.activeStudents}/${stats.totalStudents}</div>
            </div>
            <div class="stat-card">
                <h3>Graduating Soon</h3>
                <div class="value">${stats.graduatingThisYear}</div>
                <div class="change positive"><i class="fas fa-graduation-cap"></i> This academic year</div>
            </div>
            <div class="stat-card">
                <h3>Course Capacity</h3>
                <div class="value">${Math.round((stats.activeStudents / (stats.activeCourses * 40)) * 100)}%</div>
                <div class="change positive"><i class="fas fa-chart-pie"></i> Utilization rate</div>
            </div>
            <div class="stat-card">
                <h3>Academic Performance</h3>
                <div class="value">${parseFloat(stats.averageGPA) > 3.5 ? 'Excellent' : 'Good'}</div>
                <div class="change ${parseFloat(stats.averageGPA) > 3.5 ? 'positive' : 'negative'}">
                    <i class="fas fa-${parseFloat(stats.averageGPA) > 3.5 ? 'star' : 'chart-line'}"></i> 
                    GPA: ${stats.averageGPA}
                </div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 25px; margin-top: 30px;">
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-chart-pie"></i> Student Distribution
                </h3>
                <canvas id="studentDistributionChart" height="250"></canvas>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-chart-bar"></i> Grade Distribution
                </h3>
                <canvas id="gradeDistributionChart" height="250"></canvas>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-chart-line"></i> Attendance Trends
                </h3>
                <canvas id="attendanceTrendChart" height="250"></canvas>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-users"></i> Course Enrollment
                </h3>
                <canvas id="courseEnrollmentChart" height="250"></canvas>
            </div>
        </div>
        
        <div style="margin-top: 40px; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <h3 style="color: #2c3e50; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-table"></i> Analytics Summary
            </h3>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                            <th>Trend</th>
                            <th>Target</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Student Enrollment</td>
                            <td>${stats.totalStudents}</td>
                            <td><span class="positive"><i class="fas fa-arrow-up"></i> Growing</span></td>
                            <td>1,500</td>
                            <td><span class="status-active">On Track</span></td>
                        </tr>
                        <tr>
                            <td>Average GPA</td>
                            <td>${stats.averageGPA}</td>
                            <td><span class="positive"><i class="fas fa-arrow-up"></i> Improving</span></td>
                            <td>3.5</td>
                            <td><span class="status-active">${parseFloat(stats.averageGPA) >= 3.5 ? 'Met' : 'Below'}</span></td>
                        </tr>
                        <tr>
                            <td>Attendance Rate</td>
                            <td>${stats.attendanceRate}</td>
                            <td><span class="${parseFloat(stats.attendanceRate) > 95 ? 'positive' : 'negative'}">
                                <i class="fas fa-arrow-${parseFloat(stats.attendanceRate) > 95 ? 'up' : 'down'}"></i> 
                                ${parseFloat(stats.attendanceRate) > 95 ? 'Good' : 'Needs Work'}
                            </span></td>
                            <td>95%</td>
                            <td><span class="status-${parseFloat(stats.attendanceRate) >= 95 ? 'active' : 'inactive'}">${parseFloat(stats.attendanceRate) >= 95 ? 'Met' : 'Below'}</span></td>
                        </tr>
                        <tr>
                            <td>Course Completion</td>
                            <td>92%</td>
                            <td><span class="positive"><i class="fas fa-arrow-up"></i> Stable</span></td>
                            <td>90%</td>
                            <td><span class="status-active">Exceeded</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Render all charts
    setTimeout(() => {
        renderStudentDistributionChart();
        renderGradeDistributionChart();
        renderAttendanceTrendChart();
        renderCourseEnrollmentChart();
    }, 100);
}

// ====== OTHER PAGE FUNCTIONS (Updated with real data) ======
function loadStudentsPage() {
    const students = getData('STUDENTS');
    
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-users"></i> Manage Students</h2>
            <div>
                <button class="btn btn-secondary" onclick="exportStudents()">
                    <i class="fas fa-download"></i> Export
                </button>
                <button class="btn" onclick="openAddStudentModal()" style="margin-left: 10px;">
                    <i class="fas fa-plus"></i> Add New Student
                </button>
            </div>
        </div>
        
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Course</th>
                        <th>GPA</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr>
                            <td>${student.id}</td>
                            <td>${student.name}</td>
                            <td>${student.email}</td>
                            <td>${student.phone || 'N/A'}</td>
                            <td>${student.course}</td>
                            <td><strong>${student.gpa || 'N/A'}</strong></td>
                            <td><span class="status-${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span></td>
                            <td class="action-btns">
                                <button class="action-btn view-btn" onclick="viewStudent('${student.id}')">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="action-btn edit-btn" onclick="editStudent('${student.id}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div>
                <strong>Total Students:</strong> ${students.length} | 
                <strong>Active:</strong> ${students.filter(s => s.status === 'active').length} | 
                <strong>Inactive:</strong> ${students.filter(s => s.status === 'inactive').length}
            </div>
            <button class="btn" onclick="bulkActions()">
                <i class="fas fa-cogs"></i> Bulk Actions
            </button>
        </div>
    `;
}

function loadCoursesPage() {
    const courses = getData('COURSES');
    
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-book-open"></i> Manage Courses</h2>
            <div>
                <button class="btn btn-secondary" onclick="exportCourses()">
                    <i class="fas fa-download"></i> Export
                </button>
                <button class="btn" onclick="openAddCourseModal()" style="margin-left: 10px;">
                    <i class="fas fa-plus"></i> Add New Course
                </button>
            </div>
        </div>
        
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Course Name</th>
                        <th>Instructor</th>
                        <th>Credits</th>
                        <th>Students</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map(course => `
                        <tr>
                            <td>${course.code}</td>
                            <td>${course.name}</td>
                            <td>${course.instructor}</td>
                            <td>${course.credits}</td>
                            <td>${course.students} / ${course.capacity}</td>
                            <td>
                                <div style="background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${(course.students / course.capacity) * 100}%; background: ${(course.students / course.capacity) > 0.9 ? '#e74c3c' : '#2ecc71'}; height: 100%;"></div>
                                </div>
                                <small>${Math.round((course.students / course.capacity) * 100)}% full</small>
                            </td>
                            <td><span class="status-${course.status}">${course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span></td>
                            <td class="action-btns">
                                <button class="action-btn view-btn" onclick="viewCourse('${course.code}')">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="action-btn edit-btn" onclick="editCourse('${course.code}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="action-btn delete-btn" onclick="deleteCourse('${course.code}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function loadGradesPage() {
    const grades = getData('GRADES');
    const students = getData('STUDENTS');
    const courses = getData('COURSES');
    
    // Enrich grades with student and course names
    const enrichedGrades = grades.map(grade => {
        const student = students.find(s => s.id === grade.studentId);
        const course = courses.find(c => c.code === grade.courseCode);
        return {
            ...grade,
            studentName: student ? student.name : 'Unknown',
            courseName: course ? course.name : 'Unknown'
        };
    });
    
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-chart-bar"></i> Manage Grades</h2>
            <div>
                <button class="btn btn-secondary" onclick="exportGrades()">
                    <i class="fas fa-download"></i> Export
                </button>
                <button class="btn" onclick="openGradeUploadModal()" style="margin-left: 10px;">
                    <i class="fas fa-upload"></i> Upload Grades
                </button>
                <button class="btn" onclick="openAddGradeModal()" style="margin-left: 10px;">
                    <i class="fas fa-plus"></i> Add Grade
                </button>
            </div>
        </div>
        
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Midterm</th>
                        <th>Final</th>
                        <th>Assignments</th>
                        <th>Total</th>
                        <th>Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${enrichedGrades.map(grade => `
                        <tr>
                            <td>${grade.studentName} (${grade.studentId})</td>
                            <td>${grade.courseName}</td>
                            <td>${grade.midterm}</td>
                            <td>${grade.final}</td>
                            <td>${grade.assignments}</td>
                            <td><strong>${grade.total}</strong></td>
                            <td><span style="font-weight: bold; color: ${grade.grade === 'A' ? '#27ae60' : grade.grade === 'B' ? '#f39c12' : '#e74c3c'}">${grade.grade}</span></td>
                            <td class="action-btns">
                                <button class="action-btn edit-btn" onclick="editGrade('${grade.studentId}', '${grade.courseCode}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="action-btn delete-btn" onclick="deleteGrade('${grade.studentId}', '${grade.courseCode}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 30px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Grade Statistics</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #3498db;">${calculateAverageGrade()}</div>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">Average Grade</div>
                </div>
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #2ecc71;">${countGradesByLetter('A') + countGradesByLetter('A-')}</div>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">A Grades</div>
                </div>
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #f39c12;">${countGradesByLetter('B') + countGradesByLetter('B+') + countGradesByLetter('B-')}</div>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">B Grades</div>
                </div>
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #e74c3c;">${countGradesBelow('C')}</div>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">Below C</div>
                </div>
            </div>
        </div>
    `;
}

// Helper functions for grades
function calculateAverageGrade() {
    const grades = getData('GRADES');
    if (grades.length === 0) return 'N/A';
    
    const total = grades.reduce((sum, grade) => sum + grade.total, 0);
    return (total / grades.length).toFixed(1);
}

function countGradesByLetter(letter) {
    const grades = getData('GRADES');
    return grades.filter(grade => grade.grade.startsWith(letter)).length;
}

function countGradesBelow(letter) {
    const grades = getData('GRADES');
    const letterOrder = ['A', 'B', 'C', 'D', 'F'];
    const thresholdIndex = letterOrder.indexOf(letter);
    
    return grades.filter(grade => {
        const gradeLetter = grade.grade.charAt(0);
        const gradeIndex = letterOrder.indexOf(gradeLetter);
        return gradeIndex > thresholdIndex;
    }).length;
}

// ====== SETTINGS PAGE ======
function loadSettingsPage() {
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = `
        <div class="page-header">
            <h2><i class="fas fa-cog"></i> System Settings</h2>
        </div>
        
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-database"></i> Data Management</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="backupData()">
                            <i class="fas fa-save"></i> Backup Data
                        </a>
                    </li>
                    <li>
                        <a onclick="restoreData()">
                            <i class="fas fa-undo"></i> Restore Data
                        </a>
                    </li>
                    <li>
                        <a onclick="exportAllData()">
                            <i class="fas fa-download"></i> Export All Data
                        </a>
                    </li>
                    <li>
                        <a onclick="resetData()" style="color: #e74c3c;">
                            <i class="fas fa-trash"></i> Reset All Data
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="dashboard-card">
                <h3><i class="fas fa-user-shield"></i> Security</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="changePassword()">
                            <i class="fas fa-key"></i> Change Password
                        </a>
                    </li>
                    <li>
                        <a onclick="manageUsers()">
                            <i class="fas fa-users-cog"></i> Manage Users
                        </a>
                    </li>
                    <li>
                        <a onclick="auditLogs()">
                            <i class="fas fa-clipboard-list"></i> View Audit Logs
                        </a>
                    </li>
                    <li>
                        <a onclick="sessionSettings()">
                            <i class="fas fa-clock"></i> Session Settings
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="dashboard-card">
                <h3><i class="fas fa-bell"></i> Notifications</h3>
                <ul class="card-links">
                    <li>
                        <a onclick="emailSettings()">
                            <i class="fas fa-envelope"></i> Email Settings
                        </a>
                    </li>
                    <li>
                        <a onclick="notificationPreferences()">
                            <i class="fas fa-bell"></i> Notification Preferences
                        </a>
                    </li>
                    <li>
                        <a onclick="alertSettings()">
                            <i class="fas fa-exclamation-triangle"></i> Alert Settings
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-line"></i> System Info</h3>
                <div style="padding: 15px;">
                    <div style="margin-bottom: 10px;">
                        <strong>Version:</strong> EduAdmin v2.1.0
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>Last Backup:</strong> ${new Date().toLocaleDateString()}
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>Storage Used:</strong> ${calculateStorageUsage()}
                    </div>
                    <div>
                        <strong>Users Online:</strong> 1
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">System Configuration</h3>
            <div class="form-container">
                <div class="form-group">
                    <label>System Name</label>
                    <input type="text" class="form-control" value="EduAdmin" placeholder="Enter system name">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Academic Year</label>
                        <select class="form-control">
                            <option>2024-2025</option>
                            <option>2023-2024</option>
                            <option>2022-2023</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Semester</label>
                        <select class="form-control">
                            <option>Spring 2024</option>
                            <option>Fall 2023</option>
                            <option>Summer 2023</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Default Time Zone</label>
                    <select class="form-control">
                        <option>UTC-5 (EST)</option>
                        <option>UTC-8 (PST)</option>
                        <option>UTC+0 (GMT)</option>
                    </select>
                </div>
                <button class="btn" style="margin-top: 20px;">
                    <i class="fas fa-save"></i> Save Settings
                </button>
            </div>
        </div>
    `;
}

function calculateStorageUsage() {
    let total = 0;
    Object.keys(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(STORAGE_KEYS[key]);
        if (data) {
            total += data.length * 2; // Approximate bytes
        }
    });
    
    if (total < 1024) {
        return total + ' bytes';
    } else if (total < 1024 * 1024) {
        return (total / 1024).toFixed(2) + ' KB';
    } else {
        return (total / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

// ====== ENHANCED MODAL FUNCTIONS ======
function openAddStudentModal() {
    document.getElementById('modalTitle').textContent = 'Add New Student';
    document.getElementById('modalBody').innerHTML = `
        <form id="addStudentForm" onsubmit="event.preventDefault(); saveNewStudent()">
            <div class="form-row">
                <div class="form-group">
                    <label for="studentId">Student ID *</label>
                    <input type="text" id="studentId" class="form-control" required pattern="ST[0-9]{3}" title="Format: ST followed by 3 digits (e.g., ST001)">
                </div>
                <div class="form-group">
                    <label for="studentName">Full Name *</label>
                    <input type="text" id="studentName" class="form-control" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="studentEmail">Email *</label>
                    <input type="email" id="studentEmail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="studentPhone">Phone</label>
                    <input type="tel" id="studentPhone" class="form-control" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="555-123-4567">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="studentCourse">Course *</label>
                    <select id="studentCourse" class="form-control" required>
                        <option value="">Select Course</option>
                        ${getData('COURSES').map(course => `
                            <option value="${course.code}">${course.name} (${course.code})</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="studentStatus">Status</label>
                    <select id="studentStatus" class="form-control">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="enrollmentDate">Enrollment Date</label>
                    <input type="date" id="enrollmentDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="studentGPA">Initial GPA</label>
                    <input type="number" id="studentGPA" class="form-control" min="0" max="4" step="0.1" placeholder="0.0 - 4.0">
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="submit" class="btn" style="flex: 1;">
                    <i class="fas fa-save"></i> Save Student
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    document.getElementById('modal').style.display = 'block';
}

function saveNewStudent() {
    const student = {
        id: document.getElementById('studentId').value,
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value || '',
        course: document.getElementById('studentCourse').value,
        status: document.getElementById('studentStatus').value,
        enrollmentDate: document.getElementById('enrollmentDate').value || new Date().toISOString().split('T')[0],
        gpa: parseFloat(document.getElementById('studentGPA').value) || 0
    };
    
    addStudent(student);
    showToast('Student added successfully!');
    closeModal();
    loadPage('students'); // Refresh the page
}

function openAddCourseModal() {
    document.getElementById('modalTitle').textContent = 'Add New Course';
    document.getElementById('modalBody').innerHTML = getAddCourseForm();
    document.getElementById('modal').style.display = 'block';
}

function saveNewCourse() {
    const course = {
        code: document.getElementById('courseCode').value,
        name: document.getElementById('courseName').value,
        instructor: document.getElementById('courseInstructor').value,
        credits: parseInt(document.getElementById('courseCredits').value),
        students: 0,
        capacity: parseInt(document.getElementById('courseCapacity').value) || 40,
        description: document.getElementById('courseDescription').value || '',
        status: 'active'
    };
    
    addCourse(course);
    showToast('Course added successfully!');
    closeModal();
    loadPage('courses'); // Refresh the page
}

function openAnnouncementModal() {
    document.getElementById('modalTitle').textContent = 'Create Announcement';
    document.getElementById('modalBody').innerHTML = `
        <form id="announcementForm" onsubmit="event.preventDefault(); saveAnnouncement()">
            <div class="form-group">
                <label for="announcementTitle">Title *</label>
                <input type="text" id="announcementTitle" class="form-control" required maxlength="100">
            </div>
            
            <div class="form-group">
                <label for="announcementContent">Content *</label>
                <textarea id="announcementContent" class="form-control" rows="6" required maxlength="1000"></textarea>
                <small style="color: #7f8c8d;">Maximum 1000 characters</small>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="announcementType">Type</label>
                    <select id="announcementType" class="form-control">
                        <option value="general">General</option>
                        <option value="academic">Academic</option>
                        <option value="event">Event</option>
                        <option value="emergency">Emergency</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="announcementPriority">Priority</label>
                    <select id="announcementPriority" class="form-control">
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="announcementSchedule">Schedule Date (Optional)</label>
                    <input type="datetime-local" id="announcementSchedule" class="form-control">
                </div>
                <div class="form-group">
                    <label for="announcementExpiry">Expiry Date (Optional)</label>
                    <input type="date" id="announcementExpiry" class="form-control">
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="submit" class="btn" style="flex: 2;">
                    <i class="fas fa-paper-plane"></i> Publish Now
                </button>
                <button type="button" class="btn btn-secondary" onclick="scheduleAnnouncement()" style="flex: 1;">
                    <i class="fas fa-clock"></i> Schedule
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
    document.getElementById('modal').style.display = 'block';
}

function saveAnnouncement() {
    const announcement = {
        title: document.getElementById('announcementTitle').value,
        content: document.getElementById('announcementContent').value,
        type: document.getElementById('announcementType').value,
        priority: document.getElementById('announcementPriority').value,
        schedule: document.getElementById('announcementSchedule').value || null,
        expiry: document.getElementById('announcementExpiry').value || null
    };
    
    addAnnouncement(announcement);
    showToast('Announcement published successfully!');
    closeModal();
    loadPage('announcements'); // Refresh the page
}

function getAddCourseForm() {
    return `
        <form id="addCourseForm" onsubmit="event.preventDefault(); saveNewCourse()">
            <div class="form-row">
                <div class="form-group">
                    <label for="courseCode">Course Code *</label>
                    <input type="text" id="courseCode" class="form-control" required pattern="[A-Z]{2,4}[0-9]{3}" title="Format: 2-4 letters followed by 3 digits (e.g., CS101)">
                </div>
                <div class="form-group">
                    <label for="courseName">Course Name *</label>
                    <input type="text" id="courseName" class="form-control" required maxlength="100">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="courseCredits">Credits *</label>
                    <input type="number" id="courseCredits" class="form-control" min="1" max="6" required>
                </div>
                <div class="form-group">
                    <label for="courseInstructor">Instructor *</label>
                    <input type="text" id="courseInstructor" class="form-control" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="courseDescription">Description</label>
                <textarea id="courseDescription" class="form-control" rows="4" maxlength="500"></textarea>
                <small style="color: #7f8c8d;">Maximum 500 characters</small>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="courseCapacity">Maximum Capacity *</label>
                    <input type="number" id="courseCapacity" class="form-control" min="1" max="200" value="40" required>
                </div>
                <div class="form-group">
                    <label for="courseDepartment">Department</label>
                    <select id="courseDepartment" class="form-control">
                        <option value="computer_science">Computer Science</option>
                        <option value="business">Business</option>
                        <option value="engineering">Engineering</option>
                        <option value="arts">Arts & Humanities</option>
                        <option value="sciences">Natural Sciences</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="courseStartDate">Start Date</label>
                    <input type="date" id="courseStartDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="courseEndDate">End Date</label>
                    <input type="date" id="courseEndDate" class="form-control">
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button type="submit" class="btn" style="flex: 1;">
                    <i class="fas fa-save"></i> Save Course
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    `;
}

// ====== ENHANCED UTILITY FUNCTIONS ======
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Set message and color based on type
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toast.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#e74c3c';
    } else if (type === 'warning') {
        toast.style.backgroundColor = '#f39c12';
    } else if (type === 'info') {
        toast.style.backgroundColor = '#3498db';
    }
    
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function logout() {
    showToast('Logging out...', 'info');
    setTimeout(() => {
        // In a real app, you would clear session and redirect to login
        window.location.href = 'login.html';
    }, 1500);
}

// ====== NEW DATA MANAGEMENT FUNCTIONS ======
function backupData() {
    const backup = {};
    Object.keys(STORAGE_KEYS).forEach(key => {
        backup[key] = getData(key);
    });
    
    const backupStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduadmin_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Backup created and downloaded successfully!');
}

function exportAllData() {
    const exportData = {
        students: getData('STUDENTS'),
        courses: getData('COURSES'),
        grades: getData('GRADES'),
        attendance: getData('ATTENDANCE'),
        announcements: getData('ANNOUNCEMENTS'),
        exportedAt: new Date().toISOString()
    };
    
    const exportStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([exportStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduadmin_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('All data exported successfully!');
}

function resetData() {
    if (confirm('⚠️ WARNING: This will reset ALL data to initial values. This action cannot be undone. Are you sure?')) {
        Object.keys(STORAGE_KEYS).forEach(key => {
            const dataKey = key.toLowerCase().slice(0, -1);
            localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(INITIAL_DATA[dataKey] || []));
        });
        showToast('Data has been reset to initial values.', 'warning');
        loadPage('dashboard');
    }
}

function refreshAnalytics() {
    loadPage('analytics');
    showToast('Analytics refreshed!', 'info');
}

function exportAnalytics() {
    const stats = calculateStats();
    const analyticsData = {
        summary: stats,
        generatedAt: new Date().toISOString(),
        dataPoints: {
            totalStudents: getData('STUDENTS').length,
            totalCourses: getData('COURSES').length,
            totalGrades: getData('GRADES').length
        }
    };
    
    const exportStr = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([exportStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Analytics report exported successfully!');
}

// ====== ENHANCED PLACEHOLDER FUNCTIONS ======
function generateReport(type) {
    const reports = {
        student: 'Student Performance Report',
        course: 'Course Analytics Report',
        attendance: 'Attendance Summary Report',
        financial: 'Financial Statement Report',
        system: 'System Health Report',
        comprehensive: 'Comprehensive Academic Report'
    };
    
    showToast(`${reports[type] || 'Report'} generated successfully! Download will start shortly...`);
    
    // Simulate download
    setTimeout(() => {
        const reportData = `EduAdmin ${reports[type] || 'Report'}\nGenerated: ${new Date().toLocaleString()}\n\nSummary:\n- Total Students: ${calculateStats().totalStudents}\n- Average GPA: ${calculateStats().averageGPA}\n- Attendance Rate: ${calculateStats().attendanceRate}`;
        const blob = new Blob([reportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reports[type] || 'report'}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1000);
}

function sendBulkEmail() {
    const students = getData('STUDENTS');
    showToast(`Bulk email sent to ${students.length} students!`);
}

function uploadGrades() {
    showToast('Grade upload interface opened!', 'info');
    // This would open a file upload modal in a real implementation
}

function markAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const students = getData('STUDENTS');
    
    // Mark all active students as present for today
    const newAttendance = students
        .filter(s => s.status === 'active')
        .map(student => ({
            studentId: student.id,
            date: today,
            status: 'present'
        }));
    
    const existingAttendance = getData('ATTENDANCE');
    const updatedAttendance = [
        ...existingAttendance.filter(a => a.date !== today),
        ...newAttendance
    ];
    
    saveData('ATTENDANCE', updatedAttendance);
    showToast(`Attendance marked for ${newAttendance.length} students today!`);
    loadPage('dashboard'); // Refresh dashboard to show updated stats
}

function scheduleAnnouncement() {
    showToast('Announcement scheduled successfully!', 'info');
}

function sendEmailBlast() {
    showToast('Email blast sent to all recipients!');
}

function generateStudentReport() {
    generateReport('student');
}

function generateCourseReport() {
    generateReport('course');
}

function generateAttendanceReport() {
    generateReport('attendance');
}

function generateFinancialReport() {
    generateReport('financial');
}

function assignInstructors() {
    showToast('Instructor assignment interface opened!', 'info');
}

function calculateGPA() {
    // Calculate GPA for all students based on grades
    const grades = getData('GRADES');
    const students = getData('STUDENTS');
    
    const gpaMap = {};
    grades.forEach(grade => {
        if (!gpaMap[grade.studentId]) {
            gpaMap[grade.studentId] = { total: 0, count: 0 };
        }
        gpaMap[grade.studentId].total += grade.total;
        gpaMap[grade.studentId].count++;
    });
    
    students.forEach((student, index) => {
        if (gpaMap[student.id]) {
            const avg = gpaMap[student.id].total / gpaMap[student.id].count;
            students[index].gpa = (avg / 25).toFixed(2); // Convert to 4.0 scale
        }
    });
    
    saveData('STUDENTS', students);
    showToast('GPAs calculated and updated for all students!');
    loadPage('dashboard'); // Refresh to show updated GPA
}

function sendAbsenceAlerts() {
    const today = new Date().toISOString().split('T')[0];
    const attendance = getData('ATTENDANCE').filter(a => a.date === today && a.status !== 'present');
    showToast(`Absence alerts sent to ${attendance.length} students/parents!`);
}

function viewStudent(studentId) {
    const student = getData('STUDENTS').find(s => s.id === studentId);
    if (student) {
        document.getElementById('modalTitle').textContent = `Student: ${student.name}`;
        document.getElementById('modalBody').innerHTML = `
            <div style="padding: 20px;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: #3498db; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                        ${student.name.charAt(0)}
                    </div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #2c3e50;">${student.name}</h3>
                        <p style="margin: 0; color: #7f8c8d;">${student.id} • ${student.email}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
                    <div>
                        <h4 style="color: #7f8c8d; margin-bottom: 8px;">Contact</h4>
                        <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> ${student.email}</p>
                    </div>
                    <div>
                        <h4 style="color: #7f8c8d; margin-bottom: 8px;">Academic</h4>
                        <p><strong>Course:</strong> ${student.course}</p>
                        <p><strong>GPA:</strong> ${student.gpa || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 style="color: #7f8c8d; margin-bottom: 8px;">Status</h4>
                        <p><strong>Enrollment:</strong> ${student.enrollmentDate || 'N/A'}</p>
                        <p><strong>Status:</strong> <span class="status-${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span></p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i> Edit Student
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()" style="margin-left: 10px;">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        document.getElementById('modal').style.display = 'block';
    } else {
        showToast('Student not found!', 'error');
    }
}

function editStudent(studentId) {
    showToast(`Edit student ${studentId} - Feature in development`, 'info');
}

function deleteStudent(studentId) {
    if (confirm(`Are you sure you want to delete student ${studentId}? This action cannot be undone.`)) {
        const students = getData('STUDENTS').filter(s => s.id !== studentId);
        saveData('STUDENTS', students);
        showToast(`Student ${studentId} deleted successfully!`, 'warning');
        loadPage('students');
    }
}

function viewCourse(courseCode) {
    const course = getData('COURSES').find(c => c.code === courseCode);
    if (course) {
        document.getElementById('modalTitle').textContent = `Course: ${course.name}`;
        document.getElementById('modalBody').innerHTML = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 5px 0; color: #2c3e50;">${course.name}</h3>
                    <p style="margin: 0; color: #7f8c8d;">${course.code} • ${course.credits} credits</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
                    <div>
                        <h4 style="color: #7f8c8d; margin-bottom: 8px;">Instructor</h4>
                        <p><strong>Name:</strong> ${course.instructor}</p>
                    </div>
                    <div>
                        <h4 style="color: #7f8c8d; margin-bottom: 8px;">Enrollment</h4>
                        <p><strong>Students:</strong> ${course.students}/${course.capacity}</p>
                        <div style="background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 5px;">
                            <div style="width: ${(course.students / course.capacity) * 100}%; background: ${(course.students / course.capacity) > 0.9 ? '#e74c3c' : '#2ecc71'}; height: 100%;"></div>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #7f8c8d; margin-bottom: 8px;">Details</h4>
                        <p><strong>Status:</strong> <span class="status-${course.status}">${course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span></p>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h4 style="color: #7f8c8d; margin-bottom: 8px;">Description</h4>
                    <p style="color: #666; line-height: 1.6;">${course.description || 'No description available.'}</p>
                </div>
                
                <div style="text-align: center;">
                    <button class="btn" onclick="editCourse('${course.code}')">
                        <i class="fas fa-edit"></i> Edit Course
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()" style="margin-left: 10px;">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        document.getElementById('modal').style.display = 'block';
    } else {
        showToast('Course not found!', 'error');
    }
}

function editCourse(courseCode) {
    showToast(`Edit course ${courseCode} - Feature in development`, 'info');
}

function deleteCourse(courseCode) {
    if (confirm(`Are you sure you want to delete course ${courseCode}? All related grades will also be deleted.`)) {
        // Delete course
        const courses = getData('COURSES').filter(c => c.code !== courseCode);
        saveData('COURSES', courses);
        
        // Delete related grades
        const grades = getData('GRADES').filter(g => g.courseCode !== courseCode);
        saveData('GRADES', grades);
        
        showToast(`Course ${courseCode} and related data deleted successfully!`, 'warning');
        loadPage('courses');
    }
}

function editGrade(studentId, courseCode) {
    showToast(`Edit grade for ${studentId} in ${courseCode} - Feature in development`, 'info');
}

function deleteGrade(studentId, courseCode) {
    if (confirm(`Are you sure you want to delete grade for ${studentId} in ${courseCode}?`)) {
        const grades = getData('GRADES').filter(g => !(g.studentId === studentId && g.courseCode === courseCode));
        saveData('GRADES', grades);
        showToast(`Grade deleted successfully!`, 'warning');
        loadPage('grades');
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Update sidebar to include Analytics
document.addEventListener('DOMContentLoaded', function() {
    // Add Analytics to main menu
    const mainMenu = document.getElementById('mainMenu');
    if (mainMenu) {
        const analyticsItem = document.createElement('li');
        analyticsItem.innerHTML = '<a data-page="analytics"><i class="fas fa-chart-bar"></i> Analytics</a>';
        mainMenu.appendChild(analyticsItem);
        
        // Add Settings to main menu
        const settingsItem = document.createElement('li');
        settingsItem.innerHTML = '<a data-page="settings"><i class="fas fa-cog"></i> Settings</a>';
        mainMenu.appendChild(settingsItem);
    }
    
    // Re-attach event listeners after adding new items
    const menuItems = document.querySelectorAll('.menu-links a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
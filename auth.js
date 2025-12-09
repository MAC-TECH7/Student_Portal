// auth.js - Simple authentication
export async function loginUser(email, password) {
    console.log("Login attempt:", email);
    
    // Hardcoded users
    const users = {
        'student@school.com': { 
            password: 'password123', 
            role: 'student', 
            name: 'Demo Student',
            studentId: 'STU2024001',
            program: 'Computer Science',
            year: '2nd Year'
        },
        'admin@school.com': { 
            password: 'admin123', 
            role: 'admin', 
            name: 'Administrator'
        }
    };
    
    const user = users[email];
    if (user && user.password === password) {
        // Save user to localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: user.name,
            role: user.role,
            ...(user.studentId && { studentId: user.studentId }),
            ...(user.program && { program: user.program }),
            ...(user.year && { year: user.year }),
            loggedIn: true
        }));
        
        console.log("Login successful:", user.role);
        return { success: true, role: user.role, userData: user };
    }
    
    return { success: false, message: 'Invalid email or password' };
}

export function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

export function logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    return Promise.resolve();
}
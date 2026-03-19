/**
 * FLEXCREDI - Authentication System
 * Handles login, logout, and session management
 */

// Wait for API_CONFIG to be loaded (if api-config.js is loaded first)
// Otherwise use fallback
function getAPIBaseURL() {
    if (window.API_CONFIG && window.API_CONFIG.baseURL) {
        return window.API_CONFIG.baseURL;
    }
    // Fallback if api-config.js not loaded
    return window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : 'https://flexcredi.com/api';
}

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    // Only check auth if we're on the login page
    if (window.location.pathname.includes('/login.html')) {
        checkExistingAuth();
    }
});

/**
 * Check if user has existing valid session
 */
async function checkExistingAuth() {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
        try {
            const API_BASE_URL = getAPIBaseURL();
            const response = await fetch(`${API_BASE_URL}/admin/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Token is valid, redirect to dashboard
                console.log('✅ Valid session found, redirecting to dashboard...');
                window.location.href = '/admin-panel/admin/admin-dashboard-v2.html';
            } else {
                // Token is invalid, clear it
                console.log('❌ Invalid token, clearing session');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            // On error, just clear the token to be safe
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        }
    }
}

/**
 * Handle login form submission
 */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // UI elements
        const btnLogin = document.getElementById('btnLogin');
        const alertError = document.getElementById('alertError');
        const alertSuccess = document.getElementById('alertSuccess');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // Hide previous alerts
        alertError.classList.remove('show');
        alertSuccess.classList.remove('show');
        
        // Validate inputs
        if (!email || !password) {
            errorMessage.textContent = 'Please fill in all fields';
            alertError.classList.add('show');
            return;
        }
        
        // Disable button and show loading
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<span class="spinner"></span> Signing in...';
        
        try {
            // Attempt login
            const API_BASE_URL = getAPIBaseURL();
            const response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.token) {
                // Success!
                console.log('✅ Login successful');
                
                // Store token and user info
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                
                // Show success message
                successMessage.textContent = 'Login successful! Redirecting...';
                alertSuccess.classList.add('show');
                
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    window.location.href = '/admin-panel/admin/admin-dashboard-v2.html';
                }, 1000);
                
            } else {
                // Login failed
                console.error('❌ Login failed:', data.message);
                errorMessage.textContent = data.message || 'Invalid email or password';
                alertError.classList.add('show');
                
                // Re-enable button
                btnLogin.disabled = false;
                btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
            
        } catch (error) {
            console.error('❌ Login error:', error);
            
            // FALLBACK: Allow local development login
            if (email === 'admin@flexcredi.com' && password === 'FlexCredi2024!') {
                console.warn('⚠️ Using local development mode - API not available');
                
                // Create mock user and token
                const mockUser = {
                    id: 'dev-admin',
                    email: email,
                    name: 'Admin Dev',
                    role: 'ADMIN'
                };
                const mockToken = 'dev-token-' + Date.now();
                
                // Store in localStorage
                localStorage.setItem('adminToken', mockToken);
                localStorage.setItem('adminUser', JSON.stringify(mockUser));
                
                // Show success
                successMessage.textContent = 'Login successful (Dev Mode)! Redirecting...';
                alertSuccess.classList.add('show');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/admin-panel/admin/admin-dashboard-v2.html';
                }, 1000);
                return;
            }
            
            errorMessage.textContent = 'Connection error. Please try again.';
            alertError.classList.add('show');
            
            // Re-enable button
            btnLogin.disabled = false;
            btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        }
    });
}

/**
 * Logout function (can be called from dashboard)
 */
function logout() {
    console.log('🔓 Logging out...');
    
    // Clear all auth data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = '/admin-panel/admin/login.html';
}

/**
 * Get current user info
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('adminToken');
}

/**
 * Protect dashboard pages - redirect to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated() && !window.location.pathname.includes('/login.html')) {
        console.log('⚠️ Not authenticated, redirecting to login');
        window.location.href = '/admin-panel/admin/login.html';
        return false;
    }
    return true;
}

// Export functions for use in other scripts
window.authSystem = {
    logout,
    getCurrentUser,
    isAuthenticated,
    requireAuth
};

console.log('✅ Auth system initialized');

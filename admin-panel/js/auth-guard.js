/**
 * FLEXCREDI - Admin Authentication Guard
 * Protect admin pages and handle authentication
 */

(function() {
    'use strict';

    // Configuration
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001'
        : 'https://flexcredi-site-adm-production-b27d.up.railway.app';

    const LOGIN_PAGE = '/admin/login.html';
    const DASHBOARD_PAGE = '/admin/';

    // Public pages (don't require authentication)
    const PUBLIC_PAGES = [
        '/admin/login.html',
        '/apply.html',
        '/index.html',
        '/'
    ];

    /**
     * Check if current page is public
     */
    function isPublicPage() {
        const currentPath = window.location.pathname;
        return PUBLIC_PAGES.some(page => currentPath.endsWith(page) || currentPath === page);
    }

    /**
     * Get stored auth token
     */
    function getToken() {
        return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    }

    /**
     * Get stored user data
     */
    function getUser() {
        const userStr = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Save auth data
     */
    function saveAuth(token, user, remember = false) {
        if (remember) {
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('admin_token', token);
            sessionStorage.setItem('admin_user', JSON.stringify(user));
        }
    }

    /**
     * Clear auth data
     */
    function clearAuth() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_user');
    }

    /**
     * Verify token with backend
     */
    async function verifyToken(token) {
        try {
            const response = await fetch(`${API_URL}/api/admin/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            return response.ok && data.success;
        } catch (error) {
            console.error('[Auth Guard] Token verification error:', error);
            return false;
        }
    }

    /**
     * Redirect to login page
     */
    function redirectToLogin() {
        if (!window.location.pathname.endsWith(LOGIN_PAGE)) {
            console.log('[Auth Guard] Redirecting to login page...');
            window.location.href = LOGIN_PAGE;
        }
    }

    /**
     * Redirect to dashboard
     */
    function redirectToDashboard() {
        if (window.location.pathname.endsWith(LOGIN_PAGE)) {
            console.log('[Auth Guard] Redirecting to dashboard...');
            window.location.href = DASHBOARD_PAGE;
        }
    }

    /**
     * Initialize authentication guard
     */
    async function initAuthGuard() {
        // Skip if on public page
        if (isPublicPage()) {
            console.log('[Auth Guard] Public page, skipping auth check');
            return;
        }

        console.log('[Auth Guard] Checking authentication...');

        const token = getToken();
        const user = getUser();

        // No token = redirect to login
        if (!token) {
            console.log('[Auth Guard] No token found');
            redirectToLogin();
            return;
        }

        // Verify token with backend
        const isValid = await verifyToken(token);

        if (!isValid) {
            console.log('[Auth Guard] Invalid token');
            clearAuth();
            redirectToLogin();
            return;
        }

        console.log('[Auth Guard] Authentication successful');

        // Update UI with user info (if elements exist)
        updateUserInfo(user);
    }

    /**
     * Update UI with user information
     */
    function updateUserInfo(user) {
        if (!user) return;

        // Update user name displays
        const userNameElements = document.querySelectorAll('.user-name, #userName');
        userNameElements.forEach(el => {
            el.textContent = user.name || 'Admin';
        });

        // Update user avatar
        const userAvatarElements = document.querySelectorAll('.user-avatar, #userAvatar');
        userAvatarElements.forEach(el => {
            el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Admin')}&background=2ECC71&color=fff`;
        });

        // Update user greeting
        const greetingElements = document.querySelectorAll('.user-greeting, #userGreeting');
        greetingElements.forEach(el => {
            el.textContent = `Bem-vindo, ${user.name || 'Admin'}!`;
        });
    }

    /**
     * Handle logout
     */
    async function handleLogout() {
        try {
            const token = getToken();
            
            if (token) {
                // Call logout endpoint
                await fetch(`${API_URL}/api/admin/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('[Auth Guard] Logout error:', error);
        } finally {
            // Clear auth data
            clearAuth();
            
            // Redirect to login
            window.location.href = LOGIN_PAGE;
        }
    }

    /**
     * Setup logout buttons
     */
    function setupLogoutButtons() {
        const logoutButtons = document.querySelectorAll('.logout-btn, [data-logout]');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (confirm('Tem certeza que deseja sair?')) {
                    handleLogout();
                }
            });
        });
    }

    /**
     * Make authenticated API request
     */
    async function authenticatedFetch(url, options = {}) {
        const token = getToken();
        
        if (!token) {
            throw new Error('No authentication token');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        // If unauthorized, redirect to login
        if (response.status === 401) {
            console.log('[Auth Guard] Unauthorized request, redirecting to login');
            clearAuth();
            redirectToLogin();
            throw new Error('Unauthorized');
        }

        return response;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAuthGuard();
            setupLogoutButtons();
        });
    } else {
        initAuthGuard();
        setupLogoutButtons();
    }

    // Expose functions globally
    window.FlexCrediAuth = {
        getToken,
        getUser,
        saveAuth,
        clearAuth,
        logout: handleLogout,
        authenticatedFetch
    };

})();

// FLEXCREDI API CLIENT - Frontend Integration
// Connects frontend forms to backend API and Supabase

class FlexCrediAPI {
    constructor() {
        // Use Railway backend URL in production, localhost in development
        this.baseURL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001'
            : 'https://flexcredi-site-adm-production-b27d.up.railway.app';
        
        console.log('[FlexCredi API] Initialized with base URL:', this.baseURL);
    }

    // Helper method to make API calls
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        try {
            console.log(`[FlexCredi API] ${options.method || 'GET'} ${url}`);
            
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'API request failed');
            }

            console.log('[FlexCredi API] Response:', data);
            return data;
        } catch (error) {
            console.error('[FlexCredi API] Error:', error);
            throw error;
        }
    }

    // ============ PUBLIC ENDPOINTS (No auth required) ============

    /**
     * Submit a new credit application from public website
     * @param {Object} applicationData - Application form data
     * @returns {Promise<Object>} Created application with ID
     */
    async submitApplication(applicationData) {
        return this.request('/api/public/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    }

    /**
     * Get list of approved partners for the application form
     * @returns {Promise<Array>} List of partners
     */
    async getPartners() {
        return this.request('/api/public/partners');
    }

    /**
     * Check application status by ID (for tracking)
     * @param {string} applicationId - Application UUID
     * @returns {Promise<Object>} Application status
     */
    async checkApplicationStatus(applicationId) {
        return this.request(`/api/public/applications/${applicationId}/status`);
    }

    // ============ ADMIN ENDPOINTS (Require authentication) ============

    /**
     * Get dashboard statistics
     * @returns {Promise<Object>} Dashboard metrics
     */
    async getDashboard() {
        return this.request('/api/admin/dashboard');
    }

    /**
     * Get all applications with filters
     * @param {Object} filters - Search, status, sort options
     * @returns {Promise<Object>} List of applications
     */
    async getApplications(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`/api/admin/applications?${queryParams}`);
    }

    /**
     * Get single application details
     * @param {string} id - Application ID
     * @returns {Promise<Object>} Application details
     */
    async getApplication(id) {
        return this.request(`/api/admin/applications/${id}`);
    }

    /**
     * Update application status (approve/reject)
     * @param {string} id - Application ID
     * @param {string} status - New status (APPROVED, REJECTED, etc)
     * @param {string} notes - Optional notes
     * @returns {Promise<Object>} Updated application
     */
    async updateApplicationStatus(id, status, notes = '') {
        return this.request(`/api/admin/applications/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes })
        });
    }

    /**
     * Get all clients
     * @returns {Promise<Object>} List of clients
     */
    async getClients() {
        return this.request('/api/admin/clients');
    }

    /**
     * Get single client details
     * @param {string} id - Client ID
     * @returns {Promise<Object>} Client details
     */
    async getClient(id) {
        return this.request(`/api/admin/clients/${id}`);
    }

    // ============ HELPER METHODS ============

    /**
     * Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency (e.g., "$10,000.00")
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    /**
     * Format date for display
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date (e.g., "02/22/2026")
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US');
    }

    /**
     * Format date and time for display
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted datetime (e.g., "02/22/2026 10:30 AM")
     */
    formatDateTime(date) {
        return new Date(date).toLocaleString('en-US');
    }

    /**
     * Get status badge HTML
     * @param {string} status - Application status
     * @returns {string} HTML for status badge
     */
    getStatusBadge(status) {
        const badges = {
            'PENDING': '<span class="badge badge-warning">Pending</span>',
            'APPROVED': '<span class="badge badge-success">Approved</span>',
            'REJECTED': '<span class="badge badge-danger">Rejected</span>',
            'UNDER_REVIEW': '<span class="badge badge-info">Under Review</span>'
        };
        return badges[status] || '<span class="badge badge-secondary">Unknown</span>';
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: success, error, info, warning
     */
    showToast(message, type = 'info') {
        // Check if Bootstrap toast is available
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            // Use Bootstrap Toast
            const toastEl = document.querySelector('.toast');
            if (toastEl) {
                toastEl.querySelector('.toast-body').textContent = message;
                toastEl.classList.add(`bg-${type}`);
                const toast = new bootstrap.Toast(toastEl);
                toast.show();
            }
        } else {
            // Fallback to alert
            alert(message);
        }
    }
}

// Create global instance
const FlexCrediAPI = new FlexCrediAPI();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlexCrediAPI;
}

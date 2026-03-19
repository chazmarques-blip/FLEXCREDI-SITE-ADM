/**
 * FLEXCREDI - API Configuration
 * Centralized API configuration for all admin panel pages
 */

// Detect environment and set API base URL
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://flexcredi-site-adm-production-b27d.up.railway.app';

// Export configuration
window.API_CONFIG = {
    baseURL: API_BASE_URL,
    endpoints: {
        // Auth endpoints
        login: '/admin/login',
        verify: '/admin/verify',
        logout: '/admin/logout',
        
        // Application endpoints
        applications: '/applications',
        applicationById: (id) => `/applications/${id}`,
        
        // Client endpoints
        clients: '/clients',
        clientById: (id) => `/clients/${id}`,
        
        // Partner endpoints
        partners: '/partners',
        partnerById: (id) => `/partners/${id}`,
        
        // Document endpoints
        documents: '/documents',
        documentById: (id) => `/documents/${id}`,
        
        // Contract endpoints
        contracts: '/contracts',
        contractById: (id) => `/contracts/${id}`,
        
        // Payment endpoints
        payments: '/payments',
        paymentById: (id) => `/payments/${id}`,
        
        // Agent endpoints
        agents: '/agents',
        agentById: (id) => `/agents/${id}`
    },
    
    // Helper function to build full URL
    getFullURL: function(endpoint) {
        return this.baseURL + endpoint;
    },
    
    // Helper function to get auth headers
    getAuthHeaders: function() {
        const token = localStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },
    
    // Helper function to make authenticated requests
    fetchWithAuth: async function(endpoint, options = {}) {
        const url = this.getFullURL(endpoint);
        const headers = {
            ...this.getAuthHeaders(),
            ...(options.headers || {})
        };
        
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            // Handle unauthorized
            if (response.status === 401) {
                console.warn('⚠️ Unauthorized - redirecting to login');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin-panel/admin/login.html';
                return null;
            }
            
            return response;
        } catch (error) {
            console.error('❌ API request failed:', error);
            throw error;
        }
    }
};

console.log('✅ API Config loaded:', API_BASE_URL);

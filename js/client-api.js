/**
 * FLEXCREDI - Client API Service
 * Connects client frontend to the real backend API
 * Fallback to localStorage for demo mode
 */

const ClientAPI = {
  // API Base URL - Railway production backend
  baseURL: 'https://flexcredi-site-adm-production-b27d.up.railway.app',
  
  // Flag to enable/disable API mode (set to false to use localStorage demo mode)
  useRealAPI: true,
  
  // Current user token
  token: null,
  
  /**
   * Initialize API client
   */
  init() {
    this.token = localStorage.getItem('flexcredi_token');
    console.log('[ClientAPI] Initialized with baseURL:', this.baseURL);
    console.log('[ClientAPI] Mode:', this.useRealAPI ? 'PRODUCTION API' : 'DEMO (localStorage)');
  },
  
  /**
   * Make API request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>} - Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }
    
    try {
      console.log(`[ClientAPI] ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }
      
      console.log('[ClientAPI] Response:', data);
      return data;
      
    } catch (error) {
      console.error('[ClientAPI] Error:', error);
      throw error;
    }
  },
  
  // ============ AUTHENTICATION ============
  
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User data and token
   */
  async login(email, password) {
    try {
      const data = await this.request('/api/client/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (data.token) {
        this.token = data.token;
        localStorage.setItem('flexcredi_token', data.token);
        localStorage.setItem('flexcredi_user', JSON.stringify(data.user));
        localStorage.setItem('flexcredi_logged_in', 'true');
      }
      
      return data;
      
    } catch (error) {
      // Fallback to demo mode if API fails
      console.warn('[ClientAPI] API login failed, falling back to demo mode:', error.message);
      return this.demoLogin(email, password);
    }
  },
  
  /**
   * Register new user
   * @param {object} userData - Registration data
   * @returns {Promise<object>} - Created user
   */
  async register(userData) {
    try {
      const data = await this.request('/api/client/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      return data;
      
    } catch (error) {
      console.warn('[ClientAPI] API register failed, falling back to demo mode:', error.message);
      return this.demoRegister(userData);
    }
  },
  
  /**
   * Logout user
   */
  logout() {
    this.token = null;
    localStorage.removeItem('flexcredi_token');
    localStorage.removeItem('flexcredi_user');
    localStorage.removeItem('flexcredi_logged_in');
    localStorage.removeItem('flexcredi_documents');
  },
  
  /**
   * Check if user is logged in
   * @returns {boolean}
   */
  isLoggedIn() {
    return !!localStorage.getItem('flexcredi_logged_in');
  },
  
  /**
   * Get current user from storage
   * @returns {object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('flexcredi_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  
  // ============ APPLICATIONS ============
  
  /**
   * Get user's applications
   * @returns {Promise<array>}
   */
  async getMyApplications() {
    if (!this.useRealAPI) {
      return this.demoGetApplications();
    }
    
    try {
      const data = await this.request('/api/public/applications/my');
      return data.applications || [];
    } catch (error) {
      console.warn('[ClientAPI] API failed, using demo data');
      return this.demoGetApplications();
    }
  },
  
  /**
   * Submit new credit application
   * @param {object} applicationData - Application form data
   * @returns {Promise<object>} - Created application
   */
  async submitApplication(applicationData) {
    if (!this.useRealAPI) {
      return this.demoSubmitApplication(applicationData);
    }
    
    try {
      const data = await this.request('/api/public/applications', {
        method: 'POST',
        body: JSON.stringify(applicationData)
      });
      
      return data;
      
    } catch (error) {
      console.warn('[ClientAPI] API failed, using demo mode');
      return this.demoSubmitApplication(applicationData);
    }
  },
  
  /**
   * Check application status
   * @param {string} applicationId - Application ID
   * @returns {Promise<object>} - Application status
   */
  async checkApplicationStatus(applicationId) {
    if (!this.useRealAPI) {
      return this.demoCheckStatus(applicationId);
    }
    
    try {
      const data = await this.request(`/api/public/applications/${applicationId}/status`);
      return data;
    } catch (error) {
      console.warn('[ClientAPI] API failed, using demo data');
      return this.demoCheckStatus(applicationId);
    }
  },
  
  // ============ PARTNERS ============
  
  /**
   * Get list of approved partners
   * @returns {Promise<array>}
   */
  async getPartners() {
    try {
      const data = await this.request('/api/public/partners');
      return data.data || data.partners || [];
    } catch (error) {
      console.warn('[ClientAPI] Could not fetch partners');
      return [];
    }
  },
  
  // ============ DOCUMENTS ============
  
  /**
   * Upload document
   * @param {File} file - File to upload
   * @param {string} type - Document type
   * @param {string} applicationId - Application ID
   * @returns {Promise<object>}
   */
  async uploadDocument(file, type, applicationId) {
    if (!this.useRealAPI) {
      return this.demoUploadDocument(file, type);
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('applicationId', applicationId);
      
      const response = await fetch(`${this.baseURL}/api/documents/upload`, {
        method: 'POST',
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      return data;
      
    } catch (error) {
      console.warn('[ClientAPI] API upload failed, using demo mode');
      return this.demoUploadDocument(file, type);
    }
  },
  
  // ============ DEMO/FALLBACK METHODS ============
  
  /**
   * Demo login - uses localStorage
   */
  demoLogin(email, password) {
    console.log('[ClientAPI] Demo login for:', email);
    
    // Check if user exists in localStorage
    const allUsers = JSON.parse(localStorage.getItem('flexcredi_all_users') || '[]');
    const user = allUsers.find(u => u.email === email);
    
    if (user) {
      localStorage.setItem('flexcredi_user', JSON.stringify(user));
      localStorage.setItem('flexcredi_logged_in', 'true');
      return { success: true, user, message: 'Demo login successful' };
    }
    
    // Create demo user if not found (for testing)
    if (email && password.length >= 4) {
      const demoUser = this.createDemoUser(email);
      localStorage.setItem('flexcredi_user', JSON.stringify(demoUser));
      localStorage.setItem('flexcredi_logged_in', 'true');
      return { success: true, user: demoUser, message: 'Demo login successful' };
    }
    
    throw new Error('Invalid email or password');
  },
  
  /**
   * Demo register - uses localStorage
   */
  demoRegister(userData) {
    console.log('[ClientAPI] Demo register:', userData.email);
    
    const newUser = {
      id: 'USR-' + Date.now().toString(36).toUpperCase(),
      ...userData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      creditScore: 0,
      requestedAmount: 0,
      applicationProgress: 5,
      applicationStep: 'registration',
      contractNumber: 'FL' + new Date().getFullYear() + String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    };
    
    // Save to all users list
    const allUsers = JSON.parse(localStorage.getItem('flexcredi_all_users') || '[]');
    allUsers.push(newUser);
    localStorage.setItem('flexcredi_all_users', JSON.stringify(allUsers));
    
    return { success: true, user: newUser, message: 'Registration successful' };
  },
  
  /**
   * Create demo user with realistic data
   */
  createDemoUser(email) {
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    return {
      id: 'USR-DEMO-' + Date.now().toString(36).toUpperCase(),
      email: email,
      fullName: name || 'Demo User',
      phone: '(305) 555-' + Math.floor(1000 + Math.random() * 9000),
      ssn: '***-**-' + Math.floor(1000 + Math.random() * 9000),
      address: Math.floor(1000 + Math.random() * 9000) + ' Demo Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33' + Math.floor(100 + Math.random() * 900),
      status: 'demo',
      createdAt: new Date().toISOString(),
      creditScore: Math.floor(650 + Math.random() * 150),
      requestedAmount: Math.floor(5 + Math.random() * 20) * 1000,
      approvedAmount: 0,
      interestRate: 18.5,
      term: 24,
      monthlyPayment: 0,
      applicationProgress: 10,
      applicationStep: 'started',
      contractNumber: 'FL' + new Date().getFullYear() + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      cobuyers: []
    };
  },
  
  /**
   * Demo get applications
   */
  demoGetApplications() {
    const user = this.getCurrentUser();
    if (!user) return [];
    
    return [{
      id: user.id,
      status: user.status,
      amount: user.requestedAmount,
      createdAt: user.createdAt
    }];
  },
  
  /**
   * Demo submit application
   */
  demoSubmitApplication(data) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not logged in');
    
    // Update user with application data
    const updatedUser = {
      ...user,
      ...data,
      status: 'pending',
      applicationProgress: 25,
      applicationStep: 'submitted'
    };
    
    localStorage.setItem('flexcredi_user', JSON.stringify(updatedUser));
    
    return { success: true, application: updatedUser, message: 'Application submitted' };
  },
  
  /**
   * Demo check status
   */
  demoCheckStatus(applicationId) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not found');
    
    return {
      id: applicationId,
      status: user.status || 'pending',
      progress: user.applicationProgress || 0,
      step: user.applicationStep || 'unknown'
    };
  },
  
  /**
   * Demo upload document
   */
  demoUploadDocument(file, type) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const docs = JSON.parse(localStorage.getItem('flexcredi_documents') || '{}');
        
        const docTypeMap = {
          'ID_FRONT': 'driverLicense',
          'ID_BACK': 'driverLicenseBack',
          'PROOF_OF_ADDRESS': 'proofOfAddress',
          'SSN_CARD': 'socialSecurityCard',
          'BANK_STATEMENT': 'bankCard'
        };
        
        const docKey = docTypeMap[type] || type.toLowerCase().replace(/_/g, '');
        
        docs[docKey] = {
          name: type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
          status: 'pending',
          uploadDate: new Date().toISOString(),
          url: e.target.result,
          type: file.type,
          fileName: file.name
        };
        
        localStorage.setItem('flexcredi_documents', JSON.stringify(docs));
        
        resolve({
          success: true,
          document: docs[docKey],
          message: 'Document uploaded successfully (demo mode)'
        });
      };
      reader.readAsDataURL(file);
    });
  }
};

// Initialize on load
ClientAPI.init();

// Export for global access
window.ClientAPI = ClientAPI;

console.log('[ClientAPI] Service loaded');

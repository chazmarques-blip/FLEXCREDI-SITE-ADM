/**
 * FLEXCREDI LLC - API Configuration
 * Production API URL for all frontend requests
 */

// Production API URL (Railway)
const API_URL = 'https://flexcredi-site-adm-production-b27d.up.railway.app';

// API Endpoints
const API_ENDPOINTS = {
  // Health & Test
  health: `${API_URL}/health`,
  test: `${API_URL}/api/test`,
  
  // Partners
  partners: `${API_URL}/api/partners`,
  partnerById: (id) => `${API_URL}/api/partners/${id}`,
  partnerApprove: (id) => `${API_URL}/api/partners/${id}/approve`,
  partnerReject: (id) => `${API_URL}/api/partners/${id}/reject`,
  
  // Applications (public)
  applications: `${API_URL}/api/applications`,
  applicationById: (id) => `${API_URL}/api/applications/${id}`,
  
  // Admin - Dashboard
  adminDashboard: `${API_URL}/api/admin/dashboard`,
  
  // Admin - Clients
  adminClients: `${API_URL}/api/admin/clients`,
  adminClientById: (id) => `${API_URL}/api/admin/clients/${id}`,
  adminClientStatus: (id) => `${API_URL}/api/admin/clients/${id}/status`,
  
  // Admin - Applications
  adminApplications: `${API_URL}/api/admin/applications`,
  adminApplicationById: (id) => `${API_URL}/api/admin/applications/${id}`,
  adminApplicationApprove: (id) => `${API_URL}/api/admin/applications/${id}/approve`,
  adminApplicationReject: (id) => `${API_URL}/api/admin/applications/${id}/reject`,
  
  // Admin - Documents
  adminDocuments: `${API_URL}/api/admin/documents`,
  adminDocumentApprove: (id) => `${API_URL}/api/admin/documents/${id}/approve`,
  adminDocumentReject: (id) => `${API_URL}/api/admin/documents/${id}/reject`,
  
  // Contracts
  contracts: `${API_URL}/api/contracts`,
  contractById: (id) => `${API_URL}/api/contracts/${id}`,
  contractGenerate: `${API_URL}/api/contracts/generate`,
  contractDownload: (id) => `${API_URL}/api/contracts/${id}/download`,
  
  // Documents
  documents: `${API_URL}/api/documents`,
  documentById: (id) => `${API_URL}/api/documents/${id}`,
  documentUpload: `${API_URL}/api/documents/upload`,
  documentDownload: (id) => `${API_URL}/api/documents/${id}/download`,
  documentReview: (id) => `${API_URL}/api/documents/${id}/review`,
  
  // Legacy (deprecated - use admin* versions)
  dashboard: `${API_URL}/api/admin/dashboard`,
  stats: `${API_URL}/api/admin/stats`
};

// Helper function to make API requests
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Helper functions for common operations
const API = {
  // GET request
  get: (url) => apiRequest(url, { method: 'GET' }),
  
  // POST request
  post: (url, data) => apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // PUT request
  put: (url, data) => apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  // DELETE request
  delete: (url) => apiRequest(url, { method: 'DELETE' }),
  
  // File upload (multipart/form-data)
  upload: (url, formData) => fetch(url, {
    method: 'POST',
    body: formData // Don't set Content-Type, browser will set it with boundary
  }).then(res => res.json())
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_URL, API_ENDPOINTS, API, apiRequest };
}

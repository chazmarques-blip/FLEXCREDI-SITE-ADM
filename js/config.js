// FLEXCREDI - CONFIGURAÇÕES DE API
const API_CONFIG = {
  // URLs baseadas no ambiente
  development: {
    baseURL: 'http://localhost:3001',
    endpoints: {
      root: '/',
      dashboard: '/api/dashboard',
      applications: '/api/applications'
    }
  },
  production: {
    baseURL: 'https://flexcredi-backend.up.railway.app',
    endpoints: {
      root: '/',
      dashboard: '/api/dashboard', 
      applications: '/api/applications'
    }
  }
};

// Detectar ambiente
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';

// Configuração atual
const currentConfig = isProduction ? API_CONFIG.production : API_CONFIG.development;

// Função helper para construir URLs completas
const getApiUrl = (endpoint) => {
  return `${currentConfig.baseURL}${currentConfig.endpoints[endpoint] || endpoint}`;
};

// Exportar configurações
window.FLEXCREDI_API = {
  config: currentConfig,
  getUrl: getApiUrl,
  isProduction: isProduction
};

console.log(`🔧 FLEXCREDI API Config - Ambiente: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
console.log(`📍 Base URL: ${currentConfig.baseURL}`);
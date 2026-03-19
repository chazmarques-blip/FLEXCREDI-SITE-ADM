/**
 * FLEXCREDI - Test Script
 * Testa todos os endpoints da API
 * 
 * Uso: node test-endpoints.js [BASE_URL]
 * Exemplo: node test-endpoints.js http://localhost:3001
 */

const baseURL = process.argv[2] || 'http://localhost:3001';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  console.log(`\n${colors.cyan}▶ ${name}${colors.reset}`);
}

function logSuccess(message) {
  console.log(`${colors.green}  ✓ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}  ✗ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.gray}  ${message}${colors.reset}`);
}

async function testEndpoint(method, path, body = null, expectedStatus = 200) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseURL}${path}`, options);
    const data = await response.json();
    
    if (response.status === expectedStatus) {
      logSuccess(`${method} ${path} → ${response.status}`);
      return { success: true, data };
    } else {
      logError(`${method} ${path} → ${response.status} (esperado: ${expectedStatus})`);
      return { success: false, status: response.status, data };
    }
  } catch (error) {
    logError(`${method} ${path} → ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n===========================================', 'cyan');
  log('  FLEXCREDI - Teste de Endpoints da API', 'cyan');
  log('===========================================\n', 'cyan');
  log(`Base URL: ${baseURL}\n`, 'yellow');
  
  let testIds = {
    partnerId: null,
    applicationId: null
  };
  
  // ============================================
  // Testes básicos
  // ============================================
  logTest('Teste 1: Health Check');
  await testEndpoint('GET', '/health');
  
  logTest('Teste 2: Rota Raiz');
  const rootResponse = await testEndpoint('GET', '/');
  if (rootResponse.success) {
    logInfo(`Endpoints disponíveis: ${Object.keys(rootResponse.data.endpoints).join(', ')}`);
  }
  
  logTest('Teste 3: Rota de Teste');
  await testEndpoint('GET', '/api/test');
  
  // ============================================
  // Testes de Parceiros
  // ============================================
  logTest('Teste 4: Criar Parceiro');
  const newPartner = {
    companyName: 'Empresa Teste LTDA',
    tradeName: 'Empresa Teste',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresateste.com',
    phone: '(11) 3333-4444',
    address: 'Rua Teste, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    legalRepName: 'João da Silva',
    legalRepCpf: '123.456.789-00',
    legalRepEmail: 'joao@empresateste.com',
    legalRepPhone: '(11) 99999-8888',
    monthlyRevenue: 100000,
    monthlyReceivables: 80000
  };
  
  const partnerResponse = await testEndpoint('POST', '/api/partners', newPartner, 201);
  if (partnerResponse.success && partnerResponse.data.data) {
    testIds.partnerId = partnerResponse.data.data.id;
    logInfo(`Partner ID: ${testIds.partnerId}`);
  }
  
  logTest('Teste 5: Listar Parceiros');
  await testEndpoint('GET', '/api/partners');
  
  if (testIds.partnerId) {
    logTest('Teste 6: Obter Detalhes do Parceiro');
    await testEndpoint('GET', `/api/partners/${testIds.partnerId}`);
    
    logTest('Teste 7: Aprovar Parceiro');
    await testEndpoint('PUT', `/api/partners/${testIds.partnerId}/approve`, {
      creditLimit: 500000,
      adminId: 'test-admin'
    });
  }
  
  // ============================================
  // Testes de Aplicações
  // ============================================
  if (testIds.partnerId) {
    logTest('Teste 8: Criar Aplicação');
    const newApplication = {
      clientName: 'Maria Silva Santos',
      clientEmail: 'maria.silva@email.com',
      clientPhone: '(11) 99999-1234',
      clientCpf: '123.456.789-01',
      clientAddress: 'Rua Cliente, 456',
      clientCity: 'São Paulo',
      clientState: 'SP',
      clientZipCode: '01234-567',
      desiredAmount: 15000,
      purpose: 'Capital de giro',
      monthlyIncome: 5000,
      employmentStatus: 'employed',
      employer: 'Empresa XYZ',
      occupation: 'Analista',
      partnerId: testIds.partnerId
    };
    
    const appResponse = await testEndpoint('POST', '/api/applications', newApplication, 201);
    if (appResponse.success && appResponse.data.data) {
      testIds.applicationId = appResponse.data.data.id;
      logInfo(`Application ID: ${testIds.applicationId}`);
    }
  }
  
  logTest('Teste 9: Listar Aplicações');
  await testEndpoint('GET', '/api/applications');
  
  if (testIds.applicationId) {
    logTest('Teste 10: Obter Detalhes da Aplicação');
    await testEndpoint('GET', `/api/applications/${testIds.applicationId}`);
    
    logTest('Teste 11: Aprovar Aplicação');
    await testEndpoint('PUT', `/api/applications/${testIds.applicationId}/approve`, {
      approvedAmount: 15000,
      interestRate: 2.5,
      termMonths: 12,
      reviewNotes: 'Aprovado automaticamente',
      adminId: 'test-admin'
    });
  }
  
  // ============================================
  // Testes de Admin
  // ============================================
  logTest('Teste 12: Dashboard Admin');
  const dashboardResponse = await testEndpoint('GET', '/api/admin/dashboard');
  if (dashboardResponse.success && dashboardResponse.data.data) {
    const stats = dashboardResponse.data.data.stats;
    logInfo(`Aplicações: ${stats.applications?.total || 0} total, ${stats.applications?.pending || 0} pendentes`);
    logInfo(`Parceiros: ${stats.partners?.total || 0} total, ${stats.partners?.approved || 0} aprovados`);
  }
  
  logTest('Teste 13: Estatísticas Mensais');
  await testEndpoint('GET', '/api/admin/stats/monthly?months=3');
  
  logTest('Teste 14: Configurações do Sistema');
  await testEndpoint('GET', '/api/admin/system-settings');
  
  // ============================================
  // Resumo
  // ============================================
  log('\n===========================================', 'cyan');
  log('  Testes Concluídos!', 'green');
  log('===========================================\n', 'cyan');
  
  if (testIds.partnerId || testIds.applicationId) {
    log('IDs criados durante os testes:', 'yellow');
    if (testIds.partnerId) {
      logInfo(`Partner ID: ${testIds.partnerId}`);
    }
    if (testIds.applicationId) {
      logInfo(`Application ID: ${testIds.applicationId}`);
    }
  }
  
  log('\n');
}

// Executar testes
runTests().catch(error => {
  logError(`Erro ao executar testes: ${error.message}`);
  process.exit(1);
});

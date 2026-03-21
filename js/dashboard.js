// FLEXCREDI - Dashboard Client JavaScript
// Version: 3.1.0 - Document persistence fix
// Last updated: 2026-03-12

document.addEventListener('DOMContentLoaded', function() {
    console.log('FLEXCREDI Dashboard v3.1.0 - System loaded');
    
    // Force check version and clear old cache if needed
    const currentVersion = '3.1.0';
    const storedVersion = localStorage.getItem('flexcredi_dashboard_version');
    
    if (storedVersion !== currentVersion) {
        console.log(`🔄 Version mismatch: ${storedVersion} → ${currentVersion}`);
        console.log('🧹 Clearing old cache...');
        
        // Don't clear user data, just update version
        localStorage.setItem('flexcredi_dashboard_version', currentVersion);
        console.log('✅ Version updated');
    }
    
    // Initialize Dashboard
    initDashboard();
    initUserMenu();
    initCharts();
    loadUserData();
    loadApplications();
    loadActivity();
    
    // Initialize cobuyers section
    setTimeout(() => {
        initCobuyersSection();
    }, 1000);
    
    // Initialize client functions
    initClientFunctions();
});

// Initialize Dashboard functionality
function initDashboard() {
    // Time filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.dataset.period;
            updateFinancialChart(period);
        });
    });
    
    // Quick actions
    const newApplicationBtn = document.querySelector('a[href="#new-application"]');
    const calculatorBtn = document.querySelector('a[href="#calculator"]');
    
    if (newApplicationBtn) {
        newApplicationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'aplicacao.html';
        });
    }
    
    if (calculatorBtn) {
        calculatorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html#simulacao-rapida';
        });
    }
}

// Initialize User Menu
function initUserMenu() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Initialize Charts
function initCharts() {
    initCreditScoreChart();
    initFinancialChart();
}

// Credit Score Chart
function initCreditScoreChart() {
    const ctx = document.getElementById('creditScoreChart');
    if (!ctx) return;
    
    const creditScore = 720; // This would come from API
    const maxScore = 850;
    const percentage = (creditScore / maxScore) * 100;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: ['#2ECC71', '#E9ECEF'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// Financial Overview Chart
function initFinancialChart() {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Aplicações',
                data: [5000, 8000, 12000, 15000, 18000, 25000],
                borderColor: '#2ECC71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    // Store chart reference for updates
    window.financialChart = chart;
}

// Update Financial Chart based on period
function updateFinancialChart(period) {
    if (!window.financialChart) return;
    
    let data, labels;
    
    switch(period) {
        case '30':
            labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
            data = [3000, 5000, 8000, 12000];
            break;
        case '90':
            labels = ['Mês 1', 'Mês 2', 'Mês 3'];
            data = [8000, 15000, 25000];
            break;
        case '365':
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            data = [5000, 8000, 12000, 15000, 18000, 25000, 28000, 30000, 32000, 35000, 38000, 42000];
            break;
        default:
            return;
    }
    
    window.financialChart.data.labels = labels;
    window.financialChart.data.datasets[0].data = data;
    window.financialChart.update();
}

// Load User Data
function loadUserData() {
    console.log('📊 Loading user data v3.0.0...');
    
    // Get user data from localStorage
    let userData = getUserFromStorage();
    
    console.log('👤 User from storage:', userData?.fullName, userData?.email);
    
    // CRITICAL: Never redirect if user exists (even without email in edge cases)
    // This prevents losing John Michael Smith data
    if (!userData) {
        console.log('❌ No user found at all, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // CRITICAL: If we have John Michael Smith, NEVER replace with Carlos Eduardo
    if (userData.fullName === 'John Michael Smith') {
        console.log('✅ John Michael Smith detected - preserving data');
    } else if (userData.fullName === 'Carlos Eduardo Silva') {
        console.warn('⚠️ Carlos Eduardo detected - checking for test client override');
        
        // Try to find test client to replace Carlos
        const testClients = JSON.parse(localStorage.getItem('flexcredi_test_clients') || '[]');
        if (testClients.length > 0) {
            const testClient = testClients[0];
            console.log('🔄 Replacing Carlos Eduardo with test client:', testClient.fullName);
            
            // Replace with test client data
            userData = {
                id: testClient.id,
                email: testClient.email,
                fullName: testClient.fullName,
                phone: testClient.phone,
                ssn: testClient.ssn,
                address: testClient.address,
                zipCode: testClient.zipCode,
                city: testClient.city,
                state: testClient.state,
                availableCredit: testClient.loanAmount || 35000,
                creditScore: testClient.creditScore || 742,
                accountType: 'client',
                preApproval: testClient.preApproval,
                documents: testClient.documents,
                applicationData: testClient
            };
            
            // Save immediately
            localStorage.setItem('flexcredi_user', JSON.stringify(userData));
            console.log('✅ Replaced Carlos Eduardo with', userData.fullName);
        }
    }
    
    // If no email but has other data, don't redirect
    if (!userData.email && userData.fullName) {
        console.warn('⚠️ User has no email but has name:', userData.fullName);
        // Don't redirect, just continue with what we have
    }
    
    // If user doesn't have preApproval but has applicationData, use that
    if (!userData.preApproval && userData.applicationData) {
        userData.preApproval = userData.applicationData.preApproval;
    }
    
    // If still no preApproval, create a minimal one
    if (!userData.preApproval) {
        console.log('⚠️ No preApproval data, creating default');
        userData.preApproval = {
            amount: userData.loanAmount || userData.desiredAmount || 25000,
            interestRate: userData.averageRate || 16.5,
            termMonths: userData.termMonths || 24,
            monthlyPayment: userData.monthlyPayment || 1287,
            contractNumber: userData.contractNumber || 'FL2024001',
            approvalDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
    }
    
    // Ensure documents structure exists but DON'T overwrite existing documents
    if (!userData.documents) {
        userData.documents = {
            driverLicense: { uploaded: false, approved: false, fileName: '', previewData: '' },
            proofAddress: { uploaded: false, approved: false, fileName: '', previewData: '' },
            socialSecurity: { uploaded: false, approved: false, fileName: '', previewData: '' },
            bankCard: { uploaded: false, approved: false, fileName: '', previewData: '' }
        };
    } else {
        console.log('📄 Documents already exist:', Object.keys(userData.documents).filter(k => userData.documents[k].uploaded));
    }
    
    console.log('✅ User data loaded:', {
        name: userData.fullName,
        email: userData.email,
        creditScore: userData.creditScore,
        preApproval: userData.preApproval?.amount,
        documents: Object.keys(userData.documents || {}).filter(k => userData.documents[k].uploaded).length + '/4'
    });
    
    // Save updated userData back to localStorage (but preserve what's there)
    localStorage.setItem('flexcredi_user', JSON.stringify(userData));
    
    updateUserInterface(userData);
}

// Create Test User for demonstration
function createTestUser() {
    return {
        id: 'test-user-' + Date.now(),
        fullName: 'Carlos Eduardo Silva',
        email: 'carlos.silva@email.com',
        phone: '(11) 99999-9999',
        ssn: '123-45-6789',
        address: '123 Main Street',
        zipCode: '01234-567',
        city: 'São Paulo',
        state: 'SP',
        desiredAmount: 25000,
        purpose: 'Expandir negócio',
        availableCredit: 30000,
        creditScore: 785,
        applicationDate: new Date().toISOString(),
        status: 'pre-approved',
        // Dados da pré-aprovação (podem mudar na aprovação final)
        preApproval: {
            amount: 25000,
            interestRate: 18.5,
            termMonths: 24,
            monthlyPayment: 1287,
            contractNumber: 'FL2024001',
            approvalDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        },
        // Dados da aprovação final (preenchidos após análise completa dos documentos)
        finalApproval: {
            amount: null,
            interestRate: null,
            termMonths: null,
            monthlyPayment: null,
            contractNumber: null,
            approvalDate: null,
            differences: [] // Array de mudanças entre pré-aprovação e aprovação final
        },
        documents: {
            driverLicense: { uploaded: false, approved: false, fileName: '', previewData: '' },
            proofAddress: { uploaded: false, approved: false, fileName: '', previewData: '' },
            socialSecurity: { uploaded: false, approved: false, fileName: '', previewData: '' },
            bankCard: { uploaded: false, approved: false, fileName: '', previewData: '' }
        }
    };
}

// Update User Interface with user data
function updateUserInterface(userData) {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const userGreeting = document.getElementById('userGreeting');
    const approvedAmount = document.getElementById('approvedAmount');
    const creditScore = document.getElementById('creditScore');
    
    // Update header greeting
    if (userGreeting) {
        userGreeting.textContent = `Welcome, ${userData.fullName || 'Client'}!`;
    }
    
    if (userName) {
        userName.textContent = `Welcome, ${userData.fullName || 'Client'}`;
    }
    
    if (userAvatar) {
        const initials = userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'CL';
        userAvatar.src = `https://ui-avatars.com/api/?name=${initials}&background=2ECC71&color=fff`;
        userAvatar.alt = `Avatar of ${userData.fullName || 'Client'}`;
    }
    
    // Atualizar informações de financiamento no header
    updateFinancingDetailsInHeader(userData);
    
    if (creditScore) {
        creditScore.textContent = userData.creditScore || '785';
    }
    
    // Load main signer information (new unified system)
    loadMainSignerSection(userData);
    
    // Update financing details in header
    updateFinancingDetailsInHeader(userData);
    
    // Update contract information based on approval status
    updateContractInformation(userData);
    
    // Initialize contract functionality
    initContractSection();
    
    // Initialize cobuyers functionality
    initCobuyersSection();
}

// Load Applications
async function loadApplications() {
    const applicationsList = document.getElementById('applicationsList');
    if (!applicationsList) return;
    
    try {
        // Get applications from API
        const applications = await fetchUserApplications();
        
        if (applications && applications.length > 0) {
            displayApplications(applications);
        } else {
            displayNoApplications();
        }
    } catch (error) {
        console.error('Erro ao carregar aplicações:', error);
        displayApplicationsError();
    }
}

// Fetch user applications from API
async function fetchUserApplications() {
    const userData = getUserFromStorage();
    
    // Check if user has rich data (master account)
    if (userData && userData.applications) {
        return userData.applications.map(app => ({
            id: app.id,
            desiredAmount: app.amount,
            purpose: app.purpose,
            status: app.status,
            created_at: new Date(app.date).getTime(),
            rate: app.rate,
            term: app.term
        }));
    }
    
    try {
        const response = await fetch('tables/loan_applications?limit=5');
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('API Error:', error);
        // Return mock data for demonstration
        return [
            {
                id: '1',
                desiredAmount: 15000,
                purpose: 'Equipamentos do restaurante',
                status: 'approved',
                created_at: Date.now() - 86400000 * 7
            },
            {
                id: '2',
                desiredAmount: 8000,
                purpose: 'Ferramentas de construção',
                status: 'processing',
                created_at: Date.now() - 86400000 * 3
            },
            {
                id: '3',
                desiredAmount: 25000,
                purpose: 'Expansão da loja',
                status: 'pending',
                created_at: Date.now() - 86400000
            }
        ];
    }
}

// Display Applications
function displayApplications(applications) {
    const applicationsList = document.getElementById('applicationsList');
    
    applicationsList.innerHTML = applications.map(app => `
        <div class="application-item">
            <div class="application-info">
                <h5>${formatCurrency(app.desiredAmount)}</h5>
                <p>${app.purpose}</p>
            </div>
            <div class="application-status status-${app.status}">
                ${getStatusText(app.status)}
            </div>
        </div>
    `).join('');
}

// Display No Applications message
function displayNoApplications() {
    const applicationsList = document.getElementById('applicationsList');
    applicationsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #6c757d;">
            <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p>Você ainda não possui aplicações de crédito.</p>
            <a href="aplicacao.html" class="btn btn-primary btn-sm">Fazer Primeira Aplicação</a>
        </div>
    `;
}

// Display Applications Error
function displayApplicationsError() {
    const applicationsList = document.getElementById('applicationsList');
    applicationsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #dc3545;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <p>Erro ao carregar aplicações. Tente novamente.</p>
        </div>
    `;
}

// Load Recent Activity
function loadActivity() {
    const activityTimeline = document.getElementById('activityTimeline');
    if (!activityTimeline) return;
    
    const userData = getUserFromStorage();
    let activities;
    
    // Use rich activity data for master account
    if (userData && userData.recentActivity) {
        activities = userData.recentActivity;
    } else {
        activities = [
            {
                title: 'Aplicação Aprovada',
                description: 'Sua aplicação de $15.000 foi aprovada',
                time: '2 dias atrás'
            },
            {
                title: 'Documents Sent', 
                description: 'Documents received and under analysis',
                time: '5 dias atrás'
            },
            {
                title: 'Nova Aplicação',
                description: 'Aplicação de crédito enviada com sucesso',
                time: '1 semana atrás'
            }
        ];
    }
    
    activityTimeline.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-content">
                <h6>${activity.title}</h6>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// Helper Functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'processing': 'In Analysis',
        'approved': 'Approved',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('US$', '$');
}

// Gerenciamento das informações de pré-aprovação e aprovação final
function updateContractInformation(userData) {
    const contractStatus = document.getElementById('contractStatus');
    const contractValueElements = document.querySelectorAll('.contract-values-inline .value');
    const contractTitle = document.querySelector('.contract-header-inline h4');
    const reviewContractBtn = document.getElementById('reviewContractBtn');
    const signContractBtn = document.getElementById('signContractBtn');
    
    // Determinar se usar dados da pré-aprovação ou aprovação final
    const isPreApproved = userData.status === 'pre-approved';
    const isFinallyApproved = userData.status === 'approved';
    
    let contractData;
    
    if (isFinallyApproved && userData.finalApproval.amount) {
        // Usar dados da aprovação final
        contractData = userData.finalApproval;
        if (contractStatus) contractStatus.textContent = 'Approved - Ready to Sign';
        if (contractTitle) contractTitle.textContent = `Loan Contract #${contractData.contractNumber}`;
    } else if (isPreApproved && userData.preApproval) {
        // Usar dados da pré-aprovação
        contractData = userData.preApproval;
        if (contractStatus) contractStatus.textContent = 'Pre-Approved - Subject to Final Analysis';
        if (contractTitle) contractTitle.textContent = `Pre-Contract #${contractData.contractNumber}`;
    } else {
        // Estado padrão
        return;
    }
    
    // Atualizar valores no contrato
    if (contractValueElements.length >= 4) {
        contractValueElements[0].textContent = formatCurrency(contractData.amount);
        contractValueElements[1].textContent = `${contractData.interestRate}% a.a.`;
        contractValueElements[2].textContent = `${contractData.termMonths} months`;
        contractValueElements[3].textContent = `${formatCurrency(contractData.monthlyPayment)}/mo`;
    }
    
    // Atualizar botões baseado no status
    if (isPreApproved) {
        if (reviewContractBtn) {
            reviewContractBtn.innerHTML = '<i class="fas fa-eye"></i> Review Pre-Approval';
        }
        if (signContractBtn) {
            signContractBtn.innerHTML = '<i class="fas fa-clock"></i> Awaiting Documents';
            signContractBtn.disabled = true;
            signContractBtn.style.opacity = '0.6';
        }
    } else if (isFinallyApproved) {
        if (reviewContractBtn) {
            reviewContractBtn.innerHTML = '<i class="fas fa-eye"></i> Review Final Contract';
        }
        if (signContractBtn) {
            signContractBtn.innerHTML = '<i class="fas fa-signature"></i> Sign Electronically';
            signContractBtn.disabled = false;
            signContractBtn.style.opacity = '1';
        }
    }
}

// Função para simular aprovação final (quando todos os documentos forem aprovados)
function processToFinalApproval(userData) {
    // Verificar se todos os documentos foram aprovados
    const allDocsApproved = Object.values(userData.documents).every(doc => doc.approved);
    
    if (allDocsApproved && userData.status === 'pre-approved') {
        // Simular possíveis mudanças na aprovação final
        const hasChanges = Math.random() < 0.3; // 30% chance de mudanças
        
        if (hasChanges) {
            // Exemplo de mudanças que podem ocorrer
            userData.finalApproval = {
                amount: userData.preApproval.amount * 0.9, // Redução de 10%
                interestRate: userData.preApproval.interestRate + 1, // Aumento de 1%
                termMonths: userData.preApproval.termMonths,
                monthlyPayment: Math.round((userData.preApproval.amount * 0.9) * (userData.preApproval.interestRate + 1) / 100 / 12),
                contractNumber: userData.preApproval.contractNumber.replace('FL', 'FLC'),
                approvalDate: new Date().toISOString(),
                differences: [
                    'Valor ajustado para $22,500 após análise completa',
                    'Taxa ajustada para 19.5% a.a. após análise de risco'
                ]
            };
        } else {
            // Aprovação final mantém os mesmos valores da pré-aprovação
            userData.finalApproval = {
                ...userData.preApproval,
                contractNumber: userData.preApproval.contractNumber.replace('FL', 'FLC'),
                approvalDate: new Date().toISOString(),
                differences: []
            };
        }
        
        userData.status = 'approved';
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        
        // Mostrar notificação de aprovação final
        showApprovalNotification(userData.finalApproval.differences.length > 0);
        
        return true;
    }
    
    return false;
}

// Mostrar notificação de aprovação final
function showApprovalNotification(hasChanges) {
    const notification = document.createElement('div');
    notification.className = 'approval-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Aprovação Final Concluída!</h4>
                <p>${hasChanges ? 'Alguns valores foram ajustados após análise completa.' : 'Todos os valores da pré-aprovação foram mantidos.'}</p>
            </div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Remover ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Atualizar detalhes do financiamento no header da caixa verde
function updateFinancingDetailsInHeader(userData) {
    const financingAmount = document.getElementById('financingAmount');
    const financingRate = document.getElementById('financingRate');
    const financingTerm = document.getElementById('financingTerm');
    const financingPayment = document.getElementById('financingPayment');
    const statusBadge = document.querySelector('.status-badge');
    const statusDescription = document.querySelector('.status-description');
    
    // Determinar qual conjunto de dados usar
    let financingData;
    let statusText;
    let descriptionText;
    
    if (userData.status === 'approved' && userData.finalApproval && userData.finalApproval.amount) {
        // Usar dados da aprovação final
        financingData = userData.finalApproval;
        statusText = 'APPROVED';
        descriptionText = 'Ready to sign the contract';
        if (statusBadge) {
            statusBadge.className = 'status-badge status-approved';
        }
    } else if (userData.status === 'pre-approved') {
        // Usar dados da pré-aprovação (criar estrutura se não existir)
        if (!userData.preApproval) {
            userData.preApproval = {
                amount: 25000,
                interestRate: 18.5,
                termMonths: 24,
                monthlyPayment: 1287,
                contractNumber: 'FL2024001',
                approvalDate: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
        }
        financingData = userData.preApproval;
        statusText = 'PRE-APPROVED';
        descriptionText = 'Your pre-approval is under review, submit the required documentation to finalize the process.';
        if (statusBadge) {
            statusBadge.className = 'status-badge status-pre-approved';
        }
    } else {
        // Estado padrão - em análise
        financingData = {
            amount: userData.desiredAmount || 25000,
            interestRate: 18.5,
            termMonths: 24,
            monthlyPayment: 1287
        };
        statusText = 'IN ANALYSIS';
        descriptionText = 'Awaiting document analysis';
        if (statusBadge) {
            statusBadge.className = 'status-badge status-pending';
        }
    }
    
    // Atualizar os valores na interface
    if (financingAmount) {
        financingAmount.textContent = formatCurrency(financingData.amount);
    }
    
    if (financingRate) {
        financingRate.textContent = `${financingData.interestRate}% a.a.`;
    }
    
    if (financingTerm) {
        financingTerm.textContent = `${financingData.termMonths} months`;
    }
    
    if (financingPayment) {
        financingPayment.textContent = `${formatCurrency(financingData.monthlyPayment)}/mo`;
    }
    
    // Atualizar status e descrição
    if (statusBadge) {
        statusBadge.textContent = statusText;
    }
    
    if (statusDescription) {
        statusDescription.textContent = descriptionText;
    }
}

function getUserFromStorage() {
    try {
        return JSON.parse(localStorage.getItem('flexcredi_user')) || null;
    } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        return null;
    }
}

function getCobuyersFromStorage() {
    try {
        return JSON.parse(localStorage.getItem('flexcredi_cobuyers')) || [];
    } catch (error) {
        console.error('Erro ao recuperar dados dos co-signatários:', error);
        return [];
    }
}

function handleLogout() {
    // Clear user data
    localStorage.removeItem('flexcredi_user');
    localStorage.removeItem('flexcredi_session');
    
    // Show logout message
    alert('Logout realizado com sucesso!');
    
    // Redirect to home
    window.location.href = 'index.html';
}

// Load Profile Section
function loadProfileSection(userData) {
    const profileSection = document.getElementById('profileSection');
    if (!profileSection) return;
    
    const profileData = [
        { label: 'Full Name', field: 'fullName', value: userData.fullName || '', editable: true },
        { label: 'Email', field: 'email', value: userData.email || '', editable: true },
        { label: 'Phone', field: 'phone', value: userData.phone || '', editable: true },
        { label: 'SSN', field: 'ssn', value: userData.ssn || '', editable: false },
        { label: 'Address', field: 'address', value: userData.address || '', editable: true },
        { label: 'ZIP Code', field: 'zipCode', value: userData.zipCode || '', editable: true },
        { label: 'City', field: 'city', value: userData.city || '', editable: true },
        { label: 'State', field: 'state', value: userData.state || '', editable: true }
    ];
    
    profileSection.innerHTML = profileData.map(item => `
        <div class="profile-item">
            <div class="profile-label">${item.label}</div>
            <div class="profile-value ${item.editable ? 'editable readonly' : ''}" 
                 data-field="${item.field}">
                ${item.value || 'Não informado'}
            </div>
        </div>
    `).join('');
    
    // Initialize edit button
    initProfileEditButton();
}

// Initialize Profile Edit Button
function initProfileEditButton() {
    const editBtn = document.getElementById('editProfileBtn');
    if (!editBtn) return;
    
    editBtn.addEventListener('click', function() {
        const profileWrapper = document.getElementById('profileSectionWrapper');
        const isEditing = profileWrapper.classList.contains('editing');
        
        if (isEditing) {
            saveProfileChanges();
        } else {
            enterEditMode();
        }
    });
}

// Enter Edit Mode
function enterEditMode() {
    const profileWrapper = document.getElementById('profileSectionWrapper');
    const editBtn = document.getElementById('editProfileBtn');
    const editableFields = document.querySelectorAll('.profile-value.editable');
    
    // Add editing class to wrapper
    profileWrapper.classList.add('editing');
    
    // Change button to save mode
    editBtn.classList.add('save-mode');
    editBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    
    // Convert text to inputs for editable fields
    editableFields.forEach(field => {
        if (field.classList.contains('editable')) {
            const currentValue = field.textContent.trim();
            const displayValue = currentValue === 'Não informado' ? '' : currentValue;
            
            field.innerHTML = `<input type="text" value="${displayValue}" class="profile-edit-input" placeholder="Digite aqui...">`;
            
            // Add keyboard handlers
            const input = field.querySelector('input');
            if (input) {
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveProfileChanges();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        exitEditModeWithoutSaving();
                    }
                });
                
                // Focus first field
                if (field === editableFields[0]) {
                    input.focus();
                    input.select();
                }
            }
        }
    });
}

// Save Profile Changes
function saveProfileChanges() {
    const profileWrapper = document.getElementById('profileSectionWrapper');
    const editBtn = document.getElementById('editProfileBtn');
    const editableFields = document.querySelectorAll('.profile-value.editable');
    const userData = getUserFromStorage();
    
    if (!userData) {
        showAlert('error', 'Erro ao salvar dados do usuário.');
        return;
    }
    
    let hasChanges = false;
    
    // Collect changes from inputs
    editableFields.forEach(field => {
        const input = field.querySelector('input');
        if (input) {
            const fieldName = field.dataset.field;
            const newValue = input.value.trim();
            const displayValue = newValue || 'Não informado';
            
            // Update field display
            field.innerHTML = displayValue;
            
            // Update userData
            if (userData[fieldName] !== newValue) {
                userData[fieldName] = newValue;
                hasChanges = true;
            }
        }
    });
    
    // Exit edit mode
    profileWrapper.classList.remove('editing');
    editBtn.classList.remove('save-mode');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    
    // Save to localStorage
    if (hasChanges) {
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        showAlert('success', 'Informações salvas com sucesso!');
    } else {
        showAlert('info', 'Nenhuma alteração foi feita.');
    }
}

// Exit Edit Mode Without Saving
function exitEditModeWithoutSaving() {
    const profileWrapper = document.getElementById('profileSectionWrapper');
    const editBtn = document.getElementById('editProfileBtn');
    const userData = getUserFromStorage();
    
    // Exit edit mode
    profileWrapper.classList.remove('editing');
    editBtn.classList.remove('save-mode');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    
    // Restore original values
    const editableFields = document.querySelectorAll('.profile-value.editable');
    editableFields.forEach(field => {
        const fieldName = field.dataset.field;
        const originalValue = userData[fieldName] || 'Não informado';
        field.innerHTML = originalValue;
    });
    
    showAlert('info', 'Edição cancelada.');
}

// Initialize Document Uploads
function initDocumentUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const docType = this.id.replace('file-', '');
            handleDocumentUpload(docType, this.files[0]);
        });
    });
}

// Handle Document Upload
function handleDocumentUpload(docType, file) {
    if (!file) return;
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showAlert('error', 'File too large. Maximum 5MB allowed.');
        return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('error', 'File type not allowed. Use JPG, PNG or PDF.');
        return;
    }
    
    // Get elements - no status element, integrated into preview box
    const previewBox = document.getElementById(`preview-${docType}`);
    const buttonElement = document.getElementById(`btn-${docType}`);
    
    // Disable button during upload
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    }
    
    // Show loading in preview box
    previewBox.innerHTML = `
        <div class="preview-icon">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <span class="preview-text">Uploading...</span>
    `;
    previewBox.className = 'doc-preview-box processing';
    
    // Simulate upload delay
    setTimeout(() => {
        // Update preview box to show upload
        updatePreviewBox(docType, file, previewBox);
        
        // Change button to replace mode
        if (buttonElement) {
            buttonElement.innerHTML = '<i class="fas fa-sync"></i> Substituir';
            buttonElement.className = 'btn-status uploaded';
            buttonElement.disabled = false;
        }
        
        showAlert('success', `${getDocumentName(docType)} uploaded successfully!`);
        
        // Update completion indicator
        updateDocumentCompletion();
        
        // Check if contract can be enabled
        checkContractEligibility();
    }, 2000);
}

// Update Preview Box
function updatePreviewBox(docType, file, previewBox) {
    if (!previewBox) return;
    
    // Remove pending class and add uploaded class for green border
    previewBox.classList.remove('pending', 'processing');
    previewBox.classList.add('uploaded');
    
    // Update content based on file type
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewBox.innerHTML = `<img src="${e.target.result}" alt="${file.name}" onclick="previewDocument('${docType}')">`;
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        // For PDF files, render first page as image
        renderPDFAsImage(file, previewBox, docType);
    } else {
        // For other files, show icon with filename
        const iconMap = {
            'driver-license': 'fa-id-card',
            'proof-address': 'fa-home',
            'social-security': 'fa-id-badge',
            'bank-card': 'fa-credit-card'
        };
        
        const fileName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
        
        previewBox.innerHTML = `
            <div class="preview-icon">
                <i class="fas ${iconMap[docType] || 'fa-file'}" style="color: var(--verde-vibrante);"></i>
            </div>
            <span class="preview-text" style="color: var(--verde-escuro); font-weight: 500; font-size: 9px;">${fileName}</span>
        `;
    }
    
    // Make preview clickable for view/preview, but not for file selection (button handles that)
    previewBox.onclick = () => {
        if (file.type.startsWith('image/')) {
            previewDocument(docType);
        }
    };
}

// Get Document Name
function getDocumentName(docType) {
    const names = {
        'driver-license': 'Driver License',
        'proof-address': 'Proof of Address', 
        'social-security': 'Social Security Card',
        'bank-card': 'Bank Card'
    };
    return names[docType] || docType;
}

// Update Document Completion
function updateDocumentCompletion() {
    const approvedDocs = document.querySelectorAll('.doc-preview-box.uploaded').length;
    const totalDocs = document.querySelectorAll('.document-card').length;
    const completionElement = document.getElementById('docsCompletion');
    
    if (completionElement) {
        completionElement.textContent = `${approvedDocs}/${totalDocs} Uploaded`;
        
        if (approvedDocs === totalDocs) {
            completionElement.style.background = '#d4edda';
            completionElement.style.color = '#155724';
        }
    }
}

// Initialize Contract Section
function initContractSection() {
    const reviewBtn = document.getElementById('reviewContractBtn');
    const signBtn = document.getElementById('signContractBtn');
    
    if (reviewBtn) {
        reviewBtn.addEventListener('click', showContractModal);
    }
    
    if (signBtn) {
        signBtn.addEventListener('click', initiateElectronicSignature);
    }
}

// Check Contract Eligibility
function checkContractEligibility() {
    const approvedDocs = document.querySelectorAll('.doc-preview-box.uploaded').length;
    const totalDocs = document.querySelectorAll('.document-card').length;
    const signBtn = document.getElementById('signContractBtn');
    
    if (approvedDocs >= totalDocs) {
        signBtn.disabled = false;
        signBtn.style.opacity = '1';
    }
}

// Show Contract Modal
function showContractModal() {
    try {
        // Get user data
        const userData = getUserFromStorage();
        
        if (!userData) {
            alert('Error: User data not found.');
            return;
        }
        
        // Get current language
        const currentLang = localStorage.getItem('flexcredi_language') || 'en';
        
        // Generate contract HTML using the template
        let contractHtml;
        if (typeof generateContractHTML === 'function') {
            contractHtml = contractStyles + generateContractHTML(userData, currentLang, false, null);
        } else {
            // Fallback to simple contract
            contractHtml = `
                <div style="font-family: Times, serif; line-height: 1.6;">
                    <h1 style="text-align: center; color: #2ECC71;">FLEXCREDI LLC</h1>
                    <h2 style="text-align: center;">PERSONAL LOAN AGREEMENT</h2>
                    <hr>
                    <h3>PARTIES:</h3>
                    <p><strong>LENDER:</strong> Flexcredi LLC</p>
                    <p><strong>BORROWER:</strong> ${userData.fullName || 'N/A'}</p>
                    <h3>LOAN TERMS:</h3>
                    <p><strong>Principal Amount:</strong> $${(userData.requestedAmount || 10000).toLocaleString()}</p>
                    <p><strong>Annual Interest Rate:</strong> ${userData.interestRate || 18.5}% per annum</p>
                    <p><strong>Loan Term:</strong> ${userData.term || 24} months</p>
                    <p><strong>Monthly Payment:</strong> $${userData.monthlyPayment || 508}</p>
                </div>
            `;
        }
        
        // Language tabs HTML
        const languageTabs = `
            <div class="contract-language-tabs">
                <button class="lang-tab ${currentLang === 'en' ? 'active' : ''}" onclick="switchContractLanguage('en')">
                    <i class="fas fa-check-circle"></i> English (Official)
                </button>
                <button class="lang-tab ${currentLang === 'pt' ? 'active' : ''}" onclick="switchContractLanguage('pt')">
                    <i class="fas fa-eye"></i> Português (Preview)
                </button>
                <button class="lang-tab ${currentLang === 'es' ? 'active' : ''}" onclick="switchContractLanguage('es')">
                    <i class="fas fa-eye"></i> Español (Preview)
                </button>
            </div>
        `;
    
        const modalHTML = `
            <div class="modal-overlay" id="contract-modal">
                <div class="modal-content contract-modal" style="max-width: 900px; max-height: 90vh;">
                    <div class="modal-header">
                        <h3><i class="fas fa-file-contract"></i> Personal Loan Agreement - ${userData.fullName || 'Contract'}</h3>
                        <button class="modal-close" onclick="closeModal('contract-modal')">×</button>
                    </div>
                    <div class="modal-body" style="padding: 0;">
                        ${languageTabs}
                        <div class="contract-viewer" id="mainContractViewer" style="max-height: 60vh; overflow-y: auto; padding: 20px;">
                            <div class="contract-language-notice" style="background: #e8f5e9; border: 1px solid #c8e6c9; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0;"><strong><i class="fas fa-info-circle"></i> LEGAL NOTICE:</strong> The official contract is in English as required by US law. 
                                Preview translations are available for reference only.</p>
                            </div>
                            
                            <div class="contract-content" id="contractContent">
                                ${contractHtml}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end; padding: 15px 20px; border-top: 1px solid #eee;">
                        <button class="btn btn-outline" onclick="printContract()">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button class="btn btn-outline" onclick="downloadContractPDF()">
                            <i class="fas fa-download"></i> Download PDF
                        </button>
                        <button class="btn btn-outline" onclick="closeModal('contract-modal')">Close</button>
                        <button class="btn btn-primary" onclick="closeModal('contract-modal'); initiateElectronicSignature();">
                            <i class="fas fa-signature"></i> Proceed to Signature
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        console.error('Error opening contract:', error);
        alert('Error loading contract. Please try again.');
    }
}

// Switch contract language (preview only for non-English)
function switchContractLanguage(lang) {
    const userData = getUserFromStorage();
    if (!userData) return;
    
    // Update tabs
    document.querySelectorAll('.lang-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.lang-tab[onclick="switchContractLanguage('${lang}')"]`)?.classList.add('active');
    
    // Generate new contract content
    const contractContent = document.getElementById('contractContent');
    if (contractContent && typeof generateContractHTML === 'function') {
        contractContent.innerHTML = contractStyles + generateContractHTML(userData, lang, false, null);
    }
}

// Show contract in English (from preview)
function showContractInEnglish() {
    switchContractLanguage('en');
}

// Print contract
function printContract() {
    const contractContent = document.getElementById('contractContent');
    if (contractContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>FlexCredi - Personal Loan Agreement</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 40px; }
                    h1, h2 { color: #2C3E50; }
                    .contract-preview-notice { display: none; }
                    .english-version-notice { display: none; }
                </style>
            </head>
            <body>
                ${contractContent.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Download contract as PDF (placeholder)
function downloadContractPDF() {
    alert('PDF download feature will be available soon. Please use the Print option to save as PDF.');
}

// Initiate Electronic Signature
function initiateElectronicSignature() {
    const modalHTML = `
        <div class="modal-overlay" id="signature-modal">
            <div class="modal-content signature-modal">
                <div class="modal-header">
                    <h3>Assinatura Eletrônica</h3>
                </div>
                <div class="modal-body">
                    <div class="signature-steps">
                        <div class="step active" id="step-1">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Confirmação por Email</h4>
                                <p>Enviamos um código para <strong>master@flexcredi.com</strong></p>
                                <input type="text" placeholder="Digite o código de 6 dígitos" class="verification-input" maxlength="6">
                            </div>
                        </div>
                        
                        <div class="step" id="step-2">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Confirmação por Telefone</h4>
                                <p>Enviamos um SMS para <strong>(407) ***-0123</strong></p>
                                <input type="text" placeholder="Digite o código de 4 dígitos" class="verification-input" maxlength="4">
                            </div>
                        </div>
                        
                        <div class="step" id="step-3">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Assinatura Digital</h4>
                                <div class="signature-pad">
                                    <canvas id="signature-canvas" width="400" height="200"></canvas>
                                    <div class="signature-actions">
                                        <button class="btn-clear">Clear</button>
                                        <p>Sign with your mouse or finger</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('signature-modal')">Cancel</button>
                    <button class="btn btn-primary" id="nextStepBtn" onclick="nextSignatureStep()">Next</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize signature pad (simplified)
    const canvas = document.getElementById('signature-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        
        canvas.style.border = '1px solid #ddd';
        canvas.style.borderRadius = '4px';
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        
        function startDrawing(e) {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
        
        function draw(e) {
            if (!isDrawing) return;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
        
        function stopDrawing() {
            isDrawing = false;
        }
        
        document.querySelector('.btn-clear').addEventListener('click', function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
}

// Next Signature Step
function nextSignatureStep() {
    const activeStep = document.querySelector('.step.active');
    const nextStep = activeStep.nextElementSibling;
    const nextBtn = document.getElementById('nextStepBtn');
    
    if (nextStep && nextStep.classList.contains('step')) {
        activeStep.classList.remove('active');
        activeStep.classList.add('completed');
        nextStep.classList.add('active');
        
        if (nextStep.id === 'step-3') {
            nextBtn.textContent = 'Complete Signature';
            nextBtn.onclick = completeSignature;
        }
    }
}

// Complete Signature
function completeSignature() {
    closeModal('signature-modal');
    
    // Update contract status
    const contractStatus = document.getElementById('contractStatus');
    const signBtn = document.getElementById('signContractBtn');
    const applicationStatus = document.getElementById('applicationStatus');
    
    if (contractStatus) {
        contractStatus.textContent = 'Contract Signed';
        contractStatus.className = 'contract-status signed';
        contractStatus.style.background = '#d4edda';
        contractStatus.style.color = '#155724';
    }
    
    if (signBtn) {
        signBtn.innerHTML = '<i class="fas fa-check"></i> Signed';
        signBtn.disabled = true;
        signBtn.style.background = '#28a745';
    }
    
    if (applicationStatus) {
        applicationStatus.innerHTML = `
            <span class="status-badge status-approved">Approved</span>
            <span class="status-description">Contract signed - Funds released in 24h</span>
        `;
    }
    
    showAlert('success', 'Contract signed successfully! You will receive the funds within 24 business hours.');
}

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Removed old thumbnail function - using new preview box system

// Preview Document
function previewDocument(docType) {
    const thumbnailElement = document.querySelector(`#thumbnail-${docType} .doc-thumbnail`);
    if (!thumbnailElement) return;
    
    const fileName = thumbnailElement.dataset.fileName || 'Documento';
    const isImage = thumbnailElement.querySelector('img');
    
    if (isImage) {
        const imageSrc = isImage.src;
        showDocumentPreview(fileName, imageSrc);
    } else {
        showAlert('info', 'Preview disponível apenas para imagens. Documento PDF salvo.');
    }
}

// Show Document Preview Modal
function showDocumentPreview(fileName, imageSrc) {
    const modalHTML = `
        <div class="doc-preview-overlay" id="doc-preview-modal" onclick="closeDocumentPreview()">
            <div class="doc-preview-content" onclick="event.stopPropagation()">
                <button class="doc-preview-close" onclick="closeDocumentPreview()">×</button>
                <div class="doc-preview-header">
                    <h4>${fileName}</h4>
                </div>
                <div class="doc-preview-body">
                    <img src="${imageSrc}" alt="${fileName}">
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close Document Preview
function closeDocumentPreview() {
    const modal = document.getElementById('doc-preview-modal');
    if (modal) {
        modal.remove();
    }
}

// Show PDF Preview Modal
function showPDFPreviewModal(docName, file) {
    const modalHTML = `
        <div class="doc-preview-overlay" id="pdf-preview-modal" onclick="closePDFPreview()">
            <div class="doc-preview-content pdf-modal-content" onclick="event.stopPropagation()">
                <button class="doc-preview-close" onclick="closePDFPreview()">×</button>
                <div class="doc-preview-header">
                    <h4><i class="fas fa-file-pdf" style="color: #e74c3c; margin-right: 8px;"></i>${docName}</h4>
                </div>
                <div class="pdf-preview-body">
                    <div class="pdf-info-section">
                        <div class="pdf-large-icon">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div class="pdf-file-details">
                            <h5>${file.name}</h5>
                            <p>Tipo: Documento PDF</p>
                            <p>Tamanho: ${formatFileSize(file.size)}</p>
                            <p>Enviado: ${new Date().toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                    <div class="pdf-actions">
                        <button class="btn btn-outline" onclick="downloadPDF()">
                            <i class="fas fa-download"></i> Baixar PDF
                        </button>
                        <button class="btn btn-primary" onclick="replacePDF()">
                            <i class="fas fa-sync"></i> Substituir Documento
                        </button>
                    </div>
                    <div class="pdf-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Este documento foi enviado com sucesso e está sendo processado pela nossa equipe.</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close PDF Preview
function closePDFPreview() {
    const modal = document.getElementById('pdf-preview-modal');
    if (modal) {
        modal.remove();
    }
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Download PDF (placeholder)
function downloadPDF() {
    showAlert('info', 'Funcionalidade de download em desenvolvimento.');
}

// Replace PDF (placeholder) 
function replacePDF() {
    closePDFPreview();
    showAlert('info', 'Use o botão "Substituir" no documento para enviar um novo arquivo.');
}

// Render PDF as Image
async function renderPDFAsImage(file, previewBox, docType) {
    try {
        // Check if PDF.js is available
        if (typeof pdfjsLib === 'undefined') {
            console.error('PDF.js não está disponível');
            showFallbackPDFPreview(previewBox, docType, file);
            return;
        }
        
        // Set PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        
        // Show loading state
        previewBox.innerHTML = `
            <div class="pdf-loading">
                <i class="fas fa-spinner fa-spin" style="font-size: 20px; color: #3498db;"></i>
                <span style="font-size: 9px; color: #3498db; margin-top: 4px;">Processando PDF...</span>
            </div>
        `;
        
        // Read file as ArrayBuffer
        const fileReader = new FileReader();
        fileReader.onload = async function(e) {
            try {
                const typedArray = new Uint8Array(e.target.result);
                
                // Load PDF document
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                
                // Get first page
                const page = await pdf.getPage(1);
                
                // Create canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                // Set scale for high quality rendering
                const scale = 2.0;
                const viewport = page.getViewport({ scale: scale });
                
                // Calculate dimensions to fit the preview box (120x100)
                const previewWidth = 120;
                const previewHeight = 100;
                
                // Calculate scale to fit preview box while maintaining quality
                const scaleX = previewWidth / viewport.width;
                const scaleY = previewHeight / viewport.height;
                const finalScale = Math.min(scaleX, scaleY) * scale * 0.9; // 0.9 for some padding
                
                const scaledViewport = page.getViewport({ scale: finalScale });
                
                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;
                
                // Render PDF page to canvas
                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                
                await page.render(renderContext).promise;
                
                // Convert canvas to image and display
                const imageDataUrl = canvas.toDataURL('image/png', 0.8);
                
                previewBox.innerHTML = `
                    <div class="pdf-image-preview">
                        <img src="${imageDataUrl}" alt="PDF Preview" onclick="previewDocument('${docType}')">
                        <div class="pdf-badge">
                            <i class="fas fa-file-pdf"></i>
                            <span>PDF</span>
                        </div>
                    </div>
                `;
                
                // Make preview clickable
                previewBox.onclick = () => {
                    const documentNames = {
                        'driver-license': 'Carteira de Motorista',
                        'proof-address': 'Comprovante de Residência',
                        'social-security': 'Social Security Card',
                        'bank-card': 'Cartão Bancário'
                    };
                    showPDFPreviewModal(documentNames[docType] || 'Documento', file);
                };
                
            } catch (renderError) {
                console.error('Erro ao renderizar PDF:', renderError);
                showFallbackPDFPreview(previewBox, docType, file);
            }
        };
        
        fileReader.onerror = function(error) {
            console.error('Erro ao ler arquivo PDF:', error);
            showFallbackPDFPreview(previewBox, docType, file);
        };
        
        fileReader.readAsArrayBuffer(file);
        
    } catch (error) {
        console.error('Erro ao processar PDF:', error);
        showFallbackPDFPreview(previewBox, docType, file);
    }
}

// Fallback PDF Preview (when PDF.js fails)
function showFallbackPDFPreview(previewBox, docType, file) {
    const documentNames = {
        'driver-license': 'Carteira de Motorista',
        'proof-address': 'Comprovante de Residência',
        'social-security': 'Social Security Card',
        'bank-card': 'Cartão Bancário'
    };
    
    const docName = documentNames[docType] || 'Documento';
    
    previewBox.innerHTML = `
        <div class="pdf-preview-container">
            <div class="pdf-document-icon">
                <i class="fas fa-file-pdf" style="color: #e74c3c; font-size: 24px;"></i>
            </div>
            <div class="pdf-document-info">
                <span class="pdf-doc-name">${docName}</span>
                <span class="pdf-file-type">Documento PDF</span>
            </div>
        </div>
    `;
    
    // Make PDF preview clickable to open modal
    previewBox.onclick = () => {
        showPDFPreviewModal(docName, file);
    };
}

// Show Alert (simple version)
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'info' ? '#d1ecf1' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : type === 'info' ? '#0c5460' : '#721c24'};
        padding: 12px 16px;
        border-radius: 6px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'info' ? '#bee5eb' : '#f5c6cb'};
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-size: 13px;
    `;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// ========== COBUYERS MANAGEMENT SYSTEM ==========

let cobuyers = []; // Store cobuyers data

// Initialize Cobuyers Section
function initCobuyersSection() {
    const addBtn = document.getElementById('addCobuyerBtn');
    if (addBtn) {
        addBtn.addEventListener('click', showAddCobuyerModal);
    }
    
    // Load existing cobuyers (if any)
    loadCobuyers();
}

// Load Cobuyers
function loadCobuyers() {
    const userData = getUserFromStorage();
    
    // If master account but no cobuyers, add demo cobuyer
    if (userData && userData.email === 'master@flexcredi.com' && !userData.cobuyers) {
        userData.cobuyers = [
            {
                id: 'cobuyer_demo001',
                fullName: 'Maria Silva Santos',
                email: 'maria.santos@email.com',
                phone: '(407) 555-0124',
                ssn: '***-**-9876',
                address: '1425 International Drive, Orlando, FL',
                zipCode: '32819',
                city: 'Orlando',
                state: 'FL',
                relationship: 'spouse',
                profileComplete: true,
                documentsComplete: false,
                contractSigned: false,
                documents: {
                    driverLicense: { uploaded: false, approved: false, fileName: '', previewData: '' },
                    proofAddress: { uploaded: false, approved: false, fileName: '', previewData: '' },
                    socialSecurity: { uploaded: false, approved: false, fileName: '', previewData: '' },
                    bankCard: { uploaded: false, approved: false, fileName: '', previewData: '' }
                },
                createdAt: '2024-10-10T10:00:00.000Z'
            }
        ];
        
        // Save updated data
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
    }
    
    if (userData && userData.cobuyers) {
        cobuyers = userData.cobuyers;
        renderCobuyers();
    }
}

// Show Add Cobuyer Modal
function showAddCobuyerModal() {
    const modalHTML = `
        <div class="modal-overlay" id="cobuyer-modal">
            <div class="modal-content cobuyer-modal">
                <div class="modal-header">
                    <h3>Add Co-signer</h3>
                    <button class="modal-close" onclick="closeModal('cobuyer-modal')">×</button>
                </div>
                <div class="modal-body">
                    <form id="cobuyerForm">
                        <div class="cobuyer-form-grid">
                            <div class="form-group">
                                <label class="form-label">Full Name *</label>
                                <input type="text" class="form-input" name="fullName" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email *</label>
                                <input type="email" class="form-input" name="email" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Phone *</label>
                                <input type="tel" class="form-input" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">SSN *</label>
                                <input type="text" class="form-input" name="ssn" placeholder="***-**-****" required>
                            </div>
                            <div class="form-group full-width">
                                <label class="form-label">Full Address *</label>
                                <input type="text" class="form-input" name="address" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">ZIP Code *</label>
                                <input type="text" class="form-input" name="zipCode" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">City *</label>
                                <input type="text" class="form-input" name="city" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">State *</label>
                                <input type="text" class="form-input" name="state" maxlength="2" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Relationship</label>
                                <select class="form-input" name="relationship">
                                    <option value="spouse">Spouse</option>
                                    <option value="parent">Parent</option>
                                    <option value="sibling">Sibling</option>
                                    <option value="friend">Friend</option>
                                    <option value="business_partner">Business Partner</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('cobuyer-modal')">Cancel</button>
                    <button class="btn btn-primary" onclick="saveCobuyerForm()">
                        <i class="fas fa-save"></i> Save Co-signer
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Save Cobuyer Form
function saveCobuyerForm() {
    const form = document.getElementById('cobuyerForm');
    const formData = new FormData(form);
    
    const cobuyer = {
        id: 'cobuyer_' + Date.now(),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        ssn: formData.get('ssn'),
        address: formData.get('address'),
        zipCode: formData.get('zipCode'),
        city: formData.get('city'),
        state: formData.get('state'),
        relationship: formData.get('relationship'),
        profileComplete: true,
        documentsComplete: false,
        contractSigned: false,
        documents: {
            driverLicense: { uploaded: false, approved: false },
            proofAddress: { uploaded: false, approved: false },
            socialSecurity: { uploaded: false, approved: false },
            bankCard: { uploaded: false, approved: false }
        },
        createdAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!cobuyer.fullName || !cobuyer.email || !cobuyer.phone || !cobuyer.ssn) {
        showAlert('error', 'Please fill all required fields.');
        return;
    }
    
    // Add to cobuyers array
    cobuyers.push(cobuyer);
    
    // Save to localStorage
    const userData = getUserFromStorage();
    if (userData) {
        userData.cobuyers = cobuyers;
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
    }
    
    // Close modal and render
    closeModal('cobuyer-modal');
    renderCobuyers();
    showAlert('success', 'Co-signer added successfully!');
}

// Render Cobuyers
function renderCobuyers() {
    const cobuyersList = document.getElementById('cobuyersList');
    const emptyState = document.getElementById('emptyState');
    
    if (!cobuyersList) return;
    
    if (cobuyers.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const cobuyersHTML = cobuyers.map(cobuyer => `
        <div class="cobuyer-card" data-id="${cobuyer.id}">
            <div class="cobuyer-header">
                <div class="cobuyer-title">
                    <i class="fas fa-user"></i>
                    <span>${cobuyer.fullName}</span>
                </div>
                <div class="cobuyer-status ${getCobuyerStatus(cobuyer)}">
                    <i class="fas fa-${getCobuyerStatusIcon(cobuyer)}"></i>
                    <span>${getCobuyerStatusText(cobuyer)}</span>
                </div>
                <div class="cobuyer-actions">
                    <button class="btn-edit" id="editCobuyer-${cobuyer.id}" onclick="toggleCobuyerEdit('${cobuyer.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-small btn-remove" onclick="removeCobuyer('${cobuyer.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
            
            <div class="cobuyer-content">
                <div class="cobuyer-info-section">
                    <div class="cobuyer-section-title">Personal Information</div>
                    <div class="cobuyer-profile-wrapper" id="cobuyerProfile-${cobuyer.id}">
                        <div class="cobuyer-profile-grid">
                            ${renderCobuyerProfile(cobuyer)}
                        </div>
                    </div>
                </div>
                
                <div class="cobuyer-info-section">
                    <div class="cobuyer-section-title">Documents</div>
                    <div class="cobuyer-documents-grid">
                        ${renderCobuyerDocuments(cobuyer)}
                    </div>
                </div>
                
                <div class="cobuyer-contract-section">
                    <div class="cobuyer-section-title">Co-signer Contract</div>
                    <div class="cobuyer-contract-status">
                        <div class="contract-info">
                            <i class="fas fa-${cobuyer.contractSigned ? 'check-circle' : 'clock'}"></i>
                            <span>${cobuyer.contractSigned ? 'Contract Signed' : 'Awaiting Signature'}</span>
                        </div>
                        <div class="contract-actions">
                            ${!cobuyer.contractSigned ? `
                                <button class="btn-small btn-edit-cobuyer" onclick="reviewCobuyerContract('${cobuyer.id}')">
                                    <i class="fas fa-eye"></i> Revisar
                                </button>
                                <button class="btn-small btn-edit-cobuyer" onclick="signCobuyerContract('${cobuyer.id}')" ${!cobuyer.documentsComplete ? 'disabled' : ''}>
                                    <i class="fas fa-signature"></i> Assinar
                                </button>
                            ` : `
                                <button class="btn-small" style="background: #d4edda; color: #155724; cursor: default;" disabled>
                                    <i class="fas fa-check"></i> Assinado
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    cobuyersList.innerHTML = cobuyersHTML;
}

// Render Cobuyer Profile
function renderCobuyerProfile(cobuyer) {
    const profileFields = [
        { label: 'Nome Completo', field: 'fullName', value: cobuyer.fullName || '', editable: true },
        { label: 'Email', field: 'email', value: cobuyer.email || '', editable: true },
        { label: 'Telefone', field: 'phone', value: cobuyer.phone || '', editable: true },
        { label: 'SSN', field: 'ssn', value: cobuyer.ssn || '', editable: false },
        { label: 'Endereço', field: 'address', value: cobuyer.address || '', editable: true },
        { label: 'CEP', field: 'zipCode', value: cobuyer.zipCode || '', editable: true },
        { label: 'Cidade', field: 'city', value: cobuyer.city || '', editable: true },
        { label: 'Estado', field: 'state', value: cobuyer.state || '', editable: true },
        { label: 'Relacionamento', field: 'relationship', value: getRelationshipText(cobuyer.relationship) || '', editable: true }
    ];
    
    return profileFields.map(field => `
        <div class="profile-item">
            <div class="profile-label">${field.label}</div>
            <div class="profile-value ${field.editable ? 'editable readonly' : ''}" 
                 data-field="${field.field}" 
                 data-cobuyer-id="${cobuyer.id}">
                ${field.value || 'Not provided'}
            </div>
        </div>
    `).join('');
}

// Render Cobuyer Documents - Same style as Main Signer
function renderCobuyerDocuments(cobuyer) {
    const documents = [
        { key: 'driverLicense', name: 'Driver License', icon: 'id-card', desc: 'Front and back photo' },
        { key: 'proofAddress', name: 'Proof of Address', icon: 'home', desc: 'Utility bill (max. 90 days)' },
        { key: 'socialSecurity', name: 'Social Security Card', icon: 'id-badge', desc: 'Social Security Card' },
        { key: 'bankCard', name: 'Bank Card', icon: 'credit-card', desc: 'For automatic payment debit' }
    ];
    
    // Default placeholder images for documents without uploads
    const defaultImages = {
        driverLicense: 'https://images.pexels.com/photos/45113/pexels-photo-45113.jpeg?auto=compress&cs=tinysrgb&w=400',
        proofAddress: 'https://images.unsplash.com/photo-1554224155-cfa08c2a758f?w=400&q=80',
        socialSecurity: 'https://images.unsplash.com/photo-1487637419635-a2a471ff5c7b?w=400&q=80',
        bankCard: 'https://images.unsplash.com/photo-1752218804057-4fcdd1376f94?w=400&q=80'
    };
    
    return documents.map(doc => {
        const docData = cobuyer.documents ? cobuyer.documents[doc.key] : null;
        const isApproved = docData && docData.approved;
        const isUploaded = docData && (docData.uploaded || docData.url);
        const statusClass = isApproved ? 'status-approved' : 'status-pending';
        const statusIcon = isApproved ? 'fa-check-circle' : 'fa-clock';
        const statusText = isApproved ? 'APPROVED' : 'PENDING';
        const statusBadgeClass = isApproved ? '' : 'pending';
        const imageUrl = (docData && docData.url) ? docData.url : defaultImages[doc.key];
        
        return `
            <div class="document-card ${statusClass}" data-doc="${doc.key}" data-cobuyer-id="${cobuyer.id}">
                <div class="doc-image-container" onclick="viewCobuyerDocument('${imageUrl}', '${doc.name}')">
                    <img src="${imageUrl}" alt="${doc.name}" loading="lazy">
                </div>
                <div class="doc-card-footer">
                    <div class="doc-card-name">${doc.name}</div>
                    <span class="doc-card-status ${statusBadgeClass}">
                        <i class="fas ${statusIcon}"></i> ${statusText}
                    </span>
                    <div class="doc-card-actions">
                        <button class="doc-mini-btn" onclick="event.stopPropagation(); viewCobuyerDocument('${imageUrl}', '${doc.name}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="doc-mini-btn replace" onclick="event.stopPropagation(); replaceCobuyerDocument('${cobuyer.id}', '${doc.key}', '${doc.name}')" title="Replace">
                            <i class="fas fa-camera"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// View cobuyer document in modal
function viewCobuyerDocument(url, name) {
    const modal = document.createElement('div');
    modal.className = 'doc-modal';
    modal.innerHTML = `
        <div class="doc-modal-content">
            <div class="doc-modal-header">
                <h3>${name}</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="doc-modal-body">
                <img src="${url}" alt="${name}">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
}

// Replace cobuyer document
function replaceCobuyerDocument(cobuyerId, docKey, docName) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,.pdf';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const newUrl = ev.target.result;
                
                // Update cobuyer document in storage
                const userData = JSON.parse(localStorage.getItem('flexcredi_user') || '{}');
                if (userData.cobuyers) {
                    const cobuyer = userData.cobuyers.find(c => c.id === cobuyerId);
                    if (cobuyer && cobuyer.documents) {
                        cobuyer.documents[docKey] = {
                            ...cobuyer.documents[docKey],
                            url: newUrl,
                            uploaded: true,
                            approved: false,
                            uploadDate: new Date().toISOString()
                        };
                        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
                    }
                }
                
                // Update UI
                const card = document.querySelector(`[data-doc="${docKey}"][data-cobuyer-id="${cobuyerId}"]`);
                if (card) {
                    const img = card.querySelector('img');
                    if (img) img.src = newUrl;
                    
                    card.classList.remove('status-approved');
                    card.classList.add('status-pending');
                    const statusBadge = card.querySelector('.doc-card-status');
                    if (statusBadge) {
                        statusBadge.className = 'doc-card-status pending';
                        statusBadge.innerHTML = '<i class="fas fa-clock"></i> PENDING';
                    }
                }
                
                showAlert('success', `${docName} uploaded successfully! Awaiting approval.`);
            };
            reader.readAsDataURL(file);
        }
        fileInput.remove();
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
}

// Helper functions for cobuyer status
function getCobuyerStatus(cobuyer) {
    if (cobuyer.contractSigned) return 'status-complete';
    if (cobuyer.documentsComplete) return 'status-incomplete';
    return 'status-incomplete';
}

function getCobuyerStatusIcon(cobuyer) {
    if (cobuyer.contractSigned) return 'check-circle';
    if (cobuyer.documentsComplete) return 'clock';
    return 'exclamation-triangle';
}

function getCobuyerStatusText(cobuyer) {
    if (cobuyer.contractSigned) return 'Complete';
    if (cobuyer.documentsComplete) return 'Awaiting Contract';
    return 'Pending Documents';
}

function getRelationshipText(relationship) {
    const relationships = {
        'spouse': 'Spouse',
        'parent': 'Parent',
        'sibling': 'Sibling',
        'friend': 'Friend',
        'business_partner': 'Business Partner',
        'other': 'Other'
    };
    return relationships[relationship] || relationship;
}

// Edit Cobuyer
function editCobuyer(cobuyerId) {
    // Implementation for editing cobuyer (similar to add modal but with existing data)
    showAlert('info', 'Funcionalidade de edição em desenvolvimento.');
}

// Remove Cobuyer
function removeCobuyer(cobuyerId) {
    if (confirm('Are you sure you want to remove this co-signer?')) {
        cobuyers = cobuyers.filter(c => c.id !== cobuyerId);
        
        // Update localStorage
        const userData = getUserFromStorage();
        if (userData) {
            userData.cobuyers = cobuyers;
            localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        }
        
        renderCobuyers();
        showAlert('success', 'Co-signer removed successfully!');
    }
}

// Manage Cobuyer Document (now handled directly by click on preview box)
function manageCobuyerDocument(cobuyerId, docType) {
    // This function is no longer needed as upload is direct
    // Kept for compatibility but does nothing
    return;
}

// Review Cobuyer Contract
function reviewCobuyerContract(cobuyerId) {
    const cobuyer = cobuyers.find(c => c.id === cobuyerId);
    if (!cobuyer) return;
    
    // Get main signer data
    const mainSignerData = getUserFromStorage();
    
    // Get current language
    const currentLang = localStorage.getItem('flexcredi_language') || 'en';
    
    // Generate co-signer contract HTML
    let contractHtml;
    if (typeof generateCoSignerContractHTML === 'function') {
        contractHtml = contractStyles + generateCoSignerContractHTML(cobuyer, mainSignerData, currentLang);
    } else {
        // Fallback
        contractHtml = `
            <div style="font-family: Times, serif; line-height: 1.6;">
                <h2>CO-SIGNER AGREEMENT</h2>
                <p><strong>CO-SIGNER:</strong> ${cobuyer.fullName}</p>
                <p><strong>LENDER:</strong> FLEXCREDI LLC</p>
                <h4>RESPONSIBILITIES:</h4>
                <ul>
                    <li>Joint liability for loan repayment</li>
                    <li>Credit analysis consent</li>
                    <li>Payment commitment in case of default</li>
                </ul>
            </div>
        `;
    }
    
    // Language tabs
    const languageTabs = `
        <div class="contract-language-tabs">
            <button class="lang-tab ${currentLang === 'en' ? 'active' : ''}" onclick="switchCoSignerContractLanguage('${cobuyerId}', 'en')">
                <i class="fas fa-check-circle"></i> English (Official)
            </button>
            <button class="lang-tab ${currentLang === 'pt' ? 'active' : ''}" onclick="switchCoSignerContractLanguage('${cobuyerId}', 'pt')">
                <i class="fas fa-eye"></i> Português (Preview)
            </button>
            <button class="lang-tab ${currentLang === 'es' ? 'active' : ''}" onclick="switchCoSignerContractLanguage('${cobuyerId}', 'es')">
                <i class="fas fa-eye"></i> Español (Preview)
            </button>
        </div>
    `;
    
    const modalHTML = `
        <div class="modal-overlay" id="cobuyer-contract-modal">
            <div class="modal-content contract-modal" style="max-width: 900px; max-height: 90vh;">
                <div class="modal-header">
                    <h3><i class="fas fa-file-signature"></i> Co-Signer Agreement - ${cobuyer.fullName}</h3>
                    <button class="modal-close" onclick="closeModal('cobuyer-contract-modal')">×</button>
                </div>
                <div class="modal-body" style="padding: 0;">
                    ${languageTabs}
                    <div class="contract-viewer" style="max-height: 60vh; overflow-y: auto; padding: 20px;">
                        <div class="contract-language-notice" style="background: #e8f5e9; border: 1px solid #c8e6c9; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                            <p style="margin: 0;"><strong><i class="fas fa-info-circle"></i> LEGAL NOTICE:</strong> The official contract is in English as required by US law.</p>
                        </div>
                        
                        <div class="contract-content" id="coSignerContractContent">
                            ${contractHtml}
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; gap: 10px; justify-content: flex-end; padding: 15px 20px; border-top: 1px solid #eee;">
                    <button class="btn btn-outline" onclick="closeModal('cobuyer-contract-modal')">Close</button>
                    <button class="btn btn-primary" onclick="closeModal('cobuyer-contract-modal'); signCobuyerContract('${cobuyerId}');">
                        <i class="fas fa-signature"></i> Proceed to Signature
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Switch co-signer contract language
function switchCoSignerContractLanguage(cobuyerId, lang) {
    const cobuyer = cobuyers.find(c => c.id === cobuyerId);
    const mainSignerData = getUserFromStorage();
    if (!cobuyer) return;
    
    // Update tabs
    document.querySelectorAll('#cobuyer-contract-modal .lang-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`#cobuyer-contract-modal .lang-tab[onclick="switchCoSignerContractLanguage('${cobuyerId}', '${lang}')"]`)?.classList.add('active');
    
    // Generate new contract content
    const contractContent = document.getElementById('coSignerContractContent');
    if (contractContent && typeof generateCoSignerContractHTML === 'function') {
        contractContent.innerHTML = contractStyles + generateCoSignerContractHTML(cobuyer, mainSignerData, lang);
    }
}

// Show co-signer contract in English
function showCoSignerContractInEnglish(cobuyerId) {
    switchCoSignerContractLanguage(cobuyerId, 'en');
}

// Sign Cobuyer Contract
function signCobuyerContract(cobuyerId) {
    const cobuyer = cobuyers.find(c => c.id === cobuyerId);
    if (!cobuyer) return;
    
    // Similar to main signature modal but for cobuyer
    const modalHTML = `
        <div class="modal-overlay" id="cobuyer-signature-modal">
            <div class="modal-content signature-modal">
                <div class="modal-header">
                    <h3>Assinatura Eletrônica - ${cobuyer.fullName}</h3>
                </div>
                <div class="modal-body">
                    <div class="signature-steps">
                        <div class="step active" id="cobuyer-step-1">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Confirmação por Email</h4>
                                <p>Enviamos um código para <strong>${cobuyer.email}</strong></p>
                                <input type="text" placeholder="Digite o código de 6 dígitos" class="verification-input" maxlength="6">
                            </div>
                        </div>
                        
                        <div class="step" id="cobuyer-step-2">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Confirmação por Telefone</h4>
                                <p>Enviamos um SMS para <strong>${cobuyer.phone}</strong></p>
                                <input type="text" placeholder="Digite o código de 4 dígitos" class="verification-input" maxlength="4">
                            </div>
                        </div>
                        
                        <div class="step" id="cobuyer-step-3">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Assinatura Digital</h4>
                                <div class="signature-pad">
                                    <canvas id="cobuyer-signature-canvas" width="400" height="200"></canvas>
                                    <div class="signature-actions">
                                        <button class="btn-clear" onclick="clearCobuyerSignature()">Limpar</button>
                                        <p>Assine com seu mouse ou dedo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('cobuyer-signature-modal')">Cancel</button>
                    <button class="btn btn-primary" id="cobuyerNextStepBtn" onclick="nextCobuyerSignatureStep('${cobuyerId}')">Próximo</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize canvas
    initializeCobuyerCanvas();
}

// Initialize Cobuyer Canvas
function initializeCobuyerCanvas() {
    const canvas = document.getElementById('cobuyer-signature-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    canvas.style.border = '1px solid #ddd';
    canvas.style.borderRadius = '4px';
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    
    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
}

// Clear Cobuyer Signature
function clearCobuyerSignature() {
    const canvas = document.getElementById('cobuyer-signature-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Next Cobuyer Signature Step
function nextCobuyerSignatureStep(cobuyerId) {
    const activeStep = document.querySelector('#cobuyer-signature-modal .step.active');
    const nextStep = activeStep.nextElementSibling;
    const nextBtn = document.getElementById('cobuyerNextStepBtn');
    
    if (nextStep && nextStep.classList.contains('step')) {
        activeStep.classList.remove('active');
        activeStep.classList.add('completed');
        nextStep.classList.add('active');
        
        if (nextStep.id === 'cobuyer-step-3') {
            nextBtn.textContent = 'Complete Signature';
            nextBtn.onclick = () => completeCobuyerSignature(cobuyerId);
        }
    }
}

// Complete Cobuyer Signature
function completeCobuyerSignature(cobuyerId) {
    const cobuyerIndex = cobuyers.findIndex(c => c.id === cobuyerId);
    if (cobuyerIndex === -1) return;
    
    // Update cobuyer status
    cobuyers[cobuyerIndex].contractSigned = true;
    
    // Update localStorage
    const userData = getUserFromStorage();
    if (userData) {
        userData.cobuyers = cobuyers;
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
    }
    
    closeModal('cobuyer-signature-modal');
    renderCobuyers();
    
    showAlert('success', `Contrato de co-signatário assinado com sucesso por ${cobuyers[cobuyerIndex].fullName}!`);
}

// ========== COBUYER DOCUMENT UPLOAD SYSTEM ==========

// Debug function to add test cobuyer
window.addTestCobuyer = function() {
    const userData = getUserFromStorage();
    if (!userData) return;
    
    if (!userData.cobuyers) {
        userData.cobuyers = [];
    }
    
    userData.cobuyers.push({
        id: 'cobuyer_test_' + Date.now(),
        fullName: 'Maria Silva Santos',
        email: 'maria.santos@email.com',
        phone: '(407) 555-0124',
        ssn: '***-**-9876',
        address: '1425 International Drive, Orlando, FL',
        zipCode: '32819',
        city: 'Orlando',
        state: 'FL',
        relationship: 'spouse',
        profileComplete: true,
        documentsComplete: false,
        contractSigned: false,
        documents: {
            driverLicense: { uploaded: false, approved: false, fileName: '', previewData: '' },
            proofAddress: { uploaded: false, approved: false, fileName: '', previewData: '' },
            socialSecurity: { uploaded: false, approved: false, fileName: '', previewData: '' },
            bankCard: { uploaded: false, approved: false, fileName: '', previewData: '' }
        },
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('flexcredi_user', JSON.stringify(userData));
    cobuyers = userData.cobuyers;
    renderCobuyers();
    console.log('Cobuyer de teste adicionado');
};



// Get Cobuyer Button Content
function getCobuyerButtonContent(cobuyer, docType) {
    if (cobuyer.documents[docType].uploaded) {
        return '<i class="fas fa-sync"></i> Replace';
    } else {
        return '<i class="fas fa-clock"></i> Pending';
    }
}

// Handle Cobuyer Document Upload
function handleCobuyerDocumentUpload(cobuyerId, docType, file) {
    if (!file) return;
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showAlert('error', 'File too large. Maximum 5MB allowed.');
        return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('error', 'File type not allowed. Use JPG, PNG or PDF.');
        return;
    }
    
    // Get elements
    const previewBox = document.getElementById(`cobuyer-preview-${cobuyerId}-${docType}`);
    const buttonElement = document.getElementById(`cobuyer-btn-${cobuyerId}-${docType}`);
    
    // Disable button during upload
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    }
    
    // Show loading in preview box
    previewBox.innerHTML = `
        <div class="preview-icon">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <span class="preview-text">Uploading...</span>
    `;
    previewBox.className = 'doc-preview-box processing';
    
    // Simulate upload delay
    setTimeout(() => {
        // Update cobuyer document status
        const cobuyerIndex = cobuyers.findIndex(c => c.id === cobuyerId);
        if (cobuyerIndex !== -1) {
            cobuyers[cobuyerIndex].documents[docType].uploaded = true;
            cobuyers[cobuyerIndex].documents[docType].approved = true;
            cobuyers[cobuyerIndex].documents[docType].fileName = file.name;
            
            // Update preview box directly (same as main signer)
            updateCobuyerPreviewBox(cobuyerId, docType, file, previewBox);
            
            // Change button to replace mode
            if (buttonElement) {
                buttonElement.innerHTML = '<i class="fas fa-sync"></i> Substituir';
                buttonElement.className = 'btn-status uploaded';
                buttonElement.disabled = false;
            }
            
            // Check if all documents are complete
            checkCobuyerDocumentsComplete(cobuyerId);
            
            // Update localStorage
            const userData = getUserFromStorage();
            if (userData) {
                userData.cobuyers = cobuyers;
                localStorage.setItem('flexcredi_user', JSON.stringify(userData));
            }
            
            const documentNames = {
                'driverLicense': 'Carteira de Motorista',
                'proofAddress': 'Comprovante de Residência',
                'socialSecurity': 'Social Security Card',
                'bankCard': 'Cartão Bancário'
            };
            
            showAlert('success', `${documentNames[docType]} de ${cobuyers[cobuyerIndex].fullName} enviado com sucesso!`);
        }
    }, 2000);
}

// Update Cobuyer Preview Box
function updateCobuyerPreviewBox(cobuyerId, docType, file, previewBox) {
    if (!previewBox) return;
    
    // Remove pending class and add uploaded class
    previewBox.classList.remove('pending', 'processing');
    previewBox.classList.add('uploaded');
    
    // Update content based on file type
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewBox.innerHTML = `<img src="${e.target.result}" alt="${file.name}" onclick="previewCobuyerDocument('${cobuyerId}', '${docType}')">`;
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        // For PDF files, render first page as image
        renderCobuyerPDFAsImage(file, previewBox, cobuyerId, docType);
    } else {
        // For other files, show icon with filename
        const iconMap = {
            'driverLicense': 'fa-id-card',
            'proofAddress': 'fa-home',
            'socialSecurity': 'fa-id-badge',
            'bankCard': 'fa-credit-card'
        };
        
        const fileName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
        
        previewBox.innerHTML = `
            <div class="preview-icon">
                <i class="fas ${iconMap[docType] || 'fa-file'}" style="color: var(--verde-vibrante);"></i>
            </div>
            <span class="preview-text" style="color: var(--verde-escuro); font-weight: 500; font-size: 9px;">${fileName}</span>
        `;
    }
}

// Render Cobuyer PDF as Image
async function renderCobuyerPDFAsImage(file, previewBox, cobuyerId, docType) {
    try {
        // Check if PDF.js is available
        if (typeof pdfjsLib === 'undefined') {
            console.error('PDF.js não está disponível para co-signatário');
            showCobuyerFallbackPDFPreview(previewBox, cobuyerId, docType, file);
            return;
        }
        
        // Set PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        
        // Read file as ArrayBuffer
        const fileReader = new FileReader();
        fileReader.onload = async function(e) {
            try {
                const typedArray = new Uint8Array(e.target.result);
                
                // Load PDF document
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                
                // Get first page
                const page = await pdf.getPage(1);
                
                // Create canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                // Set scale for high quality rendering
                const scale = 2.0;
                const viewport = page.getViewport({ scale: scale });
                
                // Calculate dimensions to fit the preview box (120x100)
                const previewWidth = 120;
                const previewHeight = 100;
                
                // Calculate scale to fit preview box while maintaining quality
                const scaleX = previewWidth / viewport.width;
                const scaleY = previewHeight / viewport.height;
                const finalScale = Math.min(scaleX, scaleY) * scale * 0.9; // 0.9 for some padding
                
                const scaledViewport = page.getViewport({ scale: finalScale });
                
                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;
                
                // Render PDF page to canvas
                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                
                await page.render(renderContext).promise;
                
                // Convert canvas to image and display
                const imageDataUrl = canvas.toDataURL('image/png', 0.8);
                
                const previewData = `
                    <div class="pdf-image-preview">
                        <img src="${imageDataUrl}" alt="PDF Preview" onclick="previewCobuyerDocument('${cobuyerId}', '${docType}')">
                        <div class="pdf-badge">
                            <i class="fas fa-file-pdf"></i>
                            <span>PDF</span>
                        </div>
                    </div>
                `;
                
                previewBox.innerHTML = previewData;
                
            } catch (renderError) {
                console.error('Erro ao renderizar PDF do co-signatário:', renderError);
                showCobuyerFallbackPDFPreview(previewBox, cobuyerId, docType, file);
            }
        };
        
        fileReader.onerror = function(error) {
            console.error('Erro ao ler arquivo PDF do co-signatário:', error);
            showCobuyerFallbackPDFPreview(previewBox, cobuyerId, docType, file);
        };
        
        fileReader.readAsArrayBuffer(file);
        
    } catch (error) {
        console.error('Erro ao processar PDF do co-signatário:', error);
        showCobuyerFallbackPDFPreview(previewBox, cobuyerId, docType, file);
    }
}

// Fallback PDF Preview for Cobuyer
function showCobuyerFallbackPDFPreview(previewBox, cobuyerId, docType, file) {
    const documentNames = {
        'driverLicense': 'Carteira de Motorista',
        'proofAddress': 'Comprovante de Residência',
        'socialSecurity': 'Social Security Card',
        'bankCard': 'Cartão Bancário'
    };
    
    const docName = documentNames[docType] || 'Documento';
    
    previewBox.innerHTML = `
        <div class="pdf-preview-container">
            <div class="pdf-document-icon">
                <i class="fas fa-file-pdf" style="color: #e74c3c; font-size: 24px;"></i>
            </div>
            <div class="pdf-document-info">
                <span class="pdf-doc-name">${docName}</span>
                <span class="pdf-file-type">Documento PDF</span>
            </div>
        </div>
    `;
}

// Check Cobuyer Documents Complete
function checkCobuyerDocumentsComplete(cobuyerId) {
    const cobuyerIndex = cobuyers.findIndex(c => c.id === cobuyerId);
    if (cobuyerIndex === -1) return;
    
    const cobuyer = cobuyers[cobuyerIndex];
    const docs = cobuyer.documents;
    
    // Check if all documents are uploaded and approved
    const allComplete = docs.driverLicense.uploaded && docs.driverLicense.approved &&
                       docs.proofAddress.uploaded && docs.proofAddress.approved &&
                       docs.socialSecurity.uploaded && docs.socialSecurity.approved &&
                       docs.bankCard.uploaded && docs.bankCard.approved;
    
    cobuyers[cobuyerIndex].documentsComplete = allComplete;
    
    if (allComplete) {
        showAlert('success', `Todos os documentos de ${cobuyer.fullName} foram enviados com sucesso!`);
    }
}

// Preview Cobuyer Document
function previewCobuyerDocument(cobuyerId, docType) {
    const cobuyer = cobuyers.find(c => c.id === cobuyerId);
    if (!cobuyer || !cobuyer.documents[docType].uploaded) return;
    
    const documentNames = {
        'driverLicense': 'Carteira de Motorista',
        'proofAddress': 'Comprovante de Residência',
        'socialSecurity': 'Social Security Card',
        'bankCard': 'Cartão Bancário'
    };
    
    const docName = documentNames[docType] || 'Documento';
    const fileName = cobuyer.documents[docType].fileName || 'documento';
    
    // For now, show info modal - can be enhanced to show actual document
    showAlert('info', `Preview de ${docName} de ${cobuyer.fullName}: ${fileName}`);
}

// Get Cobuyer Main Preview Content (for main dashboard display)
function getCobuyerMainPreviewContent(cobuyer, docType, iconName) {
    const docData = cobuyer.documents[docType];
    
    if (docData.uploaded && docData.previewData) {
        // Show actual preview from uploaded document
        return docData.previewData;
    } else {
        // Show pending state with icon
        return `
            <div class="preview-icon">
                <i class="fas fa-${iconName}"></i>
            </div>
            <span class="preview-text">Pending</span>
        `;
    }
}

// Get Status Icon
function getStatusIcon(statusClass) {
    switch(statusClass) {
        case 'approved': return 'check-circle';
        case 'uploaded': return 'clock';
        case 'pending': return 'exclamation-circle';
        default: return 'clock';
    }
}

// ========== MAIN SIGNER SYSTEM (UNIFIED WITH COBUYERS) ==========

// Load Main Signer Section
function loadMainSignerSection(userData) {
    if (!userData) return;
    
    // Ensure userData has document structure
    if (!userData.documents) {
        userData.documents = {
            driverLicense: { uploaded: false, approved: false, fileName: '', previewData: '' },
            proofAddress: { uploaded: false, approved: false, fileName: '', previewData: '' },
            socialSecurity: { uploaded: false, approved: false, fileName: '', previewData: '' },
            bankCard: { uploaded: false, approved: false, fileName: '', previewData: '' }
        };
        // Save the updated userData with documents structure
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
    }
    
    // Update signer name
    const signerNameElement = document.getElementById('signerFullName');
    if (signerNameElement) {
        signerNameElement.textContent = userData.fullName || 'Main Signer';
    }
    
    // Render profile
    renderMainSignerProfile(userData);
    
    // Render documents (using exact co-signer structure)
    renderMainSignerDocuments(userData);
    
    // Update status
    updateMainSignerStatus(userData);
}

// Render Main Signer Profile
function renderMainSignerProfile(userData) {
    const profileContainer = document.querySelector('.cobuyer-profile-grid');
    if (!profileContainer) return;
    
    const profileFields = [
        { label: 'Full Name', field: 'fullName', value: userData.fullName || '', editable: true },
        { label: 'Email', field: 'email', value: userData.email || '', editable: true },
        { label: 'Phone', field: 'phone', value: userData.phone || '', editable: true },
        { label: 'SSN', field: 'ssn', value: userData.ssn || '', editable: false },
        { label: 'Address', field: 'address', value: userData.address || '', editable: true },
        { label: 'ZIP Code', field: 'zipCode', value: userData.zipCode || '', editable: true },
        { label: 'City', field: 'city', value: userData.city || '', editable: true },
        { label: 'State', field: 'state', value: userData.state || '', editable: true }
    ];
    
    profileContainer.innerHTML = profileFields.map(field => `
        <div class="profile-item">
            <div class="profile-label">${field.label}</div>
            <div class="profile-value ${field.editable ? 'editable readonly' : ''}" 
                 data-field="${field.field}" 
                 data-signer="main">
                ${field.value || 'Not provided'}
            </div>
        </div>
    `).join('');
}

// Render Main Signer Documents (EXACT COPY of co-signer structure)
function renderMainSignerDocuments(userData) {
    const documentsContainer = document.getElementById('signerDocuments');
    if (!documentsContainer) return;
    
    const documents = [
        { key: 'driverLicense', name: 'Driver License', icon: 'id-card', desc: 'Front and back photo' },
        { key: 'proofAddress', name: 'Proof of Address', icon: 'home', desc: 'Utility bill (max. 90 days)' },
        { key: 'socialSecurity', name: 'Social Security Card', icon: 'id-badge', desc: 'Social Security Card' },
        { key: 'bankCard', name: 'Bank Card', icon: 'credit-card', desc: 'For automatic payment debit' }
    ];
    
    documentsContainer.innerHTML = documents.map(doc => {
        const docData = userData.documents[doc.key];
        const statusClass = docData.approved ? 'uploaded' : docData.uploaded ? 'uploaded' : 'pending';
        
        return `
            <div class="document-card cobuyer-document-card" data-doc="${doc.key}">
                <div class="doc-header">
                    <div class="doc-icon">
                        <i class="fas fa-${doc.icon}"></i>
                    </div>
                    <div class="doc-info">
                        <h4>${doc.name}</h4>
                        <p>${doc.desc}</p>
                    </div>
                </div>
                
                <div class="doc-preview-box ${statusClass}" 
                     id="signer-preview-${doc.key}" 
                     onclick="document.getElementById('signer-file-${doc.key}').click()">
                    ${getSignerMainPreviewContent(userData, doc.key, doc.icon)}
                </div>
                
                <div class="doc-actions">
                    <input type="file" 
                           id="signer-file-${doc.key}" 
                           accept="image/*,.pdf" 
                           style="display: none;"
                           onchange="handleSignerDocumentUpload('${doc.key}', this.files[0])">
                    <button class="btn-status ${statusClass}" 
                            id="signer-btn-${doc.key}"
                            onclick="document.getElementById('signer-file-${doc.key}').click()">
                        ${getSignerButtonContent(userData, doc.key)}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Get Signer Main Preview Content
function getSignerMainPreviewContent(userData, docType, iconName) {
    const docData = userData.documents[docType];
    
    if (docData && docData.uploaded && docData.previewData) {
        // Show the uploaded file preview
        if (docData.fileType && docData.fileType.startsWith('image/')) {
            return `<img src="${docData.previewData}" alt="${docData.fileName}" onclick="previewSignerDocument('${docType}')" style="max-width: 100%; height: auto; cursor: pointer; border-radius: 6px;">`;
        } else if (docData.fileType === 'application/pdf') {
            return `
                <div class="preview-icon" onclick="previewSignerDocument('${docType}')" style="cursor: pointer;">
                    <i class="fas fa-file-pdf" style="font-size: 48px; color: #e74c3c;"></i>
                </div>
                <span class="preview-text">${docData.fileName}</span>
            `;
        } else {
            return `
                <div class="preview-icon" onclick="previewSignerDocument('${docType}')" style="cursor: pointer;">
                    <i class="fas fa-${iconName}"></i>
                </div>
                <span class="preview-text">${docData.fileName}</span>
            `;
        }
    } else {
        return `
            <div class="preview-icon">
                <i class="fas fa-${iconName}"></i>
            </div>
            <span class="preview-text">Pending</span>
        `;
    }
}

// Get Signer Button Content
function getSignerButtonContent(userData, docType) {
    if (userData.documents[docType].uploaded) {
        return '<i class="fas fa-sync"></i> Replace';
    } else {
        return '<i class="fas fa-clock"></i> Pending';
    }
}

// 🔄 Sync Document with Backend API
async function syncDocumentWithBackend(userData, docType) {
    const API_BASE = 'https://flexcredi-site-adm-production-b27d.up.railway.app';
    
    try {
        console.log(`🌐 Syncing ${docType} with backend...`);
        
        // Prepare document data
        const documentData = userData.documents[docType];
        const payload = {
            clientId: userData.id || userData.applicationId,
            email: userData.email,
            fullName: userData.fullName || userData.name,
            documentType: docType,
            document: {
                fileName: documentData.fileName,
                fileType: documentData.fileType,
                fileSize: documentData.fileSize,
                previewData: documentData.previewData,
                uploaded: documentData.uploaded,
                approved: documentData.approved,
                uploadDate: documentData.uploadDate
            },
            // Include all user data for full sync
            userData: {
                fullName: userData.fullName || userData.name,
                email: userData.email,
                phone: userData.phone,
                ssn: userData.ssn,
                dateOfBirth: userData.dateOfBirth,
                address: userData.address,
                city: userData.city,
                state: userData.state,
                zipCode: userData.zipCode,
                loanAmount: userData.loanAmount,
                creditScore: userData.creditScore,
                status: userData.status,
                preApproval: userData.preApproval,
                documents: userData.documents
            }
        };
        
        console.log('📦 Payload:', {
            clientId: payload.clientId,
            email: payload.email,
            documentType: payload.documentType,
            fileName: payload.document.fileName
        });
        
        // Send to test-data endpoint (for test clients)
        const endpoint = `${API_BASE}/api/test-data/clients`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            console.error('❌ Backend sync failed:', response.status, response.statusText);
            return false;
        }
        
        const result = await response.json();
        console.log('✅ Backend sync success:', result);
        
        // Also sync to applications endpoint
        const appEndpoint = `${API_BASE}/api/test-data/applications`;
        const appResponse = await fetch(appEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (appResponse.ok) {
            console.log('✅ Application data synced');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Sync error:', error);
        return false;
    }
}

// Handle Signer Document Upload
function handleSignerDocumentUpload(docType, file) {
    if (!file) return;
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showAlert('error', 'File too large. Maximum 5MB allowed.');
        return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('error', 'File type not allowed. Use JPG, PNG or PDF.');
        return;
    }
    
    // Get elements
    const previewBox = document.getElementById(`signer-preview-${docType}`);
    const buttonElement = document.getElementById(`signer-btn-${docType}`);
    
    // Disable button during upload
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    }
    
    // Show loading in preview box
    previewBox.innerHTML = `
        <div class="preview-icon">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <span class="preview-text">Uploading...</span>
    `;
    previewBox.className = 'doc-preview-box processing';
    
    // Convert file to base64 for storage
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileData = e.target.result; // base64 data
        
        // Simulate upload delay
        setTimeout(() => {
            // Update user data
            const userData = getUserFromStorage();
            if (userData) {
                // CRITICAL: Save file data for persistence
                userData.documents[docType] = {
                    uploaded: true,
                    approved: true,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    previewData: fileData, // Save base64 for reload
                    uploadDate: new Date().toISOString()
                };
                
                console.log(`📤 Document ${docType} uploaded:`, {
                    fileName: file.name,
                    size: (file.size / 1024).toFixed(2) + 'KB',
                    type: file.type,
                    dataLength: fileData.length
                });
                
                // Update preview box
                updateSignerPreviewBox(docType, file, previewBox, fileData);
                
                // Change button to replace mode
                if (buttonElement) {
                    buttonElement.innerHTML = '<i class="fas fa-sync"></i> Substituir';
                    buttonElement.className = 'btn-status uploaded';
                    buttonElement.disabled = false;
                }
                
                // CRITICAL: Save to localStorage with document data
                localStorage.setItem('flexcredi_user', JSON.stringify(userData));
                console.log('💾 Document saved to localStorage');
                
                // 🔄 SYNC WITH BACKEND - Send document to API
                syncDocumentWithBackend(userData, docType)
                    .then(synced => {
                        if (synced) {
                            console.log('✅ Document synced with backend successfully');
                        } else {
                            console.warn('⚠️  Document saved locally but backend sync failed');
                        }
                    })
                    .catch(err => {
                        console.error('❌ Backend sync error:', err);
                    });
                
                // Verificar se todos os documentos foram aprovados para processar aprovação final
                if (processToFinalApproval(userData)) {
                    // Recarregar interface com novos dados de aprovação final
                    setTimeout(() => {
                        updateFinancingDetailsInHeader(userData);
                        updateContractInformation(userData);
                    }, 1000);
                }
                
                // Update status
                updateMainSignerStatus(userData);
                
                const documentNames = {
                    'driverLicense': 'Carteira de Motorista',
                    'proofAddress': 'Comprovante de Residência',
                    'socialSecurity': 'Social Security Card',
                    'bankCard': 'Cartão Bancário'
                };
                
                showAlert('success', `${documentNames[docType]} enviado com sucesso!`);
            }
        }, 2000);
    };
    
    // Read file as base64
    reader.readAsDataURL(file);
}

// Update Signer Preview Box
function updateSignerPreviewBox(docType, file, previewBox, fileData) {
    if (!previewBox) return;
    
    // Remove pending class and add uploaded class
    previewBox.classList.remove('pending', 'processing');
    previewBox.classList.add('uploaded');
    
    // Update content based on file type
    if (file.type.startsWith('image/')) {
        // Use the fileData (base64) directly
        previewBox.innerHTML = `<img src="${fileData}" alt="${file.name}" onclick="previewSignerDocument('${docType}')" style="max-width: 100%; height: auto; cursor: pointer;">`;
    } else if (file.type === 'application/pdf') {
        // For PDF files, show PDF icon
        previewBox.innerHTML = `
            <div class="preview-icon" onclick="previewSignerDocument('${docType}')" style="cursor: pointer;">
                <i class="fas fa-file-pdf" style="font-size: 48px; color: #e74c3c;"></i>
            </div>
            <span class="preview-text">${file.name}</span>
        `;
    } else {
        // For other files, show icon with filename
        const iconMap = {
            'driverLicense': 'fa-id-card',
            'proofAddress': 'fa-home',
            'socialSecurity': 'fa-id-badge',
            'bankCard': 'fa-credit-card'
        };
        
        const fileName = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
        
        previewBox.innerHTML = `
            <div class="preview-icon">
                <i class="fas ${iconMap[docType] || 'fa-file'}" style="color: var(--verde-vibrante);"></i>
            </div>
            <span class="preview-text" style="color: var(--verde-escuro); font-weight: 500; font-size: 8px;">${fileName}</span>
        `;
    }
}

// Render Signer PDF as Image
async function renderSignerPDFAsImage(file, previewBox, docType) {
    try {
        // Check if PDF.js is available
        if (typeof pdfjsLib === 'undefined') {
            console.error('PDF.js não está disponível para signatário');
            showSignerFallbackPDFPreview(previewBox, docType, file);
            return;
        }
        
        // Set PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        
        // Read file as ArrayBuffer
        const fileReader = new FileReader();
        fileReader.onload = async function(e) {
            try {
                const typedArray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
                const page = await pdf.getPage(1);
                
                // Create canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                const scale = 2.0;
                const viewport = page.getViewport({ scale: scale });
                
                // Calculate dimensions to fit the preview box (100x80)
                const previewWidth = 100;
                const previewHeight = 80;
                
                const scaleX = previewWidth / viewport.width;
                const scaleY = previewHeight / viewport.height;
                const finalScale = Math.min(scaleX, scaleY) * scale * 0.9;
                
                const scaledViewport = page.getViewport({ scale: finalScale });
                
                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;
                
                // Render PDF page to canvas
                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                
                await page.render(renderContext).promise;
                
                // Convert canvas to image and display
                const imageDataUrl = canvas.toDataURL('image/png', 0.8);
                
                previewBox.innerHTML = `
                    <div class="pdf-image-preview">
                        <img src="${imageDataUrl}" alt="PDF Preview" onclick="previewSignerDocument('${docType}')">
                        <div class="pdf-badge">
                            <i class="fas fa-file-pdf"></i>
                            <span>PDF</span>
                        </div>
                    </div>
                `;
                
            } catch (renderError) {
                console.error('Erro ao renderizar PDF do signatário:', renderError);
                showSignerFallbackPDFPreview(previewBox, docType, file);
            }
        };
        
        fileReader.onerror = function(error) {
            console.error('Erro ao ler arquivo PDF do signatário:', error);
            showSignerFallbackPDFPreview(previewBox, docType, file);
        };
        
        fileReader.readAsArrayBuffer(file);
        
    } catch (error) {
        console.error('Erro ao processar PDF do signatário:', error);
        showSignerFallbackPDFPreview(previewBox, docType, file);
    }
}

// Fallback PDF Preview for Signer
function showSignerFallbackPDFPreview(previewBox, docType, file) {
    const documentNames = {
        'driverLicense': 'Carteira de Motorista',
        'proofAddress': 'Comprovante de Residência',
        'socialSecurity': 'Social Security Card',
        'bankCard': 'Cartão Bancário'
    };
    
    const docName = documentNames[docType] || 'Documento';
    
    previewBox.innerHTML = `
        <div class="pdf-preview-container">
            <div class="pdf-document-icon">
                <i class="fas fa-file-pdf" style="color: #e74c3c; font-size: 24px;"></i>
            </div>
            <div class="pdf-document-info">
                <span class="pdf-doc-name">${docName}</span>
                <span class="pdf-file-type">Documento PDF</span>
            </div>
        </div>
    `;
}

// Update Main Signer Status
function updateMainSignerStatus(userData) {
    const statusElement = document.getElementById('signerOverallStatus');
    const completionElement = document.getElementById('mainSignerStatus');
    
    if (!userData || !userData.documents) return;
    
    // Check document completion
    const docs = userData.documents;
    const docsUploaded = Object.values(docs).filter(doc => doc.uploaded).length;
    const totalDocs = 4;
    
    // Update completion indicator
    if (completionElement) {
        if (docsUploaded === totalDocs) {
            completionElement.textContent = 'Completo';
            completionElement.style.background = '#d4edda';
            completionElement.style.color = '#155724';
        } else {
            completionElement.textContent = `${docsUploaded}/${totalDocs} Documents`;
            completionElement.style.background = '#fff3cd';
            completionElement.style.color = '#856404';
        }
    }
    
    // Update status badge
    if (statusElement) {
        if (docsUploaded === totalDocs) {
            statusElement.className = 'signer-status status-complete';
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i><span>Completo</span>';
        } else {
            statusElement.className = 'signer-status status-incomplete';
            statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Pending Documents</span>';
        }
    }
}

// Preview Signer Document
function previewSignerDocument(docType) {
    const userData = getUserFromStorage();
    if (!userData || !userData.documents[docType].uploaded) return;
    
    const documentNames = {
        'driverLicense': 'Carteira de Motorista',
        'proofAddress': 'Comprovante de Residência',
        'socialSecurity': 'Social Security Card',
        'bankCard': 'Cartão Bancário'
    };
    
    const docName = documentNames[docType] || 'Documento';
    const fileName = userData.documents[docType].fileName || 'documento';
    
    showAlert('info', `Preview de ${docName}: ${fileName}`);
}

// Toggle Signer Edit Mode
function toggleSignerEdit() {
    const profileWrapper = document.getElementById('signerProfile');
    const editBtn = document.getElementById('editSignerBtn');
    
    if (!profileWrapper || !editBtn) {
        showAlert('error', 'Elementos de edição não encontrados.');
        return;
    }
    
    const isEditing = profileWrapper.classList.contains('editing');
    
    if (isEditing) {
        saveSignerProfileChanges();
    } else {
        enterSignerEditMode();
    }
}

// Enter Signer Edit Mode
function enterSignerEditMode() {
    const profileWrapper = document.getElementById('signerProfile');
    const editBtn = document.getElementById('editSignerBtn');
    const editableFields = document.querySelectorAll('[data-signer="main"].profile-value.editable');
    
    // Add editing class to wrapper
    profileWrapper.classList.add('cobuyer-profile-wrapper', 'editing');
    
    // Change button to save mode
    editBtn.classList.add('save-mode');
    editBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    
    // Convert text to inputs for editable fields
    editableFields.forEach(field => {
        if (field.classList.contains('editable')) {
            const currentValue = field.textContent.trim();
            const displayValue = currentValue === 'Não informado' ? '' : currentValue;
            const fieldName = field.dataset.field;
            
            field.innerHTML = `<input type="text" value="${displayValue}" class="profile-edit-input" data-field="${fieldName}" placeholder="Digite aqui...">`;
            
            // Add keyboard handlers
            const input = field.querySelector('input');
            if (input) {
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveSignerProfileChanges();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        exitSignerEditModeWithoutSaving();
                    }
                });
                
                // Focus first field
                if (field === editableFields[0]) {
                    input.focus();
                    input.select();
                }
            }
        }
    });
}

// Save Signer Profile Changes
function saveSignerProfileChanges() {
    const profileWrapper = document.getElementById('signerProfile');
    const editBtn = document.getElementById('editSignerBtn');
    const editableFields = document.querySelectorAll('[data-signer="main"].profile-value.editable');
    const userData = getUserFromStorage();
    
    if (!userData) {
        showAlert('error', 'Erro ao salvar dados do usuário.');
        return;
    }
    
    let hasChanges = false;
    
    // Collect changes from inputs
    editableFields.forEach(field => {
        const input = field.querySelector('input');
        if (input) {
            const fieldName = input.dataset.field || field.dataset.field;
            const newValue = input.value.trim();
            const displayValue = newValue || 'Não informado';
            
            // Update field display
            field.innerHTML = displayValue;
            
            // Update userData
            if (userData[fieldName] !== newValue) {
                userData[fieldName] = newValue;
                hasChanges = true;
            }
        }
    });
    
    // Exit edit mode
    profileWrapper.classList.remove('editing');
    editBtn.classList.remove('save-mode');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    
    // Save to localStorage
    if (hasChanges) {
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        
        // Update signer name in header
        const signerNameElement = document.getElementById('signerFullName');
        if (signerNameElement) {
            signerNameElement.textContent = userData.fullName || 'Signatário Principal';
        }
        
        // Update main header greeting
        updateUserInterface(userData);
        
        showAlert('success', 'Informações salvas com sucesso!');
    } else {
        showAlert('info', 'Nenhuma alteração foi feita.');
    }
}

// Exit Signer Edit Mode Without Saving
function exitSignerEditModeWithoutSaving() {
    const profileWrapper = document.getElementById('signerProfile');
    const editBtn = document.getElementById('editSignerBtn');
    const userData = getUserFromStorage();
    
    // Exit edit mode
    profileWrapper.classList.remove('editing');
    editBtn.classList.remove('save-mode');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    
    // Restore original values
    renderMainSignerProfile(userData);
    
    showAlert('info', 'Edição cancelada.');
}

// Legacy functions for compatibility
function loadProfileSection(userData) {
    // Redirect to new unified system
    loadMainSignerSection(userData);
}

function initDocumentUploads() {
    // Document upload handlers are now integrated in the unified system
    console.log('Document upload handlers initialized via unified signer system');
}

// ========== COBUYER PROFILE EDITING SYSTEM ==========

// Toggle Cobuyer Edit Mode
function toggleCobuyerEdit(cobuyerId) {
    const profileWrapper = document.getElementById(`cobuyerProfile-${cobuyerId}`);
    const editBtn = document.getElementById(`editCobuyer-${cobuyerId}`);
    
    if (!profileWrapper || !editBtn) {
        showAlert('error', 'Elementos de edição não encontrados.');
        return;
    }
    
    const isEditing = profileWrapper.classList.contains('editing');
    
    if (isEditing) {
        saveCobuyerProfileChanges(cobuyerId);
    } else {
        enterCobuyerEditMode(cobuyerId);
    }
}

// Enter Cobuyer Edit Mode
function enterCobuyerEditMode(cobuyerId) {
    const profileWrapper = document.getElementById(`cobuyerProfile-${cobuyerId}`);
    const editBtn = document.getElementById(`editCobuyer-${cobuyerId}`);
    const editableFields = document.querySelectorAll(`[data-cobuyer-id="${cobuyerId}"].profile-value.editable`);
    
    // Add editing class to wrapper
    profileWrapper.classList.add('editing');
    
    // Change button to save mode
    editBtn.classList.add('save-mode');
    editBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    
    // Convert text to inputs for editable fields
    editableFields.forEach(field => {
        if (field.classList.contains('editable')) {
            const currentValue = field.textContent.trim();
            const displayValue = currentValue === 'Não informado' ? '' : currentValue;
            const fieldName = field.dataset.field;
            
            // Special handling for relationship field
            if (fieldName === 'relationship') {
                const cobuyer = cobuyers.find(c => c.id === cobuyerId);
                const currentRelationship = cobuyer ? cobuyer.relationship : 'other';
                
                field.innerHTML = `
                    <select class="profile-edit-input" data-field="${fieldName}">
                        <option value="spouse" ${currentRelationship === 'spouse' ? 'selected' : ''}>Spouse</option>
                        <option value="parent" ${currentRelationship === 'parent' ? 'selected' : ''}>Parent</option>
                        <option value="sibling" ${currentRelationship === 'sibling' ? 'selected' : ''}>Sibling</option>
                        <option value="friend" ${currentRelationship === 'friend' ? 'selected' : ''}>Friend</option>
                        <option value="business_partner" ${currentRelationship === 'business_partner' ? 'selected' : ''}>Parceiro de Negócio</option>
                        <option value="other" ${currentRelationship === 'other' ? 'selected' : ''}>Outro</option>
                    </select>
                `;
            } else {
                field.innerHTML = `<input type="text" value="${displayValue}" class="profile-edit-input" data-field="${fieldName}" placeholder="Digite aqui...">`;
            }
            
            // Add keyboard handlers for inputs
            const input = field.querySelector('input, select');
            if (input && input.tagName === 'INPUT') {
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveCobuyerProfileChanges(cobuyerId);
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        exitCobuyerEditModeWithoutSaving(cobuyerId);
                    }
                });
                
                // Focus first field
                if (field === editableFields[0]) {
                    input.focus();
                    input.select();
                }
            }
        }
    });
}

// Save Cobuyer Profile Changes
function saveCobuyerProfileChanges(cobuyerId) {
    const profileWrapper = document.getElementById(`cobuyerProfile-${cobuyerId}`);
    const editBtn = document.getElementById(`editCobuyer-${cobuyerId}`);
    const editableFields = document.querySelectorAll(`[data-cobuyer-id="${cobuyerId}"].profile-value.editable`);
    
    const cobuyerIndex = cobuyers.findIndex(c => c.id === cobuyerId);
    if (cobuyerIndex === -1) {
        showAlert('error', 'Cosignatário não encontrado.');
        return;
    }
    
    let hasChanges = false;
    const cobuyer = cobuyers[cobuyerIndex];
    
    // Collect changes from inputs
    editableFields.forEach(field => {
        const input = field.querySelector('input, select');
        if (input) {
            const fieldName = input.dataset.field || field.dataset.field;
            const newValue = input.value.trim();
            let displayValue;
            
            // Special handling for relationship field
            if (fieldName === 'relationship') {
                displayValue = getRelationshipText(newValue) || 'Não informado';
            } else {
                displayValue = newValue || 'Não informado';
            }
            
            // Update field display
            field.innerHTML = displayValue;
            
            // Update cobuyer data
            if (cobuyer[fieldName] !== newValue) {
                cobuyer[fieldName] = newValue;
                hasChanges = true;
            }
        }
    });
    
    // Exit edit mode
    profileWrapper.classList.remove('editing');
    editBtn.classList.remove('save-mode');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    
    // Save to localStorage
    if (hasChanges) {
        const userData = getUserFromStorage();
        if (userData) {
            userData.cobuyers = cobuyers;
            localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        }
        showAlert('success', `Informações de ${cobuyer.fullName} salvas com sucesso!`);
    } else {
        showAlert('info', 'Nenhuma alteração foi feita.');
    }
}

// Exit Cobuyer Edit Mode Without Saving
function exitCobuyerEditModeWithoutSaving(cobuyerId) {
    const profileWrapper = document.getElementById(`cobuyerProfile-${cobuyerId}`);
    const editBtn = document.getElementById(`editCobuyer-${cobuyerId}`);
    const cobuyer = cobuyers.find(c => c.id === cobuyerId);
    
    if (!cobuyer) {
        showAlert('error', 'Cosignatário não encontrado.');
        return;
    }
    
    // Exit edit mode
    profileWrapper.classList.remove('editing');
    editBtn.classList.remove('save-mode');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    
    // Restore original values by re-rendering the profile
    const profileGrid = profileWrapper.querySelector('.cobuyer-profile-grid');
    if (profileGrid) {
        profileGrid.innerHTML = renderCobuyerProfile(cobuyer);
    }
    
    showAlert('info', 'Edição cancelada.');
}

// ========== CLIENT FUNCTIONS SYSTEM ==========

// Initialize Client Functions
function initClientFunctions() {
    // Add event listeners to function cards (horizontal layout)
    const makePaymentsCard = document.getElementById('makePaymentsCard');
    const viewStatementsCard = document.getElementById('viewStatementsCard');
    const trackProgressCard = document.getElementById('trackProgressCard');
    const accountSettingsCard = document.getElementById('accountSettingsCard');
    const getSupportCard = document.getElementById('getSupportCard');
    
    if (makePaymentsCard) {
        makePaymentsCard.addEventListener('click', () => openFunctionModal('payments'));
    }
    
    if (viewStatementsCard) {
        viewStatementsCard.addEventListener('click', () => openFunctionModal('statements'));
    }
    
    if (trackProgressCard) {
        trackProgressCard.addEventListener('click', () => openFunctionModal('progress'));
    }
    
    if (accountSettingsCard) {
        accountSettingsCard.addEventListener('click', () => openFunctionModal('settings'));
    }
    
    if (getSupportCard) {
        getSupportCard.addEventListener('click', () => openFunctionModal('support'));
    }
}

// Open Function Modal
function openFunctionModal(type) {
    const modalContent = getFunctionModalContent(type);
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'function-modal';
    modal.id = `modal-${type}`;
    
    modal.innerHTML = `
        <div class="function-modal-content">
            <div class="function-modal-header">
                <div class="function-modal-title">
                    ${modalContent.icon}
                    <span>${modalContent.title}</span>
                </div>
                <button class="function-modal-close" onclick="closeFunctionModal('${type}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="function-modal-body">
                ${modalContent.body}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFunctionModal(type);
        }
    });
}

// Close Function Modal
function closeFunctionModal(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// Get Function Modal Content
function getFunctionModalContent(type) {
    const contents = {
        payments: {
            icon: '<i class="fas fa-credit-card"></i>',
            title: 'Make Payments',
            body: `
                <h3>Pagamento de Parcelas</h3>
                <p>Pague suas parcelas mensais de forma segura e rápida.</p>
                
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4>Próxima Parcela</h4>
                    <p><strong>Valor:</strong> $1,287.00</p>
                    <p><strong>Vencimento:</strong> 15/11/2024</p>
                    <p><strong>Status:</strong> <span style="color: #10b981;">Em dia</span></p>
                </div>
                
                <div style="margin-top: 20px;">
                    <button style="background: #10b981; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; width: 100%;">
                        <i class="fas fa-credit-card"></i> Pagar Agora
                    </button>
                </div>
            `
        },
        statements: {
            icon: '<i class="fas fa-file-alt"></i>',
            title: 'View Statements',
            body: `
                <h3>Extratos Mensais</h3>
                <p>Visualize e baixe seus extratos mensais em PDF.</p>
                
                <div style="margin: 20px 0;">
                    <h4>Extratos Disponíveis</h4>
                    <div style="border: 1px solid #e5e7eb; border-radius: 6px;">
                        <div style="padding: 12px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>Outubro 2024</strong><br><small>01/11/2024</small></div>
                            <button style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                </div>
            `
        },
        progress: {
            icon: '<i class="fas fa-chart-line"></i>',
            title: 'Track Progress',
            body: `
                <h3>Progresso do Crédito</h3>
                <p>Acompanhe seu histórico e evolução do score.</p>
                
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4>Resumo do Empréstimo</h4>
                    <p><strong>Valor:</strong> $25,000 | <strong>Saldo:</strong> $22,130</p>
                    <p><strong>Parcelas Pagas:</strong> 3 de 24</p>
                </div>
            `
        },
        settings: {
            icon: '<i class="fas fa-cog"></i>',
            title: 'Account Settings',
            body: `
                <h3>Configurações da Conta</h3>
                <p>Gerencie suas informações e preferências.</p>
                
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p><strong>Nome:</strong> João da Silva</p>
                    <p><strong>Email:</strong> joao.silva@email.com</p>
                    <p><strong>Telefone:</strong> (11) 99999-9999</p>
                </div>
            `
        },
        support: {
            icon: '<i class="fas fa-headset"></i>',
            title: 'Get Support',
            body: `
                <h3>Suporte ao Cliente</h3>
                <p>Entre em contato conosco ou acesse nossa central de ajuda.</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0;">
                    <button style="background: #10b981; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-phone"></i> Ligar
                    </button>
                    <button style="background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-comments"></i> Chat
                    </button>
                </div>
            `
        }
    };
    
    return contents[type] || contents.support;
}

// Update Cobuyer Main Preview (in main dashboard)
function updateCobuyerMainPreview(cobuyerId, docType) {
    const mainPreviewBox = document.getElementById(`cobuyer-main-preview-${cobuyerId}-${docType}`);
    
    if (!mainPreviewBox) {
        // If element not found, try again after DOM update
        setTimeout(() => updateCobuyerMainPreview(cobuyerId, docType), 200);
        return;
    }
    
    const cobuyer = cobuyers.find(c => c.id === cobuyerId);
    if (!cobuyer) return;
    
    const docData = cobuyer.documents[docType];
    const iconMap = {
        'driverLicense': 'id-card',
        'proofAddress': 'home',
        'socialSecurity': 'id-badge',
        'bankCard': 'credit-card'
    };
    
    // Update preview content
    if (docData.uploaded && docData.previewData) {
        mainPreviewBox.innerHTML = docData.previewData;
        mainPreviewBox.className = 'cobuyer-doc-preview-box uploaded';
    } else {
        mainPreviewBox.innerHTML = `
            <div class="preview-icon">
                <i class="fas fa-${iconMap[docType]}"></i>
            </div>
            <span class="preview-text">Pending</span>
        `;
        mainPreviewBox.className = 'cobuyer-doc-preview-box pending';
    }
}
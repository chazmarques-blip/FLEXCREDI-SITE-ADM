/**
 * FLEXCREDI ADMIN DASHBOARD - JavaScript
 * Integração com API Railway: https://flexcredi-site-adm-production-b27d.up.railway.app
 */

// ============ CONFIG ============
const DEV_MODE = true; // Set to false when API is ready
const API_BASE_URL = window.API_BASE_URL || 'https://flexcredi-site-adm-production-b27d.up.railway.app';

console.log(`[Admin Dashboard] DEV_MODE: ${DEV_MODE}`);
console.log(`[Admin Dashboard] API Base URL: ${API_BASE_URL}`);

// ============ MOBILE MENU TOGGLE ============
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    
    if (mobileMenuToggle && adminSidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('open');
        });
        
        // Fechar sidebar ao clicar em um link (mobile)
        const navItems = adminSidebar.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    adminSidebar.classList.remove('open');
                }
            });
        });
        
        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (!adminSidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                    adminSidebar.classList.remove('open');
                }
            }
        });
    }
});

// ============ DROPDOWN MENU ============
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.getElementById('userDropdown');
    const dropdownMenu = dropdownToggle?.nextElementSibling;
    
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
    }
});

// ============ MOCK DATA ============
const MOCK_STATS = {
    totalApplications: 142,
    pendingApplications: 28,
    approvedApplications: 98,
    rejectedApplications: 12,
    activeApplications: 4,
    totalVolume: 2400000
};

const MOCK_APPLICATIONS = [
    {
        id: '1',
        clientName: 'João Silva',
        clientEmail: 'joao@email.com',
        partnerName: 'Parceiro A',
        desiredAmount: 50000,
        creditScore: 720,
        status: 'approved',
        submittedAt: '2026-03-01T10:30:00Z'
    },
    {
        id: '2',
        clientName: 'Maria Santos',
        clientEmail: 'maria@email.com',
        partnerName: 'Parceiro B',
        desiredAmount: 35000,
        creditScore: 680,
        status: 'pending',
        submittedAt: '2026-03-02T14:20:00Z'
    },
    {
        id: '3',
        clientName: 'Pedro Costa',
        clientEmail: 'pedro@email.com',
        partnerName: 'Parceiro C',
        desiredAmount: 80000,
        creditScore: 750,
        status: 'analyzing',
        submittedAt: '2026-03-03T09:15:00Z'
    },
    {
        id: '4',
        clientName: 'Ana Oliveira',
        clientEmail: 'ana@email.com',
        partnerName: 'Parceiro A',
        desiredAmount: 25000,
        creditScore: 640,
        status: 'manual_review',
        submittedAt: '2026-03-03T11:45:00Z'
    },
    {
        id: '5',
        clientName: 'Carlos Ferreira',
        clientEmail: 'carlos@email.com',
        partnerName: 'Parceiro D',
        desiredAmount: 120000,
        creditScore: 800,
        status: 'approved',
        submittedAt: '2026-03-04T08:00:00Z'
    }
];

// ============ LOAD DASHBOARD DATA ============
async function loadDashboardData() {
    try {
        console.log('[Dashboard] Loading data...');
        
        if (DEV_MODE) {
            // Use mock data
            console.log('[Dashboard] Using MOCK data (DEV_MODE active)');
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const stats = MOCK_STATS;
            const applications = MOCK_APPLICATIONS;
            
            console.log('[Dashboard] Mock Stats:', stats);
            console.log('[Dashboard] Mock Applications:', applications);
            
            // Update metrics
            updateMetrics(stats);
            
            // Display applications
            displayRecentApplications(applications);
            
            // Load charts
            loadCharts(stats);
            
            console.log('[Dashboard] ✅ Mock data loaded successfully');
            
        } else {
            // Use real API
            console.log('[Dashboard] Using REAL API data');
            
            // Fetch dashboard stats
            const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard`);
            if (!statsResponse.ok) {
                throw new Error(`HTTP ${statsResponse.status}: ${statsResponse.statusText}`);
            }
            
            const stats = await statsResponse.json();
            console.log('[Dashboard] Stats:', stats);
            
            // Update metrics
            updateMetrics(stats);
            
            // Fetch recent applications
            const appsResponse = await fetch(`${API_BASE_URL}/api/applications?limit=10`);
            if (!appsResponse.ok) {
                throw new Error(`HTTP ${appsResponse.status}: ${appsResponse.statusText}`);
            }
            
            const applications = await appsResponse.json();
            console.log('[Dashboard] Applications:', applications);
            
            // Display applications
            displayRecentApplications(applications);
            
            // Load charts
            loadCharts(stats);
        }
        
    } catch (error) {
        console.error('[Dashboard] Error loading data:', error);
        showError('Erro ao carregar dados do dashboard. Verifique a conexão com a API.');
    }
}

// ============ UPDATE METRICS ============
function updateMetrics(stats) {
    // Update status header metrics
    document.getElementById('totalApplications').textContent = stats.totalApplications || 0;
    document.getElementById('pendingApplications').textContent = stats.pendingApplications || 0;
    document.getElementById('approvedApplications').textContent = stats.approvedApplications || 0;
    document.getElementById('totalVolume').textContent = formatCurrency(stats.totalVolume || 0);
    
    // Update metric cards
    document.getElementById('metricTotal').textContent = stats.totalApplications || 0;
    document.getElementById('metricPending').textContent = stats.pendingApplications || 0;
    document.getElementById('metricApproved').textContent = stats.approvedApplications || 0;
    document.getElementById('metricVolume').textContent = formatCurrency(stats.totalVolume || 0);
}

// ============ DISPLAY RECENT APPLICATIONS ============
function displayRecentApplications(applications) {
    const tableBody = document.getElementById('recentApplicationsTable');
    
    if (!tableBody) {
        console.warn('[Dashboard] Table body not found');
        return;
    }
    
    // Limpar tabela (exceto exemplo)
    tableBody.innerHTML = '';
    
    if (!applications || applications.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhuma aplicação encontrada</p>
                </td>
            </tr>
        `;
        return;
    }
    
    applications.forEach(app => {
        const row = createApplicationRow(app);
        tableBody.appendChild(row);
    });
}

// ============ CREATE APPLICATION ROW ============
function createApplicationRow(app) {
    const tr = document.createElement('tr');
    
    // Status badge
    const statusBadge = getStatusBadge(app.status);
    
    tr.innerHTML = `
        <td>
            <div class="table-user">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(app.clientName || 'User')}&background=2ECC71&color=fff" 
                     alt="Avatar" 
                     class="table-avatar">
                <div class="table-user-info">
                    <span class="table-user-name">${app.clientName || 'N/A'}</span>
                    <span class="table-user-email">${app.clientEmail || ''}</span>
                </div>
            </div>
        </td>
        <td><span class="table-partner">${app.partnerName || 'N/A'}</span></td>
        <td><span class="table-amount">${formatCurrency(app.desiredAmount || 0)}</span></td>
        <td><span class="table-score">${app.creditScore || '-'}</span></td>
        <td>${statusBadge}</td>
        <td><span class="table-date">${formatDate(app.submittedAt || app.createdAt)}</span></td>
        <td>
            <div class="table-actions">
                <button class="btn-icon" title="Ver detalhes" onclick="viewApplication('${app.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="Editar" onclick="editApplication('${app.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

// ============ GET STATUS BADGE ============
function getStatusBadge(status) {
    const statusMap = {
        'pending': { class: 'status-pending', text: 'Pendente' },
        'analyzing': { class: 'status-processing', text: 'Analisando' },
        'manual_review': { class: 'status-pending', text: 'Revisão Manual' },
        'approved': { class: 'status-approved', text: 'Aprovado' },
        'rejected': { class: 'status-rejected', text: 'Rejeitado' },
        'contract_pending': { class: 'status-pending', text: 'Contrato Pendente' },
        'ach_pending': { class: 'status-pending', text: 'ACH Pendente' },
        'active': { class: 'status-approved', text: 'Ativo' },
        'paid_off': { class: 'status-approved', text: 'Quitado' },
        'defaulted': { class: 'status-rejected', text: 'Inadimplente' },
        'cancelled': { class: 'status-rejected', text: 'Cancelado' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-pending', text: status };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

// ============ LOAD CHARTS ============
function loadCharts(stats) {
    loadApplicationsChart(stats);
    loadVolumeChart(stats);
}

// ============ APPLICATIONS CHART (Pie) ============
function loadApplicationsChart(stats) {
    const ctx = document.getElementById('applicationsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pendentes', 'Aprovadas', 'Rejeitadas', 'Ativas'],
            datasets: [{
                data: [
                    stats.pendingApplications || 0,
                    stats.approvedApplications || 0,
                    stats.rejectedApplications || 0,
                    stats.activeApplications || 0
                ],
                backgroundColor: [
                    'rgba(243, 156, 18, 0.8)',  // Amarelo
                    'rgba(46, 204, 113, 0.8)',  // Verde
                    'rgba(231, 76, 60, 0.8)',   // Vermelho
                    'rgba(52, 152, 219, 0.8)'   // Azul
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            family: 'Poppins',
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// ============ VOLUME CHART (Line) ============
function loadVolumeChart(stats) {
    const ctx = document.getElementById('volumeChart');
    if (!ctx) return;
    
    // Mock data - substituir por dados reais da API
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const data = [180000, 220000, 280000, 350000, 420000, 480000];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Volume ($)',
                data: data,
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(46, 204, 113, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
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
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        },
                        font: {
                            family: 'Poppins'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Poppins'
                        }
                    }
                }
            }
        }
    });
}

// ============ UTILITY FUNCTIONS ============

function formatCurrency(value) {
    if (!value) return '$0';
    
    if (value >= 1000000) {
        return '$' + (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return '$' + (value / 1000).toFixed(1) + 'k';
    } else {
        return '$' + value.toLocaleString('en-US');
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showError(message) {
    console.error('[Dashboard]', message);
    // TODO: Implementar toast/notification
    alert(message);
}

function showSuccess(message) {
    console.log('[Dashboard]', message);
    // TODO: Implementar toast/notification
    alert(message);
}

// ============ ACTION HANDLERS ============

function viewApplication(id) {
    console.log('[Dashboard] View application:', id);
    window.location.href = `admin-aplicacao-detalhes.html?id=${id}`;
}

function editApplication(id) {
    console.log('[Dashboard] Edit application:', id);
    window.location.href = `admin-aplicacao-editar.html?id=${id}`;
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Admin Dashboard] Initializing...');
    loadDashboardData();
});

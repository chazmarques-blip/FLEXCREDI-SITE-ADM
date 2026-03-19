/* ═══════════════════════════════════════════════════════════════════
   FLEXCREDI ADMIN SYSTEM - UNIFIED JAVASCRIPT V2.0
   Sistema JavaScript moderno e unificado para todas as páginas admin
   Autor: FLEXCREDI Development Team | Data: 22/02/2026
   ═══════════════════════════════════════════════════════════════════ */

// ============================================================
// API CONFIGURATION
// ============================================================

const ADMIN_API = {
    BASE_URL: 'https://flexcredi-site-adm-production-b27d.up.railway.app',
    ENDPOINTS: {
        HEALTH: '/health',
        DASHBOARD: '/api/admin/dashboard',
        APPLICATIONS: '/api/admin/applications',
        CLIENTS: '/api/admin/clients',
        PARTNERS: '/api/admin/partners',
        DOCUMENTS: '/api/admin/documents',
        CONTRACTS: '/api/admin/contracts',
        AGENTS: '/api/admin/agents',
        SETTINGS: '/api/admin/settings'
    },
    
    getUrl(endpoint) {
        return `${this.BASE_URL}${this.ENDPOINTS[endpoint] || endpoint}`;
    }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const AdminUtils = {
    // Formatar moeda
    formatCurrency(value) {
        if (!value || isNaN(value)) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    },
    
    // Formatar data
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },
    
    // Formatar data e hora
    formatDateTime(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    },
    
    // Formatar número
    formatNumber(value) {
        if (!value || isNaN(value)) return '0';
        return new Intl.NumberFormat('pt-BR').format(value);
    },
    
    // Formatar CPF
    formatCPF(cpf) {
        if (!cpf) return '-';
        cpf = cpf.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    // Formatar telefone
    formatPhone(phone) {
        if (!phone) return '-';
        phone = phone.replace(/\D/g, '');
        if (phone.length === 11) {
            return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (phone.length === 10) {
            return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    },
    
    // Gerar avatar URL
    getAvatarUrl(name, bgColor = '2ECC71') {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=128`;
    },
    
    // Mostrar toast notification
    showToast(message, type = 'success') {
        // Criar toast se não existir
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = `
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ⓘ';
        toast.innerHTML = `<strong>${icon}</strong> ${message}`;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ============================================================
// API SERVICE
// ============================================================

const AdminAPI = {
    // Fetch com tratamento de erros
    async request(endpoint, options = {}) {
        try {
            const url = ADMIN_API.getUrl(endpoint);
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API Request Error:', error);
            AdminUtils.showToast(`Erro: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    },
    
    // Verificar saúde da API
    async checkHealth() {
        return await this.request('HEALTH');
    },
    
    // Dashboard
    async getDashboard() {
        return await this.request('DASHBOARD');
    },
    
    // Aplicações
    async getApplications(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await this.request(`APPLICATIONS?${params}`);
    },
    
    async getApplication(id) {
        return await this.request(`/api/admin/applications/${id}`);
    },
    
    async updateApplicationStatus(id, status) {
        return await this.request(`/api/admin/applications/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    },
    
    // Clientes
    async getClients(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await this.request(`CLIENTS?${params}`);
    },
    
    async getClient(id) {
        return await this.request(`/api/admin/clients/${id}`);
    },
    
    // Parceiros
    async getPartners(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await this.request(`PARTNERS?${params}`);
    },
    
    async getPartner(id) {
        return await this.request(`/api/admin/partners/${id}`);
    },
    
    // Documentos
    async getDocuments(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await this.request(`DOCUMENTS?${params}`);
    },
    
    // Agentes
    async getAgents() {
        return await this.request('AGENTS');
    }
};

// ============================================================
// UI COMPONENTS
// ============================================================

const AdminUI = {
    // Mostrar loading
    showLoading(container) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading';
        loadingEl.textContent = 'Carregando...';
        container.innerHTML = '';
        container.appendChild(loadingEl);
    },
    
    // Mostrar empty state
    showEmptyState(container, message = 'Nenhum dado encontrado', icon = 'fa-inbox') {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas ${icon}"></i>
                <p>${message}</p>
                <small>Tente ajustar os filtros ou adicionar novos registros</small>
            </div>
        `;
    },
    
    // Criar linha de tabela com usuário
    createUserRow(user, extraColumns = '', actions = '') {
        return `
            <tr>
                <td>
                    <div class="table-user">
                        <img src="${AdminUtils.getAvatarUrl(user.name)}" 
                             alt="${user.name}" 
                             class="table-avatar">
                        <div class="table-user-info">
                            <span class="table-user-name">${user.name}</span>
                            <span class="table-user-email">${user.email || '-'}</span>
                        </div>
                    </div>
                </td>
                ${extraColumns}
                <td>
                    <div class="table-actions">
                        ${actions}
                    </div>
                </td>
            </tr>
        `;
    },
    
    // Criar status badge
    createStatusBadge(status) {
        const statusMap = {
            'APPROVED': { class: 'status-approved', label: 'Aprovado' },
            'PENDING': { class: 'status-pending', label: 'Pendente' },
            'REJECTED': { class: 'status-rejected', label: 'Rejeitado' },
            'PROCESSING': { class: 'status-processing', label: 'Processando' },
            'ACTIVE': { class: 'status-approved', label: 'Ativo' },
            'INACTIVE': { class: 'status-rejected', label: 'Inativo' }
        };
        
        const statusInfo = statusMap[status] || { class: 'status-pending', label: status };
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
    },
    
    // Criar card de métrica
    createMetricCard(icon, value, label, change = null) {
        const changeHtml = change ? `
            <div class="metric-change ${change >= 0 ? 'positive' : 'negative'}">
                ${change >= 0 ? '↑' : '↓'} ${Math.abs(change)}%
            </div>
        ` : '';
        
        return `
            <div class="metric-card fade-in">
                <div class="metric-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="metric-details">
                    <div class="metric-value">${value}</div>
                    <div class="metric-label">${label}</div>
                    ${changeHtml}
                </div>
            </div>
        `;
    }
};

// ============================================================
// SIDEBAR MANAGEMENT
// ============================================================

const Sidebar = {
    init() {
        const toggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
            
            // Fechar ao clicar fora (mobile)
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                        sidebar.classList.remove('open');
                    }
                }
            });
        }
        
        // Marcar item ativo baseado na URL
        this.setActiveItem();
    },
    
    setActiveItem() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPath.includes(href.replace('.html', '').replace('/admin/', ''))) {
                item.classList.add('active');
            }
        });
    }
};

// ============================================================
// DROPDOWN MANAGEMENT
// ============================================================

const Dropdown = {
    init() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                });
                
                // Fechar ao clicar fora
                document.addEventListener('click', () => {
                    dropdown.classList.remove('show');
                });
            }
        });
    }
};

// ============================================================
// CHARTS (USANDO CHART.JS)
// ============================================================

const AdminCharts = {
    // Criar gráfico de aplicações por status
    createApplicationsChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Aprovadas', 'Pendentes', 'Rejeitadas', 'Processando'],
                datasets: [{
                    data: [
                        data.approved || 0,
                        data.pending || 0,
                        data.rejected || 0,
                        data.processing || 0
                    ],
                    backgroundColor: [
                        '#27AE60',
                        '#F39C12',
                        '#E74C3C',
                        '#3498DB'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },
    
    // Criar gráfico de volume mensal
    createVolumeChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Volume ($)',
                    data: data.values || [0, 0, 0, 0, 0, 0],
                    borderColor: '#2ECC71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
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
    }
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FLEXCREDI Admin System Initialized');
    
    // Inicializar componentes
    Sidebar.init();
    Dropdown.init();
    
    // Verificar saúde da API
    AdminAPI.checkHealth().then(result => {
        if (result.success) {
            console.log('✅ API Health Check:', result.data);
        } else {
            console.error('❌ API Health Check Failed:', result.error);
        }
    });
    
    // Adicionar CSS para animações de toast
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ============================================================
// EXPORT GLOBAL OBJECTS
// ============================================================

window.AdminAPI = AdminAPI;
window.AdminUtils = AdminUtils;
window.AdminUI = AdminUI;
window.AdminCharts = AdminCharts;
window.ADMIN_API = ADMIN_API;

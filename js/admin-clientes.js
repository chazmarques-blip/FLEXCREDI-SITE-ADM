/**
 * FLEXCREDI - Admin Clients Management
 * Loads and displays clients from localStorage
 */

(function() {
    'use strict';

    // Load clients on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadClients();
    });

    // Load clients from localStorage
    function loadClients() {
        const tableBody = document.getElementById('clientsTableBody');
        const totalClientsEl = document.getElementById('totalClients');
        const activeClientsEl = document.getElementById('activeClients');
        const newClientsEl = document.getElementById('newClients');
        const emptyState = document.getElementById('emptyState');
        
        if (!tableBody) return;
        
        // Get clients from localStorage
        let clients = JSON.parse(localStorage.getItem('flexcredi_admin_clients') || '[]');
        
        // If no clients, check for demo user
        if (clients.length === 0) {
            const demoUser = JSON.parse(localStorage.getItem('flexcredi_user') || 'null');
            if (demoUser && demoUser.id) {
                clients.push(demoUser);
            }
        }
        
        // Update counters
        if (totalClientsEl) totalClientsEl.textContent = clients.length;
        if (activeClientsEl) activeClientsEl.textContent = clients.filter(c => c.status !== 'inactive').length;
        
        // New clients this month
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const newThisMonth = clients.filter(c => {
            const created = new Date(c.createdAt);
            return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
        }).length;
        if (newClientsEl) newClientsEl.textContent = newThisMonth;
        
        // Clear table
        tableBody.innerHTML = '';
        
        // If no clients, show empty state
        if (clients.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        // Render each client
        clients.forEach(client => {
            const row = createClientRow(client);
            tableBody.appendChild(row);
        });
    }

    // Create table row for client
    function createClientRow(client) {
        const row = document.createElement('tr');
        row.dataset.clientId = client.id;
        
        const createdDate = new Date(client.createdAt);
        const formattedDate = createdDate.toLocaleDateString('pt-BR');
        
        // Determine status
        let statusClass = 'status-pending';
        let statusText = 'Pendente';
        
        switch(client.status) {
            case 'approved':
            case 'active':
            case 'pre_approved':
                statusClass = 'status-approved';
                statusText = client.status === 'pre_approved' ? 'Pré-Aprovado' : 'Ativo';
                break;
            case 'in_analysis':
            case 'document_review':
                statusClass = 'status-pending';
                statusText = 'Em Análise';
                break;
            case 'rejected':
            case 'inactive':
                statusClass = 'status-rejected';
                statusText = 'Inativo';
                break;
            default:
                statusClass = 'status-pending';
                statusText = 'Pendente';
        }
        
        // Applications count
        const appCount = client.cobuyers ? client.cobuyers.length + 1 : 1;
        
        // Generate avatar URL
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.fullName || 'User')}&background=2ECC71&color=fff`;
        
        row.innerHTML = `
            <td>
                <div class="table-user">
                    <img src="${avatarUrl}" alt="Avatar" class="table-avatar">
                    <div class="table-user-info">
                        <span class="table-user-name">${client.fullName || 'N/A'}</span>
                        <span class="table-user-email">${client.email || 'N/A'}</span>
                    </div>
                </div>
            </td>
            <td><span class="table-date">${client.ssn || '---'}</span></td>
            <td><span class="table-date">${client.phone || '---'}</span></td>
            <td><span class="table-score">${appCount}</span></td>
            <td><span class="table-score" style="color: ${client.creditScore >= 700 ? '#27AE60' : client.creditScore >= 600 ? '#f39c12' : '#e74c3c'};">${client.creditScore || '---'}</span></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td><span class="table-date">${formattedDate}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" title="Ver perfil" onclick="viewClient('${client.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Editar" onclick="editClient('${client.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-icon-danger" title="Desativar" onclick="deleteClient('${client.id}')">
                        <i class="fas fa-ban"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    // View client details
    window.viewClient = function(clientId) {
        const clients = JSON.parse(localStorage.getItem('flexcredi_admin_clients') || '[]');
        const client = clients.find(c => c.id === clientId);
        
        if (!client) {
            alert('Cliente não encontrado');
            return;
        }
        
        // Create modal with client details
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'client-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header" style="background: linear-gradient(135deg, #2ECC71, #27AE60); color: white; padding: 20px; border-radius: 12px 12px 0 0;">
                    <h3 style="margin: 0;"><i class="fas fa-user"></i> Perfil do Cliente</h3>
                    <button onclick="document.getElementById('client-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    
                    <!-- Personal Info -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h4 style="margin: 0 0 10px; color: #2ECC71; font-size: 14px;"><i class="fas fa-user"></i> Informações Pessoais</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Nome:</strong> ${client.fullName}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Email:</strong> ${client.email}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Telefone:</strong> ${client.phone}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>SSN:</strong> ${client.ssn}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Data Nascimento:</strong> ${client.dateOfBirth || 'N/A'}</p>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h4 style="margin: 0 0 10px; color: #2ECC71; font-size: 14px;"><i class="fas fa-map-marker-alt"></i> Endereço</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Endereço:</strong> ${client.address}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Cidade:</strong> ${client.city}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Estado:</strong> ${client.state}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>CEP:</strong> ${client.zipCode}</p>
                        </div>
                    </div>
                    
                    <!-- Employment Info -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h4 style="margin: 0 0 10px; color: #2ECC71; font-size: 14px;"><i class="fas fa-briefcase"></i> Emprego</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Empresa:</strong> ${client.employer || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Cargo:</strong> ${client.jobTitle || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Renda Mensal:</strong> $${(client.monthlyIncome || 0).toLocaleString()}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Tempo:</strong> ${client.employmentYears || 0} anos</p>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h4 style="margin: 0 0 10px; color: #2ECC71; font-size: 14px;"><i class="fas fa-university"></i> Dados Bancários</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Banco:</strong> ${client.bankName || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Tipo:</strong> ${client.accountType || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Conta (últimos 4):</strong> ${client.accountLast4 || '****'}</p>
                        </div>
                    </div>
                    
                    <!-- Loan Info -->
                    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px; color: #1E8449; font-size: 14px;"><i class="fas fa-dollar-sign"></i> Detalhes do Empréstimo</h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center;">
                            <div>
                                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #2ECC71;">$${(client.requestedAmount || 0).toLocaleString()}</p>
                                <p style="margin: 0; font-size: 11px; color: #666;">Solicitado</p>
                            </div>
                            <div>
                                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #27AE60;">$${(client.approvedAmount || 0).toLocaleString()}</p>
                                <p style="margin: 0; font-size: 11px; color: #666;">Aprovado</p>
                            </div>
                            <div>
                                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #2ECC71;">${client.interestRate || 0}%</p>
                                <p style="margin: 0; font-size: 11px; color: #666;">Taxa APR</p>
                            </div>
                            <div>
                                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #2ECC71;">$${client.monthlyPayment || 0}/mo</p>
                                <p style="margin: 0; font-size: 11px; color: #666;">Parcela</p>
                            </div>
                        </div>
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #c8e6c9; display: flex; justify-content: space-between;">
                            <span style="font-size: 12px;"><strong>Prazo:</strong> ${client.term || 0} meses</span>
                            <span style="font-size: 12px;"><strong>Score:</strong> ${client.creditScore || 'N/A'}</span>
                            <span style="font-size: 12px;"><strong>Finalidade:</strong> ${client.loanPurpose || 'N/A'}</span>
                            <span style="font-size: 12px;"><strong>Contrato:</strong> ${client.contractNumber || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <!-- Co-signers -->
                    ${client.cobuyers && client.cobuyers.length > 0 ? `
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px; color: #e65100; font-size: 14px;"><i class="fas fa-user-friends"></i> Co-signatários (${client.cobuyers.length})</h4>
                        ${client.cobuyers.map(co => `
                            <div style="background: white; padding: 10px; border-radius: 6px; margin-top: 10px;">
                                <p style="margin: 0 0 5px; font-weight: bold;">${co.fullName}</p>
                                <p style="margin: 0; font-size: 12px; color: #666;">${co.email} | ${co.phone} | ${co.relationship}</p>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    <!-- Documents -->
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px; color: #2ECC71; font-size: 14px;"><i class="fas fa-file-alt"></i> Documentos</h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                            ${client.documents ? Object.entries(client.documents).map(([key, doc]) => `
                                <div style="text-align: center; padding: 10px; background: white; border-radius: 6px; border: 1px solid ${doc.status === 'approved' ? '#2ECC71' : '#f39c12'};">
                                    <img src="${doc.url}" alt="${doc.name}" style="width: 100%; height: 60px; object-fit: cover; border-radius: 4px; margin-bottom: 5px;">
                                    <p style="margin: 0; font-size: 10px; font-weight: 600;">${doc.name}</p>
                                    <span style="font-size: 9px; color: ${doc.status === 'approved' ? '#27AE60' : '#f39c12'}; text-transform: uppercase;">${doc.status}</span>
                                </div>
                            `).join('') : '<p style="margin: 0; color: #999; font-size: 12px;">Nenhum documento enviado</p>'}
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-print"></i> Imprimir
                    </button>
                    <button onclick="document.getElementById('client-modal').remove()" style="padding: 10px 20px; background: #2ECC71; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    };

    // Edit client
    window.editClient = function(clientId) {
        alert('Funcionalidade de edição em desenvolvimento.\nClient ID: ' + clientId);
    };

    // Delete/deactivate client
    window.deleteClient = function(clientId) {
        if (!confirm('Deseja realmente desativar este cliente?')) return;
        
        let clients = JSON.parse(localStorage.getItem('flexcredi_admin_clients') || '[]');
        const clientIndex = clients.findIndex(c => c.id === clientId);
        
        if (clientIndex !== -1) {
            clients[clientIndex].status = 'inactive';
            localStorage.setItem('flexcredi_admin_clients', JSON.stringify(clients));
            loadClients(); // Refresh table
        }
    };

    // Add new client
    window.addNewClient = function() {
        alert('Redirecionando para o formulário de novo cliente...');
        window.location.href = 'login.html';
    };

    // Apply filters
    window.applyFilters = function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const sortBy = document.getElementById('sortBy').value;
        
        let clients = JSON.parse(localStorage.getItem('flexcredi_admin_clients') || '[]');
        
        // Filter by search term
        if (searchTerm) {
            clients = clients.filter(c => 
                (c.fullName && c.fullName.toLowerCase().includes(searchTerm)) ||
                (c.email && c.email.toLowerCase().includes(searchTerm)) ||
                (c.ssn && c.ssn.includes(searchTerm))
            );
        }
        
        // Filter by status
        if (statusFilter) {
            clients = clients.filter(c => {
                if (statusFilter === 'active') return c.status !== 'inactive' && c.status !== 'rejected';
                if (statusFilter === 'inactive') return c.status === 'inactive' || c.status === 'rejected';
                return true;
            });
        }
        
        // Sort
        switch(sortBy) {
            case 'name':
                clients.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
                break;
            case 'applications':
                clients.sort((a, b) => ((b.cobuyers?.length || 0) + 1) - ((a.cobuyers?.length || 0) + 1));
                break;
            case 'recent':
            default:
                clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        // Re-render table with filtered results
        const tableBody = document.getElementById('clientsTableBody');
        const emptyState = document.getElementById('emptyState');
        
        tableBody.innerHTML = '';
        
        if (clients.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        clients.forEach(client => {
            const row = createClientRow(client);
            tableBody.appendChild(row);
        });
    };

    // Make loadClients globally accessible
    window.loadClients = loadClients;

    console.log('Admin Clients JS loaded');
})();

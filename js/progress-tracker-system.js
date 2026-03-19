/**
 * FLEXCREDI - Sistema de Barra de Progresso de Validação
 * Rastreia e exibe o progresso das etapas de aprovação do empréstimo
 */

class FlexcrediProgressTracker {
    constructor() {
        this.currentStep = 3; // Começa em "Pré-aprovação" (índice 2, mas mostra até 3)
        this.currentStatus = 'pre-approved'; // pre-approved, approved, denied, adjusted
        
        // Definir etapas do processo
        this.steps = [
            {
                id: 'registration',
                title: 'Cadastro',
                description: 'Informações básicas',
                icon: 'fas fa-user-plus',
                status: 'completed'
            },
            {
                id: 'credit-analysis',
                title: 'Análise de Crédito',
                description: 'Verificação de score',
                icon: 'fas fa-chart-line',
                status: 'completed'
            },
            {
                id: 'pre-approval',
                title: 'Pré-aprovação',
                description: 'Aprovação inicial',
                icon: 'fas fa-check-circle',
                status: 'current'
            },
            {
                id: 'documentation',
                title: 'Submissão de Documentos',
                description: 'Upload de documentos',
                icon: 'fas fa-file-upload',
                status: 'pending'
            },
            {
                id: 'under-review',
                title: 'Em Análise',
                description: 'Análise detalhada',
                icon: 'fas fa-search',
                status: 'pending'
            },
            {
                id: 'analysis-complete',
                title: 'Análise Concluída',
                description: 'Decisão final',
                icon: 'fas fa-flag-checkered',
                status: 'pending'
            }
        ];
        
        this.init();
    }

    init() {
        this.createProgressBar();
        this.updateProgressDisplay();
        this.setupAutoUpdate();
        console.log('🎯 Sistema de progresso FLEXCREDI carregado');
    }

    createProgressBar() {
        // Verificar se já existe
        if (document.getElementById('flexcredi-progress-tracker')) {
            return;
        }

        // Criar HTML da barra de progresso
        const progressHTML = `
        <div id="flexcredi-progress-tracker" class="flexcredi-progress-sidebar">
            <div class="progress-header">
                <h4><i class="fas fa-tasks"></i> Status do Processo</h4>
                <div class="progress-percentage" id="progressPercentage">50%</div>
            </div>
            
            <div class="progress-timeline" id="progressTimeline">
                <!-- Etapas serão geradas dinamicamente -->
            </div>
            
            <div class="progress-actions">
                <button class="btn-progress-info" id="btnProgressInfo">
                    <i class="fas fa-info-circle"></i> Detalhes
                </button>
            </div>
        </div>
        `;

        // Encontrar onde inserir (próximo ao header do status)
        const statusCard = document.querySelector('.status-card');
        if (statusCard) {
            statusCard.insertAdjacentHTML('afterend', progressHTML);
        } else {
            // Fallback: inserir no container principal
            const container = document.querySelector('.container');
            if (container) {
                container.insertAdjacentHTML('afterbegin', progressHTML);
            }
        }
    }

    generateTimelineHTML() {
        return this.steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isPending = step.status === 'pending';
            
            let statusClass = '';
            let statusIcon = '';
            
            if (isCompleted) {
                statusClass = 'step-completed';
                statusIcon = '<i class="fas fa-check"></i>';
            } else if (isCurrent) {
                statusClass = 'step-current';
                statusIcon = '<i class="fas fa-clock"></i>';
            } else {
                statusClass = 'step-pending';
                statusIcon = '<i class="fas fa-circle"></i>';
            }
            
            return `
            <div class="progress-step ${statusClass}" data-step="${step.id}">
                <div class="step-indicator">
                    <div class="step-number">${statusIcon}</div>
                    <div class="step-connector ${index === this.steps.length - 1 ? 'last' : ''}"></div>
                </div>
                <div class="step-content">
                    <div class="step-title">${step.title}</div>
                    <div class="step-description">${step.description}</div>
                    <div class="step-timestamp" id="timestamp-${step.id}">
                        ${this.getStepTimestamp(step)}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    getStepTimestamp(step) {
        const now = new Date();
        
        switch (step.status) {
            case 'completed':
                // Simular timestamps anteriores
                const daysAgo = Math.floor(Math.random() * 5) + 1;
                const pastDate = new Date(now - (daysAgo * 24 * 60 * 60 * 1000));
                return pastDate.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            case 'current':
                return 'Em andamento';
            default:
                return 'Pendente';
        }
    }

    updateProgressDisplay() {
        const timeline = document.getElementById('progressTimeline');
        const percentageDiv = document.getElementById('progressPercentage');
        
        if (timeline) {
            timeline.innerHTML = this.generateTimelineHTML();
        }
        
        if (percentageDiv) {
            const completedSteps = this.steps.filter(step => step.status === 'completed').length;
            const currentStep = this.steps.find(step => step.status === 'current') ? 1 : 0;
            const percentage = Math.round(((completedSteps + currentStep * 0.5) / this.steps.length) * 100);
            percentageDiv.textContent = `${percentage}%`;
        }
    }

    // Simular atualizações do sistema (normalmente viria do backend)
    setupAutoUpdate() {
        // Simular atualizações periódicas
        setInterval(() => {
            this.checkForUpdates();
        }, 10000); // Verificar a cada 10 segundos

        // Configurar botão de detalhes
        const btnInfo = document.getElementById('btnProgressInfo');
        if (btnInfo) {
            btnInfo.addEventListener('click', () => this.showProgressDetails());
        }
    }

    // Simular verificação de atualizações do backend
    checkForUpdates() {
        // Simular chamada à API para verificar mudanças de status
        // Em produção, isso seria uma chamada real para o backend
        
        // Exemplo de progressão automática (apenas para demo)
        const shouldProgress = Math.random() < 0.1; // 10% de chance a cada verificação
        
        if (shouldProgress && this.currentStep < this.steps.length) {
            this.advanceToNextStep();
        }
    }

    // Avançar para a próxima etapa
    advanceToNextStep() {
        const currentIndex = this.steps.findIndex(step => step.status === 'current');
        
        if (currentIndex !== -1 && currentIndex < this.steps.length - 1) {
            // Marcar atual como concluída
            this.steps[currentIndex].status = 'completed';
            
            // Avançar para próxima
            this.steps[currentIndex + 1].status = 'current';
            
            this.currentStep++;
            this.updateProgressDisplay();
            this.showProgressNotification(`Etapa "${this.steps[currentIndex].title}" concluída!`);
            
            console.log(`✅ Progresso atualizado: ${this.steps[currentIndex + 1].title}`);
        }
    }

    // Atualizar status final (chamado quando análise é concluída)
    updateFinalStatus(newStatus) {
        this.currentStatus = newStatus;
        
        // Completar todas as etapas
        this.steps.forEach(step => {
            if (step.status !== 'completed') {
                step.status = 'completed';
            }
        });
        
        // Atualizar status badge no header principal
        this.updateStatusBadge(newStatus);
        this.updateProgressDisplay();
        
        // Mostrar notificação final
        this.showFinalStatusNotification(newStatus);
    }

    updateStatusBadge(status) {
        const statusBadge = document.querySelector('.status-badge');
        const statusDescription = document.querySelector('.status-description');
        
        if (statusBadge && statusDescription) {
            switch (status) {
                case 'approved':
                    statusBadge.className = 'status-badge status-approved';
                    statusBadge.textContent = 'APROVADO';
                    statusDescription.textContent = 'Parabéns! Seu empréstimo foi aprovado. Você pode prosseguir com a assinatura do contrato.';
                    break;
                case 'denied':
                    statusBadge.className = 'status-badge status-denied';
                    statusBadge.textContent = 'NEGADO';
                    statusDescription.textContent = 'Infelizmente seu empréstimo não foi aprovado. Entre em contato para mais informações.';
                    break;
                case 'adjusted':
                    statusBadge.className = 'status-badge status-adjusted';
                    statusBadge.textContent = 'APROVADO COM AJUSTES';
                    statusDescription.textContent = 'Seu empréstimo foi aprovado com algumas condições ajustadas. Verifique os novos termos.';
                    break;
            }
        }
    }

    showProgressNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'progress-notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    showFinalStatusNotification(status) {
        let icon = '';
        let message = '';
        let type = '';
        
        switch (status) {
            case 'approved':
                icon = 'fas fa-check-circle';
                message = '🎉 Parabéns! Seu empréstimo foi APROVADO!';
                type = 'success';
                break;
            case 'denied':
                icon = 'fas fa-times-circle';
                message = '❌ Empréstimo não aprovado. Entre em contato conosco.';
                type = 'error';
                break;
            case 'adjusted':
                icon = 'fas fa-edit';
                message = '📝 Empréstimo aprovado com ajustes. Verifique os novos termos.';
                type = 'warning';
                break;
        }
        
        const notification = document.createElement('div');
        notification.className = `final-status-notification ${type}`;
        notification.innerHTML = `
            <i class="${icon}"></i>
            <div class="notification-content">
                <h4>${message}</h4>
                <p>O status do seu processo foi atualizado.</p>
            </div>
            <button class="notification-close">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Evento de fechar
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
        
        // Auto-remover após 8 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }

    showProgressDetails() {
        // Criar modal com detalhes do progresso
        const modalHTML = `
        <div class="progress-details-modal" id="progressDetailsModal">
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3><i class="fas fa-tasks"></i> Detalhes do Processo de Aprovação</h3>
                    <button class="modal-close" id="closeProgressDetails">×</button>
                </div>
                <div class="modal-body">
                    <div class="progress-overview">
                        <div class="overview-item">
                            <strong>Status Atual:</strong> ${this.getCurrentStatusText()}
                        </div>
                        <div class="overview-item">
                            <strong>Progresso:</strong> ${this.getCompletionPercentage()}% concluído
                        </div>
                        <div class="overview-item">
                            <strong>Próxima Etapa:</strong> ${this.getNextStepText()}
                        </div>
                    </div>
                    
                    <div class="detailed-timeline">
                        ${this.generateDetailedTimelineHTML()}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="closeProgressDetailsFooter">Entendi</button>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Eventos de fechar
        document.getElementById('closeProgressDetails').onclick = () => {
            document.getElementById('progressDetailsModal').remove();
        };
        document.getElementById('closeProgressDetailsFooter').onclick = () => {
            document.getElementById('progressDetailsModal').remove();
        };
    }

    getCurrentStatusText() {
        const currentStep = this.steps.find(step => step.status === 'current');
        return currentStep ? currentStep.title : 'Processo concluído';
    }

    getCompletionPercentage() {
        const completedSteps = this.steps.filter(step => step.status === 'completed').length;
        const currentStep = this.steps.find(step => step.status === 'current') ? 1 : 0;
        return Math.round(((completedSteps + currentStep * 0.5) / this.steps.length) * 100);
    }

    getNextStepText() {
        const currentIndex = this.steps.findIndex(step => step.status === 'current');
        const nextIndex = currentIndex + 1;
        return nextIndex < this.steps.length ? this.steps[nextIndex].title : 'Todas as etapas concluídas';
    }

    generateDetailedTimelineHTML() {
        return this.steps.map(step => `
            <div class="detailed-step ${step.status}">
                <div class="step-icon">
                    <i class="${step.icon}"></i>
                </div>
                <div class="step-info">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                    <div class="step-status">${this.getDetailedStepStatus(step)}</div>
                </div>
            </div>
        `).join('');
    }

    getDetailedStepStatus(step) {
        switch (step.status) {
            case 'completed':
                return '<span class="status-completed"><i class="fas fa-check"></i> Concluído</span>';
            case 'current':
                return '<span class="status-current"><i class="fas fa-clock"></i> Em andamento</span>';
            default:
                return '<span class="status-pending"><i class="fas fa-hourglass-half"></i> Pendente</span>';
        }
    }

    // Métodos para simular atualizações do admin/backend
    simulateDocumentSubmission() {
        if (this.currentStep === 3) {
            this.advanceToNextStep(); // Para "Submissão de Documentos"
            setTimeout(() => {
                this.advanceToNextStep(); // Para "Em Análise"
            }, 3000);
        }
    }

    simulateAnalysisCompletion(finalStatus = 'approved') {
        this.updateFinalStatus(finalStatus);
    }
}

// Inicializar sistema quando DOM estiver pronto
let progressTracker = null;

document.addEventListener('DOMContentLoaded', function() {
    progressTracker = new FlexcrediProgressTracker();
    
    // Expor para console (para testes)
    window.progressTracker = progressTracker;
    
    console.log('🎯 Sistema de progresso pronto!');
    console.log('💡 Para testar: progressTracker.simulateDocumentSubmission()');
    console.log('💡 Para finalizar: progressTracker.simulateAnalysisCompletion("approved")');
});

// Exportar para uso global
window.FlexcrediProgressTracker = FlexcrediProgressTracker;
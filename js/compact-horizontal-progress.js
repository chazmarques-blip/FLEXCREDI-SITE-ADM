/**
 * FLEXCREDI - Barra de Progresso Horizontal Ultra-Compacta
 * Integrada diretamente no header verde do status
 */

class CompactHorizontalProgress {
    constructor() {
        this.currentStep = 3; // Pré-aprovação (índice 2, mas mostra até 3)
        this.totalSteps = 6;
        
        // Etapas ultra-simplificadas para espaço compacto
        this.steps = [
            { id: 'cadastro', label: 'Cadastro', status: 'completed' },
            { id: 'analise', label: 'Análise', status: 'completed' },
            { id: 'pre-aprovacao', label: 'Pré-Aprv', status: 'current' },
            { id: 'documentos', label: 'Docs', status: 'pending' },
            { id: 'revisao', label: 'Revisão', status: 'pending' },
            { id: 'final', label: 'Final', status: 'pending' }
        ];
        
        this.init();
    }

    init() {
        this.injectProgressIntoHeader();
        this.updateDisplay();
        console.log('🎯 Barra horizontal compacta carregada');
    }

    injectProgressIntoHeader() {
        // Encontrar o local exato para inserir a barra
        const statusInfo = document.querySelector('.status-info');
        const applicationStatus = document.querySelector('.application-status');
        
        if (statusInfo && applicationStatus) {
            // Criar HTML da barra compacta
            const progressHTML = `
            <div class="compact-horizontal-progress" id="compactProgress">
                <div class="progress-header-mini">
                    <span class="progress-label">Progresso:</span>
                    <span class="progress-percent" id="progressPercent">50%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" id="progressFill"></div>
                    <div class="progress-steps-container" id="progressSteps">
                        <!-- Etapas serão inseridas dinamicamente -->
                    </div>
                </div>
            </div>
            `;
            
            // Inserir antes do application-status
            applicationStatus.insertAdjacentHTML('beforebegin', progressHTML);
            
            this.generateStepsIndicators();
        }
    }

    generateStepsIndicators() {
        const stepsContainer = document.getElementById('progressSteps');
        if (!stepsContainer) return;

        const stepsHTML = this.steps.map((step, index) => {
            let stepClass = 'progress-step-dot';
            let stepContent = '';
            
            switch (step.status) {
                case 'completed':
                    stepClass += ' completed';
                    stepContent = '<i class="fas fa-check"></i>';
                    break;
                case 'current':
                    stepClass += ' current';
                    stepContent = '<i class="fas fa-circle"></i>';
                    break;
                default:
                    stepClass += ' pending';
                    stepContent = '<i class="fas fa-circle"></i>';
            }
            
            // POSICIONAMENTO PERFEITO: Bolinhas alinhadas com extremos da barra
            let stepPosition;
            if (index === 0) {
                // Primeira bolinha: extremo EXATO da barra (0%)
                stepPosition = 0;
            } else if (index === this.steps.length - 1) {
                // Última bolinha: extremo EXATO da barra (100%)
                stepPosition = 100;
            } else {
                // Pontos do meio: distribuição uniforme de 0% a 100%
                stepPosition = (index / (this.steps.length - 1)) * 100;
            }
            
            return `
            <div class="${stepClass}" 
                 data-step="${step.id}" 
                 data-tooltip="${step.label}"
                 style="left: ${stepPosition}%">
                ${stepContent}
                <span class="step-label">${step.label}</span>
            </div>
            `;
        }).join('');
        
        stepsContainer.innerHTML = stepsHTML;
    }

    updateDisplay() {
        // CÁLCULO PRECISO: Preenchimento até EXATAMENTE a próxima bolinha
        const totalSteps = this.steps.length;
        const currentIndex = this.steps.findIndex(step => step.status === 'current');
        const completedCount = this.steps.filter(step => step.status === 'completed').length;
        
        let fillWidth = 0;
        let percentageText = 0;
        
        // Calcular preenchimento baseado nas posições das bolinhas (0%, 20%, 40%, 60%, 80%, 100%)
        if (currentIndex !== -1) {
            // Etapa atual: preencher até ela (não além)
            fillWidth = (currentIndex / (totalSteps - 1)) * 100;
            percentageText = Math.round(((completedCount + 0.5) / totalSteps) * 100);
            console.log(`🎯 Etapa atual ${currentIndex + 1}: preenchimento até ${fillWidth}%`);
        } else {
            // Encontrar última etapa completada
            let lastCompletedIndex = -1;
            for (let i = 0; i < this.steps.length; i++) {
                if (this.steps[i].status === 'completed') {
                    lastCompletedIndex = i;
                }
            }
            
            if (lastCompletedIndex !== -1) {
                // Preencher até a última completada
                fillWidth = (lastCompletedIndex / (totalSteps - 1)) * 100;
            } else {
                // Nenhuma completada: sem preenchimento
                fillWidth = 0;
            }
            
            percentageText = Math.round((completedCount / totalSteps) * 100);
            console.log(`✅ Últimas completas: ${completedCount}, preenchimento: ${fillWidth}%`);
        }
        
        // Garantir que nunca ultrapasse 100%
        fillWidth = Math.min(fillWidth, 100);
        
        // Atualizar percentual
        const percentElement = document.getElementById('progressPercent');
        if (percentElement) {
            percentElement.textContent = `${percentageText}%`;
        }
        
        // Atualizar barra de preenchimento - PARAR EXATAMENTE NA BOLINHA
        const fillElement = document.getElementById('progressFill');
        if (fillElement) {
            fillElement.style.width = `${fillWidth}%`;
            console.log(`🔮 Preenchimento aplicado: ${fillWidth}%`);
        }
        
        // Regenerar indicadores
        this.generateStepsIndicators();
    }

    // Avançar etapa (chamado pelo sistema administrativo)
    advanceStep() {
        const currentIndex = this.steps.findIndex(step => step.status === 'current');
        
        if (currentIndex !== -1 && currentIndex < this.steps.length - 1) {
            // Marcar atual como completa
            this.steps[currentIndex].status = 'completed';
            
            // Avançar para próxima
            this.steps[currentIndex + 1].status = 'current';
            
            this.updateDisplay();
            this.showMiniNotification(`${this.steps[currentIndex].label} concluído!`);
            
            console.log(`✅ Progresso: ${this.steps[currentIndex + 1].label}`);
        }
    }

    // Finalizar processo com status
    finalizeWithStatus(status) {
        // Completar todas as etapas
        this.steps.forEach(step => {
            if (step.status !== 'completed') {
                step.status = 'completed';
            }
        });
        
        this.updateDisplay();
        
        // Atualizar status principal
        this.updateMainStatus(status);
        
        // Mostrar notificação final
        this.showFinalNotification(status);
    }

    updateMainStatus(status) {
        const statusBadge = document.querySelector('.status-badge');
        const statusDescription = document.querySelector('.status-description');
        
        if (statusBadge && statusDescription) {
            switch (status) {
                case 'approved':
                    statusBadge.className = 'status-badge status-approved';
                    statusBadge.textContent = 'APROVADO';
                    statusDescription.textContent = 'Parabéns! Seu empréstimo foi aprovado.';
                    break;
                case 'denied':
                    statusBadge.className = 'status-badge status-denied';
                    statusBadge.textContent = 'NEGADO';
                    statusDescription.textContent = 'Empréstimo não aprovado. Entre em contato conosco.';
                    break;
                case 'adjusted':
                    statusBadge.className = 'status-badge status-adjusted';
                    statusBadge.textContent = 'APROVADO COM AJUSTES';
                    statusDescription.textContent = 'Empréstimo aprovado com condições ajustadas.';
                    break;
            }
        }
    }

    showMiniNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'mini-progress-notification';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        document.body.appendChild(notification);
        
        // Auto-remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showFinalNotification(status) {
        const icons = {
            'approved': 'fas fa-check-circle',
            'denied': 'fas fa-times-circle', 
            'adjusted': 'fas fa-edit'
        };
        
        const messages = {
            'approved': 'Empréstimo Aprovado!',
            'denied': 'Empréstimo Negado',
            'adjusted': 'Aprovado com Ajustes'
        };
        
        const notification = document.createElement('div');
        notification.className = `final-mini-notification ${status}`;
        notification.innerHTML = `
            <i class="${icons[status]}"></i>
            <span>${messages[status]}</span>
            <button class="close-notification">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Evento de fechar
        notification.querySelector('.close-notification').onclick = () => {
            notification.remove();
        };
        
        // Auto-remover após 6 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 6000);
    }

    // Método de validação do preenchimento
    validateFillAlignment() {
        const fillElement = document.getElementById('progressFill');
        const steps = document.querySelectorAll('.progress-step-dot');
        
        if (!fillElement || steps.length === 0) return false;
        
        const fillWidth = parseFloat(fillElement.style.width) || 0;
        const currentIndex = this.steps.findIndex(step => step.status === 'current');
        
        let expectedWidth = 0;
        if (currentIndex !== -1) {
            expectedWidth = (currentIndex / (this.steps.length - 1)) * 100;
        } else {
            // Encontrar última completada
            for (let i = this.steps.length - 1; i >= 0; i--) {
                if (this.steps[i].status === 'completed') {
                    expectedWidth = (i / (this.steps.length - 1)) * 100;
                    break;
                }
            }
        }
        
        const tolerance = 1; // 1% de tolerância
        const isValid = Math.abs(fillWidth - expectedWidth) <= tolerance;
        
        console.log(`🔍 Validação: Fill=${fillWidth}%, Esperado=${expectedWidth}%, Valid=${isValid}`);
        return isValid;
    }

    // Métodos para demonstração/teste
    simulateProgress() {
        console.log('🤖 Simulando progresso com validação...');
        
        setTimeout(() => {
            this.advanceStep();
            this.validateFillAlignment();
        }, 1000);   // Documentos
        
        setTimeout(() => {
            this.advanceStep();
            this.validateFillAlignment();
        }, 2500);   // Revisão
        
        setTimeout(() => {
            this.advanceStep();
            this.validateFillAlignment();
        }, 4000);   // Final
        
        setTimeout(() => {
            this.finalizeWithStatus('approved');
            this.validateFillAlignment();
        }, 5500);
    }

    resetProgress() {
        this.steps.forEach((step, index) => {
            if (index <= 1) {
                step.status = 'completed';
            } else if (index === 2) {
                step.status = 'current';
            } else {
                step.status = 'pending';
            }
        });
        
        this.updateDisplay();
        
        // Resetar status principal
        const statusBadge = document.querySelector('.status-badge');
        const statusDescription = document.querySelector('.status-description');
        
        if (statusBadge && statusDescription) {
            statusBadge.className = 'status-badge status-pre-approved';
            statusBadge.textContent = 'PRÉ-APROVADO';
            statusDescription.textContent = 'Sua pré-aprovação está em fase de análise, submeta a documentação necessária para finalizar o processo.';
        }
        
        console.log('🔄 Progresso resetado');
    }
}

// Inicializar quando DOM estiver pronto
let compactProgress = null;

document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o layout esteja estável
    setTimeout(() => {
        compactProgress = new CompactHorizontalProgress();
        window.compactProgress = compactProgress;
        
        console.log('🎯 Sistema compacto pronto!');
        console.log('💡 Teste: compactProgress.simulateProgress()');
        console.log('💡 Reset: compactProgress.resetProgress()');
    }, 1000);
});

window.CompactHorizontalProgress = CompactHorizontalProgress;
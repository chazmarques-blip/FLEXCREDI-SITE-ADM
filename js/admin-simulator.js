/**
 * FLEXCREDI - Simulador de Admin para Testes
 * Simula atualizações de status que viriam do sistema administrativo
 */

class FlexcrediAdminSimulator {
    constructor() {
        this.progressTracker = null;
        this.isSimulationRunning = false;
        this.init();
    }

    init() {
        // Aguardar o sistema de progresso estar pronto
        const checkProgressTracker = setInterval(() => {
            if (window.progressTracker) {
                this.progressTracker = window.progressTracker;
                clearInterval(checkProgressTracker);
                this.setupSimulationControls();
                console.log('🎮 Simulador Admin FLEXCREDI carregado');
            }
        }, 1000);
    }

    setupSimulationControls() {
        // Criar painel de controle flutuante
        const controlsHTML = `
        <div id="adminSimulatorControls" class="admin-simulator-panel">
            <div class="simulator-header">
                <h4><i class="fas fa-cogs"></i> Simulador Admin</h4>
                <button id="toggleSimulator" class="toggle-btn">−</button>
            </div>
            <div class="simulator-content" id="simulatorContent">
                <div class="control-group">
                    <label>Simular Progresso:</label>
                    <div class="button-grid">
                        <button class="sim-btn" id="simDocSubmission">
                            📄 Enviar Docs
                        </button>
                        <button class="sim-btn" id="simStartAnalysis">
                            🔍 Iniciar Análise
                        </button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>Finalizar com Status:</label>
                    <div class="button-grid">
                        <button class="sim-btn success" id="simApproved">
                            ✅ Aprovar
                        </button>
                        <button class="sim-btn error" id="simDenied">
                            ❌ Negar
                        </button>
                        <button class="sim-btn warning" id="simAdjusted">
                            📝 Ajustar
                        </button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>Automação:</label>
                    <button class="sim-btn auto" id="simFullProcess">
                        🤖 Processo Completo
                    </button>
                </div>
                
                <div class="simulation-log" id="simulationLog">
                    <small>Log de simulações...</small>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        this.bindEvents();
    }

    bindEvents() {
        // Toggle do painel
        document.getElementById('toggleSimulator').onclick = () => {
            const content = document.getElementById('simulatorContent');
            const toggle = document.getElementById('toggleSimulator');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggle.textContent = '−';
            } else {
                content.style.display = 'none';
                toggle.textContent = '+';
            }
        };

        // Simular submissão de documentos
        document.getElementById('simDocSubmission').onclick = () => {
            this.simulateDocumentSubmission();
        };

        // Simular início da análise
        document.getElementById('simStartAnalysis').onclick = () => {
            this.simulateAnalysisStart();
        };

        // Simular aprovação
        document.getElementById('simApproved').onclick = () => {
            this.simulateFinalStatus('approved');
        };

        // Simular negação
        document.getElementById('simDenied').onclick = () => {
            this.simulateFinalStatus('denied');
        };

        // Simular ajuste
        document.getElementById('simAdjusted').onclick = () => {
            this.simulateFinalStatus('adjusted');
        };

        // Simular processo completo
        document.getElementById('simFullProcess').onclick = () => {
            this.simulateFullProcess();
        };
    }

    simulateDocumentSubmission() {
        this.addLog('📄 Simulando submissão de documentos...');
        
        // Simular que cliente enviou documentos
        setTimeout(() => {
            if (this.progressTracker) {
                this.progressTracker.simulateDocumentSubmission();
                this.addLog('✅ Documentos recebidos e validados');
            }
        }, 1000);
    }

    simulateAnalysisStart() {
        this.addLog('🔍 Iniciando análise detalhada...');
        
        // Avançar para "Em Análise" se ainda não estiver
        setTimeout(() => {
            if (this.progressTracker) {
                const currentStep = this.progressTracker.steps.find(step => step.status === 'current');
                if (currentStep && currentStep.id === 'documentation') {
                    this.progressTracker.advanceToNextStep(); // Para "Em Análise"
                    this.addLog('📊 Status: Em Análise Detalhada');
                }
            }
        }, 1500);
    }

    simulateFinalStatus(status) {
        const statusLabels = {
            'approved': '✅ APROVADO',
            'denied': '❌ NEGADO', 
            'adjusted': '📝 APROVADO COM AJUSTES'
        };
        
        this.addLog(`🎯 Finalizando processo: ${statusLabels[status]}`);
        
        setTimeout(() => {
            if (this.progressTracker) {
                this.progressTracker.simulateAnalysisCompletion(status);
                this.addLog(`🏁 Processo concluído: ${statusLabels[status]}`);
            }
        }, 2000);
    }

    simulateFullProcess() {
        if (this.isSimulationRunning) {
            this.addLog('⚠️ Simulação já está em andamento');
            return;
        }

        this.isSimulationRunning = true;
        this.addLog('🤖 Iniciando simulação completa...');

        // Etapa 1: Submissão de documentos
        setTimeout(() => {
            this.simulateDocumentSubmission();
        }, 1000);

        // Etapa 2: Análise detalhada
        setTimeout(() => {
            this.simulateAnalysisStart();
        }, 4000);

        // Etapa 3: Resultado aleatório
        setTimeout(() => {
            const outcomes = ['approved', 'denied', 'adjusted'];
            const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
            this.simulateFinalStatus(randomOutcome);
            this.isSimulationRunning = false;
        }, 8000);
    }

    addLog(message) {
        const log = document.getElementById('simulationLog');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> ${message}`;
        
        log.appendChild(logEntry);
        
        // Manter apenas os últimos 5 logs
        while (log.children.length > 6) { // 6 porque tem o texto inicial
            log.removeChild(log.children[1]); // Remove o segundo (primeiro é o texto inicial)
        }
        
        // Scroll para baixo
        log.scrollTop = log.scrollHeight;
        
        console.log(`[Admin Simulator] ${message}`);
    }

    // Simular atualizações vindas do backend
    simulateBackendUpdate(stepId, newStatus, clientId = 'default') {
        // Em produção, isso seria uma chamada WebSocket ou polling do backend
        this.addLog(`🔄 Atualização do backend: ${stepId} → ${newStatus}`);
        
        if (this.progressTracker) {
            // Encontrar e atualizar a etapa específica
            const step = this.progressTracker.steps.find(s => s.id === stepId);
            if (step) {
                step.status = newStatus;
                this.progressTracker.updateProgressDisplay();
            }
        }
    }

    // Resetar progresso para testes
    resetProgress() {
        this.addLog('🔄 Resetando progresso...');
        
        if (this.progressTracker) {
            // Resetar etapas
            this.progressTracker.steps.forEach((step, index) => {
                if (index <= 1) {
                    step.status = 'completed';
                } else if (index === 2) {
                    step.status = 'current';
                } else {
                    step.status = 'pending';
                }
            });
            
            this.progressTracker.currentStep = 3;
            this.progressTracker.currentStatus = 'pre-approved';
            this.progressTracker.updateProgressDisplay();
            
            // Resetar status badge
            const statusBadge = document.querySelector('.status-badge');
            const statusDescription = document.querySelector('.status-description');
            
            if (statusBadge && statusDescription) {
                statusBadge.className = 'status-badge status-pre-approved';
                statusBadge.textContent = 'PRÉ-APROVADO';
                statusDescription.textContent = 'Sua pré-aprovação está em fase de análise, submeta a documentação necessária para finalizar o processo.';
            }
        }
        
        this.addLog('✅ Progresso resetado para Pré-aprovação');
    }
}

// CSS inline para o painel de controle
const simulatorStyles = `
<style>
.admin-simulator-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    min-width: 250px;
    max-width: 300px;
    font-family: Arial, sans-serif;
}

.simulator-header {
    background: linear-gradient(135deg, #2ECC71, #1E8449);
    color: white;
    padding: 12px 15px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.simulator-header h4 {
    margin: 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.toggle-btn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
}

.toggle-btn:hover {
    background: rgba(255,255,255,0.1);
}

.simulator-content {
    padding: 15px;
}

.control-group {
    margin-bottom: 15px;
}

.control-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
}

.sim-btn {
    padding: 8px 10px;
    border: none;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f8f9fa;
    color: #333;
    border: 1px solid #dee2e6;
}

.sim-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.sim-btn.success {
    background: #28a745;
    color: white;
    border-color: #28a745;
}

.sim-btn.error {
    background: #dc3545;
    color: white;
    border-color: #dc3545;
}

.sim-btn.warning {
    background: #ffc107;
    color: #212529;
    border-color: #ffc107;
}

.sim-btn.auto {
    background: #17a2b8;
    color: white;
    border-color: #17a2b8;
    grid-column: 1 / -1;
}

.simulation-log {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 10px;
    max-height: 120px;
    overflow-y: auto;
    font-size: 10px;
    line-height: 1.3;
}

.log-entry {
    margin-bottom: 4px;
    padding: 2px 0;
    border-bottom: 1px solid #e9ecef;
}

.log-entry:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.timestamp {
    color: #6c757d;
    font-weight: 500;
}

@media (max-width: 768px) {
    .admin-simulator-panel {
        left: 10px;
        right: 10px;
        min-width: auto;
        max-width: none;
    }
}
</style>
`;

// Adicionar estilos
document.head.insertAdjacentHTML('beforeend', simulatorStyles);

// Inicializar simulador
let adminSimulator = null;

document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que outros sistemas carregaram
    setTimeout(() => {
        adminSimulator = new FlexcrediAdminSimulator();
        window.adminSimulator = adminSimulator;
        
        console.log('🎮 Simulador Admin disponível!');
        console.log('💡 Use adminSimulator.resetProgress() para resetar');
    }, 2000);
});

window.FlexcrediAdminSimulator = FlexcrediAdminSimulator;
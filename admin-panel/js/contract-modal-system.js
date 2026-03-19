/**
 * FLEXCREDI - Sistema de Modal para Contratos
 * Gerencia a exibição e interação com contratos completos
 */

class FlexcrediContractModal {
    constructor() {
        this.modal = null;
        this.isModalOpen = false;
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
        console.log('FLEXCREDI Contract Modal - Sistema carregado');
    }

    createModal() {
        // Criar estrutura HTML do modal se não existir
        if (document.querySelector('.contract-modal')) {
            this.modal = document.querySelector('.contract-modal');
            return;
        }

        const modalHTML = `
        <div class="contract-modal" id="contractModal" style="display: none;">
            <div class="modal-backdrop"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">
                            <i class="fas fa-file-contract"></i> 
                            Contrato de Empréstimo Pessoal #FL2024001
                        </h3>
                        <button class="modal-close" id="closeContractModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="contract-language-notice">
                        <i class="fas fa-info-circle"></i>
                        <strong>Importante:</strong> Este contrato está em inglês conforme regulamentações da Flórida. 
                        Uma tradução em português está disponível para referência.
                    </div>
                    
                    <div class="contract-viewer" id="contractViewer">
                        <!-- Contrato será carregado aqui pelo JavaScript -->
                        <div class="contract-loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Carregando contrato...</p>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <div class="contract-actions">
                            <button class="btn btn-secondary" id="closeContractFooter">
                                <i class="fas fa-times"></i> Fechar
                            </button>
                            <button class="btn btn-info" id="printContract">
                                <i class="fas fa-print"></i> Imprimir
                            </button>
                            <button class="btn btn-success" id="downloadContract">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                            <button class="btn btn-primary" id="signContractModal" disabled>
                                <i class="fas fa-signature"></i> Assinar Eletronicamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Adicionar ao body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.querySelector('.contract-modal');
    }

    bindEvents() {
        // Aguardar o DOM estar completamente carregado
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });

        // Se já estiver carregado, configurar imediatamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Botão revisar contrato
        const reviewBtn = document.getElementById('reviewContractBtn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }

        // Botões de fechar modal
        const closeButtons = [
            document.getElementById('closeContractModal'),
            document.getElementById('closeContractFooter')
        ];
        
        closeButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.closeModal());
            }
        });

        // Fechar modal clicando no backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeModal());
        }

        // Botão imprimir
        const printBtn = document.getElementById('printContract');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printContract());
        }

        // Botão download
        const downloadBtn = document.getElementById('downloadContract');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadContract());
        }

        // Botão assinar
        const signBtn = document.getElementById('signContractModal');
        if (signBtn) {
            signBtn.addEventListener('click', () => this.initiateSignature());
        }

        // Tecla ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });
    }

    openModal() {
        if (!this.modal) {
            console.error('Modal do contrato não encontrado');
            return;
        }

        // Mostrar modal
        this.modal.style.display = 'flex';
        this.isModalOpen = true;
        
        // Adicionar classe para animação
        setTimeout(() => {
            this.modal.classList.add('modal-open');
        }, 10);

        // Bloquear scroll do body
        document.body.classList.add('modal-open-body');

        // Carregar contrato
        this.loadContract();

        console.log('Modal do contrato aberto');
    }

    closeModal() {
        if (!this.modal) return;

        // Remover classe de animação
        this.modal.classList.remove('modal-open');
        
        // Esconder modal após animação
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.isModalOpen = false;
        }, 300);

        // Restaurar scroll do body
        document.body.classList.remove('modal-open-body');

        console.log('Modal do contrato fechado');
    }

    loadContract() {
        const viewer = document.getElementById('contractViewer');
        if (!viewer) return;

        // Mostrar loading
        viewer.innerHTML = `
            <div class="contract-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Carregando contrato completo...</p>
            </div>
        `;

        // Simular carregamento e gerar contrato
        setTimeout(() => {
            if (window.contractGenerator) {
                const contractContent = window.contractGenerator.generateFullContract();
                viewer.innerHTML = contractContent;
                
                // Habilitar botão de assinatura após carregamento
                const signBtn = document.getElementById('signContractModal');
                if (signBtn) {
                    signBtn.disabled = false;
                    signBtn.innerHTML = '<i class="fas fa-signature"></i> Assinar Eletronicamente';
                }
            } else {
                viewer.innerHTML = `
                    <div class="contract-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Erro ao carregar o contrato. Tente novamente.</p>
                    </div>
                `;
            }
        }, 1500);
    }

    printContract() {
        // Criar janela para impressão apenas do contrato
        const contractContent = document.querySelector('.contract-document-full');
        if (!contractContent) {
            alert('Contrato não carregado para impressão');
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Contrato FL2024001 - FLEXCREDI</title>
                <link rel="stylesheet" href="css/contract-styling.css">
                <style>
                    body { margin: 0; padding: 20px; }
                    @media print { body { margin: 0; padding: 0; } }
                </style>
            </head>
            <body>
                ${contractContent.outerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Aguardar carregamento e imprimir
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };

        console.log('Contrato enviado para impressão');
    }

    downloadContract() {
        // Implementar download do contrato como PDF (simulado)
        const contractData = {
            contractId: 'FL2024001',
            borrower: 'Carlos Eduardo Silva',
            amount: '$25,000',
            generated: new Date().toISOString()
        };

        // Simular download (em produção seria uma chamada para API)
        const blob = new Blob([JSON.stringify(contractData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrato-FL2024001-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);

        // Mostrar notificação
        this.showNotification('Download do contrato iniciado!', 'success');

        console.log('Download do contrato solicitado');
    }

    initiateSignature() {
        // Preparar dados para assinatura
        if (window.contractGenerator) {
            const signData = window.contractGenerator.prepareForSigning();
            
            // Simular processo de assinatura eletrônica
            this.showSignatureProcess(signData);
        } else {
            alert('Sistema de assinatura indisponível. Tente novamente.');
        }
    }

    showSignatureProcess(signData) {
        // Fechar modal atual
        this.closeModal();

        // Mostrar notificação de processo
        this.showNotification('Preparando assinatura eletrônica...', 'info');

        // Simular redirecionamento para assinatura (em produção seria integração com DocuSign/etc)
        setTimeout(() => {
            this.showNotification('Contrato preparado para assinatura! Você será redirecionado para o sistema de assinatura eletrônica.', 'success');
            
            // Aqui seria a integração real com sistema de assinatura
            console.log('Dados preparados para assinatura:', signData);
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = `contract-notification contract-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar sistema de modal
let contractModal = null;

// Aguardar DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        contractModal = new FlexcrediContractModal();
    });
} else {
    contractModal = new FlexcrediContractModal();
}

// Exportar para uso global
window.FlexcrediContractModal = FlexcrediContractModal;
window.contractModal = contractModal;
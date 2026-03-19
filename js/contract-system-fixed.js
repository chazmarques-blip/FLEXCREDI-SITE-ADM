/**
 * FLEXCREDI - Sistema de Contrato Corrigido e Simplificado
 * Versão robusta que garante funcionamento em qualquer situação
 */

// Aguardar carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sistema de contrato FLEXCREDI...');
    
    // Dados do cliente e empréstimo
    const contractData = {
        client: {
            fullName: 'Carlos Eduardo Silva',
            nationality: 'Brasileiro',
            maritalStatus: 'Solteiro',
            occupation: 'Analista de Sistemas',
            documentType: 'Florida Driver\'s License',
            documentNumber: 'S123-456-789-012',
            address: '1234 Sunset Boulevard, Orlando, FL 32801',
            phone: '(407) 555-9876',
            email: 'carlos.silva@email.com'
        },
        loan: {
            contractNumber: 'FL2024001',
            principalAmount: 25000,
            annualInterestRate: 18.5,
            loanTermMonths: 24,
            monthlyPayment: 1287,
            effectiveDate: new Date().toLocaleDateString('pt-BR'),
            totalInterest: 5888,
            totalAmountDue: 30888,
            maturityDate: calculateMaturityDate(24)
        }
    };

    // Função para calcular data de vencimento
    function calculateMaturityDate(months) {
        const date = new Date();
        date.setMonth(date.getMonth() + months);
        return date.toLocaleDateString('pt-BR');
    }

    // Gerar HTML completo do contrato
    function generateContractHTML() {
        return `
        <div class="flexcredi-contract-document">
            <!-- CABEÇALHO OFICIAL -->
            <div class="contract-company-header">
                <div class="company-branding">
                    <h1 class="flexcredi-brand">FleXcredi</h1>
                    <div class="brand-tagline">EASY, SIMPLE, FAST</div>
                </div>
                <div class="company-details">
                    <strong>FLEXCREDI LLC</strong><br>
                    5200 Old Winter Garden Road, Orlando, FL 32811<br>
                    Phone: (407) 555-0123 | Email: info@flexcredi.com<br>
                    Website: www.flexcredi.com
                </div>
            </div>

            <div class="contract-divider"></div>

            <!-- TÍTULO DO CONTRATO -->
            <h1 class="contract-title">PERSONAL LOAN AGREEMENT</h1>
            <div class="contract-number">Agreement #${contractData.loan.contractNumber}</div>

            <!-- INTRODUÇÃO -->
            <p class="contract-introduction">
                This Personal Loan Agreement (hereinafter, the "Agreement") is entered into on this 
                <strong>${contractData.loan.effectiveDate}</strong> (the "Effective Date"), by and between 
                the Parties identified below:
            </p>

            <!-- SEÇÃO PARTES -->
            <h2 class="section-title">PARTIES:</h2>
            
            <div class="party-section">
                <h3 class="party-heading">LENDER:</h3>
                <p class="party-info">
                    Flexcredi LLC, a limited liability company, with its principal office located at 
                    5200 Old Winter Garden Road, Orlando, FL 32811, duly licensed as a Consumer Finance 
                    Company in the State of Florida, hereinafter referred to as "<strong>Flexcredi</strong>."
                </p>
            </div>

            <div class="party-section">
                <h3 class="party-heading">BORROWER:</h3>
                <p class="party-info">
                    <strong>${contractData.client.fullName}</strong>, ${contractData.client.nationality}, 
                    ${contractData.client.maritalStatus}, ${contractData.client.occupation}, holder of 
                    ${contractData.client.documentType}, number ${contractData.client.documentNumber}, 
                    residing at ${contractData.client.address}, phone ${contractData.client.phone}, 
                    email ${contractData.client.email}, hereinafter referred to as "<strong>Borrower</strong>."
                </p>
            </div>

            <!-- TERMOS DO EMPRÉSTIMO -->
            <h2 class="section-title">LOAN TERMS:</h2>
            
            <div class="loan-terms-container">
                <div class="loan-term">
                    <strong>Principal Amount:</strong> $${contractData.loan.principalAmount.toLocaleString()}
                </div>
                <div class="loan-term">
                    <strong>Annual Interest Rate:</strong> ${contractData.loan.annualInterestRate}% per annum
                </div>
                <div class="loan-term">
                    <strong>Loan Term:</strong> ${contractData.loan.loanTermMonths} months
                </div>
                <div class="loan-term">
                    <strong>Monthly Payment:</strong> $${contractData.loan.monthlyPayment.toLocaleString()}
                </div>
                <div class="loan-term">
                    <strong>Total Interest:</strong> $${contractData.loan.totalInterest.toLocaleString()}
                </div>
                <div class="loan-term">
                    <strong>Total Amount Due:</strong> $${contractData.loan.totalAmountDue.toLocaleString()}
                </div>
                <div class="loan-term">
                    <strong>Maturity Date:</strong> ${contractData.loan.maturityDate}
                </div>
            </div>

            <!-- TERMOS E CONDIÇÕES -->
            <h2 class="section-title">TERMS AND CONDITIONS:</h2>

            <h3 class="subsection-title">1. LOAN PURPOSE AND USE</h3>
            <p class="contract-text">
                The Borrower agrees to use the loan funds for legitimate personal, family, or household purposes. 
                The Borrower shall not use the funds for any illegal activities or speculative investments.
            </p>

            <h3 class="subsection-title">2. PAYMENT TERMS</h3>
            <p class="contract-text">
                The Borrower agrees to make monthly payments of $${contractData.loan.monthlyPayment.toLocaleString()} 
                beginning on the first day of the month following the effective date of this Agreement. 
                Payments are due on the same day of each month thereafter until the loan is paid in full.
            </p>

            <h3 class="subsection-title">3. LATE PAYMENTS</h3>
            <p class="contract-text">
                If any payment is more than 10 days late, the Borrower will be charged a late fee of $25.00. 
                Continued late payments may result in acceleration of the entire loan balance.
            </p>

            <h3 class="subsection-title">4. PREPAYMENT</h3>
            <p class="contract-text">
                The Borrower may prepay the loan in whole or in part at any time. Prepayments of more than 25% 
                of the outstanding principal balance within the first 12 months may be subject to a prepayment 
                penalty of 2.5% of the prepaid amount.
            </p>

            <h3 class="subsection-title">5. DEFAULT</h3>
            <p class="contract-text">
                The Borrower will be in default if: (a) any payment is more than 30 days late; (b) the Borrower 
                files for bankruptcy; (c) the Borrower provides false information; or (d) the Borrower violates 
                any other term of this Agreement.
            </p>

            <h3 class="subsection-title">6. GOVERNING LAW</h3>
            <p class="contract-text">
                This Agreement is subject to the laws of the State of Florida. Any disputes arising from this 
                Agreement will be resolved in the courts of Orange County, Florida.
            </p>

            <h3 class="subsection-title">7. ENTIRE AGREEMENT</h3>
            <p class="contract-text">
                This Agreement constitutes the entire agreement between the parties and supersedes all prior 
                negotiations, representations, or agreements relating to the subject matter hereof.
            </p>

            <!-- ASSINATURAS -->
            <div class="signatures-section">
                <h2 class="section-title">SIGNATURES:</h2>
                
                <div class="signature-blocks">
                    <div class="signature-block">
                        <div class="signature-line"></div>
                        <div class="signature-info">
                            <strong>BORROWER:</strong><br>
                            ${contractData.client.fullName}<br>
                            Date: _________________
                        </div>
                    </div>
                    
                    <div class="signature-block">
                        <div class="signature-line"></div>
                        <div class="signature-info">
                            <strong>LENDER:</strong><br>
                            Flexcredi LLC<br>
                            By: _________________<br>
                            Title: Authorized Representative<br>
                            Date: _________________
                        </div>
                    </div>
                </div>
            </div>

            <!-- INFORMAÇÕES LEGAIS -->
            <div class="legal-footer">
                <p><strong>IMPORTANT NOTICE:</strong> This is a legally binding contract. The Borrower should 
                read all terms carefully before signing. If you have questions about this Agreement, consult 
                with an attorney before signing.</p>
                
                <div class="contract-metadata">
                    Agreement Reference: ${contractData.loan.contractNumber} | 
                    Generated: ${new Date().toLocaleString('pt-BR')} | 
                    Version: 2024.1
                </div>
            </div>
        </div>
        `;
    }

    // Criar e mostrar modal
    function showContractModal() {
        // Remover modal existente se houver
        const existingModal = document.getElementById('flexcrediContractModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Criar novo modal
        const modalHTML = `
        <div id="flexcrediContractModal" class="flexcredi-modal">
            <div class="flexcredi-modal-backdrop"></div>
            <div class="flexcredi-modal-container">
                <div class="flexcredi-modal-header">
                    <h3>
                        <i class="fas fa-file-contract"></i>
                        Contrato de Empréstimo #${contractData.loan.contractNumber}
                    </h3>
                    <button id="closeFlexcrediModal" class="modal-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="flexcredi-modal-body">
                    ${generateContractHTML()}
                </div>
                
                <div class="flexcredi-modal-footer">
                    <button id="printFlexcrediContract" class="flexcredi-btn flexcredi-btn-secondary">
                        <i class="fas fa-print"></i> Imprimir
                    </button>
                    <button id="downloadFlexcrediContract" class="flexcredi-btn flexcredi-btn-success">
                        <i class="fas fa-download"></i> Download PDF
                    </button>
                    <button id="signFlexcrediContract" class="flexcredi-btn flexcredi-btn-primary">
                        <i class="fas fa-signature"></i> Assinar Eletronicamente
                    </button>
                    <button id="closeFlexcrediModalFooter" class="flexcredi-btn flexcredi-btn-outline">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        </div>
        `;

        // Adicionar modal ao body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Mostrar modal
        const modal = document.getElementById('flexcrediContractModal');
        modal.style.display = 'flex';
        
        // Adicionar eventos de fechar
        document.getElementById('closeFlexcrediModal').onclick = closeModal;
        document.getElementById('closeFlexcrediModalFooter').onclick = closeModal;
        
        // Fechar ao clicar no backdrop
        modal.querySelector('.flexcredi-modal-backdrop').onclick = closeModal;
        
        // Fechar com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });

        // Eventos dos botões
        document.getElementById('printFlexcrediContract').onclick = function() {
            window.print();
        };

        document.getElementById('downloadFlexcrediContract').onclick = function() {
            alert('Função de download será implementada em breve!');
        };

        document.getElementById('signFlexcrediContract').onclick = function() {
            alert('Preparando assinatura eletrônica...');
        };

        console.log('✅ Modal do contrato exibido com sucesso!');
    }

    // Fechar modal
    function closeModal() {
        const modal = document.getElementById('flexcrediContractModal');
        if (modal) {
            modal.remove();
        }
    }

    // Configurar evento do botão Revisar Contrato
    function setupContractButton() {
        const reviewBtn = document.getElementById('reviewContractBtn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔍 Botão Revisar Contrato clicado!');
                showContractModal();
            });
            console.log('✅ Botão Revisar Contrato configurado!');
        } else {
            console.warn('⚠️ Botão Revisar Contrato não encontrado!');
            // Tentar novamente em 1 segundo
            setTimeout(setupContractButton, 1000);
        }
    }

    // Inicializar sistema
    setupContractButton();
    console.log('✅ Sistema de contrato FLEXCREDI carregado!');
});
/**
 * FLEXCREDI - Sistema Completo de Geração de Contratos
 * Preenche automaticamente todos os campos do template Word com dados do cliente
 */

class FlexcrediContractGenerator {
    constructor() {
        this.contractTemplate = null;
        this.clientData = {};
        this.loanData = {};
        this.init();
    }

    init() {
        // Dados do cliente (normalmente viriam da API/banco de dados)
        this.clientData = {
            fullName: 'Carlos Eduardo Silva',
            nationality: 'Brasileiro',
            maritalStatus: 'Solteiro',
            occupation: 'Analista de Sistemas',
            documentType: 'Florida Driver\'s License',
            documentNumber: 'S123-456-789-012',
            address: {
                street: '1234 Sunset Boulevard',
                city: 'Orlando',
                state: 'FL',
                zipCode: '32801',
                full: '1234 Sunset Boulevard, Orlando, FL 32801'
            },
            phone: '(407) 555-9876',
            email: 'carlos.silva@email.com',
            dateOfBirth: '15/03/1985',
            ssn: '***-**-1234' // Parcialmente mascarado por segurança
        };

        // Dados do empréstimo
        this.loanData = {
            contractNumber: 'FL2024001',
            principalAmount: 25000,
            annualInterestRate: 18.5,
            loanTermMonths: 24,
            monthlyPayment: 1287,
            effectiveDate: new Date().toLocaleDateString('pt-BR'),
            maturityDate: this.calculateMaturityDate(24),
            totalInterest: this.calculateTotalInterest(25000, 18.5, 24),
            totalAmountDue: this.calculateTotalAmount(25000, 18.5, 24),
            lateFee: 25.00,
            prepaymentPenalty: 2.5 // percentual
        };

        // Dados da empresa (FLEXCREDI)
        this.companyData = {
            name: 'Flexcredi LLC',
            fullName: 'Flexcredi LLC, a limited liability company',
            address: '5200 Old Winter Garden Road, Orlando, FL 32811',
            phone: '(407) 555-0123',
            email: 'info@flexcredi.com',
            website: 'www.flexcredi.com',
            license: 'Consumer Finance Company in the State of Florida'
        };

        console.log('FLEXCREDI Contract Generator - Sistema carregado');
    }

    // Calcular data de vencimento
    calculateMaturityDate(months) {
        const date = new Date();
        date.setMonth(date.getMonth() + months);
        return date.toLocaleDateString('pt-BR');
    }

    // Calcular juros totais
    calculateTotalInterest(principal, rate, months) {
        const monthlyRate = rate / 100 / 12;
        const totalPayments = this.loanData.monthlyPayment * months;
        return Math.round((totalPayments - principal) * 100) / 100;
    }

    // Calcular valor total do empréstimo
    calculateTotalAmount(principal, rate, months) {
        return principal + this.calculateTotalInterest(principal, rate, months);
    }

    // Gerar contrato completo em HTML
    generateFullContract() {
        return `
        <div class="contract-document-full">
            <!-- CABEÇALHO DA EMPRESA -->
            <div class="contract-header-company">
                <div class="company-logo-section">
                    <h1 class="company-brand">FleXcredi</h1>
                    <div class="company-tagline">EASY, SIMPLE, FAST</div>
                </div>
                <div class="company-info">
                    <div><strong>${this.companyData.name}</strong></div>
                    <div>${this.companyData.address}</div>
                    <div>Phone: ${this.companyData.phone} | Email: ${this.companyData.email}</div>
                    <div>Website: ${this.companyData.website}</div>
                </div>
            </div>

            <hr class="contract-divider">

            <!-- TÍTULO DO CONTRATO -->
            <h1 class="contract-main-title">PERSONAL LOAN AGREEMENT</h1>
            <div class="contract-subtitle">Agreement #${this.loanData.contractNumber}</div>

            <!-- PARÁGRAFO INTRODUTÓRIO -->
            <p class="contract-intro">
                This Personal Loan Agreement (hereinafter, the "Agreement") is entered into on this 
                <strong>${this.loanData.effectiveDate}</strong> (the "Effective Date"), by and between 
                the Parties identified below:
            </p>

            <!-- SEÇÃO PARTES -->
            <h2 class="contract-section-title">PARTIES:</h2>
            
            <div class="contract-party-section">
                <h3 class="party-title">LENDER:</h3>
                <p class="party-details">
                    ${this.companyData.fullName}, with its principal office located at 
                    ${this.companyData.address}, duly licensed as a ${this.companyData.license}, 
                    hereinafter referred to as "<strong>Flexcredi</strong>."
                </p>
            </div>

            <div class="contract-party-section">
                <h3 class="party-title">BORROWER:</h3>
                <p class="party-details">
                    <strong>${this.clientData.fullName}</strong>, ${this.clientData.nationality}, 
                    ${this.clientData.maritalStatus}, ${this.clientData.occupation}, holder of 
                    ${this.clientData.documentType}, number ${this.clientData.documentNumber}, 
                    residing at ${this.clientData.address.full}, phone ${this.clientData.phone}, 
                    email ${this.clientData.email}, hereinafter referred to as "<strong>Borrower</strong>."
                </p>
            </div>

            <!-- SEÇÃO TERMOS DO EMPRÉSTIMO -->
            <h2 class="contract-section-title">LOAN TERMS:</h2>
            
            <div class="loan-terms-grid">
                <div class="loan-term-item">
                    <strong>Principal Amount:</strong> $${this.loanData.principalAmount.toLocaleString()}
                </div>
                <div class="loan-term-item">
                    <strong>Annual Interest Rate:</strong> ${this.loanData.annualInterestRate}% per annum
                </div>
                <div class="loan-term-item">
                    <strong>Loan Term:</strong> ${this.loanData.loanTermMonths} months
                </div>
                <div class="loan-term-item">
                    <strong>Monthly Payment:</strong> $${this.loanData.monthlyPayment.toLocaleString()}
                </div>
                <div class="loan-term-item">
                    <strong>Total Interest:</strong> $${this.loanData.totalInterest.toLocaleString()}
                </div>
                <div class="loan-term-item">
                    <strong>Total Amount Due:</strong> $${this.loanData.totalAmountDue.toLocaleString()}
                </div>
                <div class="loan-term-item">
                    <strong>Maturity Date:</strong> ${this.loanData.maturityDate}
                </div>
                <div class="loan-term-item">
                    <strong>Late Fee:</strong> $${this.loanData.lateFee} per occurrence
                </div>
            </div>

            <!-- SEÇÃO TERMOS E CONDIÇÕES -->
            <h2 class="contract-section-title">TERMS AND CONDITIONS:</h2>

            <h3 class="contract-subsection-title">1. LOAN PURPOSE AND USE</h3>
            <p>The Borrower agrees to use the loan funds for legitimate personal, family, or household purposes. 
            The Borrower shall not use the funds for any illegal activities or speculative investments.</p>

            <h3 class="contract-subsection-title">2. PAYMENT TERMS</h3>
            <p>The Borrower agrees to make monthly payments of $${this.loanData.monthlyPayment.toLocaleString()} 
            beginning on the first day of the month following the effective date of this Agreement. Payments are due 
            on the same day of each month thereafter until the loan is paid in full.</p>

            <h3 class="contract-subsection-title">3. LATE PAYMENTS</h3>
            <p>If any payment is more than 10 days late, the Borrower will be charged a late fee of 
            $${this.loanData.lateFee}. Continued late payments may result in acceleration of the entire loan balance.</p>

            <h3 class="contract-subsection-title">4. PREPAYMENT</h3>
            <p>The Borrower may prepay the loan in whole or in part at any time. Prepayments of more than 25% of the 
            outstanding principal balance within the first 12 months may be subject to a prepayment penalty of 
            ${this.loanData.prepaymentPenalty}% of the prepaid amount.</p>

            <h3 class="contract-subsection-title">5. DEFAULT</h3>
            <p>The Borrower will be in default if: (a) any payment is more than 30 days late; (b) the Borrower 
            files for bankruptcy; (c) the Borrower provides false information; or (d) the Borrower violates any 
            other term of this Agreement.</p>

            <h3 class="contract-subsection-title">6. GOVERNING LAW</h3>
            <p>This Agreement is subject to the laws of the State of Florida. Any disputes arising from this 
            Agreement will be resolved in the courts of Orange County, Florida.</p>

            <h3 class="contract-subsection-title">7. ENTIRE AGREEMENT</h3>
            <p>This Agreement constitutes the entire agreement between the parties and supersedes all prior 
            negotiations, representations, or agreements relating to the subject matter hereof.</p>

            <!-- SEÇÃO ASSINATURAS -->
            <div class="contract-signatures-section">
                <h2 class="contract-section-title">SIGNATURES:</h2>
                
                <div class="signature-grid">
                    <div class="signature-block">
                        <div class="signature-line"></div>
                        <div class="signature-label">
                            <strong>BORROWER:</strong><br>
                            ${this.clientData.fullName}<br>
                            Date: _________________
                        </div>
                    </div>
                    
                    <div class="signature-block">
                        <div class="signature-line"></div>
                        <div class="signature-label">
                            <strong>LENDER:</strong><br>
                            ${this.companyData.name}<br>
                            By: _________________<br>
                            Title: Authorized Representative<br>
                            Date: _________________
                        </div>
                    </div>
                </div>
            </div>

            <!-- RODAPÉ LEGAL -->
            <div class="contract-footer-legal">
                <p><strong>IMPORTANT NOTICE:</strong> This is a legally binding contract. The Borrower should read 
                all terms carefully before signing. If you have questions about this Agreement, consult with an 
                attorney before signing.</p>
                
                <p><strong>COMPLAINT PROCEDURE:</strong> If you have a complaint, first contact Flexcredi at 
                ${this.companyData.phone} or ${this.companyData.email}. If your complaint is not resolved, 
                you may contact the Florida Office of Financial Regulation.</p>
                
                <div class="contract-reference">
                    <strong>Agreement Reference:</strong> ${this.loanData.contractNumber}<br>
                    <strong>Generated:</strong> ${new Date().toLocaleString('pt-BR')}<br>
                    <strong>Version:</strong> 2024.1
                </div>
            </div>
        </div>
        `;
    }

    // Método para exibir o contrato no modal
    displayContract() {
        const contractContent = this.generateFullContract();
        
        // Encontrar o elemento do modal de contrato
        const contractModal = document.querySelector('.contract-modal');
        const contractViewer = document.querySelector('.contract-viewer');
        
        if (contractViewer) {
            contractViewer.innerHTML = contractContent;
        }
        
        console.log('Contrato completo gerado e exibido');
        return contractContent;
    }

    // Método para preparar dados para assinatura eletrônica
    prepareForSigning() {
        return {
            contractId: this.loanData.contractNumber,
            borrowerName: this.clientData.fullName,
            principalAmount: this.loanData.principalAmount,
            monthlyPayment: this.loanData.monthlyPayment,
            term: this.loanData.loanTermMonths,
            interestRate: this.loanData.annualInterestRate,
            effectiveDate: this.loanData.effectiveDate,
            contractContent: this.generateFullContract()
        };
    }

    // Método para atualizar dados do cliente dinamicamente
    updateClientData(newClientData) {
        this.clientData = { ...this.clientData, ...newClientData };
        console.log('Dados do cliente atualizados:', this.clientData);
    }

    // Método para atualizar dados do empréstimo dinamicamente  
    updateLoanData(newLoanData) {
        this.loanData = { ...this.loanData, ...newLoanData };
        
        // Recalcular valores dependentes
        if (newLoanData.principalAmount || newLoanData.annualInterestRate || newLoanData.loanTermMonths) {
            this.loanData.totalInterest = this.calculateTotalInterest(
                this.loanData.principalAmount, 
                this.loanData.annualInterestRate, 
                this.loanData.loanTermMonths
            );
            this.loanData.totalAmountDue = this.calculateTotalAmount(
                this.loanData.principalAmount, 
                this.loanData.annualInterestRate, 
                this.loanData.loanTermMonths
            );
            this.loanData.maturityDate = this.calculateMaturityDate(this.loanData.loanTermMonths);
        }
        
        console.log('Dados do empréstimo atualizados:', this.loanData);
    }
}

// Instância global do gerador de contratos
let contractGenerator = null;

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    contractGenerator = new FlexcrediContractGenerator();
    
    // Integrar com o botão de revisar contrato existente
    const reviewContractBtn = document.getElementById('reviewContractBtn');
    if (reviewContractBtn) {
        reviewContractBtn.addEventListener('click', function() {
            // Gerar e exibir o contrato completo
            contractGenerator.displayContract();
        });
    }
});

// Exportar para uso global
window.FlexcrediContractGenerator = FlexcrediContractGenerator;
window.contractGenerator = contractGenerator;
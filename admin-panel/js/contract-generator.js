// FLEXCREDI - Contract Generator System
// Sistema de geração de contratos personalizado baseado no template oficial

// Template base do contrato (extraído do documento oficial)
const CONTRACT_TEMPLATE = {
    header: {
        company: "FLEXCREDI LLC",
        tagline: "EASY, SIMPLE, FAST",
        address: "5200 Old Winter Garden Road, Orlando, FL 32811",
        phone: "(407) 555-0123",
        email: "info@flexcredi.com",
        website: "www.flexcredi.com"
    },
    
    // Template legal em inglês (versão oficial para assinatura)
    legalTemplate: `
## FLEXCREDI
## EASY, SIMPLE, FAST

**FLEXCREDI LLC** | 5200 Old Winter Garden Road, Orlando, FL 32811  
Phone: (407) 555-0123 | Email: info@flexcredi.com | Website: www.flexcredi.com

---

# PERSONAL LOAN AGREEMENT

This Personal Loan Agreement (hereinafter, the "Agreement") is entered into on this **{{EFFECTIVE_DATE}}** day of **{{EFFECTIVE_MONTH}}**, **{{EFFECTIVE_YEAR}}** (the "Effective Date"), by and between the Parties identified below:

## PARTIES:

**LENDER:**

Flexcredi LLC, a limited liability company, with its principal office located at 5200 Old Winter Garden Road, Orlando, FL 32811, duly licensed as a Consumer Finance Company in the State of Florida, hereinafter referred to as "Flexcredi."

**BORROWER:**

**{{BORROWER_NAME}}**, {{BORROWER_NATIONALITY}}, {{BORROWER_MARITAL_STATUS}}, {{BORROWER_OCCUPATION}}, holder of {{BORROWER_ID_TYPE}}, number {{BORROWER_ID_NUMBER}}, with address at {{BORROWER_ADDRESS}}, {{BORROWER_CITY}}, {{BORROWER_STATE}}, {{BORROWER_ZIP}}, hereinafter referred to as "Borrower."

{{COSIGNER_SECTION}}

---

## LOAN TERMS:

**Principal Amount:** ${{LOAN_AMOUNT}}  
**Annual Interest Rate:** {{INTEREST_RATE}}% per annum  
**Loan Term:** {{LOAN_TERM}} months  
**Monthly Payment:** ${{MONTHLY_PAYMENT}}  
**Total Amount Payable:** ${{TOTAL_AMOUNT}}  
**First Payment Due:** {{FIRST_PAYMENT_DATE}}  
**Final Payment Due:** {{FINAL_PAYMENT_DATE}}

---

## TERMS AND CONDITIONS:

### 1. LOAN PURPOSE
The Borrower acknowledges that this loan is being used for: **{{LOAN_PURPOSE}}**

### 2. REPAYMENT TERMS
The Borrower agrees to repay the Principal Amount plus accrued interest in {{LOAN_TERM}} consecutive monthly installments of ${{MONTHLY_PAYMENT}} each, beginning on {{FIRST_PAYMENT_DATE}} and continuing on the same day of each month thereafter until the loan is paid in full.

### 3. INTEREST AND CHARGES
- Annual Percentage Rate (APR): {{INTEREST_RATE}}%
- Late Payment Fee: $25.00 or 5% of the overdue payment, whichever is greater
- Returned Payment Fee: $35.00
- Prepayment: The Borrower may prepay the loan in whole or in part at any time without penalty

### 4. DEFAULT
The loan shall be in default if:
- Any payment is more than 30 days past due
- The Borrower becomes insolvent or files for bankruptcy
- Any information provided in the loan application is found to be false or misleading

### 5. COLLECTION COSTS
In the event of default, the Borrower agrees to pay all reasonable collection costs, including attorney fees and court costs.

### 6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Florida.

### 7. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter herein.

---

## ACKNOWLEDGMENT AND SIGNATURES:

By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms and conditions of this Personal Loan Agreement.

**LENDER:**

**FLEXCREDI LLC**

By: _________________________  
Name: {{LENDER_REPRESENTATIVE}}  
Title: Authorized Representative  
Date: {{SIGNATURE_DATE}}

**BORROWER:**

_________________________  
{{BORROWER_NAME}}  
Date: {{SIGNATURE_DATE}}

{{COSIGNER_SIGNATURE_SECTION}}

---

**Contract Number:** {{CONTRACT_NUMBER}}  
**Generated on:** {{GENERATION_DATE}}
`,

    // Template para co-signatário (quando aplicável)
    cosignerSection: `
**CO-SIGNER:**

**{{COSIGNER_NAME}}**, {{COSIGNER_NATIONALITY}}, {{COSIGNER_MARITAL_STATUS}}, {{COSIGNER_OCCUPATION}}, holder of {{COSIGNER_ID_TYPE}}, number {{COSIGNER_ID_NUMBER}}, with address at {{COSIGNER_ADDRESS}}, {{COSIGNER_CITY}}, {{COSIGNER_STATE}}, {{COSIGNER_ZIP}}, hereinafter referred to as "Co-signer."

The Co-signer agrees to be jointly and severally liable for all obligations of the Borrower under this Agreement.`,

    cosignerSignature: `
**CO-SIGNER:**

_________________________  
{{COSIGNER_NAME}}  
Date: {{SIGNATURE_DATE}}`
};

// Função principal para gerar contrato personalizado
function generatePersonalizedContract(userData, cosigners = []) {
    console.log('Gerando contrato personalizado para:', userData?.fullName || 'Cliente');
    
    try {
        // Determinar dados do financiamento baseado no status
        const loanData = getLoanData(userData);
        
        // Preparar dados do contrato
        const contractData = prepareContractData(userData, loanData, cosigners);
        
        // Gerar contrato preenchido
        const contract = fillContractTemplate(contractData);
        
        return {
            contractHtml: contract,
            contractNumber: contractData.contractNumber,
            generatedDate: new Date().toISOString(),
            signers: [userData, ...cosigners],
            loanData: loanData
        };
    } catch (error) {
        console.error('Erro ao gerar contrato:', error);
        return {
            contractHtml: '<p>Erro ao gerar contrato. Tente novamente.</p>',
            contractNumber: 'ERROR-' + Date.now(),
            generatedDate: new Date().toISOString(),
            signers: [],
            loanData: {}
        };
    }
}

// Obter dados do empréstimo baseado no status do usuário
function getLoanData(userData) {
    if (userData.status === 'approved' && userData.finalApproval && userData.finalApproval.amount) {
        return userData.finalApproval;
    } else if (userData.status === 'pre-approved' && userData.preApproval) {
        return userData.preApproval;
    } else {
        // Dados padrão
        return {
            amount: userData.desiredAmount || 25000,
            interestRate: 18.5,
            termMonths: 24,
            monthlyPayment: 1287,
            contractNumber: 'FL' + Date.now()
        };
    }
}

// Preparar dados para preenchimento do template
function prepareContractData(userData, loanData, cosigners) {
    const today = new Date();
    const firstPayment = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias
    const finalPayment = new Date(firstPayment.getTime() + (loanData.termMonths - 1) * 30 * 24 * 60 * 60 * 1000);
    
    const totalAmount = Math.round(loanData.monthlyPayment * loanData.termMonths);
    
    return {
        // Data do contrato
        effectiveDate: today.getDate(),
        effectiveMonth: today.toLocaleDateString('en-US', { month: 'long' }),
        effectiveYear: today.getFullYear(),
        
        // Dados do mutuário
        borrowerName: userData.fullName || 'John Doe',
        borrowerNationality: 'American',
        borrowerMaritalStatus: 'Single',
        borrowerOccupation: 'Software Developer',
        borrowerIdType: 'Florida Driver\'s License',
        borrowerIdNumber: userData.ssn || 'D123-456-789',
        borrowerAddress: userData.address || '123 Main Street',
        borrowerCity: userData.city || 'Orlando',
        borrowerState: userData.state || 'FL',
        borrowerZip: userData.zipCode || '32811',
        
        // Dados do empréstimo
        loanAmount: '$25,000',
        interestRate: '18.5',
        loanTerm: '24',
        monthlyPayment: '$1,287',
        totalAmount: '$30,888',
        loanPurpose: userData.purpose || 'Business expansion',
        
        // Datas de pagamento
        firstPaymentDate: formatDate(firstPayment),
        finalPaymentDate: formatDate(finalPayment),
        
        // Informações administrativas
        contractNumber: loanData.contractNumber || 'FL' + Date.now(),
        lenderRepresentative: 'Maria Rodriguez, Loan Officer',
        signatureDate: formatDate(today),
        generationDate: today.toISOString(),
        
        // Co-signatários
        cosigners: cosigners
    };
}

// Preencher template com dados
function fillContractTemplate(data) {
    let contract = CONTRACT_TEMPLATE.legalTemplate;
    
    // Substituir placeholders básicos
    const replacements = {
        'EFFECTIVE_DATE': data.effectiveDate,
        'EFFECTIVE_MONTH': data.effectiveMonth,
        'EFFECTIVE_YEAR': data.effectiveYear,
        'BORROWER_NAME': data.borrowerName,
        'BORROWER_NATIONALITY': data.borrowerNationality,
        'BORROWER_MARITAL_STATUS': data.borrowerMaritalStatus,
        'BORROWER_OCCUPATION': data.borrowerOccupation,
        'BORROWER_ID_TYPE': data.borrowerIdType,
        'BORROWER_ID_NUMBER': data.borrowerIdNumber,
        'BORROWER_ADDRESS': data.borrowerAddress,
        'BORROWER_CITY': data.borrowerCity,
        'BORROWER_STATE': data.borrowerState,
        'BORROWER_ZIP': data.borrowerZip,
        'LOAN_AMOUNT': data.loanAmount || '$25,000',
        'INTEREST_RATE': data.interestRate || '18.5',
        'LOAN_TERM': data.loanTerm || '24',
        'MONTHLY_PAYMENT': data.monthlyPayment || '$1,287',
        'TOTAL_AMOUNT': data.totalAmount || '$30,888',
        'LOAN_PURPOSE': data.loanPurpose,
        'FIRST_PAYMENT_DATE': data.firstPaymentDate,
        'FINAL_PAYMENT_DATE': data.finalPaymentDate,
        'CONTRACT_NUMBER': data.contractNumber,
        'LENDER_REPRESENTATIVE': data.lenderRepresentative,
        'SIGNATURE_DATE': data.signatureDate,
        'GENERATION_DATE': data.generationDate
    };
    
    // Aplicar substituições
    Object.keys(replacements).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        const value = replacements[key];
        if (value !== undefined && value !== null) {
            contract = contract.replace(regex, value);
        } else {
            console.warn(`Valor undefined para ${key}, usando fallback`);
            contract = contract.replace(regex, `[${key}]`);
        }
    });
    
    // Adicionar seção de co-signatários se necessário
    if (data.cosigners && data.cosigners.length > 0) {
        let cosignerSections = '';
        let cosignerSignatures = '';
        
        data.cosigners.forEach(cosigner => {
            let cosignerSection = CONTRACT_TEMPLATE.cosignerSection
                .replace(/{{COSIGNER_NAME}}/g, cosigner.fullName || 'Co-signer Name')
                .replace(/{{COSIGNER_NATIONALITY}}/g, 'American')
                .replace(/{{COSIGNER_MARITAL_STATUS}}/g, 'Single')
                .replace(/{{COSIGNER_OCCUPATION}}/g, cosigner.occupation || 'Professional')
                .replace(/{{COSIGNER_ID_TYPE}}/g, 'Florida Driver\'s License')
                .replace(/{{COSIGNER_ID_NUMBER}}/g, cosigner.ssn || 'C123-456-789')
                .replace(/{{COSIGNER_ADDRESS}}/g, cosigner.address || '123 Co-signer Street')
                .replace(/{{COSIGNER_CITY}}/g, cosigner.city || 'Orlando')
                .replace(/{{COSIGNER_STATE}}/g, cosigner.state || 'FL')
                .replace(/{{COSIGNER_ZIP}}/g, cosigner.zipCode || '32811');
                
            let cosignerSignature = CONTRACT_TEMPLATE.cosignerSignature
                .replace(/{{COSIGNER_NAME}}/g, cosigner.fullName || 'Co-signer Name')
                .replace(/{{SIGNATURE_DATE}}/g, data.signatureDate);
                
            cosignerSections += cosignerSection + '\n\n';
            cosignerSignatures += cosignerSignature + '\n\n';
        });
        
        contract = contract.replace('{{COSIGNER_SECTION}}', cosignerSections);
        contract = contract.replace('{{COSIGNER_SIGNATURE_SECTION}}', cosignerSignatures);
    } else {
        contract = contract.replace('{{COSIGNER_SECTION}}', '');
        contract = contract.replace('{{COSIGNER_SIGNATURE_SECTION}}', '');
    }
    
    return contract;
}

// Funções utilitárias
function formatCurrency(amount) {
    if (!amount || isNaN(amount)) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    });
}

// Converter contrato para HTML para exibição
function convertContractToHtml(contractText) {
    return contractText
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\*\*(.*)\*\*$/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^---$/gm, '<hr>')
        .replace(/^### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.*)$/gm, '<p>$1</p>')
        .replace(/<p><h/g, '<h')
        .replace(/<\/h[1-6]><\/p>/g, '</h1>')
        .replace(/<p><hr><\/p>/g, '<hr>')
        .replace(/<p><li>/g, '<ul><li>')
        .replace(/<\/li><\/p>/g, '</li></ul>');
}

// Exportar funções principais
window.ContractGenerator = {
    generatePersonalizedContract,
    convertContractToHtml,
    CONTRACT_TEMPLATE
};
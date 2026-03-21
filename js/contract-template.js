// Contract Template - FlexCredi Personal Loan Agreement
// Official contract is in English (US territory requirement)
// Preview versions available in Portuguese and Spanish

const ContractTemplate = {
    // English (Official Legal Document)
    en: {
        title: 'PERSONAL LOAN AGREEMENT',
        intro: (data) => `
            <p>This Personal Loan Agreement (the "Agreement") is made and entered into on this
            <strong>${data.day}</strong> day of <strong>${data.month}</strong>, <strong>${data.year}</strong> (the "Effective Date"),</p>
            
            <p><strong>BETWEEN:</strong></p>
            
            <p><strong>FLEXCREDI LLC</strong>, a limited liability company organized and existing under the laws of the State of Florida, with its principal place of business located at 5200 OL WINTER GARDEN ROAD, ST 110, ORLANDO, FL 32811 (hereinafter referred to as "Lender").</p>
            
            <p><strong>AND</strong></p>
            
            <p><strong>${data.borrowerName}</strong>, an individual, residing at <strong>${data.borrowerAddress}</strong>, <strong>${data.borrowerCityStateZip}</strong>, with Social Security Number (SSN) <strong>${data.borrowerSSN}</strong>, phone number <strong>${data.borrowerPhone}</strong> and email address <strong>${data.borrowerEmail}</strong> (hereinafter referred to as "Borrower").</p>
            
            <p>(Lender and Borrower collectively referred to as the "Parties" and individually as a "Party").</p>
            
            <p>WHEREAS, Borrower desires to obtain a personal loan from Lender, and Lender is willing to provide such a loan, subject to the terms and conditions set forth in this Agreement.</p>
            
            <p>NOW, THEREFORE, in consideration of the mutual covenants and promises herein contained, the Parties agree as follows:</p>
        `,
        sections: {
            loanTerms: {
                title: '1. LOAN AMOUNT AND TERMS',
                content: (data) => `
                    <p>1.1. <strong>Principal Amount:</strong> Lender agrees to lend to Borrower the principal sum of <strong>${data.loanAmountWords}</strong> (US$ <strong>${data.loanAmount}</strong>) (the "Principal Amount").</p>
                    <p>1.2. <strong>Interest Rate:</strong> The Principal Amount shall bear interest at a fixed rate of <strong>${data.interestRate}%</strong> per annum.</p>
                    <p>1.3. <strong>Loan Term:</strong> The loan term shall be for a period of <strong>${data.loanTerm}</strong> months, commencing on the Effective Date.</p>
                    <p>1.4. <strong>Total Repayment Amount:</strong> The total amount to be repaid by Borrower, including principal and interest, shall be US$ <strong>${data.totalRepayment}</strong>.</p>
                `
            },
            disbursement: {
                title: '2. DISBURSEMENT OF LOAN',
                content: (data) => `
                    <p>2.1. <strong>Disbursement Method:</strong> The Principal Amount shall be disbursed to the Borrower's designated bank account via <strong>ACH Transfer</strong>.</p>
                    <p>2.2. <strong>Borrower's Bank Account for Disbursement:</strong><br>
                    Bank Name: <strong>${data.bankName || '[To be provided]'}</strong><br>
                    Account Number (Last 4 digits): <strong>${data.accountLast4 || '****'}</strong></p>
                `
            },
            repayment: {
                title: '3. REPAYMENT SCHEDULE',
                content: (data) => `
                    <p>3.1. <strong>Installments:</strong> Borrower shall repay the Total Repayment Amount in <strong>${data.loanTerm}</strong> equal monthly installments of US$ <strong>${data.monthlyPayment}</strong> each.</p>
                    <p>3.2. <strong>Due Date:</strong> Each installment shall be due on the <strong>15th</strong> day of each month, starting from <strong>${data.firstPaymentMonth}</strong>, <strong>${data.firstPaymentYear}</strong>, until the Total Repayment Amount is paid in full.</p>
                    <p>3.3. <strong>Payment Method:</strong> All payments shall be made in United States Dollars (USD) via <strong>ACH Debit</strong>.</p>
                `
            },
            latePayments: {
                title: '4. LATE PAYMENTS',
                content: () => `
                    <p>4.1. <strong>Late Fee:</strong> If any installment is not received by Lender within <strong>10</strong> days after its due date, Borrower shall pay a late fee of <strong>5%</strong> of the overdue amount, not to exceed US$25.00.</p>
                    <p>4.2. <strong>Default Interest:</strong> Any overdue amount shall accrue interest at a default rate of <strong>24%</strong> per annum until paid.</p>
                `
            },
            prepayment: {
                title: '5. PREPAYMENT',
                content: () => `
                    <p>5.1. <strong>No Prepayment Penalty:</strong> Borrower may prepay the loan in whole or in part at any time without incurring any prepayment penalty.</p>
                `
            },
            representations: {
                title: '6. REPRESENTATIONS AND WARRANTIES OF BORROWER',
                content: () => `
                    <p>Borrower represents and warrants to Lender that:</p>
                    <ul>
                        <li>Borrower has the legal capacity to enter into this Agreement.</li>
                        <li>All information provided by Borrower to Lender is true, accurate, and complete.</li>
                        <li>Borrower is not currently in default under any other loan agreement or financial obligation.</li>
                    </ul>
                `
            },
            default: {
                title: '7. DEFAULT',
                content: () => `
                    <p>The occurrence of any of the following shall constitute an event of default ("Event of Default") under this Agreement:</p>
                    <ul>
                        <li>Failure of Borrower to make any payment when due.</li>
                        <li>Breach by Borrower of any other term or condition of this Agreement.</li>
                        <li>Any representation or warranty made by Borrower proving to be false or misleading.</li>
                        <li>Insolvency or bankruptcy of Borrower.</li>
                    </ul>
                `
            },
            remedies: {
                title: '8. REMEDIES UPON DEFAULT',
                content: () => `
                    <p>Upon the occurrence of an Event of Default, Lender may, at its option:</p>
                    <ul>
                        <li>Declare the entire unpaid Principal Amount, together with all accrued interest and other charges, immediately due and payable.</li>
                        <li>Exercise any other rights or remedies available under applicable law.</li>
                    </ul>
                `
            },
            achAuthorization: {
                title: '9. ACH PAYMENT AUTHORIZATION',
                content: (data) => `
                    <p>This section constitutes your authorization for Flexcredi LLC to initiate Automated Clearing House (ACH) debit entries from your bank account for the purpose of collecting payments related to your Personal Loan Agreement.</p>
                    
                    <p><strong>Customer Information:</strong><br>
                    Name: <strong>${data.borrowerName}</strong><br>
                    Billing Address: <strong>${data.borrowerAddress}</strong>, <strong>${data.borrowerCityStateZip}</strong><br>
                    Phone: <strong>${data.borrowerPhone}</strong><br>
                    Email: <strong>${data.borrowerEmail}</strong></p>
                    
                    <p><strong>Bank Account Information:</strong><br>
                    Bank Name: <strong>${data.bankName || '[To be provided]'}</strong><br>
                    Account Number (Last 4): <strong>${data.accountLast4 || '****'}</strong></p>
                    
                    <p><strong>Authorization Terms:</strong> Customer authorizes Flexcredi LLC to initiate ACH debit entries for agreed payments, including all fees and balances owed under this Personal Loan Agreement.</p>
                    
                    <p><strong>Reversals, Returns, and Insufficient Funds:</strong> Any returned or rejected ACH payment will incur a $25 returned payment fee.</p>
                `
            },
            governingLaw: {
                title: '10. GOVERNING LAW',
                content: () => `
                    <p>This Agreement shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of laws principles.</p>
                `
            },
            entireAgreement: {
                title: '11. ENTIRE AGREEMENT',
                content: () => `
                    <p>This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior discussions, negotiations and agreements, whether oral or written.</p>
                `
            },
            severability: {
                title: '12. SEVERABILITY',
                content: () => `
                    <p>If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
                `
            }
        },
        signatures: (data) => `
            <div class="signatures-section">
                <p>IN WITNESS WHEREOF, the Parties have executed this Personal Loan Agreement as of the Effective Date first written above.</p>
                
                <div class="signature-block">
                    <p><strong>LENDER:</strong></p>
                    <p>FLEXCREDI LLC</p>
                    <p>By: _________________________</p>
                    <p>Arthur Reis Marques</p>
                    <p>Title: Principal Executive Officer</p>
                </div>
                
                <div class="signature-block">
                    <p><strong>BORROWER:</strong></p>
                    <p>Name: <strong>${data.borrowerName}</strong></p>
                    <p>Signature: _________________________</p>
                    <p>SSN: <strong>${data.borrowerSSN}</strong></p>
                </div>
                
                <div class="ach-consent">
                    <p><strong>ACH AUTHORIZATION CONSENT:</strong> By signing here, I specifically acknowledge and agree to the ACH Payment Authorization terms set forth in Section 9 of this Agreement.</p>
                    <p>Borrower Initials: _________________________</p>
                </div>
            </div>
        `,
        contractNumber: (num) => `Contract #${num}`
    },
    
    // Portuguese (Preview Only - Apenas para Visualização)
    pt: {
        title: 'CONTRATO DE EMPRÉSTIMO PESSOAL',
        previewNotice: '⚠️ VERSÃO PARA VISUALIZAÇÃO - O contrato oficial está em inglês conforme exigido pela legislação americana.',
        intro: (data) => `
            <p>Este Contrato de Empréstimo Pessoal (o "Contrato") é celebrado neste dia
            <strong>${data.day}</strong> de <strong>${data.monthPt}</strong> de <strong>${data.year}</strong> (a "Data Efetiva"),</p>
            
            <p><strong>ENTRE:</strong></p>
            
            <p><strong>FLEXCREDI LLC</strong>, uma sociedade de responsabilidade limitada organizada e existente sob as leis do Estado da Flórida, com sede em 5200 OL WINTER GARDEN ROAD, ST 110, ORLANDO, FL 32811 (doravante denominada "Credor").</p>
            
            <p><strong>E</strong></p>
            
            <p><strong>${data.borrowerName}</strong>, pessoa física, residente em <strong>${data.borrowerAddress}</strong>, <strong>${data.borrowerCityStateZip}</strong>, com Número de Seguro Social (SSN) <strong>${data.borrowerSSN}</strong>, telefone <strong>${data.borrowerPhone}</strong> e e-mail <strong>${data.borrowerEmail}</strong> (doravante denominado "Mutuário").</p>
        `,
        sections: {
            loanTerms: {
                title: '1. VALOR E TERMOS DO EMPRÉSTIMO',
                content: (data) => `
                    <p>1.1. <strong>Valor Principal:</strong> O Credor concorda em emprestar ao Mutuário a quantia de US$ <strong>${data.loanAmount}</strong> (o "Valor Principal").</p>
                    <p>1.2. <strong>Taxa de Juros:</strong> O Valor Principal terá juros a uma taxa fixa de <strong>${data.interestRate}%</strong> ao ano.</p>
                    <p>1.3. <strong>Prazo do Empréstimo:</strong> O prazo do empréstimo será de <strong>${data.loanTerm}</strong> meses.</p>
                    <p>1.4. <strong>Valor Total de Pagamento:</strong> O valor total a ser pago pelo Mutuário será de US$ <strong>${data.totalRepayment}</strong>.</p>
                `
            },
            repayment: {
                title: '2. CRONOGRAMA DE PAGAMENTO',
                content: (data) => `
                    <p>2.1. <strong>Parcelas:</strong> O Mutuário pagará o valor em <strong>${data.loanTerm}</strong> parcelas mensais iguais de US$ <strong>${data.monthlyPayment}</strong> cada.</p>
                    <p>2.2. <strong>Data de Vencimento:</strong> Cada parcela vencerá no dia <strong>15</strong> de cada mês.</p>
                `
            },
            latePayments: {
                title: '3. PAGAMENTOS EM ATRASO',
                content: () => `
                    <p>3.1. <strong>Multa por Atraso:</strong> Se qualquer parcela não for recebida dentro de <strong>10</strong> dias após a data de vencimento, será cobrada uma multa de <strong>5%</strong> do valor em atraso.</p>
                `
            },
            governingLaw: {
                title: '4. LEI APLICÁVEL',
                content: () => `
                    <p>Este Contrato será regido pelas leis do Estado da Flórida, Estados Unidos.</p>
                `
            }
        },
        signatures: (data) => `
            <div class="signatures-section">
                <p>EM TESTEMUNHO DO QUE, as Partes assinaram este Contrato na Data Efetiva.</p>
                
                <div class="signature-block">
                    <p><strong>CREDOR:</strong> FLEXCREDI LLC</p>
                    <p>Por: _________________________</p>
                </div>
                
                <div class="signature-block">
                    <p><strong>MUTUÁRIO:</strong></p>
                    <p>Nome: <strong>${data.borrowerName}</strong></p>
                    <p>Assinatura: _________________________</p>
                </div>
            </div>
        `,
        contractNumber: (num) => `Contrato #${num}`
    },
    
    // Spanish (Preview Only - Solo para Visualización)
    es: {
        title: 'CONTRATO DE PRÉSTAMO PERSONAL',
        previewNotice: '⚠️ VERSIÓN PARA VISUALIZACIÓN - El contrato oficial está en inglés según lo requiere la ley estadounidense.',
        intro: (data) => `
            <p>Este Contrato de Préstamo Personal (el "Contrato") se celebra en este día
            <strong>${data.day}</strong> de <strong>${data.monthEs}</strong> de <strong>${data.year}</strong> (la "Fecha Efectiva"),</p>
            
            <p><strong>ENTRE:</strong></p>
            
            <p><strong>FLEXCREDI LLC</strong>, una sociedad de responsabilidad limitada organizada bajo las leyes del Estado de Florida, con domicilio en 5200 OL WINTER GARDEN ROAD, ST 110, ORLANDO, FL 32811 (en adelante denominada "Prestamista").</p>
            
            <p><strong>Y</strong></p>
            
            <p><strong>${data.borrowerName}</strong>, persona física, con domicilio en <strong>${data.borrowerAddress}</strong>, <strong>${data.borrowerCityStateZip}</strong>, con Número de Seguro Social (SSN) <strong>${data.borrowerSSN}</strong>, teléfono <strong>${data.borrowerPhone}</strong> y correo electrónico <strong>${data.borrowerEmail}</strong> (en adelante denominado "Prestatario").</p>
        `,
        sections: {
            loanTerms: {
                title: '1. MONTO Y TÉRMINOS DEL PRÉSTAMO',
                content: (data) => `
                    <p>1.1. <strong>Monto Principal:</strong> El Prestamista acuerda prestar al Prestatario la suma de US$ <strong>${data.loanAmount}</strong> (el "Monto Principal").</p>
                    <p>1.2. <strong>Tasa de Interés:</strong> El Monto Principal devengará intereses a una tasa fija de <strong>${data.interestRate}%</strong> anual.</p>
                    <p>1.3. <strong>Plazo del Préstamo:</strong> El plazo del préstamo será de <strong>${data.loanTerm}</strong> meses.</p>
                    <p>1.4. <strong>Monto Total de Pago:</strong> El monto total a pagar será de US$ <strong>${data.totalRepayment}</strong>.</p>
                `
            },
            repayment: {
                title: '2. CALENDARIO DE PAGOS',
                content: (data) => `
                    <p>2.1. <strong>Cuotas:</strong> El Prestatario pagará el monto en <strong>${data.loanTerm}</strong> cuotas mensuales iguales de US$ <strong>${data.monthlyPayment}</strong> cada una.</p>
                    <p>2.2. <strong>Fecha de Vencimiento:</strong> Cada cuota vencerá el día <strong>15</strong> de cada mes.</p>
                `
            },
            latePayments: {
                title: '3. PAGOS ATRASADOS',
                content: () => `
                    <p>3.1. <strong>Cargo por Mora:</strong> Si cualquier cuota no se recibe dentro de <strong>10</strong> días después de la fecha de vencimiento, se cobrará un cargo de <strong>5%</strong> del monto atrasado.</p>
                `
            },
            governingLaw: {
                title: '4. LEY APLICABLE',
                content: () => `
                    <p>Este Contrato se regirá por las leyes del Estado de Florida, Estados Unidos.</p>
                `
            }
        },
        signatures: (data) => `
            <div class="signatures-section">
                <p>EN FE DE LO CUAL, las Partes han firmado este Contrato en la Fecha Efectiva.</p>
                
                <div class="signature-block">
                    <p><strong>PRESTAMISTA:</strong> FLEXCREDI LLC</p>
                    <p>Por: _________________________</p>
                </div>
                
                <div class="signature-block">
                    <p><strong>PRESTATARIO:</strong></p>
                    <p>Nombre: <strong>${data.borrowerName}</strong></p>
                    <p>Firma: _________________________</p>
                </div>
            </div>
        `,
        contractNumber: (num) => `Contrato #${num}`
    }
};

// Month translations
const monthNames = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
};

// Number to words converter (for loan amount)
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    return numberToWords(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 ? ' ' + numberToWords(num % 1000000) : '');
}

// Generate contract data from user info
function generateContractData(userData, isCoSigner = false, mainSignerData = null) {
    const now = new Date();
    const firstPaymentDate = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    
    const loanAmount = parseFloat(userData.requestedAmount || userData.loanAmount || 10000);
    const interestRate = parseFloat(userData.interestRate || 18.5);
    const loanTerm = parseInt(userData.term || userData.loanTerm || 24);
    const monthlyPayment = parseFloat(userData.monthlyPayment || 508);
    const totalRepayment = (monthlyPayment * loanTerm).toFixed(2);
    
    return {
        // Date info
        day: now.getDate(),
        month: monthNames.en[now.getMonth()],
        monthPt: monthNames.pt[now.getMonth()],
        monthEs: monthNames.es[now.getMonth()],
        year: now.getFullYear(),
        
        // Borrower info
        borrowerName: userData.fullName || 'N/A',
        borrowerAddress: userData.address || 'N/A',
        borrowerCityStateZip: `${userData.city || ''}, ${userData.state || ''} ${userData.zipCode || ''}`.trim(),
        borrowerSSN: userData.ssn || '***-**-****',
        borrowerPhone: userData.phone || 'N/A',
        borrowerEmail: userData.email || 'N/A',
        
        // Loan info
        loanAmount: loanAmount.toLocaleString('en-US'),
        loanAmountWords: numberToWords(Math.round(loanAmount)) + ' Dollars',
        interestRate: interestRate,
        loanTerm: loanTerm,
        monthlyPayment: monthlyPayment.toLocaleString('en-US'),
        totalRepayment: parseFloat(totalRepayment).toLocaleString('en-US'),
        
        // Payment info
        firstPaymentMonth: monthNames.en[firstPaymentDate.getMonth()],
        firstPaymentYear: firstPaymentDate.getFullYear(),
        
        // Bank info (placeholder)
        bankName: userData.bankName || '[To be provided]',
        accountLast4: userData.accountLast4 || '****',
        
        // Contract reference
        contractNumber: userData.contractNumber || `FL${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        
        // Co-signer specific
        isCoSigner: isCoSigner,
        mainSignerName: mainSignerData ? mainSignerData.fullName : null,
        relationship: userData.relationship || 'N/A'
    };
}

// Generate full contract HTML
function generateContractHTML(userData, language = 'en', isCoSigner = false, mainSignerData = null) {
    const data = generateContractData(userData, isCoSigner, mainSignerData);
    const template = ContractTemplate[language] || ContractTemplate.en;
    const officialTemplate = ContractTemplate.en;
    
    let html = `<div class="contract-document" data-language="${language}">`;
    
    // Add preview notice for non-English versions
    if (language !== 'en' && template.previewNotice) {
        html += `<div class="contract-preview-notice">${template.previewNotice}</div>`;
    }
    
    // Contract header
    html += `
        <div class="contract-header">
            <div class="contract-logo">
                <img src="img/logo_fc.png" alt="FlexCredi" onerror="this.style.display='none'">
            </div>
            <h1>${template.title}</h1>
            <p class="contract-number">${template.contractNumber(data.contractNumber)}</p>
        </div>
    `;
    
    // For preview languages (pt, es), show simplified version
    if (language !== 'en') {
        html += template.intro(data);
        
        // Show key sections only
        ['loanTerms', 'repayment', 'latePayments', 'governingLaw'].forEach(key => {
            if (template.sections[key]) {
                html += `
                    <div class="contract-section">
                        <h2>${template.sections[key].title}</h2>
                        ${template.sections[key].content(data)}
                    </div>
                `;
            }
        });
        
        html += template.signatures(data);
        
        // Add English version notice at the bottom
        html += `
            <div class="english-version-notice">
                <p><strong>IMPORTANT:</strong> This is a preview translation for informational purposes only. The legally binding contract is in English.</p>
                <button class="btn btn-primary view-english-btn" onclick="showContractInEnglish()">
                    <i class="fas fa-file-contract"></i> View Official Contract (English)
                </button>
            </div>
        `;
    } else {
        // Full English contract
        html += officialTemplate.intro(data);
        
        // All sections for English version
        Object.keys(officialTemplate.sections).forEach(key => {
            html += `
                <div class="contract-section">
                    <h2>${officialTemplate.sections[key].title}</h2>
                    ${officialTemplate.sections[key].content(data)}
                </div>
            `;
        });
        
        html += officialTemplate.signatures(data);
    }
    
    html += '</div>';
    
    return html;
}

// Generate Co-Signer contract HTML
function generateCoSignerContractHTML(coSignerData, mainSignerData, language = 'en') {
    const data = generateContractData(coSignerData, true, mainSignerData);
    const mainData = generateContractData(mainSignerData, false, null);
    
    let html = `<div class="contract-document cosigner-contract" data-language="${language}">`;
    
    // Preview notice for non-English
    if (language !== 'en') {
        const notices = {
            pt: '⚠️ VERSÃO PARA VISUALIZAÇÃO - O contrato oficial está em inglês.',
            es: '⚠️ VERSIÓN PARA VISUALIZACIÓN - El contrato oficial está en inglés.'
        };
        html += `<div class="contract-preview-notice">${notices[language] || ''}</div>`;
    }
    
    const titles = {
        en: 'CO-SIGNER AGREEMENT',
        pt: 'CONTRATO DE CO-SIGNATÁRIO',
        es: 'CONTRATO DE CO-FIRMANTE'
    };
    
    html += `
        <div class="contract-header">
            <div class="contract-logo">
                <img src="img/logo_fc.png" alt="FlexCredi" onerror="this.style.display='none'">
            </div>
            <h1>${titles[language] || titles.en}</h1>
            <p class="contract-number">Reference: ${mainData.contractNumber}</p>
        </div>
    `;
    
    // English (official) version
    if (language === 'en') {
        html += `
            <div class="contract-section">
                <p>This Co-Signer Agreement (the "Agreement") is entered into as of <strong>${data.month} ${data.day}, ${data.year}</strong>,</p>
                
                <p><strong>BETWEEN:</strong></p>
                
                <p><strong>FLEXCREDI LLC</strong>, a Florida limited liability company ("Lender"),</p>
                
                <p><strong>AND</strong></p>
                
                <p><strong>${data.borrowerName}</strong>, residing at <strong>${data.borrowerAddress}, ${data.borrowerCityStateZip}</strong>, 
                SSN: <strong>${data.borrowerSSN}</strong>, Phone: <strong>${data.borrowerPhone}</strong>, 
                Email: <strong>${data.borrowerEmail}</strong> ("Co-Signer").</p>
                
                <p><strong>IN CONNECTION WITH:</strong> The Personal Loan Agreement dated <strong>${mainData.month} ${mainData.day}, ${mainData.year}</strong> 
                between Lender and <strong>${mainData.borrowerName}</strong> ("Primary Borrower") for a principal amount of 
                US$ <strong>${mainData.loanAmount}</strong> (the "Primary Loan Agreement").</p>
            </div>
            
            <div class="contract-section">
                <h2>1. CO-SIGNER RESPONSIBILITIES</h2>
                <p>The Co-Signer agrees to:</p>
                <ul>
                    <li>Assume joint and several liability for the full repayment of the loan;</li>
                    <li>Consent to credit analysis and income verification;</li>
                    <li>Make payments in case of default by the Primary Borrower;</li>
                    <li>Authorize automatic debit from bank account if necessary.</li>
                </ul>
            </div>
            
            <div class="contract-section">
                <h2>2. LOAN DETAILS</h2>
                <p><strong>Principal Amount:</strong> US$ ${mainData.loanAmount}</p>
                <p><strong>Interest Rate:</strong> ${mainData.interestRate}% per annum</p>
                <p><strong>Term:</strong> ${mainData.loanTerm} months</p>
                <p><strong>Monthly Payment:</strong> US$ ${mainData.monthlyPayment}</p>
            </div>
            
            <div class="contract-section">
                <h2>3. TERMS AND CONDITIONS</h2>
                <p>3.1. The Co-Signer shall be responsible for the full payment of the loan in case of default by the Primary Borrower.</p>
                <p>3.2. The Co-Signer authorizes the verification of their credit history and financial information.</p>
                <p>3.3. This agreement remains valid until the loan is fully repaid.</p>
                <p>3.4. The Co-Signer acknowledges receipt of a copy of the Primary Loan Agreement.</p>
            </div>
            
            <div class="contract-section">
                <h2>4. GOVERNING LAW</h2>
                <p>This Agreement shall be governed by the laws of the State of Florida.</p>
            </div>
            
            <div class="signatures-section">
                <p>IN WITNESS WHEREOF, the parties have executed this Agreement.</p>
                
                <div class="signature-block">
                    <p><strong>LENDER:</strong> FLEXCREDI LLC</p>
                    <p>By: _________________________</p>
                    <p>Arthur Reis Marques, Principal Executive Officer</p>
                </div>
                
                <div class="signature-block">
                    <p><strong>CO-SIGNER:</strong></p>
                    <p>Name: <strong>${data.borrowerName}</strong></p>
                    <p>Relationship to Borrower: <strong>${data.relationship}</strong></p>
                    <p>Signature: _________________________</p>
                    <p>SSN: <strong>${data.borrowerSSN}</strong></p>
                </div>
                
                <div class="signature-block">
                    <p><strong>PRIMARY BORROWER ACKNOWLEDGMENT:</strong></p>
                    <p>Name: <strong>${mainData.borrowerName}</strong></p>
                    <p>Signature: _________________________</p>
                </div>
            </div>
        `;
    } else {
        // Portuguese or Spanish preview
        const content = {
            pt: {
                responsibilities: 'RESPONSABILIDADES DO CO-SIGNATÁRIO',
                respList: [
                    'Responsabilidade solidária pelo pagamento integral do empréstimo;',
                    'Concordância com análise de crédito e verificação de renda;',
                    'Compromisso de pagamento em caso de inadimplência do mutuário principal;',
                    'Autorização para débito automático em caso de necessidade.'
                ],
                terms: 'TERMOS E CONDIÇÕES',
                termsList: [
                    'O co-signatário será responsável pelo pagamento integral do empréstimo em caso de inadimplência.',
                    'O co-signatário autoriza a verificação de seu histórico de crédito.',
                    'Este contrato permanece válido até a quitação total do empréstimo.'
                ],
                linkedTo: `Este contrato está vinculado ao contrato principal de empréstimo #${mainData.contractNumber}.`
            },
            es: {
                responsibilities: 'RESPONSABILIDADES DEL CO-FIRMANTE',
                respList: [
                    'Responsabilidad solidaria por el pago total del préstamo;',
                    'Consentimiento para análisis de crédito y verificación de ingresos;',
                    'Compromiso de pago en caso de incumplimiento del prestatario principal;',
                    'Autorización para débito automático si es necesario.'
                ],
                terms: 'TÉRMINOS Y CONDICIONES',
                termsList: [
                    'El co-firmante será responsable del pago total del préstamo en caso de incumplimiento.',
                    'El co-firmante autoriza la verificación de su historial crediticio.',
                    'Este contrato permanece válido hasta el pago total del préstamo.'
                ],
                linkedTo: `Este contrato está vinculado al contrato principal de préstamo #${mainData.contractNumber}.`
            }
        };
        
        const c = content[language] || content.pt;
        
        html += `
            <div class="contract-section">
                <p><strong>CO-SIGNATÁRIO:</strong> ${data.borrowerName}</p>
                <p><strong>CONTRATADA:</strong> FLEXCREDI LLC</p>
            </div>
            
            <div class="contract-section">
                <h2 style="color: #2ECC71;">${c.responsibilities}</h2>
                <ul>
                    ${c.respList.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="contract-section">
                <h2 style="color: #2ECC71;">${c.terms}</h2>
                ${c.termsList.map((item, i) => `<p>${i + 1}. ${item}</p>`).join('')}
            </div>
            
            <p><em>${c.linkedTo}</em></p>
            
            <div class="english-version-notice">
                <button class="btn btn-primary view-english-btn" onclick="showCoSignerContractInEnglish('${coSignerData.id}')">
                    <i class="fas fa-file-contract"></i> View Official Contract (English)
                </button>
            </div>
        `;
    }
    
    html += '</div>';
    
    return html;
}

// CSS for contract styling
const contractStyles = `
<style>
.contract-document {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    background: white;
}

.contract-preview-notice {
    background: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-family: Arial, sans-serif;
    font-size: 13px;
    text-align: center;
}

.contract-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #2C3E50;
}

.contract-header .contract-logo img {
    max-height: 50px;
    margin-bottom: 15px;
}

.contract-header h1 {
    font-size: 24px;
    font-weight: bold;
    color: #2C3E50;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.contract-number {
    font-size: 12px;
    color: #666;
}

.contract-section {
    margin-bottom: 25px;
}

.contract-section h2 {
    font-size: 16px;
    font-weight: bold;
    color: #2C3E50;
    margin: 20px 0 10px 0;
    text-transform: uppercase;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.contract-section p {
    margin: 10px 0;
    text-align: justify;
}

.contract-section ul {
    margin: 10px 0;
    padding-left: 30px;
}

.contract-section li {
    margin: 5px 0;
}

.signatures-section {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
}

.signature-block {
    margin: 30px 0;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 4px;
}

.signature-block p {
    margin: 5px 0;
}

.ach-consent {
    margin-top: 30px;
    padding: 15px;
    background: #e8f5e9;
    border: 1px solid #c8e6c9;
    border-radius: 4px;
}

.english-version-notice {
    margin-top: 30px;
    padding: 20px;
    background: #e3f2fd;
    border: 1px solid #90caf9;
    border-radius: 8px;
    text-align: center;
}

.english-version-notice p {
    margin-bottom: 15px;
    color: #1565c0;
}

.view-english-btn {
    background: #2ECC71 !important;
    border: none !important;
}

.view-english-btn:hover {
    background: #27AE60 !important;
}

/* Print styles */
@media print {
    .contract-preview-notice,
    .english-version-notice {
        display: none;
    }
    
    .contract-document {
        padding: 0;
    }
}
</style>
`;

// Export functions for use in dashboard
if (typeof window !== 'undefined') {
    window.ContractTemplate = ContractTemplate;
    window.generateContractHTML = generateContractHTML;
    window.generateCoSignerContractHTML = generateCoSignerContractHTML;
    window.generateContractData = generateContractData;
    window.contractStyles = contractStyles;
}

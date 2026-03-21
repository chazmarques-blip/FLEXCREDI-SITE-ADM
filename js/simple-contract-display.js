/**
 * FLEXCREDI - Sistema de Contrato Compacto com Dados Dinâmicos
 * Versão otimizada com melhor diagramação
 */

(function() {
    'use strict';
    
    console.log('Loading FlexCredi compact contract system...');

    function getUserData() {
        try {
            return JSON.parse(localStorage.getItem('flexcredi_user')) || {};
        } catch (e) {
            return {};
        }
    }

    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    };

    function numberToWords(num) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
        if (num === 0) return 'Zero';
        if (num < 20) return ones[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
        if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
        if (num < 1000000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
        return numberToWords(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 ? ' ' + numberToWords(num % 1000000) : '');
    }

    function generateContractData(userData) {
        const now = new Date();
        const firstPaymentDate = new Date(now.getFullYear(), now.getMonth() + 1, 15);
        
        const loanAmount = parseFloat(userData.requestedAmount || userData.loanAmount || 10000);
        const interestRate = parseFloat(userData.interestRate || 18.5);
        const loanTerm = parseInt(userData.term || userData.loanTerm || 24);
        const monthlyPayment = parseFloat(userData.monthlyPayment || 508);
        const totalRepayment = (monthlyPayment * loanTerm).toFixed(2);
        
        return {
            day: now.getDate(),
            month: monthNames.en[now.getMonth()],
            monthPt: monthNames.pt[now.getMonth()],
            monthEs: monthNames.es[now.getMonth()],
            year: now.getFullYear(),
            borrowerName: userData.fullName || 'N/A',
            borrowerAddress: userData.address || 'N/A',
            borrowerCityStateZip: `${userData.city || ''}, ${userData.state || ''} ${userData.zipCode || ''}`.trim(),
            borrowerSSN: userData.ssn || '***-**-****',
            borrowerPhone: userData.phone || 'N/A',
            borrowerEmail: userData.email || 'N/A',
            loanAmount: loanAmount.toLocaleString('en-US'),
            loanAmountWords: numberToWords(Math.round(loanAmount)) + ' Dollars',
            interestRate: interestRate,
            loanTerm: loanTerm,
            monthlyPayment: monthlyPayment.toLocaleString('en-US'),
            totalRepayment: parseFloat(totalRepayment).toLocaleString('en-US'),
            firstPaymentMonth: monthNames.en[firstPaymentDate.getMonth()],
            firstPaymentYear: firstPaymentDate.getFullYear(),
            contractNumber: userData.contractNumber || `FL${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
        };
    }

    // Compact English contract (official)
    function generateEnglishContract(data) {
        return `
        <div class="contract-doc" style="font-family: 'Times New Roman', serif; line-height: 1.35; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 12px;">
            
            <!-- HEADER -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #2ECC71;">
                <div>
                    <span style="font-size: 24px; color: #2ECC71; font-weight: bold; font-family: Arial;">FleXcredi</span>
                    <span style="font-size: 10px; color: #1E8449; margin-left: 8px; letter-spacing: 1px;">EASY • SIMPLE • FAST</span>
                </div>
                <div style="text-align: right; font-size: 10px; line-height: 1.3; color: #666;">
                    <strong>FLEXCREDI LLC</strong> | 5200 Old Winter Garden Rd, Orlando, FL 32811<br>
                    Phone: (407) 555-0123 | info@flexcredi.com
                </div>
            </div>

            <!-- TITLE -->
            <h1 style="text-align: center; font-size: 16px; color: #1E8449; margin: 12px 0 5px; text-transform: uppercase; letter-spacing: 1px;">
                PERSONAL LOAN AGREEMENT
            </h1>
            <p style="text-align: center; font-size: 11px; color: #666; margin: 0 0 12px;">Agreement #${data.contractNumber} | Effective Date: ${data.month} ${data.day}, ${data.year}</p>

            <!-- PARTIES - Compact -->
            <div style="background: #f8f9fa; padding: 10px 12px; border-radius: 5px; margin-bottom: 12px; border-left: 3px solid #2ECC71;">
                <p style="margin: 0 0 5px; font-size: 11px;"><strong>LENDER:</strong> Flexcredi LLC, 5200 Old Winter Garden Road, Orlando, FL 32811</p>
                <p style="margin: 0; font-size: 11px;"><strong>BORROWER:</strong> ${data.borrowerName}, ${data.borrowerAddress}, ${data.borrowerCityStateZip} | SSN: ${data.borrowerSSN} | Phone: ${data.borrowerPhone} | Email: ${data.borrowerEmail}</p>
            </div>

            <!-- LOAN TERMS BOX -->
            <div style="background: #e8f5e9; padding: 10px; border-radius: 5px; margin-bottom: 12px;">
                <p style="margin: 0 0 6px; font-size: 11px; font-weight: bold; color: #1E8449; text-transform: uppercase;">Loan Terms</p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 11px;">
                    <div><span style="color: #666;">Principal:</span> <strong>$${data.loanAmount}</strong></div>
                    <div><span style="color: #666;">Rate:</span> <strong>${data.interestRate}% APR</strong></div>
                    <div><span style="color: #666;">Term:</span> <strong>${data.loanTerm} months</strong></div>
                    <div><span style="color: #666;">Payment:</span> <strong>$${data.monthlyPayment}/mo</strong></div>
                </div>
            </div>

            <!-- SECTIONS - Compact -->
            <div style="columns: 2; column-gap: 20px; font-size: 11px;">
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">1. LOAN AMOUNT</p>
                    <p style="margin: 0; text-align: justify;">Lender agrees to lend ${data.loanAmountWords} (US$ ${data.loanAmount}). Interest at ${data.interestRate}% per annum. Total repayment: US$ ${data.totalRepayment}.</p>
                </div>
                
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">2. REPAYMENT</p>
                    <p style="margin: 0; text-align: justify;">${data.loanTerm} monthly installments of US$ ${data.monthlyPayment}, due on the 15th of each month starting ${data.firstPaymentMonth} ${data.firstPaymentYear}. Payment via ACH Debit.</p>
                </div>
                
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">3. LATE PAYMENTS</p>
                    <p style="margin: 0; text-align: justify;">Late fee of 5% (max $25) if payment not received within 10 days. Default interest: 24% per annum on overdue amounts.</p>
                </div>
                
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">4. PREPAYMENT</p>
                    <p style="margin: 0;">Borrower may prepay in whole or part without penalty.</p>
                </div>
                
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">5. REPRESENTATIONS</p>
                    <p style="margin: 0; text-align: justify;">Borrower has legal capacity to enter this Agreement. All information provided is true and accurate. Borrower is not in default on any other loan.</p>
                </div>
                
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">6. DEFAULT</p>
                    <p style="margin: 0; text-align: justify;">Events of default: failure to pay, breach of terms, false information, insolvency. Lender may declare entire amount due immediately.</p>
                </div>
                
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">7. ACH AUTHORIZATION</p>
                    <p style="margin: 0; text-align: justify;">Borrower authorizes ACH debits from designated bank account. Returned payments incur $25 fee.</p>
                </div>
                
                <div style="break-inside: avoid; margin-bottom: 10px;">
                    <p style="margin: 0 0 3px; font-weight: bold; color: #1E8449; font-size: 11px;">8. GOVERNING LAW</p>
                    <p style="margin: 0;">This Agreement is governed by Florida law.</p>
                </div>
            </div>

            <!-- SIGNATURES - Compact -->
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd;">
                <p style="margin: 0 0 10px; font-size: 10px; text-align: center; color: #666;">IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px;">
                    <div style="padding: 10px; background: #f9f9f9; border-radius: 4px;">
                        <p style="margin: 0 0 3px;"><strong>LENDER:</strong> FLEXCREDI LLC</p>
                        <p style="margin: 15px 0 3px; border-bottom: 1px solid #333; padding-bottom: 15px;"></p>
                        <p style="margin: 0; font-size: 10px;">Arthur Reis Marques, Principal Executive Officer</p>
                    </div>
                    <div style="padding: 10px; background: #f9f9f9; border-radius: 4px;">
                        <p style="margin: 0 0 3px;"><strong>BORROWER:</strong> ${data.borrowerName}</p>
                        <p style="margin: 15px 0 3px; border-bottom: 1px solid #333; padding-bottom: 15px;"></p>
                        <p style="margin: 0; font-size: 10px;">Signature | SSN: ${data.borrowerSSN}</p>
                    </div>
                </div>
            </div>

            <!-- ACH CONSENT - Compact -->
            <div style="margin-top: 10px; padding: 8px 10px; background: #e8f5e9; border-radius: 4px; font-size: 10px;">
                <p style="margin: 0;"><strong>ACH CONSENT:</strong> By signing, I agree to ACH Payment Authorization (Section 7). Initials: ____________</p>
            </div>
        </div>
        `;
    }

    // Compact Portuguese preview
    function generatePortuguesePreview(data) {
        return `
        <div class="contract-doc" style="font-family: 'Times New Roman', serif; line-height: 1.35; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 12px;">
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 8px 12px; border-radius: 5px; margin-bottom: 12px; text-align: center; font-size: 11px;">
                <strong>⚠️ VERSÃO PARA VISUALIZAÇÃO</strong> - O contrato oficial está em inglês conforme exigido pela legislação americana.
            </div>
            
            <!-- HEADER -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #2ECC71;">
                <div>
                    <span style="font-size: 22px; color: #2ECC71; font-weight: bold;">FleXcredi</span>
                    <span style="font-size: 9px; color: #1E8449; margin-left: 6px;">FÁCIL • SIMPLES • RÁPIDO</span>
                </div>
                <div style="font-size: 10px; color: #666;">Contrato #${data.contractNumber}</div>
            </div>

            <h1 style="text-align: center; font-size: 15px; color: #1E8449; margin: 10px 0 8px;">CONTRATO DE EMPRÉSTIMO PESSOAL</h1>
            <p style="text-align: center; font-size: 10px; color: #666; margin: 0 0 12px;">Data: ${data.day} de ${data.monthPt} de ${data.year}</p>

            <!-- PARTIES -->
            <div style="background: #f8f9fa; padding: 8px 10px; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #2ECC71; font-size: 11px;">
                <p style="margin: 0 0 4px;"><strong>CREDOR:</strong> Flexcredi LLC, Orlando, FL</p>
                <p style="margin: 0;"><strong>MUTUÁRIO:</strong> ${data.borrowerName} | ${data.borrowerAddress}, ${data.borrowerCityStateZip}</p>
            </div>

            <!-- LOAN TERMS -->
            <div style="background: #e8f5e9; padding: 8px 10px; border-radius: 4px; margin-bottom: 10px;">
                <p style="margin: 0 0 5px; font-size: 10px; font-weight: bold; color: #1E8449;">TERMOS DO EMPRÉSTIMO</p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 11px;">
                    <div><span style="color: #666;">Valor:</span> <strong>$${data.loanAmount}</strong></div>
                    <div><span style="color: #666;">Juros:</span> <strong>${data.interestRate}%</strong></div>
                    <div><span style="color: #666;">Prazo:</span> <strong>${data.loanTerm} meses</strong></div>
                    <div><span style="color: #666;">Parcela:</span> <strong>$${data.monthlyPayment}</strong></div>
                </div>
            </div>

            <!-- KEY TERMS -->
            <div style="font-size: 11px; margin-bottom: 10px;">
                <p style="margin: 0 0 5px;"><strong style="color: #1E8449;">PAGAMENTO:</strong> Parcelas vencem no dia 15 de cada mês via débito automático (ACH).</p>
                <p style="margin: 0 0 5px;"><strong style="color: #1E8449;">ATRASO:</strong> Multa de 5% (máx. $25) para pagamentos com mais de 10 dias de atraso.</p>
                <p style="margin: 0;"><strong style="color: #1E8449;">LEI APLICÁVEL:</strong> Estado da Flórida, EUA.</p>
            </div>

            <!-- VIEW ENGLISH -->
            <div style="text-align: center; padding: 12px; background: #e3f2fd; border-radius: 5px;">
                <p style="margin: 0 0 8px; font-size: 11px; color: #1565c0;"><strong>IMPORTANTE:</strong> O contrato oficial e vinculante é em inglês.</p>
                <button onclick="switchLanguage('en')" style="background: #2ECC71; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                    Ver Contrato Oficial (English)
                </button>
            </div>
        </div>
        `;
    }

    // Compact Spanish preview
    function generateSpanishPreview(data) {
        return `
        <div class="contract-doc" style="font-family: 'Times New Roman', serif; line-height: 1.35; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 12px;">
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 8px 12px; border-radius: 5px; margin-bottom: 12px; text-align: center; font-size: 11px;">
                <strong>⚠️ VERSIÓN PARA VISUALIZACIÓN</strong> - El contrato oficial está en inglés según lo requiere la ley estadounidense.
            </div>
            
            <!-- HEADER -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #2ECC71;">
                <div>
                    <span style="font-size: 22px; color: #2ECC71; font-weight: bold;">FleXcredi</span>
                    <span style="font-size: 9px; color: #1E8449; margin-left: 6px;">FÁCIL • SIMPLE • RÁPIDO</span>
                </div>
                <div style="font-size: 10px; color: #666;">Contrato #${data.contractNumber}</div>
            </div>

            <h1 style="text-align: center; font-size: 15px; color: #1E8449; margin: 10px 0 8px;">CONTRATO DE PRÉSTAMO PERSONAL</h1>
            <p style="text-align: center; font-size: 10px; color: #666; margin: 0 0 12px;">Fecha: ${data.day} de ${data.monthEs} de ${data.year}</p>

            <!-- PARTIES -->
            <div style="background: #f8f9fa; padding: 8px 10px; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #2ECC71; font-size: 11px;">
                <p style="margin: 0 0 4px;"><strong>PRESTAMISTA:</strong> Flexcredi LLC, Orlando, FL</p>
                <p style="margin: 0;"><strong>PRESTATARIO:</strong> ${data.borrowerName} | ${data.borrowerAddress}, ${data.borrowerCityStateZip}</p>
            </div>

            <!-- LOAN TERMS -->
            <div style="background: #e8f5e9; padding: 8px 10px; border-radius: 4px; margin-bottom: 10px;">
                <p style="margin: 0 0 5px; font-size: 10px; font-weight: bold; color: #1E8449;">TÉRMINOS DEL PRÉSTAMO</p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 11px;">
                    <div><span style="color: #666;">Monto:</span> <strong>$${data.loanAmount}</strong></div>
                    <div><span style="color: #666;">Interés:</span> <strong>${data.interestRate}%</strong></div>
                    <div><span style="color: #666;">Plazo:</span> <strong>${data.loanTerm} meses</strong></div>
                    <div><span style="color: #666;">Cuota:</span> <strong>$${data.monthlyPayment}</strong></div>
                </div>
            </div>

            <!-- KEY TERMS -->
            <div style="font-size: 11px; margin-bottom: 10px;">
                <p style="margin: 0 0 5px;"><strong style="color: #1E8449;">PAGO:</strong> Cuotas vencen el día 15 de cada mes mediante débito automático (ACH).</p>
                <p style="margin: 0 0 5px;"><strong style="color: #1E8449;">MORA:</strong> Cargo de 5% (máx. $25) para pagos con más de 10 días de retraso.</p>
                <p style="margin: 0;"><strong style="color: #1E8449;">LEY APLICABLE:</strong> Estado de Florida, EE.UU.</p>
            </div>

            <!-- VIEW ENGLISH -->
            <div style="text-align: center; padding: 12px; background: #e3f2fd; border-radius: 5px;">
                <p style="margin: 0 0 8px; font-size: 11px; color: #1565c0;"><strong>IMPORTANTE:</strong> El contrato oficial y vinculante es en inglés.</p>
                <button onclick="switchLanguage('en')" style="background: #2ECC71; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                    Ver Contrato Oficial (English)
                </button>
            </div>
        </div>
        `;
    }

    // Switch language
    window.switchLanguage = function(lang) {
        const userData = getUserData();
        const contractData = generateContractData(userData);
        const contractContent = document.getElementById('contractContentArea');
        
        if (contractContent) {
            document.querySelectorAll('.contract-lang-tab').forEach(tab => {
                tab.classList.remove('active');
                tab.style.background = 'transparent';
                tab.style.borderBottom = '3px solid transparent';
                tab.style.color = '#666';
                if (tab.dataset.lang === lang) {
                    tab.classList.add('active');
                    tab.style.background = 'white';
                    tab.style.borderBottom = '3px solid #2ECC71';
                    tab.style.color = '#2ECC71';
                }
            });
            
            let html;
            if (lang === 'pt') {
                html = generatePortuguesePreview(contractData);
            } else if (lang === 'es') {
                html = generateSpanishPreview(contractData);
            } else {
                html = generateEnglishContract(contractData);
            }
            
            contractContent.innerHTML = html;
        }
    };

    // Show contract modal - Always starts in English
    window.showDynamicContractModal = function() {
        const userData = getUserData();
        const contractData = generateContractData(userData);
        
        // Always start with English (official)
        const contractHtml = generateEnglishContract(contractData);
        
        const modalHTML = `
            <div class="modal-overlay" id="dynamic-contract-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 99999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 10px; width: 95%; max-width: 850px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="padding: 12px 18px; background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%); color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 15px; font-weight: 600;"><i class="fas fa-file-contract"></i> Personal Loan Agreement - ${userData.fullName || 'Contract'}</h3>
                        <button onclick="document.getElementById('dynamic-contract-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px; line-height: 1;">&times;</button>
                    </div>
                    
                    <div style="display: flex; background: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                        <button class="contract-lang-tab active" data-lang="en" onclick="switchLanguage('en')" style="flex: 1; padding: 10px; background: white; border: none; border-bottom: 3px solid #2ECC71; cursor: pointer; font-weight: 600; color: #2ECC71; font-size: 12px;">
                            <i class="fas fa-check-circle"></i> English (Official)
                        </button>
                        <button class="contract-lang-tab" data-lang="pt" onclick="switchLanguage('pt')" style="flex: 1; padding: 10px; background: transparent; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: 500; color: #666; font-size: 12px;">
                            <i class="fas fa-eye"></i> Português
                        </button>
                        <button class="contract-lang-tab" data-lang="es" onclick="switchLanguage('es')" style="flex: 1; padding: 10px; background: transparent; border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: 500; color: #666; font-size: 12px;">
                            <i class="fas fa-eye"></i> Español
                        </button>
                    </div>
                    
                    <div id="contractContentArea" style="flex: 1; overflow-y: auto; background: white;">
                        ${contractHtml}
                    </div>
                    
                    <div style="padding: 12px 18px; border-top: 1px solid #e9ecef; display: flex; gap: 8px; justify-content: flex-end; background: #fafafa;">
                        <button onclick="window.print()" style="padding: 8px 16px; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button onclick="document.getElementById('dynamic-contract-modal').remove()" style="padding: 8px 16px; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Close
                        </button>
                        <button onclick="document.getElementById('dynamic-contract-modal').remove(); if(typeof initiateElectronicSignature === 'function') initiateElectronicSignature();" style="padding: 8px 16px; background: #2ECC71; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            <i class="fas fa-signature"></i> Sign Contract
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    // Attach event handlers
    function attachEventHandlers() {
        const reviewBtn = document.getElementById('reviewContractBtn');
        if (reviewBtn) {
            reviewBtn.onclick = function(e) {
                e.preventDefault();
                window.showDynamicContractModal();
            };
            console.log('Contract review button attached');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachEventHandlers);
    } else {
        setTimeout(attachEventHandlers, 500);
    }

    console.log('FlexCredi compact contract system loaded');
})();

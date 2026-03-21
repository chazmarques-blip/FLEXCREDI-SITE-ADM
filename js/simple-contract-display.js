/**
 * FLEXCREDI - Sistema de Exibição de Contrato com Dados Dinâmicos
 * Usa o template de contrato com dados do usuário logado
 */

(function() {
    'use strict';
    
    console.log('Loading FlexCredi dynamic contract system...');

    // Get user data from localStorage
    function getUserData() {
        try {
            return JSON.parse(localStorage.getItem('flexcredi_user')) || {};
        } catch (e) {
            return {};
        }
    }

    // Get current language
    function getCurrentLanguage() {
        return localStorage.getItem('flexcredi_language') || 'en';
    }

    // Month names in different languages
    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    };

    // Number to words (for loan amount)
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

    // Generate contract data from user
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

    // Generate English contract (official)
    function generateEnglishContract(data) {
        return `
        <div class="contract-document" style="font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 30px;">
            
            <!-- HEADER -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 3px solid #2ECC71;">
                <div>
                    <h1 style="font-size: 32px; color: #2ECC71; margin: 0; font-family: Arial, sans-serif;">FleXcredi</h1>
                    <div style="font-size: 14px; color: #1E8449; font-weight: bold; letter-spacing: 2px;">EASY, SIMPLE, FAST</div>
                </div>
                <div style="text-align: right; font-size: 12px; line-height: 1.5;">
                    <strong>FLEXCREDI LLC</strong><br>
                    5200 Old Winter Garden Road<br>
                    Orlando, FL 32811<br>
                    Phone: (407) 555-0123<br>
                    Email: info@flexcredi.com
                </div>
            </div>

            <!-- TITLE -->
            <h1 style="text-align: center; font-size: 26px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; letter-spacing: 1px;">
                PERSONAL LOAN AGREEMENT
            </h1>
            <div style="text-align: center; font-size: 16px; color: #666; margin-bottom: 30px; font-style: italic;">
                Agreement #${data.contractNumber}
            </div>

            <!-- INTRO -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 5px solid #2ECC71; margin: 25px 0; text-align: justify;">
                <p style="margin: 0; font-size: 14px;">
                    This Personal Loan Agreement (the "Agreement") is entered into on this 
                    <strong>${data.day}</strong> day of <strong>${data.month}</strong>, <strong>${data.year}</strong> (the "Effective Date"), 
                    by and between the Parties identified below:
                </p>
            </div>

            <!-- PARTIES -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                PARTIES
            </h2>
            
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; color: #333; margin: 15px 0 10px;">LENDER:</h3>
                <div style="padding-left: 20px; font-size: 14px;">
                    <strong>Flexcredi LLC</strong>, a limited liability company, with its principal office at 
                    5200 Old Winter Garden Road, Orlando, FL 32811, licensed as a Consumer Finance Company 
                    in the State of Florida, hereinafter referred to as "<strong>Flexcredi</strong>."
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 15px; color: #333; margin: 15px 0 10px;">BORROWER:</h3>
                <div style="padding-left: 20px; font-size: 14px;">
                    <strong>${data.borrowerName}</strong>, residing at <strong>${data.borrowerAddress}, ${data.borrowerCityStateZip}</strong>, 
                    SSN: <strong>${data.borrowerSSN}</strong>, phone <strong>${data.borrowerPhone}</strong>, 
                    email <strong>${data.borrowerEmail}</strong>, hereinafter referred to as "<strong>Borrower</strong>."
                </div>
            </div>

            <!-- LOAN TERMS -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                1. LOAN AMOUNT AND TERMS
            </h2>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <div style="font-size: 12px; color: #666; text-transform: uppercase;">Principal Amount</div>
                        <div style="font-size: 20px; font-weight: bold; color: #1E8449;">US$ ${data.loanAmount}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #666; text-transform: uppercase;">Interest Rate</div>
                        <div style="font-size: 20px; font-weight: bold; color: #1E8449;">${data.interestRate}% APR</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #666; text-transform: uppercase;">Loan Term</div>
                        <div style="font-size: 20px; font-weight: bold; color: #1E8449;">${data.loanTerm} months</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: #666; text-transform: uppercase;">Monthly Payment</div>
                        <div style="font-size: 20px; font-weight: bold; color: #1E8449;">US$ ${data.monthlyPayment}</div>
                    </div>
                </div>
            </div>
            
            <p style="font-size: 14px; text-align: justify;">
                1.1. <strong>Principal Amount:</strong> Lender agrees to lend to Borrower the principal sum of 
                <strong>${data.loanAmountWords}</strong> (US$ ${data.loanAmount}) (the "Principal Amount").
            </p>
            <p style="font-size: 14px; text-align: justify;">
                1.2. <strong>Interest Rate:</strong> The Principal Amount shall bear interest at a fixed rate of 
                <strong>${data.interestRate}%</strong> per annum.
            </p>
            <p style="font-size: 14px; text-align: justify;">
                1.3. <strong>Loan Term:</strong> The loan term shall be for a period of <strong>${data.loanTerm}</strong> months.
            </p>
            <p style="font-size: 14px; text-align: justify;">
                1.4. <strong>Total Repayment:</strong> The total amount to be repaid, including principal and interest, 
                shall be US$ <strong>${data.totalRepayment}</strong>.
            </p>

            <!-- REPAYMENT -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                2. REPAYMENT SCHEDULE
            </h2>
            <p style="font-size: 14px; text-align: justify;">
                2.1. <strong>Installments:</strong> Borrower shall repay the Total Repayment Amount in <strong>${data.loanTerm}</strong> 
                equal monthly installments of US$ <strong>${data.monthlyPayment}</strong> each.
            </p>
            <p style="font-size: 14px; text-align: justify;">
                2.2. <strong>Due Date:</strong> Each installment shall be due on the <strong>15th</strong> day of each month, 
                starting from <strong>${data.firstPaymentMonth} ${data.firstPaymentYear}</strong>.
            </p>
            <p style="font-size: 14px; text-align: justify;">
                2.3. <strong>Payment Method:</strong> All payments shall be made via ACH Debit from the Borrower's designated bank account.
            </p>

            <!-- LATE PAYMENTS -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                3. LATE PAYMENTS
            </h2>
            <p style="font-size: 14px; text-align: justify;">
                3.1. <strong>Late Fee:</strong> If any installment is not received within <strong>10</strong> days after 
                its due date, Borrower shall pay a late fee of <strong>5%</strong> of the overdue amount, not to exceed US$25.00.
            </p>
            <p style="font-size: 14px; text-align: justify;">
                3.2. <strong>Default Interest:</strong> Any overdue amount shall accrue interest at a default rate of 
                <strong>24%</strong> per annum until paid.
            </p>

            <!-- PREPAYMENT -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                4. PREPAYMENT
            </h2>
            <p style="font-size: 14px; text-align: justify;">
                4.1. Borrower may prepay the loan in whole or in part at any time <strong>without</strong> incurring any prepayment penalty.
            </p>

            <!-- REPRESENTATIONS -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                5. REPRESENTATIONS AND WARRANTIES
            </h2>
            <p style="font-size: 14px; text-align: justify;">Borrower represents and warrants that:</p>
            <ul style="font-size: 14px; margin-left: 20px;">
                <li>Borrower has the legal capacity to enter into this Agreement.</li>
                <li>All information provided is true, accurate, and complete.</li>
                <li>Borrower is not currently in default under any other loan agreement.</li>
            </ul>

            <!-- DEFAULT -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                6. DEFAULT
            </h2>
            <p style="font-size: 14px; text-align: justify;">The following shall constitute an Event of Default:</p>
            <ul style="font-size: 14px; margin-left: 20px;">
                <li>Failure to make any payment when due.</li>
                <li>Breach of any term of this Agreement.</li>
                <li>Any representation proving false or misleading.</li>
                <li>Insolvency or bankruptcy of Borrower.</li>
            </ul>

            <!-- ACH AUTHORIZATION -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                7. ACH PAYMENT AUTHORIZATION
            </h2>
            <p style="font-size: 14px; text-align: justify;">
                By signing this Agreement, Borrower authorizes Flexcredi LLC to initiate ACH debit entries from Borrower's 
                designated bank account for all scheduled payments. Any returned or rejected payment will incur a $25 fee.
            </p>

            <!-- GOVERNING LAW -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                8. GOVERNING LAW
            </h2>
            <p style="font-size: 14px; text-align: justify;">
                This Agreement shall be governed by the laws of the State of Florida.
            </p>

            <!-- SIGNATURES -->
            <h2 style="font-size: 18px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
                SIGNATURES
            </h2>
            <p style="font-size: 14px; text-align: justify;">
                IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-top: 40px;">
                <div style="padding: 20px; background: #f9f9f9; border-radius: 8px;">
                    <p style="margin: 0 0 10px; font-weight: bold;">LENDER:</p>
                    <p style="margin: 5px 0;">FLEXCREDI LLC</p>
                    <p style="margin: 15px 0 5px; border-bottom: 1px solid #333; padding-bottom: 30px;"></p>
                    <p style="margin: 5px 0; font-size: 12px;">Arthur Reis Marques</p>
                    <p style="margin: 0; font-size: 12px;">Principal Executive Officer</p>
                </div>
                <div style="padding: 20px; background: #f9f9f9; border-radius: 8px;">
                    <p style="margin: 0 0 10px; font-weight: bold;">BORROWER:</p>
                    <p style="margin: 5px 0;">${data.borrowerName}</p>
                    <p style="margin: 15px 0 5px; border-bottom: 1px solid #333; padding-bottom: 30px;"></p>
                    <p style="margin: 5px 0; font-size: 12px;">Signature</p>
                    <p style="margin: 0; font-size: 12px;">SSN: ${data.borrowerSSN}</p>
                </div>
            </div>

            <!-- ACH CONSENT -->
            <div style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 8px; border: 1px solid #c8e6c9;">
                <p style="margin: 0 0 15px; font-weight: bold; color: #1E8449;">ACH AUTHORIZATION CONSENT</p>
                <p style="margin: 0 0 15px; font-size: 13px;">
                    By signing below, I acknowledge and agree to the ACH Payment Authorization terms set forth in Section 7.
                </p>
                <p style="margin: 0; border-bottom: 1px solid #333; padding-bottom: 20px; max-width: 300px;">
                    Borrower Initials: ____________
                </p>
            </div>
        </div>
        `;
    }

    // Generate Portuguese preview
    function generatePortuguesePreview(data) {
        return `
        <div class="contract-document" style="font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 30px;">
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                <strong>⚠️ VERSÃO PARA VISUALIZAÇÃO</strong><br>
                <span style="font-size: 13px;">O contrato oficial está em inglês conforme exigido pela legislação americana.</span>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="font-size: 28px; color: #2ECC71; margin: 0;">FleXcredi</h1>
                <div style="font-size: 13px; color: #1E8449; letter-spacing: 2px;">FÁCIL, SIMPLES, RÁPIDO</div>
            </div>

            <h1 style="text-align: center; font-size: 22px; color: #1E8449; margin: 20px 0;">
                CONTRATO DE EMPRÉSTIMO PESSOAL
            </h1>
            <div style="text-align: center; font-size: 14px; color: #666; margin-bottom: 25px;">
                Contrato #${data.contractNumber}
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #2ECC71; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;">
                    Este Contrato de Empréstimo Pessoal é celebrado neste dia 
                    <strong>${data.day}</strong> de <strong>${data.monthPt}</strong> de <strong>${data.year}</strong>.
                </p>
            </div>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                PARTES
            </h2>
            <p style="font-size: 14px;"><strong>CREDOR:</strong> Flexcredi LLC</p>
            <p style="font-size: 14px;"><strong>MUTUÁRIO:</strong> ${data.borrowerName}</p>
            <p style="font-size: 14px;"><strong>Endereço:</strong> ${data.borrowerAddress}, ${data.borrowerCityStateZip}</p>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                TERMOS DO EMPRÉSTIMO
            </h2>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 14px;">
                    <div><strong>Valor Principal:</strong> US$ ${data.loanAmount}</div>
                    <div><strong>Taxa de Juros:</strong> ${data.interestRate}% ao ano</div>
                    <div><strong>Prazo:</strong> ${data.loanTerm} meses</div>
                    <div><strong>Parcela Mensal:</strong> US$ ${data.monthlyPayment}</div>
                </div>
            </div>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                PAGAMENTO
            </h2>
            <p style="font-size: 14px;">As parcelas vencem no dia <strong>15</strong> de cada mês via débito automático (ACH).</p>
            <p style="font-size: 14px;"><strong>Multa por atraso:</strong> 5% do valor em atraso (máximo US$ 25).</p>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                LEI APLICÁVEL
            </h2>
            <p style="font-size: 14px;">Este contrato é regido pelas leis do Estado da Flórida, EUA.</p>

            <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 15px; color: #1565c0;"><strong>IMPORTANTE:</strong> Esta é uma tradução para visualização. O contrato oficial é em inglês.</p>
                <button onclick="switchLanguage('en')" style="background: #2ECC71; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                    <i class="fas fa-file-contract"></i> Ver Contrato Oficial (Inglês)
                </button>
            </div>
        </div>
        `;
    }

    // Generate Spanish preview
    function generateSpanishPreview(data) {
        return `
        <div class="contract-document" style="font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 30px;">
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                <strong>⚠️ VERSIÓN PARA VISUALIZACIÓN</strong><br>
                <span style="font-size: 13px;">El contrato oficial está en inglés según lo requiere la ley estadounidense.</span>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="font-size: 28px; color: #2ECC71; margin: 0;">FleXcredi</h1>
                <div style="font-size: 13px; color: #1E8449; letter-spacing: 2px;">FÁCIL, SIMPLE, RÁPIDO</div>
            </div>

            <h1 style="text-align: center; font-size: 22px; color: #1E8449; margin: 20px 0;">
                CONTRATO DE PRÉSTAMO PERSONAL
            </h1>
            <div style="text-align: center; font-size: 14px; color: #666; margin-bottom: 25px;">
                Contrato #${data.contractNumber}
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #2ECC71; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;">
                    Este Contrato de Préstamo Personal se celebra el día 
                    <strong>${data.day}</strong> de <strong>${data.monthEs}</strong> de <strong>${data.year}</strong>.
                </p>
            </div>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                PARTES
            </h2>
            <p style="font-size: 14px;"><strong>PRESTAMISTA:</strong> Flexcredi LLC</p>
            <p style="font-size: 14px;"><strong>PRESTATARIO:</strong> ${data.borrowerName}</p>
            <p style="font-size: 14px;"><strong>Domicilio:</strong> ${data.borrowerAddress}, ${data.borrowerCityStateZip}</p>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                TÉRMINOS DEL PRÉSTAMO
            </h2>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 14px;">
                    <div><strong>Monto Principal:</strong> US$ ${data.loanAmount}</div>
                    <div><strong>Tasa de Interés:</strong> ${data.interestRate}% anual</div>
                    <div><strong>Plazo:</strong> ${data.loanTerm} meses</div>
                    <div><strong>Cuota Mensual:</strong> US$ ${data.monthlyPayment}</div>
                </div>
            </div>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                PAGO
            </h2>
            <p style="font-size: 14px;">Las cuotas vencen el día <strong>15</strong> de cada mes mediante débito automático (ACH).</p>
            <p style="font-size: 14px;"><strong>Cargo por mora:</strong> 5% del monto atrasado (máximo US$ 25).</p>

            <h2 style="font-size: 16px; color: #1E8449; margin: 25px 0 15px; border-bottom: 2px solid #2ECC71; padding-bottom: 5px;">
                LEY APLICABLE
            </h2>
            <p style="font-size: 14px;">Este contrato se rige por las leyes del Estado de Florida, EE.UU.</p>

            <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 15px; color: #1565c0;"><strong>IMPORTANTE:</strong> Esta es una traducción para visualización. El contrato oficial es en inglés.</p>
                <button onclick="switchLanguage('en')" style="background: #2ECC71; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                    <i class="fas fa-file-contract"></i> Ver Contrato Oficial (Inglés)
                </button>
            </div>
        </div>
        `;
    }

    // Switch language function
    window.switchLanguage = function(lang) {
        const userData = getUserData();
        const contractData = generateContractData(userData);
        const contractContent = document.getElementById('contractContentArea');
        
        if (contractContent) {
            // Update tabs
            document.querySelectorAll('.contract-lang-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.lang === lang) tab.classList.add('active');
            });
            
            // Generate contract based on language
            let html;
            if (lang === 'en') {
                html = generateEnglishContract(contractData);
            } else if (lang === 'pt') {
                html = generatePortuguesePreview(contractData);
            } else if (lang === 'es') {
                html = generateSpanishPreview(contractData);
            }
            
            contractContent.innerHTML = html;
        }
    };

    // Show contract modal
    window.showDynamicContractModal = function() {
        const userData = getUserData();
        const contractData = generateContractData(userData);
        const currentLang = getCurrentLanguage();
        
        // Generate initial contract
        let contractHtml;
        if (currentLang === 'pt') {
            contractHtml = generatePortuguesePreview(contractData);
        } else if (currentLang === 'es') {
            contractHtml = generateSpanishPreview(contractData);
        } else {
            contractHtml = generateEnglishContract(contractData);
        }
        
        const modalHTML = `
            <div class="modal-overlay" id="dynamic-contract-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; width: 95%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
                    <div style="padding: 15px 20px; background: #2ECC71; color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 18px;"><i class="fas fa-file-contract"></i> Personal Loan Agreement - ${userData.fullName || 'Contract'}</h3>
                        <button onclick="document.getElementById('dynamic-contract-modal').remove()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; line-height: 1;">&times;</button>
                    </div>
                    
                    <div style="display: flex; background: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                        <button class="contract-lang-tab ${currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="switchLanguage('en')" style="flex: 1; padding: 12px; background: ${currentLang === 'en' ? 'white' : 'transparent'}; border: none; border-bottom: ${currentLang === 'en' ? '3px solid #2ECC71' : '3px solid transparent'}; cursor: pointer; font-weight: 500; color: ${currentLang === 'en' ? '#2ECC71' : '#666'};">
                            <i class="fas fa-check-circle"></i> English (Official)
                        </button>
                        <button class="contract-lang-tab ${currentLang === 'pt' ? 'active' : ''}" data-lang="pt" onclick="switchLanguage('pt')" style="flex: 1; padding: 12px; background: ${currentLang === 'pt' ? 'white' : 'transparent'}; border: none; border-bottom: ${currentLang === 'pt' ? '3px solid #2ECC71' : '3px solid transparent'}; cursor: pointer; font-weight: 500; color: ${currentLang === 'pt' ? '#2ECC71' : '#666'};">
                            <i class="fas fa-eye"></i> Português (Preview)
                        </button>
                        <button class="contract-lang-tab ${currentLang === 'es' ? 'active' : ''}" data-lang="es" onclick="switchLanguage('es')" style="flex: 1; padding: 12px; background: ${currentLang === 'es' ? 'white' : 'transparent'}; border: none; border-bottom: ${currentLang === 'es' ? '3px solid #2ECC71' : '3px solid transparent'}; cursor: pointer; font-weight: 500; color: ${currentLang === 'es' ? '#2ECC71' : '#666'};">
                            <i class="fas fa-eye"></i> Español (Preview)
                        </button>
                    </div>
                    
                    <div id="contractContentArea" style="flex: 1; overflow-y: auto; background: white;">
                        ${contractHtml}
                    </div>
                    
                    <div style="padding: 15px 20px; border-top: 1px solid #e9ecef; display: flex; gap: 10px; justify-content: flex-end;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button onclick="document.getElementById('dynamic-contract-modal').remove()" style="padding: 10px 20px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">
                            Close
                        </button>
                        <button onclick="document.getElementById('dynamic-contract-modal').remove(); if(typeof initiateElectronicSignature === 'function') initiateElectronicSignature();" style="padding: 10px 20px; background: #2ECC71; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-signature"></i> Proceed to Signature
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    // Attach to review button when DOM is ready
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

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachEventHandlers);
    } else {
        setTimeout(attachEventHandlers, 500);
    }

    console.log('FlexCredi dynamic contract system loaded');
})();

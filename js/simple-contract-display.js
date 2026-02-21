/**
 * FLEXCREDI - Sistema Simplificado de Exibição de Contrato
 * Versão ultra-simplificada que garante funcionamento
 */

// Executar assim que possível
(function() {
    'use strict';
    
    console.log('🚀 Carregando sistema simples de contrato...');

    // Dados do contrato
    const contractInfo = {
        contractNumber: 'FL2024001',
        clientName: 'Carlos Eduardo Silva',
        loanAmount: '$25,000',
        interestRate: '18.5%',
        term: '24 meses',
        monthlyPayment: '$1,287',
        effectiveDate: new Date().toLocaleDateString('pt-BR')
    };

    // HTML do contrato completo
    const contractHTML = `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
        
        <!-- CABEÇALHO -->
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

        <!-- TÍTULO DO CONTRATO -->
        <h1 style="text-align: center; font-size: 26px; color: #1E8449; margin: 30px 0 15px; text-transform: uppercase; letter-spacing: 1px;">
            PERSONAL LOAN AGREEMENT
        </h1>
        <div style="text-align: center; font-size: 16px; color: #666; margin-bottom: 30px; font-style: italic;">
            Agreement #${contractInfo.contractNumber}
        </div>

        <!-- INTRODUÇÃO -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 5px solid #2ECC71; margin: 25px 0; text-align: justify;">
            <p style="margin: 0; font-size: 14px;">
                This Personal Loan Agreement (hereinafter, the "Agreement") is entered into on this 
                <strong>${contractInfo.effectiveDate}</strong> (the "Effective Date"), by and between the Parties identified below:
            </p>
        </div>

        <!-- PARTES -->
        <h2 style="font-size: 20px; color: #1E8449; margin: 30px 0 20px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
            PARTIES:
        </h2>

        <div style="margin: 20px 0;">
            <h3 style="font-size: 16px; color: #1E8449; margin: 15px 0 8px;">LENDER:</h3>
            <p style="margin-left: 25px; text-align: justify; font-size: 14px; line-height: 1.6;">
                Flexcredi LLC, a limited liability company, with its principal office located at 
                5200 Old Winter Garden Road, Orlando, FL 32811, duly licensed as a Consumer Finance 
                Company in the State of Florida, hereinafter referred to as "<strong>Flexcredi</strong>."
            </p>
        </div>

        <div style="margin: 20px 0;">
            <h3 style="font-size: 16px; color: #1E8449; margin: 15px 0 8px;">BORROWER:</h3>
            <p style="margin-left: 25px; text-align: justify; font-size: 14px; line-height: 1.6;">
                <strong>${contractInfo.clientName}</strong>, Brasileiro, Solteiro, Analista de Sistemas, 
                holder of Florida Driver's License, number S123-456-789-012, residing at 1234 Sunset Boulevard, 
                Orlando, FL 32801, phone (407) 555-9876, email carlos.silva@email.com, 
                hereinafter referred to as "<strong>Borrower</strong>."
            </p>
        </div>

        <!-- TERMOS DO EMPRÉSTIMO -->
        <h2 style="font-size: 20px; color: #1E8449; margin: 30px 0 20px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
            LOAN TERMS:
        </h2>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; border: 1px solid #e9ecef; margin: 20px 0;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; display: flex; justify-content: space-between;">
                    <strong style="color: #1E8449;">Principal Amount:</strong> <span>${contractInfo.loanAmount}</span>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; display: flex; justify-content: space-between;">
                    <strong style="color: #1E8449;">Interest Rate:</strong> <span>${contractInfo.interestRate} per annum</span>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; display: flex; justify-content: space-between;">
                    <strong style="color: #1E8449;">Loan Term:</strong> <span>${contractInfo.term}</span>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; display: flex; justify-content: space-between;">
                    <strong style="color: #1E8449;">Monthly Payment:</strong> <span>${contractInfo.monthlyPayment}</span>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; display: flex; justify-content: space-between;">
                    <strong style="color: #1E8449;">Total Interest:</strong> <span>$5,888</span>
                </div>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; display: flex; justify-content: space-between;">
                    <strong style="color: #1E8449;">Total Amount:</strong> <span>$30,888</span>
                </div>
            </div>
        </div>

        <!-- TERMOS E CONDIÇÕES -->
        <h2 style="font-size: 20px; color: #1E8449; margin: 30px 0 20px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
            TERMS AND CONDITIONS:
        </h2>

        <h3 style="font-size: 15px; color: #333; margin: 25px 0 10px; font-weight: bold;">1. LOAN PURPOSE AND USE</h3>
        <p style="text-align: justify; margin: 10px 0; font-size: 14px; line-height: 1.6;">
            The Borrower agrees to use the loan funds for legitimate personal, family, or household purposes. 
            The Borrower shall not use the funds for any illegal activities or speculative investments.
        </p>

        <h3 style="font-size: 15px; color: #333; margin: 25px 0 10px; font-weight: bold;">2. PAYMENT TERMS</h3>
        <p style="text-align: justify; margin: 10px 0; font-size: 14px; line-height: 1.6;">
            The Borrower agrees to make monthly payments of ${contractInfo.monthlyPayment} beginning on the 
            first day of the month following the effective date of this Agreement. Payments are due on the 
            same day of each month thereafter until the loan is paid in full.
        </p>

        <h3 style="font-size: 15px; color: #333; margin: 25px 0 10px; font-weight: bold;">3. LATE PAYMENTS</h3>
        <p style="text-align: justify; margin: 10px 0; font-size: 14px; line-height: 1.6;">
            If any payment is more than 10 days late, the Borrower will be charged a late fee of $25.00. 
            Continued late payments may result in acceleration of the entire loan balance.
        </p>

        <h3 style="font-size: 15px; color: #333; margin: 25px 0 10px; font-weight: bold;">4. DEFAULT</h3>
        <p style="text-align: justify; margin: 10px 0; font-size: 14px; line-height: 1.6;">
            The Borrower will be in default if: (a) any payment is more than 30 days late; (b) the Borrower 
            files for bankruptcy; (c) the Borrower provides false information; or (d) the Borrower violates 
            any other term of this Agreement.
        </p>

        <h3 style="font-size: 15px; color: #333; margin: 25px 0 10px; font-weight: bold;">5. GOVERNING LAW</h3>
        <p style="text-align: justify; margin: 10px 0; font-size: 14px; line-height: 1.6;">
            This Agreement is subject to the laws of the State of Florida. Any disputes arising from this 
            Agreement will be resolved in the courts of Orange County, Florida.
        </p>

        <!-- ASSINATURAS -->
        <h2 style="font-size: 20px; color: #1E8449; margin: 40px 0 20px; text-transform: uppercase; border-bottom: 2px solid #2ECC71; padding-bottom: 8px;">
            SIGNATURES:
        </h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin: 40px 0;">
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; height: 50px; margin-bottom: 15px;"></div>
                <div style="font-size: 12px; text-align: left; line-height: 1.5;">
                    <strong>BORROWER:</strong><br>
                    ${contractInfo.clientName}<br>
                    Date: _________________
                </div>
            </div>
            <div style="text-align: center;">
                <div style="border-bottom: 2px solid #333; height: 50px; margin-bottom: 15px;"></div>
                <div style="font-size: 12px; text-align: left; line-height: 1.5;">
                    <strong>LENDER:</strong><br>
                    Flexcredi LLC<br>
                    By: _________________<br>
                    Title: Authorized Representative<br>
                    Date: _________________
                </div>
            </div>
        </div>

        <!-- FOOTER LEGAL -->
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0; font-size: 12px; line-height: 1.5;">
            <p style="margin: 0 0 10px; font-weight: bold; color: #856404;">IMPORTANT NOTICE:</p>
            <p style="margin: 0; color: #856404;">
                This is a legally binding contract. The Borrower should read all terms carefully before signing. 
                If you have questions about this Agreement, consult with an attorney before signing.
            </p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6; text-align: center; font-size: 11px; color: #666;">
                Agreement Reference: ${contractInfo.contractNumber} | Generated: ${new Date().toLocaleString('pt-BR')} | Version: 2024.1
            </div>
        </div>
    </div>
    `;

    // Função para mostrar modal
    function showContract() {
        console.log('📄 Exibindo contrato...');
        
        // Criar modal simples
        const modal = document.createElement('div');
        modal.id = 'simpleContractModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); z-index: 99999; display: flex; 
            align-items: center; justify-content: center; animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white; width: 95%; max-width: 1000px; max-height: 90vh; 
            border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            display: flex; flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #2ECC71, #1E8449); color: white; 
            padding: 20px; display: flex; justify-content: space-between; align-items: center;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; font-size: 18px;">📄 Contrato de Empréstimo #${contractInfo.contractNumber}</h3>
            <button id="closeSimpleModal" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 5px;">×</button>
        `;

        const body = document.createElement('div');
        body.style.cssText = `
            flex: 1; overflow-y: auto; padding: 30px; max-height: calc(90vh - 140px);
        `;
        body.innerHTML = contractHTML;

        const footer = document.createElement('div');
        footer.style.cssText = `
            background: #f8f9fa; padding: 15px 30px; border-top: 1px solid #dee2e6; 
            display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;
        `;
        footer.innerHTML = `
            <button onclick="window.print()" style="background: #6c757d; color: white; padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer;">
                🖨️ Imprimir
            </button>
            <button onclick="alert('Download será implementado!')" style="background: #28a745; color: white; padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer;">
                💾 Download PDF
            </button>
            <button onclick="alert('Preparando assinatura eletrônica...')" style="background: #2ECC71; color: white; padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer;">
                ✍️ Assinar Eletronicamente
            </button>
            <button id="closeSimpleModalFooter" style="background: transparent; color: #6c757d; border: 2px solid #dee2e6; padding: 10px 16px; border-radius: 6px; cursor: pointer;">
                ✖️ Fechar
            </button>
        `;

        modalContent.appendChild(header);
        modalContent.appendChild(body);
        modalContent.appendChild(footer);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);

        // Eventos de fechar
        document.getElementById('closeSimpleModal').onclick = () => modal.remove();
        document.getElementById('closeSimpleModalFooter').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        // CSS para animação
        const style = document.createElement('style');
        style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
        document.head.appendChild(style);

        console.log('✅ Modal do contrato criado e exibido!');
    }

    // Configurar botão quando DOM estiver pronto
    function setupButton() {
        const btn = document.getElementById('reviewContractBtn');
        if (btn) {
            btn.onclick = function(e) {
                e.preventDefault();
                console.log('🔍 Botão clicado - Abrindo contrato!');
                showContract();
            };
            console.log('✅ Botão configurado com sucesso!');
        } else {
            console.log('⏳ Botão não encontrado, tentando novamente...');
            setTimeout(setupButton, 500);
        }
    }

    // Iniciar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupButton);
    } else {
        setupButton();
    }

    // Tentar novamente após 1 segundo como backup
    setTimeout(setupButton, 1000);

    console.log('✅ Sistema simples de contrato carregado!');
})();
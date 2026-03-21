/**
 * FLEXCREDI - Sistema de Assinatura Eletrônica
 * Fluxo completo: Assinatura → Contrato Assinado → Salvar
 */

(function() {
    'use strict';

    // Signature pad state
    let signatureCanvas = null;
    let signatureCtx = null;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Initialize signature pad
    function initSignaturePad(canvasId) {
        signatureCanvas = document.getElementById(canvasId);
        if (!signatureCanvas) return;
        
        signatureCtx = signatureCanvas.getContext('2d');
        signatureCtx.strokeStyle = '#000';
        signatureCtx.lineWidth = 2;
        signatureCtx.lineCap = 'round';
        signatureCtx.lineJoin = 'round';

        // Mouse events
        signatureCanvas.addEventListener('mousedown', startDrawing);
        signatureCanvas.addEventListener('mousemove', draw);
        signatureCanvas.addEventListener('mouseup', stopDrawing);
        signatureCanvas.addEventListener('mouseout', stopDrawing);

        // Touch events
        signatureCanvas.addEventListener('touchstart', handleTouchStart);
        signatureCanvas.addEventListener('touchmove', handleTouchMove);
        signatureCanvas.addEventListener('touchend', stopDrawing);
    }

    function startDrawing(e) {
        isDrawing = true;
        const rect = signatureCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = signatureCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        signatureCtx.beginPath();
        signatureCtx.moveTo(lastX, lastY);
        signatureCtx.lineTo(x, y);
        signatureCtx.stroke();
        
        lastX = x;
        lastY = y;
    }

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = signatureCanvas.getBoundingClientRect();
        isDrawing = true;
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
    }

    function handleTouchMove(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = signatureCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        signatureCtx.beginPath();
        signatureCtx.moveTo(lastX, lastY);
        signatureCtx.lineTo(x, y);
        signatureCtx.stroke();
        
        lastX = x;
        lastY = y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function clearSignature(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    function isCanvasEmpty(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return true;
        const ctx = canvas.getContext('2d');
        const pixelBuffer = new Uint32Array(
            ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
        );
        return !pixelBuffer.some(color => color !== 0);
    }

    // Get user data
    function getUserData() {
        try {
            return JSON.parse(localStorage.getItem('flexcredi_user')) || {};
        } catch (e) {
            return {};
        }
    }

    // Show signature modal
    window.initiateElectronicSignature = function() {
        const userData = getUserData();
        
        const modalHTML = `
            <div class="modal-overlay" id="signature-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 100000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; width: 95%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 80px rgba(0,0,0,0.4);">
                    
                    <!-- Header -->
                    <div style="padding: 15px 20px; background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%); color: white; border-radius: 12px 12px 0 0;">
                        <h3 style="margin: 0; font-size: 16px;"><i class="fas fa-signature"></i> Electronic Signature</h3>
                        <p style="margin: 5px 0 0; font-size: 12px; opacity: 0.9;">Personal Loan Agreement - ${userData.fullName || 'Contract'}</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 20px;">
                        
                        <!-- Step indicator -->
                        <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
                            <div id="step1-indicator" style="text-align: center;">
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: #2ECC71; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">1</div>
                                <span style="font-size: 11px; color: #2ECC71; font-weight: 600;">Signature</span>
                            </div>
                            <div id="step2-indicator" style="text-align: center;">
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: #ddd; color: #666; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">2</div>
                                <span style="font-size: 11px; color: #666;">ACH Consent</span>
                            </div>
                            <div id="step3-indicator" style="text-align: center;">
                                <div style="width: 30px; height: 30px; border-radius: 50%; background: #ddd; color: #666; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">3</div>
                                <span style="font-size: 11px; color: #666;">Complete</span>
                            </div>
                        </div>
                        
                        <!-- Step 1: Signature -->
                        <div id="signature-step1">
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                                <p style="margin: 0; font-size: 12px; color: #666;">
                                    <strong>BORROWER:</strong> ${userData.fullName || 'N/A'}<br>
                                    <strong>SSN:</strong> ${userData.ssn || '***-**-****'}
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 10px; font-size: 13px; font-weight: 600; color: #333;">
                                Please sign below to accept the terms of the Personal Loan Agreement:
                            </p>
                            
                            <div style="border: 2px dashed #ccc; border-radius: 8px; padding: 10px; background: #fafafa;">
                                <canvas id="borrower-signature" width="520" height="150" style="width: 100%; border: 1px solid #e0e0e0; border-radius: 4px; background: white; cursor: crosshair;"></canvas>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                                    <span style="font-size: 11px; color: #999;">Draw your signature above</span>
                                    <button onclick="clearSignaturePad('borrower-signature')" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 12px;">
                                        <i class="fas fa-eraser"></i> Clear
                                    </button>
                                </div>
                            </div>
                            
                            <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
                                <button onclick="document.getElementById('signature-modal').remove()" style="padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                                    Cancel
                                </button>
                                <button onclick="goToStep2()" style="padding: 10px 20px; background: #2ECC71; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                                    Continue <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Step 2: ACH Consent -->
                        <div id="signature-step2" style="display: none;">
                            <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #2ECC71;">
                                <p style="margin: 0; font-size: 12px; color: #1E8449;">
                                    <strong>ACH AUTHORIZATION CONSENT</strong><br>
                                    By signing below, I specifically acknowledge and agree to the ACH Payment Authorization terms set forth in Section 7 of this Agreement.
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 10px; font-size: 13px; font-weight: 600; color: #333;">
                                Please provide your initials to authorize ACH payments:
                            </p>
                            
                            <div style="border: 2px dashed #ccc; border-radius: 8px; padding: 10px; background: #fafafa;">
                                <canvas id="ach-initials" width="200" height="80" style="width: 200px; border: 1px solid #e0e0e0; border-radius: 4px; background: white; cursor: crosshair; display: block; margin: 0 auto;"></canvas>
                                <div style="display: flex; justify-content: center; align-items: center; margin-top: 8px; gap: 20px;">
                                    <span style="font-size: 11px; color: #999;">Your initials</span>
                                    <button onclick="clearSignaturePad('ach-initials')" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 12px;">
                                        <i class="fas fa-eraser"></i> Clear
                                    </button>
                                </div>
                            </div>
                            
                            <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
                                <button onclick="goToStep1()" style="padding: 10px 20px; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                                    <i class="fas fa-arrow-left"></i> Back
                                </button>
                                <button onclick="completeSignature()" style="padding: 10px 20px; background: #2ECC71; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                                    <i class="fas fa-check"></i> Complete Signature
                                </button>
                            </div>
                        </div>
                        
                        <!-- Step 3: Complete -->
                        <div id="signature-step3" style="display: none;">
                            <div style="text-align: center; padding: 20px 0;">
                                <div style="width: 80px; height: 80px; background: #e8f5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                                    <i class="fas fa-check-circle" style="font-size: 40px; color: #2ECC71;"></i>
                                </div>
                                <h3 style="margin: 0 0 10px; color: #2ECC71;">Contract Signed Successfully!</h3>
                                <p style="margin: 0; color: #666; font-size: 13px;">Your signed contract has been saved.</p>
                            </div>
                            
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="font-size: 12px; color: #666;">Contract Number:</span>
                                    <strong style="font-size: 12px;" id="signed-contract-number">FL202603XXX</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="font-size: 12px; color: #666;">Signed Date:</span>
                                    <strong style="font-size: 12px;" id="signed-date">${new Date().toLocaleDateString('en-US')}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="font-size: 12px; color: #666;">Status:</span>
                                    <span style="font-size: 12px; color: #2ECC71; font-weight: 600;"><i class="fas fa-check-circle"></i> SIGNED</span>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 10px; justify-content: center;">
                                <button onclick="viewSignedContract()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                                    <i class="fas fa-file-pdf"></i> View Signed Contract
                                </button>
                                <button onclick="document.getElementById('signature-modal').remove(); location.reload();" style="padding: 10px 20px; background: #2ECC71; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                                    <i class="fas fa-check"></i> Done
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Initialize signature pad
        setTimeout(() => {
            initSignaturePad('borrower-signature');
        }, 100);
    };

    // Clear signature pad
    window.clearSignaturePad = function(canvasId) {
        clearSignature(canvasId);
    };

    // Navigate to step 2
    window.goToStep2 = function() {
        if (isCanvasEmpty('borrower-signature')) {
            alert('Please sign the contract before continuing.');
            return;
        }
        
        document.getElementById('signature-step1').style.display = 'none';
        document.getElementById('signature-step2').style.display = 'block';
        
        // Update indicators
        document.getElementById('step1-indicator').querySelector('div').style.background = '#27AE60';
        document.getElementById('step2-indicator').querySelector('div').style.background = '#2ECC71';
        document.getElementById('step2-indicator').querySelector('div').style.color = 'white';
        document.getElementById('step2-indicator').querySelector('span').style.color = '#2ECC71';
        
        // Initialize ACH initials pad
        setTimeout(() => {
            initSignaturePad('ach-initials');
        }, 100);
    };

    // Navigate back to step 1
    window.goToStep1 = function() {
        document.getElementById('signature-step2').style.display = 'none';
        document.getElementById('signature-step1').style.display = 'block';
        
        // Reset step 2 indicator
        document.getElementById('step2-indicator').querySelector('div').style.background = '#ddd';
        document.getElementById('step2-indicator').querySelector('div').style.color = '#666';
        document.getElementById('step2-indicator').querySelector('span').style.color = '#666';
    };

    // Complete signature process
    window.completeSignature = function() {
        if (isCanvasEmpty('ach-initials')) {
            alert('Please provide your initials for ACH authorization.');
            return;
        }
        
        // Get signature data
        const signatureCanvas = document.getElementById('borrower-signature');
        const initialsCanvas = document.getElementById('ach-initials');
        
        const signatureData = signatureCanvas.toDataURL('image/png');
        const initialsData = initialsCanvas.toDataURL('image/png');
        
        // Save signed contract
        const userData = getUserData();
        const contractNumber = `FL${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        
        const signedContract = {
            contractNumber: contractNumber,
            borrowerName: userData.fullName,
            borrowerSSN: userData.ssn,
            loanAmount: userData.requestedAmount || 10000,
            interestRate: userData.interestRate || 18.5,
            term: userData.term || 24,
            monthlyPayment: userData.monthlyPayment || 508,
            signedDate: new Date().toISOString(),
            signatureData: signatureData,
            initialsData: initialsData,
            status: 'SIGNED'
        };
        
        // Save to localStorage
        localStorage.setItem('flexcredi_signed_contract', JSON.stringify(signedContract));
        
        // Update user status
        userData.contractSigned = true;
        userData.contractNumber = contractNumber;
        userData.contractSignedDate = new Date().toISOString();
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        
        // Update UI
        document.getElementById('signed-contract-number').textContent = contractNumber;
        document.getElementById('signed-date').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Show step 3
        document.getElementById('signature-step2').style.display = 'none';
        document.getElementById('signature-step3').style.display = 'block';
        
        // Update indicators
        document.getElementById('step2-indicator').querySelector('div').style.background = '#27AE60';
        document.getElementById('step3-indicator').querySelector('div').style.background = '#2ECC71';
        document.getElementById('step3-indicator').querySelector('div').style.color = 'white';
        document.getElementById('step3-indicator').querySelector('span').style.color = '#2ECC71';
    };

    // View signed contract
    window.viewSignedContract = function() {
        const signedContract = JSON.parse(localStorage.getItem('flexcredi_signed_contract') || '{}');
        const userData = getUserData();
        
        if (!signedContract.signatureData) {
            alert('No signed contract found.');
            return;
        }
        
        const signedDate = new Date(signedContract.signedDate);
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const modalHTML = `
            <div class="modal-overlay" id="signed-contract-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 100001; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; border-radius: 12px; width: 95%; max-width: 850px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
                    
                    <div style="padding: 12px 18px; background: linear-gradient(135deg, #27AE60 0%, #1E8449 100%); color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 15px;"><i class="fas fa-file-signature"></i> Signed Contract - ${signedContract.contractNumber}</h3>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px;"><i class="fas fa-check-circle"></i> SIGNED</span>
                            <button onclick="document.getElementById('signed-contract-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 14px;">&times;</button>
                        </div>
                    </div>
                    
                    <div style="flex: 1; overflow-y: auto; padding: 20px; background: #f5f5f5;">
                        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: 'Times New Roman', serif; font-size: 12px; line-height: 1.4;">
                            
                            <!-- Header -->
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #2ECC71;">
                                <div>
                                    <span style="font-size: 24px; color: #2ECC71; font-weight: bold;">FleXcredi</span>
                                    <span style="font-size: 10px; color: #1E8449; margin-left: 8px;">EASY • SIMPLE • FAST</span>
                                </div>
                                <div style="text-align: right; font-size: 10px; color: #666;">
                                    <strong>FLEXCREDI LLC</strong><br>
                                    5200 Old Winter Garden Rd, Orlando, FL 32811
                                </div>
                            </div>
                            
                            <h1 style="text-align: center; font-size: 16px; color: #1E8449; margin: 12px 0 5px;">PERSONAL LOAN AGREEMENT</h1>
                            <p style="text-align: center; font-size: 11px; color: #666; margin: 0 0 15px;">
                                Contract #${signedContract.contractNumber} | Effective Date: ${monthNames[signedDate.getMonth()]} ${signedDate.getDate()}, ${signedDate.getFullYear()}
                            </p>
                            
                            <!-- Parties -->
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 12px; border-left: 3px solid #2ECC71;">
                                <p style="margin: 0 0 5px; font-size: 11px;"><strong>LENDER:</strong> Flexcredi LLC, 5200 Old Winter Garden Road, Orlando, FL 32811</p>
                                <p style="margin: 0; font-size: 11px;"><strong>BORROWER:</strong> ${userData.fullName}, ${userData.address}, ${userData.city}, ${userData.state} ${userData.zipCode}</p>
                            </div>
                            
                            <!-- Loan Terms -->
                            <div style="background: #e8f5e9; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                                <p style="margin: 0 0 6px; font-size: 11px; font-weight: bold; color: #1E8449;">LOAN TERMS</p>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 11px;">
                                    <div><span style="color: #666;">Principal:</span> <strong>$${signedContract.loanAmount.toLocaleString()}</strong></div>
                                    <div><span style="color: #666;">Rate:</span> <strong>${signedContract.interestRate}% APR</strong></div>
                                    <div><span style="color: #666;">Term:</span> <strong>${signedContract.term} months</strong></div>
                                    <div><span style="color: #666;">Payment:</span> <strong>$${signedContract.monthlyPayment}/mo</strong></div>
                                </div>
                            </div>
                            
                            <!-- Signatures Section -->
                            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #2ECC71;">
                                <p style="text-align: center; font-size: 10px; color: #666; margin-bottom: 15px;">
                                    IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
                                </p>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                    <!-- Lender Signature -->
                                    <div style="padding: 15px; background: #f9f9f9; border-radius: 6px;">
                                        <p style="margin: 0 0 5px; font-weight: bold; font-size: 12px;">LENDER:</p>
                                        <p style="margin: 0 0 10px; font-size: 11px;">FLEXCREDI LLC</p>
                                        <div style="border-bottom: 1px solid #333; padding-bottom: 25px; margin-bottom: 5px;">
                                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAAA8AQ3AAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQ7SURBVHhe7dxBbhQxEABQzv9/miMLBEhy/e6uqu7xvDdI2N1x2+UqexYAAAAAAAAAAAAAAAAAAAAAe/i8/gQ4iMACUhBYQAoCC0hBYAEpCCwgBYEFpCCwgBQEFpCCwAJSEFhACgILSEFgASkILCAFgQWkILCAFAQWkILAAlIQWEAKAgtIQWABKQgsIAWBBaQgsIAUBBaQgsACUhBYQAoCC0hBYAEpCCwgBYEFpCCwgBQEFpCCwAJSEFhACgILSEFgASkILCAFgQWkcLz+BDiIwAJSEFhACgILSEFgASkILCAFgQWkILCAFAQWkILAAlIQWEAKAgtIQWABKQgsIAWBBaQgsIAUBBaQgsACUhBYQAoCC0hBYAEpCCwghd8vrAd44E8t3QEAAAAASUVORK5CYII=" alt="Lender Signature" style="height: 30px; opacity: 0.7;">
                                        </div>
                                        <p style="margin: 0; font-size: 10px;">Arthur Reis Marques</p>
                                        <p style="margin: 0; font-size: 10px; color: #666;">Principal Executive Officer</p>
                                    </div>
                                    
                                    <!-- Borrower Signature -->
                                    <div style="padding: 15px; background: #f9f9f9; border-radius: 6px;">
                                        <p style="margin: 0 0 5px; font-weight: bold; font-size: 12px;">BORROWER:</p>
                                        <p style="margin: 0 0 10px; font-size: 11px;">${userData.fullName}</p>
                                        <div style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px; min-height: 40px;">
                                            <img src="${signedContract.signatureData}" alt="Borrower Signature" style="max-height: 40px; max-width: 100%;">
                                        </div>
                                        <p style="margin: 0; font-size: 10px;">Signature</p>
                                        <p style="margin: 0; font-size: 10px; color: #666;">SSN: ${userData.ssn}</p>
                                    </div>
                                </div>
                                
                                <!-- ACH Consent -->
                                <div style="margin-top: 15px; padding: 12px; background: #e8f5e9; border-radius: 6px; border-left: 4px solid #2ECC71;">
                                    <p style="margin: 0 0 8px; font-weight: bold; font-size: 11px; color: #1E8449;">ACH AUTHORIZATION CONSENT</p>
                                    <p style="margin: 0 0 10px; font-size: 10px;">By signing below, I specifically acknowledge and agree to the ACH Payment Authorization terms set forth in Section 7 of this Agreement.</p>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span style="font-size: 11px;">Borrower Initials:</span>
                                        <div style="border-bottom: 1px solid #333; padding: 2px 10px; min-width: 60px;">
                                            <img src="${signedContract.initialsData}" alt="Initials" style="max-height: 25px; max-width: 60px;">
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Timestamp -->
                                <div style="margin-top: 15px; text-align: center; font-size: 10px; color: #999;">
                                    <p style="margin: 0;">Digitally signed on ${signedDate.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                    <p style="margin: 5px 0 0; font-size: 9px;">Document ID: ${signedContract.contractNumber}-${Date.now().toString(36).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="padding: 12px 18px; border-top: 1px solid #e9ecef; display: flex; gap: 10px; justify-content: flex-end; background: #fafafa;">
                        <button onclick="window.print()" style="padding: 8px 16px; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button onclick="downloadSignedContract()" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-download"></i> Download PDF
                        </button>
                        <button onclick="document.getElementById('signed-contract-modal').remove()" style="padding: 8px 16px; background: #2ECC71; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    // Download signed contract (placeholder)
    window.downloadSignedContract = function() {
        alert('PDF download will be available soon. Please use Print to save as PDF.');
    };

    console.log('FlexCredi signature system loaded');
})();

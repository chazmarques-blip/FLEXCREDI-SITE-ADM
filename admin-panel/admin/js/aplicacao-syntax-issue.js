/**
 * FLEXCREDI - Aplicação JavaScript
 * Funcionalidades específicas para formulários multi-step
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('FLEXCREDI Application - JavaScript loaded');
    
    // Inicializar funcionalidades específicas da aplicação
    initMultiStepForm();
    initDocumentUpload();
    initProgressBar();
    initFormSaving();
    
    // Auto-save form data
    setInterval(autoSaveFormData, 30000); // Save every 30 seconds
});

// ========== MULTI-STEP FORM ========== //
let currentStep = 1;
const totalSteps = 4; // Updated from 6 to 4 steps

function initMultiStepForm() {
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    console.log('Initializing multi-step form...');
    console.log('Next buttons found:', nextButtons.length);
    console.log('Prev buttons found:', prevButtons.length);
    console.log('Total steps configured:', totalSteps);
    console.log('Current step:', currentStep);
    
    if (nextButtons.length === 0) {
        console.error('No .btn-next buttons found!');
        return;
    }
    
    nextButtons.forEach((button, index) => {
        console.log(`Attaching click handler to Next button ${index + 1}`);
        button.addEventListener('click', function(e) {
            console.log('Next button clicked!', 'Current step:', currentStep);
            handleNextStep();
        });
    });
    
    prevButtons.forEach((button, index) => {
        console.log(`Attaching click handler to Prev button ${index + 1}`);
        button.addEventListener('click', function(e) {
            console.log('Prev button clicked!', 'Current step:', currentStep);
            handlePrevStep();
        });
    });
    
    console.log('Multi-step form initialized successfully ✓');
}

function handleNextStep() {
    console.log('=== handleNextStep called ===');
    console.log('Current step before validation:', currentStep);
    console.log('Total steps:', totalSteps);
    
    // Get validation result with missing fields
    const validationResult = validateCurrentStepWithWarnings();
    console.log('Validation result:', validationResult);
    
    // ALWAYS allow navigation forward, even if incomplete
    if (currentStep < totalSteps) {
        console.log(`Advancing from step ${currentStep} to ${currentStep + 1}`);
        
        // If validation failed, show warning but still allow navigation
        if (!validationResult.isValid) {
            showWarningToast(validationResult.missingFields, currentStep);
            markStepAsIncomplete(currentStep);
        } else {
            markStepAsComplete(currentStep);
        }
        
        hideStep(currentStep);
        currentStep++;
        showStep(currentStep);
        updateProgressBar();
        console.log('Successfully moved to step', currentStep);
    } else {
        console.log('Already at last step');
        
        // On final step, check ALL previous steps
        if (!validationResult.isValid) {
            showFinalValidationWarning();
        }
    }
}

function handlePrevStep() {
    if (currentStep > 1) {
        hideStep(currentStep);
        currentStep--;
        showStep(currentStep);
        updateProgressBar();
    }
}

function showStep(step) {
    const stepElement = document.querySelector(`[data-step="${step}"]`);
    if (stepElement) {
        stepElement.classList.add('active');
        stepElement.style.display = 'block';
        
        // Scroll to top of form
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function hideStep(step) {
    const stepElement = document.querySelector(`[data-step="${step}"]`);
    if (stepElement) {
        stepElement.classList.remove('active');
        stepElement.style.display = 'none';
    }
}

function validateCurrentStep() {
    const result = validateCurrentStepWithWarnings();
    return result.isValid;
}

function validateCurrentStepWithWarnings() {
    console.log('=== validateCurrentStepWithWarnings called ===');
    console.log('Validating step:', currentStep);
    
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"].active`);
    console.log('Current step element found:', !!currentStepElement);
    
    if (!currentStepElement) {
        console.error('Current step element not found!');
        return { isValid: false, missingFields: [] };
    }
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    console.log('Required fields found:', requiredFields.length);
    
    let isValid = true;
    let missingFields = [];
    
    requiredFields.forEach(field => {
        const fieldName = field.name || field.id || 'unnamed';
        const fieldLabel = getFieldLabel(field);
        const isHidden = field.closest('.form-group')?.style.display === 'none';
        
        console.log(`Checking field: ${fieldName}`, {
            value: field.value,
            hidden: isHidden,
            type: field.type
        });
        
        // Skip validation for hidden fields (like SSN when using alternative doc)
        if (isHidden) {
            console.log(`  → Skipping hidden field: ${fieldName}`);
            return;
        }
        
        if (!validateFieldSilent(field)) {
            console.log(`  → Field INVALID: ${fieldName}`);
            isValid = false;
            missingFields.push({
                name: fieldName,
                label: fieldLabel,
                element: field
            });
        } else {
            console.log(`  → Field valid: ${fieldName}`);
        }
    });
    
    // Special validation for step 1: SSN or alternative document
    if (currentStep === 1) {
        console.log('Step 1: Checking SSN/Alternative document validation');
        
        const ssnInput = document.getElementById('ssn');
        const altDocCheckbox = document.getElementById('use_alternative_doc');
        const altDocType = document.getElementById('alternative_doc_type');
        const altDocNumber = document.getElementById('alternative_doc_number');
        
        console.log('Alternative doc checkbox checked:', altDocCheckbox?.checked);
        
        if (altDocCheckbox && altDocCheckbox.checked) {
            // Using alternative document
            console.log('Using alternative document');
            console.log('Alt doc type:', altDocType?.value);
            console.log('Alt doc number:', altDocNumber?.value);
            
            if (!altDocType?.value) {
                console.log('Alternative document type validation FAILED');
                isValid = false;
                missingFields.push({
                    name: 'alternative_doc_type',
                    label: 'Document Type',
                    element: altDocType
                });
            }
            if (!altDocNumber?.value) {
                console.log('Alternative document number validation FAILED');
                isValid = false;
                missingFields.push({
                    name: 'alternative_doc_number',
                    label: 'Document Number',
                    element: altDocNumber
                });
            }
        } else {
            // Using SSN
            console.log('Using SSN');
            console.log('SSN value:', ssnInput?.value);
            
            if (!ssnInput?.value) {
                console.log('SSN validation FAILED');
                isValid = false;
                missingFields.push({
                    name: 'ssn',
                    label: 'Social Security / Tax ID',
                    element: ssnInput
                });
            } else {
                console.log('SSN validation PASSED');
            }
        }
    }
    
    console.log('=== Validation complete ===');
    console.log('Overall result:', isValid ? 'VALID ✓' : 'INCOMPLETE ⚠');
    if (!isValid) {
        console.log('Missing fields:', missingFields.map(f => f.label));
    }
    
    return {
        isValid: isValid,
        missingFields: missingFields,
        step: currentStep
    };
}

// ========== PROGRESS BAR ========== //
function initProgressBar() {
    updateProgressBar();
}

function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber <= currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            }
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// ========== DOCUMENT UPLOAD ========== //
function initDocumentUpload() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        const input = area.querySelector('input[type="file"]');
        const dropzone = area.querySelector('.upload-dropzone');
        
        // Click to upload
        dropzone.addEventListener('click', () => input.click());
        
        // Drag and drop
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('dragleave', handleDragLeave);
        dropzone.addEventListener('drop', handleDrop);
        
        // File input change
        input.addEventListener('change', handleFileSelect);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    const input = e.currentTarget.parentNode.querySelector('input[type="file"]');
    
    if (files.length > 0) {
        input.files = files;
        handleFileSelect({ target: input });
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    const uploadArea = e.target.closest('.upload-area');
    const preview = uploadArea.querySelector('.upload-preview');
    
    preview.innerHTML = '';
    
    Array.from(files).forEach(file => {
        if (validateFile(file)) {
            const filePreview = createFilePreview(file);
            preview.appendChild(filePreview);
        }
    });
}

function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    if (file.size > maxSize) {
        showAlert('error', `File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showAlert('error', `File type ${file.type} is not allowed. Use JPG, PNG, or PDF.`);
        return false;
    }
    
    return true;
}

function createFilePreview(file) {
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    
    const icon = getFileIcon(file.type);
    const size = formatFileSize(file.size);
    
    preview.innerHTML = `
        <div class="file-info">
            <i class="${icon}"></i>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${size}</div>
            </div>
            <button type="button" class="file-remove" onclick="removeFile(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return preview;
}

function getFileIcon(type) {
    if (type.startsWith('image/')) return 'fas fa-image text-verde';
    if (type === 'application/pdf') return 'fas fa-file-pdf text-vermelho';
    return 'fas fa-file text-cinza';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(button) {
    const preview = button.closest('.file-preview');
    const uploadArea = button.closest('.upload-area');
    const input = uploadArea.querySelector('input[type="file"]');
    
    preview.remove();
    
    // Reset input if no more files
    if (uploadArea.querySelectorAll('.file-preview').length === 0) {
        input.value = '';
    }
}

// ========== FORM DATA PERSISTENCE ========== //
function initFormSaving() {
    const formInputs = document.querySelectorAll('#form-aplicacao input, #form-aplicacao select, #form-aplicacao textarea');
    
    formInputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`flexcredi_form_${input.name}`);
        if (savedValue && input.type !== 'file') {
            if (input.type === 'checkbox') {
                input.checked = savedValue === 'true';
            } else {
                input.value = savedValue;
            }
        }
        
        // Save on change
        input.addEventListener('change', saveFormData);
        input.addEventListener('input', debounce(saveFormData, 1000));
    });
}

function saveFormData() {
    const formInputs = document.querySelectorAll('#form-aplicacao input, #form-aplicacao select, #form-aplicacao textarea');
    
    formInputs.forEach(input => {
        if (input.type !== 'file') {
            const value = input.type === 'checkbox' ? input.checked : input.value;
            localStorage.setItem(`flexcredi_form_${input.name}`, value);
        }
    });
    
    console.log('Form data saved to localStorage');
}

function autoSaveFormData() {
    saveFormData();
    console.log('Auto-save completed');
}

function clearSavedFormData() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('flexcredi_form_'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log('Saved form data cleared');
}

// ========== CEP LOOKUP ========== //
function initZipCodeLookup() {
    const zipInput = document.getElementById('zipcode');
    if (zipInput) {
        // ZIP code lookup desabilitado temporariamente
        // zipInput.addEventListener('blur', lookupZipCode);
    }
}

async function lookupZipCode() {
    // Função desabilitada temporariamente
    // Para implementar, seria necessário um serviço de lookup de ZIP code americano
    return;
}

function fillAddressFields(addressData) {
    const mappings = {
        'street': addressData.street,
        'neighborhood': addressData.neighborhood,
        'city': addressData.city,
        'estado': addressData.uf
    };
    
    Object.entries(mappings).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field && value) {
            field.value = value;
        }
    });
}

// ========== REVIEW SECTION ========== //
function generateReviewContent() {
    const reviewContainer = document.getElementById('review-content');
    if (!reviewContainer) return;
    
    const formData = getFormData();
    const reviewHTML = createReviewHTML(formData);
    reviewContainer.innerHTML = reviewHTML;
}

function getFormData() {
    const formInputs = document.querySelectorAll('#form-aplicacao input, #form-aplicacao select, #form-aplicacao textarea');
    const data = {};
    
    formInputs.forEach(input => {
        if (input.type !== 'file' && input.value) {
            data[input.name] = input.value;
        }
    });
    
    return data;
}

function createReviewHTML(data) {
    return `
        <div class="review-sections">
            <div class="review-section">
                <h4>Personal Information</h4>
                <div class="review-grid">
                    <div class="review-item">
                        <span class="label">Full Name:</span>
                        <span class="value">${data.nome_completo || 'Not provided'}</span>
                    </div>
                    <div class="review-item">
                        <span class="label">SSN / Tax ID:</span>
                        <span class="value">${data.ssn || 'Not provided'}</span>
                    </div>
                    <div class="review-item">
                        <span class="label">Email:</span>
                        <span class="value">${data.email || 'Not provided'}</span>
                    </div>
                    <div class="review-item">
                        <span class="label">Phone:</span>
                        <span class="value">${data.telefone || 'Not provided'}</span>
                    </div>
                </div>
            </div>
            
            <div class="review-section">
                <h4>Credit Information</h4>
                <div class="review-grid">
                    <div class="review-item">
                        <span class="label">Credit Type:</span>
                        <span class="value">${data.tipo_credito || 'Not selected'}</span>
                    </div>
                    <div class="review-item">
                        <span class="label">Requested Amount:</span>
                        <span class="value">$${data.valor_solicitado || '0'}</span>
                    </div>
                    <div class="review-item">
                        <span class="label">Purpose:</span>
                        <span class="value">${data.proposito || 'Not specified'}</span>
                    </div>
                    <div class="review-item">
                        <span class="label">Desired Installments:</span>
                        <span class="value">${data.parcelas_desejadas || 'Not selected'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ========== UTILITY FUNCTIONS ========== //
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when step 6 is reached
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class' && 
                mutation.target.getAttribute('data-step') === '6' &&
                mutation.target.classList.contains('active')) {
                generateReviewContent();
            }
        });
    });
    
    const step6 = document.querySelector('[data-step="6"]');
    if (step6) {
        observer.observe(step6, { attributes: true });
    }
});

// Add CSS for file previews and drag/drop
const additionalStyles = `
<style>
.drag-over {
    background-color: rgba(46, 204, 113, 0.1);
    border: 2px dashed var(--verde-vibrante) !important;
}

.file-preview {
    margin-top: 12px;
    padding: 12px;
    background: var(--cinza-claro);
    border-radius: var(--radius-md);
    border: 1px solid rgba(0,0,0,0.1);
}

.file-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.file-details {
    flex: 1;
}

.file-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--cinza-escuro);
}

.file-size {
    font-size: 11px;
    color: var(--cinza-medio);
}

.file-remove {
    background: none;
    border: none;
    color: var(--vermelho-erro);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
}

.file-remove:hover {
    background: rgba(231, 76, 60, 0.1);
}

.review-section {
    margin-bottom: 24px;
    padding: 20px;
    background: var(--cinza-claro);
    border-radius: var(--radius-lg);
}

.review-section h4 {
    color: var(--verde-vibrante);
    margin-bottom: 16px;
    font-size: 16px;
}

.review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 12px;
}

.review-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0,0,0,0.1);
}

.review-item .label {
    font-weight: 500;
    color: var(--cinza-escuro);
    font-size: 13px;
}

// ========== VALIDATION HELPERS ========== //
function validateField(field) {
    if (!field.value || field.value.trim() === '') {
        field.style.borderColor = '#E74C3C';
        return false;
    }
    
    field.style.borderColor = '';
    return true;
}

function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.validation-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: #E74C3C;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

function showAlert(type, message) {
    const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        min-width: 300px;
        padding: 16px;
        background: ${type === 'error' ? '#E74C3C' : '#2ECC71'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    alertDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 4000);
}

// ========== FLEXIBLE VALIDATION HELPERS ========== //
function validateFieldSilent(field) {
    // Same as validateField but without visual feedback
    if (!field.value || field.value.trim() === '') {
        return false;
    }
    return true;
}

function getFieldLabel(field) {
    // Try to get a readable label for the field
    const placeholder = field.getAttribute('placeholder');
    if (placeholder) {
        return placeholder.replace(' *', '').replace('*', '');
    }
    
    const label = field.closest('.form-group')?.querySelector('label');
    if (label) {
        return label.textContent.trim().replace(' *', '').replace('*', '');
    }
    
    // Fallback to field name
    const name = field.name || field.id;
    return name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
}

function showWarningToast(missingFields, stepNumber) {
    // Remove any existing warnings
    const existingWarning = document.querySelector('.incomplete-warning-toast');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    if (missingFields.length === 0) return;
    
    const fieldsList = missingFields.slice(0, 3).map(f => `• ${f.label}`).join('<br>');
    const moreCount = missingFields.length > 3 ? ` (+${missingFields.length - 3} more)` : '';
    
    const warningDiv = document.createElement('div');
    warningDiv.className = 'incomplete-warning-toast';
    warningDiv.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #FFA500;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 90%;
        width: auto;
        min-width: 280px;
        animation: slideUpFadeIn 0.4s ease;
    `;
    
    warningDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 20px; margin-top: 2px;"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 6px;">Step ${stepNumber} - Incomplete Fields</div>
                <div style="font-size: 13px; opacity: 0.95;">
                    ${fieldsList}${moreCount}
                </div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
                    ✓ You can continue and fill this later
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(warningDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (warningDiv.parentElement) {
            warningDiv.style.animation = 'slideDownFadeOut 0.4s ease';
            setTimeout(() => warningDiv.remove(), 400);
        }
    }, 5000);
}

function markStepAsIncomplete(stepNumber) {
    const progressStep = document.querySelector(`.progress-step[data-step="${stepNumber}"]`);
    if (progressStep) {
        progressStep.classList.add('incomplete');
        progressStep.classList.remove('completed');
        
        // Add warning icon
        let warningIcon = progressStep.querySelector('.warning-icon');
        if (!warningIcon) {
            warningIcon = document.createElement('i');
            warningIcon.className = 'fas fa-exclamation-circle warning-icon';
            warningIcon.style.cssText = `
                position: absolute;
                top: -4px;
                right: -4px;
                color: #FFA500;
                background: white;
                border-radius: 50%;
                font-size: 14px;
            `;
            progressStep.style.position = 'relative';
            progressStep.appendChild(warningIcon);
        }
    }
}

function markStepAsComplete(stepNumber) {
    const progressStep = document.querySelector(`.progress-step[data-step="${stepNumber}"]`);
    if (progressStep) {
        progressStep.classList.remove('incomplete');
        progressStep.classList.add('completed');
        
        // Remove warning icon
        const warningIcon = progressStep.querySelector('.warning-icon');
        if (warningIcon) {
            warningIcon.remove();
        }
    }
}

function showFinalValidationWarning() {
    // Check all steps for incomplete fields
    const allIncompleteSteps = [];
    
    for (let step = 1; step <= totalSteps; step++) {
        const stepElement = document.querySelector(`[data-step="${step}"]`);
        if (!stepElement) continue;
        
        const requiredFields = stepElement.querySelectorAll('[required]');
        const missingFields = [];
        
        requiredFields.forEach(field => {
            const isHidden = field.closest('.form-group')?.style.display === 'none';
            if (!isHidden && !validateFieldSilent(field)) {
                missingFields.push(getFieldLabel(field));
            }
        });
        
        if (missingFields.length > 0) {
            allIncompleteSteps.push({
                step: step,
                fields: missingFields
            });
        }
    }
    
    if (allIncompleteSteps.length === 0) return;
    
    // Show comprehensive warning
    const warningDiv = document.createElement('div');
    warningDiv.className = 'final-validation-warning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 90%;
        width: 400px;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    let stepsHTML = '';
    allIncompleteSteps.forEach(item => {
        const fieldsList = item.fields.slice(0, 5).map(f => `<li>${f}</li>`).join('');
        const moreCount = item.fields.length > 5 ? `<li style="color: #999;">+ ${item.fields.length - 5} more fields</li>` : '';
        stepsHTML += `
            <div style="margin-bottom: 16px; padding: 12px; background: #FFF3E0; border-radius: 8px;">
                <div style="font-weight: 600; color: #F57C00; margin-bottom: 8px;">
                    <i class="fas fa-exclamation-triangle"></i> Step ${item.step} - ${item.fields.length} field(s) missing
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #666;">
                    ${fieldsList}${moreCount}
                </ul>
            </div>
        `;
    });
    
    warningDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <i class="fas fa-clipboard-check" style="font-size: 48px; color: #FFA500;"></i>
            <h3 style="margin: 12px 0 8px 0; color: #333;">Review Required Fields</h3>
            <p style="color: #666; font-size: 14px; margin: 0;">Please complete the following fields before submitting</p>
        </div>
        
        ${stepsHTML}
        
        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button onclick="this.closest('.final-validation-warning').remove()" 
                    style="flex: 1; padding: 12px; background: white; border: 2px solid #2ECC71; color: #2ECC71; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Review Later
            </button>
            <button onclick="goToFirstIncompleteStep(); this.closest('.final-validation-warning').remove();" 
                    style="flex: 1; padding: 12px; background: #2ECC71; border: none; color: white; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Go to First Step
            </button>
        </div>
    `;
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    backdrop.onclick = () => {
        backdrop.remove();
        warningDiv.remove();
    };
    
    document.body.appendChild(backdrop);
    document.body.appendChild(warningDiv);
}

function goToFirstIncompleteStep() {
    for (let step = 1; step <= totalSteps; step++) {
        const progressStep = document.querySelector(`.progress-step[data-step="${step}"]`);
        if (progressStep && progressStep.classList.contains('incomplete')) {
            hideStep(currentStep);
            currentStep = step;
            showStep(currentStep);
            updateProgressBar();
            break;
        }
    }
}

// Add CSS animations for toasts
const toastAnimations = `
<style>
@keyframes slideUpFadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@keyframes slideDownFadeOut {
    from {
        opacity: 1;
        transform: translate(-50%, 0);
    }
    to {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
}

.progress-step.incomplete .progress-circle {
    border-color: #FFA500 !important;
    background: #FFF3E0 !important;
}

.progress-step.incomplete .progress-label {
    color: #F57C00 !important;
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .incomplete-warning-toast {
        bottom: 60px !important;
        font-size: 13px !important;
        padding: 14px 18px !important;
        min-width: 260px !important;
    }
    
    .final-validation-warning {
        width: 95% !important;
        padding: 20px !important;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', toastAnimations);

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
const totalSteps = 6;

function initMultiStepForm() {
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', handleNextStep);
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', handlePrevStep);
    });
}

function handleNextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            hideStep(currentStep);
            currentStep++;
            showStep(currentStep);
            updateProgressBar();
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
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"].active`);
    if (!currentStepElement) return false;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
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

.review-item .value {
    font-weight: 400;
    color: var(--cinza-medio);
    font-size: 13px;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
/**
 * FLEXCREDI - Document Upload System
 * Handles file uploads, camera capture, drag & drop, and validation
 */

(function() {
    'use strict';
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    // Storage for uploaded files
    const uploadedFiles = {
        id_document: null,
        proof_residence: null,
        card_front: null,
        card_back: null
    };
    
    /**
     * Initialize document upload system
     */
    function initializeDocumentUpload() {
        console.log('📤 Document Upload System: Initializing...');
        
        // Setup file inputs
        setupFileInput('id_document', 'id');
        setupFileInput('proof_residence', 'residence');
        setupFileInput('card_front', 'card-front');
        setupFileInput('card_back', 'card-back');
        
        // Setup camera buttons (mobile)
        setupCameraButton('id-camera-btn', 'id_document');
        setupCameraButton('residence-camera-btn', 'proof_residence');
        setupCameraButton('card-front-camera-btn', 'card_front');
        setupCameraButton('card-back-camera-btn', 'card_back');
        
        // Setup drag & drop
        setupDragAndDrop('id-upload-area', 'id_document');
        setupDragAndDrop('residence-upload-area', 'proof_residence');
        setupDragAndDrop('card-front-upload-area', 'card_front');
        setupDragAndDrop('card-back-upload-area', 'card_back');
        
        console.log('✅ Document Upload System: Ready!');
    }
    
    /**
     * Setup file input handler
     */
    function setupFileInput(inputId, previewPrefix) {
        const input = document.getElementById(inputId);
        if (!input) {
            console.warn(`⚠️ Input not found: ${inputId}`);
            return;
        }
        
        // Check if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // On mobile, set capture attribute to open camera directly
        if (isMobile) {
            input.setAttribute('capture', 'environment');
            input.setAttribute('accept', 'image/*');
        }
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file, inputId, previewPrefix);
            }
        });
    }
    
    /**
     * Setup camera button for mobile
     */
    function setupCameraButton(buttonId, inputId) {
        const button = document.getElementById(buttonId);
        const input = document.getElementById(inputId);
        
        if (!button || !input) return;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Set input to accept only camera on mobile
            input.setAttribute('capture', 'environment');
            input.setAttribute('accept', 'image/*');
            input.click();
        });
    }
    
    /**
     * Setup drag and drop
     */
    function setupDragAndDrop(areaId, inputId) {
        const area = document.getElementById(areaId);
        if (!area) return;
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop area
        ['dragenter', 'dragover'].forEach(eventName => {
            area.addEventListener(eventName, () => {
                area.classList.add('drag-over');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, () => {
                area.classList.remove('drag-over');
            }, false);
        });
        
        // Handle drop
        area.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                const file = files[0];
                const previewPrefix = areaId.replace('-upload-area', '');
                handleFileUpload(file, inputId, previewPrefix);
            }
        }, false);
    }
    
    /**
     * Prevent default behaviors
     */
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * Handle file upload
     */
    function handleFileUpload(file, inputId, previewPrefix) {
        console.log('📁 File selected:', file.name, file.type, file.size);
        
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            showError(inputId, validation.error);
            return;
        }
        
        // Clear any previous errors
        clearError(inputId);
        
        // Store file
        uploadedFiles[inputId] = file;
        
        // Show preview
        showPreview(file, previewPrefix, inputId);
        
        // Mark upload area as uploaded
        const uploadArea = document.getElementById(`${previewPrefix}-upload-area`);
        if (uploadArea) {
            uploadArea.classList.add('uploaded');
            uploadArea.classList.remove('error');
        }
        
        console.log('✅ File uploaded successfully:', file.name);
    }
    
    /**
     * Validate file
     */
    function validateFile(file) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`
            };
        }
        
        // Check file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: `Invalid file type. Allowed: JPG, PNG, PDF`
            };
        }
        
        return { valid: true };
    }
    
    /**
     * Show file preview
     */
    function showPreview(file, previewPrefix, inputId) {
        const previewDiv = document.getElementById(`${previewPrefix}-preview`);
        if (!previewDiv) return;
        
        previewDiv.classList.add('active');
        previewDiv.innerHTML = '';
        
        // If image, show preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';
                img.alt = 'Document preview';
                previewDiv.appendChild(img);
                
                // Add file info below image
                previewDiv.appendChild(createFileInfo(file, inputId));
            };
            reader.readAsDataURL(file);
        } else {
            // PDF - just show file info
            previewDiv.appendChild(createPDFIcon());
            previewDiv.appendChild(createFileInfo(file, inputId));
        }
    }
    
    /**
     * Create PDF icon
     */
    function createPDFIcon() {
        const iconDiv = document.createElement('div');
        iconDiv.style.fontSize = '48px';
        iconDiv.style.color = '#dc3545';
        iconDiv.style.marginBottom = '10px';
        iconDiv.innerHTML = '<i class="fas fa-file-pdf"></i>';
        return iconDiv;
    }
    
    /**
     * Create file info display
     */
    function createFileInfo(file, inputId) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'preview-info';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('span');
        fileSize.className = 'file-size';
        fileSize.textContent = formatFileSize(file.size);
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove-file';
        removeBtn.innerHTML = '<i class="fas fa-times"></i> Remove';
        removeBtn.onclick = function() {
            removeFile(inputId);
        };
        
        infoDiv.appendChild(fileName);
        infoDiv.appendChild(fileSize);
        infoDiv.appendChild(removeBtn);
        
        return infoDiv;
    }
    
    /**
     * Format file size
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    /**
     * Remove uploaded file
     */
    function removeFile(inputId) {
        console.log('🗑️ Removing file:', inputId);
        
        // Clear stored file
        uploadedFiles[inputId] = null;
        
        // Clear file input
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
        }
        
        // Hide preview
        const previewPrefix = inputId.replace('_', '-');
        const previewDiv = document.getElementById(`${previewPrefix}-preview`);
        if (previewDiv) {
            previewDiv.classList.remove('active');
            previewDiv.innerHTML = '';
        }
        
        // Remove uploaded class from upload area
        const uploadArea = document.getElementById(`${previewPrefix}-upload-area`);
        if (uploadArea) {
            uploadArea.classList.remove('uploaded');
        }
        
        console.log('✅ File removed');
    }
    
    /**
     * Show error message
     */
    function showError(inputId, message) {
        const errorDiv = document.getElementById(`${inputId}-error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        
        // Mark upload area as error
        const previewPrefix = inputId.replace('_', '-');
        const uploadArea = document.getElementById(`${previewPrefix}-upload-area`);
        if (uploadArea) {
            uploadArea.classList.add('error');
            uploadArea.classList.remove('uploaded');
        }
        
        console.error('❌ Upload error:', message);
    }
    
    /**
     * Clear error message
     */
    function clearError(inputId) {
        const errorDiv = document.getElementById(`${inputId}-error`);
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }
    
    /**
     * Get uploaded files (for form submission)
     */
    function getUploadedFiles() {
        return uploadedFiles;
    }
    
    /**
     * Validate all required documents uploaded
     */
    function validateAllDocuments() {
        const errors = [];
        
        if (!uploadedFiles.id_document) {
            errors.push('ID Document is required');
        }
        
        if (!uploadedFiles.proof_residence) {
            errors.push('Proof of Residence is required');
        }
        
        if (!uploadedFiles.card_front) {
            errors.push('Debit Card Front is required');
        }
        
        if (!uploadedFiles.card_back) {
            errors.push('Debit Card Back is required');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDocumentUpload);
    } else {
        initializeDocumentUpload();
    }
    
    // Export functions for external use
    window.DocumentUpload = {
        getUploadedFiles: getUploadedFiles,
        validateAllDocuments: validateAllDocuments,
        removeFile: removeFile
    };
    
})();

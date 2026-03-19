/**
 * FLEXCREDI - Home Multi-Step Application Form
 * Complete credit application form embedded in home page
 * Same behavior as aplicacao.html - allows free navigation between steps
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Home Multi-Step Form: Initializing...');
    
    // Form elements
    const form = document.getElementById('form-simulacao-rapida');
    if (!form) {
        console.error('❌ Form not found!');
        return;
    }

    console.log('✅ Form found:', form.id);

    let currentStep = 1;
    const totalSteps = 4;
    
    // Check if returning from legal pages
    const savedStep = localStorage.getItem('flexcredi_return_step');
    const timestamp = localStorage.getItem('flexcredi_return_timestamp');
    
    if (savedStep && timestamp) {
        const elapsed = Date.now() - parseInt(timestamp);
        const fiveMinutes = 5 * 60 * 1000; // Extended to 5 minutes
        
        if (elapsed < fiveMinutes) {
            currentStep = parseInt(savedStep);
            console.log('🔙 Returning from legal page to step:', currentStep, '(elapsed:', Math.round(elapsed/1000), 'seconds)');
            
            // Check if legal documents were accepted and auto-check the checkbox
            const termsAccepted = localStorage.getItem('flexcredi_terms_accepted');
            const privacyAccepted = localStorage.getItem('flexcredi_privacy_accepted');
            
            if (termsAccepted === 'true' || privacyAccepted === 'true') {
                console.log('✅ Legal documents accepted - will auto-check checkbox');
                
                // Wait for DOM to be ready, then check the checkbox
                setTimeout(() => {
                    const checkbox = document.getElementById('aceita-politica');
                    if (checkbox && !checkbox.checked) {
                        checkbox.checked = true;
                        console.log('✅ Checkbox auto-checked');
                        
                        // Trigger change event to ensure validation updates
                        const event = new Event('change', { bubbles: true });
                        checkbox.dispatchEvent(event);
                        
                        // Clear the error if any
                        const errorDiv = document.getElementById('politica-error');
                        if (errorDiv) {
                            errorDiv.textContent = '';
                            errorDiv.style.display = 'none';
                        }
                    }
                    
                    // Clear the acceptance flags after using them (don't persist)
                    localStorage.removeItem('flexcredi_terms_accepted');
                    localStorage.removeItem('flexcredi_terms_accepted_date');
                    localStorage.removeItem('flexcredi_privacy_accepted');
                    localStorage.removeItem('flexcredi_privacy_accepted_date');
                    console.log('🧹 Cleared acceptance flags from localStorage');
                }, 600);
            }
            
            // Scroll to form section after short delay
            setTimeout(() => {
                const formSection = document.getElementById('simulacao-rapida');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    console.log('📍 Scrolled to form section');
                }
            }, 500);
        } else {
            console.log('⏱️ Saved step expired (', Math.round(elapsed/1000), 'seconds old), starting from Step 1');
        }
        
        // Clear after reading (or if expired)
        localStorage.removeItem('flexcredi_return_step');
        localStorage.removeItem('flexcredi_return_timestamp');
        localStorage.removeItem('flexcredi_return_url');
    }

    // Date input mask for dd/mm/yyyy format (iPhone/Safari compatible)
    function initializeDateMask() {
        const dobInput = document.getElementById('dob');
        if (!dobInput) return;

        console.log('📅 Initializing date mask for DOB field');

        dobInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            if (value.length >= 5) {
                value = value.substring(0, 5) + '/' + value.substring(5, 9);
            }
            
            e.target.value = value;
        });

        // Validate on blur
        dobInput.addEventListener('blur', function(e) {
            const value = e.target.value;
            const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            const match = value.match(regex);
            
            if (match && value.length === 10) {
                const day = parseInt(match[1]);
                const month = parseInt(match[2]);
                const year = parseInt(match[3]);
                
                // Basic validation
                if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
                    e.target.classList.add('error');
                    const errorDiv = document.getElementById('dob-error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Invalid date';
                        errorDiv.style.display = 'block';
                    }
                } else {
                    e.target.classList.remove('error');
                    const errorDiv = document.getElementById('dob-error');
                    if (errorDiv) {
                        errorDiv.style.display = 'none';
                    }
                }
            } else if (value.length > 0) {
                e.target.classList.add('error');
                const errorDiv = document.getElementById('dob-error');
                if (errorDiv) {
                    errorDiv.textContent = 'Use format: dd/mm/yyyy';
                    errorDiv.style.display = 'block';
                }
            }
        });

        console.log('✅ Date mask initialized');
    }

    // Initialize: Show only first step (or saved step)
    function initializeForm() {
        console.log('🔧 Initializing form display...');
        
        const allSteps = form.querySelectorAll('.form-step');
        allSteps.forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum === currentStep) {
                step.classList.add('active');
                step.style.display = 'block';
            } else {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        });
        
        updateProgressBar(currentStep);
        updateNavigationButtons(currentStep);
        console.log(`✅ Form initialized - showing Step ${currentStep}`);
    }

    // Step navigation
    function showStep(stepNumber) {
        console.log('📍 Navigating to step:', stepNumber);
        
        // Hide all steps
        const allSteps = form.querySelectorAll('.form-step');
        allSteps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });

        // Show current step
        const currentStepEl = form.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
            currentStepEl.style.display = 'block';
            console.log('✅ Showing step', stepNumber);
        } else {
            console.error('❌ Step not found:', stepNumber);
        }

        // Update progress bar
        updateProgressBar(stepNumber);

        // Update navigation buttons
        updateNavigationButtons(stepNumber);

        // Scroll to form section
        const formSection = document.getElementById('simulacao-rapida');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Update review if on step 4
        if (stepNumber === totalSteps) {
            populateReviewData();
        }
    }

    function updateProgressBar(stepNumber) {
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            
            step.classList.remove('active', 'completed');
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
            }
        });
        console.log('📊 Progress bar updated for step', stepNumber);
    }

    function updateNavigationButtons(stepNumber) {
        // Find all navigation buttons
        const allPrevButtons = form.querySelectorAll('.btn-prev');
        const allNextButtons = form.querySelectorAll('.btn-next');
        const allSubmitButtons = form.querySelectorAll('.btn-submit');

        // Update Previous buttons
        allPrevButtons.forEach(btn => {
            if (stepNumber === 1) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'inline-block';
            }
        });

        // Update Next buttons
        allNextButtons.forEach(btn => {
            if (stepNumber === totalSteps) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'inline-block';
            }
        });

        // Update Submit buttons
        allSubmitButtons.forEach(btn => {
            if (stepNumber === totalSteps) {
                btn.style.display = 'inline-block';
            } else {
                btn.style.display = 'none';
            }
        });
        
        console.log('🔘 Navigation buttons updated for step', stepNumber);
    }

    // Setup Next buttons - FORCED navigation without validation
    const nextButtons = form.querySelectorAll('.btn-next');
    console.log('🔧 Found', nextButtons.length, 'Next buttons');
    
    nextButtons.forEach((btn, idx) => {
        console.log('🔧 Attaching handler to Next button', idx + 1);
        
        // Clone to remove any existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('➡️ Next clicked! Current step:', currentStep);
            
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                console.log('✅ Moved to step', currentStep);
            }
        });
    });

    // Setup Previous buttons
    const prevButtons = form.querySelectorAll('.btn-prev');
    console.log('🔧 Found', prevButtons.length, 'Previous buttons');
    
    prevButtons.forEach((btn, idx) => {
        console.log('🔧 Attaching handler to Previous button', idx + 1);
        
        // Clone to remove any existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('⬅️ Previous clicked! Current step:', currentStep);
            
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
                console.log('✅ Moved to step', currentStep);
            }
        });
    });

    // Populate review data
    function populateReviewData() {
        console.log('📋 Populating review data...');
        
        const reviewFields = {
            'review_full_name': `${getFieldValue('first_name')} ${getFieldValue('last_name')}`,
            'review_email': getFieldValue('email'),
            'review_cell_phone': getFieldValue('telefone'),
            'review_dob': getFieldValue('dob'),
            'review_ssn': getFieldValue('ssn') || getFieldValue('alt_doc_number'),
            'review_address': getFieldValue('address'),
            'review_city': getFieldValue('city'),
            'review_state': getFieldValue('state'),
            'review_zip': getFieldValue('zipcode'),
            'review_housing_type': getSelectedText('housing_type'),
            'review_payment_amount': formatCurrency(getFieldValue('payment_amount')),
            'review_employer': getFieldValue('employer_name'),
            'review_title': getFieldValue('job_title'),
            'review_monthly_income': formatCurrency(getFieldValue('monthly_income')),
            'review_bank_name': getSelectedText('bank_name'),
            'review_credit_amount': getFieldValue('valor'),
            'review_credit_purpose': getSelectedText('proposito')
        };

        Object.keys(reviewFields).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = reviewFields[key] || '-';
            }
        });
        
        console.log('✅ Review data populated');
    }

    // Helper functions
    function getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value.trim() : '';
    }

    function getSelectedText(selectId) {
        const select = document.getElementById(selectId);
        if (select && select.selectedIndex >= 0) {
            return select.options[select.selectedIndex].text;
        }
        return '';
    }

    function formatCurrency(value) {
        if (!value) return '';
        const num = parseFloat(value.replace(/[^0-9.-]/g, ''));
        if (isNaN(num)) return value;
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Form submission - NO VALIDATION
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📤 Form submitted!');

        // Collect all form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('📦 Form data collected:', data);

        // Save to localStorage
        localStorage.setItem('flexcredi_application_data', JSON.stringify(data));
        localStorage.setItem('flexcredi_application_date', new Date().toISOString());
        console.log('💾 Data saved to localStorage');

        // Show success message
        showSuccessMessage();
    });

    // Show success message
    function showSuccessMessage() {
        console.log('🎉 Showing success modal...');
        
        const userEmail = getFieldValue('email') || 'your registered email';
        
        const modalHTML = `
            <div class="modal fade show" id="successModal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-check-circle"></i> 
                                <span data-translate="Application Submitted Successfully!">Application Submitted Successfully!</span>
                            </h5>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="fas fa-check-circle text-success" style="font-size: 64px; margin-bottom: 20px;"></i>
                            <h4 data-translate="Thank you for your application!">Thank you for your application!</h4>
                            <p data-translate="We have received your credit application">We have received your credit application.</p>
                            <p data-translate="Our team will review your information">Our team will review your information and contact you within 24-48 hours.</p>
                            <hr>
                            <p class="text-muted mb-0">
                                <small>
                                    <i class="fas fa-envelope"></i> 
                                    <span data-translate="Check your email">Check your email</span>: <strong>${userEmail}</strong>
                                </small>
                            </p>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-success" onclick="closeSuccessModal()">
                                <i class="fas fa-home"></i> 
                                <span data-translate="Back to Home">Back to Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Apply translations to modal
        if (window.TranslationEngine && window.TranslationEngine.translatePage) {
            window.TranslationEngine.translatePage();
        }
        
        console.log('✅ Success modal displayed');
    }

    // Initialize form on load
    initializeForm();
    initializeDateMask();
    console.log('🚀 Home Multi-Step Form: Ready!');
});

// Close success modal (global function)
function closeSuccessModal() {
    console.log('🔄 Closing success modal and resetting form...');
    
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reload page to reset form state
    setTimeout(() => {
        location.reload();
    }, 500);
}

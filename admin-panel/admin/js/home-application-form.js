/**
 * FLEXCREDI - Home Application Form (Multi-Step)
 * Transforms the simple quick form into a full multi-step application
 * All functionality happens on the home page without redirect
 */

(function() {
    'use strict';
    
    console.log('🚀 Home Application Form - Initializing...');
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        
        // Find the form
        const form = document.getElementById('form-simulacao-rapida');
        if (!form) {
            console.error('❌ Form not found');
            return;
        }
        
        console.log('✅ Form found, transforming to multi-step...');
        
        // Create the complete multi-step form HTML
        const multiStepFormHTML = `
            <!-- Progress Bar -->
            <div class="application-progress-bar" style="margin-bottom: 30px;">
                <div class="progress-steps">
                    <div class="progress-step active" data-step="1">
                        <div class="step-circle">1</div>
                        <div class="step-label">Personal</div>
                    </div>
                    <div class="progress-step" data-step="2">
                        <div class="step-circle">2</div>
                        <div class="step-label">Housing</div>
                    </div>
                    <div class="progress-step" data-step="3">
                        <div class="step-circle">3</div>
                        <div class="step-label">Bank</div>
                    </div>
                    <div class="progress-step" data-step="4">
                        <div class="step-circle">4</div>
                        <div class="step-label">Review</div>
                    </div>
                </div>
            </div>
            
            <!-- Step 1: Personal Information -->
            <div class="form-step active" data-step="1">
                <h4 style="margin-bottom: 20px; color: #2ecc71;">
                    <i class="fas fa-user"></i> Personal Information
                </h4>
                
                <div class="form-group">
                    <input type="text" id="first_name" name="first_name" class="form-control" required 
                           placeholder="First Name *">
                </div>
                
                <div class="form-group">
                    <input type="text" id="last_name" name="last_name" class="form-control" required 
                           placeholder="Last Name *">
                </div>
                
                <div class="form-group">
                    <input type="email" id="email" name="email" class="form-control" required 
                           placeholder="Email *">
                </div>
                
                <div class="form-group">
                    <input type="tel" id="cell_phone" name="cell_phone" class="form-control" required 
                           placeholder="Cell Phone *" maxlength="14">
                </div>
                
                <div class="form-group">
                    <input type="text" id="date_of_birth" name="date_of_birth" class="form-control" required 
                           placeholder="Date of Birth (MM/DD/YYYY)" maxlength="10">
                </div>
                
                <div class="form-group">
                    <input type="text" id="ssn" name="ssn" class="form-control" required 
                           placeholder="Social Security Number" maxlength="11">
                    <div style="margin-top: 10px;">
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="no_ssn" style="cursor: pointer;">
                            <span>I don't have a SSN or ITIN</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <input type="text" id="street_address" name="street_address" class="form-control" required 
                           placeholder="Street Address *">
                </div>
                
                <div class="row">
                    <div class="col-6">
                        <div class="form-group">
                            <input type="text" id="city" name="city" class="form-control" required 
                                   placeholder="City *">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <input type="text" id="zip_code" name="zip_code" class="form-control" required 
                                   placeholder="ZIP Code *" maxlength="5">
                        </div>
                    </div>
                </div>
                
                <div class="form-navigation">
                    <button type="button" class="btn btn-primary btn-next btn-block">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            
            <!-- Step 2: Housing & Employment -->
            <div class="form-step" data-step="2" style="display: none;">
                <h4 style="margin-bottom: 20px; color: #2ecc71;">
                    <i class="fas fa-home"></i> Housing & Employment
                </h4>
                
                <div class="form-group">
                    <select id="housing_type" name="housing_type" class="form-control" required>
                        <option value="">Housing Type *</option>
                        <option value="own">Own</option>
                        <option value="rent">Rent</option>
                        <option value="living_with_family">Living with Family</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <input type="number" id="monthly_rent" name="monthly_rent" class="form-control" required 
                           placeholder="Monthly Payment Amount * ($)" min="0" step="0.01">
                </div>
                
                <div class="form-group">
                    <input type="text" id="employer_name" name="employer_name" class="form-control" required 
                           placeholder="Employer Name *">
                </div>
                
                <div class="form-group">
                    <input type="text" id="job_title" name="job_title" class="form-control" required 
                           placeholder="Job Title *">
                </div>
                
                <div class="form-group">
                    <input type="number" id="monthly_income" name="monthly_income" class="form-control" required 
                           placeholder="Monthly Gross Income * ($)" min="0" step="0.01">
                </div>
                
                <div class="form-navigation" style="display: flex; gap: 10px;">
                    <button type="button" class="btn btn-secondary btn-prev" style="flex: 1;">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button type="button" class="btn btn-primary btn-next" style="flex: 1;">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            
            <!-- Step 3: Bank Information -->
            <div class="form-step" data-step="3" style="display: none;">
                <h4 style="margin-bottom: 20px; color: #2ecc71;">
                    <i class="fas fa-university"></i> Bank Information
                </h4>
                
                <div class="form-group">
                    <select id="bank_name" name="bank_name" class="form-control" required>
                        <option value="">Select Bank *</option>
                        <option value="bofa">Bank of America</option>
                        <option value="chase">Chase</option>
                        <option value="wells">Wells Fargo</option>
                        <option value="citi">Citibank</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <input type="text" id="routing_number" name="routing_number" class="form-control" required 
                           placeholder="Routing Number * (9 digits)" maxlength="9">
                </div>
                
                <div class="form-group">
                    <input type="text" id="account_number" name="account_number" class="form-control" required 
                           placeholder="Account Number *">
                </div>
                
                <div class="form-group">
                    <select id="desired_amount" name="desired_amount" class="form-control" required>
                        <option value="">Desired Loan Amount *</option>
                        <option value="1000">$1,000</option>
                        <option value="2500">$2,500</option>
                        <option value="5000">$5,000</option>
                        <option value="7500">$7,500</option>
                        <option value="10000">$10,000</option>
                        <option value="15000">$15,000</option>
                        <option value="20000">$20,000</option>
                        <option value="25000">$25,000+</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <select id="loan_purpose" name="loan_purpose" class="form-control" required>
                        <option value="">Purpose of Loan *</option>
                        <option value="debt_consolidation">Debt Consolidation</option>
                        <option value="home_improvement">Home Improvement</option>
                        <option value="business">Business Investment</option>
                        <option value="emergency">Emergency/Medical</option>
                        <option value="education">Education</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-navigation" style="display: flex; gap: 10px;">
                    <button type="button" class="btn btn-secondary btn-prev" style="flex: 1;">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button type="button" class="btn btn-primary btn-next" style="flex: 1;">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            
            <!-- Step 4: Review & Submit -->
            <div class="form-step" data-step="4" style="display: none;">
                <h4 style="margin-bottom: 20px; color: #2ecc71;">
                    <i class="fas fa-check-circle"></i> Review & Submit
                </h4>
                
                <div id="review-summary" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Please review your information:</strong></p>
                    <div id="review-content"></div>
                </div>
                
                <div class="form-group">
                    <label style="display: flex; align-items: start; gap: 10px; font-size: 13px; cursor: pointer;">
                        <input type="checkbox" id="accept_terms" required style="cursor: pointer; margin-top: 3px;">
                        <span>
                            I certify that all information provided is true and accurate. 
                            I have read and agree to the 
                            <a href="termos-uso.html" target="_blank">Terms of Use</a> and 
                            <a href="politica-privacidade.html" target="_blank">Privacy Policy</a>.
                        </span>
                    </label>
                </div>
                
                <div class="form-navigation" style="display: flex; gap: 10px;">
                    <button type="button" class="btn btn-secondary btn-prev" style="flex: 1;">
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button type="submit" class="btn btn-success" style="flex: 1;">
                        <i class="fas fa-paper-plane"></i> Submit Application
                    </button>
                </div>
            </div>
        `;
        
        // Replace form content
        form.innerHTML = multiStepFormHTML;
        
        console.log('✅ Multi-step form HTML injected');
        
        // Initialize multi-step functionality
        initMultiStepForm();
    });
    
    /**
     * Initialize multi-step form functionality
     */
    function initMultiStepForm() {
        const form = document.getElementById('form-simulacao-rapida');
        let currentStep = 1;
        const totalSteps = 4;
        
        // Get all step elements
        const steps = form.querySelectorAll('.form-step');
        const progressSteps = document.querySelectorAll('.progress-step');
        const nextButtons = form.querySelectorAll('.btn-next');
        const prevButtons = form.querySelectorAll('.btn-prev');
        
        console.log('✅ Steps found:', steps.length);
        console.log('✅ Next buttons found:', nextButtons.length);
        console.log('✅ Prev buttons found:', prevButtons.length);
        
        // Next button click handlers
        nextButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('➡️ Next button clicked, current step:', currentStep);
                if (validateStep(currentStep)) {
                    if (currentStep < totalSteps) {
                        goToStep(currentStep + 1);
                    }
                }
            });
        });
        
        // Previous button click handlers
        prevButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('⬅️ Previous button clicked, current step:', currentStep);
                if (currentStep > 1) {
                    goToStep(currentStep - 1);
                }
            });
        });
        
        // Form submit handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📤 Form submitted');
            
            if (!validateStep(currentStep)) {
                console.log('❌ Step 4 validation failed');
                return;
            }
            
            submitApplication();
        });
        
        /**
         * Navigate to a specific step
         */
        function goToStep(stepNumber) {
            console.log(`🔄 Going to step ${stepNumber}`);
            
            // Hide all steps
            steps.forEach(step => {
                step.style.display = 'none';
                step.classList.remove('active');
            });
            
            // Show target step
            const targetStep = form.querySelector(`.form-step[data-step="${stepNumber}"]`);
            if (targetStep) {
                targetStep.style.display = 'block';
                targetStep.classList.add('active');
            }
            
            // Update progress bar
            progressSteps.forEach((step, index) => {
                if (index < stepNumber) {
                    step.classList.add('completed');
                    step.classList.remove('active');
                } else if (index === stepNumber - 1) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
            
            // Update current step
            currentStep = stepNumber;
            
            // If step 4, populate review
            if (currentStep === 4) {
                populateReview();
            }
            
            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        /**
         * Validate current step
         */
        function validateStep(stepNumber) {
            console.log(`✔️ Validating step ${stepNumber}`);
            const currentStepEl = form.querySelector(`.form-step[data-step="${stepNumber}"]`);
            const requiredFields = currentStepEl.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                    console.log(`❌ Field empty: ${field.name || field.id}`);
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
            }
            
            return isValid;
        }
        
        /**
         * Populate review section
         */
        function populateReview() {
            const reviewContent = document.getElementById('review-content');
            const formData = new FormData(form);
            
            let html = '<ul style="list-style: none; padding: 0; margin: 0;">';
            html += `<li><strong>Name:</strong> ${formData.get('first_name')} ${formData.get('last_name')}</li>`;
            html += `<li><strong>Email:</strong> ${formData.get('email')}</li>`;
            html += `<li><strong>Phone:</strong> ${formData.get('cell_phone')}</li>`;
            html += `<li><strong>Address:</strong> ${formData.get('street_address')}, ${formData.get('city')}, ${formData.get('zip_code')}</li>`;
            html += `<li><strong>Housing:</strong> ${formData.get('housing_type')}</li>`;
            html += `<li><strong>Employer:</strong> ${formData.get('employer_name')}</li>`;
            html += `<li><strong>Income:</strong> $${formData.get('monthly_income')}</li>`;
            html += `<li><strong>Bank:</strong> ${formData.get('bank_name')}</li>`;
            html += `<li><strong>Loan Amount:</strong> $${formData.get('desired_amount')}</li>`;
            html += `<li><strong>Purpose:</strong> ${formData.get('loan_purpose')}</li>`;
            html += '</ul>';
            
            reviewContent.innerHTML = html;
        }
        
        /**
         * Submit application
         */
        function submitApplication() {
            console.log('🚀 Submitting application...');
            
            // Show loading
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            console.log('📝 Form data:', data);
            
            // Simulate submission (replace with actual API call)
            setTimeout(() => {
                console.log('✅ Application submitted successfully');
                
                // Show success message
                showSuccessMessage();
                
                // Reset form
                form.reset();
                goToStep(1);
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
            }, 2000);
        }
        
        /**
         * Show success message
         */
        function showSuccessMessage() {
            const successHTML = `
                <div style="background: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
                    <i class="fas fa-check-circle" style="font-size: 60px; color: #28a745; margin-bottom: 20px;"></i>
                    <h3 style="color: #155724; margin-bottom: 15px;">Application Submitted Successfully!</h3>
                    <p style="color: #155724; margin-bottom: 20px;">
                        Thank you for applying with FLEXCREDI. <br>
                        Our team will review your application and contact you within 24-48 hours.
                    </p>
                    <p style="color: #155724; font-size: 14px;">
                        <strong>Reference Number:</strong> #${Date.now().toString().slice(-8)}
                    </p>
                    <button onclick="location.reload()" class="btn btn-success" style="margin-top: 20px;">
                        <i class="fas fa-home"></i> Back to Home
                    </button>
                </div>
            `;
            
            form.innerHTML = successHTML;
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    console.log('✅ Home Application Form - Module loaded');
})();

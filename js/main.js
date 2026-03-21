/**
 * FLEXCREDI - JavaScript Principal
 * Funcionalidades de interatividade e validação para o site
 */

// ========== INICIALIZAÇÃO ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('FLEXCREDI - Sistema carregado');
    
    // Inicializar componentes essenciais sempre
    initLanguageSelector();
    
    // Inicializar componentes opcionais (apenas se os elementos existirem)
    if (document.getElementById('mobile-menu-toggle')) {
        initMobileMenu();
    }
    
    if (document.querySelector('form')) {
        initFormValidation();
    }
    
    if (document.getElementById('custom-slider')) {
        initValueSlider();
    }
    
    if (document.getElementById('zipcode')) {
        initZipCodeLookup();
    }
    
    // Inicializar máscaras de entrada
    initInputMasks();
    
    if (document.querySelector('.animate-fade-in')) {
        initScrollAnimations();
    }
    
    if (document.querySelector('a[href^="#"]')) {
        initSmoothScroll();
    }
    
    if (document.querySelector('.loan-calculator')) {
        initLoanCalculator();
    }
    
    if (document.querySelector('.hero-carousel')) {
        initHeroCarousel();
    }
    
    // Marcar página atual no menu
    if (document.querySelector('.navbar-nav')) {
        setActiveNavItem();
    }
});

// ========== MENU MOBILE ========== //
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('navbar-nav');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Mudar ícone do menu
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
                this.setAttribute('aria-label', 'Fechar menu mobile');
            } else {
                icon.className = 'fas fa-bars';
                this.setAttribute('aria-label', 'Abrir menu mobile');
            }
        });
        
        // Fechar menu quando clicar em um link
        navMenu.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fas fa-bars';
                mobileToggle.setAttribute('aria-label', 'Abrir menu mobile');
            }
        });
    }
}

// ========== NAVEGAÇÃO ATIVA ========== //
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.endsWith(href) || (href === 'index.html' && currentPath === '/'))) {
            link.classList.add('active');
        }
    });
}

// ========== SCROLL SUAVE ========== //
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== ANIMAÇÕES DE SCROLL ========== //
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem animar
    document.querySelectorAll('.card, .section').forEach(el => {
        observer.observe(el);
    });
}

// ========== SLIDER DE VALOR CUSTOMIZADO ========== //
function initValueSlider() {
    const customSlider = document.getElementById('custom-slider');
    const hiddenInput = document.getElementById('valor-range');
    const valueInput = document.getElementById('valor');
    const sliderFill = document.getElementById('slider-fill');
    const sliderThumb = document.getElementById('slider-thumb');
    
    if (customSlider && valueInput && sliderFill && sliderThumb) {
        const min = parseInt(customSlider.dataset.min);
        const max = parseInt(customSlider.dataset.max);
        const step = parseInt(customSlider.dataset.step);
        let currentValue = parseInt(customSlider.dataset.value);
        let isDragging = false;
        
        // Função para atualizar a posição visual do slider
        function updateSliderPosition(value) {
            const percentage = ((value - min) / (max - min)) * 100;
            
            // Atualizar posição da bolinha
            sliderThumb.style.left = percentage + '%';
            
            // Atualizar largura da barra verde (termina exatamente na bolinha)
            sliderFill.style.width = percentage + '%';
            
            // Atualizar valores
            valueInput.value = formatCurrency(value);
            hiddenInput.value = value;
            customSlider.dataset.value = value;
            currentValue = value;
        }
        
        // Função para calcular valor baseado na posição do mouse
        function getValueFromPosition(clientX) {
            const rect = customSlider.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const rawValue = (percentage / 100) * (max - min) + min;
            return Math.round(rawValue / step) * step;
        }
        
        // Event listeners para mouse
        customSlider.addEventListener('mousedown', function(e) {
            isDragging = true;
            sliderThumb.classList.add('dragging');
            const newValue = getValueFromPosition(e.clientX);
            updateSliderPosition(newValue);
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const newValue = getValueFromPosition(e.clientX);
                updateSliderPosition(newValue);
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                sliderThumb.classList.remove('dragging');
            }
        });
        
        // Event listeners para touch (mobile)
        customSlider.addEventListener('touchstart', function(e) {
            isDragging = true;
            sliderThumb.classList.add('dragging');
            const touch = e.touches[0];
            const newValue = getValueFromPosition(touch.clientX);
            updateSliderPosition(newValue);
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                const touch = e.touches[0];
                const newValue = getValueFromPosition(touch.clientX);
                updateSliderPosition(newValue);
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', function() {
            if (isDragging) {
                isDragging = false;
                sliderThumb.classList.remove('dragging');
            }
        });
        
        // Inicializar com valor padrão
        updateSliderPosition(currentValue);
    }
}

// ========== CALCULADORA DE EMPRÉSTIMO ========== //
function initLoanCalculator() {
    // Inicializar todos os sliders da calculadora
    initCalculatorSlider('score-slider', 'score-fill', 'score-thumb', 'score-input', '', updateLoanCalculation);
    initCalculatorSlider('amount-slider', 'amount-fill', 'amount-thumb', 'amount-input', '$', updateLoanCalculation);
    initCalculatorSlider('months-slider', 'months-fill', 'months-thumb', 'months-input', '', updateLoanCalculation, ' meses');
    
    // Inicializar botões de frequência
    initFrequencySelector();
    
    // Calcular inicialmente
    updateLoanCalculation();
}

function initFrequencySelector() {
    const frequencyBtns = document.querySelectorAll('.frequency-btn');
    
    frequencyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active de todos
            frequencyBtns.forEach(b => b.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');
            
            // Atualizar o label do slider de meses
            updateMonthsSliderLabel();
            
            // Atualiza cálculo
            updateLoanCalculation();
        });
    });
}

function updateMonthsSliderLabel() {
    const monthsSlider = document.getElementById('months-slider');
    const monthsInput = document.getElementById('months-input');
    const monthsMin = document.getElementById('months-min');
    const monthsMax = document.getElementById('months-max');
    const termLabel = document.getElementById('term-label');
    const monthsFill = document.getElementById('months-fill');
    const monthsThumb = document.getElementById('months-thumb');
    
    if (monthsSlider && monthsInput) {
        // Valor em MESES (sempre armazenado em meses)
        const monthsValue = parseInt(monthsSlider.dataset.value);
        const activeFrequency = document.querySelector('.frequency-btn.active');
        const frequency = activeFrequency ? activeFrequency.dataset.frequency : 'weekly';
        
        let displayValue, termText, unitLabel, minDisplay, maxDisplay;
        
        if (frequency === 'weekly') {
            // 1 mês = 4 semanas
            displayValue = monthsValue * 4;
            termText = displayValue + ' wks';
            unitLabel = 'Term (Weeks)';
            minDisplay = '24'; // 6 meses × 4
            maxDisplay = '48'; // 12 meses × 4
        } else if (frequency === 'biweekly') {
            // 1 mês = 2 quinzenas
            displayValue = monthsValue * 2;
            termText = displayValue + ' bi-wks';
            unitLabel = 'Term (Bi-weeks)';
            minDisplay = '12'; // 6 meses × 2
            maxDisplay = '24'; // 12 meses × 2
        } else {
            // Mensal: mantém em meses
            displayValue = monthsValue;
            termText = displayValue + ' mos';
            unitLabel = 'Term (Months)';
            minDisplay = '6';
            maxDisplay = '12';
        }
        
        monthsInput.value = termText;
        if (termLabel) termLabel.textContent = unitLabel;
        if (monthsMin) monthsMin.textContent = minDisplay;
        if (monthsMax) monthsMax.textContent = maxDisplay;
    }
}

function initCalculatorSlider(sliderId, fillId, thumbId, inputId, prefix = '', callback = null, suffix = '') {
    const slider = document.getElementById(sliderId);
    const fill = document.getElementById(fillId);
    const thumb = document.getElementById(thumbId);
    const input = document.getElementById(inputId);
    
    if (slider && fill && thumb && input) {
        const min = parseInt(slider.dataset.min);
        const max = parseInt(slider.dataset.max);
        const step = parseInt(slider.dataset.step);
        let currentValue = parseInt(slider.dataset.value);
        let isDragging = false;
        
        function updatePosition(value) {
            const percentage = ((value - min) / (max - min)) * 100;
            thumb.style.left = percentage + '%';
            fill.style.width = percentage + '%';
            
            let displayValue;
            if (sliderId === 'amount-slider') {
                displayValue = formatCurrency(value);
            } else if (sliderId === 'months-slider') {
                // Obter frequência selecionada para determinar o label correto
                const activeFrequency = document.querySelector('.frequency-btn.active');
                const frequency = activeFrequency ? activeFrequency.dataset.frequency : 'weekly';
                
                // value está sempre em MESES, converter para display
                let convertedValue, termLabel;
                if (frequency === 'weekly') {
                    convertedValue = value * 4; // meses → semanas
                    termLabel = convertedValue + ' wks';
                } else if (frequency === 'biweekly') {
                    convertedValue = value * 2; // meses → quinzenas
                    termLabel = convertedValue + ' bi-wks';
                } else {
                    termLabel = value + ' mos';
                }
                displayValue = termLabel;
            } else {
                displayValue = value.toString();
            }
            
            input.value = displayValue;
            slider.dataset.value = value;
            
            if (callback) callback();
        }
        
        function getValueFromPosition(clientX) {
            const rect = slider.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            const rawValue = (percentage / 100) * (max - min) + min;
            return Math.round(rawValue / step) * step;
        }
        
        // Event listeners
        slider.addEventListener('mousedown', function(e) {
            isDragging = true;
            thumb.classList.add('dragging');
            const newValue = getValueFromPosition(e.clientX);
            updatePosition(newValue);
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging && e.target.closest('#' + sliderId)) {
                const newValue = getValueFromPosition(e.clientX);
                updatePosition(newValue);
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                thumb.classList.remove('dragging');
            }
        });
        
        // Touch events
        slider.addEventListener('touchstart', function(e) {
            isDragging = true;
            thumb.classList.add('dragging');
            const touch = e.touches[0];
            const newValue = getValueFromPosition(touch.clientX);
            updatePosition(newValue);
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                const touch = e.touches[0];
                const newValue = getValueFromPosition(touch.clientX);
                updatePosition(newValue);
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', function() {
            if (isDragging) {
                isDragging = false;
                thumb.classList.remove('dragging');
            }
        });
        
        // Initialize
        updatePosition(currentValue);
    }
}

function updateLoanCalculation() {
    const scoreSlider = document.getElementById('score-slider');
    const amountSlider = document.getElementById('amount-slider');
    const monthsSlider = document.getElementById('months-slider');
    const monthlyPaymentEl = document.getElementById('monthly-payment');
    const interestRateEl = document.getElementById('interest-rate-display');
    const installmentsEl = document.getElementById('installments-display');
    
    if (scoreSlider && amountSlider && monthsSlider && monthlyPaymentEl && interestRateEl && installmentsEl) {
        const creditScore = parseInt(scoreSlider.dataset.value);
        const loanAmount = parseInt(amountSlider.dataset.value);
        const loanTermMonths = parseInt(monthsSlider.dataset.value);
        
        // Obter frequência selecionada
        const activeFrequency = document.querySelector('.frequency-btn.active');
        const frequency = activeFrequency ? activeFrequency.dataset.frequency : 'weekly';
        
        // Determinar taxa de juros baseada no credit score
        let annualRate;
        if (creditScore >= 500 && creditScore <= 599) {
            annualRate = 0.30; // 30% ao ano
        } else if (creditScore >= 600 && creditScore <= 699) {
            annualRate = 0.25; // 25% ao ano
        } else if (creditScore >= 700) {
            annualRate = 0.20; // 20% ao ano
        } else {
            annualRate = 0.35; // Taxa máxima para scores muito baixos
        }
        
        // Calcular número de parcelas e taxa com base na frequência
        let numInstallments;
        let periodRate;
        let labelSuffix;
        
        if (frequency === 'weekly') {
            numInstallments = loanTermMonths * 4; // ~4 semanas por mês
            periodRate = annualRate / 52; // Taxa semanal
            labelSuffix = 'x/sem';
        } else if (frequency === 'biweekly') {
            numInstallments = loanTermMonths * 2; // 2 quinzenas por mês
            periodRate = annualRate / 26; // Taxa quinzenal
            labelSuffix = 'x/qz';
        } else { // monthly
            numInstallments = loanTermMonths;
            periodRate = annualRate / 12; // Taxa mensal
            labelSuffix = 'x/mês';
        }
        
        // Calcular pagamento usando fórmula de amortização
        const payment = loanAmount * (periodRate * Math.pow(1 + periodRate, numInstallments)) / 
                       (Math.pow(1 + periodRate, numInstallments) - 1);
        
        // Atualizar display
        installmentsEl.textContent = `${numInstallments}${labelSuffix}`;
        monthlyPaymentEl.textContent = formatCurrency(Math.round(payment));
        interestRateEl.textContent = `Taxa: ${(annualRate * 100).toFixed(0)}% a.a.`;
    }
}

// ========== ZIP CODE LOOKUP ========== //
function initZipCodeLookup() {
    const zipInput = document.getElementById('zipcode');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    
    if (zipInput && cityInput && stateInput) {
        let debounceTimer;
        
        zipInput.addEventListener('input', function() {
            const zipCode = this.value.replace(/\D/g, ''); // Remove não-números
            this.value = zipCode;
            
            // Limpar campos quando ZIP é alterado
            if (zipCode.length < 5) {
                cityInput.value = '';
                stateInput.value = '';
                return;
            }
            
            // Debounce para evitar muitas requisições
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (zipCode.length === 5) {
                    lookupZipCode(zipCode);
                }
            }, 500);
        });
    }
}

// Função para buscar informações do ZIP code
async function lookupZipCode(zipCode) {
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const zipInput = document.getElementById('zipcode');
    
    try {
        // Adicionar indicador de loading
        zipInput.classList.add('loading-zip');
        
        // Usar API dos Correios Americanos via zippopotam.us
        const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data && data.places && data.places.length > 0) {
                const place = data.places[0];
                const city = place['place name'] || '';
                const state = place['state abbreviation'] || '';
                
                cityInput.value = city;
                stateInput.value = state;
                
                // Atualizar placeholder do endereço se existir
                const addressField = document.getElementById('address');
                if (addressField && addressField.value.trim() === '') {
                    addressField.placeholder = `Enter address in ${city}, ${state}`;
                }
                
                // Mostrar animação de sucesso
                showZipCodeSuccess(city, state);
                
                // Remover readonly temporariamente para permitir edição se necessário
                cityInput.removeAttribute('readonly');
                stateInput.removeAttribute('readonly');
                
                // Adicionar readonly novamente após um breve delay
                setTimeout(() => {
                    cityInput.setAttribute('readonly', true);
                    stateInput.setAttribute('readonly', true);
                }, 100);
            } else {
                throw new Error('ZIP code not found');
            }
        } else {
            throw new Error('Invalid ZIP code');
        }
    } catch (error) {
        console.log('ZIP code lookup failed:', error);
        // Permitir entrada manual em caso de erro
        cityInput.removeAttribute('readonly');
        stateInput.removeAttribute('readonly');
        cityInput.placeholder = 'Enter city manually';
        stateInput.placeholder = 'Enter state manually';
    } finally {
        // Remover indicador de loading
        zipInput.classList.remove('loading-zip');
    }
}

// ========== INPUT MASKS ========== //
function initInputMasks() {
    // Máscara para telefone: (XXX) XXX-XXXX
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para SSN/Tax ID: XXX-XX-XXXX ou XX-XXXXXXX
    const ssnInput = document.getElementById('ssn');
    if (ssnInput) {
        ssnInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limitar a 9 dígitos (SSN) ou permitir até 9 para Tax ID
            if (value.length > 9) value = value.slice(0, 9);
            
            // Formato SSN: XXX-XX-XXXX
            if (value.length >= 5) {
                value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
            } else if (value.length >= 3) {
                value = `${value.slice(0, 3)}-${value.slice(3)}`;
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para ZIP Code já existe em initZipCodeLookup(), mas vou melhorar
    const zipInput = document.getElementById('zipcode');
    if (zipInput) {
        zipInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) value = value.slice(0, 5);
            e.target.value = value;
        });
    }
}

// ========== FORMATAÇÃO DE MOEDA ========== //
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// ========== VALIDAÇÃO DE FORMULÁRIOS ========== //
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

// ========== MANIPULAR ENVIO DE FORMULÁRIO ========== //
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formId = form.id;
    
    // Validar todos os campos
    const isValid = validateForm(form);
    
    if (isValid) {
        // Mostrar loading
        const submitButton = form.querySelector('button[type="submit"]');
        showLoading(submitButton);
        
        // Processar baseado no tipo de formulário
        switch (formId) {
            case 'form-simulacao-rapida':
                handleSimulacaoRapida(form);
                break;
            case 'form-contato':
                handleContatoForm(form);
                break;
            case 'form-login':
                handleLogin(form);
                break;
            case 'form-aplicacao':
                handleAplicacaoForm(form);
                break;
            default:
                handleGenericForm(form);
        }
    }
}

// ========== VALIDAÇÃO DE FORMULÁRIO COMPLETO ========== //
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ========== VALIDAÇÃO DE CAMPO INDIVIDUAL ========== //
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Verificar se é obrigatório
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Validações específicas por tipo
    if (value && isValid) {
        switch (fieldType) {
            case 'email':
                isValid = validateEmail(value);
                errorMessage = isValid ? '' : 'Digite um e-mail válido.';
                break;
            case 'tel':
                isValid = validatePhone(value);
                errorMessage = isValid ? '' : 'Digite um telefone válido.';
                break;
            case 'text':
                if (fieldName === 'ssn') {
                    isValid = validateSSN(value);
                    errorMessage = isValid ? '' : 'Please enter a valid Social Security Number.';
                } else if (fieldName === 'zipcode') {
                    isValid = validateZipCode(value);
                    errorMessage = isValid ? '' : 'Please enter a valid ZIP code.';
                } else if (fieldName === 'nome') {
                    isValid = value.length >= 3;
                    errorMessage = isValid ? '' : 'Name must have at least 3 characters.';
                }
                break;
        }
    }
    
    // Mostrar/ocultar erro
    if (isValid) {
        showFieldSuccess(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// ========== VALIDAÇÃO DE EMAIL ========== //
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ========== VALIDAÇÃO DE TELEFONE ========== //
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
}

// ========== VALIDAÇÃO DE SSN ========== //
function validateSSN(ssn) {
    const cleaned = ssn.replace(/\D/g, '');
    
    // SSN deve ter 9 dígitos
    if (cleaned.length !== 9) return false;
    
    // Verificar padrões inválidos
    const invalidPatterns = [
        '000000000', '111111111', '222222222', '333333333',
        '444444444', '555555555', '666666666', '777777777',
        '888888888', '999999999', '123456789'
    ];
    
    if (invalidPatterns.includes(cleaned)) return false;
    
    // Area number não pode ser 000, 666, ou 900-999
    const areaNumber = parseInt(cleaned.substring(0, 3));
    if (areaNumber === 0 || areaNumber === 666 || areaNumber >= 900) return false;
    
    // Group number não pode ser 00
    const groupNumber = parseInt(cleaned.substring(3, 5));
    if (groupNumber === 0) return false;
    
    // Serial number não pode ser 0000
    const serialNumber = parseInt(cleaned.substring(5, 9));
    if (serialNumber === 0) return false;
    
    return true;
}

// ========== VALIDAÇÃO DE ZIP CODE ========== //
function validateZipCode(zip) {
    // Suporte para ZIP+4 (12345-6789) e ZIP básico (12345)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
}

// ========== MOSTRAR ERRO NO CAMPO ========== //
function showFieldError(field, message) {
    field.classList.remove('success');
    field.classList.add('error');
    
    const errorElement = document.getElementById(field.name + '-error') || 
                        field.parentNode.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// ========== MOSTRAR SUCESSO NO CAMPO ========== //
function showFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    const errorElement = document.getElementById(field.name + '-error') || 
                        field.parentNode.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// ========== LIMPAR ERRO DO CAMPO ========== //
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = document.getElementById(field.name + '-error') || 
                        field.parentNode.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// ========== SIMULAÇÃO RÁPIDA ========== //
function handleSimulacaoRapida(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simular processo de análise
    setTimeout(() => {
        hideLoading();
        
        // Salvar dados no localStorage para próxima etapa
        localStorage.setItem('simulacao_dados', JSON.stringify(data));
        
        // Mostrar resultado da simulação
        showSimulationResult(data);
        
    }, 2000);
}

// ========== MOSTRAR RESULTADO DA SIMULAÇÃO ========== //
function showSimulationResult(data) {
    const valor = parseInt(data.valor.replace(/[^\d]/g, ''));
    const parcelas = Math.ceil(valor / 500); // Exemplo de cálculo
    const juros = 2.5; // Taxa exemplo
    const valorParcela = (valor * (1 + juros/100)) / parcelas;
    
    // Criar modal de resultado
    const modalHTML = `
        <div class="modal-overlay" id="simulation-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle text-verde"></i> Pré-Aprovação Realizada!</h3>
                    <button class="modal-close" onclick="closeModal('simulation-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Olá <strong>${data.nome}</strong>, temos uma ótima notícia!</p>
                    
                    <div class="result-card">
                        <h4>Sua Pré-Aprovação:</h4>
                        <div class="result-details">
                            <div class="result-item">
                                <span class="label">Valor Solicitado:</span>
                                <span class="value text-verde">${data.valor}</span>
                            </div>
                            <div class="result-item">
                                <span class="label">Parcelas:</span>
                                <span class="value">${parcelas}x de ${formatCurrency(valorParcela)}</span>
                            </div>
                            <div class="result-item">
                                <span class="label">Taxa de Juros:</span>
                                <span class="value">${juros}% a.m.</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h4>Próximos Passos:</h4>
                        <ol>
                            <li>Complete sua aplicação detalhada</li>
                            <li>Envie os documentos necessários</li>
                            <li>Aguarde nossa análise final</li>
                            <li>Receba o dinheiro em sua conta</li>
                        </ol>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="continueApplication()">
                        Continuar Aplicação
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal('simulation-modal')">
                        Continuar Depois
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar estilos do modal se não existirem
    if (!document.getElementById('modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: var(--radius-lg);
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideInUp 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-lg);
                border-bottom: 1px solid var(--cinza-claro);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: var(--cinza-medio);
            }
            
            .modal-body {
                padding: var(--spacing-lg);
            }
            
            .modal-footer {
                display: flex;
                gap: var(--spacing-md);
                padding: var(--spacing-lg);
                border-top: 1px solid var(--cinza-claro);
            }
            
            .result-card {
                background: var(--cinza-claro);
                padding: var(--spacing-lg);
                border-radius: var(--radius-md);
                margin: var(--spacing-md) 0;
            }
            
            .result-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: var(--spacing-sm);
            }
            
            .result-item .label {
                font-weight: 500;
            }
            
            .result-item .value {
                font-weight: 600;
            }
            
            .next-steps ol {
                margin-left: var(--spacing-md);
            }
            
            @keyframes slideInUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .modal-footer {
                    flex-direction: column;
                }
                .modal-footer .btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

// ========== FECHAR MODAL ========== //
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// ========== CONTINUAR APLICAÇÃO ========== //
function continueApplication() {
    closeModal('simulation-modal');
    window.location.href = 'aplicacao.html';
}

// ========== HANDLE APPLICATION FORM ========== //
function handleAplicacaoForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate application processing
    setTimeout(() => {
        hideLoading();
        
        // Create user account automatically
        const userData = {
            id: generateSessionId(),
            fullName: data.fullName || 'Novo Cliente',
            email: data.email || 'cliente@exemplo.com',
            phone: data.phone || '',
            ssn: data.ssn || '',
            address: data.address || '',
            zipCode: data.zipCode || '',
            city: data.city || '',
            state: data.state || '',
            desiredAmount: data.desiredAmount || 0,
            purpose: data.purpose || '',
            availableCredit: Math.floor(Math.random() * 30000) + 15000, // Random credit between 15k-45k
            creditScore: Math.floor(Math.random() * 200) + 650, // Random score between 650-850
            applicationDate: new Date().toISOString(),
            status: 'processing'
        };
        
        // Save user data
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        
        // Create session  
        localStorage.setItem('flexcredi_session', JSON.stringify({
            userId: userData.id,
            sessionId: generateSessionId(),
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
        }));
        
        // Save application data to API
        saveApplicationToAPI(userData);
        
        showAlert('success', 'Aplicação enviada com sucesso! Criando seu acesso...');
        
        // Show success modal with login credentials
        showApplicationSuccessModal(userData);
        
    }, 2500);
}

// Save application to API
async function saveApplicationToAPI(userData) {
    try {
        const response = await fetch('tables/loan_applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone,
                ssn: userData.ssn,
                address: userData.address,
                zipCode: userData.zipCode,
                city: userData.city,
                state: userData.state,
                desiredAmount: parseInt(userData.desiredAmount) || 0,
                purpose: userData.purpose,
                status: 'processing',
                creditScore: userData.creditScore
            })
        });
        
        if (response.ok) {
            console.log('Application saved successfully');
        }
    } catch (error) {
        console.error('Error saving application:', error);
    }
}

// Show application success modal
function showApplicationSuccessModal(userData) {
    const modalHTML = `
        <div class="modal-overlay" id="application-success-modal">
            <div class="modal-content">
                <div class="modal-header success">
                    <h3><i class="fas fa-check-circle"></i> Aplicação Enviada com Sucesso!</h3>
                </div>
                <div class="modal-body">
                    <div class="success-message">
                        <p><strong>Parabéns ${userData.fullName}!</strong></p>
                        <p>Sua aplicação de crédito foi recebida e está sendo processada.</p>
                        <p>Criamos automaticamente seu acesso à área do cliente:</p>
                    </div>
                    
                    <div class="login-credentials">
                        <div class="credential-item">
                            <span class="label">E-mail:</span>
                            <span class="value">${userData.email}</span>
                        </div>
                        <div class="credential-item">
                            <span class="label">Senha:</span>
                            <span class="value">flexcredi123</span>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h4>Próximos Passos:</h4>
                        <ol>
                            <li>Acesse sua área do cliente</li>
                            <li>Acompanhe o status da sua aplicação</li>
                            <li>Receba notificações por e-mail</li>
                            <li>Complete documentação se necessário</li>
                        </ol>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="goToDashboard()">
                        <i class="fas fa-tachometer-alt"></i>
                        Acessar Minha Área
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal('application-success-modal')">
                        Continuar Depois
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Go to dashboard
function goToDashboard() {
    closeModal('application-success-modal');
    window.location.href = 'dashboard-cliente.html';
}

// ========== APLICAR MÁSCARAS NOS INPUTS ========== //
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para SSN
    const ssnInputs = document.querySelectorAll('input[name="ssn"]');
    ssnInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = maskSSN(this.value);
        });
    });
    
    // Máscara para ZIP Code
    const zipInputs = document.querySelectorAll('input[name="zipcode"]');
    zipInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = maskZipCode(this.value);
        });
        
        // Adicionar busca automática quando o ZIP tiver 5 dígitos
        input.addEventListener('blur', function() {
            const zip = this.value.replace(/\D/g, '');
            if (zip.length === 5) {
                lookupZipCode(zip);
            }
        });
    });
    
    // Máscara para Telefone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = maskPhone(this.value);
        });
    });
});

// ========== MÁSCARA SSN ========== //
function maskSSN(value) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1-$2');
    value = value.replace(/(\d{3})-(\d{2})(\d)/, '$1-$2-$3');
    return value;
}

// ========== MÁSCARA ZIP CODE ========== //
function maskZipCode(value) {
    value = value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
}

// ========== MÁSCARA TELEFONE ========== //
function maskPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{3})(\d)/, '($1) $2');
        value = value.replace(/(\d{3}) (\d{4})(\d)/, '$1) $2-$3');
    } else {
        value = value.replace(/(\d{3})(\d)/, '($1) $2');
        value = value.replace(/(\d{3}) (\d{3})(\d)/, '$1) $2-$3');
    }
    return value;
}

// ========== LOADING STATES ========== //
function showLoading(button) {
    if (button) {
        button.classList.add('loading');
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Processando...';
    }
}

function hideLoading() {
    const loadingButtons = document.querySelectorAll('.loading');
    loadingButtons.forEach(button => {
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Enviar';
    });
}

// ========== LOGIN SYSTEM ========== //
function handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    // Validate credentials
    if (!email || !password) {
        showAlert('error', 'Por favor, preencha todos os campos obrigatórios.');
        hideLoading();
        return;
    }
    
    console.log('🔐 Login attempt:', email);
    
    // Check for master credentials
    const isMaster = (email.toLowerCase() === 'master@flexcredi.com' && password === 'flexmaster2024');
    
    // Check for test client credentials
    const testClients = JSON.parse(localStorage.getItem('flexcredi_test_clients') || '[]');
    const testClient = testClients.find(c => 
        c.email?.toLowerCase() === email.toLowerCase() && 
        (c.password === password || c.senha === password)
    );
    
    console.log('👥 Test clients found:', testClients.length);
    if (testClient) {
        console.log('✅ Test client match:', testClient.fullName);
    }
    
    // Try API authentication if not found locally
    const API_BASE = 'https://flexcredi-site-adm-production-b27d.up.railway.app';
    
    // Simulate authentication
    setTimeout(async () => {
        hideLoading();
        
        // Create user data based on credentials
        let userData;
        
        if (testClient) {
            // Test client login
            userData = {
                id: testClient.id || testClient.clientId,
                email: testClient.email,
                fullName: testClient.fullName || testClient.name,
                phone: testClient.phone || testClient.cellPhone,
                ssn: testClient.ssn || '***-**-****',
                address: testClient.address || '',
                zipCode: testClient.zipCode || testClient.cep,
                city: testClient.city || testClient.cidade,
                state: testClient.state || testClient.estado,
                availableCredit: testClient.preApproval?.amount || testClient.loanAmount || 0,
                creditScore: testClient.creditScore || 0,
                accountType: 'client',
                memberSince: testClient.applicationDate || new Date().toISOString(),
                totalApplications: 1,
                approvedApplications: testClient.status === 'pre-approved' ? 1 : 0,
                totalCreditUsed: 0,
                currentBalance: 0,
                averageRate: testClient.preApproval?.interestRate || 0,
                loginTime: new Date().toISOString(),
                // Application data
                applications: [{
                    id: testClient.applicationId || testClient.id,
                    amount: testClient.loanAmount || testClient.desiredAmount,
                    purpose: testClient.loanPurpose || testClient.purpose,
                    status: testClient.status === 'pre-approved' ? 'processing' : 'pending',
                    date: testClient.applicationDate,
                    rate: testClient.preApproval?.interestRate || 16.5,
                    term: testClient.preApproval?.termMonths || 36
                }],
                // Full application details for dashboard
                applicationData: testClient,
                documents: testClient.documents || {
                    driverLicense: { uploaded: false },
                    proofAddress: { uploaded: false },
                    socialSecurity: { uploaded: false },
                    bankCard: { uploaded: false }
                },
                recentActivity: [
                    {
                        title: 'Application Submitted',
                        description: `Credit application of $${(testClient.loanAmount || 0).toLocaleString()} submitted`,
                        time: 'Today',
                        type: 'application'
                    }
                ]
            };
            
            console.log('✅ Test client userData created:', userData);
            
        } else if (isMaster) {
            // Master account with rich data
            userData = {
                id: 'master_001',
                email: 'master@flexcredi.com',
                fullName: 'Carlos Eduardo Silva',
                phone: '(407) 555-0123',
                ssn: '***-**-5678',
                address: '1425 International Drive, Orlando, FL',
                zipCode: '32819',
                city: 'Orlando',
                state: 'Florida',
                availableCredit: 75000,
                creditScore: 785,
                accountType: 'master',
                memberSince: '2023-01-15',
                totalApplications: 8,
                approvedApplications: 7,
                totalCreditUsed: 125000,
                currentBalance: 35000,
                averageRate: 18.5,
                lastPayment: '2024-10-05',
                nextPaymentDue: '2024-11-05',
                loginTime: new Date().toISOString(),
                applications: [
                    {
                        id: 'app_001',
                        amount: 25000,
                        purpose: 'Expansão do Restaurante Latino',
                        status: 'approved',
                        date: '2024-09-15',
                        rate: 18.5,
                        term: 24
                    },
                    {
                        id: 'app_002', 
                        amount: 15000,
                        purpose: 'Equipamentos de Cozinha Profissional',
                        status: 'approved',
                        date: '2024-08-20',
                        rate: 19.2,
                        term: 18
                    },
                    {
                        id: 'app_003',
                        amount: 35000,
                        purpose: 'Abertura de Segunda Unidade',
                        status: 'processing',
                        date: '2024-10-10',
                        rate: 17.8,
                        term: 36
                    },
                    {
                        id: 'app_004',
                        amount: 8000,
                        purpose: 'Marketing e Publicidade',
                        status: 'approved',
                        date: '2024-07-05',
                        rate: 20.1,
                        term: 12
                    }
                ],
                recentActivity: [
                    {
                        title: 'Pagamento Processado',
                        description: 'Pagamento de $2.150 processado com sucesso',
                        time: '2 dias atrás',
                        type: 'payment'
                    },
                    {
                        title: 'Nova Aplicação Submetida',
                        description: 'Aplicação de $35.000 para segunda unidade',
                        time: '5 dias atrás',
                        type: 'application'
                    },
                    {
                        title: 'Score Atualizado',
                        description: 'Seu score aumentou para 785 pontos',
                        time: '1 semana atrás',
                        type: 'score'
                    },
                    {
                        title: 'Documento Aprovado',
                        description: 'Comprovante de renda aprovado',
                        time: '2 semanas atrás',
                        type: 'document'
                    }
                ],
                cobuyers: [
                    {
                        id: 'cobuyer_demo001',
                        fullName: 'Maria Silva Santos',
                        email: 'maria.santos@email.com',
                        phone: '(407) 555-0124',
                        ssn: '***-**-9876',
                        address: '1425 International Drive, Orlando, FL',
                        zipCode: '32819',
                        city: 'Orlando',
                        state: 'FL',
                        relationship: 'spouse',
                        profileComplete: true,
                        documentsComplete: true,
                        contractSigned: false,
                        documents: {
                            driverLicense: { 
                                uploaded: true, 
                                approved: true, 
                                fileName: 'driver_license.jpg',
                                url: 'https://images.pexels.com/photos/45113/pexels-photo-45113.jpeg?auto=compress&cs=tinysrgb&w=400'
                            },
                            proofAddress: { 
                                uploaded: true, 
                                approved: true, 
                                fileName: 'proof_address.jpg',
                                url: 'https://images.unsplash.com/photo-1554224155-cfa08c2a758f?w=400&q=80'
                            },
                            socialSecurity: { 
                                uploaded: true, 
                                approved: true, 
                                fileName: 'ssn_card.jpg',
                                url: 'https://images.unsplash.com/photo-1487637419635-a2a471ff5c7b?w=400&q=80'
                            },
                            bankCard: { 
                                uploaded: true, 
                                approved: true, 
                                fileName: 'bank_card.jpg',
                                url: 'https://images.unsplash.com/photo-1752218804057-4fcdd1376f94?w=400&q=80'
                            }
                        },
                        createdAt: '2024-10-10T10:00:00.000Z'
                    }
                ]
            };
        } else {
            // Regular user account or invalid credentials
            // Try to find in API
            try {
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    userData = await response.json();
                    console.log('✅ API authentication successful');
                } else {
                    // Invalid credentials
                    showAlert('error', 'Email or password incorrect. Please try again or use test credentials: john.smith@testmail.com / TestClient123!');
                    return;
                }
            } catch (error) {
                console.log('⚠️ API not available, checking for master account...');
                
                if (isMaster) {
                    // Fallback to master account (kept for backward compatibility)
                    console.log('Using master account fallback');
                } else {
                    // Generic fallback for any email
                    showAlert('error', 'Could not authenticate. Please use test credentials: john.smith@testmail.com / TestClient123!');
                    return;
                }
            }
            
            userData = userData || {
                id: generateSessionId(),
                email: email,
                fullName: email.split('@')[0].replace(/[^a-zA-Z]/g, '').replace(/\b\w/g, l => l.toUpperCase()),
                availableCredit: 35000,
                creditScore: 720,
                loginTime: new Date().toISOString()
            };
        }
        
        // Save user data
        localStorage.setItem('flexcredi_user', JSON.stringify(userData));
        if (rememberMe) {
            localStorage.setItem('flexcredi_remember', 'true');
        }
        
        // Create session
        localStorage.setItem('flexcredi_session', JSON.stringify({
            userId: userData.id,
            sessionId: generateSessionId(),
            loginTime: userData.loginTime,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
        }));
        
        showAlert('success', 'Login realizado com sucesso! Redirecionando...');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard-cliente.html';
        }, 1500);
        
    }, 1500);
}

// Generate session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Check if user is logged in
function checkUserSession() {
    const session = JSON.parse(localStorage.getItem('flexcredi_session') || '{}');
    const user = JSON.parse(localStorage.getItem('flexcredi_user') || '{}');
    
    if (session.sessionId && user.id && new Date(session.expiresAt) > new Date()) {
        return { user, session };
    }
    
    // Clear invalid session
    localStorage.removeItem('flexcredi_session');
    localStorage.removeItem('flexcredi_user');
    return null;
}

// ========== FORMULÁRIOS GENÉRICOS ========== //
function handleGenericForm(form) {
    const formData = new FormData(form);
    
    // Simular envio
    setTimeout(() => {
        hideLoading();
        showAlert('success', 'Formulário enviado com sucesso!');
        form.reset();
    }, 1500);
}

// ========== SISTEMA DE ALERTAS ========== //
function showAlert(type, message, duration = 5000) {
    const alertHTML = `
        <div class="alert alert-${type} alert-floating" id="floating-alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
            <button class="alert-close" onclick="closeAlert()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Remover alertas existentes
    const existingAlert = document.getElementById('floating-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto remover após duration
    if (duration > 0) {
        setTimeout(() => {
            closeAlert();
        }, duration);
    }
    
    // Adicionar estilos se não existirem
    if (!document.getElementById('alert-styles')) {
        const alertStyles = document.createElement('style');
        alertStyles.id = 'alert-styles';
        alertStyles.textContent = `
            .alert-floating {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10001;
                min-width: 300px;
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                animation: slideInRight 0.3s ease;
            }
            
            .alert-close {
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                margin-left: auto;
            }
            
            .alert-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .alert-floating {
                    left: 20px;
                    right: 20px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(alertStyles);
    }
}

// ========== FECHAR ALERTA ========== //
function closeAlert() {
    const alert = document.getElementById('floating-alert');
    if (alert) {
        alert.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }
}

// ========== UTILITÁRIOS ========== //
// Scroll to top suave
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Adicionar botão de voltar ao topo se a página for longa
window.addEventListener('scroll', function() {
    let scrollTopButton = document.getElementById('scroll-top');
    
    if (window.pageYOffset > 300) {
        if (!scrollTopButton) {
            scrollTopButton = document.createElement('button');
            scrollTopButton.id = 'scroll-top';
            scrollTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
            scrollTopButton.className = 'btn-scroll-top';
            scrollTopButton.onclick = scrollToTop;
            scrollTopButton.setAttribute('aria-label', 'Voltar ao topo');
            document.body.appendChild(scrollTopButton);
            
            // Adicionar estilos
            if (!document.getElementById('scroll-top-styles')) {
                const styles = document.createElement('style');
                styles.id = 'scroll-top-styles';
                styles.textContent = `
                    .btn-scroll-top {
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        width: 50px;
                        height: 50px;
                        background: var(--verde-vibrante);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                        box-shadow: var(--shadow-medium);
                        z-index: 1000;
                        transition: var(--transition-fast);
                        animation: fadeIn 0.3s ease;
                    }
                    
                    .btn-scroll-top:hover {
                        background: var(--verde-escuro);
                        transform: translateY(-2px);
                    }
                    
                    @media (max-width: 768px) {
                        .btn-scroll-top {
                            bottom: 20px;
                            right: 20px;
                            width: 45px;
                            height: 45px;
                            font-size: 16px;
                        }
                    }
                `;
                document.head.appendChild(styles);
            }
        }
        scrollTopButton.style.display = 'block';
    } else {
        if (scrollTopButton) {
            scrollTopButton.style.display = 'none';
        }
    }
});

// ========== CONTROLE DE SESSÃO (para páginas futuras) ========== //
function checkUserSession() {
    const userSession = localStorage.getItem('user_session');
    return userSession ? JSON.parse(userSession) : null;
}

function setUserSession(userData) {
    localStorage.setItem('user_session', JSON.stringify(userData));
}

function clearUserSession() {
    localStorage.removeItem('user_session');
}

// ========== LOG DE DEBUG ========== //
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[FLEXCREDI Debug] ${message}`, data);
    }
}

// Log inicial
debugLog('JavaScript carregado e inicializado com sucesso');

// Traduções movidas para arquivos JSON em /locales/

// ========== TRANSLATION SYSTEM ========== //
// Sistema de traduções dinâmicas carregadas de arquivos JSON separados
// Arquivos: /locales/en.json, /locales/es.json, /locales/pt.json

let translations = {
    en: {},
    es: {},
    pt: {}
};

let translationsLoaded = false;

// Carregar traduções de um idioma específico
async function loadTranslation(lang) {
    if (Object.keys(translations[lang]).length > 0) {
        return translations[lang]; // Já carregado
    }
    
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations[lang] = await response.json();
        debugLog(`Traduções carregadas para: ${lang} (${Object.keys(translations[lang]).length} chaves)`);
        return translations[lang];
    } catch (error) {
        console.error(`Erro ao carregar traduções para ${lang}:`, error);
        return {};
    }
}

// Carregar todas as traduções (para fallback)
async function loadAllTranslations() {
    if (translationsLoaded) return;
    
    await Promise.all([
        loadTranslation('en'),
        loadTranslation('es'),
        loadTranslation('pt')
    ]);
    
    translationsLoaded = true;
    debugLog('Todas as traduções carregadas');
}

async function initLanguageSelector() {
    // Carregar todas as traduções primeiro
    await loadAllTranslations();
    
    const languageButtons = document.querySelectorAll('.language-btn');
    
    // Detectar idioma padrão baseado na página e no HTML lang
    const htmlLang = document.documentElement.getAttribute('data-lang') || 
                    document.documentElement.getAttribute('lang') || 'en';
    let defaultLang = 'en';
    
    // Se a página tem data-lang="pt" ou lang="pt-BR", usar português como padrão
    if (htmlLang.includes('pt')) {
        defaultLang = 'pt';
    }
    
    const currentLang = localStorage.getItem('selectedLanguage') || defaultLang;
    
    // Definir idioma ativo
    languageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
        
        // Adicionar evento de clique
        btn.addEventListener('click', async function() {
            const selectedLang = this.dataset.lang;
            
            // Carregar traduções do idioma se necessário
            await loadTranslation(selectedLang);
            
            changeLanguage(selectedLang);
            
            // Atualizar botões ativos
            languageButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Salvar preferência
            localStorage.setItem('selectedLanguage', selectedLang);
        });
    });
    
    // Aplicar idioma salvo
    if (currentLang !== 'en') {
        changeLanguage(currentLang);
    } else {
        // Aplicar classe de idioma padrão
        document.body.setAttribute('data-lang', 'en');
    }
}

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            const translatedText = translations[lang][key];
            
            // Se o texto contém HTML (como <br>), usar innerHTML
            if (translatedText.includes('<br>') || translatedText.includes('<')) {
                element.innerHTML = translatedText;
            } else {
                element.textContent = translatedText;
            }
        }
    });
    
    // Atualizar placeholders se existirem
    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(element => {
        const keyData = element.getAttribute('data-translate-placeholder');
        
        // Suporta formato "key|default" para label|placeholder
        const parts = keyData.split('|');
        const key = parts[0];
        
        // Se tem traduções para esse idioma
        if (translations[lang]) {
            // Para português/espanhol, tentar traduzir
            if (lang !== 'en' && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            } else if (lang === 'en') {
                // Para inglês, usar o próprio key se não tiver tradução
                element.placeholder = key;
            }
        }
    });
    
    // Aplicar classe de idioma ao body para ajustes de CSS
    document.body.setAttribute('data-lang', lang);
    
    debugLog(`Language changed to: ${lang}`);
}

// ========== HERO CAROUSEL ========== //
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    let currentSlide = 0;
    let intervalId;
    
    // Auto-play interval (6 seconds per slide)
    function startAutoPlay() {
        intervalId = setInterval(nextSlide, 6000);
    }
    
    function stopAutoPlay() {
        clearInterval(intervalId);
    }
    
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });
    }
    
    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay();
        });
    });
    
    // Pause on hover
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });
    
    // Start the carousel
    startAutoPlay();
    
    debugLog('Hero Carousel initialized');
}



function showZipCodeSuccess(city, state) {
    const zipInput = document.getElementById('zipcode');
    if (zipInput) {
        // Adicionar uma pequena animação de sucesso
        zipInput.classList.add('zip-success');
        setTimeout(() => {
            zipInput.classList.remove('zip-success');
        }, 1000);
        
        // Mostrar tooltip temporário
        showZipTooltip(zipInput, `${city}, ${state}`);
    }
}

function showZipTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'zip-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--verde-vibrante);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        white-space: nowrap;
        animation: fadeIn 0.3s ease;
    `;
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    tooltip.style.left = rect.left + 'px';
    
    document.body.appendChild(tooltip);
    
    // Remover após 2 segundos
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => tooltip.remove(), 300);
        }
    }, 2000);
}
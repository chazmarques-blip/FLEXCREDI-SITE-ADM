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
                        documentsComplete: false,
                        contractSigned: false,
                        documents: {
                            driverLicense: { uploaded: false, approved: false, fileName: '', previewData: '' },
                            proofAddress: { uploaded: false, approved: false, fileName: '', previewData: '' },
                            socialSecurity: { uploaded: false, approved: false, fileName: '', previewData: '' },
                            bankCard: { uploaded: false, approved: false, fileName: '', previewData: '' }
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

// ========== SISTEMA DE IDIOMAS ========== //
const translations = {
    en: {
        // Navigation
        'About Us': 'About Us',
        'Our Services': 'Our Services',
        'Personal Credit': 'Personal Credit',
        'Business Credit': 'Business Credit', 
        'Debt Consolidation': 'Debt Consolidation',
        'Home Improvement': 'Home Improvement',
        'How It Works': 'How It Works',
        'FAQ': 'FAQ',
        'Contact': 'Contact',
        'Login': 'Login',
        'Apply Now': 'See My Offer',
        
        // Hero Section
        'Easy • Simple • Fast': 'Easy • Simple • Fast',
        'Your Financial Journey Starts Here': 'Your Business Investment Starts Here',
        'Empower your dreams with transparent, fast, and hassle-free credit. Designed for the Latino community in Florida.': 'Empower your dreams with transparent, fast, and hassle-free credit. Designed for the Latino community in Florida.',
        'Get Started Now': 'Get Started Now',
        
        // Form
        'Start Your Credit Application in Seconds!': 'Start Your Credit Application in Seconds!',
        'Fill out the form below to discover your credit availability': 'Fill out the form below to discover your credit availability',
        'Full Name': 'Full Name',
        'Social Security / Tax ID': 'Social Security / Tax ID',
        'Email': 'Email',
        'Phone/WhatsApp': 'Phone/WhatsApp',
        'Address': 'Address',
        'ZIP Code': 'ZIP Code',
        'City': 'City',
        'State': 'State',
        'Desired Amount': 'Desired Amount',
        'What do you need the credit for?': 'What do you need the credit for?',
        'Cash flow for my business': 'Cash flow for my business',
        'Pay a business partner of my company': 'Pay a business partner of my company',
        'Request Approval': 'Request Approval',
        'Home': 'Home',
        
        // Calculator
        'Loan Calculator': 'Loan Calculator',
        'Credit Score': 'Credit Score',
        'Loan Term (Months)': 'Loan Term (Months)',
        'Monthly Payment': 'Monthly Payment',
        '* Minimum credit score accepted is 500, subject to approval': '* Minimum credit score accepted is 500, subject to approval',
        'Easy Calculation': 'Easy Calculation',
        'Use our calculator to simulate your loan. Consider that values will be calculated based on your information and are approximate values. Final values will only be defined after complete credit analysis for contract signing.': 'Use our calculator to simulate your loan. Consider that values will be calculated based on your information and are approximate values. Final values will only be defined after complete credit analysis for contract signing.',
        
        // Benefits Section
        'Fair Rates': 'Fair Rates',
        'Dedicated Support': 'Dedicated Support',
        
        // Company Address
        'company-address': '5200 Old Winter Garden<br>Orlando Florida - Zip 32836',
        
        // Terms of Use
        'Terms of Use': 'Terms of Use',
        'Terms and conditions for using our financial services': 'Terms and conditions for using our financial services',
        'Acceptance of Terms': 'Acceptance of Terms',
        'terms-acceptance': 'Welcome to FLEXCREDI. By accessing and using our services, website or mobile application, you agree to comply with and be bound by these Terms of Use. If you do not agree to any part of these terms, you should not use our services.',
        'terms-binding': 'These terms constitute a binding legal agreement between you and FLEXCREDI. By using our services, you represent that you are at least 18 years old and have the legal capacity to enter into this agreement.',
        'Services Description': 'Services Description',
        'Financial Services': 'Financial Services',
        'services-description': 'FLEXCREDI offers the following financial services:',
        'personal-loans': 'Personal and business loans',
        'credit-evaluation': 'Credit evaluation and analysis',
        'loan-matching': 'Matching with partner lenders',
        'financial-consultation': 'Basic financial consultation',
        'online-platform': 'Online platform for application management',
        'Service Limitations': 'Service Limitations',
        'no-guarantee': 'We do not guarantee loan approval',
        'third-party-lenders': 'We work with licensed third-party lenders',
        'subject-to-approval': 'All loans are subject to credit approval',
        'compliance-requirements': 'Subject to state and federal regulatory requirements',
        'Eligibility Requirements': 'Eligibility Requirements',
        'Basic Requirements': 'Basic Requirements',
        'eligibility-intro': 'To use our services, you must meet the following criteria:',
        'age-requirement': 'Be at least 18 years old',
        'us-resident': 'Be a legal resident of the United States',
        'valid-ssn': 'Have a valid Social Security Number (SSN) or Individual Taxpayer Identification Number (ITIN)',
        'valid-id': 'Have valid government-issued identification',
        'active-bank': 'Maintain an active US bank account',
        'stable-income': 'Demonstrate stable and verifiable income',
        'credit-score': 'Minimum credit score of 500 (subject to approval)',
        'Prohibited Uses': 'Prohibited Uses',
        'false-information': 'Providing false or misleading information',
        'multiple-applications': 'Submitting multiple simultaneous applications',
        'illegal-activities': 'Using funds for illegal activities',
        'gambling-speculation': 'Using funds for gambling or speculation',
        'unauthorized-access': 'Attempting unauthorized access to our systems',
        'Application Process': 'Application Process',
        'Application Steps': 'Application Steps',
        'online-form': 'Completing the online form',
        'document-verification': 'Document and identity verification',
        'credit-check': 'Credit check (initial soft pull)',
        'income-verification': 'Income verification',
        'lender-matching': 'Matching with partner lenders',
        'final-approval': 'Final approval and contract signing',
        'Processing Time': 'Processing Time',
        'initial-review': 'Initial review: up to 24 hours',
        'full-underwriting': 'Complete analysis: 2-5 business days',
        'funding-time': 'Fund disbursement: 1-3 business days after approval',
        'Fees and Costs': 'Fees and Costs',
        'Our Fees': 'Our Fees',
        'application-fee': 'Application fee: FREE',
        'platform-fee': 'Platform fee: FREE',
        'early-consultation': 'Initial consultation: FREE',
        'Lender Fees': 'Lender Fees',
        'lender-fees-notice': 'Partner lenders may charge:',
        'origination-fee': 'Origination fee: 0-6% of loan amount',
        'interest-rates': 'Interest rates: 20-30% annually (based on credit score)',
        'late-fees': 'Late fees: as per lender contract',
        'prepayment-penalty': 'Prepayment penalty: varies by lender',
        'User Obligations': 'User Obligations',
        'Information Accuracy': 'Information Accuracy',
        'truthful-info': 'Provide truthful and complete information',
        'update-info': 'Keep information updated',
        'notify-changes': 'Notify changes in financial situation',
        'document-authenticity': 'Ensure authenticity of submitted documents',
        'Account Security': 'Account Security',
        'secure-password': 'Maintain secure and confidential password',
        'unauthorized-use': 'Report unauthorized use immediately',
        'logout-security': 'Log out on shared devices',
        'device-protection': 'Protect devices with account access',
        'Intellectual Property': 'Intellectual Property',
        'ip-ownership': 'All content, design, logos, trademarks and intellectual property on our website and platform are exclusively owned by FLEXCREDI or licensed to us.',
        'Usage Rights': 'Usage Rights',
        'personal-use': 'Personal and non-commercial use permitted',
        'no-copying': 'Unauthorized copying or reproduction prohibited',
        'no-reverse-engineering': 'Platform reverse engineering prohibited',
        'respect-trademarks': 'Respect all trademarks',
        'Liability Limitation': 'Liability Limitation',
        'Service Disclaimer': 'Service Disclaimer',
        'disclaimer-text': 'FLEXCREDI acts as an intermediary between borrowers and lenders. We are not a direct lender and do not guarantee:',
        'no-loan-guarantee': 'Approval or availability of loans',
        'no-rate-guarantee': 'Specific interest rates',
        'no-term-guarantee': 'Specific loan terms',
        'no-service-interruption': 'Uninterrupted platform availability',
        'Damages Limitation': 'Damages Limitation',
        'damages-limit': 'Under no circumstances shall FLEXCREDI be liable for indirect, consequential, special or punitive damages, including but not limited to loss of profits, data or business opportunities.',
        'Termination': 'Termination',
        'Voluntary Termination': 'Voluntary Termination',
        'voluntary-termination': 'You may close your account at any time by contacting us. Termination does not affect existing loan obligations.',
        'Involuntary Termination': 'Involuntary Termination',
        'involuntary-termination': 'We may suspend or terminate your account for:',
        'terms-violation': 'Violation of these terms',
        'fraudulent-activity': 'Suspected fraudulent activity',
        'legal-requirements': 'Legal or regulatory requirements',
        'General Provisions': 'General Provisions',
        'Governing Law': 'Governing Law',
        'governing-law': 'These terms are governed by the laws of the State of Florida and federal laws of the United States.',
        'Dispute Resolution': 'Dispute Resolution',
        'arbitration-clause': 'Disputes will be resolved through binding arbitration under American Arbitration Association rules, except for small claims which may be resolved in local court.',
        'Changes to Terms': 'Changes to Terms',
        'terms-changes': 'We may modify these terms at any time. Significant changes will be notified by email or through the platform.',
        'Contact Information': 'Contact Information',
        'contact-terms-intro': 'For questions about these Terms of Use, please contact us:',
        'Legal Department': 'Legal Department',
        'Legal Compliance': 'Legal Compliance',
        'compliance-statement': 'FLEXCREDI operates in compliance with:',
        'federal-laws': 'US federal lending and credit laws',
        'state-regulations': 'Florida state regulations',
        'cfpb-rules': 'Consumer Financial Protection Bureau (CFPB) rules',
        'fair-lending': 'Fair Lending Act and Equal Credit Opportunity Act',
        'truth-in-lending': 'Truth in Lending Act (TILA)',
        'electronic-signatures': 'Electronic Signatures in Global and National Commerce Act (E-SIGN)',
        'Back to Home': 'Back to Home',
        
        // Privacy Policy Translations
        'Privacy Policy': 'Privacy Policy',
        'How we collect, use, and protect your personal information': 'How we collect, use, and protect your personal information',
        'Last updated': 'Last updated',
        'Introduction': '1. Introduction',
        'privacy-intro': 'FLEXCREDI ("we", "our" or "company") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose and protect your information when you use our financial services, visit our website or interact with us in any way.',
        'privacy-commitment': 'By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.',
        'Information We Collect': '2. Information We Collect',
        'Personal Information': '2.1 Personal Information',
        'personal-info-desc': 'We collect the following personal information when you request our services:',
        'full-name-info': 'Full name',
        'ssn-info': 'Social Security Number (SSN) or Tax ID',
        'contact-info': 'Contact information (email, phone, address)',
        'employment-info': 'Employment and income information',
        'financial-info': 'Financial information (bank accounts, credit history)',
        'business-info': 'Business information (for business loans)',
        'Technical Information': '2.2 Technical Information',
        'device-info': 'Device and browser information',
        'ip-address': 'IP address and location',
        'cookies-info': 'Cookies and similar technologies',
        'usage-data': 'Website usage and navigation data',
        'How We Use Information': '3. How We Use Information',
        'info-usage-intro': 'We use your information for the following purposes:',
        'process-applications': 'Process and evaluate loan applications',
        'verify-identity': 'Verify your identity and prevent fraud',
        'credit-decisions': 'Make credit decisions based on risk analysis',
        'provide-services': 'Provide and maintain our financial services',
        'customer-support': 'Provide customer support and communication',
        'comply-laws': 'Comply with legal and regulatory obligations',
        'improve-services': 'Improve our products and services',
        'marketing-communications': 'Send marketing communications (with your consent)',
        'Information Sharing': '4. Information Sharing',
        'sharing-intro': 'We may share your information in the following circumstances:',
        'Third Party Services': '4.1 Third Party Service Providers',
        'credit-bureaus': 'Credit bureaus for verification and reports',
        'payment-processors': 'Payment processors and financial institutions',
        'identity-verification': 'Identity verification services',
        'technology-providers': 'Technology and infrastructure providers',
        'Legal Requirements': '4.2 Legal Requirements',
        'government-agencies': 'Government agencies as required by law',
        'court-orders': 'Court orders and subpoenas',
        'regulatory-compliance': 'Compliance with financial regulations',
        'Data Security': '5. Data Security',
        'security-intro': 'We implement technical, administrative and physical security measures to protect your information:',
        'encryption': 'SSL/TLS encryption for data transmission',
        'secure-servers': 'Secure servers and certified data centers',
        'access-controls': 'Access controls and multi-factor authentication',
        'employee-training': 'Regular employee security training',
        'security-audits': 'Security audits and penetration testing',
        'incident-response': 'Security incident response plans',
        'Your Rights': '6. Your Rights',
        'rights-intro': 'You have the following rights regarding your personal information:',
        'access-right': 'Right to access your personal information',
        'correction-right': 'Right to correct inaccurate information',
        'deletion-right': 'Right to request data deletion (subject to legal obligations)',
        'portability-right': 'Right to data portability',
        'objection-right': 'Right to object to processing for marketing',
        'complaint-right': 'Right to file complaints with competent authorities',
        'Data Retention': '7. Data Retention',
        'retention-policy': 'We retain your personal information for as long as necessary to:',
        'service-provision': 'Provide our services',
        'legal-obligations': 'Comply with legal and regulatory obligations',
        'dispute-resolution': 'Resolve disputes and enforce agreements',
        'retention-period': 'Generally, we retain customer data for 7 years after the end of the business relationship, as required by financial regulations.',
        'Cookies': '8. Cookies and Similar Technologies',
        'cookies-intro': 'We use cookies and similar technologies for:',
        'essential-cookies': 'Essential website functionality',
        'analytics-cookies': 'Performance and usage analytics',
        'preference-cookies': 'Remembering your preferences',
        'marketing-cookies': 'Content personalization (with consent)',
        'cookie-control': 'You can control cookies through your browser settings.',
        'Policy Changes': '9. Changes to this Policy',
        'changes-notice': 'We may update this Privacy Policy periodically. We will notify you of significant changes via email or notice on our website. The date of the last revision will always be indicated at the top of this page.',
        'Contact Us': '10. Contact Us',
        'contact-intro': 'If you have questions about this Privacy Policy or want to exercise your rights, contact us:',
        'Privacy Officer': 'Privacy Protection Officer',
        'Phone': 'Phone',
        'Regulatory Compliance': 'Regulatory Compliance',
        'compliance-info': 'This policy complies with the following regulations:',
        'fair-credit': 'Fair Credit Reporting Act (FCRA)',
        'gramm-leach': 'Gramm-Leach-Bliley Act (GLBA)',
        'equal-credit': 'Equal Credit Opportunity Act (ECOA)',
        'truth-lending': 'Truth in Lending Act (TILA)',
        'state-privacy': 'Applicable state privacy laws',
        'cfpb-regulations': 'Consumer Financial Protection Bureau (CFPB) regulations',
        
        // Carousel Business Dreams
        'See My Offer': 'See My Offer',
        'restaurant-dream': 'Transform Your Culinary Passion Into Reality',
        'restaurant-desc': 'From dream to customers\' tables. Expand your restaurant, buy equipment and conquer new flavors with our specialized credit.',
        'beauty-dream': 'Your Beauty Deserves A Dream Salon',
        'beauty-desc': 'Modern chairs, professional mirrors, quality products. Create the salon your clients deserve and you\'ve always dreamed of.',
        'construction-dream': 'Build Your Empire, Project by Project',
        'construction-desc': 'Professional tools, your own truck, qualified team. Transform your construction experience into a successful company.',
        'foodtruck-dream': 'Take Your Flavors To Every Corner',
        'foodtruck-desc': 'Equipped food truck, licenses up to date, strategic routes. Your family recipe can conquer the entire city.',
        'auto-dream': 'Your Skilled Hands Deserve A Complete Workshop',
        'auto-desc': 'Modern equipment, adequate space, professional tools. Transform your mechanical talent into the business of your life.',
        'retail-dream': 'Your Dream Store Is One Credit Away',
        'retail-desc': 'Diversified inventory, strategic commercial location, quality service. Be the shopping center of your community.',
        
        // Dashboard
        'Welcome': 'Welcome',
        'Dashboard': 'Dashboard',
        'Manage your credit applications and track your financial journey': 'Manage your credit applications and track your financial journey',
        'New Application': 'New Application',
        'Calculator': 'Calculator',
        'Available Credit': 'Available Credit',
        'My Applications': 'My Applications',
        'View All': 'View All',
        'Recent Activity': 'Recent Activity',
        'Credit Profile': 'Credit Profile',
        'Credit Score': 'Credit Score',
        'Good Credit': 'Good Credit',
        'Financial Overview': 'Financial Overview',
        '30 Days': '30 Days',
        '90 Days': '90 Days',
        '1 Year': '1 Year',
        'Total Applications': 'Total Applications',
        'Approved': 'Approved',
        'Total Amount': 'Total Amount',
        'Average Rate': 'Average Rate',
        'My Profile': 'My Profile',
        'Settings': 'Settings',
        'Help': 'Help',
        'Logout': 'Logout',
        'All rights reserved': 'All rights reserved',
        'Privacy Policy': 'Privacy Policy',
        'Terms of Use': 'Terms of Use',
        
        // Form Fields (Placeholders)
        'Full Name *': 'Full Name *',
        'Social Security / Tax ID *': 'Social Security / Tax ID *',
        'Email *': 'Email *',
        'Phone/WhatsApp *': 'Phone/WhatsApp *',
        'Address *': 'Address *',
        'ZIP Code *': 'ZIP Code *',
        'City *': 'City *',
        'State *': 'State *',
        
        // Document Upload
        'Take Photo': 'Take Photo',
        '1. ID Document': '1. ID Document',
        '2. Proof of Residence': '2. Proof of Residence',
        '3. Debit Card': '3. Debit Card',
        'Card Front': 'Card Front',
        'Card Back': 'Card Back',
        
        // About Page - Our Commitment
        'Our Commitment to You': 'Our Commitment to You',
        'Promises we make and keep every day': 'Promises we make and keep every day',
        'Total Transparency': 'Total Transparency',
        'All information about rates, terms and conditions is presented clearly from the first contact.': 'All information about rates, terms and conditions is presented clearly from the first contact.',
        'Humanized Service': 'Humanized Service',
        'Our team is always ready to answer your questions and support you at every step of the process.': 'Our team is always ready to answer your questions and support you at every step of the process.',
        'Guaranteed Security': 'Guaranteed Security',
        'Your personal and financial data is protected with the highest digital security standards.': 'Your personal and financial data is protected with the highest digital security standards.',
        'Agile Processes': 'Agile Processes',
        'We keep our processes simple and fast, always respecting the quality of the analysis.': 'We keep our processes simple and fast, always respecting the quality of the analysis.',
        
        // About Page - Statistics
        'FLEXCREDI in Numbers': 'FLEXCREDI in Numbers',
        'Our results reflect the positive impact we generate': 'Our results reflect the positive impact we generate',
        'Clients Served': 'Clients Served',
        'People and companies who trusted our services': 'People and companies who trusted our services',
        'Credit Released': 'Credit Released',
        'Total volume of credit made available': 'Total volume of credit made available',
        'Customer Rating': 'Customer Rating',
        'Average rating based on thousands of reviews': 'Average rating based on thousands of reviews',
        'Average Release Time': 'Average Release Time',
        'Speed that makes the difference when you need it': 'Speed that makes the difference when you need it',
        
        // About Page - Our Story
        'Our Story': 'Our Story',
        'See My Offer': 'See My Offer',
        
        // About Page - Our Values
        'Our Values': 'Our Values',
        'The principles that guide every decision and action at FLEXCREDI': 'The principles that guide every decision and action at FLEXCREDI',
        'Transparency': 'Transparency',
        'We believe trust is built through total clarity. That is why all our rates, terms and conditions are presented clearly, without fine print or tricks. Our clients always know exactly what they are contracting.': 'We believe trust is built through total clarity. That is why all our rates, terms and conditions are presented clearly, without fine print or tricks. Our clients always know exactly what they are contracting.',
        'Integrity': 'Integrity',
        'We act with honesty and ethics in all our relationships. Our word is our commitment, and we always seek to do what is right, even when no one is watching. Integrity is the foundation of everything we do.': 'We act with honesty and ethics in all our relationships. Our word is our commitment, and we always seek to do what is right, even when no one is watching. Integrity is the foundation of everything we do.',
        'Customer Focus': 'Customer Focus',
        'We put our customers at the center of everything we do. Every decision is made thinking about how we can improve their experience and help them achieve their financial goals responsibly and sustainably.': 'We put our customers at the center of everything we do. Every decision is made thinking about how we can improve their experience and help them achieve their financial goals responsibly and sustainably.',
        'Innovation': 'Innovation',
        'We are always looking for better and more efficient ways to serve our customers. We use cutting-edge technology to simplify processes and create solutions that truly make a difference in peoples lives.': 'We are always looking for better and more efficient ways to serve our customers. We use cutting-edge technology to simplify processes and create solutions that truly make a difference in peoples lives.',
        'Agility': 'Agility',
        'We know time is money, especially when it comes to credit. Our processes are designed to be fast and efficient, without sacrificing quality or security. We want you to have access to credit when you need it.': 'We know time is money, especially when it comes to credit. Our processes are designed to be fast and efficient, without sacrificing quality or security. We want you to have access to credit when you need it.',
        'Social Responsibility': 'Social Responsibility',
        'We understand our role in community development. In addition to offering fair credit, we invest in financial education and support initiatives that promote social and economic inclusion.': 'We understand our role in community development. In addition to offering fair credit, we invest in financial education and support initiatives that promote social and economic inclusion.',
        
        // About Page - Mission, Vision, Purpose
        'Our Mission': 'Our Mission',
        'Our Vision': 'Our Vision',
        'Our Purpose': 'Our Purpose',
        'Democratize access to credit in the United States, offering fair and transparent financial solutions to the Hispanic community, with speed and respect.': 'Democratize access to credit in the United States, offering fair and transparent financial solutions to the Hispanic community, with speed and respect.',
        'To be the most trusted financial partner for families and businesses in the Hispanic community, recognized for our commitment to transparency and positive social impact.': 'To be the most trusted financial partner for families and businesses in the Hispanic community, recognized for our commitment to transparency and positive social impact.',
        'Every person deserves access to fair credit opportunities. We exist to remove barriers and create paths to financial success for our clients.': 'Every person deserves access to fair credit opportunities. We exist to remove barriers and create paths to financial success for our clients.',
        
        // About Page - Our Story Content
        'story-intro': 'FLEXCREDI was born from identifying a real need: easy access to credit for small entrepreneurs and people seeking to achieve their dreams responsibly.',
        'story-observation': 'We observed that the traditional financial market often creates unnecessary barriers, creating bureaucratic processes that make it difficult for those who really need credit to access it. This is how our mission to democratize access to financial solutions was born.',
        'story-focus': 'Focusing on the Latino community in Florida, we developed an approach that combines advanced technology with humanized service, always maintaining our core promise: <strong>Easy, Simple, Fast</strong>.',
        'story-philosophy': 'From the beginning, our philosophy is clear: offer responsible credit, with total transparency and simplified processes, so our clients can focus on what really matters - making their projects happen and growing their businesses.',
        
        // Timeline
        'The Idea': 'The Idea',
        'idea-description': 'Identifying the need to democratize access to credit in Florida\'s Latino community.',
        'Development': 'Development',
        'development-description': 'Creating a robust and secure technology platform, focused on user experience.',
        'Launch': 'Launch',
        'launch-description': 'Starting operations with focus on fast, simple and transparent credit.',
        'Growth': 'Growth',
        'growth-description': 'Expanding services and earning the trust of thousands of satisfied clients.',
        'Future': 'Future',
        'future-description': 'Continuing to innovate and expand our positive impact on the community.',
        
        // CTA Section
        'Ready to Experience FLEXCREDI?': 'Ready to Experience FLEXCREDI?',
        'Join our community of satisfied customers and discover how credit can be easy, simple and fast.': 'Join our community of satisfied customers and discover how credit can be easy, simple and fast.',
        'Talk to Our Team': 'Talk to Our Team',
        'Free simulation, no commitment • Analysis in seconds': 'Free simulation, no commitment • Analysis in seconds',
        
        // Services Page
        'Find the ideal credit solution for you': 'Find the ideal credit solution for you',
        'At FLEXCREDI, we understand that each person has unique needs. That\'s why we\'ve developed a complete range of credit services to meet diverse objectives, always with our promise to be Easy, Simple, Fast.': 'At FLEXCREDI, we understand that each person has unique needs. That\'s why we\'ve developed a complete range of credit services to meet diverse objectives, always with our promise to be Easy, Simple, Fast.',
        'Our Credit Products': 'Our Credit Products',
        'Flexible Personal Credit': 'Flexible Personal Credit',
        'For your personal and family needs': 'For your personal and family needs',
        'FLEXCREDI\'s personal credit is the ideal solution for those who need quick money to resolve personal or family matters. Whether for an emergency, education, health, or any other personal project.': 'FLEXCREDI\'s personal credit is the ideal solution for those who need quick money to resolve personal or family matters. Whether for an emergency, education, health, or any other personal project.',
        'Features:': 'Features:',
        'Amounts from $1,000 to $25,000': 'Amounts from $1,000 to $25,000',
        'Terms from 6 to 48 months': 'Terms from 6 to 48 months',
        'Interest rates starting at 8.5% APR': 'Interest rates starting at 8.5% APR',
        'Funding within 24 hours': 'Funding within 24 hours',
        'No hard credit check required*': 'No hard credit check required*',
        '100% online process': '100% online process',
        'Ideal for:': 'Ideal for:',
        'Medical Emergencies': 'Medical Emergencies',
        'Education': 'Education',
        'Travel': 'Travel',
        'Weddings': 'Weddings',
        'Personal Expenses': 'Personal Expenses',
        'Learn More': 'Learn More',
        'Credit to Boost Your Business': 'Credit to Boost Your Business',
        'Working capital and investment for entrepreneurs': 'Working capital and investment for entrepreneurs',
        'Specially developed for small and medium entrepreneurs who need capital to expand, invest in equipment, purchase inventory, or maintain business working capital up to date.': 'Specially developed for small and medium entrepreneurs who need capital to expand, invest in equipment, purchase inventory, or maintain business working capital up to date.',
        'Amounts from $5,000 to $100,000': 'Amounts from $5,000 to $100,000',
        'Terms from 12 to 60 months': 'Terms from 12 to 60 months',
        'Special rates for entrepreneurs': 'Special rates for entrepreneurs',
        'Personalized business analysis': 'Personalized business analysis',
        'Grace period up to 90 days': 'Grace period up to 90 days',
        'Financial consulting included': 'Financial consulting included',
        'Working Capital': 'Working Capital',
        'Equipment Purchase': 'Equipment Purchase',
        'Business Expansion': 'Business Expansion',
        'Inventory': 'Inventory',
        'Commercial Renovations': 'Commercial Renovations',
        'Smart Debt Consolidation': 'Smart Debt Consolidation',
        'Reorganize your finances intelligently': 'Reorganize your finances intelligently',
        'Transform multiple expensive debts into a single payment with better conditions. Our consolidation solution helps you reorganize your finances and regain control of your budget.': 'Transform multiple expensive debts into a single payment with better conditions. Our consolidation solution helps you reorganize your finances and regain control of your budget.',
        'Amounts from $2,000 to $25,000': 'Amounts from $2,000 to $25,000',
        'Lower rates than credit cards': 'Lower rates than credit cards',
        'Consolidates multiple debts into one': 'Consolidates multiple debts into one',
        'Free financial planning': 'Free financial planning',
        'Discount for full payment': 'Discount for full payment',
        'Credit Cards': 'Credit Cards',
        'Overdraft': 'Overdraft',
        'Financing': 'Financing',
        'High-Interest Loans': 'High-Interest Loans',
        'Financial Reorganization': 'Financial Reorganization',
        'Discover the ideal credit solution for your needs. We offer flexible, transparent, and personalized options to achieve your goals.': 'Discover the ideal credit solution for your needs. We offer flexible, transparent, and personalized options to achieve your goals.',
        
        // How It Works Page
        'How It Works': 'How It Works',
        'Get your credit approved in just 4 simple steps. Our streamlined process is designed to be fast, transparent, and hassle-free.': 'Get your credit approved in just 4 simple steps. Our streamlined process is designed to be fast, transparent, and hassle-free.',
        'Our Simple 4-Step Process': 'Our Simple 4-Step Process',
        'From application to approval in as little as 24 hours': 'From application to approval in as little as 24 hours',
        'Fill Out Application': 'Fill Out Application',
        'Complete our quick online form with your personal and financial information. It takes less than 5 minutes and is 100% secure.': 'Complete our quick online form with your personal and financial information. It takes less than 5 minutes and is 100% secure.',
        'Quick 5-minute form': 'Quick 5-minute form',
        'Bank-level security': 'Bank-level security',
        'No paperwork required': 'No paperwork required',
        'Instant Analysis': 'Instant Analysis',
        'Our advanced system analyzes your information instantly and provides you with a preliminary credit decision in seconds.': 'Our advanced system analyzes your information instantly and provides you with a preliminary credit decision in seconds.',
        'Instant pre-approval': 'Instant pre-approval',
        'Credit limit estimation': 'Credit limit estimation',
        'Personalized rates': 'Personalized rates',
        'Document Verification': 'Document Verification',
        'Upload your documents securely through our platform. Our team reviews everything quickly to ensure fast processing.': 'Upload your documents securely through our platform. Our team reviews everything quickly to ensure fast processing.',
        'Secure document upload': 'Secure document upload',
        
        // Contact Page
        'Contact Our Expert Team': 'Contact Our Expert Team',
        'Get personalized support from our bilingual credit specialists. We\'re here to help you achieve your financial goals.': 'Get personalized support from our bilingual credit specialists. We\'re here to help you achieve your financial goals.',
        'Phone Support': 'Phone Support',
        'Speak directly with our credit experts': 'Speak directly with our credit experts',
        'Monday - Friday: 8 AM - 8 PM EST': 'Monday - Friday: 8 AM - 8 PM EST',
        'Saturday: 9 AM - 5 PM EST': 'Saturday: 9 AM - 5 PM EST',
        'Call Now': 'Call Now',
        'WhatsApp Chat': 'WhatsApp Chat',
        'Quick answers to your questions': 'Quick answers to your questions',
        'Available 7 days a week': 'Available 7 days a week',
        'Response time: Under 1 hour': 'Response time: Under 1 hour',
        'Chat Now': 'Chat Now',
        'Email Support': 'Email Support',
        'Detailed assistance for complex questions': 'Detailed assistance for complex questions',
        'We respond within 24 hours': 'We respond within 24 hours',
        'Available in English & Spanish': 'Available in English & Spanish',
        'Send Email': 'Send Email',
        
        // Footer
        'Empower your dreams with easy, simple and fast credit.': 'Empower your dreams with easy, simple and fast credit.',
        'Quick Links': 'Quick Links',
        'Contact Us': 'Contact Us',
        'Florida, United States': 'Florida, United States',
        'All rights reserved': 'All rights reserved',
        'Client Area': 'Client Area'
    },
    es: {
        // Navigation
        'About Us': 'Acerca de',
        'Our Services': 'Nuestros Servicios',
        'Personal Credit': 'Crédito Personal',
        'Business Credit': 'Crédito Empresarial',
        'Debt Consolidation': 'Consolidación de Deudas',
        'Home Improvement': 'Mejoras del Hogar',
        'How It Works': 'Cómo Funciona',
        'FAQ': 'Preguntas Frecuentes',
        'Contact': 'Contacto',
        'Login': 'Iniciar Sesión',
        'Apply Now': 'Ver Mi Oferta',
        
        // Hero Section
        'Easy • Simple • Fast': 'Fácil • Simple • Rápido',
        'Your Financial Journey Starts Here': 'La Inversión Para Tu Negocio Comienza Aquí',
        'Empower your dreams with transparent, fast, and hassle-free credit. Designed for the Latino community in Florida.': 'Empodera tus sueños con crédito transparente, rápido y sin complicaciones. Diseñado para la comunidad latina en Florida.',
        'Get Started Now': 'Comienza Ahora',
        
        // Form
        'Start Your Credit Application in Seconds!': '¡Inicia Tu Solicitud de Crédito en Segundos!',
        'Fill out the form below to discover your credit availability': 'Completa el formulario para descubrir tu disponibilidad de crédito',
        'Full Name': 'Nombre Completo',
        'Social Security / Tax ID': 'Seguro Social / ID Fiscal',
        'Email': 'Correo Electrónico',
        'Phone/WhatsApp': 'Teléfono/WhatsApp',
        'Address': 'Dirección',
        'ZIP Code': 'Código Postal',
        'City': 'Ciudad',
        'State': 'Estado',
        'Desired Amount': 'Cantidad Deseada',
        'What do you need the credit for?': '¿Para qué necesitas el crédito?',
        'Cash flow for my business': 'Flujo de caja para mi negocio',
        'Pay a business partner of my company': 'Pagar un socio comercial de mi empresa',
        'Request Approval': 'Ver Mi Oferta',
        'Home': 'Inicio',
        
        // Calculator
        'Loan Calculator': 'Calculadora de Préstamo',
        'Credit Score': 'Puntaje de Crédito',
        'Loan Term (Months)': 'Plazo (Meses)',
        'Monthly Payment': 'Pago Mensual',
        '* Minimum credit score accepted is 500, subject to approval': '* Puntaje mínimo aceptado es 500, sujeto a aprobación',
        'Easy Calculation': 'Cálculo Fácil',
        'Use our calculator to simulate your loan. Consider that values will be calculated based on your information and are approximate values. Final values will only be defined after complete credit analysis for contract signing.': 'Utilice nuestra calculadora para simular su préstamo. Considere que los valores se calcularán basados en su información y son valores aproximados. Los valores finales solo se definirán después del análisis completo de crédito para la firma del contrato.',
        
        // Benefits Section
        'Fair Rates': 'Tarifas Justas',
        'Dedicated Support': 'Soporte Dedicado',
        
        // Why Apply Section
        'Why Apply with FLEXCREDI?': '¿Por Qué Solicitar con FLEXCREDI?',
        'Discover the advantages that make us the best choice': 'Descubre las ventajas que nos convierten en la mejor opción',
        'Instant Analysis': 'Análisis Instantáneo',
        'Get a response in seconds about your credit availability, without unnecessary bureaucracy.': 'Obtenga una respuesta en segundos sobre su disponibilidad de crédito, sin burocracia innecesaria.',
        '100% Secure': '100% Seguro',
        'Your data is protected with bank-level encryption. Total security guaranteed.': 'Sus datos están protegidos con cifrado de nivel bancario. Seguridad total garantizada.',
        'We offer the best rates in the market, always transparent and without hidden fees.': 'Ofrecemos las mejores tarifas del mercado, siempre transparentes y sin comisiones ocultas.',
        'Our team is ready to help you at every step of the process, whenever you need.': 'Nuestro equipo está listo para ayudarle en cada paso del proceso, cuando lo necesite.',
        'Customer Rating: 4.8/5': 'Calificación del Cliente: 4.8/5',
        
        // Why Choose Section
        'Why Choose FLEXCREDI?': '¿Por Qué Elegir FLEXCREDI?',
        'Our advantages make the difference in your financial journey': 'Nuestras ventajas marcan la diferencia en su viaje financiero',
        'Simplified Process': 'Proceso Simplificado',
        'No excessive paperwork. Everything online, fast and intuitive. You don\'t waste time with unnecessary bureaucracy.': 'Sin papeleo excesivo. Todo en línea, rápido e intuitivo. No pierde tiempo con burocracia innecesaria.',
        'Fast Approval': 'Aprobación Rápida',
        'Analysis in minutes, same-day approval. When you need it, we\'re ready to help.': 'Análisis en minutos, aprobación el mismo día. Cuando lo necesita, estamos listos para ayudar.',
        'Complete transparency in rates and conditions. No surprises, no fine print, no tricks.': 'Transparencia completa en tarifas y condiciones. Sin sorpresas, sin letra pequeña, sin trucos.',
        'Total Security': 'Seguridad Total',
        'Data protection with bank-level encryption and compliance with all financial regulations.': 'Protección de datos con cifrado de nivel bancario y cumplimiento de todas las regulaciones financieras.',
        'Personalized service with specialists ready to clarify your doubts and support your decisions.': 'Servicio personalizado con especialistas listos para aclarar sus dudas y apoyar sus decisiones.',
        'Flexibility': 'Flexibilidad',
        'Payments that fit your budget with personalized options for your financial reality.': 'Pagos que se ajustan a su presupuesto con opciones personalizadas para su realidad financiera.',
        
        // Success Stories Section
        'Florida Success Stories': 'Historias de Éxito de Florida',
        'Real stories from Latino entrepreneurs who achieved their dreams with FLEXCREDI': 'Historias reales de emprendedores latinos que lograron sus sueños con FLEXCREDI',
        
        // Rosa Martinez Story
        'Rosa Martinez': 'Rosa Martinez',
        'Rosa\'s Kitchen - Miami, FL': 'Rosa\'s Kitchen - Miami, FL',
        '🇨🇴 From Colombia': '🇨🇴 De Colombia',
        'Started with a small food stand, now I have my own restaurant! FLEXCREDI\'s $15,000 loan helped me lease a space and buy essential equipment. We serve authentic Colombian arepas and empanadas!': '¡Comencé con un pequeño puesto de comida, ahora tengo mi propio restaurante! El préstamo de $15,000 de FLEXCREDI me ayudó a alquilar un espacio y comprar equipo esencial. ¡Servimos arepas y empanadas colombianas auténticas!',
        '$15,000 Credit': '$15,000 de Crédito',
        'Food Stand to Restaurant': 'De Puesto a Restaurante',
        '3 Employees': '3 Empleados',
        
        // Maria & José García Story
        'Maria & José García': 'Maria & José García',
        'García Cleaning Services - Jacksonville, FL': 'García Servicios de Limpieza - Jacksonville, FL',
        '🇨🇺 From Cuba': '🇨🇺 De Cuba',
        'We started cleaning offices after work hours. FLEXCREDI\'s $5,500 loan helped us buy professional equipment and supplies. Now we have 12 regular clients and it\'s our full-time business!': 'Comenzamos limpiando oficinas después del horario de trabajo. El préstamo de $5,500 de FLEXCREDI nos ayudó a comprar equipo y suministros profesionales. ¡Ahora tenemos 12 clientes regulares y es nuestro negocio de tiempo completo!',
        '$5,500 Credit': '$5,500 de Crédito',
        'Cleaning Equipment': 'Equipo de Limpieza',
        '12 Clients': '12 Clientes',
        
        // Ana Silva Story
        'Ana Silva': 'Ana Silva',
        'Bella Hair Salon - Fort Lauderdale, FL': 'Salón Bella Hair - Fort Lauderdale, FL',
        '🇧🇷 From Brazil': '🇧🇷 De Brasil',
        'I needed equipment to open my beauty salon. FLEXCREDI\'s $18,000 loan covered chairs, mirrors, and all styling tools. My Brazilian hair treatments are now famous in the area!': 'Necesitaba equipo para abrir mi salón de belleza. El préstamo de $18,000 de FLEXCREDI cubrió sillas, espejos y todas las herramientas de peinado. ¡Mis tratamientos capilares brasileños ahora son famosos en el área!',
        '$18,000 Credit': '$18,000 de Crédito',
        'Salon Equipment': 'Equipo del Salón',
        '2 Stylists': '2 Estilistas',
        
        // Additional missing translations
        'Over 10,000 satisfied customers with our services': 'Más de 10,000 clientes satisfechos con nuestros servicios',
        'company-address': '5200 Old Winter Garden<br>Orlando Florida - Zip 32836',
        'Select an option': 'Seleccione una opción',
        'Business Investment': 'Inversión Empresarial',
        'Travel': 'Viajes',
        'Education': 'Educación',
        'Medical Expenses': 'Gastos Médicos',
        'Vehicle Purchase/Repair': 'Compra/Reparación de Vehículo',
        'Other': 'Otro',
        'I have read and accept the': 'He leído y acepto la',
        'Privacy Policy': 'Política de Privacidad',
        'and': 'y',
        'Terms of Use': 'Términos de Uso',
        'Your data is secure and protected': 'Sus datos están seguros y protegidos',
        'Security & Trust': 'Seguridad y Confianza',
        'Your information is protected with bank-level security standards': 'Su información está protegida con estándares de seguridad de nivel bancario',
        'Empowering Every Type of Small Business': 'Empoderando Todo Tipo de Pequeñas Empresas',
        
        // Luis & Carmen Valdez Story
        'Luis & Carmen Valdez': 'Luis & Carmen Valdez',
        'Valdez Bakery - Orlando, FL': 'Panadería Valdez - Orlando, FL',
        '🇲🇽 From Mexico': '🇲🇽 De México',
        'Our family bakery was just a dream. With FLEXCREDI\'s $8,500 loan, we bought a professional oven and started our business. Now we make traditional Mexican sweet bread and supply local cafés!': 'Nuestra panadería familiar era solo un sueño. Con el préstamo de $8,500 de FLEXCREDI, compramos un horno profesional y comenzamos nuestro negocio. ¡Ahora hacemos pan dulce mexicano tradicional y suministramos a cafés locales!',
        '$8,500 Credit': '$8,500 de Crédito',
        'Family Business': 'Negocio Familiar',
        '6 Clients': '6 Clientes',
        
        // Carlos Hernandez Story
        'Carlos Hernandez': 'Carlos Hernandez',
        'Hernandez Handyman - Tampa, FL': 'Hernandez Servicios - Tampa, FL',
        '🇻🇪 From Venezuela': '🇻🇪 De Venezuela',
        'I needed tools and a work van to start my handyman business. FLEXCREDI\'s $12,000 loan helped me buy everything I needed. Now I have regular clients and steady income!': 'Necesitaba herramientas y una camioneta de trabajo para comenzar mi negocio de servicios. El préstamo de $12,000 de FLEXCREDI me ayudó a comprar todo lo que necesitaba. ¡Ahora tengo clientes regulares e ingresos estables!',
        '$12,000 Credit': '$12,000 de Crédito',
        'Tools & Van': 'Herramientas y Camioneta',
        'Solo Business': 'Negocio Individual',
        
        // Business Types
        'Beauty Salons': 'Salones de Belleza',
        'Hair styling & beauty services': 'Servicios de peluquería y belleza',
        'Barbershops': 'Barberías',
        'Professional men\'s grooming': 'Cuidado masculino profesional',
        'Cleaning Services': 'Servicios de Limpieza',
        'Commercial & residential': 'Comercial y residencial',
        
        // New business categories
        'Food Trucks & Taquerias': 'Food Trucks y Taquerías',
        'Mobile kitchens & restaurants': 'Cocinas móviles y restaurantes',
        'Bakeries & Pastries': 'Panaderías y Pastelerías',
        'Traditional & specialty breads': 'Panes tradicionales y especiales',
        'Auto Repair Shops': 'Talleres de Reparación',
        'Mechanical & maintenance services': 'Servicios mecánicos y mantenimiento',
        'Construction & Handyman': 'Construcción y Servicios Varios',
        'Building & renovation services': 'Servicios de construcción y renovación',
        'Professional Services': 'Servicios Profesionales',
        'Consulting & business services': 'Consultoría y servicios empresariales',
        
        // Community impact section
        'Empowering Florida\'s Latino Community': 'Empoderando la Comunidad Latina de Florida',
        'We\'re proud to support over 10,000 Latino entrepreneurs across Florida, from Miami-Dade to Jacksonville, helping build stronger communities one business at a time.': 'Estamos orgullosos de apoyar a más de 10,000 empresarios latinos en toda Florida, desde Miami-Dade hasta Jacksonville, ayudando a construir comunidades más fuertes un negocio a la vez.',
        'Invested in Latino Businesses': 'Invertido en Empresas Latinas',
        'Families Supported': 'Familias Apoyadas',
        'Jobs Created': 'Empleos Creados',
        'Counties Served': 'Condados Servidos',
        
        // Business diversity section
        'Whatever Your Business Dream, We\'re Here to Fund It': 'Cualquiera Que Sea Su Sueño Empresarial, Estamos Aquí Para Financiarlo',
        'Join thousands of successful Latino entrepreneurs who trusted FLEXCREDI to fuel their business growth': 'Únase a miles de empresarios latinos exitosos que confiaron en FLEXCREDI para impulsar el crecimiento de su negocio',
        'Start Your Application': 'Inicie Su Solicitud',
        
        // Trust section
        'Your Financial Partner for Success': 'Su Socio Financiero Para el Éxito',
        'At FLEXCREDI, we believe that trust is the foundation of every successful financial relationship. Our personalized approach ensures you get the support you need to achieve your goals.': 'En FLEXCREDI, creemos que la confianza es la base de toda relación financiera exitosa. Nuestro enfoque personalizado asegura que obtenga el apoyo que necesita para lograr sus objetivos.',
        'Personal Relationship': 'Relación Personal',
        'Direct contact with experienced professionals who understand your needs': 'Contacto directo con profesionales experimentados que comprenden sus necesidades',
        'Growth Focused': 'Enfocado en el Crecimiento',
        'We help you build not just credit, but a sustainable financial future': 'Le ayudamos a construir no solo crédito, sino un futuro financiero sostenible',
        'Speak to an Advisor': 'Hable con un Asesor',
        
        // About section
        'About FLEXCREDI': 'Acerca de FLEXCREDI',
        'Empowering people and businesses with accessible, transparent and efficient financial solutions, focused on entrepreneurship and community development in Florida.': 'Empoderando a personas y empresas con soluciones financieras accesibles, transparentes y eficientes, enfocadas en el emprendimiento y desarrollo comunitario en Florida.',
        'Our Mission': 'Nuestra Misión',
        'Make credit accessible to those who really need it, without unnecessary bureaucracy and with total transparency.': 'Hacer el crédito accesible para quienes realmente lo necesitan, sin burocracia innecesaria y con total transparencia.',
        'Our Vision': 'Nuestra Visión',
        'Be the reference in flexible, simple and fast credit, recognized for moving the economy from the base.': 'Ser la referencia en crédito flexible, simple y rápido, reconocida por mover la economía desde la base.',
        'Learn Our Story': 'Conozca Nuestra Historia',
        'Clients Served': 'Clientes Atendidos',
        'Credit Released': 'Crédito Liberado',
        'Average Rating': 'Calificación Promedio',
        'Average Release': 'Liberación Promedio',
        
        // Final CTA
        'Ready to Make Your Plans Come True?': '¿Listo Para Hacer Realidad Sus Planes?',
        'Join over 10,000 people who have already transformed their lives with FLEXCREDI': 'Únase a más de 10,000 personas que ya han transformado sus vidas con FLEXCREDI',
        'SSL Protected Site • Encrypted Data • 100% Secure': 'Sitio Protegido SSL • Datos Cifrados • 100% Seguro',
        
        // Terms of Use
        'Terms of Use': 'Términos de Uso',
        'Terms and conditions for using our financial services': 'Términos y condiciones para usar nuestros servicios financieros',
        'Acceptance of Terms': 'Aceptación de Términos',
        'terms-acceptance': 'Bienvenido a FLEXCREDI. Al acceder y usar nuestros servicios, sitio web o aplicación móvil, usted acepta cumplir y estar sujeto a estos Términos de Uso. Si no está de acuerdo con cualquier parte de estos términos, no debe usar nuestros servicios.',
        'terms-binding': 'Estos términos constituyen un acuerdo legal vinculante entre usted y FLEXCREDI. Al usar nuestros servicios, usted declara que tiene al menos 18 años y capacidad legal para celebrar este acuerdo.',
        'Services Description': 'Descripción de Servicios',
        'Financial Services': 'Servicios Financieros',
        'services-description': 'FLEXCREDI ofrece los siguientes servicios financieros:',
        'personal-loans': 'Préstamos personales y comerciales',
        'credit-evaluation': 'Evaluación y análisis de crédito',
        'loan-matching': 'Emparejamiento con prestamistas socios',
        'financial-consultation': 'Consultoría financiera básica',
        'online-platform': 'Plataforma en línea para gestión de aplicaciones',
        'Service Limitations': 'Limitaciones del Servicio',
        'no-guarantee': 'No garantizamos aprobación de préstamos',
        'third-party-lenders': 'Trabajamos con prestamistas terceros licenciados',
        'subject-to-approval': 'Todos los préstamos están sujetos a aprobación de crédito',
        'compliance-requirements': 'Sujeto a requisitos regulatorios estatales y federales',
        'Eligibility Requirements': 'Requisitos de Elegibilidad',
        'Basic Requirements': 'Requisitos Básicos',
        'eligibility-intro': 'Para usar nuestros servicios, debe cumplir con los siguientes criterios:',
        'age-requirement': 'Tener al menos 18 años de edad',
        'us-resident': 'Ser residente legal de Estados Unidos',
        'valid-ssn': 'Tener un Número de Seguro Social (SSN) o Número de Identificación de Contribuyente Individual (ITIN) válido',
        'valid-id': 'Tener identificación válida emitida por el gobierno',
        'active-bank': 'Mantener una cuenta bancaria activa en EE.UU.',
        'stable-income': 'Demostrar ingresos estables y verificables',
        'credit-score': 'Puntaje de crédito mínimo de 500 (sujeto a aprobación)',
        'Prohibited Uses': 'Usos Prohibidos',
        'false-information': 'Proporcionar información falsa o engañosa',
        'multiple-applications': 'Enviar múltiples aplicaciones simultáneas',
        'illegal-activities': 'Usar fondos para actividades ilegales',
        'gambling-speculation': 'Usar fondos para juegos de azar o especulación',
        'unauthorized-access': 'Intentar acceso no autorizado a nuestros sistemas',
        'Application Process': 'Proceso de Aplicación',
        'Application Steps': 'Pasos de la Aplicación',
        'online-form': 'Completar el formulario en línea',
        'document-verification': 'Verificación de documentos e identidad',
        'credit-check': 'Verificación de crédito (consulta suave inicial)',
        'income-verification': 'Verificación de ingresos',
        'lender-matching': 'Emparejamiento con prestamistas socios',
        'final-approval': 'Aprobación final y firma de contratos',
        'Processing Time': 'Tiempo de Procesamiento',
        'initial-review': 'Revisión inicial: hasta 24 horas',
        'full-underwriting': 'Análisis completo: 2-5 días hábiles',
        'funding-time': 'Desembolso de fondos: 1-3 días hábiles después de la aprobación',
        'Fees and Costs': 'Tarifas y Costos',
        'Our Fees': 'Nuestras Tarifas',
        'application-fee': 'Tarifa de aplicación: GRATIS',
        'platform-fee': 'Tarifa de plataforma: GRATIS',
        'early-consultation': 'Consulta inicial: GRATIS',
        'Lender Fees': 'Tarifas del Prestamista',
        'lender-fees-notice': 'Los prestamistas socios pueden cobrar:',
        'origination-fee': 'Tarifa de originación: 0-6% del monto del préstamo',
        'interest-rates': 'Tasas de interés: 20-30% anualmente (basada en puntaje de crédito)',
        'late-fees': 'Tarifas por mora: según contrato del prestamista',
        'prepayment-penalty': 'Penalidad por pago anticipado: varía por prestamista',
        'User Obligations': 'Obligaciones del Usuario',
        'Information Accuracy': 'Precisión de la Información',
        'truthful-info': 'Proporcionar información veraz y completa',
        'update-info': 'Mantener información actualizada',
        'notify-changes': 'Notificar cambios en situación financiera',
        'document-authenticity': 'Garantizar autenticidad de documentos enviados',
        'Account Security': 'Seguridad de la Cuenta',
        'secure-password': 'Mantener contraseña segura y confidencial',
        'unauthorized-use': 'Reportar uso no autorizado inmediatamente',
        'logout-security': 'Cerrar sesión en dispositivos compartidos',
        'device-protection': 'Proteger dispositivos con acceso a la cuenta',
        'Intellectual Property': 'Propiedad Intelectual',
        'ip-ownership': 'Todo el contenido, diseño, logotipos, marcas registradas y propiedad intelectual en nuestro sitio web y plataforma son propiedad exclusiva de FLEXCREDI o licenciados para nosotros.',
        'Usage Rights': 'Derechos de Uso',
        'personal-use': 'Uso personal y no comercial permitido',
        'no-copying': 'Copia o reproducción no autorizada prohibida',
        'no-reverse-engineering': 'Ingeniería inversa de la plataforma prohibida',
        'respect-trademarks': 'Respetar todas las marcas registradas',
        'Liability Limitation': 'Limitación de Responsabilidad',
        'Service Disclaimer': 'Exención de Responsabilidad del Servicio',
        'disclaimer-text': 'FLEXCREDI actúa como intermediario entre prestatarios y prestamistas. No somos un prestamista directo y no garantizamos:',
        'no-loan-guarantee': 'Aprobación o disponibilidad de préstamos',
        'no-rate-guarantee': 'Tasas de interés específicas',
        'no-term-guarantee': 'Términos específicos de préstamo',
        'no-service-interruption': 'Disponibilidad ininterrumpida de la plataforma',
        'Damages Limitation': 'Limitación de Daños',
        'damages-limit': 'Bajo ninguna circunstancia FLEXCREDI será responsable por daños indirectos, consecuenciales, especiales o punitivos, incluyendo pero no limitado a pérdida de beneficios, datos u oportunidades de negocio.',
        'Termination': 'Terminación',
        'Voluntary Termination': 'Terminación Voluntaria',
        'voluntary-termination': 'Puede cerrar su cuenta en cualquier momento contactándonos. La terminación no afecta las obligaciones de préstamos existentes.',
        'Involuntary Termination': 'Terminación Involuntaria',
        'involuntary-termination': 'Podemos suspender o terminar su cuenta por:',
        'terms-violation': 'Violación de estos términos',
        'fraudulent-activity': 'Actividad fraudulenta sospechosa',
        'legal-requirements': 'Requisitos legales o regulatorios',
        'General Provisions': 'Disposiciones Generales',
        'Governing Law': 'Ley Aplicable',
        'governing-law': 'Estos términos se rigen por las leyes del Estado de Florida y las leyes federales de Estados Unidos.',
        'Dispute Resolution': 'Resolución de Disputas',
        'arbitration-clause': 'Las disputas se resolverán mediante arbitraje vinculante bajo las reglas de la Asociación Americana de Arbitraje, excepto para reclamos menores que pueden resolverse en tribunal local.',
        'Changes to Terms': 'Cambios en los Términos',
        'terms-changes': 'Podemos modificar estos términos en cualquier momento. Los cambios significativos serán notificados por correo electrónico o a través de la plataforma.',
        'Contact Information': 'Información de Contacto',
        'contact-terms-intro': 'Para preguntas sobre estos Términos de Uso, por favor contáctenos:',
        'Legal Department': 'Departamento Legal',
        'Legal Compliance': 'Cumplimiento Legal',
        'compliance-statement': 'FLEXCREDI opera en cumplimiento con:',
        'federal-laws': 'Leyes federales de préstamos y crédito de EE.UU.',
        'state-regulations': 'Regulaciones estatales de Florida',
        'cfpb-rules': 'Reglas del Consumer Financial Protection Bureau (CFPB)',
        'fair-lending': 'Fair Lending Act y Equal Credit Opportunity Act',
        'truth-in-lending': 'Truth in Lending Act (TILA)',
        'electronic-signatures': 'Electronic Signatures in Global and National Commerce Act (E-SIGN)',
        'Back to Home': 'Volver al Inicio',
        
        // Privacy Policy Translations
        'Privacy Policy': 'Política de Privacidad',
        'How we collect, use, and protect your personal information': 'Cómo recopilamos, usamos y protegemos su información personal',
        'Last updated': 'Última actualización',
        'Introduction': '1. Introducción',
        'privacy-intro': 'FLEXCREDI ("nosotros", "nuestro" o "empresa") está comprometida a proteger y respetar su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando usa nuestros servicios financieros, visita nuestro sitio web o interactúa con nosotros de cualquier manera.',
        'privacy-commitment': 'Al usar nuestros servicios, usted acepta la recopilación y uso de información de acuerdo con esta política. No usaremos o compartiremos su información con nadie, excepto como se describe en esta Política de Privacidad.',
        'Information We Collect': '2. Información que Recopilamos',
        'Personal Information': '2.1 Información Personal',
        'personal-info-desc': 'Recopilamos la siguiente información personal cuando solicita nuestros servicios:',
        'full-name-info': 'Nombre completo',
        'ssn-info': 'Número de Seguro Social (SSN) o Tax ID',
        'contact-info': 'Información de contacto (email, teléfono, dirección)',
        'employment-info': 'Información de empleo e ingresos',
        'financial-info': 'Información financiera (cuentas bancarias, historial crediticio)',
        'business-info': 'Información comercial (para préstamos empresariales)',
        'Technical Information': '2.2 Información Técnica',
        'device-info': 'Información del dispositivo y navegador',
        'ip-address': 'Dirección IP y ubicación',
        'cookies-info': 'Cookies y tecnologías similares',
        'usage-data': 'Datos de uso y navegación del sitio web',
        'How We Use Information': '3. Cómo Usamos la Información',
        'info-usage-intro': 'Usamos su información para los siguientes propósitos:',
        'process-applications': 'Procesar y evaluar solicitudes de préstamo',
        'verify-identity': 'Verificar su identidad y prevenir fraudes',
        'credit-decisions': 'Tomar decisiones de crédito basadas en análisis de riesgo',
        'provide-services': 'Proporcionar y mantener nuestros servicios financieros',
        'customer-support': 'Ofrecer soporte al cliente y comunicación',
        'comply-laws': 'Cumplir con obligaciones legales y regulatorias',
        'improve-services': 'Mejorar nuestros productos y servicios',
        'marketing-communications': 'Enviar comunicaciones de marketing (con su consentimiento)',
        'Information Sharing': '4. Compartir Información',
        'sharing-intro': 'Podemos compartir su información en las siguientes circunstancias:',
        'Third Party Services': '4.1 Proveedores de Servicios Terceros',
        'credit-bureaus': 'Agencias de crédito para verificación e informes',
        'payment-processors': 'Procesadores de pagos e instituciones financieras',
        'identity-verification': 'Servicios de verificación de identidad',
        'technology-providers': 'Proveedores de tecnología e infraestructura',
        'Legal Requirements': '4.2 Requisitos Legales',
        'government-agencies': 'Agencias gubernamentales según lo exigido por la ley',
        'court-orders': 'Órdenes judiciales y citaciones',
        'regulatory-compliance': 'Cumplimiento de regulaciones financieras',
        'Data Security': '5. Seguridad de Datos',
        'security-intro': 'Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información:',
        'encryption': 'Cifrado SSL/TLS para transmisión de datos',
        'secure-servers': 'Servidores seguros y centros de datos certificados',
        'access-controls': 'Controles de acceso y autenticación multifactor',
        'employee-training': 'Capacitación regular de empleados en seguridad',
        'security-audits': 'Auditorías de seguridad y pruebas de penetración',
        'incident-response': 'Planes de respuesta a incidentes de seguridad',
        'Your Rights': '6. Sus Derechos',
        'rights-intro': 'Usted tiene los siguientes derechos con respecto a su información personal:',
        'access-right': 'Derecho a acceder a su información personal',
        'correction-right': 'Derecho a corregir información inexacta',
        'deletion-right': 'Derecho a solicitar eliminación de datos (sujeto a obligaciones legales)',
        'portability-right': 'Derecho a la portabilidad de datos',
        'objection-right': 'Derecho a oponerse al procesamiento para marketing',
        'complaint-right': 'Derecho a presentar quejas ante autoridades competentes',
        'Data Retention': '7. Retención de Datos',
        'retention-policy': 'Retenemos su información personal por el tiempo necesario para:',
        'service-provision': 'Proporcionar nuestros servicios',
        'legal-obligations': 'Cumplir con obligaciones legales y regulatorias',
        'dispute-resolution': 'Resolver disputas y hacer cumplir acuerdos',
        'retention-period': 'Generalmente, retenemos datos de clientes por 7 años después del fin de la relación comercial, según requieren las regulaciones financieras.',
        'Cookies': '8. Cookies y Tecnologías Similares',
        'cookies-intro': 'Usamos cookies y tecnologías similares para:',
        'essential-cookies': 'Funcionalidad esencial del sitio web',
        'analytics-cookies': 'Análisis de rendimiento y uso',
        'preference-cookies': 'Recordar sus preferencias',
        'marketing-cookies': 'Personalización de contenido (con consentimiento)',
        'cookie-control': 'Puede controlar cookies a través de la configuración de su navegador.',
        'Policy Changes': '9. Cambios en esta Política',
        'changes-notice': 'Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos por correo electrónico o aviso en nuestro sitio web. La fecha de la última revisión siempre se indicará en la parte superior de esta página.',
        'Contact Us': '10. Contáctenos',
        'contact-intro': 'Si tiene preguntas sobre esta Política de Privacidad o quiere ejercer sus derechos, contáctenos:',
        'Privacy Officer': 'Oficial de Protección de Privacidad',
        'Phone': 'Teléfono',
        'Regulatory Compliance': 'Cumplimiento Regulatorio',
        'compliance-info': 'Esta política cumple con las siguientes regulaciones:',
        'fair-credit': 'Fair Credit Reporting Act (FCRA)',
        'gramm-leach': 'Gramm-Leach-Bliley Act (GLBA)',
        'equal-credit': 'Equal Credit Opportunity Act (ECOA)',
        'truth-lending': 'Truth in Lending Act (TILA)',
        'state-privacy': 'Leyes estatales de privacidad aplicables',
        'cfpb-regulations': 'Regulaciones del Consumer Financial Protection Bureau (CFPB)',
        
        // Carousel Business Dreams
        'See My Offer': 'Ver Mi Oferta',
        'restaurant-dream': 'Transforma Tu Pasión Culinaria En Realidad',
        'restaurant-desc': 'Del sueño a la mesa de los clientes. Expande tu restaurante, compra equipos y conquista nuevos sabores con nuestro crédito especializado.',
        'beauty-dream': 'Tu Belleza Merece Un Salón De Ensueño',
        'beauty-desc': 'Sillas modernas, espejos profesionales, productos de calidad. Crea el salón que tus clientas merecen y siempre soñaste.',
        'construction-dream': 'Construye Tu Imperio, Proyecto Por Proyecto',
        'construction-desc': 'Herramientas profesionales, camión propio, equipo calificado. Transforma tu experiencia en construcción en una empresa exitosa.',
        'foodtruck-dream': 'Lleva Tus Sabores A Todos Los Rincones',
        'foodtruck-desc': 'Food truck equipado, licencias al día, rutas estratégicas. Tu receta familiar puede conquistar toda la ciudad.',
        'auto-dream': 'Tus Manos Hábiles Merecen Un Taller Completo',
        'auto-desc': 'Equipos modernos, espacio adecuado, herramientas profesionales. Transforma tu talento mecánico en el negocio de tu vida.',
        'retail-dream': 'Tu Tienda Soñada Está A Un Crédito De Distancia',
        'retail-desc': 'Inventario diversificado, ubicación comercial estratégica, servicio de calidad. Sé el centro de compras de tu comunidad.',
        
        // Form Fields (Placeholders)
        'Full Name *': 'Nombre Completo *',
        'Social Security / Tax ID *': 'SSN / Número de Identificación *',
        'Email *': 'Correo Electrónico *',
        'Phone/WhatsApp *': 'Teléfono/WhatsApp *',
        'Address *': 'Dirección *',
        'ZIP Code *': 'Código Postal *',
        'City *': 'Ciudad *',
        'State *': 'Estado *',
        
        // Document Upload
        'Take Photo': 'Tomar Foto',
        '1. ID Document': '1. Documento de Identidad',
        '2. Proof of Residence': '2. Comprobante de Domicilio',
        '3. Debit Card': '3. Tarjeta de Débito',
        'Card Front': 'Frente de la Tarjeta',
        'Card Back': 'Reverso de la Tarjeta',
        
        // About Page - Our Commitment
        'Our Commitment to You': 'Nuestro Compromiso Contigo',
        'Promises we make and keep every day': 'Promesas que hacemos y cumplimos todos los días',
        'Total Transparency': 'Transparencia Total',
        'All information about rates, terms and conditions is presented clearly from the first contact.': 'Toda la información sobre tasas, plazos y condiciones se presenta claramente desde el primer contacto.',
        'Humanized Service': 'Atención Humanizada',
        'Our team is always ready to answer your questions and support you at every step of the process.': 'Nuestro equipo siempre está listo para responder sus preguntas y apoyarlo en cada paso del proceso.',
        'Guaranteed Security': 'Seguridad Garantizada',
        'Your personal and financial data is protected with the highest digital security standards.': 'Sus datos personales y financieros están protegidos con los más altos estándares de seguridad digital.',
        'Agile Processes': 'Procesos Ágiles',
        'We keep our processes simple and fast, always respecting the quality of the analysis.': 'Mantenemos nuestros procesos simples y rápidos, siempre respetando la calidad del análisis.',
        
        // About Page - Statistics
        'FLEXCREDI in Numbers': 'FLEXCREDI en Números',
        'Our results reflect the positive impact we generate': 'Nuestros resultados reflejan el impacto positivo que generamos',
        'Clients Served': 'Clientes Atendidos',
        'People and companies who trusted our services': 'Personas y empresas que confiaron en nuestros servicios',
        'Credit Released': 'Crédito Liberado',
        'Total volume of credit made available': 'Volumen total de crédito disponible',
        'Customer Rating': 'Calificación del Cliente',
        'Average rating based on thousands of reviews': 'Calificación promedio basada en miles de reseñas',
        'Average Release Time': 'Tiempo Promedio de Liberación',
        'Speed that makes the difference when you need it': 'Velocidad que hace la diferencia cuando la necesitas',
        
        // About Page - Our Story
        'Our Story': 'Nuestra Historia',
        'See My Offer': 'Ver Mi Oferta',
        
        // About Page - Our Values
        'Our Values': 'Nuestros Valores',
        'The principles that guide every decision and action at FLEXCREDI': 'Los principios que guían cada decisión y acción en FLEXCREDI',
        'Transparency': 'Transparencia',
        'We believe trust is built through total clarity. That is why all our rates, terms and conditions are presented clearly, without fine print or tricks. Our clients always know exactly what they are contracting.': 'Creemos que la confianza se construye a través de claridad total. Por eso, todas nuestras tasas, plazos y condiciones se presentan claramente, sin letra pequeña ni trucos. Nuestros clientes siempre saben exactamente lo que están contratando.',
        'Integrity': 'Integridad',
        'We act with honesty and ethics in all our relationships. Our word is our commitment, and we always seek to do what is right, even when no one is watching. Integrity is the foundation of everything we do.': 'Actuamos con honestidad y ética en todas nuestras relaciones. Nuestra palabra es nuestro compromiso, y siempre buscamos hacer lo correcto, incluso cuando nadie está mirando. La integridad es la base de todo lo que hacemos.',
        'Customer Focus': 'Orientación al Cliente',
        'We put our customers at the center of everything we do. Every decision is made thinking about how we can improve their experience and help them achieve their financial goals responsibly and sustainably.': 'Ponemos a nuestros clientes en el centro de todo lo que hacemos. Cada decisión se toma pensando en cómo podemos mejorar su experiencia y ayudarlos a alcanzar sus objetivos financieros de manera responsable y sostenible.',
        'Innovation': 'Innovación',
        'We are always looking for better and more efficient ways to serve our customers. We use cutting-edge technology to simplify processes and create solutions that truly make a difference in peoples lives.': 'Siempre buscamos formas mejores y más eficientes de servir a nuestros clientes. Usamos tecnología de vanguardia para simplificar procesos y crear soluciones que realmente marcan la diferencia en la vida de las personas.',
        'Agility': 'Agilidad',
        'We know time is money, especially when it comes to credit. Our processes are designed to be fast and efficient, without sacrificing quality or security. We want you to have access to credit when you need it.': 'Sabemos que el tiempo es dinero, especialmente cuando se trata de crédito. Nuestros procesos están diseñados para ser rápidos y eficientes, sin sacrificar calidad o seguridad. Queremos que tengas acceso al crédito cuando lo necesites.',
        'Social Responsibility': 'Responsabilidad Social',
        'We understand our role in community development. In addition to offering fair credit, we invest in financial education and support initiatives that promote social and economic inclusion.': 'Entendemos nuestro papel en el desarrollo comunitario. Además de ofrecer crédito justo, invertimos en educación financiera y apoyamos iniciativas que promueven la inclusión social y económica.',
        
        // About Page - Mission, Vision, Purpose
        'Our Mission': 'Nuestra Misión',
        'Our Vision': 'Nuestra Visión',
        'Our Purpose': 'Nuestro Propósito',
        'Democratize access to credit in the United States, offering fair and transparent financial solutions to the Hispanic community, with speed and respect.': 'Democratizar el acceso al crédito en Estados Unidos, ofreciendo soluciones financieras justas y transparentes a la comunidad hispana, con rapidez y respeto.',
        'To be the most trusted financial partner for families and businesses in the Hispanic community, recognized for our commitment to transparency and positive social impact.': 'Ser el socio financiero más confiable para familias y empresas en la comunidad hispana, reconocidos por nuestro compromiso con la transparencia y el impacto social positivo.',
        'Every person deserves access to fair credit opportunities. We exist to remove barriers and create paths to financial success for our clients.': 'Toda persona merece acceso a oportunidades de crédito justas. Existimos para eliminar barreras y crear caminos hacia el éxito financiero para nuestros clientes.',
        
        // About Page - Our Story Content
        'story-intro': 'FLEXCREDI nació de la identificación de una necesidad real: el acceso facilitado al crédito para pequeños empresarios y personas que buscan realizar sus sueños de manera responsable.',
        'story-observation': 'Observamos que el mercado financiero tradicional muchas veces coloca barreras innecesarias, creando procesos burocráticos que dificultan el acceso al crédito para quienes realmente lo necesitan. Así surgió nuestra misión de democratizar el acceso a soluciones financieras.',
        'story-focus': 'Con enfoque en la comunidad latina en Florida, desarrollamos un enfoque que combina tecnología avanzada con atención humanizada, siempre manteniendo nuestra promesa central: <strong>Fácil, Simple, Rápido</strong>.',
        'story-philosophy': 'Desde el inicio, nuestra filosofía es clara: ofrecer crédito responsable, con total transparencia y procesos simplificados, para que nuestros clientes puedan enfocarse en lo que realmente importa - realizar sus proyectos y hacer crecer sus negocios.',
        
        // Timeline
        'The Idea': 'La Idea',
        'idea-description': 'Identificación de la necesidad de democratizar el acceso al crédito en la comunidad latina de Florida.',
        'Development': 'Desarrollo',
        'development-description': 'Creación de una plataforma tecnológica robusta y segura, enfocada en la experiencia del usuario.',
        'Launch': 'Lanzamiento',
        'launch-description': 'Inicio de operaciones con enfoque en crédito rápido, simple y transparente.',
        'Growth': 'Crecimiento',
        'growth-description': 'Expansión de servicios y conquista de la confianza de miles de clientes satisfechos.',
        'Future': 'Futuro',
        'future-description': 'Continuar innovando y expandiendo nuestro impacto positivo en la comunidad.',
        
        // CTA Section
        'Ready to Experience FLEXCREDI?': '¿Listo para Conocer FLEXCREDI en la Práctica?',
        'Join our community of satisfied customers and discover how credit can be easy, simple and fast.': 'Sea parte de nuestra comunidad de clientes satisfechos y descubra cómo el crédito puede ser fácil, simple y rápido.',
        'Talk to Our Team': 'Hablar con Nuestro Equipo',
        'Free simulation, no commitment • Analysis in seconds': 'Simulación gratuita y sin compromiso • Análisis en segundos',
        
        // Services Page
        'Find the ideal credit solution for you': 'Encuentra la solución de crédito ideal para ti',
        'At FLEXCREDI, we understand that each person has unique needs. That\'s why we\'ve developed a complete range of credit services to meet diverse objectives, always with our promise to be Easy, Simple, Fast.': 'En FLEXCREDI, entendemos que cada persona tiene necesidades únicas. Por eso desarrollamos una gama completa de servicios de crédito para cumplir diversos objetivos, siempre con nuestra promesa de ser Fácil, Simple, Rápido.',
        'Our Credit Products': 'Nuestros Productos de Crédito',
        'Flexible Personal Credit': 'Crédito Personal Flexible',
        'For your personal and family needs': 'Para tus necesidades personales y familiares',
        'FLEXCREDI\'s personal credit is the ideal solution for those who need quick money to resolve personal or family matters. Whether for an emergency, education, health, or any other personal project.': 'El crédito personal de FLEXCREDI es la solución ideal para quienes necesitan dinero rápido para resolver asuntos personales o familiares. Ya sea para una emergencia, educación, salud o cualquier otro proyecto personal.',
        'Features:': 'Características:',
        'Amounts from $1,000 to $25,000': 'Montos de $1,000 a $25,000',
        'Terms from 6 to 48 months': 'Plazos de 6 a 48 meses',
        'Interest rates starting at 8.5% APR': 'Tasas de interés desde 8.5% APR',
        'Funding within 24 hours': 'Financiamiento en 24 horas',
        'No hard credit check required*': 'Sin verificación de crédito fuerte*',
        '100% online process': 'Proceso 100% en línea',
        'Ideal for:': 'Ideal para:',
        'Medical Emergencies': 'Emergencias Médicas',
        'Education': 'Educación',
        'Travel': 'Viajes',
        'Weddings': 'Bodas',
        'Personal Expenses': 'Gastos Personales',
        'Learn More': 'Saber Más',
        'Credit to Boost Your Business': 'Crédito para Impulsar tu Negocio',
        'Working capital and investment for entrepreneurs': 'Capital de trabajo e inversión para empresarios',
        'Specially developed for small and medium entrepreneurs who need capital to expand, invest in equipment, purchase inventory, or maintain business working capital up to date.': 'Especialmente desarrollado para pequeños y medianos empresarios que necesitan capital para expandir, invertir en equipos, comprar inventario o mantener el capital de trabajo del negocio al día.',
        'Amounts from $5,000 to $100,000': 'Montos de $5,000 a $100,000',
        'Terms from 12 to 60 months': 'Plazos de 12 a 60 meses',
        'Special rates for entrepreneurs': 'Tasas especiales para empresarios',
        'Personalized business analysis': 'Análisis de negocio personalizado',
        'Grace period up to 90 days': 'Período de gracia hasta 90 días',
        'Financial consulting included': 'Consultoría financiera incluida',
        'Working Capital': 'Capital de Trabajo',
        'Equipment Purchase': 'Compra de Equipos',
        'Business Expansion': 'Expansión del Negocio',
        'Inventory': 'Inventario',
        'Commercial Renovations': 'Reformas Comerciales',
        'Smart Debt Consolidation': 'Consolidación Inteligente de Deudas',
        'Reorganize your finances intelligently': 'Reorganiza tus finanzas de forma inteligente',
        'Transform multiple expensive debts into a single payment with better conditions. Our consolidation solution helps you reorganize your finances and regain control of your budget.': 'Transforma múltiples deudas costosas en un solo pago con mejores condiciones. Nuestra solución de consolidación te ayuda a reorganizar tus finanzas y recuperar el control de tu presupuesto.',
        'Amounts from $2,000 to $25,000': 'Montos de $2,000 a $25,000',
        'Lower rates than credit cards': 'Tasas más bajas que tarjetas de crédito',
        'Consolidates multiple debts into one': 'Consolida múltiples deudas en una',
        'Free financial planning': 'Planificación financiera gratuita',
        'Discount for full payment': 'Descuento por pago total',
        'Credit Cards': 'Tarjetas de Crédito',
        'Overdraft': 'Sobregiros',
        'Financing': 'Financiamientos',
        'High-Interest Loans': 'Préstamos con Altos Intereses',
        'Financial Reorganization': 'Reorganización Financiera',
        'Discover the ideal credit solution for your needs. We offer flexible, transparent, and personalized options to achieve your goals.': 'Descubre la solución de crédito ideal para tus necesidades. Ofrecemos opciones flexibles, transparentes y personalizadas para alcanzar tus metas.',
        
        // How It Works Page
        'How It Works': 'Cómo Funciona',
        'Get your credit approved in just 4 simple steps. Our streamlined process is designed to be fast, transparent, and hassle-free.': 'Obtén tu crédito aprobado en solo 4 simples pasos. Nuestro proceso simplificado está diseñado para ser rápido, transparente y sin complicaciones.',
        'Our Simple 4-Step Process': 'Nuestro Simple Proceso de 4 Pasos',
        'From application to approval in as little as 24 hours': 'De la solicitud a la aprobación en tan solo 24 horas',
        'Fill Out Application': 'Completa la Solicitud',
        'Complete our quick online form with your personal and financial information. It takes less than 5 minutes and is 100% secure.': 'Completa nuestro rápido formulario en línea con tu información personal y financiera. Toma menos de 5 minutos y es 100% seguro.',
        'Quick 5-minute form': 'Formulario rápido de 5 minutos',
        'Bank-level security': 'Seguridad de nivel bancario',
        'No paperwork required': 'Sin papeleo requerido',
        'Instant Analysis': 'Análisis Instantáneo',
        'Our advanced system analyzes your information instantly and provides you with a preliminary credit decision in seconds.': 'Nuestro sistema avanzado analiza tu información instantáneamente y te proporciona una decisión de crédito preliminar en segundos.',
        'Instant pre-approval': 'Pre-aprobación instantánea',
        'Credit limit estimation': 'Estimación del límite de crédito',
        'Personalized rates': 'Tasas personalizadas',
        'Document Verification': 'Verificación de Documentos',
        'Upload your documents securely through our platform. Our team reviews everything quickly to ensure fast processing.': 'Sube tus documentos de forma segura a través de nuestra plataforma. Nuestro equipo revisa todo rápidamente para asegurar un procesamiento rápido.',
        'Secure document upload': 'Carga segura de documentos',
        
        // Contact Page
        'Contact Our Expert Team': 'Contacta a Nuestro Equipo de Expertos',
        'Get personalized support from our bilingual credit specialists. We\'re here to help you achieve your financial goals.': 'Obtén asistencia personalizada de nuestros especialistas en crédito bilingües. Estamos aquí para ayudarte a alcanzar tus metas financieras.',
        'Phone Support': 'Soporte Telefónico',
        'Speak directly with our credit experts': 'Habla directamente con nuestros expertos en crédito',
        'Monday - Friday: 8 AM - 8 PM EST': 'Lunes - Viernes: 8 AM - 8 PM EST',
        'Saturday: 9 AM - 5 PM EST': 'Sábado: 9 AM - 5 PM EST',
        'Call Now': 'Llamar Ahora',
        'WhatsApp Chat': 'Chat de WhatsApp',
        'Quick answers to your questions': 'Respuestas rápidas a tus preguntas',
        'Available 7 days a week': 'Disponible 7 días a la semana',
        'Response time: Under 1 hour': 'Tiempo de respuesta: Menos de 1 hora',
        'Chat Now': 'Chatear Ahora',
        'Email Support': 'Soporte por Email',
        'Detailed assistance for complex questions': 'Asistencia detallada para preguntas complejas',
        'We respond within 24 hours': 'Respondemos dentro de 24 horas',
        'Available in English & Spanish': 'Disponible en Inglés y Español',
        'Send Email': 'Enviar Email',
        
        // Footer
        'Empower your dreams with easy, simple and fast credit.': 'Empodera tus sueños con crédito fácil, simple y rápido.',
        'Quick Links': 'Enlaces Rápidos',
        'Contact Us': 'Contáctenos',
        'Florida, United States': 'Florida, Estados Unidos',
        'All rights reserved': 'Todos los derechos reservados',
        'Client Area': 'Área del Cliente'
    },
    pt: {
        // Navigation
        'About Us': 'Sobre Nós',
        'Our Services': 'Nossos Serviços',
        'Personal Credit': 'Crédito Pessoal',
        'Business Credit': 'Crédito Empresarial',
        'Debt Consolidation': 'Quitação de Dívidas',
        'Home Improvement': 'Reforma da Casa',
        'How It Works': 'Como Funciona',
        'FAQ': 'Perguntas Frequentes',
        'Contact': 'Contato',
        'Login': 'Entrar',
        'Apply Now': 'Ver Minha Oferta',
        
        // Hero Section
        'Easy • Simple • Fast': 'Fácil • Simples • Rápido',
        'Your Financial Journey Starts Here': 'O Investimento Para o Seu Negócio Começa Aqui',
        'Empower your dreams with transparent, fast, and hassle-free credit. Designed for the Latino community in Florida.': 'Empodere seus sonhos com crédito transparente, rápido e sem complicações. Projetado para a comunidade latina na Flórida.',
        'Get Started Now': 'Comece Agora',
        
        // Form
        'Start Your Credit Application in Seconds!': 'Inicie Sua Solicitação de Crédito em Segundos!',
        'Fill out the form below to discover your credit availability': 'Preencha o formulário abaixo para descobrir sua disponibilidade de crédito',
        'Full Name': 'Nome Completo',
        'Social Security / Tax ID': 'CPF / Documento',
        'Email': 'E-mail',
        'Phone/WhatsApp': 'Telefone/WhatsApp',
        'Address': 'Endereço',
        'ZIP Code': 'CEP',
        'City': 'Cidade',
        'State': 'Estado',
        'Desired Amount': 'Valor Desejado',
        'What do you need the credit for?': 'Para que você precisa do crédito?',
        'Cash flow for my business': 'Fluxo para meu negócio',
        'Pay a business partner of my company': 'Pagar um parceiro comercial de meu negócio',
        'Request Approval': 'Ver Minha Oferta',
        'Home': 'Início',
        
        // Calculator
        'Loan Calculator': 'Calculadora de Empréstimo',
        'Credit Score': 'Score de Crédito',
        'Loan Term (Months)': 'Prazo (Meses)',
        'Monthly Payment': 'Valor da Parcela',
        '* Minimum credit score accepted is 500, subject to approval': '* Score mínimo aceito é 500, sempre mediante aprovação',
        'Easy Calculation': 'Cálculo Fácil',
        'Use our calculator to simulate your loan. Consider that values will be calculated based on your information and are approximate values. Final values will only be defined after complete credit analysis for contract signing.': 'Utilize a nossa calculadora para simular o seu empréstimo, considere que os valores serão calculados baseados nas suas informações e são valores aproximados, os valores finais só serão definidos após toda a análise de créditos para assinatura do contrato.',
        'Request Approval': 'Ver Minha Oferta',
        'Home': 'Início',
        
        // Benefits Section
        'Fair Rates': 'Taxas Justas',
        'Dedicated Support': 'Suporte Dedicado',
        
        // Why Apply Section
        'Why Apply with FLEXCREDI?': 'Por Que Solicitar com a FLEXCREDI?',
        'Discover the advantages that make us the best choice': 'Descubra as vantagens que nos tornam a melhor escolha',
        'Instant Analysis': 'Análise Instantânea',
        'Get a response in seconds about your credit availability, without unnecessary bureaucracy.': 'Obtenha uma resposta em segundos sobre sua disponibilidade de crédito, sem burocracia desnecessária.',
        '100% Secure': '100% Seguro',
        'Your data is protected with bank-level encryption. Total security guaranteed.': 'Seus dados são protegidos com criptografia de nível bancário. Segurança total garantida.',
        'We offer the best rates in the market, always transparent and without hidden fees.': 'Oferecemos as melhores taxas do mercado, sempre transparentes e sem taxas ocultas.',
        'Our team is ready to help you at every step of the process, whenever you need.': 'Nossa equipe está pronta para ajudá-lo em cada etapa do processo, sempre que precisar.',
        'Customer Rating: 4.8/5': 'Avaliação dos Clientes: 4.8/5',
        
        // Why Choose Section
        'Why Choose FLEXCREDI?': 'Por Que Escolher a FLEXCREDI?',
        'Our advantages make the difference in your financial journey': 'Nossas vantagens fazem a diferença em sua jornada financeira',
        'Simplified Process': 'Processo Simplificado',
        'No excessive paperwork. Everything online, fast and intuitive. You don\'t waste time with unnecessary bureaucracy.': 'Sem papelada excessiva. Tudo online, rápido e intuitivo. Você não perde tempo com burocracia desnecessária.',
        'Fast Approval': 'Aprovação Rápida',
        'Analysis in minutes, same-day approval. When you need it, we\'re ready to help.': 'Análise em minutos, aprovação no mesmo dia. Quando você precisa, estamos prontos para ajudar.',
        'Complete transparency in rates and conditions. No surprises, no fine print, no tricks.': 'Transparência completa em taxas e condições. Sem surpresas, sem letras miúdas, sem pegadinhas.',
        'Total Security': 'Segurança Total',
        'Data protection with bank-level encryption and compliance with all financial regulations.': 'Proteção de dados com criptografia de nível bancário e conformidade com todas as regulamentações financeiras.',
        'Personalized service with specialists ready to clarify your doubts and support your decisions.': 'Atendimento personalizado com especialistas prontos para esclarecer suas dúvidas e apoiar suas decisões.',
        'Flexibility': 'Flexibilidade',
        'Payments that fit your budget with personalized options for your financial reality.': 'Pagamentos que cabem no seu orçamento com opções personalizadas para sua realidade financeira.',
        
        // Success Stories Section
        'Florida Success Stories': 'Histórias de Sucesso da Flórida',
        'Real stories from Latino entrepreneurs who achieved their dreams with FLEXCREDI': 'Histórias reais de empreendedores latinos que realizaram seus sonhos com a FLEXCREDI',
        
        // Rosa Martinez Story
        'Rosa Martinez': 'Rosa Martinez',
        'Rosa\'s Kitchen - Miami, FL': 'Rosa\'s Kitchen - Miami, FL',
        '🇨🇴 From Colombia': '🇨🇴 Da Colômbia',
        'Started with a small food stand, now I have my own restaurant! FLEXCREDI\'s $15,000 loan helped me lease a space and buy essential equipment. We serve authentic Colombian arepas and empanadas!': 'Comecei com uma pequena barraca de comida, agora tenho meu próprio restaurante! O empréstimo de $15.000 da FLEXCREDI me ajudou a alugar um espaço e comprar equipamentos essenciais. Servimos arepas e empanadas colombianas autênticas!',
        '$15,000 Credit': '$15.000 de Crédito',
        'Food Stand to Restaurant': 'De Barraca a Restaurante',
        '3 Employees': '3 Funcionários',
        
        // Maria & José García Story
        'Maria & José García': 'Maria & José García',
        'García Cleaning Services - Jacksonville, FL': 'García Serviços de Limpeza - Jacksonville, FL',
        '🇨🇺 From Cuba': '🇨🇺 De Cuba',
        'We started cleaning offices after work hours. FLEXCREDI\'s $5,500 loan helped us buy professional equipment and supplies. Now we have 12 regular clients and it\'s our full-time business!': 'Começamos limpando escritórios após o horário de trabalho. O empréstimo de $5.500 da FLEXCREDI nos ajudou a comprar equipamentos e suprimentos profissionais. Agora temos 12 clientes regulares e é nosso negócio em tempo integral!',
        '$5,500 Credit': '$5.500 de Crédito',
        'Cleaning Equipment': 'Equipamentos de Limpeza',
        '12 Clients': '12 Clientes',
        
        // Ana Silva Story
        'Ana Silva': 'Ana Silva',
        'Bella Hair Salon - Fort Lauderdale, FL': 'Salão Bella Hair - Fort Lauderdale, FL',
        '🇧🇷 From Brazil': '🇧🇷 Do Brasil',
        'I needed equipment to open my beauty salon. FLEXCREDI\'s $18,000 loan covered chairs, mirrors, and all styling tools. My Brazilian hair treatments are now famous in the area!': 'Eu precisava de equipamentos para abrir meu salão de beleza. O empréstimo de $18.000 da FLEXCREDI cobriu cadeiras, espelhos e todas as ferramentas de estilo. Meus tratamentos capilares brasileiros agora são famosos na região!',
        '$18,000 Credit': '$18.000 de Crédito',
        'Salon Equipment': 'Equipamentos do Salão',
        '2 Stylists': '2 Cabeleireiras',
        
        // Additional missing translations
        'Over 10,000 satisfied customers with our services': 'Mais de 10.000 clientes satisfeitos com nossos serviços',
        'company-address': '5200 Old Winter Garden<br>Orlando Florida - Zip 32836',
        'Select an option': 'Selecione uma opção',
        'Business Investment': 'Investimento Empresarial',
        'Travel': 'Viagem',
        'Education': 'Educação',
        'Medical Expenses': 'Despesas Médicas',
        'Vehicle Purchase/Repair': 'Compra/Reparo de Veículo',
        'Other': 'Outro',
        'I have read and accept the': 'Li e aceito a',
        'Privacy Policy': 'Política de Privacidade',
        'and': 'e',
        'Terms of Use': 'Termos de Uso',
        'Your data is secure and protected': 'Seus dados estão seguros e protegidos',
        'Security & Trust': 'Segurança e Confiança',
        'Your information is protected with bank-level security standards': 'Suas informações estão protegidas com padrões de segurança de nível bancário',
        'Empowering Every Type of Small Business': 'Empoderando Todos os Tipos de Pequenas Empresas',
        
        // Luis & Carmen Valdez Story
        'Luis & Carmen Valdez': 'Luis & Carmen Valdez',
        'Valdez Bakery - Orlando, FL': 'Padaria Valdez - Orlando, FL',
        '🇲🇽 From Mexico': '🇲🇽 Do México',
        'Our family bakery was just a dream. With FLEXCREDI\'s $8,500 loan, we bought a professional oven and started our business. Now we make traditional Mexican sweet bread and supply local cafés!': 'Nossa padaria familiar era apenas um sonho. Com o empréstimo de $8.500 da FLEXCREDI, compramos um forno profissional e começamos nosso negócio. Agora fazemos pães doces mexicanos tradicionais e fornecemos para cafés locais!',
        '$8,500 Credit': '$8.500 de Crédito',
        'Family Business': 'Negócio Familiar',
        '6 Clients': '6 Clientes',
        
        // Carlos Hernandez Story
        'Carlos Hernandez': 'Carlos Hernandez',
        'Hernandez Handyman - Tampa, FL': 'Hernandez Faz-Tudo - Tampa, FL',
        '🇻🇪 From Venezuela': '🇻🇪 Da Venezuela',
        'I needed tools and a work van to start my handyman business. FLEXCREDI\'s $12,000 loan helped me buy everything I needed. Now I have regular clients and steady income!': 'Eu precisava de ferramentas e uma van de trabalho para começar meu negócio de faz-tudo. O empréstimo de $12.000 da FLEXCREDI me ajudou a comprar tudo que precisava. Agora tenho clientes regulares e renda estável!',
        '$12,000 Credit': '$12.000 de Crédito',
        'Tools & Van': 'Ferramentas e Van',
        'Solo Business': 'Negócio Individual',
        
        // Business Types
        'Beauty Salons': 'Salões de Beleza',
        'Hair styling & beauty services': 'Serviços de cabelo e beleza',
        'Barbershops': 'Barbearias',
        'Professional men\'s grooming': 'Cuidados masculinos profissionais',
        'Cleaning Services': 'Serviços de Limpeza',
        'Commercial & residential': 'Comercial e residencial',
        
        // New business categories
        'Food Trucks & Taquerias': 'Food Trucks e Taquerias',
        'Mobile kitchens & restaurants': 'Cozinhas móveis e restaurantes',
        'Bakeries & Pastries': 'Padarias e Doçarias',
        'Traditional & specialty breads': 'Pães tradicionais e especiais',
        'Auto Repair Shops': 'Oficinas Mecânicas',
        'Mechanical & maintenance services': 'Serviços mecânicos e manutenção',
        'Construction & Handyman': 'Construção e Faz-Tudo',
        'Building & renovation services': 'Serviços de construção e renovação',
        'Professional Services': 'Serviços Profissionais',
        'Consulting & business services': 'Consultoria e serviços empresariais',
        
        // Community impact section
        'Empowering Florida\'s Latino Community': 'Empoderando a Comunidade Latina da Flórida',
        'We\'re proud to support over 10,000 Latino entrepreneurs across Florida, from Miami-Dade to Jacksonville, helping build stronger communities one business at a time.': 'Temos orgulho de apoiar mais de 10.000 empreendedores latinos em toda a Flórida, de Miami-Dade a Jacksonville, ajudando a construir comunidades mais fortes, um negócio de cada vez.',
        'Invested in Latino Businesses': 'Investido em Empresas Latinas',
        'Families Supported': 'Famílias Apoiadas',
        'Jobs Created': 'Empregos Criados',
        'Counties Served': 'Condados Atendidos',
        
        // Business diversity section
        'Whatever Your Business Dream, We\'re Here to Fund It': 'Qualquer Que Seja Seu Sonho de Negócio, Estamos Aqui Para Financiá-lo',
        'Join thousands of successful Latino entrepreneurs who trusted FLEXCREDI to fuel their business growth': 'Junte-se a milhares de empreendedores latinos bem-sucedidos que confiaram na FLEXCREDI para impulsionar o crescimento de seus negócios',
        'Start Your Application': 'Ver Minha Oferta',
        
        // Trust section
        'Your Financial Partner for Success': 'Seu Parceiro Financeiro Para o Sucesso',
        'At FLEXCREDI, we believe that trust is the foundation of every successful financial relationship. Our personalized approach ensures you get the support you need to achieve your goals.': 'Na FLEXCREDI, acreditamos que a confiança é a base de todo relacionamento financeiro bem-sucedido. Nossa abordagem personalizada garante que você obtenha o suporte necessário para alcançar seus objetivos.',
        'Personal Relationship': 'Relacionamento Pessoal',
        'Direct contact with experienced professionals who understand your needs': 'Contato direto com profissionais experientes que entendem suas necessidades',
        'Growth Focused': 'Focado no Crescimento',
        'We help you build not just credit, but a sustainable financial future': 'Ajudamos você a construir não apenas crédito, mas um futuro financeiro sustentável',
        'Speak to an Advisor': 'Fale com um Consultor',
        
        // About section
        'About FLEXCREDI': 'Sobre a FLEXCREDI',
        'Empowering people and businesses with accessible, transparent and efficient financial solutions, focused on entrepreneurship and community development in Florida.': 'Empoderando pessoas e empresas com soluções financeiras acessíveis, transparentes e eficientes, focadas no empreendedorismo e desenvolvimento comunitário na Flórida.',
        'Our Mission': 'Nossa Missão',
        'Make credit accessible to those who really need it, without unnecessary bureaucracy and with total transparency.': 'Tornar o crédito acessível para quem realmente precisa, sem burocracia desnecessária e com total transparência.',
        'Our Vision': 'Nossa Visão',
        'Be the reference in flexible, simple and fast credit, recognized for moving the economy from the base.': 'Ser a referência em crédito flexível, simples e rápido, reconhecida por movimentar a economia desde a base.',
        'Learn Our Story': 'Conheça Nossa História',
        'Clients Served': 'Clientes Atendidos',
        'Credit Released': 'Crédito Liberado',
        'Average Rating': 'Avaliação Média',
        'Average Release': 'Liberação Média',
        
        // Final CTA
        'Ready to Make Your Plans Come True?': 'Pronto Para Tornar Seus Planos Realidade?',
        'Join over 10,000 people who have already transformed their lives with FLEXCREDI': 'Junte-se a mais de 10.000 pessoas que já transformaram suas vidas com a FLEXCREDI',
        'SSL Protected Site • Encrypted Data • 100% Secure': 'Site Protegido SSL • Dados Criptografados • 100% Seguro',
        
        // Terms of Use
        'Terms of Use': 'Termos de Uso',
        'Terms and conditions for using our financial services': 'Termos e condições para uso de nossos serviços financeiros',
        'Acceptance of Terms': 'Aceitação dos Termos',
        'terms-acceptance': 'Bem-vindo à FLEXCREDI. Ao acessar e usar nossos serviços, website ou aplicativo móvel, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve usar nossos serviços.',
        'terms-binding': 'Estes termos constituem um acordo legal vinculativo entre você e a FLEXCREDI. Ao usar nossos serviços, você declara que tem pelo menos 18 anos e capacidade legal para celebrar este acordo.',
        'Services Description': 'Descrição dos Serviços',
        'Financial Services': 'Serviços Financeiros',
        'services-description': 'A FLEXCREDI oferece os seguintes serviços financeiros:',
        'personal-loans': 'Empréstimos pessoais e comerciais',
        'credit-evaluation': 'Avaliação e análise de crédito',
        'loan-matching': 'Correspondência com credores parceiros',
        'financial-consultation': 'Consultoria financeira básica',
        'online-platform': 'Plataforma online para gestão de aplicações',
        'Service Limitations': 'Limitações dos Serviços',
        'no-guarantee': 'Não garantimos aprovação de empréstimos',
        'third-party-lenders': 'Trabalhamos com credores terceirizados licenciados',
        'subject-to-approval': 'Todos os empréstimos estão sujeitos à aprovação de crédito',
        'compliance-requirements': 'Sujeito a requisitos regulamentares estaduais e federais',
        'Eligibility Requirements': 'Elegibilidade e Requisitos',
        'Basic Requirements': 'Requisitos Básicos',
        'eligibility-intro': 'Para usar nossos serviços, você deve atender aos seguintes critérios:',
        'age-requirement': 'Ter pelo menos 18 anos de idade',
        'us-resident': 'Ser residente legal dos Estados Unidos',
        'valid-ssn': 'Possuir Número de Seguro Social (SSN) ou Individual Taxpayer Identification Number (ITIN) válido',
        'valid-id': 'Ter documento de identidade emitido pelo governo válido',
        'active-bank': 'Manter conta bancária ativa nos EUA',
        'stable-income': 'Comprovar renda estável e verificável',
        'credit-score': 'Score de crédito mínimo de 500 (sujeito a aprovação)',
        'Prohibited Uses': 'Usos Proibidos',
        'false-information': 'Fornecer informações falsas ou enganosas',
        'multiple-applications': 'Submeter múltiplas aplicações simultâneas',
        'illegal-activities': 'Usar fundos para atividades ilegais',
        'gambling-speculation': 'Usar fundos para jogos de azar ou especulação',
        'unauthorized-access': 'Tentar acesso não autorizado aos nossos sistemas',
        'Application Process': 'Processo de Aplicação',
        'Application Steps': 'Etapas da Aplicação',
        'online-form': 'Preenchimento do formulário online',
        'document-verification': 'Verificação de documentos e identidade',
        'credit-check': 'Verificação de crédito (soft pull inicial)',
        'income-verification': 'Verificação de renda',
        'lender-matching': 'Correspondência com credores parceiros',
        'final-approval': 'Aprovação final e assinatura de contratos',
        'Processing Time': 'Tempo de Processamento',
        'initial-review': 'Revisão inicial: até 24 horas',
        'full-underwriting': 'Análise completa: 2-5 dias úteis',
        'funding-time': 'Liberação de fundos: 1-3 dias úteis após aprovação',
        'Fees and Costs': 'Taxas e Custos',
        'Our Fees': 'Nossas Taxas',
        'application-fee': 'Taxa de aplicação: GRATUITA',
        'platform-fee': 'Taxa da plataforma: GRATUITA',
        'early-consultation': 'Consulta inicial: GRATUITA',
        'Lender Fees': 'Taxas dos Credores',
        'lender-fees-notice': 'Os credores parceiros podem cobrar:',
        'origination-fee': 'Taxa de originação: 0-6% do valor do empréstimo',
        'interest-rates': 'Taxa de juros: 20-30% ao ano (baseada no score de crédito)',
        'late-fees': 'Taxas por atraso: conforme contrato do credor',
        'prepayment-penalty': 'Penalidade por pagamento antecipado: varia por credor',
        'User Obligations': 'Obrigações do Usuário',
        'Information Accuracy': 'Precisão das Informações',
        'truthful-info': 'Fornecer informações verdadeiras e completas',
        'update-info': 'Manter informações atualizadas',
        'notify-changes': 'Notificar mudanças em situação financeira',
        'document-authenticity': 'Garantir autenticidade de documentos enviados',
        'Account Security': 'Segurança da Conta',
        'secure-password': 'Manter senha segura e confidencial',
        'unauthorized-use': 'Reportar uso não autorizado imediatamente',
        'logout-security': 'Fazer logout em dispositivos compartilhados',
        'device-protection': 'Proteger dispositivos com acesso à conta',
        'Intellectual Property': 'Propriedade Intelectual',
        'ip-ownership': 'Todo o conteúdo, design, logos, marcas registradas e propriedade intelectual em nosso website e plataforma são de propriedade exclusiva da FLEXCREDI ou licenciados para nós.',
        'Usage Rights': 'Direitos de Uso',
        'personal-use': 'Uso pessoal e não comercial permitido',
        'no-copying': 'Proibida cópia ou reprodução não autorizada',
        'no-reverse-engineering': 'Proibida engenharia reversa da plataforma',
        'respect-trademarks': 'Respeitar todas as marcas registradas',
        'Liability Limitation': 'Limitação de Responsabilidade',
        'Service Disclaimer': 'Isenção de Responsabilidade',
        'disclaimer-text': 'A FLEXCREDI atua como intermediária entre mutuários e credores. Não somos um credor direto e não garantimos:',
        'no-loan-guarantee': 'Aprovação ou disponibilidade de empréstimos',
        'no-rate-guarantee': 'Taxas de juros específicas',
        'no-term-guarantee': 'Termos específicos de empréstimo',
        'no-service-interruption': 'Disponibilidade ininterrupta da plataforma',
        'Damages Limitation': 'Limitação de Danos',
        'damages-limit': 'Em nenhuma circunstância a FLEXCREDI será responsável por danos indiretos, consequenciais, especiais ou punitivos, incluindo mas não limitado a perda de lucros, dados ou oportunidades de negócio.',
        'Termination': 'Rescisão',
        'Voluntary Termination': 'Rescisão Voluntária',
        'voluntary-termination': 'Você pode encerrar sua conta a qualquer momento entrando em contato conosco. A rescisão não afeta obrigações existentes de empréstimos.',
        'Involuntary Termination': 'Rescisão por Nossa Parte',
        'involuntary-termination': 'Podemos suspender ou encerrar sua conta por:',
        'terms-violation': 'Violação destes termos',
        'fraudulent-activity': 'Atividade fraudulenta suspeita',
        'legal-requirements': 'Exigências legais ou regulamentares',
        'General Provisions': 'Disposições Gerais',
        'Governing Law': 'Lei Aplicável',
        'governing-law': 'Estes termos são regidos pelas leis do Estado da Flórida e leis federais dos Estados Unidos.',
        'Dispute Resolution': 'Resolução de Disputas',
        'arbitration-clause': 'Disputas serão resolvidas através de arbitragem vinculante conforme as regras da American Arbitration Association, exceto para pequenas causas que podem ser resolvidas em tribunal local.',
        'Changes to Terms': 'Alterações nos Termos',
        'terms-changes': 'Podemos modificar estes termos a qualquer momento. Mudanças significativas serão notificadas por email ou através da plataforma.',
        'Contact Information': 'Informações de Contato',
        'contact-terms-intro': 'Para questões sobre estes Termos de Uso, entre em contato conosco:',
        'Legal Department': 'Departamento Jurídico',
        'Legal Compliance': 'Conformidade Legal',
        'compliance-statement': 'A FLEXCREDI opera em conformidade com:',
        'federal-laws': 'Leis federais de empréstimo e crédito dos EUA',
        'state-regulations': 'Regulamentações estaduais da Flórida',
        'cfpb-rules': 'Regras do Consumer Financial Protection Bureau (CFPB)',
        'fair-lending': 'Fair Lending Act e Equal Credit Opportunity Act',
        'truth-in-lending': 'Truth in Lending Act (TILA)',
        'electronic-signatures': 'Electronic Signatures in Global and National Commerce Act (E-SIGN)',
        'Back to Home': 'Voltar',
        
        // Privacy Policy Translations
        'Privacy Policy': 'Política de Privacidade',
        'How we collect, use, and protect your personal information': 'Como coletamos, usamos e protegemos suas informações pessoais',
        'Last updated': 'Última atualização',
        'Introduction': '1. Introdução',
        'privacy-intro': 'A FLEXCREDI ("nós", "nosso" ou "empresa") está comprometida em proteger e respeitar sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nossos serviços financeiros, visita nosso website ou interage conosco de qualquer forma.',
        'privacy-commitment': 'Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política. Não usaremos ou compartilharemos suas informações com ninguém, exceto conforme descrito nesta Política de Privacidade.',
        'Information We Collect': '2. Informações que Coletamos',
        'Personal Information': '2.1 Informações Pessoais',
        'personal-info-desc': 'Coletamos as seguintes informações pessoais quando você solicita nossos serviços:',
        'full-name-info': 'Nome completo',
        'ssn-info': 'Número do Seguro Social (SSN) ou Tax ID',
        'contact-info': 'Informações de contato (e-mail, telefone, endereço)',
        'employment-info': 'Informações de emprego e renda',
        'financial-info': 'Informações financeiras (contas bancárias, histórico de crédito)',
        'business-info': 'Informações comerciais (para empréstimos empresariais)',
        'Technical Information': '2.2 Informações Técnicas',
        'device-info': 'Informações do dispositivo e navegador',
        'ip-address': 'Endereço IP e localização',
        'cookies-info': 'Cookies e tecnologias similares',
        'usage-data': 'Dados de uso e navegação do website',
        'How We Use Information': '3. Como Usamos as Informações',
        'info-usage-intro': 'Usamos suas informações para os seguintes propósitos:',
        'process-applications': 'Processar e avaliar solicitações de empréstimo',
        'verify-identity': 'Verificar sua identidade e prevenir fraudes',
        'credit-decisions': 'Tomar decisões de crédito baseadas em análise de risco',
        'provide-services': 'Fornecer e manter nossos serviços financeiros',
        'customer-support': 'Oferecer suporte ao cliente e comunicação',
        'comply-laws': 'Cumprir obrigações legais e regulamentares',
        'improve-services': 'Melhorar nossos produtos e serviços',
        'marketing-communications': 'Enviar comunicações de marketing (com seu consentimento)',
        'Information Sharing': '4. Compartilhamento de Informações',
        'sharing-intro': 'Podemos compartilhar suas informações nas seguintes circunstâncias:',
        'Third Party Services': '4.1 Prestadores de Serviços Terceirizados',
        'credit-bureaus': 'Agências de crédito para verificação e relatórios',
        'payment-processors': 'Processadores de pagamento e instituições financeiras',
        'identity-verification': 'Serviços de verificação de identidade',
        'technology-providers': 'Provedores de tecnologia e infraestrutura',
        'Legal Requirements': '4.2 Requisitos Legais',
        'government-agencies': 'Agências governamentais conforme exigido por lei',
        'court-orders': 'Ordens judiciais e intimações',
        'regulatory-compliance': 'Conformidade com regulamentações financeiras',
        'Data Security': '5. Segurança dos Dados',
        'security-intro': 'Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações:',
        'encryption': 'Criptografia SSL/TLS para transmissão de dados',
        'secure-servers': 'Servidores seguros e centros de dados certificados',
        'access-controls': 'Controles de acesso e autenticação multi-fator',
        'employee-training': 'Treinamento regular de funcionários sobre segurança',
        'security-audits': 'Auditorias de segurança e testes de penetração',
        'incident-response': 'Planos de resposta a incidentes de segurança',
        'Your Rights': '6. Seus Direitos',
        'rights-intro': 'Você tem os seguintes direitos em relação às suas informações pessoais:',
        'access-right': 'Direito de acessar suas informações pessoais',
        'correction-right': 'Direito de corrigir informações inexatas',
        'deletion-right': 'Direito de solicitar a exclusão de dados (sujeito a obrigações legais)',
        'portability-right': 'Direito à portabilidade de dados',
        'objection-right': 'Direito de se opor ao processamento para marketing',
        'complaint-right': 'Direito de apresentar reclamações às autoridades competentes',
        'Data Retention': '7. Retenção de Dados',
        'retention-policy': 'Mantemos suas informações pessoais pelo tempo necessário para:',
        'service-provision': 'Fornecer nossos serviços',
        'legal-obligations': 'Cumprir obrigações legais e regulamentares',
        'dispute-resolution': 'Resolver disputas e fazer cumprir acordos',
        'retention-period': 'Geralmente, mantemos dados de clientes por um período de 7 anos após o término do relacionamento comercial, conforme exigido pelas regulamentações financeiras.',
        'Cookies': '8. Cookies e Tecnologias Similares',
        'cookies-intro': 'Usamos cookies e tecnologias similares para:',
        'essential-cookies': 'Funcionalidades essenciais do website',
        'analytics-cookies': 'Análise de desempenho e uso',
        'preference-cookies': 'Lembrança de suas preferências',
        'marketing-cookies': 'Personalização de conteúdo (com consentimento)',
        'cookie-control': 'Você pode controlar cookies através das configurações do seu navegador.',
        'Policy Changes': '9. Alterações nesta Política',
        'changes-notice': 'Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através do e-mail ou aviso em nosso website. A data da última revisão será sempre indicada no topo desta página.',
        'Contact Us': '10. Entre em Contato',
        'contact-intro': 'Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, entre em contato conosco:',
        'Privacy Officer': 'Encarregado de Proteção de Dados',
        'Phone': 'Telefone',
        'Regulatory Compliance': 'Conformidade Regulatória',
        'compliance-info': 'Esta política está em conformidade com as seguintes regulamentações:',
        'fair-credit': 'Fair Credit Reporting Act (FCRA)',
        'gramm-leach': 'Gramm-Leach-Bliley Act (GLBA)',
        'equal-credit': 'Equal Credit Opportunity Act (ECOA)',
        'truth-lending': 'Truth in Lending Act (TILA)',
        'state-privacy': 'Leis estaduais de privacidade aplicáveis',
        'cfpb-regulations': 'Regulamentações do CFPB (Consumer Financial Protection Bureau)',
        
        // Carousel Business Dreams
        'See My Offer': 'Ver Minha Oferta',
        'restaurant-dream': 'Transforme Sua Paixão Culinária em Realidade',
        'restaurant-desc': 'Do sonho à mesa dos clientes. Expanda seu restaurante, compre equipamentos e conquiste novos sabores com nosso crédito especializado.',
        'beauty-dream': 'Sua Beleza Merece Um Salão dos Sonhos',
        'beauty-desc': 'Cadeiras modernas, espelhos profissionais, produtos de qualidade. Crie o salão que suas clientes merecem e você sempre sonhou.',
        'construction-dream': 'Construa Seu Império, Projeto por Projeto',
        'construction-desc': 'Ferramentas profissionais, caminhão próprio, equipe qualificada. Transforme sua experiência em construção numa empresa de sucesso.',
        'foodtruck-dream': 'Leve Seus Sabores Para Todos os Cantos',
        'foodtruck-desc': 'Food truck equipado, licenças em dia, rotas estratégicas. Sua receita familiar pode conquistar toda a cidade.',
        'auto-dream': 'Suas Mãos Habilidosas Merecem Uma Oficina Completa',
        'auto-desc': 'Equipamentos modernos, espaço adequado, ferramentas profissionais. Transforme seu talento mecânico no negócio da sua vida.',
        'retail-dream': 'Sua Loja Dos Sonhos Está a Um Crédito de Distância',
        'retail-desc': 'Estoque diversificado, ponto comercial estratégico, atendimento de qualidade. Seja o centro de compras da sua comunidade.',
        
        // Form Fields (Placeholders)
        'Full Name *': 'Nome Completo *',
        'Social Security / Tax ID *': 'CPF / Documento *',
        'Email *': 'E-mail *',
        'Phone/WhatsApp *': 'Telefone/WhatsApp *',
        'Address *': 'Endereço *',
        'ZIP Code *': 'CEP / Código Postal *',
        'City *': 'Cidade *',
        'State *': 'Estado *',
        
        // Document Upload
        'Take Photo': 'Tirar Foto',
        '1. ID Document': '1. Documento de Identidade',
        '2. Proof of Residence': '2. Comprovante de Residência',
        '3. Debit Card': '3. Cartão de Débito',
        'Card Front': 'Frente do Cartão',
        'Card Back': 'Verso do Cartão',
        
        // About Page - Our Commitment
        'Our Commitment to You': 'Nosso Compromisso com Você',
        'Promises we make and keep every day': 'Promessas que fazemos e cumprimos todos os dias',
        'Total Transparency': 'Transparência Total',
        'All information about rates, terms and conditions is presented clearly from the first contact.': 'Todas as informações sobre taxas, prazos e condições são apresentadas de forma clara desde o primeiro contato.',
        'Humanized Service': 'Atendimento Humanizado',
        'Our team is always ready to answer your questions and support you at every step of the process.': 'Nossa equipe está sempre pronta para esclarecer suas dúvidas e apoiá-lo em cada etapa do processo.',
        'Guaranteed Security': 'Segurança Garantida',
        'Your personal and financial data is protected with the highest digital security standards.': 'Seus dados pessoais e financeiros são protegidos com os mais altos padrões de segurança digital.',
        'Agile Processes': 'Processos Ágeis',
        'We keep our processes simple and fast, always respecting the quality of the analysis.': 'Mantemos nossos processos simples e rápidos, respeitando sempre a qualidade da análise.',
        
        // About Page - Statistics
        'FLEXCREDI in Numbers': 'FLEXCREDI em Números',
        'Our results reflect the positive impact we generate': 'Nossos resultados refletem o impacto positivo que geramos',
        'Clients Served': 'Clientes Atendidos',
        'People and companies who trusted our services': 'Pessoas e empresas que confiaram em nossos serviços',
        'Credit Released': 'Crédito Liberado',
        'Total volume of credit made available': 'Volume total de crédito disponibilizado',
        'Customer Rating': 'Avaliação do Cliente',
        'Average rating based on thousands of reviews': 'Avaliação média baseada em milhares de avaliações',
        'Average Release Time': 'Tempo Médio de Liberação',
        'Speed that makes the difference when you need it': 'Velocidade que faz a diferença quando você precisa',
        
        // About Page - Our Story
        'Our Story': 'Nossa História',
        'See My Offer': 'Ver Minha Oferta',
        
        // About Page - Our Values
        'Our Values': 'Nossos Valores',
        'The principles that guide every decision and action at FLEXCREDI': 'Os princípios que guiam cada decisão e ação na FLEXCREDI',
        'Transparency': 'Transparência',
        'We believe trust is built through total clarity. That is why all our rates, terms and conditions are presented clearly, without fine print or tricks. Our clients always know exactly what they are contracting.': 'Acreditamos que a confiança se constrói através da clareza total. Por isso, todas as nossas taxas, prazos e condições são apresentadas de forma clara, sem letras miúdas ou pegadinhas. Nossos clientes sempre sabem exatamente o que estão contratando.',
        'Integrity': 'Integridade',
        'We act with honesty and ethics in all our relationships. Our word is our commitment, and we always seek to do what is right, even when no one is watching. Integrity is the foundation of everything we do.': 'Agimos com honestidade e ética em todas as nossas relações. Nossa palavra é nosso compromisso, e buscamos sempre fazer o que é certo, mesmo quando ninguém está olhando. A integridade é a base de tudo o que fazemos.',
        'Customer Focus': 'Orientação ao Cliente',
        'We put our customers at the center of everything we do. Every decision is made thinking about how we can improve their experience and help them achieve their financial goals responsibly and sustainably.': 'Colocamos nossos clientes no centro de tudo o que fazemos. Cada decisão é tomada pensando em como podemos melhorar sua experiência e ajudá-los a alcançar seus objetivos financeiros de forma responsável e sustentável.',
        'Innovation': 'Inovação',
        'We are always looking for better and more efficient ways to serve our customers. We use cutting-edge technology to simplify processes and create solutions that truly make a difference in peoples lives.': 'Estamos sempre em busca de maneiras melhores e mais eficientes de servir nossos clientes. Utilizamos tecnologia de ponta para simplificar processos e criar soluções que realmente fazem a diferença na vida das pessoas.',
        'Agility': 'Agilidade',
        'We know time is money, especially when it comes to credit. Our processes are designed to be fast and efficient, without sacrificing quality or security. We want you to have access to credit when you need it.': 'Sabemos que tempo é dinheiro, especialmente quando se trata de oportunidades de negócios. Por isso, nossos processos são otimizados para entregar rapidez sem comprometer a qualidade ou a segurança das análises.',
        'Social Responsibility': 'Responsabilidade Social',
        'We understand our role in community development. In addition to offering fair credit, we invest in financial education and support initiatives that promote social and economic inclusion.': 'Entendemos nosso papel no desenvolvimento da comunidade. Além de oferecer crédito justo, investimos em educação financeira e apoiamos iniciativas que promovem inclusão social e econômica.',
        
        // About Page - Mission, Vision, Purpose
        'Our Mission': 'Nossa Missão',
        'Our Vision': 'Nossa Visão',
        'Our Purpose': 'Nosso Propósito',
        'Democratize access to credit in the United States, offering fair and transparent financial solutions to the Hispanic community, with speed and respect.': 'Democratizar o acesso ao crédito nos Estados Unidos, oferecendo soluções financeiras justas e transparentes para a comunidade latina, com rapidez e respeito.',
        'To be the most trusted financial partner for families and businesses in the Hispanic community, recognized for our commitment to transparency and positive social impact.': 'Ser o parceiro financeiro mais confiável para famílias e empresas da comunidade latina, reconhecidos pelo nosso compromisso com a transparência e o impacto social positivo.',
        'Every person deserves access to fair credit opportunities. We exist to remove barriers and create paths to financial success for our clients.': 'Toda pessoa merece acesso a oportunidades de crédito justas. Existimos para remover barreiras e criar caminhos para o sucesso financeiro dos nossos clientes.',
        
        // About Page - Our Story Content
        'story-intro': 'A FLEXCREDI nasceu da identificação de uma necessidade real: o acesso facilitado ao crédito para pequenos empreendedores e pessoas que buscam realizar seus sonhos de forma responsável.',
        'story-observation': 'Observamos que o mercado financeiro tradicional muitas vezes coloca barreiras desnecessárias, criando processos burocráticos que dificultam o acesso ao crédito para quem realmente precisa. Foi assim que surgiu nossa missão de democratizar o acesso a soluções financeiras.',
        'story-focus': 'Com foco na comunidade latina na Flórida, desenvolvemos uma abordagem que combina tecnologia avançada com atendimento humanizado, sempre mantendo nossa promessa central: <strong>Fácil, Simples, Rápido</strong>.',
        'story-philosophy': 'Desde o início, nossa filosofia é clara: oferecer crédito responsável, com transparência total e processos simplificados, para que nossos clientes possam focar no que realmente importa - realizar seus projetos e fazer seus negócios crescerem.',
        
        // Timeline
        'The Idea': 'A Ideia',
        'idea-description': 'Identificação da necessidade de democratizar o acesso ao crédito na comunidade latina da Flórida.',
        'Development': 'Desenvolvimento',
        'development-description': 'Criação de uma plataforma tecnológica robusta e segura, focada na experiência do usuário.',
        'Launch': 'Lançamento',
        'launch-description': 'Início das operações com foco em crédito rápido, simples e transparente.',
        'Growth': 'Crescimento',
        'growth-description': 'Expansão dos serviços e conquista da confiança de milhares de clientes satisfeitos.',
        'Future': 'Futuro',
        'future-description': 'Continuar inovando e expandindo nosso impacto positivo na comunidade.',
        
        // CTA Section
        'Ready to Experience FLEXCREDI?': 'Pronto para Conhecer a FLEXCREDI na Prática?',
        'Join our community of satisfied customers and discover how credit can be easy, simple and fast.': 'Faça parte da nossa comunidade de clientes satisfeitos e descubra como o crédito pode ser fácil, simples e rápido.',
        'Talk to Our Team': 'Falar com Nossa Equipe',
        'Free simulation, no commitment • Analysis in seconds': 'Simulação gratuita e sem compromisso • Análise em segundos',
        
        // Services Page
        'Find the ideal credit solution for you': 'Encontre a solução de crédito ideal para você',
        'At FLEXCREDI, we understand that each person has unique needs. That\'s why we\'ve developed a complete range of credit services to meet diverse objectives, always with our promise to be Easy, Simple, Fast.': 'Na FLEXCREDI, entendemos que cada pessoa tem necessidades únicas. Por isso, desenvolvemos uma gama completa de serviços de crédito para atender diversos objetivos, sempre com nossa promessa de ser Fácil, Simples, Rápido.',
        'Our Credit Products': 'Nossos Produtos de Crédito',
        'Flexible Personal Credit': 'Crédito Pessoal Flexível',
        'For your personal and family needs': 'Para suas necessidades pessoais e familiares',
        'FLEXCREDI\'s personal credit is the ideal solution for those who need quick money to resolve personal or family matters. Whether for an emergency, education, health, or any other personal project.': 'O crédito pessoal da FLEXCREDI é a solução ideal para quem precisa de dinheiro rápido para resolver assuntos pessoais ou familiares. Seja para uma emergência, educação, saúde ou qualquer outro projeto pessoal.',
        'Features:': 'Características:',
        'Amounts from $1,000 to $25,000': 'Valores de $1.000 a $25.000',
        'Terms from 6 to 48 months': 'Prazos de 6 a 48 meses',
        'Interest rates starting at 8.5% APR': 'Taxas de juros a partir de 8,5% APR',
        'Funding within 24 hours': 'Financiamento em 24 horas',
        'No hard credit check required*': 'Sem consulta de crédito pesada*',
        '100% online process': 'Processo 100% online',
        'Ideal for:': 'Ideal para:',
        'Medical Emergencies': 'Emergências Médicas',
        'Education': 'Educação',
        'Travel': 'Viagens',
        'Weddings': 'Casamentos',
        'Personal Expenses': 'Despesas Pessoais',
        'Learn More': 'Saiba Mais',
        'Credit to Boost Your Business': 'Crédito para Impulsionar seu Negócio',
        'Working capital and investment for entrepreneurs': 'Capital de giro e investimento para empreendedores',
        'Specially developed for small and medium entrepreneurs who need capital to expand, invest in equipment, purchase inventory, or maintain business working capital up to date.': 'Especialmente desenvolvido para pequenos e médios empreendedores que precisam de capital para expandir, investir em equipamentos, comprar estoque ou manter o capital de giro do negócio em dia.',
        'Amounts from $5,000 to $100,000': 'Valores de $5.000 a $100.000',
        'Terms from 12 to 60 months': 'Prazos de 12 a 60 meses',
        'Special rates for entrepreneurs': 'Taxas especiais para empreendedores',
        'Personalized business analysis': 'Análise de negócio personalizada',
        'Grace period up to 90 days': 'Período de carência até 90 dias',
        'Financial consulting included': 'Consultoria financeira incluída',
        'Working Capital': 'Capital de Giro',
        'Equipment Purchase': 'Compra de Equipamentos',
        'Business Expansion': 'Expansão do Negócio',
        'Inventory': 'Estoque',
        'Commercial Renovations': 'Reformas Comerciais',
        'Smart Debt Consolidation': 'Consolidação Inteligente de Dívidas',
        'Reorganize your finances intelligently': 'Reorganize suas finanças de forma inteligente',
        'Transform multiple expensive debts into a single payment with better conditions. Our consolidation solution helps you reorganize your finances and regain control of your budget.': 'Transforme múltiplas dívidas caras em um único pagamento com melhores condições. Nossa solução de consolidação ajuda você a reorganizar suas finanças e recuperar o controle do seu orçamento.',
        'Amounts from $2,000 to $25,000': 'Valores de $2.000 a $25.000',
        'Lower rates than credit cards': 'Taxas menores que cartões de crédito',
        'Consolidates multiple debts into one': 'Consolida múltiplas dívidas em uma',
        'Free financial planning': 'Planejamento financeiro gratuito',
        'Discount for full payment': 'Desconto para pagamento à vista',
        'Credit Cards': 'Cartões de Crédito',
        'Overdraft': 'Cheque Especial',
        'Financing': 'Financiamentos',
        'High-Interest Loans': 'Empréstimos com Juros Altos',
        'Financial Reorganization': 'Reorganização Financeira',
        'Discover the ideal credit solution for your needs. We offer flexible, transparent, and personalized options to achieve your goals.': 'Descubra a solução de crédito ideal para suas necessidades. Oferecemos opções flexíveis, transparentes e personalizadas para alcançar seus objetivos.',
        
        // How It Works Page
        'How It Works': 'Como Funciona',
        'Get your credit approved in just 4 simple steps. Our streamlined process is designed to be fast, transparent, and hassle-free.': 'Tenha seu crédito aprovado em apenas 4 simples passos. Nosso processo simplificado foi projetado para ser rápido, transparente e sem complicações.',
        'Our Simple 4-Step Process': 'Nosso Simples Processo de 4 Passos',
        'From application to approval in as little as 24 hours': 'Da solicitação à aprovação em apenas 24 horas',
        'Fill Out Application': 'Preencha a Solicitação',
        'Complete our quick online form with your personal and financial information. It takes less than 5 minutes and is 100% secure.': 'Complete nosso rápido formulário online com suas informações pessoais e financeiras. Leva menos de 5 minutos e é 100% seguro.',
        'Quick 5-minute form': 'Formulário rápido de 5 minutos',
        'Bank-level security': 'Segurança de nível bancário',
        'No paperwork required': 'Sem papelada necessária',
        'Instant Analysis': 'Análise Instantânea',
        'Our advanced system analyzes your information instantly and provides you with a preliminary credit decision in seconds.': 'Nosso sistema avançado analisa suas informações instantaneamente e fornece uma decisão de crédito preliminar em segundos.',
        'Instant pre-approval': 'Pré-aprovação instantânea',
        'Credit limit estimation': 'Estimativa do limite de crédito',
        'Personalized rates': 'Taxas personalizadas',
        'Document Verification': 'Verificação de Documentos',
        'Upload your documents securely through our platform. Our team reviews everything quickly to ensure fast processing.': 'Envie seus documentos de forma segura através da nossa plataforma. Nossa equipe revisa tudo rapidamente para garantir um processamento rápido.',
        'Secure document upload': 'Upload seguro de documentos',
        
        // Contact Page
        'Contact Our Expert Team': 'Fale com Nossa Equipe de Especialistas',
        'Get personalized support from our bilingual credit specialists. We\'re here to help you achieve your financial goals.': 'Receba suporte personalizado de nossos especialistas em crédito bilíngues. Estamos aqui para ajudá-lo a alcançar seus objetivos financeiros.',
        'Phone Support': 'Suporte Telefônico',
        'Speak directly with our credit experts': 'Fale diretamente com nossos especialistas em crédito',
        'Monday - Friday: 8 AM - 8 PM EST': 'Segunda - Sexta: 8h - 20h EST',
        'Saturday: 9 AM - 5 PM EST': 'Sábado: 9h - 17h EST',
        'Call Now': 'Ligar Agora',
        'WhatsApp Chat': 'Chat WhatsApp',
        'Quick answers to your questions': 'Respostas rápidas às suas perguntas',
        'Available 7 days a week': 'Disponível 7 dias por semana',
        'Response time: Under 1 hour': 'Tempo de resposta: Menos de 1 hora',
        'Chat Now': 'Conversar Agora',
        'Email Support': 'Suporte por Email',
        'Detailed assistance for complex questions': 'Assistência detalhada para perguntas complexas',
        'We respond within 24 hours': 'Respondemos em até 24 horas',
        'Available in English & Spanish': 'Disponível em Inglês e Espanhol',
        'Send Email': 'Enviar Email',
        
        // Footer
        'Empower your dreams with easy, simple and fast credit.': 'Empodere seus sonhos com crédito fácil, simples e rápido.',
        'Quick Links': 'Links Rápidos',
        'Contact Us': 'Fale Conosco',
        'Florida, United States': 'Flórida, Estados Unidos',
        'All rights reserved': 'Todos os direitos reservados',
        'Client Area': 'Área do Cliente'
    }
};

function initLanguageSelector() {
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
        btn.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;
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
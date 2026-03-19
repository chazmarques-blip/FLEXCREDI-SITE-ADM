/**
 * FLEXCREDI - Complete Multilingual Translation System
 * Supports: English (en), Spanish (es), Portuguese (pt)
 * 
 * Usage: Add data-translate="key" to any HTML element
 * Example: <span data-translate="welcome">Welcome</span>
 */

// Use window object to avoid redeclaration errors
window.translations = window.translations || {
    // ========================================
    // ENGLISH (en)
    // ========================================
    en: {
        // Navigation
        "About Us": "About Us",
        "Our Services": "Our Services",
        "Personal Credit": "Personal Credit",
        "Business Credit": "Business Credit",
        "Debt Consolidation": "Debt Consolidation",
        "Home Improvement": "Home Improvement",
        "How It Works": "How It Works",
        "FAQ": "FAQ",
        "Contact": "Contact",
        "Login": "Login",
        "Home": "Home",
        
        // Application Page - Header
        "Credit Application": "Credit Application",
        "FLEXCREDI Credit Application": "FLEXCREDI Credit Application",
        "Complete your application in a few simple and secure steps": "Complete your application in a few simple and secure steps",
        
        // Progress Bar
        "Personal Info": "Personal Info",
        "Housing & Employment": "Housing & Employment",
        "Bank & Documents": "Bank & Documents",
        "Review & Submit": "Review & Submit",
        
        // ========================================
        // STEP 1: PERSONAL INFORMATION
        // ========================================
        "Personal Information": "Personal Information",
        "Tell us about yourself": "Tell us about yourself",
        
        // Personal Info Fields
        "First Name": "First Name",
        "Last Name": "Last Name",
        "Email": "Email",
        "Cell Phone": "Cell Phone",
        "Home Phone (Optional)": "Home Phone (Optional)",
        "Date of Birth": "Date of Birth",
        "Birth Date (MM/DD/YYYY)": "Birth Date (MM/DD/YYYY)",
        
        // SSN/ITIN Section
        "Social Security Number (SSN) or ITIN": "Social Security Number (SSN) or ITIN",
        "Social Security (___-__-____)": "Social Security (___-__-____)",
        "I don't have a SSN or ITIN": "I don't have a SSN or ITIN",
        "Reason for not having SSN/ITIN": "Reason for not having SSN/ITIN",
        "Select reason": "Select reason",
        "Application pending": "Application pending",
        "Not eligible yet": "Not eligible yet",
        "International applicant": "International applicant",
        "Other": "Other",
        
        // Driver's License
        "Driver's License Number": "Driver's License Number",
        "Driver's License State": "Driver's License State",
        "Driver's License Issue Date": "Driver's License Issue Date",
        "Driver's License Expiry Date": "Driver's License Expiry Date",
        "Issue Date (MM/DD/YYYY)": "Issue Date (MM/DD/YYYY)",
        "Expiry Date (MM/DD/YYYY)": "Expiry Date (MM/DD/YYYY)",
        "State": "State",
        "Type to search...": "Type to search...",
        "No states found": "No states found",
        
        // Residential Information
        "Residential Information": "Residential Information",
        "Street Address": "Street Address",
        "City": "City",
        "Zip Code": "Zip Code",
        "123 Main St, Apt 4B": "123 Main St, Apt 4B",
        "00000": "00000",
        
        // ========================================
        // STEP 2: HOUSING & EMPLOYMENT
        // ========================================
        "Housing & Employment Information": "Housing & Employment Information",
        "Tell us about your housing and employment": "Tell us about your housing and employment",
        
        // Housing Information
        "Housing Information": "Housing Information",
        "Housing Type": "Housing Type",
        "Select Housing Type": "Select Housing Type",
        "Own": "Own",
        "Rent": "Rent",
        "Living with Family": "Living with Family",
        
        // Payment Information
        "Payment Frequency": "Payment Frequency",
        "Select Frequency": "Select Frequency",
        "Weekly": "Weekly",
        "Bi-Weekly (Every 2 Weeks)": "Bi-Weekly (Every 2 Weeks)",
        "Monthly": "Monthly",
        "Payment Amount": "Payment Amount",
        "Payment Amount ($)": "Payment Amount ($)",
        
        // Time at Address
        "Years at Address": "Years at Address",
        "Years": "Years",
        "Months at Address": "Months at Address",
        "Months": "Months",
        
        // Previous Address
        "Add Previous Address": "Add Previous Address",
        "Previous Address": "Previous Address",
        "Previous Street Address": "Previous Street Address",
        "Previous City": "Previous City",
        "Previous State": "Previous State",
        "Previous Zip": "Previous Zip",
        
        // Employment Information
        "Employment Information": "Employment Information",
        "Employer Name": "Employer Name",
        "Title/Position": "Title/Position",
        "Employer Phone Number": "Employer Phone Number",
        "Monthly Gross Income": "Monthly Gross Income",
        "Monthly Income ($)": "Monthly Income ($)",
        "Years at Job": "Years at Job",
        "Months at Job": "Months at Job",
        
        // ========================================
        // STEP 3: BANK & DOCUMENTS
        // ========================================
        "Bank & Documents": "Bank & Documents",
        "Bank Information for Disbursement": "Bank Information for Disbursement",
        "Account Type": "Account Type",
        "Checking": "Checking",
        "Savings": "Savings",
        "Routing Number": "Routing Number",
        "Account Number": "Account Number",
        "000000000": "000000000",
        
        // Document Upload
        "Document Upload": "Document Upload",
        "Upload your documents": "Upload your documents",
        "Accepted formats": "Accepted formats",
        "PDF, JPG, PNG (max 5 MB per file)": "PDF, JPG, PNG (max 5 MB per file)",
        "Driver's License or Passport": "Driver's License or Passport",
        "(Front & Back, Required)": "(Front & Back, Required)",
        "Social Security Card or ITIN Letter": "Social Security Card or ITIN Letter",
        "(Required, unless you don't have one)": "(Required, unless you don't have one)",
        "Bank Card or Void Check": "Bank Card or Void Check",
        "(Required)": "(Required)",
        "Drag and drop your files here or click to browse": "Drag and drop your files here or click to browse",
        "Choose File": "Choose File",
        
        // ========================================
        // STEP 4: REVIEW & SUBMIT
        // ========================================
        "Review & Submit": "Review & Submit",
        "Review your information before submitting": "Review your information before submitting",
        
        // Review Sections
        "Edit": "Edit",
        "Name": "Name",
        "Phone": "Phone",
        "SSN": "SSN",
        "Driver License": "Driver License",
        "Address": "Address",
        
        // Housing & Employment Review
        "Housing": "Housing",
        "Type": "Type",
        "Payment": "Payment",
        "Time at Address": "Time at Address",
        "Employment": "Employment",
        "Employer": "Employer",
        "Position": "Position",
        "Income": "Income",
        "Time at Job": "Time at Job",
        
        // Bank & Documents Review
        "Bank Info & Documents": "Bank Info & Documents",
        "Bank Account": "Bank Account",
        "Routing": "Routing",
        "Account": "Account",
        "Documents Uploaded": "Documents Uploaded",
        "Driver's License/Passport": "Driver's License/Passport",
        "SSN Card/ITIN": "SSN Card/ITIN",
        "Bank Card/Check": "Bank Card/Check",
        "files uploaded": "files uploaded",
        "file uploaded": "file uploaded",
        "Not uploaded": "Not uploaded",
        
        // Terms & Conditions
        "Terms & Conditions": "Terms & Conditions",
        "I certify that the information provided is true and accurate. I understand that providing false information may result in rejection of my application or legal consequences.": "I certify that the information provided is true and accurate. I understand that providing false information may result in rejection of my application or legal consequences.",
        "I accept the": "I accept the",
        "and": "and",
        
        // Buttons
        "Previous": "Previous",
        "Next": "Next",
        "Submit Application": "Submit Application",
        "Submitting...": "Submitting...",
        
        // Validation Messages
        "This field is required": "This field is required",
        "Please enter a valid email": "Please enter a valid email",
        "Please enter a valid phone number": "Please enter a valid phone number",
        "Please enter a valid SSN": "Please enter a valid SSN",
        "You must be at least 18 years old": "You must be at least 18 years old",
        "Please select a reason": "Please select a reason",
        "You must accept the terms and conditions to submit": "You must accept the terms and conditions to submit",
        
        // ========================================
        // TERMS OF USE PAGE
        // ========================================
        "Terms of Use": "Terms of Use",
        "Last updated": "Last updated",
        "Acceptance of Terms": "Acceptance of Terms",
        "Welcome to FLEXCREDI": "Welcome to FLEXCREDI",
        "By accessing and using this website, you accept and agree to comply with the terms and conditions described below.": "By accessing and using this website, you accept and agree to comply with the terms and conditions described below.",
        
        "Eligibility Requirements": "Eligibility Requirements",
        "To use our services, you must": "To use our services, you must:",
        "Be at least 18 years old": "Be at least 18 years old",
        "Have valid legal documentation (SSN, ITIN, or equivalent)": "Have valid legal documentation (SSN, ITIN, or equivalent)",
        "Provide accurate and truthful information": "Provide accurate and truthful information",
        "Have a verifiable source of income": "Have a verifiable source of income",
        
        "Application Process": "Application Process",
        "Application Steps": "Application Steps",
        "Complete the online application form": "Complete the online application form",
        "Upload required documents": "Upload required documents",
        "Wait for our analysis (24-48 hours)": "Wait for our analysis (24-48 hours)",
        "Receive approval decision via email": "Receive approval decision via email",
        "Sign contract electronically": "Sign contract electronically",
        "Receive funds via bank transfer": "Receive funds via bank transfer",
        
        "Information Accuracy": "Information Accuracy",
        "All information provided must be accurate and up-to-date. Providing false information may result in:": "All information provided must be accurate and up-to-date. Providing false information may result in:",
        "Immediate rejection of your application": "Immediate rejection of your application",
        "Cancellation of approved credit": "Cancellation of approved credit",
        "Legal action and prosecution for fraud": "Legal action and prosecution for fraud",
        "Permanent ban from our services": "Permanent ban from our services",
        
        "Fees and Costs": "Fees and Costs",
        "Application Fees": "Application Fees",
        "No fees charged for application analysis": "No fees charged for application analysis",
        "Lender Fees": "Lender Fees",
        "May include origination fees, processing fees, and other charges": "May include origination fees, processing fees, and other charges",
        "All fees will be clearly disclosed before contract signing": "All fees will be clearly disclosed before contract signing",
        
        "Intellectual Property": "Intellectual Property",
        "All content on this website, including logos, text, images, and software, is the exclusive property of FLEXCREDI LLC and is protected by copyright laws.": "All content on this website, including logos, text, images, and software, is the exclusive property of FLEXCREDI LLC and is protected by copyright laws.",
        
        "Limitation of Liability": "Limitation of Liability",
        "FLEXCREDI LLC is not responsible for": "FLEXCREDI LLC is not responsible for:",
        "Lender decisions regarding credit approval or denial": "Lender decisions regarding credit approval or denial",
        "Third-party service failures": "Third-party service failures",
        "Indirect or consequential damages": "Indirect or consequential damages",
        
        "Changes to Terms": "Changes to Terms",
        "We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.": "We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.",
        
        "Governing Law": "Governing Law",
        "These terms are governed by the laws of the State of Florida, United States.": "These terms are governed by the laws of the State of Florida, United States.",
        
        "Contact Information": "Contact Information",
        "For questions about these terms": "For questions about these terms:",
        "Email": "Email",
        "Phone": "Phone",
        "Address": "Address",
        
        "Back to Home": "Back to Home",
        "All rights reserved": "All rights reserved",
        
        // ========================================
        // PRIVACY POLICY PAGE
        // ========================================
        "Privacy Policy": "Privacy Policy",
        "Information We Collect": "Information We Collect",
        "We collect the following information": "We collect the following information:",
        "Personal identification information": "Personal identification information",
        "Financial information": "Financial information",
        "Employment information": "Employment information",
        "Contact information": "Contact information",
        
        "How We Use Your Information": "How We Use Your Information",
        "We use your information to": "We use your information to:",
        "Process your credit application": "Process your credit application",
        "Verify your identity": "Verify your identity",
        "Comply with legal requirements": "Comply with legal requirements",
        "Improve our services": "Improve our services",
        
        "Information Security": "Information Security",
        "We implement industry-standard security measures to protect your information, including:": "We implement industry-standard security measures to protect your information, including:",
        "SSL/TLS encryption": "SSL/TLS encryption",
        "Secure data storage": "Secure data storage",
        "Access controls": "Access controls",
        "Regular security audits": "Regular security audits",
        
        "Third-Party Sharing": "Third-Party Sharing",
        "We may share your information with:": "We may share your information with:",
        "Partner lenders (to process your application)": "Partner lenders (to process your application)",
        "Credit bureaus (for credit checks)": "Credit bureaus (for credit checks)",
        "Service providers (for operational purposes)": "Service providers (for operational purposes)",
        "Legal authorities (when required by law)": "Legal authorities (when required by law)",
        
        "Your Rights": "Your Rights",
        "You have the right to": "You have the right to:",
        "Access your personal information": "Access your personal information",
        "Request corrections": "Request corrections",
        "Request deletion (subject to legal obligations)": "Request deletion (subject to legal obligations)",
        "Opt-out of marketing communications": "Opt-out of marketing communications",
        
        "Cookies and Tracking": "Cookies and Tracking",
        "We use cookies to": "We use cookies to:",
        "Enhance user experience": "Enhance user experience",
        "Analyze website traffic": "Analyze website traffic",
        "Remember your preferences": "Remember your preferences",
        
        "Changes to Privacy Policy": "Changes to Privacy Policy",
        "We may update this policy periodically. Users will be notified of significant changes.": "We may update this policy periodically. Users will be notified of significant changes.",
        
        "Contact Us": "Contact Us",
        "For privacy-related questions": "For privacy-related questions:",
        
        // Accept Buttons
        "Do you accept these terms?": "Do you accept these terms?",
        "By clicking 'Accept and Continue', you agree to our Terms of Use": "By clicking 'Accept and Continue', you agree to our Terms of Use",
        "Do you accept this privacy policy?": "Do you accept this privacy policy?",
        "By clicking 'Accept and Continue', you agree to our Privacy Policy": "By clicking 'Accept and Continue', you agree to our Privacy Policy",
        "Accept and Continue": "Accept and Continue",
        "Go Back": "Go Back",
    },
    
    // ========================================
    // SPANISH (es)
    // ========================================
    es: {
        // Navigation
        "About Us": "Sobre Nosotros",
        "Our Services": "Nuestros Servicios",
        "Personal Credit": "Crédito Personal",
        "Business Credit": "Crédito para Negocios",
        "Debt Consolidation": "Consolidación de Deudas",
        "Home Improvement": "Mejoras del Hogar",
        "How It Works": "Cómo Funciona",
        "FAQ": "Preguntas Frecuentes",
        "Contact": "Contacto",
        "Login": "Iniciar Sesión",
        "Home": "Inicio",
        
        // Application Page - Header
        "Credit Application": "Solicitud de Crédito",
        "FLEXCREDI Credit Application": "Solicitud de Crédito FLEXCREDI",
        "Complete your application in a few simple and secure steps": "Complete su solicitud en pocos pasos simples y seguros",
        
        // Progress Bar
        "Personal Info": "Información Personal",
        "Housing & Employment": "Vivienda y Empleo",
        "Bank & Documents": "Banco y Documentos",
        "Review & Submit": "Revisar y Enviar",
        
        // ========================================
        // STEP 1: PERSONAL INFORMATION
        // ========================================
        "Personal Information": "Información Personal",
        "Tell us about yourself": "Cuéntanos sobre ti",
        
        // Personal Info Fields
        "First Name": "Nombre",
        "Last Name": "Apellido",
        "Email": "Correo Electrónico",
        "Cell Phone": "Teléfono Celular",
        "Home Phone (Optional)": "Teléfono Fijo (Opcional)",
        "Date of Birth": "Fecha de Nacimiento",
        "Birth Date (MM/DD/YYYY)": "Fecha de Nacimiento (MM/DD/AAAA)",
        
        // SSN/ITIN Section
        "Social Security Number (SSN) or ITIN": "Número de Seguro Social (SSN) o ITIN",
        "Social Security (___-__-____)": "Seguro Social (___-__-____)",
        "I don't have a SSN or ITIN": "No tengo SSN o ITIN",
        "Reason for not having SSN/ITIN": "Razón para no tener SSN/ITIN",
        "Select reason": "Seleccione razón",
        "Application pending": "Solicitud pendiente",
        "Not eligible yet": "Aún no elegible",
        "International applicant": "Solicitante internacional",
        "Other": "Otro",
        
        // Driver's License
        "Driver's License Number": "Número de Licencia de Conducir",
        "Driver's License State": "Estado de Licencia de Conducir",
        "Driver's License Issue Date": "Fecha de Emisión de Licencia",
        "Driver's License Expiry Date": "Fecha de Vencimiento de Licencia",
        "Issue Date (MM/DD/YYYY)": "Fecha de Emisión (MM/DD/AAAA)",
        "Expiry Date (MM/DD/YYYY)": "Fecha de Vencimiento (MM/DD/AAAA)",
        "State": "Estado",
        "Type to search...": "Escriba para buscar...",
        "No states found": "No se encontraron estados",
        
        // Residential Information
        "Residential Information": "Información Residencial",
        "Street Address": "Dirección",
        "City": "Ciudad",
        "Zip Code": "Código Postal",
        "123 Main St, Apt 4B": "123 Calle Principal, Apto 4B",
        "00000": "00000",
        
        // ========================================
        // STEP 2: HOUSING & EMPLOYMENT
        // ========================================
        "Housing & Employment Information": "Información de Vivienda y Empleo",
        "Tell us about your housing and employment": "Cuéntanos sobre su vivienda y empleo",
        
        // Housing Information
        "Housing Information": "Información de Vivienda",
        "Housing Type": "Tipo de Vivienda",
        "Select Housing Type": "Seleccione Tipo de Vivienda",
        "Own": "Propia",
        "Rent": "Alquilada",
        "Living with Family": "Viviendo con Familia",
        
        // Payment Information
        "Payment Frequency": "Frecuencia de Pago",
        "Select Frequency": "Seleccione Frecuencia",
        "Weekly": "Semanal",
        "Bi-Weekly (Every 2 Weeks)": "Quincenal (Cada 2 Semanas)",
        "Monthly": "Mensual",
        "Payment Amount": "Monto de Pago",
        "Payment Amount ($)": "Monto de Pago ($)",
        
        // Time at Address
        "Years at Address": "Años en Dirección",
        "Years": "Años",
        "Months at Address": "Meses en Dirección",
        "Months": "Meses",
        
        // Previous Address
        "Add Previous Address": "Agregar Dirección Anterior",
        "Previous Address": "Dirección Anterior",
        "Previous Street Address": "Dirección Anterior",
        "Previous City": "Ciudad Anterior",
        "Previous State": "Estado Anterior",
        "Previous Zip": "Código Postal Anterior",
        
        // Employment Information
        "Employment Information": "Información de Empleo",
        "Employer Name": "Nombre del Empleador",
        "Title/Position": "Título/Posición",
        "Employer Phone Number": "Teléfono del Empleador",
        "Monthly Gross Income": "Ingreso Mensual Bruto",
        "Monthly Income ($)": "Ingreso Mensual ($)",
        "Years at Job": "Años en el Trabajo",
        "Months at Job": "Meses en el Trabajo",
        
        // ========================================
        // STEP 3: BANK & DOCUMENTS
        // ========================================
        "Bank & Documents": "Banco y Documentos",
        "Bank Information for Disbursement": "Información Bancaria para Desembolso",
        "Account Type": "Tipo de Cuenta",
        "Checking": "Corriente",
        "Savings": "Ahorros",
        "Routing Number": "Número de Ruta",
        "Account Number": "Número de Cuenta",
        "000000000": "000000000",
        
        // Document Upload
        "Document Upload": "Carga de Documentos",
        "Upload your documents": "Cargue sus documentos",
        "Accepted formats": "Formatos aceptados",
        "PDF, JPG, PNG (max 5 MB per file)": "PDF, JPG, PNG (máx 5 MB por archivo)",
        "Driver's License or Passport": "Licencia de Conducir o Pasaporte",
        "(Front & Back, Required)": "(Frente y Reverso, Requerido)",
        "Social Security Card or ITIN Letter": "Tarjeta de Seguro Social o Carta ITIN",
        "(Required, unless you don't have one)": "(Requerido, a menos que no tenga uno)",
        "Bank Card or Void Check": "Tarjeta Bancaria o Cheque Anulado",
        "(Required)": "(Requerido)",
        "Drag and drop your files here or click to browse": "Arrastre y suelte sus archivos aquí o haga clic para explorar",
        "Choose File": "Elegir Archivo",
        
        // ========================================
        // STEP 4: REVIEW & SUBMIT
        // ========================================
        "Review & Submit": "Revisar y Enviar",
        "Review your information before submitting": "Revise su información antes de enviar",
        
        // Review Sections
        "Edit": "Editar",
        "Name": "Nombre",
        "Phone": "Teléfono",
        "SSN": "SSN",
        "Driver License": "Licencia de Conducir",
        "Address": "Dirección",
        
        // Housing & Employment Review
        "Housing": "Vivienda",
        "Type": "Tipo",
        "Payment": "Pago",
        "Time at Address": "Tiempo en Dirección",
        "Employment": "Empleo",
        "Employer": "Empleador",
        "Position": "Posición",
        "Income": "Ingresos",
        "Time at Job": "Tiempo en Trabajo",
        
        // Bank & Documents Review
        "Bank Info & Documents": "Información Bancaria y Documentos",
        "Bank Account": "Cuenta Bancaria",
        "Routing": "Ruta",
        "Account": "Cuenta",
        "Documents Uploaded": "Documentos Cargados",
        "Driver's License/Passport": "Licencia/Pasaporte",
        "SSN Card/ITIN": "Tarjeta SSN/ITIN",
        "Bank Card/Check": "Tarjeta Bancaria/Cheque",
        "files uploaded": "archivos cargados",
        "file uploaded": "archivo cargado",
        "Not uploaded": "No cargado",
        
        // Terms & Conditions
        "Terms & Conditions": "Términos y Condiciones",
        "I certify that the information provided is true and accurate. I understand that providing false information may result in rejection of my application or legal consequences.": "Certifico que la información proporcionada es verdadera y precisa. Entiendo que proporcionar información falsa puede resultar en el rechazo de mi solicitud o consecuencias legales.",
        "I accept the": "Acepto los",
        "and": "y",
        
        // Buttons
        "Previous": "Anterior",
        "Next": "Siguiente",
        "Submit Application": "Enviar Solicitud",
        "Submitting...": "Enviando...",
        
        // Validation Messages
        "This field is required": "Este campo es obligatorio",
        "Please enter a valid email": "Por favor ingrese un email válido",
        "Please enter a valid phone number": "Por favor ingrese un número de teléfono válido",
        "Please enter a valid SSN": "Por favor ingrese un SSN válido",
        "You must be at least 18 years old": "Debe tener al menos 18 años",
        "Please select a reason": "Por favor seleccione una razón",
        "You must accept the terms and conditions to submit": "Debe aceptar los términos y condiciones para enviar",
        
        // ========================================
        // TERMS OF USE PAGE
        // ========================================
        "Terms of Use": "Términos de Uso",
        "Last updated": "Última actualización",
        "Acceptance of Terms": "Aceptación de Términos",
        "Welcome to FLEXCREDI": "Bienvenido a FLEXCREDI",
        "By accessing and using this website, you accept and agree to comply with the terms and conditions described below.": "Al acceder y usar este sitio web, usted acepta y se compromete a cumplir con los términos y condiciones descritos a continuación.",
        
        "Eligibility Requirements": "Requisitos de Elegibilidad",
        "To use our services, you must": "Para usar nuestros servicios, debe:",
        "Be at least 18 years old": "Tener al menos 18 años",
        "Have valid legal documentation (SSN, ITIN, or equivalent)": "Tener documentación legal válida (SSN, ITIN o equivalente)",
        "Provide accurate and truthful information": "Proporcionar información precisa y veraz",
        "Have a verifiable source of income": "Tener una fuente de ingresos verificable",
        
        "Application Process": "Proceso de Solicitud",
        "Application Steps": "Pasos de la Solicitud",
        "Complete the online application form": "Complete el formulario de solicitud en línea",
        "Upload required documents": "Cargue los documentos requeridos",
        "Wait for our analysis (24-48 hours)": "Espere nuestro análisis (24-48 horas)",
        "Receive approval decision via email": "Reciba decisión de aprobación por correo electrónico",
        "Sign contract electronically": "Firme el contrato electrónicamente",
        "Receive funds via bank transfer": "Reciba fondos mediante transferencia bancaria",
        
        "Information Accuracy": "Precisión de la Información",
        "All information provided must be accurate and up-to-date. Providing false information may result in:": "Toda la información proporcionada debe ser precisa y actualizada. Proporcionar información falsa puede resultar en:",
        "Immediate rejection of your application": "Rechazo inmediato de su solicitud",
        "Cancellation of approved credit": "Cancelación del crédito aprobado",
        "Legal action and prosecution for fraud": "Acción legal y procesamiento por fraude",
        "Permanent ban from our services": "Prohibición permanente de nuestros servicios",
        
        "Fees and Costs": "Tarifas y Costos",
        "Application Fees": "Tarifas de Solicitud",
        "No fees charged for application analysis": "No se cobran tarifas por el análisis de la solicitud",
        "Lender Fees": "Tarifas del Prestamista",
        "May include origination fees, processing fees, and other charges": "Pueden incluir tarifas de originación, tarifas de procesamiento y otros cargos",
        "All fees will be clearly disclosed before contract signing": "Todas las tarifas se divulgarán claramente antes de la firma del contrato",
        
        "Intellectual Property": "Propiedad Intelectual",
        "All content on this website, including logos, text, images, and software, is the exclusive property of FLEXCREDI LLC and is protected by copyright laws.": "Todo el contenido de este sitio web, incluidos logotipos, texto, imágenes y software, es propiedad exclusiva de FLEXCREDI LLC y está protegido por las leyes de derechos de autor.",
        
        "Limitation of Liability": "Limitación de Responsabilidad",
        "FLEXCREDI LLC is not responsible for": "FLEXCREDI LLC no es responsable de:",
        "Lender decisions regarding credit approval or denial": "Decisiones del prestamista sobre aprobación o denegación de crédito",
        "Third-party service failures": "Fallas de servicios de terceros",
        "Indirect or consequential damages": "Daños indirectos o consecuentes",
        
        "Changes to Terms": "Cambios en los Términos",
        "We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.": "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los usuarios serán notificados de cambios significativos por correo electrónico.",
        
        "Governing Law": "Ley Aplicable",
        "These terms are governed by the laws of the State of Florida, United States.": "Estos términos se rigen por las leyes del Estado de Florida, Estados Unidos.",
        
        "Contact Information": "Información de Contacto",
        "For questions about these terms": "Para preguntas sobre estos términos:",
        "Email": "Correo Electrónico",
        "Phone": "Teléfono",
        "Address": "Dirección",
        
        "Back to Home": "Volver al Inicio",
        "All rights reserved": "Todos los derechos reservados",
        
        // ========================================
        // PRIVACY POLICY PAGE
        // ========================================
        "Privacy Policy": "Política de Privacidad",
        "Information We Collect": "Información que Recopilamos",
        "We collect the following information": "Recopilamos la siguiente información:",
        "Personal identification information": "Información de identificación personal",
        "Financial information": "Información financiera",
        "Employment information": "Información de empleo",
        "Contact information": "Información de contacto",
        
        "How We Use Your Information": "Cómo Usamos Su Información",
        "We use your information to": "Usamos su información para:",
        "Process your credit application": "Procesar su solicitud de crédito",
        "Verify your identity": "Verificar su identidad",
        "Comply with legal requirements": "Cumplir con requisitos legales",
        "Improve our services": "Mejorar nuestros servicios",
        
        "Information Security": "Seguridad de la Información",
        "We implement industry-standard security measures to protect your information, including:": "Implementamos medidas de seguridad estándar de la industria para proteger su información, incluyendo:",
        "SSL/TLS encryption": "Cifrado SSL/TLS",
        "Secure data storage": "Almacenamiento seguro de datos",
        "Access controls": "Controles de acceso",
        "Regular security audits": "Auditorías de seguridad regulares",
        
        "Third-Party Sharing": "Compartir con Terceros",
        "We may share your information with:": "Podemos compartir su información con:",
        "Partner lenders (to process your application)": "Prestamistas asociados (para procesar su solicitud)",
        "Credit bureaus (for credit checks)": "Burós de crédito (para verificaciones de crédito)",
        "Service providers (for operational purposes)": "Proveedores de servicios (con fines operativos)",
        "Legal authorities (when required by law)": "Autoridades legales (cuando sea requerido por ley)",
        
        "Your Rights": "Sus Derechos",
        "You have the right to": "Usted tiene derecho a:",
        "Access your personal information": "Acceder a su información personal",
        "Request corrections": "Solicitar correcciones",
        "Request deletion (subject to legal obligations)": "Solicitar eliminación (sujeto a obligaciones legales)",
        "Opt-out of marketing communications": "Optar por no recibir comunicaciones de marketing",
        
        "Cookies and Tracking": "Cookies y Seguimiento",
        "We use cookies to": "Usamos cookies para:",
        "Enhance user experience": "Mejorar la experiencia del usuario",
        "Analyze website traffic": "Analizar el tráfico del sitio web",
        "Remember your preferences": "Recordar sus preferencias",
        
        "Changes to Privacy Policy": "Cambios en la Política de Privacidad",
        "We may update this policy periodically. Users will be notified of significant changes.": "Podemos actualizar esta política periódicamente. Los usuarios serán notificados de cambios significativos.",
        
        "Contact Us": "Contáctenos",
        "For privacy-related questions": "Para preguntas relacionadas con la privacidad:",
        
        // Accept Buttons
        "Do you accept these terms?": "¿Acepta estos términos?",
        "By clicking 'Accept and Continue', you agree to our Terms of Use": "Al hacer clic en 'Aceptar y Continuar', acepta nuestros Términos de Uso",
        "Do you accept this privacy policy?": "¿Acepta esta política de privacidad?",
        "By clicking 'Accept and Continue', you agree to our Privacy Policy": "Al hacer clic en 'Aceptar y Continuar', acepta nuestra Política de Privacidad",
        "Accept and Continue": "Aceptar y Continuar",
        "Go Back": "Volver",
    },
    
    // ========================================
    // PORTUGUESE (pt)
    // ========================================
    pt: {
        // Navigation
        "About Us": "Sobre Nós",
        "Our Services": "Nossos Serviços",
        "Personal Credit": "Crédito Pessoal",
        "Business Credit": "Crédito Empresarial",
        "Debt Consolidation": "Consolidação de Dívidas",
        "Home Improvement": "Melhorias Residenciais",
        "How It Works": "Como Funciona",
        "FAQ": "Perguntas Frequentes",
        "Contact": "Contato",
        "Login": "Entrar",
        "Home": "Início",
        
        // Application Page - Header
        "Credit Application": "Solicitação de Crédito",
        "FLEXCREDI Credit Application": "Solicitação de Crédito FLEXCREDI",
        "Complete your application in a few simple and secure steps": "Complete sua solicitação em poucos passos simples e seguros",
        
        // Progress Bar
        "Personal Info": "Informações Pessoais",
        "Housing & Employment": "Moradia e Emprego",
        "Bank & Documents": "Banco e Documentos",
        "Review & Submit": "Revisar e Enviar",
        
        // ========================================
        // STEP 1: PERSONAL INFORMATION
        // ========================================
        "Personal Information": "Informações Pessoais",
        "Tell us about yourself": "Conte-nos sobre você",
        
        // Personal Info Fields
        "First Name": "Primeiro Nome",
        "Last Name": "Sobrenome",
        "Email": "E-mail",
        "Cell Phone": "Celular",
        "Home Phone (Optional)": "Telefone Residencial (Opcional)",
        "Date of Birth": "Data de Nascimento",
        "Birth Date (MM/DD/YYYY)": "Data de Nascimento (MM/DD/AAAA)",
        
        // SSN/ITIN Section
        "Social Security Number (SSN) or ITIN": "Número de Segurança Social (SSN) ou ITIN",
        "Social Security (___-__-____)": "Segurança Social (___-__-____)",
        "I don't have a SSN or ITIN": "Não tenho SSN ou ITIN",
        "Reason for not having SSN/ITIN": "Motivo para não ter SSN/ITIN",
        "Select reason": "Selecione o motivo",
        "Application pending": "Solicitação pendente",
        "Not eligible yet": "Ainda não elegível",
        "International applicant": "Solicitante internacional",
        "Other": "Outro",
        
        // Driver's License
        "Driver's License Number": "Número da Carteira de Motorista",
        "Driver's License State": "Estado da Carteira de Motorista",
        "Driver's License Issue Date": "Data de Emissão da Carteira",
        "Driver's License Expiry Date": "Data de Validade da Carteira",
        "Issue Date (MM/DD/YYYY)": "Data de Emissão (MM/DD/AAAA)",
        "Expiry Date (MM/DD/YYYY)": "Data de Validade (MM/DD/AAAA)",
        "State": "Estado",
        "Type to search...": "Digite para buscar...",
        "No states found": "Nenhum estado encontrado",
        
        // Residential Information
        "Residential Information": "Informações Residenciais",
        "Street Address": "Endereço",
        "City": "Cidade",
        "Zip Code": "CEP",
        "123 Main St, Apt 4B": "123 Rua Principal, Apto 4B",
        "00000": "00000",
        
        // ========================================
        // STEP 2: HOUSING & EMPLOYMENT
        // ========================================
        "Housing & Employment Information": "Informações de Moradia e Emprego",
        "Tell us about your housing and employment": "Conte-nos sobre sua moradia e emprego",
        
        // Housing Information
        "Housing Information": "Informações de Moradia",
        "Housing Type": "Tipo de Moradia",
        "Select Housing Type": "Selecione o Tipo de Moradia",
        "Own": "Própria",
        "Rent": "Alugada",
        "Living with Family": "Morando com Família",
        
        // Payment Information
        "Payment Frequency": "Frequência de Pagamento",
        "Select Frequency": "Selecione a Frequência",
        "Weekly": "Semanal",
        "Bi-Weekly (Every 2 Weeks)": "Quinzenal (A Cada 2 Semanas)",
        "Monthly": "Mensal",
        "Payment Amount": "Valor do Pagamento",
        "Payment Amount ($)": "Valor do Pagamento ($)",
        
        // Time at Address
        "Years at Address": "Anos no Endereço",
        "Years": "Anos",
        "Months at Address": "Meses no Endereço",
        "Months": "Meses",
        
        // Previous Address
        "Add Previous Address": "Adicionar Endereço Anterior",
        "Previous Address": "Endereço Anterior",
        "Previous Street Address": "Endereço Anterior",
        "Previous City": "Cidade Anterior",
        "Previous State": "Estado Anterior",
        "Previous Zip": "CEP Anterior",
        
        // Employment Information
        "Employment Information": "Informações de Emprego",
        "Employer Name": "Nome do Empregador",
        "Title/Position": "Título/Posição",
        "Employer Phone Number": "Telefone do Empregador",
        "Monthly Gross Income": "Renda Mensal Bruta",
        "Monthly Income ($)": "Renda Mensal ($)",
        "Years at Job": "Anos no Emprego",
        "Months at Job": "Meses no Emprego",
        
        // ========================================
        // STEP 3: BANK & DOCUMENTS
        // ========================================
        "Bank & Documents": "Banco e Documentos",
        "Bank Information for Disbursement": "Informações Bancárias para Desembolso",
        "Account Type": "Tipo de Conta",
        "Checking": "Corrente",
        "Savings": "Poupança",
        "Routing Number": "Número de Roteamento",
        "Account Number": "Número da Conta",
        "000000000": "000000000",
        
        // Document Upload
        "Document Upload": "Upload de Documentos",
        "Upload your documents": "Carregue seus documentos",
        "Accepted formats": "Formatos aceitos",
        "PDF, JPG, PNG (max 5 MB per file)": "PDF, JPG, PNG (máx 5 MB por arquivo)",
        "Driver's License or Passport": "Carteira de Motorista ou Passaporte",
        "(Front & Back, Required)": "(Frente e Verso, Obrigatório)",
        "Social Security Card or ITIN Letter": "Cartão de Segurança Social ou Carta ITIN",
        "(Required, unless you don't have one)": "(Obrigatório, a menos que você não tenha um)",
        "Bank Card or Void Check": "Cartão Bancário ou Cheque Anulado",
        "(Required)": "(Obrigatório)",
        "Drag and drop your files here or click to browse": "Arraste e solte seus arquivos aqui ou clique para procurar",
        "Choose File": "Escolher Arquivo",
        
        // ========================================
        // STEP 4: REVIEW & SUBMIT
        // ========================================
        "Review & Submit": "Revisar e Enviar",
        "Review your information before submitting": "Revise suas informações antes de enviar",
        
        // Review Sections
        "Edit": "Editar",
        "Name": "Nome",
        "Phone": "Telefone",
        "SSN": "SSN",
        "Driver License": "Carteira de Motorista",
        "Address": "Endereço",
        
        // Housing & Employment Review
        "Housing": "Moradia",
        "Type": "Tipo",
        "Payment": "Pagamento",
        "Time at Address": "Tempo no Endereço",
        "Employment": "Emprego",
        "Employer": "Empregador",
        "Position": "Posição",
        "Income": "Renda",
        "Time at Job": "Tempo no Emprego",
        
        // Bank & Documents Review
        "Bank Info & Documents": "Informações Bancárias e Documentos",
        "Bank Account": "Conta Bancária",
        "Routing": "Roteamento",
        "Account": "Conta",
        "Documents Uploaded": "Documentos Carregados",
        "Driver's License/Passport": "Carteira/Passaporte",
        "SSN Card/ITIN": "Cartão SSN/ITIN",
        "Bank Card/Check": "Cartão Bancário/Cheque",
        "files uploaded": "arquivos carregados",
        "file uploaded": "arquivo carregado",
        "Not uploaded": "Não carregado",
        
        // Terms & Conditions
        "Terms & Conditions": "Termos e Condições",
        "I certify that the information provided is true and accurate. I understand that providing false information may result in rejection of my application or legal consequences.": "Certifico que as informações fornecidas são verdadeiras e precisas. Entendo que fornecer informações falsas pode resultar na rejeição da minha solicitação ou consequências legais.",
        "I accept the": "Aceito os",
        "and": "e",
        
        // Buttons
        "Previous": "Anterior",
        "Next": "Próximo",
        "Submit Application": "Enviar Solicitação",
        "Submitting...": "Enviando...",
        
        // Validation Messages
        "This field is required": "Este campo é obrigatório",
        "Please enter a valid email": "Por favor, insira um e-mail válido",
        "Please enter a valid phone number": "Por favor, insira um número de telefone válido",
        "Please enter a valid SSN": "Por favor, insira um SSN válido",
        "You must be at least 18 years old": "Você deve ter pelo menos 18 anos",
        "Please select a reason": "Por favor, selecione um motivo",
        "You must accept the terms and conditions to submit": "Você deve aceitar os termos e condições para enviar",
        
        // ========================================
        // TERMS OF USE PAGE
        // ========================================
        "Terms of Use": "Termos de Uso",
        "Last updated": "Última atualização",
        "Acceptance of Terms": "Aceitação dos Termos",
        "Welcome to FLEXCREDI": "Bem-vindo ao FLEXCREDI",
        "By accessing and using this website, you accept and agree to comply with the terms and conditions described below.": "Ao acessar e usar este site, você aceita e concorda em cumprir os termos e condições descritos abaixo.",
        
        "Eligibility Requirements": "Requisitos de Elegibilidade",
        "To use our services, you must": "Para usar nossos serviços, você deve:",
        "Be at least 18 years old": "Ter pelo menos 18 anos",
        "Have valid legal documentation (SSN, ITIN, or equivalent)": "Ter documentação legal válida (SSN, ITIN ou equivalente)",
        "Provide accurate and truthful information": "Fornecer informações precisas e verdadeiras",
        "Have a verifiable source of income": "Ter uma fonte de renda verificável",
        
        "Application Process": "Processo de Solicitação",
        "Application Steps": "Etapas da Solicitação",
        "Complete the online application form": "Complete o formulário de solicitação online",
        "Upload required documents": "Carregue os documentos necessários",
        "Wait for our analysis (24-48 hours)": "Aguarde nossa análise (24-48 horas)",
        "Receive approval decision via email": "Receba decisão de aprovação por e-mail",
        "Sign contract electronically": "Assine o contrato eletronicamente",
        "Receive funds via bank transfer": "Receba os fundos via transferência bancária",
        
        "Information Accuracy": "Precisão das Informações",
        "All information provided must be accurate and up-to-date. Providing false information may result in:": "Todas as informações fornecidas devem ser precisas e atualizadas. Fornecer informações falsas pode resultar em:",
        "Immediate rejection of your application": "Rejeição imediata de sua solicitação",
        "Cancellation of approved credit": "Cancelamento do crédito aprovado",
        "Legal action and prosecution for fraud": "Ação legal e processo por fraude",
        "Permanent ban from our services": "Banimento permanente de nossos serviços",
        
        "Fees and Costs": "Taxas e Custos",
        "Application Fees": "Taxas de Solicitação",
        "No fees charged for application analysis": "Nenhuma taxa cobrada pela análise da solicitação",
        "Lender Fees": "Taxas do Credor",
        "May include origination fees, processing fees, and other charges": "Podem incluir taxas de originação, taxas de processamento e outras cobranças",
        "All fees will be clearly disclosed before contract signing": "Todas as taxas serão claramente divulgadas antes da assinatura do contrato",
        
        "Intellectual Property": "Propriedade Intelectual",
        "All content on this website, including logos, text, images, and software, is the exclusive property of FLEXCREDI LLC and is protected by copyright laws.": "Todo o conteúdo deste site, incluindo logotipos, texto, imagens e software, é propriedade exclusiva da FLEXCREDI LLC e é protegido pelas leis de direitos autorais.",
        
        "Limitation of Liability": "Limitação de Responsabilidade",
        "FLEXCREDI LLC is not responsible for": "A FLEXCREDI LLC não é responsável por:",
        "Lender decisions regarding credit approval or denial": "Decisões do credor sobre aprovação ou negação de crédito",
        "Third-party service failures": "Falhas de serviços de terceiros",
        "Indirect or consequential damages": "Danos indiretos ou consequentes",
        
        "Changes to Terms": "Alterações nos Termos",
        "We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.": "Reservamo-nos o direito de modificar estes termos a qualquer momento. Os usuários serão notificados de mudanças significativas por e-mail.",
        
        "Governing Law": "Lei Aplicável",
        "These terms are governed by the laws of the State of Florida, United States.": "Estes termos são regidos pelas leis do Estado da Flórida, Estados Unidos.",
        
        "Contact Information": "Informações de Contato",
        "For questions about these terms": "Para perguntas sobre estes termos:",
        "Email": "E-mail",
        "Phone": "Telefone",
        "Address": "Endereço",
        
        "Back to Home": "Voltar ao Início",
        "All rights reserved": "Todos os direitos reservados",
        
        // ========================================
        // PRIVACY POLICY PAGE
        // ========================================
        "Privacy Policy": "Política de Privacidade",
        "Information We Collect": "Informações que Coletamos",
        "We collect the following information": "Coletamos as seguintes informações:",
        "Personal identification information": "Informações de identificação pessoal",
        "Financial information": "Informações financeiras",
        "Employment information": "Informações de emprego",
        "Contact information": "Informações de contato",
        
        "How We Use Your Information": "Como Usamos Suas Informações",
        "We use your information to": "Usamos suas informações para:",
        "Process your credit application": "Processar sua solicitação de crédito",
        "Verify your identity": "Verificar sua identidade",
        "Comply with legal requirements": "Cumprir requisitos legais",
        "Improve our services": "Melhorar nossos serviços",
        
        "Information Security": "Segurança da Informação",
        "We implement industry-standard security measures to protect your information, including:": "Implementamos medidas de segurança padrão da indústria para proteger suas informações, incluindo:",
        "SSL/TLS encryption": "Criptografia SSL/TLS",
        "Secure data storage": "Armazenamento seguro de dados",
        "Access controls": "Controles de acesso",
        "Regular security audits": "Auditorias de segurança regulares",
        
        "Third-Party Sharing": "Compartilhamento com Terceiros",
        "We may share your information with:": "Podemos compartilhar suas informações com:",
        "Partner lenders (to process your application)": "Credores parceiros (para processar sua solicitação)",
        "Credit bureaus (for credit checks)": "Agências de crédito (para verificações de crédito)",
        "Service providers (for operational purposes)": "Provedores de serviços (para fins operacionais)",
        "Legal authorities (when required by law)": "Autoridades legais (quando exigido por lei)",
        
        "Your Rights": "Seus Direitos",
        "You have the right to": "Você tem o direito de:",
        "Access your personal information": "Acessar suas informações pessoais",
        "Request corrections": "Solicitar correções",
        "Request deletion (subject to legal obligations)": "Solicitar exclusão (sujeito a obrigações legais)",
        "Opt-out of marketing communications": "Optar por não receber comunicações de marketing",
        
        "Cookies and Tracking": "Cookies e Rastreamento",
        "We use cookies to": "Usamos cookies para:",
        "Enhance user experience": "Melhorar a experiência do usuário",
        "Analyze website traffic": "Analisar o tráfego do site",
        "Remember your preferences": "Lembrar suas preferências",
        
        "Changes to Privacy Policy": "Alterações na Política de Privacidade",
        "We may update this policy periodically. Users will be notified of significant changes.": "Podemos atualizar esta política periodicamente. Os usuários serão notificados de mudanças significativas.",
        
        "Contact Us": "Fale Conosco",
        "For privacy-related questions": "Para perguntas relacionadas à privacidade:",
        
        // Accept Buttons
        "Do you accept these terms?": "Você aceita estes termos?",
        "By clicking 'Accept and Continue', you agree to our Terms of Use": "Ao clicar em 'Aceitar e Continuar', você concorda com nossos Termos de Uso",
        "Do you accept this privacy policy?": "Você aceita esta política de privacidade?",
        "By clicking 'Accept and Continue', you agree to our Privacy Policy": "Ao clicar em 'Aceitar e Continuar', você concorda com nossa Política de Privacidade",
        "Accept and Continue": "Aceitar e Continuar",
        "Go Back": "Voltar",
    }
};

/**
 * TranslationEngine - Manages multilingual translations across the website
 */
class TranslationEngine {
    constructor() {
        this.currentLang = this.getSavedLanguage() || 'en';
        this.init();
    }
    
    /**
     * Initialize the translation engine
     */
    init() {
        console.log('🌐 TranslationEngine initialized with language:', this.currentLang);
        this.attachLanguageButtons();
        this.translatePage();
    }
    
    /**
     * Get saved language from localStorage
     */
    getSavedLanguage() {
        return localStorage.getItem('flexcredi_language') || 'en';
    }
    
    /**
     * Save language preference
     */
    saveLanguage(lang) {
        localStorage.setItem('flexcredi_language', lang);
        console.log('💾 Language saved:', lang);
    }
    
    /**
     * Attach click handlers to language buttons
     */
    attachLanguageButtons() {
        const langButtons = document.querySelectorAll('.language-btn');
        langButtons.forEach(btn => {
            // Set active state based on current language
            if (btn.getAttribute('data-lang') === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            // Attach click handler
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.getAttribute('data-lang');
                this.setLanguage(newLang);
            });
        });
    }
    
    /**
     * Change the current language
     */
    setLanguage(lang) {
        if (!translations[lang]) {
            console.error('❌ Language not supported:', lang);
            return;
        }
        
        console.log('🔄 Changing language to:', lang);
        this.currentLang = lang;
        this.saveLanguage(lang);
        
        // Update active button state
        document.querySelectorAll('.language-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Translate the page
        this.translatePage();
    }
    
    /**
     * Translate a single key
     */
    translate(key) {
        const translation = translations[this.currentLang][key];
        if (!translation) {
            console.warn('⚠️ Translation not found for key:', key, 'in language:', this.currentLang);
            return key; // Return original key if translation not found
        }
        return translation;
    }
    
    /**
     * Translate all elements on the page
     */
    translatePage() {
        console.log('🌍 Translating page to:', this.currentLang);
        
        // Translate all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translate(key);
            
            // Update text content or placeholder
            if (el.tagName === 'INPUT' && el.type !== 'button' && el.type !== 'submit') {
                if (el.placeholder) {
                    el.placeholder = translation;
                }
            } else if (el.tagName === 'OPTION') {
                el.textContent = translation;
            } else {
                el.textContent = translation;
            }
        });
        
        // Update document language attribute
        document.documentElement.setAttribute('lang', this.currentLang);
        
        console.log('✅ Page translation complete');
    }
}

// Initialize translation engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.translationEngine = new TranslationEngine();
});

/**
 * FLEXCREDI LLC - Contract Variables Mapper (US Market)
 * 
 * This module maps application data to contract template variables.
 * Total of 42 mapped variables for US loan agreements (Florida-based).
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Converts number to words in English (US format)
 * @param {number} amount - Numeric value
 * @returns {string} - Amount in words
 */
function numberToWords(amount) {
  // Simplified implementation - can use library 'number-to-words' for production
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const thousands = ['', 'Thousand', 'Million'];
  
  if (amount === 0) return 'Zero Dollars';
  
  let num = Math.floor(amount);
  let result = '';
  let thousandCounter = 0;
  
  while (num > 0) {
    let chunk = num % 1000;
    if (chunk !== 0) {
      let chunkStr = '';
      
      // Hundreds
      if (chunk >= 100) {
        chunkStr += ones[Math.floor(chunk / 100)] + ' Hundred ';
        chunk %= 100;
      }
      
      // Tens and ones
      if (chunk >= 20) {
        chunkStr += tens[Math.floor(chunk / 10)] + ' ';
        chunkStr += ones[chunk % 10];
      } else if (chunk >= 10) {
        chunkStr += teens[chunk - 10];
      } else {
        chunkStr += ones[chunk];
      }
      
      result = chunkStr.trim() + ' ' + thousands[thousandCounter] + ' ' + result;
    }
    
    num = Math.floor(num / 1000);
    thousandCounter++;
  }
  
  return result.trim() + ' Dollars';
}

/**
 * Formats number as US currency (with commas)
 * @param {number} amount - Value
 * @returns {string} - Formatted value
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Gets month name
 * @param {number} month - Month (1-12)
 * @returns {string} - Month name
 */
function getMonthName(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1];
}

/**
 * Maps application data to contract variables (US loan agreement)
 * @param {string} applicationId - Application ID
 * @param {Date} effectiveDate - Contract effective date
 * @returns {Object} - Object with all template variables
 */
async function mapApplicationToContract(applicationId, effectiveDate = new Date()) {
  // Fetch complete application with relations
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      user: true,
      partner: true,
      creditReport: true
    }
  });
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  if (application.status !== 'APPROVED') {
    throw new Error('Application must be approved before generating contract');
  }
  
  const user = application.user;
  const partner = application.partner;
  
  // Calculate dates
  const effectiveDateObj = new Date(effectiveDate);
  const firstPaymentDate = new Date(effectiveDate);
  firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
  
  // Calculate amounts
  const principalAmount = application.approvedAmount;
  const interestRate = application.interestRate;
  const termMonths = application.termMonths;
  const monthlyPayment = application.monthlyPayment;
  const totalRepayment = monthlyPayment * termMonths;
  
  // System default settings
  const settings = await prisma.systemSetting.findMany();
  const settingsMap = {};
  settings.forEach(s => { settingsMap[s.key] = s.value; });
  
  const gracePeriodDays = settingsMap['grace_period_days'] || '5';
  const lateFeePercentage = settingsMap['late_fee_percentage'] || '5';
  const defaultInterestRate = settingsMap['default_interest_rate'] || '24';
  const achRevocationDays = settingsMap['ach_revocation_notice_days'] || '15';
  
  // Build object with ALL template variables (US format)
  const contractVariables = {
    // ==================== DATE VARIABLES (3) ====================
    DAY: effectiveDateObj.getDate().toString(),
    MONTH: getMonthName(effectiveDateObj.getMonth() + 1),
    YEAR: effectiveDateObj.getFullYear().toString(),
    
    // ==================== BORROWER INFORMATION (11) - US FORMAT ====================
    BORROWER_FULL_NAME: application.clientName || user.name,
    BORROWER_NATIONALITY: user.nationality || 'US Citizen',
    BORROWER_MARITAL_STATUS: user.maritalStatus || 'Single',
    BORROWER_OCCUPATION: application.occupation || user.occupation || 'Not specified',
    BORROWER_ID_TYPE: 'Driver\'s License', // Can be configurable (State ID, Passport)
    BORROWER_ID_NUMBER: user.driverLicenseNumber || user.stateIdNumber || 'Not provided',
    BORROWER_SSN_TIN: application.clientSsn || user.ssn || 'XXX-XX-XXXX', // SSN instead of CPF
    BORROWER_ADDRESS_LINE: application.clientAddress || user.address || '',
    BORROWER_CITY_STATE_ZIP: `${application.clientCity || user.city || ''}, ${application.clientState || user.state || 'FL'} ${application.clientZipCode || user.zipCode || ''}`.trim(),
    BORROWER_PHONE: application.clientPhone || user.phone || '',
    BORROWER_EMAIL: application.clientEmail || user.email || '',
    
    // ==================== LOAN TERMS (9) ====================
    LOAN_AMOUNT_WORDS: numberToWords(principalAmount),
    LOAN_AMOUNT_NUMBERS: formatCurrency(principalAmount),
    INTEREST_RATE_PERCENTAGE: (interestRate * 100).toFixed(2),
    LOAN_TERM_MONTHS: termMonths.toString(),
    TOTAL_REPAYMENT_AMOUNT_WORDS: numberToWords(totalRepayment),
    TOTAL_REPAYMENT_AMOUNT_NUMBERS: formatCurrency(totalRepayment),
    NUMBER_OF_INSTALLMENTS: termMonths.toString(),
    INSTALLMENT_AMOUNT_WORDS: numberToWords(monthlyPayment),
    INSTALLMENT_AMOUNT_NUMBERS: formatCurrency(monthlyPayment),
    
    // ==================== PAYMENT SCHEDULE (3) ====================
    DAY_OF_MONTH: firstPaymentDate.getDate().toString(),
    FIRST_PAYMENT_MONTH: getMonthName(firstPaymentDate.getMonth() + 1),
    FIRST_PAYMENT_YEAR: firstPaymentDate.getFullYear().toString(),
    
    // ==================== DISBURSEMENT ACCOUNT (4) ====================
    DISBURSEMENT_METHOD: 'ACH Direct Deposit',
    DISBURSEMENT_BANK_NAME: user.bankName || 'Not provided',
    DISBURSEMENT_ROUTING_NUMBER: user.bankRoutingNumber || 'Not provided',
    DISBURSEMENT_ACCOUNT_LAST4: user.bankAccount ? user.bankAccount.slice(-4) : 'XXXX',
    
    // ==================== ACH PAYMENT INFORMATION (9) ====================
    ACH_BANK_NAME: user.bankName || 'Not provided',
    ACH_ROUTING_NUMBER: user.bankRoutingNumber || 'Not provided',
    ACH_ACCOUNT_HOLDER_NAME: application.clientName || user.name,
    ACH_ACCOUNT_NUMBER: user.bankAccount || 'Not provided',
    ACH_DIFFERENT_ACCOUNT_HOLDER_NAME: '', // Leave blank if same account holder
    ACH_RELATIONSHIP_TO_BORROWER: '', // Leave blank if same account holder
    ACH_REVOCATION_NOTICE_DAYS: achRevocationDays,
    ACH_TRANSACTION_REFERENCE: `ACH-${application.id.slice(0, 8).toUpperCase()}`,
    ACH_ACCOUNT_VERIFIED_BY: 'System Automated Verification',
    ACH_DATE_VERIFIED: effectiveDateObj.toLocaleDateString('en-US'),
    
    // ==================== FEES & PENALTIES (4) ====================
    PAYMENT_METHOD: 'ACH Direct Debit',
    GRACE_PERIOD_DAYS: gracePeriodDays,
    LATE_FEE_PERCENTAGE: lateFeePercentage,
    DEFAULT_INTEREST_RATE_PERCENTAGE: defaultInterestRate,
  };
  
  return contractVariables;
}

/**
 * Validates if all required variables are filled
 * @param {Object} variables - Variables object
 * @returns {Object} - { valid: boolean, missing: string[] }
 */
function validateContractVariables(variables) {
  const requiredFields = [
    'BORROWER_FULL_NAME',
    'BORROWER_EMAIL',
    'BORROWER_PHONE',
    'LOAN_AMOUNT_NUMBERS',
    'INTEREST_RATE_PERCENTAGE',
    'LOAN_TERM_MONTHS',
    'INSTALLMENT_AMOUNT_NUMBERS'
  ];
  
  const missing = [];
  
  for (const field of requiredFields) {
    if (!variables[field] || variables[field] === '' || variables[field] === 'Not provided') {
      missing.push(field);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}

module.exports = {
  mapApplicationToContract,
  validateContractVariables,
  numberToWords,
  formatCurrency,
  getMonthName
};

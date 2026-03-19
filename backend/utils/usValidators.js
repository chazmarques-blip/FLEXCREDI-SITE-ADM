/**
 * FLEXCREDI LLC - US Market Validators
 * Validation functions for US-specific data formats (SSN, EIN, ZIP, State, Phone)
 */

/**
 * Validate SSN (Social Security Number)
 * Format: XXX-XX-XXXX or XXXXXXXXX
 * @param {string} ssn - Social Security Number
 * @returns {boolean} - True if valid
 */
function validateSSN(ssn) {
  if (!ssn) return false;
  const ssnRegex = /^(?:\d{3}-\d{2}-\d{4}|\d{9})$/;
  return ssnRegex.test(ssn);
}

/**
 * Validate EIN (Employer Identification Number)
 * Format: XX-XXXXXXX
 * @param {string} ein - Employer Identification Number
 * @returns {boolean} - True if valid
 */
function validateEIN(ein) {
  if (!ein) return false;
  const einRegex = /^\d{2}-\d{7}$/;
  return einRegex.test(ein);
}

/**
 * Validate US ZIP code
 * Format: 12345 or 12345-6789
 * @param {string} zip - ZIP code
 * @returns {boolean} - True if valid
 */
function validateZipCode(zip) {
  if (!zip) return false;
  const zipRegex = /^\d{5}(?:-\d{4})?$/;
  return zipRegex.test(zip);
}

/**
 * Validate US state code (2 letters)
 * @param {string} state - State code (e.g., FL, CA, NY)
 * @returns {boolean} - True if valid
 */
function validateState(state) {
  if (!state) return false;
  
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', 'PR', 'VI', 'GU', 'AS', 'MP'  // Territories
  ];
  
  return validStates.includes(state.toUpperCase());
}

/**
 * Validate US phone number
 * Format: (XXX) XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
 * @param {string} phone - Phone number
 * @returns {boolean} - True if valid
 */
function validatePhone(phone) {
  if (!phone) return false;
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Must be exactly 10 digits
  return cleaned.length === 10;
}

/**
 * Format SSN for display (XXX-XX-XXXX)
 * @param {string} ssn - Social Security Number
 * @returns {string} - Formatted SSN
 */
function formatSSN(ssn) {
  if (!ssn) return '';
  
  const cleaned = ssn.replace(/\D/g, '');
  
  if (cleaned.length !== 9) {
    return ssn; // Return original if invalid length
  }
  
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
}

/**
 * Format EIN for display (XX-XXXXXXX)
 * @param {string} ein - Employer Identification Number
 * @returns {string} - Formatted EIN
 */
function formatEIN(ein) {
  if (!ein) return '';
  
  const cleaned = ein.replace(/\D/g, '');
  
  if (cleaned.length !== 9) {
    return ein; // Return original if invalid length
  }
  
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 9)}`;
}

/**
 * Format phone number for display ((XXX) XXX-XXXX)
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone
 */
function formatPhone(phone) {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 10) {
    return phone; // Return original if invalid length
  }
  
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

/**
 * Format ZIP code for display (XXXXX or XXXXX-XXXX)
 * @param {string} zip - ZIP code
 * @returns {string} - Formatted ZIP
 */
function formatZipCode(zip) {
  if (!zip) return '';
  
  const cleaned = zip.replace(/\D/g, '');
  
  if (cleaned.length === 5) {
    return cleaned;
  } else if (cleaned.length === 9) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
  }
  
  return zip; // Return original if invalid length
}

/**
 * Mask SSN for security (XXX-XX-1234)
 * @param {string} ssn - Social Security Number
 * @returns {string} - Masked SSN
 */
function maskSSN(ssn) {
  if (!ssn) return '';
  
  const formatted = formatSSN(ssn);
  
  if (formatted.length !== 11) {
    return 'XXX-XX-XXXX';
  }
  
  return `XXX-XX-${formatted.slice(-4)}`;
}

/**
 * Mask EIN for security (XX-XXXX789)
 * @param {string} ein - Employer Identification Number
 * @returns {string} - Masked EIN
 */
function maskEIN(ein) {
  if (!ein) return '';
  
  const formatted = formatEIN(ein);
  
  if (formatted.length !== 10) {
    return 'XX-XXXXXXX';
  }
  
  return `XX-XXXX${formatted.slice(-3)}`;
}

/**
 * Get state name from code
 * @param {string} code - State code (e.g., FL)
 * @returns {string} - State name (e.g., Florida)
 */
function getStateName(code) {
  const stateNames = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
    'PR': 'Puerto Rico', 'VI': 'Virgin Islands', 'GU': 'Guam',
    'AS': 'American Samoa', 'MP': 'Northern Mariana Islands'
  };
  
  return stateNames[code.toUpperCase()] || code;
}

/**
 * Validate driver's license format (varies by state - basic validation)
 * @param {string} license - Driver's license number
 * @param {string} state - State code
 * @returns {boolean} - True if format appears valid
 */
function validateDriverLicense(license, state) {
  if (!license || !state) return false;
  
  // Basic validation - actual formats vary widely by state
  // Production implementation should use state-specific regex patterns
  
  const cleaned = license.replace(/[\s-]/g, '').toUpperCase();
  
  // Florida: 1 letter + 12 digits
  if (state === 'FL' && /^[A-Z]\d{12}$/.test(cleaned)) {
    return true;
  }
  
  // California: 1 letter + 7 digits
  if (state === 'CA' && /^[A-Z]\d{7}$/.test(cleaned)) {
    return true;
  }
  
  // New York: 9 digits or 1 letter + 7 digits + 1 digit
  if (state === 'NY' && (/^\d{9}$/.test(cleaned) || /^[A-Z]\d{7}$/.test(cleaned))) {
    return true;
  }
  
  // Generic validation for other states (6-20 alphanumeric characters)
  return cleaned.length >= 6 && cleaned.length <= 20 && /^[A-Z0-9]+$/.test(cleaned);
}

/**
 * Validate FICO credit score range
 * @param {number} score - Credit score
 * @returns {boolean} - True if within valid FICO range (300-850)
 */
function validateCreditScore(score) {
  return typeof score === 'number' && score >= 300 && score <= 850;
}

/**
 * Get credit score rating
 * @param {number} score - FICO credit score
 * @returns {string} - Rating (Excellent, Very Good, Good, Fair, Poor)
 */
function getCreditScoreRating(score) {
  if (!validateCreditScore(score)) return 'Invalid';
  
  if (score >= 800) return 'Excellent';
  if (score >= 740) return 'Very Good';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

/**
 * Validate APR (Annual Percentage Rate) is within legal limits
 * @param {number} apr - APR as decimal (e.g., 0.1899 for 18.99%)
 * @param {string} state - State code (for state-specific limits)
 * @returns {Object} - { valid: boolean, max: number, message: string }
 */
function validateAPR(apr, state = 'FL') {
  // Florida usury limits (simplified - actual law is more complex)
  const stateLimits = {
    'FL': 0.18,    // 18% for loans under $500k (simplified)
    'CA': 0.10,    // 10% unless licensed lender
    'NY': 0.16,    // 16% for most loans
    'TX': 0.10,    // 10% unless agreed upon
    'default': 0.25 // 25% general cap
  };
  
  const maxAPR = stateLimits[state] || stateLimits['default'];
  const valid = apr <= maxAPR;
  
  return {
    valid,
    max: maxAPR,
    message: valid 
      ? 'APR within legal limits' 
      : `APR exceeds ${(maxAPR * 100).toFixed(2)}% limit for ${state}`
  };
}

module.exports = {
  // Validation functions
  validateSSN,
  validateEIN,
  validateZipCode,
  validateState,
  validatePhone,
  validateDriverLicense,
  validateCreditScore,
  validateAPR,
  
  // Formatting functions
  formatSSN,
  formatEIN,
  formatPhone,
  formatZipCode,
  
  // Masking functions (security)
  maskSSN,
  maskEIN,
  
  // Utility functions
  getStateName,
  getCreditScoreRating
};

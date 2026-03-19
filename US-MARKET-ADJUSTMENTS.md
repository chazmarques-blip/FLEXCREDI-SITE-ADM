# 🇺🇸 FLEXCREDI - US MARKET ADJUSTMENTS
## Florida-Based Company - Complete Localization Guide

**Date**: February 21, 2026  
**Company**: FlexCredi LLC (Florida, USA)  
**Status**: ✅ IN PROGRESS

---

## 📋 OVERVIEW

FlexCredi is a **Florida-based financial technology company** specializing in personal loans and credit solutions for the US market. All systems, documents, and processes must comply with US regulations and standards.

---

## 🔄 REQUIRED CHANGES

### **1. Database Schema (Prisma)** ⚠️ HIGH PRIORITY

#### **User Model - Brazilian → US Fields**
```prisma
model User {
  // ❌ REMOVE Brazilian fields:
  // cpf String?
  // rg String?
  
  // ✅ ADD US fields:
  ssn String? @unique           // Social Security Number (XXX-XX-XXXX)
  ein String? @unique           // Employer Identification Number (for businesses)
  driverLicenseNumber String?   // State driver's license
  driverLicenseState String?    // State code (FL, CA, NY, etc.)
  stateIdNumber String?         // Alternative to driver's license
  passport String?              // US or international passport
  
  // Address fields (already OK, but ensure format):
  address String?               // Street address
  city String?                  // City
  state String?                 // State code (FL, CA, NY, etc.) - 2 letters
  zipCode String?               // ZIP code (12345 or 12345-6789)
  county String?                // County (optional, for Florida: Miami-Dade, Broward, etc.)
}
```

#### **Partner Model - Brazilian → US Fields**
```prisma
model Partner {
  // ❌ REMOVE:
  // cnpj String @unique
  // inscricaoEstadual String?
  // inscricaoMunicipal String?
  
  // ✅ ADD:
  ein String @unique            // Employer Identification Number (XX-XXXXXXX)
  businessTaxId String?         // State/local tax ID
  dunsNumber String?            // D&B DUNS number (optional)
  
  // Address (already OK):
  state String                  // Must be 2-letter code (FL, CA, etc.)
  zipCode String                // ZIP format
}
```

#### **Application Model - Brazilian → US Fields**
```prisma
model Application {
  // ❌ REMOVE:
  // clientCpf String
  
  // ✅ ADD:
  clientSsn String              // Social Security Number
  
  // Address fields (already OK):
  clientCity String?
  clientState String?           // 2-letter code
  clientZipCode String?         // US ZIP format
}
```

#### **Document Model - Document Types**
```prisma
enum DocumentType {
  // ✅ US Document Types:
  ID                    // Driver's License, State ID, Passport
  SSN_CARD              // Social Security Card
  PROOF_INCOME          // W2, 1099, Pay Stubs, Tax Returns
  BANK_STATEMENT        // Bank statements (last 3 months)
  PROOF_RESIDENCE       // Utility bill, lease agreement
  EMPLOYMENT_LETTER     // Employer verification letter
  TAX_RETURN            // IRS Form 1040, 1099, etc.
  W2_FORM               // W-2 Wage and Tax Statement
  FORM_1099             // 1099 forms (various types)
  CREDIT_REPORT         // Credit report from bureaus
  OTHER
}
```

---

### **2. Contract Template** ✅ PRIORITY

#### **Header Section**
```
PERSONAL LOAN AGREEMENT

This Personal Loan Agreement ("Agreement") is entered into on [DAY] day of 
[MONTH], [YEAR], by and between:

LENDER:
FlexCredi LLC
Address: [FLORIDA_ADDRESS]
City: [CITY], State: Florida, ZIP Code: [ZIP]
EIN: [COMPANY_EIN]
Phone: [COMPANY_PHONE]
Email: [COMPANY_EMAIL]

AND

BORROWER:
Full Name: [BORROWER_FULL_NAME]
Address: [BORROWER_ADDRESS_LINE]
City, State, ZIP: [BORROWER_CITY_STATE_ZIP]
Social Security Number: [BORROWER_SSN_TIN]
Phone: [BORROWER_PHONE]
Email: [BORROWER_EMAIL]
```

#### **Governing Law Section**
```
ARTICLE 12 - GOVERNING LAW

12.1 This Agreement shall be governed by and construed in accordance with 
     the laws of the State of Florida, United States of America, without 
     regard to its conflict of law provisions.

12.2 Any disputes arising under this Agreement shall be subject to the 
     exclusive jurisdiction of the courts located in [COUNTY_NAME] County, 
     Florida.

12.3 The Borrower consents to personal jurisdiction in the State of Florida.
```

#### **Compliance Section (Add)**
```
ARTICLE 13 - REGULATORY COMPLIANCE

13.1 This loan is subject to the Truth in Lending Act (TILA) and Regulation Z.

13.2 Annual Percentage Rate (APR): [APR_PERCENTAGE]%

13.3 Finance Charge: $[FINANCE_CHARGE_AMOUNT]

13.4 Amount Financed: $[LOAN_AMOUNT_NUMBERS]

13.5 Total of Payments: $[TOTAL_REPAYMENT_AMOUNT_NUMBERS]

13.6 Payment Schedule: [NUMBER_OF_INSTALLMENTS] monthly payments of 
     $[INSTALLMENT_AMOUNT_NUMBERS]

13.7 Borrower has the right to rescind this transaction within three (3) 
     business days from the date of execution, as provided by federal law.
```

#### **State-Specific Disclosures (Florida)**
```
FLORIDA-SPECIFIC DISCLOSURES:

1. Interest Rate Disclosure: The interest rate on this loan is 
   [INTEREST_RATE_PERCENTAGE]% per annum.

2. Usury Limits: This loan complies with Florida Statutes Chapter 687, 
   governing interest rates and usury.

3. Prepayment: Borrower may prepay this loan in full or in part at any time 
   without penalty, as required by Florida law.

4. Late Fee Limit: Late fees shall not exceed [LATE_FEE_PERCENTAGE]% of the 
   installment amount or $[MAX_LATE_FEE] dollars, whichever is less, in 
   accordance with Florida Statutes § 687.03.

5. Collection Practices: Lender will comply with the Florida Consumer 
   Collection Practices Act (FCCPA), Florida Statutes Chapter 559.
```

---

### **3. API Controllers & Services** 🔧

#### **Update All Error Messages to English**

**Before (Portuguese)**:
```javascript
throw new Error('Aplicação não encontrada');
throw new Error('Parceiro deve estar aprovado');
```

**After (English)**:
```javascript
throw new Error('Application not found');
throw new Error('Partner must be approved');
```

#### **ApplicationsController.js**
```javascript
// Line ~45: Validation
if (!clientSsn || clientSsn.length !== 11) {
  return res.status(400).json({
    success: false,
    error: 'Valid Social Security Number (SSN) is required'
  });
}

// Validate SSN format (XXX-XX-XXXX or XXXXXXXXX)
const ssnRegex = /^(?:\d{3}-\d{2}-\d{4}|\d{9})$/;
if (!ssnRegex.test(clientSsn)) {
  return res.status(400).json({
    success: false,
    error: 'SSN must be in format XXX-XX-XXXX or 9 digits'
  });
}
```

#### **PartnersController.js**
```javascript
// Line ~60: EIN validation
if (!ein || !ein.match(/^\d{2}-\d{7}$/)) {
  return res.status(400).json({
    success: false,
    error: 'Valid EIN (Employer Identification Number) is required (format: XX-XXXXXXX)'
  });
}

// State validation (must be 2-letter US state code)
const validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', /* ... */];
if (!validStates.includes(state)) {
  return res.status(400).json({
    success: false,
    error: 'Invalid US state code (must be 2-letter abbreviation)'
  });
}
```

---

### **4. Agent Credit Analyzer** 🤖

#### **Update Credit Score Range (US Standard)**
```javascript
// Line ~80: US Credit Score (FICO)
const minScore = 300;  // Minimum FICO score
const maxScore = 850;  // Maximum FICO score

// Risk tiers based on FICO:
const riskTiers = {
  excellent: { min: 800, max: 850, rate: 0.0599 },  // 5.99%
  veryGood:  { min: 740, max: 799, rate: 0.0899 },  // 8.99%
  good:      { min: 670, max: 739, rate: 0.1299 },  // 12.99%
  fair:      { min: 580, max: 669, rate: 0.1799 },  // 17.99%
  poor:      { min: 300, max: 579, rate: 0.2499 }   // 24.99%
};
```

#### **DTI Calculation (US Standard)**
```javascript
// Line ~120: Debt-to-Income Ratio
const dtiRatio = (totalMonthlyDebt / monthlyIncome) * 100;

// US lending standards:
if (dtiRatio > 43) {
  return {
    approved: false,
    reason: 'DTI ratio exceeds 43% (federal qualified mortgage limit)'
  };
} else if (dtiRatio > 36) {
  recommendation = 'Approve with caution - DTI near limit';
} else if (dtiRatio <= 28) {
  recommendation = 'Excellent DTI ratio - low risk';
}
```

#### **Income Verification Standards**
```javascript
// Annual income requirements (US market)
const minimumAnnualIncome = {
  'FL': 25000,  // Florida minimum
  'CA': 35000,  // California higher cost of living
  'NY': 35000,  // New York higher cost of living
  'TX': 25000,  // Texas
  'default': 24000  // Federal poverty line consideration
};
```

---

### **5. Frontend Labels & Text** 🖼️

#### **Dashboard Admin (admin-dashboard-v2.html)**

**Line 120-150: Update metric labels**
```html
<!-- Before (Portuguese) -->
<div class="metric-label">Aplicações Totais</div>
<div class="metric-label">Parceiros Ativos</div>

<!-- After (English) -->
<div class="metric-label">Total Applications</div>
<div class="metric-label">Active Partners</div>
```

#### **Status Labels**
```javascript
// In admin-dashboard.js
const statusLabels = {
  'PENDING': 'Pending Review',
  'APPROVED': 'Approved',
  'REJECTED': 'Rejected',
  'ACTIVE': 'Active',
  'COMPLETED': 'Completed'
};

// Date formatting (US: MM/DD/YYYY)
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

// Currency formatting (US: $X,XXX.XX)
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}
```

---

### **6. System Settings** ⚙️

#### **Default Configuration (US Market)**
```javascript
// In prisma/seed.js

// Interest rate limits (Florida Statutes Chapter 687)
{ key: 'max_interest_rate', value: '24.99', category: 'general' },  // Max APR
{ key: 'min_interest_rate', value: '5.99', category: 'general' },

// Loan amount limits
{ key: 'min_loan_amount', value: '1000', category: 'general' },
{ key: 'max_loan_amount', value: '50000', category: 'general' },

// Term limits (months)
{ key: 'min_loan_term', value: '6', category: 'general' },
{ key: 'max_loan_term', value: '60', category: 'general' },

// Fees (Florida compliant)
{ key: 'origination_fee_percentage', value: '2.5', category: 'fees' },  // Max 5% typical
{ key: 'late_fee_percentage', value: '5', category: 'fees' },           // FL Statute §687.03
{ key: 'returned_ach_fee', value: '25', category: 'fees' },             // Reasonable fee
{ key: 'grace_period_days', value: '5', category: 'fees' },

// ACH settings
{ key: 'ach_revocation_notice_days', value: '15', category: 'ach' },
{ key: 'ach_retry_attempts', value: '2', category: 'ach' },
{ key: 'ach_retry_interval_days', value: '3', category: 'ach' },

// Company information (Florida)
{ key: 'company_name', value: 'FlexCredi LLC', category: 'company' },
{ key: 'company_address', value: '[STREET ADDRESS]', category: 'company' },
{ key: 'company_city', value: '[CITY]', category: 'company' },
{ key: 'company_state', value: 'FL', category: 'company' },
{ key: 'company_zip', value: '[ZIP CODE]', category: 'company' },
{ key: 'company_phone', value: '[PHONE]', category: 'company' },
{ key: 'company_email', value: 'support@flexcredi.com', category: 'company' },
{ key: 'company_ein', value: '[XX-XXXXXXX]', category: 'company' },
```

---

### **7. Email Templates** 📧

#### **Update All Email Content to English**

**Example: Welcome Email**
```html
<h1>Welcome to FlexCredi!</h1>
<p>Dear [CUSTOMER_NAME],</p>
<p>Thank you for choosing FlexCredi for your personal loan needs.</p>

<h2>Your Application Details:</h2>
<ul>
  <li><strong>Loan Amount:</strong> $[LOAN_AMOUNT]</li>
  <li><strong>Interest Rate:</strong> [INTEREST_RATE]% APR</li>
  <li><strong>Monthly Payment:</strong> $[MONTHLY_PAYMENT]</li>
  <li><strong>Term:</strong> [TERM_MONTHS] months</li>
</ul>

<p>Your application is currently under review. You will receive a decision 
   within 24-48 business hours.</p>

<p>If you have any questions, please contact us at:</p>
<ul>
  <li>Phone: [COMPANY_PHONE]</li>
  <li>Email: support@flexcredi.com</li>
</ul>

<p>Best regards,<br>
The FlexCredi Team<br>
Florida, USA</p>
```

---

### **8. Validation Functions** ✔️

#### **Create US-Specific Validators**
```javascript
// utils/validators.js

/**
 * Validate SSN (Social Security Number)
 * Format: XXX-XX-XXXX or XXXXXXXXX
 */
function validateSSN(ssn) {
  const ssnRegex = /^(?:\d{3}-\d{2}-\d{4}|\d{9})$/;
  return ssnRegex.test(ssn);
}

/**
 * Validate EIN (Employer Identification Number)
 * Format: XX-XXXXXXX
 */
function validateEIN(ein) {
  const einRegex = /^\d{2}-\d{7}$/;
  return einRegex.test(ein);
}

/**
 * Validate US ZIP code
 * Format: 12345 or 12345-6789
 */
function validateZipCode(zip) {
  const zipRegex = /^\d{5}(?:-\d{4})?$/;
  return zipRegex.test(zip);
}

/**
 * Validate US state code (2 letters)
 */
function validateState(state) {
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
 */
function validatePhone(phone) {
  const phoneRegex = /^(?:\(\d{3}\)\s?|\d{3}-)?\d{3}-?\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Format SSN for display (XXX-XX-XXXX)
 */
function formatSSN(ssn) {
  const cleaned = ssn.replace(/\D/g, '');
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
}

/**
 * Format EIN for display (XX-XXXXXXX)
 */
function formatEIN(ein) {
  const cleaned = ein.replace(/\D/g, '');
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 9)}`;
}

/**
 * Mask SSN for security (XXX-XX-1234)
 */
function maskSSN(ssn) {
  const formatted = formatSSN(ssn);
  return `XXX-XX-${formatted.slice(-4)}`;
}

module.exports = {
  validateSSN,
  validateEIN,
  validateZipCode,
  validateState,
  validatePhone,
  formatSSN,
  formatEIN,
  maskSSN
};
```

---

## ✅ CHECKLIST

### **High Priority** 🔴
- [ ] Update Prisma schema (User, Partner, Application models)
- [ ] Run database migration (`npx prisma migrate dev --name us_market_fields`)
- [ ] Update contract template (Florida law, TILA compliance)
- [ ] Update contractVariablesMapper.js (SSN, EIN, ZIP)
- [ ] Update all API error messages to English
- [ ] Add US validators (SSN, EIN, ZIP, State, Phone)
- [ ] Update AgentCreditAnalyzer (FICO scores, US DTI limits)

### **Medium Priority** 🟡
- [ ] Update frontend labels (dashboard, forms)
- [ ] Update email templates to English
- [ ] Add Florida-specific legal disclosures
- [ ] Update system settings (seed.js)
- [ ] Add TILA/Truth in Lending disclosures
- [ ] Update documentation (README, API docs)

### **Low Priority** 🟢
- [ ] Add state-specific interest rate limits
- [ ] Implement Regulation Z compliance checks
- [ ] Add credit bureau integration (Experian, Equifax, TransUnion)
- [ ] Implement FCRA (Fair Credit Reporting Act) compliance
- [ ] Add E-Sign Act compliance features

---

## 📚 REFERENCES

### **Florida Statutes**
- Chapter 687: Interest and Usury
- Chapter 559: Consumer Collection Practices Act
- Chapter 516: Finance Companies

### **Federal Regulations**
- Truth in Lending Act (TILA) - 15 USC 1601
- Regulation Z (12 CFR 1026)
- Fair Credit Reporting Act (FCRA)
- Electronic Signatures in Global and National Commerce Act (E-Sign Act)
- Equal Credit Opportunity Act (ECOA)

### **Industry Standards**
- FICO Score Range: 300-850
- DTI Ratio Limits: ≤43% (Qualified Mortgage)
- Typical APR Range: 5.99% - 35.99%
- Florida Usury Cap: Varies by loan type

---

## 🚀 NEXT STEPS

1. **Immediate** (Today):
   - Update `contractVariablesMapper.js` ✅ DONE
   - Create US validators utility
   - Update Prisma schema

2. **Short-term** (This Week):
   - Run database migration
   - Update all controllers (error messages)
   - Update contract template
   - Update frontend labels

3. **Medium-term** (Next Week):
   - Full TILA compliance implementation
   - Credit bureau integration
   - E-signature legal compliance

---

**Last Updated**: February 21, 2026  
**Author**: FlexCredi Development Team  
**Status**: ✅ Adjustments in progress - Contract mapper updated

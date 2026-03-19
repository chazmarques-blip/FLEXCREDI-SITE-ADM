# 📄 FLEXCREDI - Contract Template Documentation

## Template File
**Location:** `/home/user/webapp/backend/templates/contracts/personal-loan-agreement-template.docx`  
**Type:** Microsoft Word 2007+ (.docx)  
**Size:** 110 KB  
**Sections:** 12 main sections + ACH Authorization

---

## Contract Structure

### 1. LOAN AMOUNT AND TERMS
- Principal Amount
- Interest Rate
- Loan Term
- Total Repayment Amount

### 2. DISBURSEMENT OF LOAN
- Disbursement Method
- Borrower's Bank Account

### 3. REPAYMENT SCHEDULE
- Number of Installments
- Installment Amount
- Due Date
- Payment Method

### 4. LATE PAYMENTS
- Late Fee
- Default Interest Rate

### 5. PREPAYMENT
- No Prepayment Penalty

### 6. REPRESENTATIONS AND WARRANTIES
- Borrower declarations

### 7. DEFAULT
- Events of Default

### 8. REMEDIES UPON DEFAULT
- Lender's rights

### 9. ACH PAYMENT AUTHORIZATION ⚡
- Customer Information
- Bank Account Information
- Authorization Terms
- Reversals & Returns
- Authorization Validity

### 10. GOVERNING LAW
- State of Florida

### 11. NOTICES
- Communication requirements

### 12. ADDITIONAL CLAUSES
- Entire Agreement
- Amendments
- Severability
- Assignment
- Waiver
- Counterparts

---

## Template Variables (42 total)

### 📅 Date Variables (3)
| Variable | Description | Example |
|----------|-------------|---------|
| `[DAY]` | Day of month | `15` |
| `[MONTH]` | Month name | `January` |
| `[YEAR]` | Four-digit year | `2026` |

### 👤 Borrower Information (11)
| Variable | Description | Example |
|----------|-------------|---------|
| `[BORROWER_FULL_NAME]` | Complete name | `John Michael Smith` |
| `[BORROWER_NATIONALITY]` | Nationality | `American` |
| `[BORROWER_MARITAL_STATUS]` | Marital status | `Single`, `Married` |
| `[BORROWER_OCCUPATION]` | Profession | `Software Engineer` |
| `[BORROWER_ID_TYPE]` | ID type | `Driver's License`, `Passport` |
| `[BORROWER_ID_NUMBER]` | ID number | `D12345678` |
| `[BORROWER_SSN_TIN]` | SSN or TIN | `123-45-6789` |
| `[BORROWER_ADDRESS_LINE]` | Street address | `123 Main Street, Apt 4B` |
| `[BORROWER_CITY_STATE_ZIP]` | City, State, ZIP | `Orlando, FL 32801` |
| `[BORROWER_PHONE]` | Phone number | `(407) 555-1234` |
| `[BORROWER_EMAIL]` | Email address | `john.smith@example.com` |

### 💰 Loan Terms (8)
| Variable | Description | Example |
|----------|-------------|---------|
| `[LOAN_AMOUNT_WORDS]` | Amount in words | `Twenty-Five Thousand Dollars` |
| `[LOAN_AMOUNT_NUMBERS]` | Amount in numbers | `25,000.00` |
| `[INTEREST_RATE_PERCENTAGE]` | Annual interest rate | `18.5` |
| `[LOAN_TERM_MONTHS]` | Term in months | `24` |
| `[TOTAL_REPAYMENT_AMOUNT_WORDS]` | Total in words | `Thirty Thousand Dollars` |
| `[TOTAL_REPAYMENT_AMOUNT_NUMBERS]` | Total in numbers | `30,000.00` |
| `[NUMBER_OF_INSTALLMENTS]` | Number of payments | `24` |
| `[INSTALLMENT_AMOUNT_WORDS]` | Installment in words | `One Thousand Two Hundred Fifty Dollars` |
| `[INSTALLMENT_AMOUNT_NUMBERS]` | Installment in numbers | `1,250.00` |

### 📆 Payment Schedule (3)
| Variable | Description | Example |
|----------|-------------|---------|
| `[DAY_OF_MONTH]` | Payment day | `15` |
| `[FIRST_PAYMENT_MONTH]` | First payment month | `March` |
| `[FIRST_PAYMENT_YEAR]` | First payment year | `2026` |

### 🏦 Disbursement Account (3)
| Variable | Description | Example |
|----------|-------------|---------|
| `[DISBURSEMENT_METHOD]` | How funds are sent | `ACH Direct Deposit`, `Wire Transfer` |
| `[DISBURSEMENT_BANK_NAME]` | Borrower's bank | `Bank of America` |
| `[DISBURSEMENT_ROUTING_NUMBER]` | Routing number | `021000021` |
| `[DISBURSEMENT_ACCOUNT_LAST4]` | Last 4 digits | `5678` |

### 💳 ACH Payment Information (9)
| Variable | Description | Example |
|----------|-------------|---------|
| `[ACH_BANK_NAME]` | Bank for payments | `Chase Bank` |
| `[ACH_ROUTING_NUMBER]` | ACH routing number | `021000021` |
| `[ACH_ACCOUNT_HOLDER_NAME]` | Account holder | `John M. Smith` |
| `[ACH_ACCOUNT_NUMBER]` | Full account number | `123456789012` |
| `[ACH_DIFFERENT_ACCOUNT_HOLDER_NAME]` | If different | `Jane Smith` (or blank) |
| `[ACH_RELATIONSHIP_TO_BORROWER]` | Relationship | `Spouse`, `Co-signer` |
| `[ACH_REVOCATION_NOTICE_DAYS]` | Notice period | `15` |
| `[ACH_TRANSACTION_REFERENCE]` | Internal ref | `ACH-2026-001234` |
| `[ACH_ACCOUNT_VERIFIED_BY]` | Verifier name | `Admin Name` |
| `[ACH_DATE_VERIFIED]` | Verification date | `02/15/2026` |

### ⚠️ Fees & Penalties (4)
| Variable | Description | Example |
|----------|-------------|---------|
| `[PAYMENT_METHOD]` | Payment method | `ACH Direct Debit` |
| `[GRACE_PERIOD_DAYS]` | Grace period | `5` |
| `[LATE_FEE_PERCENTAGE]` | Late fee % | `5` |
| `[DEFAULT_INTEREST_RATE_PERCENTAGE]` | Default rate | `24` |

---

## Contract Generation Flow

### Step 1: Application Approved
When an application is approved (`status: APPROVED`), the system:
1. Calculates all loan terms (principal, interest, monthly payment)
2. Retrieves borrower information
3. Retrieves partner information

### Step 2: Generate Contract
```javascript
// Trigger contract generation
POST /api/contracts/generate
{
  "applicationId": "uuid",
  "effectiveDate": "2026-02-15"
}
```

### Step 3: Variable Substitution
The system replaces all `[VARIABLE_NAME]` placeholders with actual data:

```javascript
const contractData = {
  // Date
  DAY: "15",
  MONTH: "February",
  YEAR: "2026",
  
  // Borrower
  BORROWER_FULL_NAME: "John Michael Smith",
  BORROWER_EMAIL: "john@example.com",
  // ... (todas as variáveis)
  
  // Loan terms
  LOAN_AMOUNT_NUMBERS: "25,000.00",
  LOAN_AMOUNT_WORDS: "Twenty-Five Thousand Dollars",
  INTEREST_RATE_PERCENTAGE: "18.5",
  // ... (todas as variáveis)
}
```

### Step 4: Create Document
1. Load template DOCX
2. Replace all variables
3. Generate new DOCX with populated data
4. Save to database (Contract model)
5. Generate unique contract number

### Step 5: Send for Signature
1. Upload to DocuSign (ou similar)
2. Send email to borrower
3. Track signature status
4. Update contract status: `GENERATED` → `SENT` → `SIGNED`

### Step 6: Activate ACH
Once signed:
1. Extract ACH information
2. Verify bank account (Plaid/MicroDeposits)
3. Set up ACH recurring payments
4. Update contract status: `SIGNED` → `ACTIVE`

---

## Contract Lifecycle

```
┌─────────────┐
│  GENERATED  │ ← Contract created with all variables filled
└──────┬──────┘
       │
       ↓
┌─────────────┐
│    SENT     │ ← Sent to borrower via email/DocuSign
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   SIGNED    │ ← Borrower signed electronically
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   ACTIVE    │ ← ACH activated, payments scheduled
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  COMPLETED  │ ← All payments made, loan fully repaid
└─────────────┘
       
       OR
       
┌─────────────┐
│  CANCELLED  │ ← Contract cancelled before completion
└─────────────┘
```

---

## Implementation Files

### Backend
```
backend/
├── templates/
│   └── contracts/
│       └── personal-loan-agreement-template.docx
├── utils/
│   └── contractGenerator.js         # To be created
├── controllers/
│   └── ContractsController.js       # To be created
└── routes/
    └── contracts.js                 # To be created
```

### Contract Generator Utility
```javascript
// utils/contractGenerator.js
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');

class ContractGenerator {
  async generateContract(applicationId, contractData) {
    // 1. Load template
    const content = fs.readFileSync('templates/contracts/personal-loan-agreement-template.docx', 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);
    
    // 2. Set data
    doc.setData(contractData);
    
    // 3. Render
    doc.render();
    
    // 4. Generate buffer
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    
    // 5. Save to database
    const contract = await prisma.contract.create({
      data: {
        applicationId,
        contractNumber: generateContractNumber(),
        principalAmount: contractData.principalAmount,
        interestRate: contractData.interestRate,
        termMonths: contractData.termMonths,
        monthlyPayment: contractData.monthlyPayment,
        totalAmount: contractData.totalAmount,
        status: 'GENERATED',
        generatedAt: new Date(),
        documentBuffer: buffer,
        documentHash: generateHash(buffer)
      }
    });
    
    return contract;
  }
}
```

---

## Database Schema (Already in Prisma)

```prisma
model Contract {
  id                String            @id @default(uuid())
  applicationId     String            @unique
  contractNumber    String            @unique
  principalAmount   Float
  interestRate      Float
  termMonths        Int
  monthlyPayment    Float
  totalAmount       Float
  status            ContractStatus    @default(GENERATED)
  generatedAt       DateTime          @default(now())
  sentAt            DateTime?
  signedAt          DateTime?
  activatedAt       DateTime?
  signerIp          String?
  signatureHash     String?
  documentHash      String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  application       Application       @relation(fields: [applicationId], references: [id])
  
  @@map("contracts")
}

enum ContractStatus {
  GENERATED
  SENT
  SIGNED
  ACTIVE
  COMPLETED
  CANCELLED
}
```

---

## API Endpoints (To be implemented in Sprint 2)

### Generate Contract
```bash
POST /api/contracts/generate
Body: {
  "applicationId": "uuid",
  "effectiveDate": "2026-02-15"
}
Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "contractNumber": "FL2026001234",
    "status": "GENERATED",
    "downloadUrl": "/api/contracts/uuid/download"
  }
}
```

### Get Contract
```bash
GET /api/contracts/:id
Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "contractNumber": "FL2026001234",
    "status": "SIGNED",
    "application": { ... },
    "signedAt": "2026-02-20T15:30:00Z"
  }
}
```

### Download Contract
```bash
GET /api/contracts/:id/download
Response: Binary DOCX file
```

### Send for Signature
```bash
POST /api/contracts/:id/send
Body: {
  "signerEmail": "borrower@example.com",
  "signerName": "John Smith"
}
Response: {
  "success": true,
  "message": "Contract sent for signature",
  "envelopeId": "docusign-envelope-id"
}
```

### Sign Contract
```bash
PUT /api/contracts/:id/sign
Body: {
  "signatureHash": "abc123...",
  "signerIp": "192.168.1.1"
}
Response: {
  "success": true,
  "message": "Contract signed successfully"
}
```

### Activate Contract
```bash
PUT /api/contracts/:id/activate
Body: {
  "achVerified": true
}
Response: {
  "success": true,
  "message": "Contract activated, ACH scheduled"
}
```

---

## Required NPM Packages

```bash
npm install --save pizzip docxtemplater docusign-esign
```

- **pizzip** - ZIP library for DOCX manipulation
- **docxtemplater** - Template engine for DOCX files
- **docusign-esign** - DocuSign API integration (optional)

---

## Security Considerations

### Document Integrity
- ✅ Generate SHA-256 hash of contract document
- ✅ Store hash in database
- ✅ Verify hash before displaying/sending

### Signature Verification
- ✅ Capture signer IP address
- ✅ Store signature timestamp
- ✅ Generate signature hash
- ✅ Require email verification

### ACH Security
- ✅ Encrypt ACH account numbers
- ✅ Store only last 4 digits in logs
- ✅ Verify bank account via Plaid/micro-deposits
- ✅ Require ACH authorization consent (separate initial)

---

## Next Steps (Sprint 2 Implementation)

1. ✅ **Template documented** (THIS FILE)
2. ⏳ Install required packages (`pizzip`, `docxtemplater`)
3. ⏳ Create `ContractGenerator` utility
4. ⏳ Create `ContractsController`
5. ⏳ Create `/api/contracts` routes
6. ⏳ Implement variable substitution
7. ⏳ Add DocuSign integration
8. ⏳ Create `/admin/contratos` frontend page
9. ⏳ Add contract preview/download
10. ⏳ Test complete flow

---

## Testing Checklist

- [ ] Generate contract with all variables populated
- [ ] Download contract as DOCX
- [ ] Preview contract in PDF.js
- [ ] Send contract via DocuSign
- [ ] Track signature status
- [ ] Verify signature hash
- [ ] Activate ACH after signing
- [ ] Generate contract number (unique)
- [ ] Store contract in database
- [ ] Retrieve contract for display

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-21  
**Sprint:** 1 (Documentation)  
**Implementation:** Sprint 2 (Contracts & Documents)

---

**FLEXCREDI LLC** © 2024-2026  
*Contract Template Documentation*

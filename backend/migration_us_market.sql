-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "PartnerDocType" AS ENUM ('ARTICLES_OF_INCORPORATION', 'EIN_DOCUMENT', 'PROOF_OF_ADDRESS', 'BANK_STATEMENT', 'BUSINESS_LICENSE', 'FINANCIAL_STATEMENT', 'TAX_RETURN', 'ID_LEGAL_REP', 'SSN_LEGAL_REP', 'POWER_OF_ATTORNEY', 'VOIDED_CHECK', 'OTHER');

-- CreateEnum
CREATE TYPE "ReceivableStatus" AS ENUM ('SCHEDULED', 'PROCESSING', 'COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN', 'SUPER_ADMIN', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ANALYZING', 'MANUAL_REVIEW', 'APPROVED', 'REJECTED', 'CONTRACT_PENDING', 'ACH_PENDING', 'ACTIVE', 'PAID_OFF', 'DEFAULTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "AchPaymentStatus" AS ENUM ('SCHEDULED', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRYING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID_FRONT', 'ID_BACK', 'SSN_CARD', 'PROOF_OF_INCOME', 'BANK_STATEMENT', 'PROOF_OF_ADDRESS', 'TAX_RETURN', 'W2_FORM', 'FORM_1099', 'EMPLOYMENT_LETTER', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('GENERATED', 'SENT', 'SIGNED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "tradeName" TEXT,
    "ein" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "county" TEXT,
    "legalRepName" TEXT NOT NULL,
    "legalRepSsn" TEXT NOT NULL,
    "legalRepEmail" TEXT NOT NULL,
    "legalRepPhone" TEXT NOT NULL,
    "bankName" TEXT,
    "bankRoutingNumber" TEXT,
    "bankAccount" TEXT,
    "bankAccountType" TEXT,
    "monthlyRevenue" DOUBLE PRECISION,
    "monthlyReceivables" DOUBLE PRECISION,
    "creditLimit" DOUBLE PRECISION,
    "status" "PartnerStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "flexCrediFeeRate" DOUBLE PRECISION NOT NULL DEFAULT 0.03,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_documents" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "type" "PartnerDocType" NOT NULL,
    "originalName" TEXT NOT NULL,
    "cloudinaryUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_receivables" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "applicationId" TEXT,
    "referenceMonth" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "expectedAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "status" "ReceivableStatus" NOT NULL DEFAULT 'SCHEDULED',
    "processedAt" TIMESTAMP(3),
    "actualAmount" DOUBLE PRECISION,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_receivables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_payments" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "feeAmount" DOUBLE PRECISION NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankRoutingNumber" TEXT NOT NULL,
    "bankAccount" TEXT NOT NULL,
    "bankAccountType" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "externalId" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "name" TEXT NOT NULL,
    "ssn" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "driverLicenseNumber" TEXT,
    "driverLicenseState" TEXT,
    "stateIdNumber" TEXT,
    "passportNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "county" TEXT,
    "monthlyIncome" DOUBLE PRECISION,
    "employer" TEXT,
    "occupation" TEXT,
    "employmentStatus" TEXT,
    "bankName" TEXT,
    "bankRoutingNumber" TEXT,
    "bankAccount" TEXT,
    "bankAccountType" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "partnerId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientSsn" TEXT NOT NULL,
    "clientAddress" TEXT,
    "clientCity" TEXT,
    "clientState" TEXT,
    "clientZipCode" TEXT,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "employer" TEXT,
    "occupation" TEXT,
    "desiredAmount" DOUBLE PRECISION NOT NULL,
    "purpose" TEXT NOT NULL,
    "creditScore" INTEGER,
    "creditTier" TEXT,
    "dti" DOUBLE PRECISION,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAmount" DOUBLE PRECISION,
    "interestRate" DOUBLE PRECISION,
    "termMonths" INTEGER,
    "paymentFrequency" "PaymentFrequency",
    "monthlyPayment" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analyzedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "riskLevel" TEXT,
    "fraudScore" DOUBLE PRECISION,
    "contractSigned" BOOLEAN NOT NULL DEFAULT false,
    "contractSignedAt" TIMESTAMP(3),
    "achAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "achAuthorizedAt" TIMESTAMP(3),
    "achRoutingNumber" TEXT,
    "achAccountNumber" TEXT,
    "achAccountType" TEXT,
    "achMandateId" TEXT,
    "partnerPaymentStatus" TEXT,
    "partnerPaidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ach_payments" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "AchPaymentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureReason" TEXT,
    "paybrightPaymentId" TEXT,
    "achTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ach_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_reports" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT,
    "creditScore" INTEGER NOT NULL,
    "scoreModel" TEXT NOT NULL,
    "fullReportJson" JSONB NOT NULL,
    "totalAccounts" INTEGER,
    "openAccounts" INTEGER,
    "delinquentAccounts" INTEGER,
    "totalDebt" DOUBLE PRECISION,
    "availableCredit" DOUBLE PRECISION,
    "creditUtilization" DOUBLE PRECISION,
    "oldestAccountAge" INTEGER,
    "recentInquiries" INTEGER,
    "publicRecords" INTEGER,
    "cost" DOUBLE PRECISION,
    "provider" TEXT NOT NULL DEFAULT 'experian',
    "pulledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interest_rate_rules" (
    "id" TEXT NOT NULL,
    "minScore" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "maxAmount" DOUBLE PRECISION NOT NULL,
    "maxTermMonths" INTEGER NOT NULL,
    "allowWeekly" BOOLEAN NOT NULL DEFAULT false,
    "allowBiweekly" BOOLEAN NOT NULL DEFAULT true,
    "allowMonthly" BOOLEAN NOT NULL DEFAULT true,
    "maxIncomeMultiple" DOUBLE PRECISION,
    "minIncomeRequired" DOUBLE PRECISION,
    "maxDti" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "interest_rate_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "applicationId" TEXT,
    "type" "DocumentType" NOT NULL,
    "originalName" TEXT NOT NULL,
    "cloudinaryUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "extractedData" JSONB,
    "confidence" DOUBLE PRECISION,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "principalAmount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "paymentFrequency" "PaymentFrequency" NOT NULL,
    "paymentAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "amortizationJson" JSONB NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'GENERATED',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "paidOffAt" TIMESTAMP(3),
    "defaultedAt" TIMESTAMP(3),
    "signatureHash" TEXT,
    "signerIp" TEXT,
    "docusignEnvelopeId" TEXT,
    "documentUrl" TEXT,
    "documentHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_ein_key" ON "partners"("ein");

-- CreateIndex
CREATE UNIQUE INDEX "partners_email_key" ON "partners"("email");

-- CreateIndex
CREATE INDEX "partner_receivables_partnerId_referenceMonth_idx" ON "partner_receivables"("partnerId", "referenceMonth");

-- CreateIndex
CREATE INDEX "partner_receivables_partnerId_status_idx" ON "partner_receivables"("partnerId", "status");

-- CreateIndex
CREATE INDEX "partner_payments_partnerId_status_idx" ON "partner_payments"("partnerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_ssn_key" ON "users"("ssn");

-- CreateIndex
CREATE INDEX "applications_userId_idx" ON "applications"("userId");

-- CreateIndex
CREATE INDEX "applications_partnerId_idx" ON "applications"("partnerId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_creditScore_idx" ON "applications"("creditScore");

-- CreateIndex
CREATE INDEX "ach_payments_applicationId_status_idx" ON "ach_payments"("applicationId", "status");

-- CreateIndex
CREATE INDEX "ach_payments_dueDate_idx" ON "ach_payments"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "credit_reports_applicationId_key" ON "credit_reports"("applicationId");

-- CreateIndex
CREATE INDEX "credit_reports_applicationId_idx" ON "credit_reports"("applicationId");

-- CreateIndex
CREATE INDEX "credit_reports_userId_idx" ON "credit_reports"("userId");

-- CreateIndex
CREATE INDEX "interest_rate_rules_minScore_maxScore_idx" ON "interest_rate_rules"("minScore", "maxScore");

-- CreateIndex
CREATE INDEX "interest_rate_rules_active_priority_idx" ON "interest_rate_rules"("active", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_applicationId_key" ON "contracts"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contractNumber_key" ON "contracts"("contractNumber");

-- CreateIndex
CREATE INDEX "audit_logs_userId_timestamp_idx" ON "audit_logs"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "partner_documents" ADD CONSTRAINT "partner_documents_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_receivables" ADD CONSTRAINT "partner_receivables_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_receivables" ADD CONSTRAINT "partner_receivables_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_payments" ADD CONSTRAINT "partner_payments_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_payments" ADD CONSTRAINT "partner_payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ach_payments" ADD CONSTRAINT "ach_payments_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_reports" ADD CONSTRAINT "credit_reports_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_reports" ADD CONSTRAINT "credit_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


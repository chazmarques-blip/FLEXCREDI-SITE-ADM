/**
 * FLEXCREDI LLC - AgentCreditAnalyzer (US Market)
 * Analyzes credit applications and applies approval rules
 * 
 * US Market Standards:
 * - FICO Score: 300-850 (Excellent: 800+, Very Good: 740-799, Good: 670-739, Fair: 580-669, Poor: 300-579)
 * - DTI Limit: Maximum 43% (Qualified Mortgage standard)
 * - Credit Bureaus: Experian, Equifax, TransUnion
 * 
 * Integrates with:
 * - Experian API (for credit score) - MOCK for development
 * - InterestRateRules (configurable rules table)
 */

const BaseAgent = require('./BaseAgent');
const EventBus = require('../core/EventBus');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AgentCreditAnalyzer extends BaseAgent {
  constructor() {
    super('AgentCreditAnalyzer', {
      autoApproveThreshold: 750,  // Minimum FICO for auto-approval (Very Good credit)
      manualReviewThreshold: 620, // Below this requires manual review (Fair credit)
      maxDTI: 0.43,               // Maximum DTI ratio (43% - US standard for qualified mortgages)
      timeout: 60000              // 60 seconds
    });
    
    // Register event listeners
    EventBus.on('application.created', (data) => this.execute(data));
    EventBus.on('application.reanalyze', (data) => this.execute(data));
    
    console.log(`[${this.name}] Listening to: application.created, application.reanalyze`);
    console.log(`[${this.name}] US Market Standards: FICO 300-850, DTI max ${this.config.maxDTI * 100}%`);
  }

  /**
   * Execute credit analysis
   * @param {object} data - { applicationId }
   */
  async run(data) {
    this.validateInput(data, ['applicationId']);
    
    const { applicationId } = data;
    
    // 1. Find application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { partner: true, user: true }
    });
    
    if (!application) {
      throw new Error(`Application ${applicationId} not found`);
    }
    
    console.log(`[${this.name}] Analyzing application for client: ${application.clientName} (SSN: XXX-XX-${application.clientSsn?.slice(-4) || 'XXXX'})`);
    
    // 2. Update status to "analyzing"
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ANALYZING' }
    });
    
    // 3. Pull credit score (MOCK - will integrate with Experian/Equifax/TransUnion)
    const creditReport = await this.pullCreditScore(application);
    
    // 4. Calculate DTI (Debt-to-Income Ratio) - US standard
    const dti = this.calculateDTI(application, creditReport);
    
    // 5. Find applicable rule based on FICO score
    const rule = await this.findApplicableRule(creditReport.creditScore);
    
    if (!rule) {
      return await this.rejectApplication(applicationId, 'NO_RULE_FOUND', 
        `FICO score ${creditReport.creditScore} has no configured rule`);
    }
    
    // 6. Validate minimum income
    if (rule.minIncomeRequired && application.monthlyIncome < rule.minIncomeRequired) {
      return await this.rejectApplication(applicationId, 'INSUFFICIENT_INCOME',
        `Minimum income required: $${rule.minIncomeRequired.toLocaleString('en-US')}/month`);
    }
    
    // 7. Validate DTI (US standard: max 43% for qualified mortgages)
    const maxDTI = rule.maxDti || this.config.maxDTI;
    if (dti > maxDTI) {
      return await this.rejectApplication(applicationId, 'HIGH_DTI',
        `DTI ${(dti * 100).toFixed(1)}% exceeds limit of ${(maxDTI * 100)}% (US standard for qualified loans)`);
    }
    
    // 8. Calculate maximum approved amount
    const maxByIncome = application.monthlyIncome * (rule.maxIncomeMultiple || 5);
    const maxByRule = rule.maxAmount;
    const approvedAmount = Math.min(maxByIncome, maxByRule, application.desiredAmount);
    
    // Validate approved amount is within allowed range
    if (approvedAmount < 1000) {
      return await this.rejectApplication(applicationId, 'AMOUNT_TOO_LOW',
        'Approved amount is below minimum loan amount ($1,000)');
    }
    
    // 9. Calculate term (US standard: 12-60 months for personal loans)
    const termMonths = Math.min(36, rule.maxTermMonths); // Default 36 months
    
    // 10. Calculate monthly payment (PMT formula)
    const monthlyPayment = this.calculatePayment(
      approvedAmount,
      rule.interestRate,
      termMonths,
      'MONTHLY'
    );
    
    // 11. Determine final status based on FICO score
    let status;
    if (creditReport.creditScore >= this.config.autoApproveThreshold) {
      // FICO 750+ (Very Good/Excellent credit) - Auto-approve
      status = 'APPROVED';
    } else if (creditReport.creditScore >= this.config.manualReviewThreshold) {
      // FICO 620-749 (Fair/Good credit) - Manual review
      status = 'MANUAL_REVIEW';
    } else {
      // FICO < 620 (Poor credit) - Reject
      return await this.rejectApplication(applicationId, 'LOW_CREDIT_SCORE',
        `FICO score ${creditReport.creditScore} is below minimum threshold (${this.config.manualReviewThreshold}) for consideration`);
    }
    
    // 12. Update application with analysis results
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        creditScore: creditReport.creditScore,
        creditTier: rule.tier,
        dti: dti,
        approvedAmount: approvedAmount,
        interestRate: rule.interestRate,
        termMonths: termMonths,
        paymentFrequency: 'MONTHLY',
        monthlyPayment: monthlyPayment,
        totalAmount: monthlyPayment * termMonths,
        status: status,
        riskLevel: this.calculateRiskLevel(creditReport.creditScore, dti),
        analyzedAt: new Date(),
        ...(status === 'APPROVED' && { approvedAt: new Date() })
      }
    });
    
    // 13. Emit appropriate event
    if (status === 'APPROVED') {
      EventBus.emitAsync('application.approved', { applicationId });
    } else if (status === 'MANUAL_REVIEW') {
      EventBus.emitAsync('application.manual_review', { applicationId });
    }
    
    console.log(`[${this.name}] Analysis complete: ${status}`);
    console.log(`[${this.name}] FICO: ${creditReport.creditScore} (${this.getFICORating(creditReport.creditScore)}), DTI: ${(dti * 100).toFixed(1)}%`);
    console.log(`[${this.name}] Approved: $${approvedAmount.toLocaleString('en-US')} @ ${(rule.interestRate * 100).toFixed(2)}% APR for ${termMonths} months`);
    console.log(`[${this.name}] Monthly payment: $${monthlyPayment.toFixed(2)}`);
    
    return {
      status,
      creditScore: creditReport.creditScore,
      creditRating: this.getFICORating(creditReport.creditScore),
      creditTier: rule.tier,
      approvedAmount,
      interestRate: rule.interestRate,
      termMonths,
      monthlyPayment,
      totalAmount: monthlyPayment * termMonths,
      dti,
      riskLevel: updatedApplication.riskLevel
    };
  }

  /**
   * Pull credit score (MOCK - replace with real Experian/Equifax/TransUnion integration)
   * @param {object} application - Application
   */
  async pullCreditScore(application) {
    console.log(`[${this.name}] Pulling FICO credit score from Experian (MOCK)...`);
    
    // MOCK: Generate FICO score based on income (US range: 300-850)
    let mockScore;
    if (application.monthlyIncome >= 5000) {
      mockScore = 720 + Math.floor(Math.random() * 130); // 720-850 (Good to Excellent)
    } else if (application.monthlyIncome >= 3000) {
      mockScore = 650 + Math.floor(Math.random() * 100); // 650-750 (Fair to Very Good)
    } else {
      mockScore = 550 + Math.floor(Math.random() * 150); // 550-700 (Poor to Good)
    }
    
    // Ensure within FICO range (300-850)
    mockScore = Math.max(300, Math.min(850, mockScore));
    
    // Simulate API delay
    await this.delay(500);
    
    // Save credit report
    const creditReport = await prisma.creditReport.create({
      data: {
        applicationId: application.id,
        userId: application.userId,
        creditScore: mockScore,
        scoreModel: 'FICO Score 8 (MOCK)',
        fullReportJson: {
          mock: true,
          note: 'This is a mock credit report. Replace with real Experian/Equifax/TransUnion integration.',
          bureau: 'Experian',
          generatedAt: new Date(),
          ficoVersion: 'FICO Score 8',
          range: '300-850'
        },
        totalAccounts: Math.floor(Math.random() * 15) + 5,
        openAccounts: Math.floor(Math.random() * 10) + 3,
        delinquentAccounts: mockScore > 700 ? 0 : Math.floor(Math.random() * 3),
        totalDebt: application.monthlyIncome * (Math.random() * 3 + 1),
        availableCredit: application.monthlyIncome * (Math.random() * 5 + 2),
        creditUtilization: Math.random() * 0.6,  // 0-60%
        oldestAccountAge: Math.floor(Math.random() * 120) + 12,  // 12-132 months
        recentInquiries: Math.floor(Math.random() * 5),  // Hard inquiries in last 12 months
        publicRecords: mockScore > 700 ? 0 : Math.floor(Math.random() * 2),  // Bankruptcies, judgments, liens
        cost: 2.50,  // Cost per credit report pull
        provider: 'experian_mock',
        pulledAt: new Date(),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      }
    });
    
    console.log(`[${this.name}] FICO Score: ${mockScore} - ${this.getFICORating(mockScore)} (${creditReport.scoreModel})`);
    
    return creditReport;
  }

  /**
   * Calculate DTI (Debt-to-Income Ratio) - US standard
   * Formula: (Total Monthly Debt Payments / Gross Monthly Income) * 100
   * US standard for qualified mortgages: max 43%
   */
  calculateDTI(application, creditReport) {
    const monthlyIncome = application.monthlyIncome;
    const totalDebt = creditReport.totalDebt || 0;
    
    // Estimate monthly debt payment (typically 3% of total debt for revolving, 1.5% for installment)
    // This is a simplified calculation - real DTI would use actual monthly payment obligations
    const estimatedMonthlyDebt = totalDebt * 0.025; // Conservative estimate: 2.5% of total debt
    
    const dti = estimatedMonthlyDebt / monthlyIncome;
    
    console.log(`[${this.name}] DTI Calculation: ${(dti * 100).toFixed(2)}% (monthly debt: $${estimatedMonthlyDebt.toFixed(2)}, monthly income: $${monthlyIncome.toFixed(2)})`);
    
    if (dti > 0.43) {
      console.warn(`[${this.name}] ⚠️  DTI ${(dti * 100).toFixed(1)}% exceeds US standard of 43% for qualified mortgages`);
    }
    
    return dti;
  }

  /**
   * Find applicable rule for FICO score
   */
  async findApplicableRule(creditScore) {
    const rule = await prisma.interestRateRule.findFirst({
      where: {
        active: true,
        minScore: { lte: creditScore },
        maxScore: { gte: creditScore }
      },
      orderBy: { priority: 'desc' }
    });
    
    if (rule) {
      console.log(`[${this.name}] Rule found: ${rule.tier} (FICO ${rule.minScore}-${rule.maxScore}) @ ${(rule.interestRate * 100).toFixed(2)}% APR`);
    } else {
      console.warn(`[${this.name}] ⚠️  No rule found for FICO score ${creditScore}`);
    }
    
    return rule;
  }

  /**
   * Calculate monthly payment (PMT formula)
   * @param {number} principal - Loan amount
   * @param {number} annualRate - Annual interest rate as decimal (e.g., 0.1850 for 18.50%)
   * @param {number} termMonths - Loan term in months
   * @param {string} frequency - Payment frequency (MONTHLY, BIWEEKLY, WEEKLY)
   */
  calculatePayment(principal, annualRate, termMonths, frequency) {
    const periodsPerYear = frequency === 'WEEKLY' ? 52 : frequency === 'BIWEEKLY' ? 26 : 12;
    const periodicRate = annualRate / periodsPerYear;
    const totalPeriods = (termMonths / 12) * periodsPerYear;
    
    if (periodicRate === 0) {
      return principal / totalPeriods;
    }
    
    // PMT formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const payment = principal * 
      (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
      (Math.pow(1 + periodicRate, totalPeriods) - 1);
    
    return Math.round(payment * 100) / 100;
  }

  /**
   * Calculate risk level based on FICO and DTI (US standards)
   */
  calculateRiskLevel(creditScore, dti) {
    // Excellent: FICO 800+ and DTI < 30%
    if (creditScore >= 800 && dti < 0.30) return 'LOW';
    
    // Very Good: FICO 740+ and DTI < 36%
    if (creditScore >= 740 && dti < 0.36) return 'LOW';
    
    // Good: FICO 670+ and DTI < 43%
    if (creditScore >= 670 && dti < 0.43) return 'MEDIUM';
    
    // Fair: FICO 580+ and DTI < 43%
    if (creditScore >= 580 && dti < 0.43) return 'MEDIUM';
    
    // All others: High risk
    return 'HIGH';
  }

  /**
   * Get FICO score rating (US standard)
   * @param {number} score - FICO score (300-850)
   * @returns {string} Rating category
   */
  getFICORating(score) {
    if (score >= 800) return 'Excellent';      // 800-850
    if (score >= 740) return 'Very Good';      // 740-799
    if (score >= 670) return 'Good';           // 670-739
    if (score >= 580) return 'Fair';           // 580-669
    return 'Poor';                             // 300-579
  }

  /**
   * Reject application
   */
  async rejectApplication(applicationId, reason, message) {
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        rejectionReason: `${reason}: ${message}`
      }
    });
    
    EventBus.emitAsync('application.rejected', { applicationId, reason, message });
    
    console.log(`[${this.name}] Application REJECTED: ${reason} - ${message}`);
    
    return {
      status: 'REJECTED',
      reason,
      message
    };
  }
}

// Create singleton instance
const agentCreditAnalyzer = new AgentCreditAnalyzer();

module.exports = agentCreditAnalyzer;

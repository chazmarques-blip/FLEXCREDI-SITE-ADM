/**
 * FLEXCREDI LLC - Applications Controller (US Market)
 * Manages credit applications for personal loans
 */

const { PrismaClient } = require('@prisma/client');
const EventBus = require('../core/EventBus');
const { validateSSN, validateZipCode, validateState, validatePhone } = require('../utils/usValidators');
const prisma = new PrismaClient();

class ApplicationsController {
  
  /**
   * Create new credit application
   * POST /api/applications
   */
  async create(req, res) {
    try {
      const {
        // Client information
        clientName,
        clientEmail,
        clientPhone,
        clientSsn,        // Changed from clientCpf
        clientAddress,
        clientCity,
        clientState,
        clientZipCode,
        
        // Application data
        desiredAmount,
        purpose,
        monthlyIncome,
        employmentStatus,
        employer,
        occupation,
        
        // Partner
        partnerId
      } = req.body;
      
      // Required fields validation
      if (!clientName || !clientEmail || !clientPhone || !clientSsn || !desiredAmount || !purpose || !monthlyIncome || !partnerId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['clientName', 'clientEmail', 'clientPhone', 'clientSsn', 'desiredAmount', 'purpose', 'monthlyIncome', 'partnerId']
        });
      }
      
      // Validate SSN format
      if (!validateSSN(clientSsn)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Social Security Number format. Expected: XXX-XX-XXXX or XXXXXXXXX'
        });
      }
      
      // Validate ZIP code if provided
      if (clientZipCode && !validateZipCode(clientZipCode)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ZIP code format. Expected: 12345 or 12345-6789'
        });
      }
      
      // Validate state if provided
      if (clientState && !validateState(clientState)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid US state code. Expected 2-letter abbreviation (e.g., FL, CA, NY)'
        });
      }
      
      // Validate phone if provided
      if (clientPhone && !validatePhone(clientPhone)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid phone number format. Expected 10-digit US phone number'
        });
      }
      
      // Validate desired amount
      const amount = parseFloat(desiredAmount);
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid loan amount. Must be a positive number'
        });
      }
      
      if (amount < 1000 || amount > 50000) {
        return res.status(400).json({
          success: false,
          error: 'Loan amount must be between $1,000 and $50,000'
        });
      }
      
      // Validate monthly income
      const income = parseFloat(monthlyIncome);
      if (isNaN(income) || income <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid monthly income. Must be a positive number'
        });
      }
      
      // Check if partner exists
      const partner = await prisma.partner.findUnique({
        where: { id: partnerId }
      });
      
      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partner not found'
        });
      }
      
      if (partner.status !== 'APPROVED') {
        return res.status(400).json({
          success: false,
          error: 'Partner is not approved. Only approved partners can receive applications'
        });
      }
      
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: clientEmail }
      });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: clientEmail,
            phone: clientPhone,
            name: clientName,
            ssn: clientSsn,      // Changed from cpf
            address: clientAddress,
            city: clientCity,
            state: clientState,
            zipCode: clientZipCode,
            monthlyIncome: income,
            employer,
            occupation,
            employmentStatus,
            role: 'CLIENT'
          }
        });
      }
      
      // Create application
      const application = await prisma.application.create({
        data: {
          userId: user.id,
          partnerId: partnerId,
          clientName,
          clientEmail,
          clientPhone,
          clientSsn,          // Changed from clientCpf
          clientAddress,
          clientCity,
          clientState,
          clientZipCode,
          monthlyIncome: income,
          employmentStatus: employmentStatus || 'employed',
          employer,
          occupation,
          desiredAmount: amount,
          purpose,
          status: 'PENDING'
        },
        include: {
          partner: true,
          user: true
        }
      });
      
      console.log(`[ApplicationsController] Application created: ${application.id} for ${clientName}`);
      
      // Emit event for automatic analysis
      EventBus.emitAsync('application.created', { applicationId: application.id });
      
      res.status(201).json({
        success: true,
        message: 'Application created successfully!',
        data: application
      });
      
    } catch (error) {
      console.error('[ApplicationsController] Error creating application:', error);
      
      // Handle unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'An application with this information already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to create application',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * List applications with filters
   * GET /api/applications?status=pending&limit=10&offset=0
   */
  async list(req, res) {
    try {
      const {
        status,
        partnerId,
        limit = 50,
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      const where = {};
      
      if (status) {
        where.status = status.toUpperCase();
      }
      
      if (partnerId) {
        where.partnerId = partnerId;
      }
      
      const [applications, total] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            partner: {
              select: {
                id: true,
                companyName: true,
                tradeName: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          take: parseInt(limit),
          skip: parseInt(offset)
        }),
        prisma.application.count({ where })
      ]);
      
      res.json({
        success: true,
        data: applications,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < total
        }
      });
      
    } catch (error) {
      console.error('[ApplicationsController] Error listing applications:', error);
      console.error('[ApplicationsController] Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to list applications',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get application details
   * GET /api/applications/:id
   */
  async get(req, res) {
    try {
      const { id } = req.params;
      
      const application = await prisma.application.findUnique({
        where: { id },
        include: {
          partner: true,
          user: true,
          documents: true,
          contract: true,
          creditReport: true,
          receivables: {
            orderBy: { dueDate: 'asc' }
          },
          partnerPayments: true,
          achPayments: {
            orderBy: { dueDate: 'asc' }
          }
        }
      });
      
      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }
      
      res.json({
        success: true,
        data: application
      });
      
    } catch (error) {
      console.error('[ApplicationsController] Error getting application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve application',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Manually approve application
   * PUT /api/applications/:id/approve
   */
  async approve(req, res) {
    try {
      const { id } = req.params;
      const {
        approvedAmount,
        interestRate,
        termMonths,
        reviewNotes,
        adminId
      } = req.body;
      
      // Validation
      if (!approvedAmount || !interestRate || !termMonths) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['approvedAmount', 'interestRate', 'termMonths']
        });
      }
      
      // Validate amounts
      const amount = parseFloat(approvedAmount);
      const rate = parseFloat(interestRate);
      const term = parseInt(termMonths);
      
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid approved amount'
        });
      }
      
      if (isNaN(rate) || rate < 5.99 || rate > 35.99) {
        return res.status(400).json({
          success: false,
          error: 'Interest rate must be between 5.99% and 35.99% APR'
        });
      }
      
      if (isNaN(term) || term < 6 || term > 60) {
        return res.status(400).json({
          success: false,
          error: 'Loan term must be between 6 and 60 months'
        });
      }
      
      // Find application
      const application = await prisma.application.findUnique({
        where: { id }
      });
      
      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }
      
      if (application.status === 'APPROVED') {
        return res.status(400).json({
          success: false,
          error: 'Application has already been approved'
        });
      }
      
      // Calculate monthly payment
      const monthlyPayment = this.calculatePayment(amount, rate, term);
      
      // Update application
      const updated = await prisma.application.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAmount: amount,
          interestRate: rate / 100,  // Store as decimal (18.5% = 0.185)
          termMonths: term,
          paymentFrequency: 'MONTHLY',
          monthlyPayment,
          totalAmount: monthlyPayment * term,
          approvedAt: new Date(),
          reviewNotes,
          reviewedBy: adminId
        }
      });
      
      console.log(`[ApplicationsController] Application approved: ${id} - $${amount} at ${rate}% APR for ${term} months`);
      
      // Emit event
      EventBus.emitAsync('application.approved', { applicationId: id });
      
      res.json({
        success: true,
        message: 'Application approved successfully!',
        data: updated
      });
      
    } catch (error) {
      console.error('[ApplicationsController] Error approving application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to approve application',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Reject application
   * PUT /api/applications/:id/reject
   */
  async reject(req, res) {
    try {
      const { id } = req.params;
      const { rejectionReason, adminId } = req.body;
      
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          error: 'Rejection reason is required'
        });
      }
      
      const updated = await prisma.application.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectionReason,
          reviewedBy: adminId
        }
      });
      
      console.log(`[ApplicationsController] Application rejected: ${id} - Reason: ${rejectionReason}`);
      
      EventBus.emitAsync('application.rejected', { applicationId: id, reason: rejectionReason });
      
      res.json({
        success: true,
        message: 'Application rejected',
        data: updated
      });
      
    } catch (error) {
      console.error('[ApplicationsController] Error rejecting application:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject application',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Calculate monthly payment (PMT formula)
   * @param {number} principal - Loan amount
   * @param {number} annualRate - Annual interest rate (percentage, e.g., 18.5)
   * @param {number} termMonths - Loan term in months
   * @returns {number} Monthly payment amount
   */
  calculatePayment(principal, annualRate, termMonths) {
    const monthlyRate = (annualRate / 100) / 12;
    
    // Simple interest if rate is 0
    if (monthlyRate === 0) {
      return principal / termMonths;
    }
    
    // PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
    const payment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    return Math.round(payment * 100) / 100;  // Round to 2 decimals
  }
}

module.exports = new ApplicationsController();

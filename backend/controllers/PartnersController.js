/**
 * FLEXCREDI LLC - Partners Controller (US Market)
 * Manages business partners for loan origination
 */

const { PrismaClient } = require('@prisma/client');
const EventBus = require('../core/EventBus');
const { validateEIN, validateSSN, validateZipCode, validateState, validatePhone } = require('../utils/usValidators');
const prisma = new PrismaClient();

class PartnersController {
  
  /**
   * Create new partner
   * POST /api/partners
   */
  async create(req, res) {
    try {
      const {
        // Company information
        companyName,
        tradeName,
        ein,              // Changed from cnpj
        email,
        phone,
        
        // Address (US format)
        address,
        city,
        state,
        zipCode,
        county,           // Optional (e.g., Miami-Dade)
        
        // Legal representative
        legalRepName,
        legalRepSsn,      // Changed from legalRepCpf
        legalRepEmail,
        legalRepPhone,
        
        // Bank information (US banking system)
        bankName,
        bankRoutingNumber, // ABA routing number (9 digits)
        bankAccount,
        bankAccountType,   // checking, savings
        
        // Financial information
        monthlyRevenue,
        monthlyReceivables
      } = req.body;
      
      // Required fields validation
      if (!companyName || !ein || !email || !phone || !address || !city || !state || !zipCode ||
          !legalRepName || !legalRepSsn || !legalRepEmail || !legalRepPhone) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['companyName', 'ein', 'email', 'phone', 'address', 'city', 'state', 'zipCode',
                    'legalRepName', 'legalRepSsn', 'legalRepEmail', 'legalRepPhone']
        });
      }
      
      // Validate EIN format
      if (!validateEIN(ein)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid EIN (Employer Identification Number) format. Expected: XX-XXXXXXX'
        });
      }
      
      // Validate legal representative SSN
      if (!validateSSN(legalRepSsn)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Social Security Number format for legal representative. Expected: XXX-XX-XXXX or XXXXXXXXX'
        });
      }
      
      // Validate ZIP code
      if (!validateZipCode(zipCode)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ZIP code format. Expected: 12345 or 12345-6789'
        });
      }
      
      // Validate state code
      if (!validateState(state)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid US state code. Expected 2-letter abbreviation (e.g., FL, CA, NY)'
        });
      }
      
      // Validate phone numbers
      if (!validatePhone(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid company phone number format. Expected 10-digit US phone number'
        });
      }
      
      if (!validatePhone(legalRepPhone)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid legal representative phone number format. Expected 10-digit US phone number'
        });
      }
      
      // Validate bank routing number if provided (9 digits)
      if (bankRoutingNumber && !/^\d{9}$/.test(bankRoutingNumber)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ABA routing number. Expected 9-digit number'
        });
      }
      
      // Validate bank account type if provided
      if (bankAccountType && !['checking', 'savings'].includes(bankAccountType.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bank account type. Expected: checking or savings'
        });
      }
      
      // Check if EIN already exists
      const existing = await prisma.partner.findUnique({
        where: { ein }
      });
      
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'A partner with this EIN is already registered'
        });
      }
      
      // Check if email already exists
      const existingEmail = await prisma.partner.findUnique({
        where: { email }
      });
      
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: 'A partner with this email is already registered'
        });
      }
      
      // Create partner
      const partner = await prisma.partner.create({
        data: {
          companyName,
          tradeName,
          ein,
          email,
          phone,
          address,
          city,
          state: state.toUpperCase(),  // Ensure uppercase
          zipCode,
          county,
          legalRepName,
          legalRepSsn,
          legalRepEmail,
          legalRepPhone,
          bankName,
          bankRoutingNumber,
          bankAccount,
          bankAccountType: bankAccountType ? bankAccountType.toLowerCase() : null,
          monthlyRevenue: monthlyRevenue ? parseFloat(monthlyRevenue) : null,
          monthlyReceivables: monthlyReceivables ? parseFloat(monthlyReceivables) : null,
          status: 'PENDING',
          flexCrediFeeRate: 0.03  // 3% default
        }
      });
      
      console.log(`[PartnersController] Partner created: ${partner.id} - ${companyName} (EIN: ${ein})`);
      
      // Emit event
      EventBus.emitAsync('partner.created', { partnerId: partner.id });
      
      res.status(201).json({
        success: true,
        message: 'Partner registered successfully! Awaiting approval.',
        data: partner
      });
      
    } catch (error) {
      console.error('[PartnersController] Error creating partner:', error);
      
      // Handle unique constraint violations
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'A partner with this information already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to register partner',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * List partners with filters
   * GET /api/partners?status=APPROVED&limit=50
   */
  async list(req, res) {
    try {
      const {
        status,
        limit = 50,
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
      
      const where = {};
      
      if (status) {
        where.status = status.toUpperCase();
      }
      
      const [partners, total] = await Promise.all([
        prisma.partner.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          take: parseInt(limit),
          skip: parseInt(offset),
          include: {
            _count: {
              select: {
                applications: true,
                receivables: true
              }
            }
          }
        }),
        prisma.partner.count({ where })
      ]);
      
      res.json({
        success: true,
        data: partners,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < total
        }
      });
      
    } catch (error) {
      console.error('[PartnersController] Error listing partners:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list partners',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get partner details
   * GET /api/partners/:id
   */
  async get(req, res) {
    try {
      const { id } = req.params;
      
      const partner = await prisma.partner.findUnique({
        where: { id },
        include: {
          applications: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          receivables: {
            orderBy: { dueDate: 'asc' },
            where: {
              status: { in: ['SCHEDULED', 'PROCESSING'] }
            }
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          documents: true,
          _count: {
            select: {
              applications: true,
              receivables: true,
              payments: true
            }
          }
        }
      });
      
      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partner not found'
        });
      }
      
      res.json({
        success: true,
        data: partner
      });
      
    } catch (error) {
      console.error('[PartnersController] Error getting partner:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve partner',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Approve partner
   * PUT /api/partners/:id/approve
   */
  async approve(req, res) {
    try {
      const { id } = req.params;
      const { creditLimit, adminId } = req.body;
      
      // Validate credit limit if provided
      if (creditLimit) {
        const limit = parseFloat(creditLimit);
        if (isNaN(limit) || limit <= 0) {
          return res.status(400).json({
            success: false,
            error: 'Invalid credit limit. Must be a positive number'
          });
        }
        
        if (limit > 10000000) {  // $10M max
          return res.status(400).json({
            success: false,
            error: 'Credit limit cannot exceed $10,000,000'
          });
        }
      }
      
      const partner = await prisma.partner.findUnique({
        where: { id }
      });
      
      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partner not found'
        });
      }
      
      if (partner.status === 'APPROVED') {
        return res.status(400).json({
          success: false,
          error: 'Partner has already been approved'
        });
      }
      
      const updated = await prisma.partner.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: adminId || 'system',
          creditLimit: creditLimit ? parseFloat(creditLimit) : null
        }
      });
      
      console.log(`[PartnersController] Partner approved: ${id} - ${partner.companyName} (Credit Limit: $${creditLimit || 'N/A'})`);
      
      EventBus.emitAsync('partner.approved', { partnerId: id });
      
      res.json({
        success: true,
        message: 'Partner approved successfully!',
        data: updated
      });
      
    } catch (error) {
      console.error('[PartnersController] Error approving partner:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to approve partner',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Reject partner
   * PUT /api/partners/:id/reject
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
      
      const partner = await prisma.partner.findUnique({
        where: { id }
      });
      
      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partner not found'
        });
      }
      
      const updated = await prisma.partner.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectionReason
        }
      });
      
      console.log(`[PartnersController] Partner rejected: ${id} - ${partner.companyName} - Reason: ${rejectionReason}`);
      
      EventBus.emitAsync('partner.rejected', { partnerId: id, reason: rejectionReason });
      
      res.json({
        success: true,
        message: 'Partner rejected',
        data: updated
      });
      
    } catch (error) {
      console.error('[PartnersController] Error rejecting partner:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject partner',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Update partner information
   * PUT /api/partners/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Remove fields that should not be updated directly
      delete updateData.id;
      delete updateData.ein;           // EIN should not change
      delete updateData.status;
      delete updateData.approvedAt;
      delete updateData.approvedBy;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      // Validate state if being updated
      if (updateData.state && !validateState(updateData.state)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid US state code. Expected 2-letter abbreviation'
        });
      }
      
      // Validate ZIP code if being updated
      if (updateData.zipCode && !validateZipCode(updateData.zipCode)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ZIP code format. Expected: 12345 or 12345-6789'
        });
      }
      
      // Validate routing number if being updated
      if (updateData.bankRoutingNumber && !/^\d{9}$/.test(updateData.bankRoutingNumber)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ABA routing number. Expected 9-digit number'
        });
      }
      
      const updated = await prisma.partner.update({
        where: { id },
        data: updateData
      });
      
      console.log(`[PartnersController] Partner updated: ${id}`);
      
      res.json({
        success: true,
        message: 'Partner information updated successfully',
        data: updated
      });
      
    } catch (error) {
      console.error('[PartnersController] Error updating partner:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Partner not found'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to update partner',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new PartnersController();

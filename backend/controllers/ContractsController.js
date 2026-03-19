/**
 * FLEXCREDI LLC - Contracts Controller (US Market)
 * Manages loan contracts: generation, listing, download
 * Florida-based Personal Loan Agreements
 */

const { PrismaClient } = require('@prisma/client');
const ContractGenerator = require('../utils/ContractGenerator');
const EventBus = require('../core/EventBus');
const prisma = new PrismaClient();

class ContractsController {
  
  /**
   * Generate new loan contract
   * POST /api/contracts/generate
   * 
   * Body:
   * - applicationId: string (required)
   * - effectiveDate: string (optional, format: YYYY-MM-DD)
   */
  async generate(req, res) {
    try {
      const { applicationId, effectiveDate } = req.body;
      
      // Validation
      if (!applicationId) {
        return res.status(400).json({
          success: false,
          error: 'Application ID is required'
        });
      }
      
      // Check if application exists and is approved
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          user: true,
          partner: true
        }
      });
      
      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }
      
      if (application.status !== 'APPROVED') {
        return res.status(400).json({
          success: false,
          error: 'Application must be approved before generating contract',
          currentStatus: application.status
        });
      }
      
      // Check if contract already exists for this application
      const existingContract = await prisma.contract.findUnique({
        where: { applicationId }
      });
      
      if (existingContract) {
        return res.status(409).json({
          success: false,
          error: 'Contract already exists for this application',
          contractId: existingContract.id,
          contractNumber: existingContract.contractNumber
        });
      }
      
      console.log(`[ContractsController] Generating contract for application: ${applicationId}`);
      
      // Parse effective date
      const effective = effectiveDate ? new Date(effectiveDate) : new Date();
      
      // Generate contract
      const contractData = await ContractGenerator.generateAndSave(applicationId, effective);
      
      // Save to database
      const contract = await prisma.contract.create({
        data: {
          applicationId,
          contractNumber: contractData.contractNumber,
          principalAmount: application.approvedAmount,
          interestRate: application.interestRate,
          termMonths: application.termMonths,
          monthlyPayment: application.monthlyPayment,
          totalAmount: application.monthlyPayment * application.termMonths,
          status: 'GENERATED',
          generatedAt: new Date(),
          documentHash: contractData.hash,
          documentPath: contractData.relativePath,
          documentSize: contractData.size
        },
        include: {
          application: {
            include: {
              user: true,
              partner: true
            }
          }
        }
      });
      
      console.log(`[ContractsController] Contract created: ${contract.id}`);
      
      // Emitir evento
      EventBus.emit('contract:generated', {
        contractId: contract.id,
        applicationId,
        contractNumber: contract.contractNumber
      });
      
      res.status(201).json({
        success: true,
        message: 'Contract generated successfully',
        data: {
          id: contract.id,
          contractNumber: contract.contractNumber,
          status: contract.status,
          principalAmount: contract.principalAmount,
          interestRate: contract.interestRate,
          termMonths: contract.termMonths,
          monthlyPayment: contract.monthlyPayment,
          totalAmount: contract.totalAmount,
          generatedAt: contract.generatedAt,
          downloadUrl: `/api/contracts/${contract.id}/download`,
          application: {
            id: application.id,
            clientName: application.clientName,
            clientEmail: application.clientEmail
          },
          partner: {
            id: application.partner.id,
            companyName: application.partner.companyName
          }
        }
      });
      
    } catch (error) {
      console.error('[ContractsController] Error generating contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate contract',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Listar contratos
   * GET /api/contracts
   * 
   * Query params:
   * - status: GENERATED | SENT | SIGNED | ACTIVE | COMPLETED | CANCELLED
   * - applicationId: filtrar por aplicação
   * - partnerId: filtrar por parceiro
   * - limit: limite de registros (default: 50, max: 100)
   * - offset: offset para paginação (default: 0)
   */
  async list(req, res) {
    try {
      const {
        status,
        applicationId,
        partnerId,
        limit = 50,
        offset = 0
      } = req.query;
      
      // Construir filtros
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (applicationId) {
        where.applicationId = applicationId;
      }
      
      if (partnerId) {
        where.application = {
          partnerId
        };
      }
      
      // Contar total
      const total = await prisma.contract.count({ where });
      
      // Buscar contratos
      const contracts = await prisma.contract.findMany({
        where,
        take: Math.min(parseInt(limit), 100),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
        include: {
          application: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              partner: {
                select: {
                  id: true,
                  companyName: true,
                  tradeName: true
                }
              }
            }
          }
        }
      });
      
      res.json({
        success: true,
        data: contracts.map(contract => ({
          id: contract.id,
          contractNumber: contract.contractNumber,
          status: contract.status,
          principalAmount: contract.principalAmount,
          interestRate: contract.interestRate,
          termMonths: contract.termMonths,
          monthlyPayment: contract.monthlyPayment,
          totalAmount: contract.totalAmount,
          generatedAt: contract.generatedAt,
          sentAt: contract.sentAt,
          signedAt: contract.signedAt,
          activatedAt: contract.activatedAt,
          application: {
            id: contract.application.id,
            clientName: contract.application.clientName,
            clientEmail: contract.application.clientEmail
          },
          partner: contract.application.partner,
          user: contract.application.user,
          downloadUrl: `/api/contracts/${contract.id}/download`
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit)
        }
      });
      
    } catch (error) {
      console.error('[ContractsController] Error listing contracts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list contracts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Obter detalhes de um contrato
   * GET /api/contracts/:id
   */
  async get(req, res) {
    try {
      const { id } = req.params;
      
      const contract = await prisma.contract.findUnique({
        where: { id },
        include: {
          application: {
            include: {
              user: true,
              partner: true,
              creditReport: true
            }
          }
        }
      });
      
      if (!contract) {
        return res.status(404).json({
          success: false,
          error: 'Contract not found'
        });
      }
      
      res.json({
        success: true,
        data: {
          ...contract,
          downloadUrl: `/api/contracts/${contract.id}/download`,
          previewUrl: `/api/contracts/${contract.id}/preview`
        }
      });
      
    } catch (error) {
      console.error('[ContractsController] Error getting contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get contract',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Download de contrato (DOCX)
   * GET /api/contracts/:id/download
   */
  async download(req, res) {
    try {
      const { id } = req.params;
      
      const contract = await prisma.contract.findUnique({
        where: { id }
      });
      
      if (!contract) {
        return res.status(404).json({
          success: false,
          error: 'Contract not found'
        });
      }
      
      // Ler arquivo do disco
      const fileName = contract.documentPath.split('/').pop();
      const buffer = ContractGenerator.readContract(fileName);
      
      // Verificar integridade
      const isValid = ContractGenerator.verifyIntegrity(buffer, contract.documentHash);
      
      if (!isValid) {
        console.error('[ContractsController] Contract integrity check failed!');
        return res.status(500).json({
          success: false,
          error: 'Contract file integrity check failed'
        });
      }
      
      // Enviar arquivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', buffer.length);
      
      res.send(buffer);
      
      console.log(`[ContractsController] Contract downloaded: ${contract.contractNumber}`);
      
    } catch (error) {
      console.error('[ContractsController] Error downloading contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download contract',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Deletar contrato (apenas GENERATED)
   * DELETE /api/contracts/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const contract = await prisma.contract.findUnique({
        where: { id }
      });
      
      if (!contract) {
        return res.status(404).json({
          success: false,
          error: 'Contract not found'
        });
      }
      
      // Só pode deletar se status for GENERATED
      if (contract.status !== 'GENERATED') {
        return res.status(400).json({
          success: false,
          error: 'Can only delete contracts with status GENERATED',
          currentStatus: contract.status
        });
      }
      
      // Deletar do banco
      await prisma.contract.delete({
        where: { id }
      });
      
      console.log(`[ContractsController] Contract deleted: ${contract.contractNumber}`);
      
      res.json({
        success: true,
        message: 'Contract deleted successfully'
      });
      
    } catch (error) {
      console.error('[ContractsController] Error deleting contract:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete contract',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ContractsController();

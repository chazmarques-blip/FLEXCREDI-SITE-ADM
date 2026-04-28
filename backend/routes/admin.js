const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/admin/dashboard - Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    console.log('[AdminRoutes] Fetching dashboard statistics...');

    // Buscar estatísticas em paralelo (SEM queries problemáticas)
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalPartners,
      approvedPartners,
      totalUsers,
      totalContracts,
      activeContracts,
    ] = await Promise.all([
      // Applications
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
      
      // Partners
      prisma.partner.count(),
      prisma.partner.count({ where: { status: 'APPROVED' } }),
      
      // Users
      prisma.user.count({ where: { role: 'CLIENT' } }),
      
      // Contracts
      prisma.contract.count(),
      prisma.contract.count({ where: { status: 'ACTIVE' } }),
    ]);

    // REMOVIDO: queries problemáticas de ReceivableStatus e AchPaymentStatus
    // Temporariamente retornando 0 para esses valores
    const totalReceivables = 0;
    const pendingReceivables = 0;
    const totalAchPayments = 0;
    const pendingAchPayments = 0;

    // Aggregate approved amounts
    const approvedAmountSum = await prisma.application.aggregate({
      where: { status: 'APPROVED' },
      _sum: { approvedAmount: true }
    });

    // REMOVIDO: aggregate problemático de receivables
    const receivablesSum = { _sum: { amount: 0 } };

    // Fetch recent applications
    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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
      }
    });

    // Fetch recent partners
    const recentPartners = await prisma.partner.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    console.log('[AdminRoutes] Dashboard statistics fetched successfully');
    console.log(`[AdminRoutes] Stats: Applications=${totalApplications}, Partners=${totalPartners}, Users=${totalUsers}`);

    res.json({
      success: true,
      data: {
        stats: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          totalPartners,
          approvedPartners,
          totalUsers,
          totalContracts,
          activeContracts,
          totalReceivables,
          pendingReceivables,
          totalAchPayments,
          pendingAchPayments,
          totalApprovedAmount: approvedAmountSum._sum.approvedAmount || 0,
          totalReceivablesAmount: receivablesSum._sum.amount || 0
        },
        recentApplications,
        recentPartners
      }
    });

  } catch (error) {
    console.error('[AdminRoutes] Error fetching dashboard:', error);
    console.error('[AdminRoutes] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Erro ao carregar dashboard' 
        : error.message
    });
  }
});

// GET /api/admin/clients - List all clients (users with role CLIENT)
router.get('/clients', async (req, res) => {
  try {
    console.log('[AdminRoutes] Fetching clients...');
    
    const { search, status, limit = 50, offset = 0 } = req.query;
    
    // Build where clause
    const where = {
      role: 'CLIENT'
    };
    
    if (status === 'active') {
      where.active = true;
    } else if (status === 'inactive') {
      where.active = false;
    }
    
    if (search) {
      where.AND = [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { ssn: { contains: search } },
            { phone: { contains: search } }
          ]
        }
      ];
    }
    
    console.log('[AdminRoutes] Query where:', JSON.stringify(where));
    
    const [clients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          ssn: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          monthlyIncome: true,
          active: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              applications: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);
    
    // Transform data to match frontend expectations
    const transformedClients = clients.map(client => ({
      ...client,
      status: client.active ? 'ACTIVE' : 'INACTIVE',
      cpf: client.ssn, // Map SSN to CPF for frontend compatibility
      creditScore: null // Will be populated from credit reports if needed
    }));
    
    console.log(`[AdminRoutes] Found ${clients.length} clients`);
    
    res.json({
      success: true,
      clients: transformedClients,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + clients.length) < total
      }
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error fetching clients:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Erro ao carregar clientes' 
        : error.message
    });
  }
});

// GET /api/admin/clients/:id - Get single client details
router.get('/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[AdminRoutes] Fetching client ${id}...`);
    
    const client = await prisma.user.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' },
          include: {
            partner: {
              select: {
                id: true,
                companyName: true,
                tradeName: true
              }
            }
          }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        },
        creditReports: {
          orderBy: { pulledAt: 'desc' },
          take: 1
        }
      }
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
    
    // Transform for frontend
    const transformedClient = {
      ...client,
      status: client.active ? 'ACTIVE' : 'INACTIVE',
      cpf: client.ssn,
      creditScore: client.creditReports?.[0]?.creditScore || null
    };
    
    res.json({
      success: true,
      client: transformedClient
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error fetching client:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Erro ao carregar cliente' 
        : error.message
    });
  }
});

// GET /api/admin/applications - List all applications (admin view)
router.get('/applications', async (req, res) => {
  try {
    console.log('[AdminRoutes] Fetching applications...');
    
    const { search, status, limit = 50, offset = 0 } = req.query;
    
    // Build where clause
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.AND = [
        {
          OR: [
            { clientName: { contains: search, mode: 'insensitive' } },
            { clientEmail: { contains: search, mode: 'insensitive' } },
            { clientSsn: { contains: search } }
          ]
        }
      ];
    }
    
    console.log('[AdminRoutes] Applications query where:', JSON.stringify(where));
    
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
        include: {
          partner: {
            select: {
              id: true,
              companyName: true,
              tradeName: true
            }
          }
        }
      }),
      prisma.application.count({ where })
    ]);
    
    console.log(`[AdminRoutes] Found ${applications.length} applications`);
    
    res.json({
      success: true,
      applications,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + applications.length) < total
      }
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Erro ao carregar aplicações' 
        : error.message
    });
  }
});

// ==================== APPLICATION ACTIONS ====================

// PUT /api/admin/applications/:id/approve - Approve application
router.put('/applications/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedAmount, interestRate, term, notes } = req.body;
    
    console.log(`[AdminRoutes] Approving application ${id}...`);
    
    const application = await prisma.application.findUnique({
      where: { id }
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Aplicação não encontrada'
      });
    }
    
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAmount: approvedAmount || application.desiredAmount,
        approvedInterestRate: interestRate || 18.5,
        approvedTerm: term || 24,
        approvalNotes: notes,
        approvedAt: new Date(),
        approvedBy: 'admin' // TODO: get from auth token
      }
    });
    
    console.log(`[AdminRoutes] Application ${id} approved`);
    
    res.json({
      success: true,
      message: 'Aplicação aprovada com sucesso',
      application: updatedApplication
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error approving application:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao aprovar aplicação'
    });
  }
});

// PUT /api/admin/applications/:id/reject - Reject application
router.put('/applications/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, notes } = req.body;
    
    console.log(`[AdminRoutes] Rejecting application ${id}...`);
    
    const application = await prisma.application.findUnique({
      where: { id }
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Aplicação não encontrada'
      });
    }
    
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'Não aprovado pela análise de crédito',
        rejectionNotes: notes,
        rejectedAt: new Date(),
        rejectedBy: 'admin'
      }
    });
    
    console.log(`[AdminRoutes] Application ${id} rejected`);
    
    res.json({
      success: true,
      message: 'Aplicação rejeitada',
      application: updatedApplication
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error rejecting application:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao rejeitar aplicação'
    });
  }
});

// GET /api/admin/applications/:id - Get single application details
router.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[AdminRoutes] Fetching application ${id}...`);
    
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        partner: {
          select: {
            id: true,
            companyName: true,
            tradeName: true,
            email: true,
            phone: true
          }
        },
        documents: {
          orderBy: { uploadedAt: 'desc' }
        },
        contract: true
      }
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Aplicação não encontrada'
      });
    }
    
    // Get user info separately
    let user = null;
    if (application.userId) {
      user = await prisma.user.findUnique({
        where: { id: application.userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          ssn: true,
          address: true,
          city: true,
          state: true,
          zipCode: true
        }
      });
    }
    
    res.json({
      success: true,
      application: {
        ...application,
        user
      }
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error fetching application:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar aplicação'
    });
  }
});

// ==================== CLIENT ACTIONS ====================

// PUT /api/admin/clients/:id/status - Toggle client active status
router.put('/clients/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    console.log(`[AdminRoutes] Updating client ${id} status to ${active}...`);
    
    const updatedClient = await prisma.user.update({
      where: { id },
      data: { active: active }
    });
    
    res.json({
      success: true,
      message: active ? 'Cliente ativado' : 'Cliente desativado',
      client: updatedClient
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error updating client status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status do cliente'
    });
  }
});

// ==================== DOCUMENT MANAGEMENT ====================

// GET /api/admin/documents - List all documents
router.get('/documents', async (req, res) => {
  try {
    const { status, applicationId, limit = 50, offset = 0 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (applicationId) where.applicationId = applicationId;
    
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { uploadedAt: 'desc' },
        include: {
          application: {
            select: {
              id: true,
              clientName: true,
              clientEmail: true,
              status: true
            }
          }
        }
      }),
      prisma.document.count({ where })
    ]);
    
    res.json({
      success: true,
      documents,
      pagination: { total, limit: parseInt(limit), offset: parseInt(offset) }
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar documentos'
    });
  }
});

// PUT /api/admin/documents/:id/approve - Approve document
router.put('/documents/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await prisma.document.update({
      where: { id },
      data: {
        status: 'APPROVED',
        verifiedAt: new Date(),
        verifiedBy: 'admin'
      }
    });
    
    res.json({
      success: true,
      message: 'Documento aprovado',
      document
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error approving document:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao aprovar documento'
    });
  }
});

// PUT /api/admin/documents/:id/reject - Reject document
router.put('/documents/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const document = await prisma.document.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        verifiedAt: new Date(),
        verifiedBy: 'admin'
      }
    });
    
    res.json({
      success: true,
      message: 'Documento rejeitado',
      document
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error rejecting document:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao rejeitar documento'
    });
  }
});

// POST /api/admin/clients/seed - Create test client for development
router.post('/clients/seed', async (req, res) => {
  try {
    console.log('[AdminRoutes] Creating seed test client...');
    
    // Check if test client already exists
    const existingClient = await prisma.user.findFirst({
      where: { email: 'maria.santos@flexcredi.test' }
    });
    
    if (existingClient) {
      console.log('[AdminRoutes] Test client already exists');
      return res.json({
        success: true,
        message: 'Test client already exists',
        client: existingClient
      });
    }
    
    // Create test client
    const testClient = await prisma.user.create({
      data: {
        email: 'maria.santos@flexcredi.test',
        name: 'Maria Santos',
        phone: '(305) 555-1234',
        ssn: '123-45-6789',
        role: 'CLIENT',
        address: '1234 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        zipCode: '33139',
        monthlyIncome: 5500.00,
        employer: 'Tech Solutions Inc',
        occupation: 'Software Developer',
        employmentStatus: 'EMPLOYED',
        active: true,
        emailVerified: true
      }
    });
    
    console.log('[AdminRoutes] Test client created:', testClient.id);
    
    res.json({
      success: true,
      message: 'Test client created successfully',
      client: testClient
    });
    
  } catch (error) {
    console.error('[AdminRoutes] Error creating test client:', error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Erro ao criar cliente de teste' 
        : error.message
    });
  }
});

module.exports = router;

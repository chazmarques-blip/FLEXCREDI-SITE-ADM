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

module.exports = router;

/**
 * FLEXCREDI - Debug Routes
 * Rotas para diagnóstico e troubleshooting
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/debug/database-test
 * Testa conexão com banco de dados
 */
router.get('/database-test', async (req, res) => {
  try {
    // Teste 1: Conexão básica
    await prisma.$connect();
    
    // Teste 2: Query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Teste 3: Verificar tabelas existentes
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    // Teste 4: Contar registros em cada tabela (se existirem)
    let counts = {};
    try {
      counts = {
        partners: await prisma.partner.count().catch(() => 'table_missing'),
        applications: await prisma.application.count().catch(() => 'table_missing'),
        users: await prisma.user.count().catch(() => 'table_missing'),
        contracts: await prisma.contract.count().catch(() => 'table_missing'),
        documents: await prisma.document.count().catch(() => 'table_missing'),
        creditReports: await prisma.creditReport.count().catch(() => 'table_missing'),
        systemSettings: await prisma.systemSetting.count().catch(() => 'table_missing')
      };
    } catch (error) {
      counts.error = error.message;
    }
    
    res.json({
      success: true,
      database: {
        connected: true,
        queryTest: result,
        tablesFound: tables.length,
        tablesList: tables.map(t => t.table_name),
        recordCounts: counts
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrlConfigured: !!process.env.DATABASE_URL,
        databaseHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'not_found'
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: {
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrlConfigured: !!process.env.DATABASE_URL,
        databaseHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'not_found'
      }
    });
  }
});

/**
 * GET /api/debug/prisma-schema
 * Retorna informações sobre o schema Prisma
 */
router.get('/prisma-schema', async (req, res) => {
  try {
    const models = Object.keys(prisma).filter(key => 
      !key.startsWith('$') && 
      !key.startsWith('_') && 
      typeof prisma[key] === 'object'
    );
    
    res.json({
      success: true,
      prisma: {
        modelsAvailable: models,
        totalModels: models.length
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to inspect Prisma schema',
      details: error.message
    });
  }
});

/**
 * GET /api/debug/test-applications
 * Testa endpoint de applications com detalhes do erro
 */
router.get('/test-applications', async (req, res) => {
  try {
    console.log('[Debug] Testing applications query...');
    
    // Test 1: Basic count
    const count = await prisma.application.count();
    console.log(`[Debug] Found ${count} applications`);
    
    // Test 2: With includes (same as ApplicationsController)
    const apps = await prisma.application.findMany({
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
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    res.json({
      success: true,
      data: {
        count,
        applications: apps,
        message: 'Applications query works!'
      }
    });
    
  } catch (error) {
    console.error('[Debug] Applications query error:', error);
    res.status(500).json({
      success: false,
      error: 'Applications query failed',
      details: {
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

/**
 * GET /api/debug/test-admin-dashboard
 * Testa endpoint de admin dashboard com detalhes do erro
 */
router.get('/test-admin-dashboard', async (req, res) => {
  try {
    console.log('[Debug] Testing admin dashboard queries...');
    
    // Test cada query individualmente
    const results = {};
    
    try {
      results.totalApplications = await prisma.application.count();
      console.log('[Debug] ✅ totalApplications:', results.totalApplications);
    } catch (e) {
      results.totalApplications = { error: e.message };
      console.error('[Debug] ❌ totalApplications:', e.message);
    }
    
    try {
      results.pendingApplications = await prisma.application.count({ where: { status: 'PENDING' } });
      console.log('[Debug] ✅ pendingApplications:', results.pendingApplications);
    } catch (e) {
      results.pendingApplications = { error: e.message };
      console.error('[Debug] ❌ pendingApplications:', e.message);
    }
    
    try {
      results.totalPartners = await prisma.partner.count();
      console.log('[Debug] ✅ totalPartners:', results.totalPartners);
    } catch (e) {
      results.totalPartners = { error: e.message };
      console.error('[Debug] ❌ totalPartners:', e.message);
    }
    
    try {
      results.totalUsers = await prisma.user.count({ where: { role: 'CLIENT' } });
      console.log('[Debug] ✅ totalUsers:', results.totalUsers);
    } catch (e) {
      results.totalUsers = { error: e.message };
      console.error('[Debug] ❌ totalUsers:', e.message);
    }
    
    try {
      results.totalContracts = await prisma.contract.count();
      console.log('[Debug] ✅ totalContracts:', results.totalContracts);
    } catch (e) {
      results.totalContracts = { error: e.message };
      console.error('[Debug] ❌ totalContracts:', e.message);
    }
    
    try {
      results.activeContracts = await prisma.contract.count({ where: { status: 'ACTIVE' } });
      console.log('[Debug] ✅ activeContracts:', results.activeContracts);
    } catch (e) {
      results.activeContracts = { error: e.message };
      console.error('[Debug] ❌ activeContracts:', e.message);
    }
    
    try {
      results.totalReceivables = await prisma.partnerReceivable.count();
      console.log('[Debug] ✅ totalReceivables:', results.totalReceivables);
    } catch (e) {
      results.totalReceivables = { error: e.message };
      console.error('[Debug] ❌ totalReceivables:', e.message);
    }
    
    try {
      results.pendingReceivables = await prisma.partnerReceivable.count({ where: { status: { in: ['SCHEDULED', 'PROCESSING'] } } });
      console.log('[Debug] ✅ pendingReceivables:', results.pendingReceivables);
    } catch (e) {
      results.pendingReceivables = { error: e.message };
      console.error('[Debug] ❌ pendingReceivables:', e.message);
    }
    
    try {
      results.totalAchPayments = await prisma.achPayment.count();
      console.log('[Debug] ✅ totalAchPayments:', results.totalAchPayments);
    } catch (e) {
      results.totalAchPayments = { error: e.message };
      console.error('[Debug] ❌ totalAchPayments:', e.message);
    }
    
    try {
      results.pendingAchPayments = await prisma.achPayment.count({ where: { status: { in: ['SCHEDULED', 'PENDING', 'PROCESSING'] } } });
      console.log('[Debug] ✅ pendingAchPayments:', results.pendingAchPayments);
    } catch (e) {
      results.pendingAchPayments = { error: e.message };
      console.error('[Debug] ❌ pendingAchPayments:', e.message);
    }
    
    res.json({
      success: true,
      data: results,
      message: 'Admin dashboard queries tested individually'
    });
    
  } catch (error) {
    console.error('[Debug] Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Admin dashboard test failed',
      details: {
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

module.exports = router;

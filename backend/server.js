/**
 * FLEXCREDI - Backend Server (v4.0)
 * API REST para o sistema administrativo com suporte completo a:
 * - Cadastro e aprovação de parceiros
 * - Gestão de aplicações de crédito
 * - Análise de crédito automatizada (AgentCreditAnalyzer)
 * - Dashboard admin com estatísticas
 * - EventBus para comunicação entre agentes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importar rotas
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const partnersRoutes = require('./routes/partners');
const applicationsRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');
const contractsRoutes = require('./routes/contracts');
const documentsRoutes = require('./routes/documents');
const debugRoutes = require('./routes/debug');
const testDataRoutes = require('./routes/test-data');
const clientAuthRoutes = require('./routes/client-auth');

// Importar e inicializar agentes autônomos
const AgentCreditAnalyzer = require('./agents/AgentCreditAnalyzer');
const AgentDocumentChecker = require('./agents/AgentDocumentChecker');

// Register agents as global singletons (already instantiated in their modules)
global.creditAnalyzer = AgentCreditAnalyzer;
global.documentChecker = AgentDocumentChecker;

// Configurações
const PORT = process.env.PORT || 8080;
const app = express();

// ==================== MIDDLEWARES ====================

// Segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - Configuração expandida para aceitar múltiplas origens
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'https://8000-i4envvcychumgfxyp0ccs-2e77fc33.sandbox.novita.ai',
  'https://web-production-e227.up.railway.app',
  'https://admin.flexcredi.com',
  'https://flexcredi.com',
  'https://www.flexcredi.com',
  /https:\/\/.*\.vercel\.app$/,
  /https:\/\/.*\.sandbox\.novita\.ai$/,
  /https:\/\/.*\.preview\.emergentagent\.com$/
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Verificar se a origin está na lista de permitidas
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - prevenir abuso
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // máximo de 500 requisições por IP (aumentado para desenvolvimento)
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use('/api/', limiter);

// ==================== ROTAS ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '4.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      partners: 'enabled',
      applications: 'enabled',
      creditAnalysis: 'enabled',
      agents: 'enabled',
      eventBus: 'enabled'
    }
  });
});

// Root endpoint com documentação
app.get('/', (req, res) => {
  res.json({
    name: 'FLEXCREDI Admin API',
    version: '4.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    documentation: {
      partners: {
        description: 'Gestão de parceiros',
        endpoints: [
          'POST /api/partners - Cadastrar novo parceiro',
          'GET /api/partners - Listar parceiros (com filtros)',
          'GET /api/partners/:id - Obter detalhes do parceiro',
          'PUT /api/partners/:id - Atualizar parceiro',
          'PUT /api/partners/:id/approve - Aprovar parceiro',
          'PUT /api/partners/:id/reject - Rejeitar parceiro'
        ]
      },
      applications: {
        description: 'Gestão de aplicações de crédito',
        endpoints: [
          'POST /api/applications - Criar nova aplicação',
          'GET /api/applications - Listar aplicações (com filtros)',
          'GET /api/applications/:id - Obter detalhes da aplicação',
          'PUT /api/applications/:id/approve - Aprovar aplicação',
          'PUT /api/applications/:id/reject - Rejeitar aplicação'
        ]
      },
      admin: {
        description: 'Rotas administrativas',
        endpoints: [
          'GET /api/admin/dashboard - Estatísticas gerais',
          'GET /api/admin/stats/monthly - Estatísticas mensais',
          'GET /api/admin/system-settings - Configurações do sistema',
          'PUT /api/admin/system-settings/:key - Atualizar configuração'
        ]
      },
      test: {
        endpoints: [
          'GET /api/test - Teste simples',
          'GET /health - Health check'
        ]
      }
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API FLEXCREDI v4.0 está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// ==================== ROTAS DE MÓDULOS ====================
// Registrar rotas dos módulos
app.use('/api/admin', authRoutes); // AUTH routes (login, logout, verify)
app.use('/api/client/auth', clientAuthRoutes); // CLIENT AUTH routes
app.use('/api/public', publicRoutes); // PUBLIC routes (no auth required)
app.use('/api/partners', partnersRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/test-data', testDataRoutes);

// ==================== ERROR HANDLERS ====================

// 404 - Rota não encontrada
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  
  // Erro de CORS
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'Origin não permitida'
    });
  }
  
  // Erro genérico
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== START SERVER ====================

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     FLEXCREDI ADMIN API v4.0 - SERVIDOR INICIADO         ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🌐 Servidor rodando em: http://0.0.0.0:${PORT}           ║
║  🏥 Health check: http://0.0.0.0:${PORT}/health            ║
║  🧪 Test endpoint: http://0.0.0.0:${PORT}/api/test         ║
║  📊 Dashboard: http://0.0.0.0:${PORT}/api/admin/dashboard  ║
║                                                           ║
║  📦 Módulos habilitados:                                  ║
║     ✓ Partners (cadastro e aprovação)                    ║
║     ✓ Applications (criação e análise)                   ║
║     ✓ Contracts (geração DOCX)                           ║
║     ✓ Documents (upload e validação)                     ║
║     ✓ Admin (dashboard e estatísticas)                   ║
║     ✓ AgentCreditAnalyzer (análise de crédito)           ║
║     ✓ AgentDocumentChecker (validação de documentos)     ║
║     ✓ EventBus (comunicação entre agentes)               ║
║                                                           ║
║  🔒 Segurança:                                            ║
║     ✓ Helmet (headers seguros)                           ║
║     ✓ CORS (origens configuradas)                        ║
║     ✓ Rate limiting (500 req/15min)                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  
  console.log('📝 Logs habilitados: morgan (combined)');
  console.log('🗄️  Database: PostgreSQL via Prisma');
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando servidor...');
  if (server) {
    server.close(() => {
      console.log('Servidor encerrado.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

module.exports = app;

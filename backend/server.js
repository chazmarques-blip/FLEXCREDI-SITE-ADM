// FLEXCREDI BACKEND - SERVIDOR PRINCIPAL
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE DE SEGURANÇA
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  credentials: true
}));

// RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }
});
app.use('/api/', limiter);

// LOGGING
app.use(morgan('combined'));

// PARSING
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ROTA INICIAL
app.get('/', (req, res) => {
  res.json({
    message: 'FLEXCREDI Admin Backend API',
    version: '1.0.0',
    status: 'Online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      applications: '/api/applications',
      users: '/api/users'
    }
  });
});

// ROTAS BÁSICAS (vamos expandir depois)
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando perfeitamente!',
    timestamp: new Date().toISOString()
  });
});

// ROTA DASHBOARD - Estatísticas
app.get('/api/dashboard', (req, res) => {
  res.json({
    stats: {
      totalApplications: 156,
      pendingApplications: 23,
      approvedApplications: 98,
      rejectedApplications: 35,
      totalUsers: 142,
      activeUsers: 89,
      totalAmount: 2850000,
      averageAmount: 18269
    },
    recentApplications: [
      {
        id: 'app_001',
        name: 'Maria Silva',
        amount: 15000,
        status: 'pending',
        date: new Date().toISOString()
      },
      {
        id: 'app_002',
        name: 'João Santos',
        amount: 25000,
        status: 'approved',
        date: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    systemStatus: {
      database: 'online',
      api: 'online',
      creditBureau: 'online'
    }
  });
});

// ROTA APLICAÇÕES - Listar
app.get('/api/applications', (req, res) => {
  const mockApplications = [
    {
      id: 'app_001',
      name: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      phone: '(11) 99999-1234',
      cpf: '123.456.789-01',
      desiredAmount: 15000,
      purpose: 'Expansão do negócio',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'app_002',
      name: 'João Santos Oliveira',
      email: 'joao.santos@email.com',
      phone: '(11) 99999-5678',
      cpf: '987.654.321-09',
      desiredAmount: 25000,
      purpose: 'Quitação de dívidas',
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  res.json({
    applications: mockApplications,
    total: mockApplications.length,
    success: true
  });
});

// ROTA APLICAÇÕES - Criar Nova
app.post('/api/applications', (req, res) => {
  const { name, email, phone, cpf, desiredAmount, purpose } = req.body;
  
  // Validação básica
  if (!name || !email || !phone || !cpf || !desiredAmount || !purpose) {
    return res.status(400).json({
      error: 'Todos os campos são obrigatórios',
      required: ['name', 'email', 'phone', 'cpf', 'desiredAmount', 'purpose']
    });
  }

  // Simular criação da aplicação
  const newApplication = {
    id: `app_${Date.now()}`,
    name,
    email,
    phone,
    cpf,
    desiredAmount: parseFloat(desiredAmount),
    purpose,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    message: 'Aplicação criada com sucesso!',
    application: newApplication,
    success: true
  });
});

// MIDDLEWARE DE ERRO GLOBAL
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// ROTA 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`
🚀 FLEXCREDI BACKEND INICIADO!
📍 URL: http://localhost:${PORT}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
⏰ Horário: ${new Date().toLocaleString()}
📊 Health Check: http://localhost:${PORT}/health
🧪 Teste API: http://localhost:${PORT}/api/test
  `);
});

module.exports = app;
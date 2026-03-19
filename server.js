// FLEXCREDI BACKEND - SERVIDOR PRINCIPAL
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE DE SEGURANÇA
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - PRODUÇÃO E DESENVOLVIMENTO
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000', 
  'http://localhost:8001',
  process.env.FRONTEND_URL || 'https://flexcredi.vercel.app',
  'https://flexcredi-admin.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// LOGGING
app.use(morgan('combined'));

// PARSING
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ROTA INICIAL
app.get('/', (req, res) => {
  res.json({
    message: 'FLEXCREDI Backend API',
    version: '1.0.0',
    status: 'Online',
    timestamp: new Date().toISOString(),
    endpoints: {
      root: '/',
      dashboard: '/api/dashboard',
      applications: '/api/applications'
    }
  });
});

// ROTA DASHBOARD - Estatísticas
app.get('/api/dashboard', (req, res) => {
  res.json({
    success: true,
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
        name: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        amount: 15000,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: 'app_002',
        name: 'João Santos Oliveira',
        email: 'joao.santos@email.com',
        amount: 25000,
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  });
});

// Lista de aplicações (simulada)
let applications = [
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

// ROTA APLICAÇÕES - Listar
app.get('/api/applications', (req, res) => {
  res.json({
    success: true,
    data: applications,
    count: applications.length
  });
});

// ROTA APLICAÇÕES - Criar Nova
app.post('/api/applications', (req, res) => {
  const { name, email, phone, cpf, desiredAmount, purpose } = req.body;
  
  // Validação básica
  if (!name || !email || !desiredAmount) {
    return res.status(400).json({
      success: false,
      error: 'Campos obrigatórios: name, email, desiredAmount'
    });
  }

  // Criar nova aplicação
  const newApplication = {
    id: `app_${Date.now()}`,
    name,
    email,
    phone: phone || 'Não informado',
    cpf: cpf || 'Não informado',
    desiredAmount: parseFloat(desiredAmount),
    purpose: purpose || 'Não especificado',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Adicionar à lista
  applications.push(newApplication);

  res.status(201).json({
    success: true,
    message: 'Aplicação criada com sucesso!',
    application: newApplication
  });
});

// MIDDLEWARE DE ERRO
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    timestamp: new Date().toISOString()
  });
});

// ROTA 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
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
📊 Endpoints disponíveis:
   GET  /                    - Informações da API
   GET  /api/dashboard       - Estatísticas
   GET  /api/applications    - Listar aplicações
   POST /api/applications    - Criar aplicação
  `);
});

module.exports = app;
// MIDDLEWARE DE AUTENTICAÇÃO
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// VERIFICAR JWT TOKEN
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso necessário',
        code: 'NO_TOKEN'
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Token inválido ou usuário inativo',
        code: 'INVALID_TOKEN'
      });
    }

    // Adicionar usuário ao request
    req.user = user;
    next();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    res.status(500).json({
      error: 'Erro interno de autenticação'
    });
  }
};

// VERIFICAR PERMISSÕES DE ROLE
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticação necessária'
      });
    }

    // Se não especificar roles, qualquer usuário autenticado pode acessar
    if (roles.length === 0) {
      return next();
    }

    // Verificar se o usuário tem a role necessária
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Permissão insuficiente',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// MIDDLEWARE OPCIONAL (não bloqueia se não houver token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true
        }
      });

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continua sem usuário se houver erro
    next();
  }
};

module.exports = {
  verifyToken,
  requireRole,
  optionalAuth
};
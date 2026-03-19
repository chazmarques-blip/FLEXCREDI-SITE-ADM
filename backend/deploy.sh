#!/bin/bash
# Script de deploy automático para Railway
# Roda antes do servidor iniciar

echo "🚀 Iniciando processo de deploy..."

# 1. Gerar Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate

# 2. Rodar migrations
echo "🗄️ Executando migrations do banco de dados..."
npx prisma db push --accept-data-loss

# 3. Verificar conexão com o banco
echo "🔍 Verificando conexão com banco..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    await prisma.\$connect();
    console.log('✅ Banco de dados conectado!');
    
    const tables = await prisma.\$queryRaw\`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    \`;
    console.log('📊 Tabelas criadas:', tables.length);
    
    await prisma.\$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

check();
"

echo "✅ Deploy script completo!"

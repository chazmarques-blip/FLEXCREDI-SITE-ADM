#!/bin/bash

# Script para rodar migrations no Railway
echo "🔧 Executando migrations do Prisma no Railway..."

# Variáveis
RAILWAY_API_URL="https://web-production-e227.up.railway.app"
DATABASE_URL="postgresql://postgres:*x!4QaAuPepA5%23B@db.oekfkdvrgyiklgkfqpbt.supabase.co:6543/postgres?pgbouncer=true"

echo "📊 API URL: $RAILWAY_API_URL"
echo "🗄️ Database: Supabase PostgreSQL"
echo ""

# Testar API
echo "✅ Testando API..."
curl -s "$RAILWAY_API_URL/health" | jq .

echo ""
echo "🎯 Para rodar as migrations, execute no Railway:"
echo "   npx prisma db push"
echo ""
echo "📝 Ou crie um script de deploy no package.json"

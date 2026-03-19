#!/bin/bash

# 🚀 FLEXCREDI - Fix Vercel Deploy (Versão Ultra-Simples)
# Este script faz commit do vercel.json via GitHub API para forçar redeploy

echo "🔧 FLEXCREDI - Corrigindo Deploy Vercel"
echo "=================================================="

# Configurações
GITHUB_TOKEN="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"
GITHUB_USER="chazmarques-blip"
REPO="FLEXCREDI-COMPLETO"
FILE="vercel.json"

# Conteúdo do vercel.json em base64
CONTENT="ewogICJyZXdyaXRlcyI6IFsKICAgIHsKICAgICAgInNvdXJjZSI6ICIvKC4qKSIsCiAgICAgICJkZXN0aW5hdGlvbiI6ICIvYWRtaW4tZGFzaGJvYXJkLmh0bWwiLAogICAgICAiaGFzIjogWwogICAgICAgIHsKICAgICAgICAgICJ0eXBlIjogImhvc3QiLAogICAgICAgICAgInZhbHVlIjogImFkbWluLmZsZXhjcmVkaS5jb20iCiAgICAgICAgfQogICAgICBdCiAgICB9CiAgXQp9Cg=="

echo ""
echo "📡 Obtendo SHA do arquivo atual..."

# Obter SHA atual
SHA=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO/contents/$FILE" | \
  grep '"sha"' | head -1 | cut -d'"' -f4)

if [ -z "$SHA" ]; then
    echo "❌ Erro: Não foi possível obter SHA do arquivo"
    echo "Verifique se o token GitHub está válido"
    exit 1
fi

echo "✅ SHA obtido: ${SHA:0:7}..."

echo ""
echo "📤 Fazendo commit do vercel.json corrigido..."

# Fazer commit
RESPONSE=$(curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO/contents/$FILE" \
  -d "{
    \"message\": \"fix: Corrigir vercel.json para resolver erro de deploy - $(date '+%Y-%m-%d %H:%M:%S')\",
    \"content\": \"$CONTENT\",
    \"sha\": \"$SHA\",
    \"branch\": \"main\"
  }")

# Verificar sucesso
if echo "$RESPONSE" | grep -q '"sha"'; then
    echo "✅ Commit realizado com sucesso!"
    echo ""
    echo "=================================================="
    echo "✅ DEPLOY INICIADO COM SUCESSO!"
    echo "=================================================="
    echo ""
    echo "📦 Repositório:"
    echo "   https://github.com/$GITHUB_USER/$REPO"
    echo ""
    echo "🌐 Painel Vercel:"
    echo "   https://vercel.com/charles-marques-projects/flexcredi"
    echo ""
    echo "🔗 Site (aguarde 2-3 min):"
    echo "   https://flexcredi.vercel.app"
    echo ""
    echo "⏱️  O Vercel detectará a mudança e fará redeploy automaticamente"
    echo ""
else
    echo "❌ Erro ao fazer commit"
    echo "Resposta da API:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

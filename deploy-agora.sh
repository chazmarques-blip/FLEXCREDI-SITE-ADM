#!/bin/bash

# 🚀 DEPLOY VERCEL AGORA - VERSÃO SIMPLIFICADA

echo "🚀 FLEXCREDI - Fazendo Deploy Vercel AGORA"
echo "=========================================================="

TOKEN="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"
USER="chazmarques-blip"
REPO="FLEXCREDI-COMPLETO"
FILE="vercel.json"

echo ""
echo "📡 1/3 - Obtendo SHA do arquivo no GitHub..."

# Obter SHA
SHA=$(curl -s -H "Authorization: token $TOKEN" \
  "https://api.github.com/repos/$USER/$REPO/contents/$FILE" | \
  grep '"sha"' | head -1 | cut -d'"' -f4)

if [ -z "$SHA" ]; then
    echo "❌ Erro: Não foi possível obter SHA"
    exit 1
fi

echo "✅ SHA obtido: ${SHA:0:7}..."

echo ""
echo "📤 2/3 - Fazendo commit para forçar deploy..."

# Conteúdo em base64
CONTENT="ewogICJyZXdyaXRlcyI6IFsKICAgIHsKICAgICAgInNvdXJjZSI6ICIvKC4qKSIsCiAgICAgICJkZXN0aW5hdGlvbiI6ICIvYWRtaW4tZGFzaGJvYXJkLmh0bWwiLAogICAgICAiaGFzIjogWwogICAgICAgIHsKICAgICAgICAgICJ0eXBlIjogImhvc3QiLAogICAgICAgICAgInZhbHVlIjogImFkbWluLmZsZXhjcmVkaS5jb20iCiAgICAgICAgfQogICAgICBdCiAgICB9CiAgXQp9Cg=="

# Fazer commit
RESPONSE=$(curl -s -X PUT \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$USER/$REPO/contents/$FILE" \
  -d "{
    \"message\": \"deploy: Forçar novo deploy Vercel - $(date '+%Y-%m-%d %H:%M:%S')\",
    \"content\": \"$CONTENT\",
    \"sha\": \"$SHA\",
    \"branch\": \"main\"
  }")

echo ""
echo "🔍 3/3 - Verificando resultado..."

# Verificar sucesso
if echo "$RESPONSE" | grep -q '"sha"'; then
    COMMIT_SHA=$(echo "$RESPONSE" | grep '"sha"' | head -1 | cut -d'"' -f4)
    
    echo ""
    echo "=========================================================="
    echo "✅ DEPLOY INICIADO COM SUCESSO!"
    echo "=========================================================="
    echo ""
    echo "📦 Repositório:"
    echo "   https://github.com/$USER/$REPO"
    echo ""
    echo "📊 Commit:"
    echo "   https://github.com/$USER/$REPO/commit/$COMMIT_SHA"
    echo ""
    echo "🌐 Painel Vercel (acompanhe o progresso):"
    echo "   https://vercel.com/charles-marques-projects/flexcredi"
    echo ""
    echo "🔗 Site (aguarde 3-5 min):"
    echo "   https://flexcredi.vercel.app"
    echo ""
    echo "⏱️  TIMELINE:"
    echo "   ✅ 0:00 - Commit feito AGORA"
    echo "   🔄 0:30 - Vercel detecta mudança"
    echo "   🔨 1:00 - Build inicia automaticamente"
    echo "   ⚙️  2:30 - Build em progresso"
    echo "   ✅ 3:30 - Deploy completo"
    echo "   🚀 4:00 - Site ONLINE"
    echo ""
    echo "=========================================================="
    echo "✅ Aguarde 3-5 minutos e teste o site!"
    echo "=========================================================="
    echo ""
    
else
    echo "❌ Erro ao fazer commit"
    echo "Resposta da API:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

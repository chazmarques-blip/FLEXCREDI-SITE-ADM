#!/bin/bash

# 🚀 REDEPLOY FORÇADO COM LIMPEZA DE CACHE
# Este script força um novo deploy no Vercel

TOKEN="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"
REPO="chazmarques-blip/FLEXCREDI-COMPLETO"

echo "🔥 =============================================="
echo "🔥 REDEPLOY FORÇADO - FLEXCREDI"
echo "🔥 =============================================="
echo ""

# Obter SHA atual do DEPLOY-TRIGGER.txt
echo "📥 Obtendo arquivo trigger..."
SHA=$(curl -s -H "Authorization: token $TOKEN" \
  "https://api.github.com/repos/$REPO/contents/DEPLOY-TRIGGER.txt" | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['sha'])" 2>/dev/null)

if [ -z "$SHA" ]; then
    echo "❌ Erro ao obter SHA"
    exit 1
fi

echo "✅ SHA obtido: $SHA"

# Novo conteúdo com timestamp único
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
CONTENT="<!-- FORCE REDEPLOY -->
<!-- Timestamp: $TIMESTAMP -->
<!-- Este arquivo força o Vercel a fazer um novo deploy -->
Deploy forçado em: $TIMESTAMP
Versão: 2.0.2
Status: Forçando redeploy completo para limpar cache
Problema: Site não carrega após correção do vercel.json
Solução: Trigger manual de deploy com limpeza de cache"

# Converter para base64
CONTENT_BASE64=$(echo "$CONTENT" | base64)

echo ""
echo "📤 Enviando trigger de redeploy..."

# Fazer update via API
RESPONSE=$(curl -s -X PUT \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"chore: Force complete redeploy with cache clear\",
    \"content\": \"$CONTENT_BASE64\",
    \"sha\": \"$SHA\",
    \"branch\": \"main\"
  }" \
  "https://api.github.com/repos/$REPO/contents/DEPLOY-TRIGGER.txt")

# Verificar sucesso
if echo "$RESPONSE" | grep -q "commit"; then
    echo "✅ Redeploy acionado com sucesso!"
    echo ""
    echo "✅ =============================================="
    echo "✅ DEPLOY EM ANDAMENTO!"
    echo "✅ =============================================="
    echo ""
    echo "🌐 Site: https://flexcredi.vercel.app"
    echo "⏱️  Aguarde: 60-90 segundos"
    echo ""
    echo "🔍 Monitorar:"
    echo "   https://vercel.com/charles-marques-projects/flexcredi/deployments"
    echo ""
    echo "📋 Após o deploy ficar READY:"
    echo "   1. Abra: https://flexcredi.vercel.app"
    echo "   2. Hard Refresh: Cmd + Shift + R"
    echo "   3. Limpe cache do navegador se necessário"
    echo ""
else
    echo "❌ Erro ao acionar redeploy:"
    echo "$RESPONSE"
fi

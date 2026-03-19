#!/bin/bash

# FLEXCREDI - Deploy Trigger Script
# Este script força o deploy no Vercel via API

echo "🚀 Acionando deploy do FLEXCREDI no Vercel..."
echo ""

# Deploy Hook URL
DEPLOY_HOOK_URL="https://api.vercel.com/v1/integrations/deploy/prj_Z6bXrM8Da6dTaonXPnzjWlbTQYGK/3PxOYsQfKN"

# Fazer requisição POST
echo "📡 Enviando requisição para Vercel API..."
RESPONSE=$(curl -X POST "$DEPLOY_HOOK_URL" -w "\nHTTP_CODE:%{http_code}" -s)

# Extrair HTTP code
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_CODE")

echo ""
echo "📊 RESULTADO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" == "201" ]; then
    echo "✅ SUCESSO! Deploy criado!"
    echo ""
    echo "📋 Response Body:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    echo "⏳ Aguarde 1-2 minutos e verifique:"
    echo "   https://vercel.com/charles-marques-projects/flexcredi"
elif [ "$HTTP_CODE" == "200" ]; then
    echo "✅ OK! Deploy já existe ou foi acionado!"
    echo ""
    echo "📋 Response Body:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "❌ ERRO! HTTP $HTTP_CODE"
    echo ""
    echo "📋 Response Body:"
    echo "$BODY"
    echo ""
    echo "🔍 Possíveis causas:"
    echo "   - Deploy Hook inválido ou expirado"
    echo "   - Projeto deletado no Vercel"
    echo "   - Permissões insuficientes"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

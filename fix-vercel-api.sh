#!/bin/bash

# 🚀 CORREÇÃO VIA API DO GITHUB (SEM CLONAR)
# Este script atualiza o vercel.json direto via API

TOKEN="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"
REPO="chazmarques-blip/FLEXCREDI-COMPLETO"
FILE="vercel.json"

echo "🔥 =============================================="
echo "🔥 CORREÇÃO VIA API - SEM CLONAR REPOSITÓRIO"
echo "🔥 =============================================="
echo ""

# Novo conteúdo do vercel.json (corrigido)
CONTENT='{
  "version": 2,
  "rewrites": [
    {
      "source": "/",
      "destination": "/admin-dashboard.html",
      "has": [
        {
          "type": "host",
          "value": "admin.flexcredi.com"
        }
      ]
    },
    {
      "source": "/:path*",
      "destination": "/admin-dashboard.html",
      "has": [
        {
          "type": "host",
          "value": "admin.flexcredi.com"
        }
      ]
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}'

echo "📥 Obtendo SHA atual do vercel.json..."
SHA=$(curl -s -H "Authorization: token $TOKEN" \
  "https://api.github.com/repos/$REPO/contents/$FILE" | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['sha'])" 2>/dev/null)

if [ -z "$SHA" ]; then
    echo "❌ Erro ao obter SHA do arquivo"
    exit 1
fi

echo "✅ SHA obtido: $SHA"
echo ""
echo "📤 Enviando vercel.json corrigido..."

# Converter conteúdo para base64
CONTENT_BASE64=$(echo "$CONTENT" | base64)

# Fazer update via API
RESPONSE=$(curl -s -X PUT \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"fix(critical): Corrige vercel.json que estava quebrando o site principal\",
    \"content\": \"$CONTENT_BASE64\",
    \"sha\": \"$SHA\",
    \"branch\": \"main\"
  }" \
  "https://api.github.com/repos/$REPO/contents/$FILE")

# Verificar se deu certo
if echo "$RESPONSE" | grep -q "commit"; then
    echo "✅ vercel.json atualizado com sucesso!"
    echo ""
    echo "✅ =============================================="
    echo "✅ DEPLOY ACIONADO!"
    echo "✅ =============================================="
    echo ""
    echo "🌐 Acesse: https://flexcredi.vercel.app"
    echo "⏱️  Aguarde 30-60s para o Vercel fazer deploy"
    echo ""
    echo "🔍 Monitorar deploy:"
    echo "   https://vercel.com/charles-marques-projects/flexcredi/deployments"
    echo ""
else
    echo "❌ Erro ao atualizar arquivo:"
    echo "$RESPONSE"
fi

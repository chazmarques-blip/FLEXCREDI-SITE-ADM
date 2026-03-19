#!/bin/bash

# ============================================
# DEPLOY DIRETO VIA GITHUB CLI
# ============================================

echo "🚀 Deploy direto do index.html para GitHub..."

# Configurar token
export GITHUB_TOKEN="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"

# Criar branch temporária com o arquivo atualizado
TEMP_BRANCH="deploy-fix-$(date +%s)"

echo "📝 Criando branch temporária: $TEMP_BRANCH"

# Usar GitHub CLI para fazer o commit
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/chazmarques-blip/FLEXCREDI-COMPLETO/contents/index.html \
  -f message="fix: Replace index.html with correct working version" \
  -f content=@index.html \
  -f branch=main

if [ $? -eq 0 ]; then
    echo "✅ Deploy concluído com sucesso!"
    echo ""
    echo "🌐 Acesse: https://flexcredi.vercel.app"
    echo "⏱️ Aguarde 30-60s para o Vercel fazer deploy"
else
    echo "❌ Erro no deploy!"
fi

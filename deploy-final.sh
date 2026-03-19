#!/bin/bash

# ============================================
# FLEXCREDI - DEPLOY AUTOMÁTICO COMPLETO
# ============================================
# Este script faz commit e push de todas as alterações
# para o repositório GitHub do FLEXCREDI
# ============================================

echo "🚀 Iniciando deploy do FLEXCREDI..."
echo ""

# Configurações
REPO_URL="https://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@github.com/chazmarques-blip/FLEXCREDI-COMPLETO.git"
BRANCH="main"

# Verificar se estamos em um repositório git
if [ ! -d ".git" ]; then
    echo "❌ ERRO: Este diretório não é um repositório Git!"
    echo "📝 Execute este comando primeiro:"
    echo "   git clone https://github.com/chazmarques-blip/FLEXCREDI-COMPLETO.git"
    exit 1
fi

# Configurar git user (necessário para commits)
git config user.name "FLEXCREDI Deploy Bot"
git config user.email "deploy@flexcredi.com"

echo "📦 Adicionando arquivos modificados..."
git add index.html
git add css/cache-buster.css 2>/dev/null || echo "⚠️  cache-buster.css não encontrado (será criado)"
git add css/carousel-fix.css 2>/dev/null || echo "✅ carousel-fix.css já existe"

echo ""
echo "📝 Criando commit..."
git commit -m "fix: Replace index.html with correct working version + carousel fixes

- Substitui index.html completo pela versão correta
- Adiciona cache-buster.css para forçar reload de assets
- Garante que carousel-fix.css está linkado corretamente
- Corrige imagens do carousel (mosaic-*.jpg)
- Deploy automático via script
"

echo ""
echo "🔄 Fazendo push para o GitHub..."
git push "$REPO_URL" "$BRANCH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ============================================"
    echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "✅ ============================================"
    echo ""
    echo "🌐 URLs do site:"
    echo "   • Vercel: https://flexcredi.vercel.app"
    echo "   • www: https://www.flexcredi.com (após DNS propagar)"
    echo "   • admin: https://admin.flexcredi.com (após DNS propagar)"
    echo ""
    echo "⏱️  Aguarde 30-60 segundos para o Vercel fazer deploy automático"
    echo ""
    echo "🔍 Verificar deploy em:"
    echo "   https://vercel.com/charles-marques-projects/flexcredi/deployments"
    echo ""
else
    echo ""
    echo "❌ ============================================"
    echo "❌ ERRO NO PUSH!"
    echo "❌ ============================================"
    echo ""
    echo "Possíveis causas:"
    echo "1. Token sem permissão de push"
    echo "2. Branch protegida"
    echo "3. Conflitos no repositório"
    echo ""
    echo "Tente manualmente:"
    echo "   git push https://github.com/chazmarques-blip/FLEXCREDI-COMPLETO.git main"
    exit 1
fi

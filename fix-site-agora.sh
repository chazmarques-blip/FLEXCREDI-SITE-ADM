#!/bin/bash

# 🚀 CORREÇÃO EMERGENCIAL DO SITE FLEXCREDI
# Este script corrige o vercel.json que estava quebrando o site

echo "🔥 =============================================="
echo "🔥 CORREÇÃO EMERGENCIAL - FLEXCREDI"
echo "🔥 =============================================="
echo ""
echo "📋 Problema identificado:"
echo "   → vercel.json estava redirecionando TUDO para admin-dashboard.html"
echo "   → Site principal (index.html) não carregava"
echo ""
echo "✅ Solução aplicada:"
echo "   → Novo vercel.json que serve index.html na raiz"
echo "   → admin.flexcredi.com ainda funciona corretamente"
echo ""
echo "🚀 Iniciando deploy..."
echo ""

# Navegar para a pasta do projeto
cd ~/Desktop/FLEXCREDI-COMPLETO || {
    echo "❌ Erro: Pasta FLEXCREDI-COMPLETO não encontrada"
    echo "   Execute primeiro: cd ~/Desktop && git clone https://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@github.com/chazmarques-blip/FLEXCREDI-COMPLETO.git"
    exit 1
}

# Configurar git
git config user.name "Charles Marques"
git config user.email "chazmarques@flexcredi.com"

# Adicionar vercel.json corrigido
git add vercel.json

# Commit
git commit -m "🚨 fix(critical): Corrige vercel.json que estava quebrando o site principal" \
           -m "Problema: vercel.json redirecionava TODAS as requisições para admin-dashboard.html" \
           -m "Solução: rewrites agora só aplicam para admin.flexcredi.com" \
           -m "Resultado: www.flexcredi.com volta a carregar index.html corretamente"

# Push com token
git push https://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@github.com/chazmarques-blip/FLEXCREDI-COMPLETO.git main

echo ""
echo "✅ =============================================="
echo "✅ CORREÇÃO CONCLUÍDA!"
echo "✅ =============================================="
echo ""
echo "🌐 Acesse:"
echo "   • Site Principal: https://flexcredi.vercel.app"
echo "   • Admin (se configurado): https://admin.flexcredi.com"
echo ""
echo "⏱️  Aguarde 30-60s para o Vercel fazer deploy"
echo ""
echo "🔍 Monitorar deploy:"
echo "   https://vercel.com/charles-marques-projects/flexcredi/deployments"
echo ""
echo "📸 Após o deploy:"
echo "   1. Abra: https://flexcredi.vercel.app"
echo "   2. Faça Hard Refresh: Cmd + Shift + R"
echo "   3. Verifique se o site carrega"
echo ""

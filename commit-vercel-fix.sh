#!/bin/bash

# Script para fazer commit dos arquivos de configuração Vercel

echo "🔧 FLEXCREDI - Deploy Fix"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Fazendo commit dos arquivos de configuração..."
echo ""

# Adicionar arquivos
git add vercel.json
git add .vercelignore

# Commit
git commit -m "fix: Configure Vercel para deploy estático apenas

- Adiciona vercel.json com configuração para servir apenas HTML/CSS/JS
- Adiciona .vercelignore para ignorar arquivos do backend
- Backend já está no Railway, Vercel só serve frontend estático"

# Push
git push origin main

echo ""
echo "✅ Commit realizado!"
echo ""
echo "Próximos passos:"
echo "1. Aguarde 30-60 segundos"
echo "2. Acesse: https://vercel.com/charles-marques-projects"
echo "3. Veja o deployment acontecendo!"
echo ""
echo "🎉 PROBLEMA RESOLVIDO!"

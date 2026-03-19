#!/bin/bash

# FLEXCREDI - Script de Commit para Deploy

echo "🔍 Verificando status do Git..."
git status

echo ""
echo "📦 Adicionando arquivos novos..."
git add .gitignore
git add CHECKLIST-DEPLOY.md
git add STATUS-GITHUB-DEPLOY.md

echo ""
echo "💾 Fazendo commit..."
git commit -m "feat: preparação final para deploy Railway + Vercel

- Adicionado .gitignore para proteger arquivos sensíveis
- Criado CHECKLIST-DEPLOY.md com guia completo passo a passo
- Criado STATUS-GITHUB-DEPLOY.md com status de verificação
- Projeto 100% pronto para deploy em Railway e Vercel"

echo ""
echo "🚀 Fazendo push para GitHub..."
git push origin main

echo ""
echo "✅ COMMIT CONCLUÍDO!"
echo ""
echo "📍 Próximo passo: Deploy no Railway"
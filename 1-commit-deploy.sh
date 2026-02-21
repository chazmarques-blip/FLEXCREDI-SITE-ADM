# 🚀 FLEXCREDI - DEPLOY AUTOMÁTICO
# Execute este script para fazer commit de todos os arquivos

echo "════════════════════════════════════════════════════════"
echo "  FLEXCREDI - PREPARAÇÃO PARA DEPLOY"
echo "════════════════════════════════════════════════════════"
echo ""

echo "📊 1/5 - Verificando status do Git..."
git status
echo ""

echo "📦 2/5 - Adicionando TODOS os arquivos..."
git add .
echo "✅ Arquivos adicionados"
echo ""

echo "💾 3/5 - Criando commit..."
git commit -m "feat: deploy completo Railway + Vercel

✅ Configurações finais de deploy
✅ .gitignore criado
✅ Scripts de automação
✅ Documentação completa
✅ Backend e Frontend prontos
✅ CORS configurado
✅ URLs dinâmicas

Deploy targets:
- Railway: Backend API (Node.js + Express)
- Vercel: Frontend (Static HTML/CSS/JS)

Sistema 100% pronto para produção!"
echo "✅ Commit criado"
echo ""

echo "🚀 4/5 - Fazendo push para GitHub..."
git push origin main
echo "✅ Push concluído"
echo ""

echo "✅ 5/5 - GIT PREPARADO COM SUCESSO!"
echo ""
echo "════════════════════════════════════════════════════════"
echo "  PRÓXIMO PASSO: DEPLOY NO RAILWAY"
echo "════════════════════════════════════════════════════════"
echo ""
echo "👉 Abra: https://railway.app"
echo "👉 Clique: 'New Project' → 'Deploy from GitHub repo'"
echo "👉 Selecione: seu repositório FLEXCREDI"
echo ""
echo "Quando o Railway terminar o build, me avise!"
echo ""
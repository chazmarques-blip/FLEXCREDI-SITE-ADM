# Troubleshooting - Admin Dashboard Errors

## 🔴 Problema Identificado

**Sintomas:**
- Todos os menus da sidebar retornam erros (400/500)
- API endpoints retornam `HTTP 500 Internal Server Error`
- Dashboard não carrega dados

**Causa Raiz:**
O banco de dados PostgreSQL no Railway **não tem as tabelas criadas** ou a migration não foi executada.

## 🔍 Diagnóstico Realizado

### 1. Testes de Endpoints
```bash
# Health check - OK
curl https://web-production-e227.up.railway.app/health
# → HTTP 200 ✅

# Admin dashboard - ERRO
curl https://web-production-e227.up.railway.app/api/admin/dashboard
# → HTTP 500 ❌ {"success":false,"error":"Erro ao carregar dashboard"}

# Partners - ERRO
curl https://web-production-e227.up.railway.app/api/partners
# → HTTP 500 ❌ {"success":false,"error":"Failed to list partners"}

# Applications - ERRO
curl https://web-production-e227.up.railway.app/api/applications
# → HTTP 500 ❌ {"success":false,"error":"Failed to list applications"}
```

### 2. Análise do Código
- ✅ `routes/admin.js` - Código correto
- ✅ `prisma/schema.prisma` - Schema V4.1 com modelos US Market
- ✅ Frontend HTML - Páginas criadas corretamente
- ❌ **Database** - Tabelas não existem ou migration pendente

## 🛠️ Solução

### Opção 1: Executar Migration via Railway Dashboard

1. Acesse: https://railway.app/project/[seu-projeto]/[seu-serviço]
2. Vá em **Deployments** → Clique no último deploy
3. Procure logs de erro relacionados ao Prisma
4. Se não houver migrations, execute manualmente:

```bash
# No terminal do Railway (ou localmente com DATABASE_URL de produção)
npx prisma migrate deploy
```

### Opção 2: Forçar Migration via Postinstall

O `package.json` já está configurado com:
```json
{
  "scripts": {
    "postinstall": "npx prisma generate && npx prisma db push"
  }
}
```

**Para forçar nova migration:**
1. Faça um commit vazio para triggerar redeploy
2. Railway executará automaticamente `npm install` → `postinstall` → `prisma db push`

```bash
git commit --allow-empty -m "chore: Force Railway redeploy to execute Prisma migrations"
git push origin main
```

### Opção 3: Migration Manual com DATABASE_URL Local

```bash
# 1. Copie DATABASE_URL do Railway (Settings → Variables)
export DATABASE_URL="postgresql://postgres:...@..."

# 2. Execute migration
cd backend
npx prisma migrate dev --name force_us_market_migration

# 3. Ou apenas push schema
npx prisma db push --force-reset --accept-data-loss
```

## 📊 Verificação Pós-Migration

Depois da migration, teste os endpoints novamente:

```bash
# 1. Dashboard deve retornar dados
curl https://web-production-e227.up.railway.app/api/admin/dashboard | jq .

# Esperado:
{
  "success": true,
  "data": {
    "stats": {
      "applications": { "total": 0, "pending": 0, ... },
      "partners": { "total": 0, ... },
      ...
    }
  }
}

# 2. Partners endpoint
curl https://web-production-e227.up.railway.app/api/partners | jq .

# Esperado:
{
  "success": true,
  "data": [],
  "pagination": { "total": 0, "limit": 50, "offset": 0 }
}
```

## 🔄 Status das Migrations

**Local (development):**
- ✅ Schema V4.1 criado
- ✅ Migration file `20240222_us_market_fields` gerado
- ✅ Prisma Client atualizado

**Railway (production):**
- ❌ Migrations NÃO aplicadas no banco
- ⚠️ Tabelas não existem
- 🔧 **ACTION REQUIRED**: Executar `prisma migrate deploy` ou forçar redeploy

## 📝 Checklist de Resolução

- [ ] Verificar logs do Railway para erros de Prisma
- [ ] Confirmar que DATABASE_URL está correta
- [ ] Executar `npx prisma migrate deploy` no Railway
- [ ] Ou fazer commit vazio e push para forçar redeploy
- [ ] Aguardar 2-3 minutos para deploy completar
- [ ] Testar endpoints `/api/admin/dashboard`, `/api/partners`, `/api/applications`
- [ ] Verificar se admin dashboard carrega dados (sem erros 500)
- [ ] Confirmar que sidebar funciona sem erros

## 🎯 Próximos Passos

**Depois de resolver o problema de banco:**
1. ✅ Testar CRUD de Partners
2. ✅ Testar criação de Applications
3. ✅ Testar geração de Contracts
4. ✅ Testar upload de Documents
5. ✅ Verificar AgentCreditAnalyzer funcionando
6. ✅ Configurar domínio customizado `admin.flexcredi.com`

## 🔗 Links Úteis

- **Railway Dashboard**: https://railway.app/project/[seu-projeto]
- **Vercel Admin**: https://flexcredi-dashboard.vercel.app/admin/
- **API Production**: https://web-production-e227.up.railway.app
- **GitHub Repo**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM

## 📧 Suporte

Se o problema persistir:
1. Capture logs do Railway (última deployment)
2. Execute `npx prisma db pull` para verificar schema atual
3. Compare com `prisma/schema.prisma` local
4. Verifique se DATABASE_URL aponta para banco correto

---

**Última Atualização**: 2026-02-22 05:40 UTC  
**Status**: ❌ Migrations pendentes no Railway (backend funciona, mas banco vazio)

# 🏗️ ARQUITETURA ATUAL DO PROJETO FLEXCREDI

## Estrutura do Repositório

📦 **Repositório**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM

```
FLEXCREDI-SITE-ADM/
├── /                    → Site Público (HTML/CSS/JS)
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── /public/             → Admin Dashboard (HTML/CSS/JS)
│   ├── admin/
│   │   ├── index.html
│   │   ├── admin-parceiros.html
│   │   └── ...
│   ├── css/
│   ├── js/
│   └── images/
│
└── /backend/            → API Backend (Node.js + Express + Prisma)
    ├── server.js
    ├── routes/
    ├── controllers/
    ├── agents/
    └── prisma/
```

## Deployments Atuais

### 1. VERCEL (Frontend - 2 projetos separados)

**Projeto 1: flexcredi-site-adm**
- **URL**: https://flexcredi-site-adm.vercel.app
- **Root Directory**: `./` (raiz do repo)
- **Conteúdo**: Site público (landing page, como funciona, contato, FAQ)
- **Domínio customizado**: flexcredi.com (planejado)

**Projeto 2: flexcredi-dashboard**
- **URL**: https://flexcredi-dashboard.vercel.app
- **Root Directory**: `public/` (só a pasta public)
- **Conteúdo**: Admin dashboard (gestão de parceiros, aplicações, documentos)
- **Domínio customizado**: admin.flexcredi.com (planejado)

### 2. RAILWAY (Backend - 1 projeto único)

**Projeto: flexcredi-backend**
- **URL**: https://web-production-e227.up.railway.app
- **Working Directory**: `backend/` (pasta backend)
- **Conteúdo**: API REST (Node.js + Express + Prisma)
- **Serve**: AMBOS os frontends (site público + admin dashboard)

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIOS/CLIENTES                         │
└────────────┬─────────────────────────┬──────────────────────┘
             │                         │
             │                         │
   ┌─────────▼──────────┐    ┌────────▼─────────┐
   │   VERCEL (Site)    │    │ VERCEL (Admin)   │
   │  flexcredi.com     │    │ admin.flexcredi  │
   │                    │    │     .com         │
   │  - Landing Page    │    │  - Dashboard     │
   │  - Como Funciona   │    │  - Partners      │
   │  - Contato         │    │  - Applications  │
   │  - FAQ             │    │  - Documents     │
   └─────────┬──────────┘    └────────┬─────────┘
             │                         │
             └────────────┬────────────┘
                          │
                  API calls via HTTPS
                          │
             ┌────────────▼────────────┐
             │   RAILWAY (Backend)     │
             │  Node.js + Express API  │
             │                         │
             │  - /api/partners        │
             │  - /api/applications    │
             │  - /api/admin           │
             │  - /api/contracts       │
             │  - /api/documents       │
             │  - /api/debug           │
             └────────────┬────────────┘
                          │
                  PostgreSQL queries
                          │
             ┌────────────▼────────────┐
             │   SUPABASE (Database)   │
             │  PostgreSQL 15          │
             │                         │
             │  - Partner              │
             │  - Application          │
             │  - User                 │
             │  - Contract             │
             │  - Document             │
             │  - CreditReport         │
             │  - PartnerReceivable    │
             │  - AchPayment           │
             │  - PartnerPayment       │
             │  - SystemSetting        │
             └─────────────────────────┘
```

## Pergunta Frequente

### ❓ "O Railway é o mesmo tanto para o site quanto para o admin?"

✅ **SIM!** Existe apenas **1 projeto Railway** que serve como backend API para:
- ✅ Site público (Vercel #1)
- ✅ Admin dashboard (Vercel #2)

Ambos os frontends (site + admin) fazem requisições para a **mesma API no Railway**:
```
https://web-production-e227.up.railway.app
```

## Por Que Apenas 1 Backend?

**Vantagens:**
1. ✅ **Código unificado** - Uma única codebase para manter
2. ✅ **Banco de dados único** - Todos os dados em um só lugar
3. ✅ **Custo reduzido** - Apenas 1 instância Railway + 1 banco Supabase
4. ✅ **Deploy simplificado** - Um único deploy para atualizar API
5. ✅ **CORS configurado** - Aceita requisições de ambos os frontends Vercel
6. ✅ **Escalabilidade** - Ambos os frontends escalam de forma independente
7. ✅ **Manutenção** - Atualizações de API beneficiam site + admin simultaneamente

## Configuração Atual do CORS (Railway)

```javascript
// backend/server.js
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'https://web-production-e227.up.railway.app',
  /https:\/\/.*\.vercel\.app$/,  // ← Aceita TODOS os projetos Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Isso significa que:**
- ✅ `flexcredi-site-adm.vercel.app` pode chamar a API
- ✅ `flexcredi-dashboard.vercel.app` pode chamar a API
- ✅ `admin.flexcredi.com` poderá chamar a API (quando configurado)
- ✅ `flexcredi.com` poderá chamar a API (quando configurado)

## Resumo Técnico

| Componente | Tecnologia | Deploy | URL | Acessa |
|-----------|-----------|--------|-----|--------|
| **Site Público** | HTML/CSS/JS | Vercel | flexcredi-site-adm.vercel.app | Railway API |
| **Admin Dashboard** | HTML/CSS/JS | Vercel | flexcredi-dashboard.vercel.app | Railway API |
| **Backend API** | Node.js + Express + Prisma | Railway | web-production-e227.up.railway.app | Supabase DB |
| **Database** | PostgreSQL 15 | Supabase | db.oekfkdvrgyiklgkfqpbt.supabase.co:5432 | - |

## Agentes Autônomos (Backend)

O sistema possui 2 agentes autônomos que rodam no Railway:

### 1. AgentCreditAnalyzer
- **Função**: Análise automática de crédito
- **Triggers**: `application.created`, `application.reanalyze`
- **Checks**: FICO score, DTI, renda, crédito solicitado
- **Decisão**: Auto-approve (≥750), Manual review (620-749), Auto-reject (<620)

### 2. AgentDocumentChecker
- **Função**: Validação automática de documentos
- **Triggers**: `document.uploaded`
- **Checks**: fileExists, fileSize, mimeType, imageQuality, documentRecency
- **Score**: 0-100 (≥85 auto-approve, 70-84 warning, <70 reject)

## Próximo Passo CRÍTICO ⚠️

### 🔴 Problema Atual

Railway está **SEM** a variável `DATABASE_URL` configurada, causando erros HTTP 500 em todos os endpoints.

### ✅ Solução

**Adicionar no Railway Dashboard:**

1. Acesse: https://railway.app/project/[seu-projeto]/variables
2. Clique em **"+ New Variable"**
3. Adicione:
   ```
   Name: DATABASE_URL
   Value: postgresql://postgres:*x!4QaAuPepA5%23B@db.oekfkdvrgyiklgkfqpbt.supabase.co:5432/postgres
   ```
4. Clique em **"Add"**
5. Railway fará redeploy automático (~2-3 min)

⚠️ **Importante**: Use porta **5432** (conexão direta PostgreSQL), não **6543** (pgBouncer)

### Verificação Pós-Configuração

Após adicionar `DATABASE_URL`, teste os endpoints:

```bash
# 1. Debug endpoint (deve mostrar database connected: true)
curl https://web-production-e227.up.railway.app/api/debug/database-test | jq .

# 2. Partners endpoint (deve retornar array vazio)
curl https://web-production-e227.up.railway.app/api/partners | jq .

# 3. Admin dashboard (deve retornar stats com zeros)
curl https://web-production-e227.up.railway.app/api/admin/dashboard | jq .
```

**Resultado esperado:**
```json
{
  "success": true,
  "database": {
    "connected": true,
    "tablesFound": 10,
    "tablesList": ["Partner", "Application", "User", ...]
  }
}
```

## Custos Estimados

| Serviço | Plano | Custo Mensal | Obs |
|---------|-------|--------------|-----|
| Vercel (Site) | Hobby | $0 | Ilimitado para projetos não-comerciais |
| Vercel (Admin) | Hobby | $0 | Ilimitado para projetos não-comerciais |
| Railway | Hobby | $5 | 500h de execução + $5 crédito |
| Supabase | Free | $0 | 500 MB database, 2 GB transfer |
| **TOTAL** | - | **$5/mês** | Escalável conforme crescimento |

## Links Úteis

- 📦 **Repositório**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- 🚀 **Railway Dashboard**: https://railway.app/project/[seu-projeto]
- 🎨 **Vercel Dashboard**: https://vercel.com/charles-marques-projects
- 🗄️ **Supabase Dashboard**: https://supabase.com/dashboard/project/oekfkdvrgyiklgkfqpbt
- 📊 **API Production**: https://web-production-e227.up.railway.app
- 🌐 **Site Público**: https://flexcredi-site-adm.vercel.app
- 👨‍💼 **Admin Dashboard**: https://flexcredi-dashboard.vercel.app

---

**Última Atualização**: 2026-02-22 12:10 UTC  
**Status**: ⚠️ Railway precisa de DATABASE_URL configurada

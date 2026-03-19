# 🚀 FLEXCREDI - Quick Reference Guide

## 📍 URLs Importantes

### Frontend (Sandbox Dev)
- **Dashboard Admin:** https://8000-i4envvcychumgfxyp0ccs-2e77fc33.sandbox.novita.ai/admin-dashboard-v2.html
- **Página Clientes:** https://8000-i4envvcychumgfxyp0ccs-2e77fc33.sandbox.novita.ai/admin-clientes.html
- **Índice do Sistema:** https://8000-i4envvcychumgfxyp0ccs-2e77fc33.sandbox.novita.ai/sistema-indice.html

### Backend (Railway Production)
- **API Base:** https://web-production-e227.up.railway.app
- **Health Check:** https://web-production-e227.up.railway.app/health
- **API Test:** https://web-production-e227.up.railway.app/api/test
- **Dashboard Data:** https://web-production-e227.up.railway.app/api/admin/dashboard

### GitHub
- **Repositório:** https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- **Branch:** main
- **Último Commit:** 4521619 (Sprint 1 completo)

---

## 📦 Estrutura de Arquivos

```
/home/user/webapp/
├── admin-dashboard-v2.html       # ✅ Dashboard principal
├── admin-clientes.html           # ✅ Página de clientes
├── css/
│   └── admin-dashboard.css       # ✅ Estilos admin
├── js/
│   └── admin-dashboard.js        # ✅ Lógica frontend
├── SPRINT1-COMPLETO.md           # ✅ Relatório Sprint 1
├── DESIGN-SYSTEM-ADMIN.md        # ✅ Design system
├── REFERENCIAS-LAYOUT-VALIDADAS.md # ✅ Layout refs
└── backend/
    ├── server.js                 # ✅ Server v4.0
    ├── API-DOCUMENTATION.md      # ✅ Docs completos
    ├── test-api.sh               # ✅ Script de teste
    ├── prisma/
    │   ├── schema.prisma         # ✅ 15 models
    │   └── seed.js               # ✅ Dados iniciais
    ├── core/
    │   └── EventBus.js           # ✅ Pub/Sub
    ├── agents/
    │   ├── BaseAgent.js          # ✅ Abstract class
    │   └── AgentCreditAnalyzer.js # ✅ Análise crédito
    ├── controllers/
    │   ├── PartnersController.js # ✅ CRUD parceiros
    │   └── ApplicationsController.js # ✅ CRUD aplicações
    └── routes/
        ├── partners.js           # ✅ Rotas parceiros
        ├── applications.js       # ✅ Rotas aplicações
        └── admin.js              # ✅ Rotas admin
```

---

## 🌐 REST API v4.0 - Referência Rápida

### Partners (6 endpoints)
```bash
# Cadastrar parceiro
POST /api/partners
Body: { companyName, cnpj, email, phone, address, city, state, zipCode, 
        legalRepName, legalRepCpf, legalRepEmail, legalRepPhone, ... }

# Listar parceiros
GET /api/partners?status=PENDING&limit=20

# Obter detalhes
GET /api/partners/:id

# Atualizar
PUT /api/partners/:id
Body: { tradeName, phone, ... }

# Aprovar
PUT /api/partners/:id/approve
Body: { creditLimit, adminId }

# Rejeitar
PUT /api/partners/:id/reject
Body: { rejectionReason, adminId }
```

### Applications (5 endpoints)
```bash
# Criar aplicação (→ AgentCreditAnalyzer)
POST /api/applications
Body: { clientName, clientEmail, clientPhone, clientCpf, 
        desiredAmount, purpose, monthlyIncome, partnerId, ... }

# Listar aplicações
GET /api/applications?status=PENDING&partnerId=uuid

# Obter detalhes
GET /api/applications/:id

# Aprovar
PUT /api/applications/:id/approve
Body: { approvedAmount, interestRate, termMonths, reviewNotes, adminId }

# Rejeitar
PUT /api/applications/:id/reject
Body: { rejectionReason, adminId }
```

### Admin (4 endpoints)
```bash
# Dashboard
GET /api/admin/dashboard

# Estatísticas mensais
GET /api/admin/stats/monthly?months=6

# Configurações
GET /api/admin/system-settings

# Atualizar configuração
PUT /api/admin/system-settings/:key
Body: { value }
```

---

## 🧪 Testar API

```bash
# Método 1: Script automático
cd /home/user/webapp/backend
./test-api.sh

# Método 2: cURL manual
curl https://web-production-e227.up.railway.app/health
curl https://web-production-e227.up.railway.app/api/admin/dashboard
curl https://web-production-e227.up.railway.app/api/partners
```

---

## 🗄️ Database (Prisma)

### Conectar ao DB
```bash
cd /home/user/webapp/backend
npx prisma studio  # Abre interface visual
```

### Migrations
```bash
npm run db:generate  # Gerar Prisma Client
npm run db:push      # Push schema para DB
npm run db:seed      # Popular com dados iniciais
```

### Models Principais
- **User** - Clientes, parceiros, admins
- **Partner** - Parceiros cadastrados (status: PENDING | APPROVED | REJECTED | SUSPENDED)
- **Application** - Aplicações de crédito (status: PENDING | APPROVED | REJECTED | ACTIVE | COMPLETED)
- **CreditReport** - Relatórios de crédito (Experian mock)
- **Document** - Documentos anexados
- **Contract** - Contratos gerados
- **PartnerReceivable** - Recebíveis futuros
- **AchPayment** - Pagamentos ACH
- **InterestRateRule** - Regras de taxas configuráveis
- **SystemSetting** - Configurações do sistema

---

## 🤖 Agentes Autônomos

### AgentCreditAnalyzer
**Trigger:** `application:created` event  
**Fluxo:**
1. Busca regras de taxas (5 tiers)
2. Mock Experian score (300-850)
3. Calcula DTI
4. Determina tier e taxa aplicável
5. Calcula parcela mensal
6. Auto-aprova (score > 750) ou deixa pendente
7. Emite `application:analyzed`

**Regras padrão (Seed):**
- EXCELLENT (750-850): 8.9% a.a.
- GOOD (700-749): 12.5% a.a.
- FAIR (650-699): 18.5% a.a.
- POOR (600-649): 24.9% a.a.
- VERY_POOR (300-599): 32.9% a.a.

---

## 🎨 Design System

### Cores
- Verde Primário: `#2ECC71`
- Laranja: `#F59E0B`
- Vermelho: `#EF4444`
- Azul: `#3B82F6`

### Tipografia
- Fonte: **Poppins** (Google Fonts)
- Tamanhos: 12px → 48px

### Breakpoints
- Desktop: ≥ 1024px
- Tablet: 768px-1023px
- Mobile: < 768px

---

## 📝 Comandos Úteis

### Backend
```bash
cd /home/user/webapp/backend

# Start server
npm start                # Production
npm run dev              # Development (nodemon)

# Database
npm run db:generate      # Gerar Prisma Client
npm run db:push          # Push schema
npm run db:seed          # Popular DB
npm run db:studio        # Abrir Studio

# Test
./test-api.sh            # Testar todos endpoints
```

### Frontend
```bash
cd /home/user/webapp

# Start local server
python3 -m http.server 8000

# Preview URLs
# Dashboard: http://localhost:8000/admin-dashboard-v2.html
# Clientes: http://localhost:8000/admin-clientes.html
```

### Git
```bash
# Ver status
git status

# Add e commit
git add -A
git commit -m "mensagem"
git push origin main

# Ver log
git log --oneline -10
```

---

## 📊 Status do Projeto

### ✅ Sprint 1 (COMPLETO)
- Admin Dashboard v2
- Página /admin/clientes
- Prisma schema v4 (15 models)
- EventBus + BaseAgent
- AgentCreditAnalyzer
- REST API (15 endpoints)
- Documentação completa

### ⏳ Sprint 2 (PRÓXIMO)
- AgentDocumentChecker
- /admin/documentos
- /admin/contratos
- Upload de arquivos
- Visualizador de PDFs
- Assinatura eletrônica

### 🔮 Sprint 3
- Recebíveis futuros
- ACH payments
- Painel do parceiro

### 🔮 Sprint 4
- MasterAgent
- Agentes autônomos completos
- Analytics avançados

---

## 🔐 Credenciais

### Database (Supabase PostgreSQL)
- **Host:** db.oekfkdvrgyiklgkfqpbt.supabase.co:6543
- **Database:** postgres
- **Connection String:** Ver `/home/user/webapp/backend/.env`

### Admin User (Seed)
- **Email:** admin@flexcredi.com
- **Nome:** Admin FlexCredi
- **Role:** ADMIN

---

## 📚 Documentação Completa

- **Sprint 1 Completo:** `/home/user/webapp/SPRINT1-COMPLETO.md` (15 KB)
- **API Documentation:** `/home/user/webapp/backend/API-DOCUMENTATION.md` (18 KB)
- **Design System:** `/home/user/webapp/DESIGN-SYSTEM-ADMIN.md` (28 KB)
- **Planejamento v4:** `/home/user/webapp/PLANEJAMENTO-V4-FINAL-COMPLETO.md` (80 KB)
- **Layout Validado:** `/home/user/webapp/REFERENCIAS-LAYOUT-VALIDADAS.md` (14 KB)

---

## 🎯 Próxima Ação

**Opção 1:** Continuar com Sprint 2 (Documentos e Contratos)  
**Opção 2:** Testar profundamente o Dashboard e API  
**Opção 3:** Revisar e ajustar antes de prosseguir  

**Aguardando sua decisão!** 🚀

---

**Última atualização:** 2026-02-21  
**Versão:** 1.0.0  
**Sprint:** 1 (COMPLETO)

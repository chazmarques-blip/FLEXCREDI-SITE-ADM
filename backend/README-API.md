# FLEXCREDI Backend API

API REST completa para o sistema FlexCredi de gerenciamento de crédito para parceiros.

## 🚀 Status

**Versão:** 1.0.0  
**Status:** Em desenvolvimento (Sprint 1)  
**Banco de dados:** PostgreSQL (Prisma ORM)

## 📋 Requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Executar migrations
npx prisma migrate dev

# Popular banco com dados iniciais (opcional)
npx prisma db seed

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🌐 Endpoints Disponíveis

### 🏥 Health & Status

#### `GET /health`
Verificar saúde do servidor.

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2024-02-21T20:00:00.000Z",
  "uptime": 12345,
  "environment": "development"
}
```

#### `GET /`
Informações da API e lista de endpoints.

#### `GET /api/test`
Rota de teste simples.

---

### 👥 Partners (Parceiros)

#### `POST /api/partners`
Cadastrar novo parceiro.

**Body:**
```json
{
  "companyName": "Empresa LTDA",
  "tradeName": "Empresa",
  "cnpj": "12.345.678/0001-90",
  "email": "contato@empresa.com",
  "phone": "(11) 3333-4444",
  "address": "Rua Teste, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "legalRepName": "João Silva",
  "legalRepCpf": "123.456.789-00",
  "legalRepEmail": "joao@empresa.com",
  "legalRepPhone": "(11) 99999-8888",
  "monthlyRevenue": 100000,
  "monthlyReceivables": 80000
}
```

**Resposta:** `201 Created`

#### `GET /api/partners`
Listar parceiros com filtros e paginação.

**Query params:**
- `status`: PENDING | APPROVED | REJECTED | SUSPENDED
- `limit`: número de registros (padrão: 50)
- `offset`: paginação (padrão: 0)
- `sortBy`: campo de ordenação (padrão: createdAt)
- `sortOrder`: asc | desc (padrão: desc)

**Resposta:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 10,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### `GET /api/partners/:id`
Detalhes completos de um parceiro.

**Inclui:** applications, receivables, payments, documents, _count

#### `PUT /api/partners/:id`
Atualizar dados do parceiro.

#### `PUT /api/partners/:id/approve`
Aprovar parceiro (admin).

**Body:**
```json
{
  "creditLimit": 500000,
  "adminId": "admin-uuid"
}
```

#### `PUT /api/partners/:id/reject`
Rejeitar parceiro.

**Body:**
```json
{
  "rejectionReason": "Motivo da rejeição",
  "adminId": "admin-uuid"
}
```

---

### 📝 Applications (Aplicações de Crédito)

#### `POST /api/applications`
Criar nova aplicação de crédito.

**Body:**
```json
{
  "clientName": "Maria Silva Santos",
  "clientEmail": "maria@email.com",
  "clientPhone": "(11) 99999-1234",
  "clientCpf": "123.456.789-01",
  "clientAddress": "Rua Cliente, 456",
  "clientCity": "São Paulo",
  "clientState": "SP",
  "clientZipCode": "01234-567",
  "desiredAmount": 15000,
  "purpose": "Capital de giro",
  "monthlyIncome": 5000,
  "employmentStatus": "employed",
  "employer": "Empresa XYZ",
  "occupation": "Analista",
  "partnerId": "partner-uuid"
}
```

**Resposta:** `201 Created`

**Eventos disparados:**
- `application.created` → Inicia análise de crédito automática

#### `GET /api/applications`
Listar aplicações com filtros e paginação.

**Query params:**
- `status`: PENDING | APPROVED | REJECTED | ACTIVE | COMPLETED
- `partnerId`: ID do parceiro
- `limit`: número de registros (padrão: 50)
- `offset`: paginação (padrão: 0)
- `sortBy`: campo de ordenação (padrão: createdAt)
- `sortOrder`: asc | desc (padrão: desc)

#### `GET /api/applications/:id`
Detalhes completos de uma aplicação.

**Inclui:** partner, user, documents, contract, creditReport, receivables, partnerPayments, achPayments

#### `PUT /api/applications/:id/approve`
Aprovar aplicação manualmente (admin).

**Body:**
```json
{
  "approvedAmount": 15000,
  "interestRate": 2.5,
  "termMonths": 12,
  "reviewNotes": "Aprovado",
  "adminId": "admin-uuid"
}
```

**Eventos disparados:**
- `application.approved` → Gera contrato

#### `PUT /api/applications/:id/reject`
Rejeitar aplicação.

**Body:**
```json
{
  "rejectionReason": "Motivo da rejeição",
  "adminId": "admin-uuid"
}
```

---

### 🎯 Admin

#### `GET /api/admin/dashboard`
Estatísticas gerais do sistema.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "applications": {
        "total": 156,
        "pending": 23,
        "approved": 98,
        "rejected": 35,
        "totalApprovedAmount": 2850000
      },
      "partners": {
        "total": 45,
        "approved": 32,
        "pending": 13
      },
      "users": {
        "total": 142
      },
      "contracts": {
        "total": 98,
        "active": 76
      },
      "receivables": {
        "total": 456,
        "pending": 123,
        "totalAmount": 1234567
      },
      "achPayments": {
        "total": 234,
        "pending": 45
      }
    },
    "recent": {
      "applications": [...],
      "partners": [...]
    },
    "systemStatus": {
      "database": "online",
      "api": "online",
      "creditBureau": "online",
      "achProcessor": "online"
    }
  }
}
```

#### `GET /api/admin/stats/monthly`
Estatísticas mensais para gráficos.

**Query params:**
- `months`: número de meses (padrão: 6)

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "month": "2024-01",
      "total": 45,
      "approved": 32,
      "rejected": 8,
      "pending": 5,
      "totalAmount": 456789
    },
    ...
  ]
}
```

#### `GET /api/admin/system-settings`
Buscar todas as configurações do sistema.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "max_credit_amount": {
      "value": "500000",
      "type": "number",
      "description": "Valor máximo de crédito"
    },
    ...
  }
}
```

#### `PUT /api/admin/system-settings/:key`
Atualizar uma configuração.

**Body:**
```json
{
  "value": "750000"
}
```

---

## 🔄 Event Bus

O sistema usa um barramento de eventos para comunicação entre componentes:

### Eventos Disponíveis

- **`application.created`**: Nova aplicação criada → Inicia análise automática
- **`application.approved`**: Aplicação aprovada → Gera contrato
- **`application.rejected`**: Aplicação rejeitada → Envia notificação
- **`partner.created`**: Novo parceiro cadastrado → Envia email de confirmação
- **`partner.approved`**: Parceiro aprovado → Libera acesso ao painel
- **`partner.rejected`**: Parceiro rejeitado → Envia notificação

### Exemplo de Uso

```javascript
const EventBus = require('./core/EventBus');

// Emitir evento
EventBus.emitAsync('application.created', { applicationId: 'uuid' });

// Escutar evento
EventBus.on('application.created', async (payload) => {
  console.log('Nova aplicação criada:', payload.applicationId);
});
```

---

## 🤖 Agentes Autônomos

### AgentCreditAnalyzer

Analisa aplicações automaticamente usando:
- Score de crédito (Experian API - mock)
- Cálculo de DTI (Debt-to-Income Ratio)
- Lookup de regras de taxa de juros
- Cálculo de pagamento mensal (PMT)
- Aprovação automática para score > 750

**Eventos escutados:**
- `application.created`

**Eventos emitidos:**
- `credit.analysis.completed`

---

## 🧪 Testes

### Executar Suite de Testes

```bash
# Testar API local
node test-endpoints.js

# Testar API em produção
node test-endpoints.js https://api.flexcredi.com
```

### Testes Incluídos

1. ✅ Health check
2. ✅ Rota raiz
3. ✅ Rota de teste
4. ✅ Criar parceiro
5. ✅ Listar parceiros
6. ✅ Obter detalhes do parceiro
7. ✅ Aprovar parceiro
8. ✅ Criar aplicação
9. ✅ Listar aplicações
10. ✅ Obter detalhes da aplicação
11. ✅ Aprovar aplicação
12. ✅ Dashboard admin
13. ✅ Estatísticas mensais
14. ✅ Configurações do sistema

---

## 📦 Estrutura do Projeto

```
backend/
├── agents/              # Agentes autônomos
│   ├── BaseAgent.js
│   └── AgentCreditAnalyzer.js
├── controllers/         # Controladores das rotas
│   ├── ApplicationsController.js
│   └── PartnersController.js
├── core/                # Núcleo do sistema
│   └── EventBus.js
├── middleware/          # Middleware Express
├── prisma/              # Schema e migrations Prisma
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── routes/              # Definição de rotas
│   ├── applications.js
│   ├── partners.js
│   └── admin.js
├── services/            # Serviços reutilizáveis
├── .env                 # Variáveis de ambiente
├── .env.example         # Exemplo de variáveis
├── package.json
├── server.js            # Servidor principal
├── test-endpoints.js    # Suite de testes
└── README-API.md        # Esta documentação
```

---

## 🔐 Variáveis de Ambiente

```bash
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/flexcredi"

# Servidor
PORT=3001
NODE_ENV=development

# APIs externas
EXPERIAN_API_KEY=your_experian_key
PAYBRIGHT_API_KEY=your_paybright_key
PAYBRIGHT_ACCOUNT_ID=your_account_id

# Secrets
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Deploy

### Railway (Recomendado)

1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Railway detecta automaticamente Node.js
4. Deploy automático em cada push

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build
docker build -t flexcredi-backend .

# Run
docker run -p 3001:3001 --env-file .env flexcredi-backend
```

---

## 📝 Próximas Implementações

### Sprint 2
- [ ] Endpoints de documentos
- [ ] Geração de contratos (PDF)
- [ ] Upload de arquivos (Cloudinary)
- [ ] AgentDocumentChecker

### Sprint 3
- [ ] Integração ACH (PayBright)
- [ ] Sistema de recebíveis futuros
- [ ] Endpoints de pagamentos
- [ ] Painel do parceiro

### Sprint 4
- [ ] Agentes autônomos restantes
- [ ] Master-Agent (auto-criação)
- [ ] Editor visual de agentes
- [ ] Analytics avançado

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

© 2024 FLEXCREDI. Todos os direitos reservados.

---

## 🆘 Suporte

- **Email:** suporte@flexcredi.com
- **GitHub Issues:** [github.com/flexcredi/backend/issues](https://github.com/flexcredi/backend/issues)
- **Documentação completa:** [docs.flexcredi.com](https://docs.flexcredi.com)

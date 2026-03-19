# FLEXCREDI API v4.0 - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Endpoints](#endpoints)
   - [Health & Test](#health--test)
   - [Partners](#partners)
   - [Applications](#applications)
   - [Admin](#admin)
4. [Modelos de Dados](#modelos-de-dados)
5. [Códigos de Status](#códigos-de-status)
6. [Exemplos](#exemplos)

---

## Visão Geral

**Base URL (Desenvolvimento):** `http://localhost:3001`  
**Base URL (Produção):** `https://web-production-e227.up.railway.app`  
**Versão:** 4.0.0  
**Formato:** JSON  
**Charset:** UTF-8

### Recursos Disponíveis

- ✅ **Partners** - Gestão de parceiros (cadastro, aprovação, consulta)
- ✅ **Applications** - Gestão de aplicações de crédito (criação, análise, aprovação)
- ✅ **Admin** - Dashboard e estatísticas administrativas
- ✅ **Credit Analysis** - Análise automatizada via AgentCreditAnalyzer
- ✅ **EventBus** - Sistema de eventos para agentes autônomos

---

## Autenticação

⚠️ **Versão atual:** Autenticação não implementada (em desenvolvimento)

**Versão futura:** OAuth 2.0 / JWT tokens

```bash
# Futuro
Authorization: Bearer <token>
```

---

## Endpoints

### Health & Test

#### GET `/health`
Verifica status do servidor.

**Response 200:**
```json
{
  "status": "ok",
  "version": "4.0.0",
  "timestamp": "2026-02-21T20:00:00.000Z",
  "uptime": 1234.56,
  "environment": "development",
  "features": {
    "partners": "enabled",
    "applications": "enabled",
    "creditAnalysis": "enabled",
    "agents": "enabled",
    "eventBus": "enabled"
  }
}
```

#### GET `/api/test`
Endpoint de teste simples.

**Response 200:**
```json
{
  "message": "API FLEXCREDI v4.0 está funcionando!",
  "timestamp": "2026-02-21T20:00:00.000Z"
}
```

---

### Partners

#### POST `/api/partners`
Cadastra novo parceiro.

**Request Body:**
```json
{
  // Dados da empresa (obrigatórios)
  "companyName": "Loja Exemplo LTDA",
  "tradeName": "Loja Exemplo",
  "cnpj": "12345678000199",
  "email": "contato@lojaexemplo.com",
  "phone": "(11) 98765-4321",
  
  // Endereço (obrigatórios)
  "address": "Rua Exemplo, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  
  // Representante legal (obrigatórios)
  "legalRepName": "João Silva",
  "legalRepCpf": "12345678900",
  "legalRepEmail": "joao@lojaexemplo.com",
  "legalRepPhone": "(11) 91234-5678",
  
  // Dados bancários (opcionais)
  "bankName": "Banco Exemplo",
  "bankBranch": "1234",
  "bankAccount": "56789-0",
  "bankAccountType": "CHECKING",
  "bankRoutingNumber": "123",
  
  // Informações financeiras (opcionais)
  "monthlyRevenue": 50000,
  "monthlyReceivables": 30000
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Parceiro cadastrado com sucesso",
  "data": {
    "id": "uuid",
    "companyName": "Loja Exemplo LTDA",
    "status": "PENDING",
    "flexCrediFeeRate": 0.03,
    "createdAt": "2026-02-21T20:00:00.000Z"
  }
}
```

#### GET `/api/partners`
Lista parceiros com filtros e paginação.

**Query Parameters:**
- `status` - PENDING | APPROVED | REJECTED | SUSPENDED
- `limit` - Limite de registros (default: 50, max: 100)
- `offset` - Offset para paginação (default: 0)
- `sortBy` - Campo para ordenação (default: createdAt)
- `sortOrder` - asc | desc (default: desc)

**Example:**
```bash
GET /api/partners?status=PENDING&limit=20&sortBy=companyName&sortOrder=asc
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "companyName": "Loja Exemplo LTDA",
      "tradeName": "Loja Exemplo",
      "cnpj": "12345678000199",
      "status": "PENDING",
      "createdAt": "2026-02-21T20:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### GET `/api/partners/:id`
Obtém detalhes completos de um parceiro.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyName": "Loja Exemplo LTDA",
    "tradeName": "Loja Exemplo",
    "cnpj": "12345678000199",
    "email": "contato@lojaexemplo.com",
    "phone": "(11) 98765-4321",
    "status": "APPROVED",
    "flexCrediFeeRate": 0.03,
    "creditLimit": 100000,
    "_count": {
      "applications": 45,
      "receivables": 120,
      "documents": 8
    },
    "applications": [...],
    "receivables": [...],
    "createdAt": "2026-02-21T20:00:00.000Z",
    "approvedAt": "2026-02-22T14:30:00.000Z"
  }
}
```

#### PUT `/api/partners/:id`
Atualiza dados do parceiro.

**Request Body:** (campos a serem atualizados)
```json
{
  "tradeName": "Novo Nome",
  "phone": "(11) 99999-9999",
  "monthlyRevenue": 75000
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Parceiro atualizado",
  "data": { ... }
}
```

#### PUT `/api/partners/:id/approve`
Aprova um parceiro (admin).

**Request Body:**
```json
{
  "creditLimit": 100000,
  "adminId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Parceiro aprovado",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "creditLimit": 100000,
    "approvedAt": "2026-02-21T20:00:00.000Z"
  }
}
```

#### PUT `/api/partners/:id/reject`
Rejeita um parceiro.

**Request Body:**
```json
{
  "rejectionReason": "Documentação incompleta",
  "adminId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Parceiro rejeitado",
  "data": {
    "id": "uuid",
    "status": "REJECTED",
    "rejectionReason": "Documentação incompleta"
  }
}
```

---

### Applications

#### POST `/api/applications`
Cria nova aplicação de crédito.

**Request Body:**
```json
{
  // Dados do cliente (obrigatórios)
  "clientName": "Maria Silva",
  "clientEmail": "maria@example.com",
  "clientPhone": "(11) 98765-4321",
  "clientCpf": "12345678900",
  
  // Endereço do cliente
  "clientAddress": "Rua Exemplo, 456",
  "clientCity": "São Paulo",
  "clientState": "SP",
  "clientZipCode": "01234-567",
  
  // Dados da aplicação (obrigatórios)
  "desiredAmount": 25000,
  "purpose": "Renovação de estoque",
  "monthlyIncome": 8000,
  
  // Dados profissionais
  "employmentStatus": "EMPLOYED",
  "employer": "Empresa ABC",
  "occupation": "Gerente",
  
  // Parceiro (obrigatório)
  "partnerId": "uuid"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Aplicação criada e enviada para análise",
  "data": {
    "id": "uuid",
    "clientName": "Maria Silva",
    "desiredAmount": 25000,
    "status": "PENDING",
    "partner": {
      "companyName": "Loja Exemplo LTDA"
    },
    "createdAt": "2026-02-21T20:00:00.000Z"
  }
}
```

**⚡ Análise Automática:**
Após criação, a aplicação é automaticamente enviada para o `AgentCreditAnalyzer` via EventBus, que:
1. Busca regras de taxas configuradas
2. Consulta score de crédito (mock Experian)
3. Calcula DTI (Debt-to-Income)
4. Determina taxa de juros aplicável
5. Calcula parcela mensal
6. Auto-aprova (se score > 750) ou deixa pendente

#### GET `/api/applications`
Lista aplicações com filtros e paginação.

**Query Parameters:**
- `status` - PENDING | APPROVED | REJECTED | ACTIVE | COMPLETED
- `partnerId` - Filtrar por parceiro
- `limit` - Limite de registros (default: 50, max: 100)
- `offset` - Offset para paginação (default: 0)
- `sortBy` - Campo para ordenação (default: createdAt)
- `sortOrder` - asc | desc (default: desc)

**Example:**
```bash
GET /api/applications?status=PENDING&partnerId=uuid&limit=20
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clientName": "Maria Silva",
      "clientEmail": "maria@example.com",
      "desiredAmount": 25000,
      "approvedAmount": 25000,
      "status": "APPROVED",
      "partner": {
        "companyName": "Loja Exemplo LTDA"
      },
      "user": {
        "name": "Maria Silva",
        "email": "maria@example.com"
      },
      "createdAt": "2026-02-21T20:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 234,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### GET `/api/applications/:id`
Obtém detalhes completos de uma aplicação.

**Includes:** partner, user, documents, contract, creditReport, receivables, partnerPayments, achPayments

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clientName": "Maria Silva",
    "desiredAmount": 25000,
    "approvedAmount": 25000,
    "interestRate": 0.185,
    "termMonths": 24,
    "monthlyPayment": 1287.50,
    "status": "APPROVED",
    "creditScore": 785,
    "riskLevel": "LOW",
    "partner": { ... },
    "user": { ... },
    "documents": [ ... ],
    "contract": { ... },
    "creditReport": { ... },
    "createdAt": "2026-02-21T20:00:00.000Z",
    "approvedAt": "2026-02-21T21:15:00.000Z"
  }
}
```

#### PUT `/api/applications/:id/approve`
Aprova aplicação manualmente (admin).

**Request Body:**
```json
{
  "approvedAmount": 25000,
  "interestRate": 0.185,
  "termMonths": 24,
  "reviewNotes": "Cliente com bom histórico",
  "adminId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Aplicação aprovada",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "approvedAmount": 25000,
    "interestRate": 0.185,
    "monthlyPayment": 1287.50,
    "approvedAt": "2026-02-21T20:00:00.000Z"
  }
}
```

#### PUT `/api/applications/:id/reject`
Rejeita aplicação.

**Request Body:**
```json
{
  "rejectionReason": "Score de crédito baixo",
  "adminId": "uuid"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Aplicação rejeitada",
  "data": {
    "id": "uuid",
    "status": "REJECTED",
    "rejectionReason": "Score de crédito baixo"
  }
}
```

---

### Admin

#### GET `/api/admin/dashboard`
Estatísticas gerais do sistema.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "applications": {
        "total": 234,
        "pending": 23,
        "approved": 156,
        "rejected": 55,
        "totalApprovedAmount": 3850000
      },
      "partners": {
        "total": 45,
        "approved": 38,
        "pending": 7
      },
      "users": {
        "total": 189
      },
      "contracts": {
        "total": 156,
        "active": 142
      },
      "receivables": {
        "total": 450,
        "pending": 120,
        "totalAmount": 1200000
      },
      "achPayments": {
        "total": 890,
        "pending": 45
      }
    },
    "recent": {
      "applications": [ ... ],
      "partners": [ ... ]
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

#### GET `/api/admin/stats/monthly`
Estatísticas mensais para gráficos.

**Query Parameters:**
- `months` - Número de meses (default: 6)

**Example:**
```bash
GET /api/admin/stats/monthly?months=12
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "month": "2025-09",
      "total": 45,
      "approved": 32,
      "rejected": 8,
      "pending": 5,
      "totalAmount": 750000
    },
    {
      "month": "2025-10",
      "total": 52,
      "approved": 38,
      "rejected": 10,
      "pending": 4,
      "totalAmount": 890000
    }
  ]
}
```

#### GET `/api/admin/system-settings`
Busca configurações do sistema.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "min_credit_score": {
      "value": "600",
      "type": "number",
      "description": "Score mínimo para aprovação"
    },
    "max_dti_ratio": {
      "value": "0.43",
      "type": "number",
      "description": "DTI máximo permitido"
    },
    "partner_fee_rate": {
      "value": "0.03",
      "type": "number",
      "description": "Taxa padrão do parceiro"
    }
  }
}
```

#### PUT `/api/admin/system-settings/:key`
Atualiza uma configuração do sistema.

**Request Body:**
```json
{
  "value": "650"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Configuração atualizada",
  "data": {
    "key": "min_credit_score",
    "value": "650",
    "type": "number"
  }
}
```

---

## Modelos de Dados

### Partner
```typescript
{
  id: string (UUID)
  companyName: string
  tradeName?: string
  cnpj: string (unique)
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  legalRepName: string
  legalRepCpf: string
  legalRepEmail: string
  legalRepPhone: string
  bankName?: string
  bankBranch?: string
  bankAccount?: string
  bankAccountType?: string
  bankRoutingNumber?: string
  monthlyRevenue?: number
  monthlyReceivables?: number
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"
  flexCrediFeeRate: number (default: 0.03)
  creditLimit?: number
  approvedAt?: DateTime
  approvedBy?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Application
```typescript
{
  id: string (UUID)
  userId: string (FK → User)
  partnerId: string (FK → Partner)
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCpf: string
  clientAddress?: string
  clientCity?: string
  clientState?: string
  clientZipCode?: string
  desiredAmount: number
  approvedAmount?: number
  purpose: string
  monthlyIncome: number
  employmentStatus?: string
  employer?: string
  occupation?: string
  interestRate?: number
  termMonths?: number
  monthlyPayment?: number
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED"
  creditScore?: number
  riskLevel?: string
  riskScore?: number
  approvalNotes?: string
  rejectionReason?: string
  approvedBy?: string
  approvedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### User
```typescript
{
  id: string (UUID)
  email: string (unique)
  phone?: string
  name: string
  cpf?: string
  dateOfBirth?: DateTime
  address?: string
  city?: string
  state?: string
  zipCode?: string
  nationality?: string
  maritalStatus?: string
  occupation?: string
  monthlyIncome?: number
  employer?: string
  employmentStatus?: string
  role: "CLIENT" | "PARTNER" | "ADMIN"
  isActive: boolean (default: true)
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Códigos de Status

### Sucesso (2xx)
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso

### Erros do Cliente (4xx)
- `400 Bad Request` - Dados inválidos ou campos obrigatórios faltando
- `401 Unauthorized` - Autenticação necessária
- `403 Forbidden` - Permissão negada
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: CNPJ já cadastrado)
- `429 Too Many Requests` - Rate limit excedido

### Erros do Servidor (5xx)
- `500 Internal Server Error` - Erro interno do servidor
- `503 Service Unavailable` - Serviço temporariamente indisponível

---

## Exemplos

### Exemplo 1: Cadastrar Parceiro e Criar Aplicação

```bash
# 1. Cadastrar parceiro
curl -X POST http://localhost:3001/api/partners \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Loja Tech LTDA",
    "cnpj": "98765432000199",
    "email": "contato@lojatech.com",
    "phone": "(11) 91234-5678",
    "address": "Av. Paulista, 1000",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-100",
    "legalRepName": "Ana Costa",
    "legalRepCpf": "98765432100",
    "legalRepEmail": "ana@lojatech.com",
    "legalRepPhone": "(11) 99876-5432"
  }'

# Retorna: { "success": true, "data": { "id": "partner-uuid", ... } }

# 2. Aprovar parceiro (admin)
curl -X PUT http://localhost:3001/api/partners/partner-uuid/approve \
  -H "Content-Type: application/json" \
  -d '{
    "creditLimit": 200000
  }'

# 3. Cliente cria aplicação escolhendo o parceiro
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Pedro Santos",
    "clientEmail": "pedro@example.com",
    "clientPhone": "(11) 98765-1234",
    "clientCpf": "11122233344",
    "desiredAmount": 30000,
    "purpose": "Compra de equipamentos",
    "monthlyIncome": 12000,
    "partnerId": "partner-uuid"
  }'

# Retorna: aplicação criada e automaticamente enviada para análise
```

### Exemplo 2: Consultar Dashboard Admin

```bash
# Dashboard completo
curl http://localhost:3001/api/admin/dashboard

# Estatísticas mensais (últimos 6 meses)
curl http://localhost:3001/api/admin/stats/monthly

# Configurações do sistema
curl http://localhost:3001/api/admin/system-settings
```

### Exemplo 3: Listar e Filtrar Aplicações

```bash
# Listar todas aplicações pendentes
curl "http://localhost:3001/api/applications?status=PENDING"

# Listar aplicações de um parceiro específico
curl "http://localhost:3001/api/applications?partnerId=partner-uuid"

# Listar 10 aplicações ordenadas por valor (maior→menor)
curl "http://localhost:3001/api/applications?limit=10&sortBy=desiredAmount&sortOrder=desc"

# Detalhes completos de uma aplicação
curl "http://localhost:3001/api/applications/app-uuid"
```

---

## Próximos Passos (Roadmap)

### Sprint 2 (Documentos e Contratos)
- ✅ POST `/api/documents/upload` - Upload de documentos
- ✅ GET `/api/documents/:id` - Obter documento
- ✅ PUT `/api/documents/:id/review` - Revisar documento (admin)
- ✅ POST `/api/contracts/generate` - Gerar contrato
- ✅ PUT `/api/contracts/:id/sign` - Assinar contrato
- ✅ AgentDocumentChecker - Validação automatizada

### Sprint 3 (Recebíveis e ACH)
- ✅ POST `/api/receivables` - Lançar recebíveis futuros
- ✅ GET `/api/receivables` - Listar recebíveis
- ✅ PUT `/api/receivables/:id/discount` - Descontar recebível
- ✅ POST `/api/ach-payments/authorize` - Autorizar ACH
- ✅ GET `/api/ach-payments/:id/status` - Status do pagamento

### Sprint 4 (Agentes Autônomos)
- ✅ MasterAgent - Orquestrador de agentes
- ✅ AgentContractGenerator - Geração de contratos
- ✅ AgentReceivableManager - Gestão de recebíveis
- ✅ AgentAchProcessor - Processamento ACH
- ✅ AgentNotifier - Notificações

---

## Suporte

**Documentação:** `/home/user/webapp/PLANEJAMENTO-V4-FINAL-COMPLETO.md`  
**GitHub:** `https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM`  
**Versão:** 4.0.0  
**Última atualização:** 2026-02-21

---

**FLEXCREDI** © 2024-2026 - Sistema Administrativo de Crédito  
*Built with ❤️ by Claude Code*

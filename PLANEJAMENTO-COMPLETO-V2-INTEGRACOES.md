# 🔄 PLANEJAMENTO ATUALIZADO - INTEGRAÇÕES + SISTEMA DE PARCEIROS

**Data de Atualização**: 21/02/2026  
**Versão**: 2.0  
**Novas Funcionalidades**: 3 sistemas críticos adicionados

---

## 🆕 NOVOS REQUISITOS IDENTIFICADOS

### **1. Integrações Externas via API** 🔌

#### **A) Sistema de ACH (Automated Clearing House)**
**Objetivo**: Gerar débitos automáticos na conta bancária do cliente

**Providers Sugeridos:**
- **Plaid** (recomendado) - https://plaid.com
- **Stripe ACH** - https://stripe.com/payments/ach-debit
- **Dwolla** - https://www.dwolla.com

**Funcionalidades:**
- ✅ Conectar conta bancária do cliente
- ✅ Validar dados bancários (routing number + account number)
- ✅ Gerar débitos automáticos mensais
- ✅ Notificar falhas de débito
- ✅ Gerenciar devoluções (chargebacks)

#### **B) Sistema de Análise de Crédito**
**Objetivo**: Análise real de crédito do cliente com retorno de score e recomendações

**Providers Sugeridos:**
- **Experian API** - https://www.experian.com/developer/
- **Equifax API** - https://www.equifax.com/business/
- **TransUnion API** - https://www.transunion.com/
- **Plaid Income & Assets** - Verificação de renda

**Dados Retornados:**
- Credit Score (300-850)
- Payment History (histórico de pagamentos)
- Credit Utilization (utilização de crédito)
- Length of Credit History
- Recent Credit Inquiries
- Derogatory Marks (negativações)
- Debt-to-Income Ratio

**Agente vai usar esses dados para:**
- Calcular taxa de juros personalizada
- Definir limite de crédito aprovado
- Determinar prazo máximo
- Ajustar condições do empréstimo

---

### **2. Sistema de Parceiros (Partner Dashboard)** 🤝

#### **Conceito:**
Intermediários de crédito que usam a plataforma FlexCredi para oferecer financiamento aos seus clientes.

**Exemplo de Parceiro:**
- Loja de móveis que oferece crediário
- Concessionária de veículos
- Clínica médica/dentária
- Empresa de reformas
- E-commerce

**Fluxo:**
1. Parceiro cadastra cliente na plataforma
2. Cliente preenche aplicação de crédito
3. FlexCredi analisa e aprova
4. Cliente recebe o crédito
5. Parceiro recebe o valor (menos fee da FlexCredi)
6. Cliente paga parcelas mensais via ACH
7. FlexCredi repassa valores ao parceiro conforme recebe

---

## 🏗️ ARQUITETURA ATUALIZADA

```
┌────────────────────────────────────────────────────────────┐
│                    FLEXCREDI ECOSYSTEM                     │
└────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   CLIENTE    │  │   PARCEIRO   │  │    ADMIN     │
│  Dashboard   │  │  Dashboard   │  │  Dashboard   │
└──────────────┘  └──────────────┘  └──────────────┘
       │                 │                  │
       └─────────────────┴──────────────────┘
                         │
              ┌──────────▼──────────┐
              │   FLEXCREDI API     │
              │   (Railway)         │
              └──────────┬──────────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
   ┌───▼───┐      ┌──────▼──────┐   ┌─────▼─────┐
   │ Banco │      │   Agentes   │   │ Integrações│
   │Supabase│     │  Autônomos  │   │  Externas  │
   └───────┘      └─────────────┘   └─────┬─────┘
                                           │
                         ┌─────────────────┼─────────────────┐
                         │                 │                 │
                   ┌─────▼─────┐    ┌──────▼──────┐   ┌─────▼─────┐
                   │  Credit   │    │     ACH     │   │   Plaid   │
                   │  Bureau   │    │   System    │   │ (Banking) │
                   │(Experian) │    │  (Stripe)   │   └───────────┘
                   └───────────┘    └─────────────┘
```

---

## 📊 MODELO DE DADOS ATUALIZADO

### **Nova Tabela: Partners**

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados da Empresa
  company_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  ein VARCHAR(20) NOT NULL UNIQUE, -- EIN ou CNPJ
  company_type VARCHAR(100), -- LLC, Corporation, Individual, etc.
  
  -- Contato
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL UNIQUE,
  contact_phone VARCHAR(50),
  
  -- Endereço
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'USA',
  
  -- Informações Bancárias
  bank_name VARCHAR(255),
  routing_number VARCHAR(20),
  account_number VARCHAR(50),
  account_type VARCHAR(20), -- checking, savings
  
  -- Status e Aprovação
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, active, suspended, rejected
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES admin_users(id),
  
  -- Comissões e Taxas
  commission_rate DECIMAL(5,2) DEFAULT 5.00, -- 5% de comissão padrão
  fee_structure JSONB, -- Estrutura de taxas personalizada
  payment_terms VARCHAR(50) DEFAULT 'net_30', -- net_15, net_30, net_60
  
  -- Limites
  monthly_volume_limit DECIMAL(15,2), -- Limite mensal de crédito
  single_transaction_limit DECIMAL(15,2), -- Limite por transação
  
  -- Documentação
  documents JSONB, -- Array de documentos (license, tax_id, etc.)
  
  -- Login
  password_hash VARCHAR(255),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Métricas
  total_clients INTEGER DEFAULT 0,
  total_volume DECIMAL(15,2) DEFAULT 0.00,
  total_commission DECIMAL(15,2) DEFAULT 0.00
);

CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_email ON partners(contact_email);
```

### **Atualizar Tabela: Users (Clientes)**

```sql
ALTER TABLE users ADD COLUMN partner_id UUID REFERENCES partners(id);
ALTER TABLE users ADD COLUMN referred_by_partner BOOLEAN DEFAULT false;

CREATE INDEX idx_users_partner ON users(partner_id);
```

### **Nova Tabela: Partner Transactions**

```sql
CREATE TABLE partner_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  client_id UUID REFERENCES users(id),
  application_id UUID REFERENCES applications(id),
  contract_id UUID REFERENCES contracts(id),
  
  -- Valores
  principal_amount DECIMAL(15,2) NOT NULL,
  commission_amount DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  
  -- Status do Repasse
  payout_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  payout_date TIMESTAMP,
  payout_method VARCHAR(50), -- ach, wire, check
  
  -- Referência Externa
  external_transaction_id VARCHAR(255), -- ID do sistema de pagamento
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_transactions_partner ON partner_transactions(partner_id);
CREATE INDEX idx_partner_transactions_status ON partner_transactions(payout_status);
```

### **Nova Tabela: ACH Payments**

```sql
CREATE TABLE ach_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) NOT NULL,
  client_id UUID REFERENCES users(id) NOT NULL,
  installment_number INTEGER NOT NULL,
  
  -- Dados Bancários
  bank_account_id VARCHAR(255), -- ID do Plaid/Stripe
  routing_number VARCHAR(20),
  account_number_last4 VARCHAR(4),
  
  -- Valores
  scheduled_amount DECIMAL(10,2) NOT NULL,
  actual_amount DECIMAL(10,2),
  late_fee DECIMAL(10,2) DEFAULT 0.00,
  
  -- Datas
  scheduled_date DATE NOT NULL,
  initiated_at TIMESTAMP,
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, initiated, completed, failed, returned
  failure_reason TEXT,
  return_code VARCHAR(20), -- ACH return codes (R01, R02, etc.)
  
  -- Tentativas
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_date DATE,
  
  -- Referência Externa
  external_payment_id VARCHAR(255), -- ID do Stripe/Plaid
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ach_payments_status ON ach_payments(status);
CREATE INDEX idx_ach_payments_scheduled ON ach_payments(scheduled_date);
CREATE INDEX idx_ach_payments_contract ON ach_payments(contract_id);
```

### **Nova Tabela: Credit Reports**

```sql
CREATE TABLE credit_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  application_id UUID REFERENCES applications(id),
  
  -- Provider
  provider VARCHAR(50) NOT NULL, -- experian, equifax, transunion
  external_report_id VARCHAR(255),
  
  -- Score
  credit_score INTEGER NOT NULL,
  score_range VARCHAR(50), -- 300-850
  score_factors JSONB, -- Fatores que afetaram o score
  
  -- Histórico
  payment_history JSONB,
  credit_utilization DECIMAL(5,2),
  total_accounts INTEGER,
  open_accounts INTEGER,
  derogatory_marks INTEGER,
  
  -- Consultas Recentes
  hard_inquiries INTEGER,
  soft_inquiries INTEGER,
  
  -- Dívidas
  total_debt DECIMAL(15,2),
  monthly_debt_payments DECIMAL(10,2),
  debt_to_income_ratio DECIMAL(5,2),
  
  -- Recomendações
  recommended_interest_rate DECIMAL(5,2),
  recommended_max_amount DECIMAL(15,2),
  recommended_term_months INTEGER,
  risk_level VARCHAR(20), -- low, medium, high, very_high
  
  -- Dados Brutos
  raw_report JSONB, -- Relatório completo do bureau
  
  -- Auditoria
  pulled_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Reports geralmente expiram em 30-90 dias
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_credit_reports_user ON credit_reports(user_id);
CREATE INDEX idx_credit_reports_application ON credit_reports(application_id);
```

---

## 🤖 NOVOS AGENTES AUTÔNOMOS

### **Agente 8: Integrador de ACH**
**Nome**: `AgentACHIntegrator`  
**ID**: `agent-ach-integrator-001`

```javascript
{
  id: "agent-ach-integrator-001",
  name: "Integrador de ACH",
  type: "ach_integrator",
  status: "active",
  
  triggers: [
    "contract.signed",
    "payment.due",
    "payment.failed"
  ],
  
  actions: [
    "setup_ach_mandate",
    "initiate_ach_payment",
    "handle_ach_return",
    "retry_failed_payment",
    "notify_payment_status"
  ],
  
  parameters: {
    provider: "stripe", // ou "plaid", "dwolla"
    apiKey: process.env.STRIPE_API_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    
    achSettings: {
      mandateText: "I authorize FlexCredi to debit my account",
      microDepositVerification: true, // Verificação com micro-depósitos
      instantVerification: true, // Verificação instantânea via Plaid
      maxRetries: 3,
      retryDelayDays: 3
    },
    
    returnCodes: {
      "R01": "Insufficient funds",
      "R02": "Account closed",
      "R03": "No account/unable to locate",
      "R04": "Invalid account number",
      "R10": "Customer advises not authorized"
    }
  },
  
  workflow: {
    setupACH: [
      "1. Cliente assina contrato",
      "2. Solicitar dados bancários (routing + account)",
      "3. Validar conta via micro-depósitos ou Plaid",
      "4. Criar mandato ACH",
      "5. Agendar primeiro débito"
    ],
    
    initiatePayment: [
      "1. 3 dias antes do vencimento, iniciar débito",
      "2. Enviar para processador ACH",
      "3. Monitorar status",
      "4. Atualizar registro no banco",
      "5. Notificar cliente"
    ],
    
    handleFailure: [
      "1. Receber notificação de falha",
      "2. Analisar código de retorno",
      "3. Se R01 (sem fundos), agendar retry",
      "4. Se R02/R03/R04 (conta inválida), notificar admin",
      "5. Se R10 (não autorizado), bloquear débitos"
    ]
  },
  
  communication: {
    notifyAgents: [
      "agent-notifier-001", // Notificar cliente
      "agent-payment-manager-001" // Atualizar agenda
    ],
    notifyAdmin: true,
    logActivity: true
  }
}
```

---

### **Agente 9: Analisador de Crédito Externo**
**Nome**: `AgentCreditBureauAnalyzer`  
**ID**: `agent-credit-bureau-001`

```javascript
{
  id: "agent-credit-bureau-001",
  name: "Analisador de Crédito (Bureau)",
  type: "credit_bureau_analyzer",
  status: "active",
  
  triggers: [
    "application.created",
    "application.requires_review"
  ],
  
  actions: [
    "pull_credit_report",
    "analyze_credit_data",
    "calculate_personalized_terms",
    "update_application_terms",
    "store_credit_report"
  ],
  
  parameters: {
    provider: "experian", // ou "equifax", "transunion"
    apiKey: process.env.EXPERIAN_API_KEY,
    apiSecret: process.env.EXPERIAN_API_SECRET,
    sandbox: false, // true para testes
    
    creditPolicyRules: {
      minScore: 600,
      maxDebtToIncomeRatio: 0.43, // 43% da renda
      maxRecentInquiries: 5,
      maxDerogatoryMarks: 2
    },
    
    interestRateCalculation: {
      baseRate: 12.0, // 12% base
      
      scoreAdjustments: {
        "750-850": -4.0, // -4% para excelente crédito
        "700-749": -2.0, // -2% para bom crédito
        "650-699": 0.0,  // taxa base
        "600-649": +3.0, // +3% para crédito regular
        "550-599": +6.0, // +6% para crédito ruim
        "300-549": +10.0 // +10% ou rejeitar
      },
      
      utilizationAdjustments: {
        "0-30%": -1.0,   // Baixa utilização = desconto
        "31-50%": 0.0,
        "51-75%": +1.5,
        "76-100%": +3.0  // Alta utilização = aumento
      },
      
      inquiriesAdjustment: {
        "0-2": 0.0,
        "3-5": +1.0,
        "6+": +2.5
      }
    },
    
    loanAmountCalculation: {
      basedOn: "monthly_income",
      maxDebtToIncomeRatio: 0.43,
      
      scoreMultipliers: {
        "750-850": 5.0,  // Até 5x a renda mensal
        "700-749": 4.0,
        "650-699": 3.0,
        "600-649": 2.0,
        "550-599": 1.5,
        "300-549": 1.0
      }
    },
    
    termCalculation: {
      maxTermByScore: {
        "750-850": 60, // 60 meses
        "700-749": 48,
        "650-699": 36,
        "600-649": 24,
        "550-599": 12
      }
    }
  },
  
  workflow: {
    analyzeCreditFlow: [
      "1. Receber aplicação do cliente",
      "2. Verificar se cliente autorizou pull de crédito",
      "3. Chamar API do Credit Bureau",
      "4. Receber relatório completo",
      "5. Extrair score e fatores",
      "6. Calcular taxa de juros personalizada",
      "7. Calcular valor máximo aprovado",
      "8. Calcular prazo máximo",
      "9. Atualizar aplicação com novos termos",
      "10. Enviar para aprovação final"
    ]
  },
  
  exampleCalculation: {
    input: {
      clientMonthlyIncome: 5000,
      requestedAmount: 25000,
      requestedTerm: 36
    },
    
    creditReport: {
      score: 720,
      utilization: 35,
      inquiries: 2,
      debtToIncomeRatio: 0.28
    },
    
    calculation: {
      baseRate: 12.0,
      scoreAdjustment: -2.0, // 700-749
      utilizationAdjustment: 0.0, // 31-50%
      inquiriesAdjustment: 0.0, // 0-2
      
      finalRate: 10.0, // 12 - 2 = 10%
      
      maxLoanAmount: 20000, // 5000 * 4.0 (multiplier)
      approvedAmount: 20000, // menor entre requested e max
      
      maxTerm: 48, // score 720
      approvedTerm: 36 // requested está dentro do limite
    },
    
    output: {
      approved: true,
      approvedAmount: 20000,
      interestRate: 10.0,
      termMonths: 36,
      monthlyPayment: 645.34,
      totalAmount: 23232.24,
      riskLevel: "low"
    }
  },
  
  communication: {
    notifyAgents: [
      "agent-analyzer-001", // Re-analisar com dados reais
      "agent-notifier-001" // Notificar cliente dos termos
    ],
    notifyAdmin: true,
    storeReport: true,
    logActivity: true
  }
}
```

---

### **Agente 10: Gestor de Parceiros**
**Nome**: `AgentPartnerManager`  
**ID**: `agent-partner-manager-001`

```javascript
{
  id: "agent-partner-manager-001",
  name: "Gestor de Parceiros",
  type: "partner_manager",
  status: "active",
  
  triggers: [
    "partner.registered",
    "client.referred_by_partner",
    "contract.signed",
    "payment.received"
  ],
  
  actions: [
    "approve_partner",
    "calculate_commission",
    "process_payout",
    "generate_partner_report",
    "notify_partner"
  ],
  
  parameters: {
    defaultCommissionRate: 5.0, // 5% padrão
    payoutSchedule: "monthly", // weekly, bi-weekly, monthly
    minimumPayout: 100.00, // Mínimo para processar repasse
    
    approvalCriteria: {
      requiresBusinessLicense: true,
      requiresTaxId: true,
      requiresBankAccount: true,
      manualReviewRequired: true
    },
    
    commissionStructure: {
      "0-10000": 5.0,    // Até $10k = 5%
      "10001-50000": 6.0, // $10k-$50k = 6%
      "50001-100000": 7.0, // $50k-$100k = 7%
      "100001+": 8.0      // Acima $100k = 8%
    }
  },
  
  workflow: {
    approvePartner: [
      "1. Parceiro se cadastra",
      "2. Enviar email de verificação",
      "3. Validar documentos (EIN, Business License)",
      "4. Verificar dados bancários",
      "5. Admin revisa e aprova",
      "6. Enviar credenciais de acesso",
      "7. Configurar comissão personalizada (se necessário)"
    ],
    
    calculateCommission: [
      "1. Cliente assina contrato",
      "2. Verificar se cliente foi referido por parceiro",
      "3. Calcular comissão baseada no valor principal",
      "4. Criar registro de transação do parceiro",
      "5. Agendar repasse conforme política"
    ],
    
    processPayout: [
      "1. No dia de repasse (ex: fim do mês)",
      "2. Somar todas as comissões do parceiro",
      "3. Verificar se atingiu mínimo ($100)",
      "4. Gerar ACH para conta do parceiro",
      "5. Atualizar status das transações",
      "6. Enviar relatório detalhado por email"
    ]
  },
  
  exampleCommission: {
    scenario: "Parceiro referiu cliente que pegou $25,000 emprestado",
    
    calculation: {
      principalAmount: 25000,
      commissionRate: 5.0, // Parceiro está na faixa 0-10k de volume
      commissionAmount: 1250, // 25000 * 0.05
      
      payoutSchedule: "monthly",
      payoutDate: "2026-03-01",
      payoutStatus: "pending"
    },
    
    partnerEarns: 1250
  },
  
  communication: {
    notifyAgents: [
      "agent-ach-integrator-001", // Processar repasse via ACH
      "agent-notifier-001" // Notificar parceiro
    ],
    notifyAdmin: true,
    generateInvoice: true,
    logActivity: true
  }
}
```

---

## 📱 DASHBOARDS ATUALIZADOS

### **1. Dashboard do Cliente** (mantém o mesmo)
- Já existe e está perfeito
- Não precisa de alterações

### **2. Dashboard do Admin** (expansão)
- Adicionar seção "Parceiros"
- Adicionar seção "Integrações"
- Adicionar seção "ACH Payments"
- Adicionar seção "Credit Reports"

### **3. Dashboard do Parceiro** (NOVO!)

```
┌─────────────────────────────────────────────────────────┐
│  🤝 PARTNER DASHBOARD - [Nome do Parceiro]             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 VISÃO GERAL                                         │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │ 42 Clients│ $123,500 │ $6,175  │ 96% Taxa│         │
│  │ Ativos   │ Volume   │ Comissão│ Aprovação│         │
│  └──────────┴──────────┴──────────┴──────────┘         │
│                                                         │
│  💰 RECEBÍVEIS                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Próximo Repasse: 01/03/2026                     │   │
│  │ Valor Previsto: $6,175.00                       │   │
│  │                                                 │   │
│  │ 📅 CALENDÁRIO DE PARCELAS                       │   │
│  │ ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐   │   │
│  │ │ SEG │ TER │ QUA │ QUI │ SEX │ SAB │ DOM │   │   │
│  │ ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤   │   │
│  │ │  1  │  2  │  3🟢│  4  │  5  │  6  │  7  │   │   │
│  │ │  8  │  9  │ 10🟢│ 11  │ 12  │ 13  │ 14  │   │   │
│  │ │ 15  │ 16  │ 17🟡│ 18  │ 19  │ 20  │ 21  │   │   │
│  │ └─────┴─────┴─────┴─────┴─────┴─────┴─────┘   │   │
│  │                                                 │   │
│  │ 🟢 Pago  🟡 Pendente  🔴 Atrasado               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  👥 CLIENTES RECENTES                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ João Silva         │ $15,000 │ Aprovado ✅     │   │
│  │ Maria Santos       │ $8,500  │ Pendente ⏳     │   │
│  │ Pedro Oliveira     │ $22,000 │ Aprovado ✅     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [➕ CADASTRAR NOVO CLIENTE] [📊 RELATÓRIOS] [⚙️ CONFIG] │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades do Partner Dashboard:**
- ✅ Cadastrar novo cliente
- ✅ Visualizar todos os clientes vinculados
- ✅ Acompanhar status das aplicações
- ✅ Ver calendário de recebíveis
- ✅ Acompanhar comissões ganhas
- ✅ Histórico de repasses
- ✅ Relatórios de performance
- ✅ Configurações da conta

---

## 🌐 NOVOS ENDPOINTS DA API

### **Parceiros:**

```javascript
// Cadastro e Autenticação
POST   /api/partners/register      // Cadastrar novo parceiro
POST   /api/partners/login          // Login do parceiro
POST   /api/partners/logout         // Logout
GET    /api/partners/me             // Dados do parceiro logado

// Gestão de Parceiros (Admin)
GET    /api/admin/partners          // Listar todos os parceiros
GET    /api/admin/partners/:id      // Detalhes de um parceiro
PUT    /api/admin/partners/:id      // Atualizar parceiro
PUT    /api/admin/partners/:id/approve  // Aprovar parceiro
PUT    /api/admin/partners/:id/suspend  // Suspender parceiro

// Dashboard do Parceiro
GET    /api/partners/dashboard      // Estatísticas do parceiro
GET    /api/partners/clients        // Clientes do parceiro
GET    /api/partners/receivables    // Recebíveis do parceiro
GET    /api/partners/commissions    // Histórico de comissões
GET    /api/partners/payouts        // Histórico de repasses

// Criar Cliente pelo Parceiro
POST   /api/partners/clients        // Criar novo cliente vinculado
```

### **ACH Payments:**

```javascript
// Configuração ACH
POST   /api/ach/setup               // Configurar ACH para cliente
POST   /api/ach/verify-account      // Verificar conta bancária
GET    /api/ach/mandates/:clientId  // Obter mandato ACH

// Pagamentos
POST   /api/ach/initiate            // Iniciar débito ACH
GET    /api/ach/payments            // Listar pagamentos ACH
GET    /api/ach/payments/:id        // Detalhes de um pagamento
POST   /api/ach/retry/:id           // Tentar pagamento novamente

// Webhooks
POST   /api/webhooks/ach            // Receber notificações do processador
```

### **Credit Bureau:**

```javascript
// Análise de Crédito
POST   /api/credit/pull-report      // Puxar relatório de crédito
GET    /api/credit/reports/:userId  // Relatórios do cliente
GET    /api/credit/score/:userId    // Score mais recente
POST   /api/credit/calculate-terms  // Calcular termos personalizados

// Admin
GET    /api/admin/credit-pulls      // Histórico de consultas
GET    /api/admin/credit-costs      // Custo das consultas
```

---

## 📋 ATUALIZAÇÃO DO CRONOGRAMA

### **SPRINT 1: Base + Gestão de Clientes** (2-3 dias) - INALTERADO

### **SPRINT 2: Documentos + Contratos + Agentes** (2-3 dias) - INALTERADO

### **SPRINT 3: Pagamentos + Agentes + INTEGRAÇÕES** (3-4 dias) ⭐ EXPANDIDO

#### **Backend** (⏱️ 14-16 horas)
- [x] AgentPaymentManager
- [x] AgentSecurityMonitor
- [x] AgentMaster
- [ ] **AgentACHIntegrator** (NOVO!)
  - Integração com Stripe ACH ou Plaid
  - Setup de mandato ACH
  - Iniciar débitos automáticos
  - Tratar retornos e falhas
- [ ] **AgentCreditBureauAnalyzer** (NOVO!)
  - Integração com Experian/Equifax/TransUnion
  - Pull de relatórios de crédito
  - Cálculo de termos personalizados
  - Atualização automática de taxas
- [ ] Endpoints de ACH
- [ ] Endpoints de Credit Bureau
- [ ] Webhooks para receber notificações

#### **Frontend** (⏱️ 12-14 horas)
- [x] Agenda de pagamentos
- [x] Dashboard de agentes
- [x] Editor de agentes
- [x] Interface do Agente Mestre
- [ ] **Interface de configuração ACH** (NOVO!)
  - Conectar conta bancária
  - Validar dados bancários
  - Configurar débito automático
- [ ] **Visualização de Credit Reports** (NOVO!)
  - Exibir score e fatores
  - Histórico de consultas
  - Termos calculados automaticamente

**Entregável Sprint 3**:
✅ Sistema de pagamentos funcionando  
✅ **ACH configurado e débitos automáticos funcionando**  
✅ **Análise de crédito real integrada**  
✅ Agente Mestre criando agentes  
✅ Dashboard de agentes

---

### **SPRINT 4: Sistema de Parceiros + Analytics** (3-4 dias) ⭐ EXPANDIDO

#### **Backend** (⏱️ 14-16 horas)
- [ ] **AgentPartnerManager** (NOVO!)
  - Aprovação de parceiros
  - Cálculo de comissões
  - Processamento de repasses
  - Relatórios para parceiros
- [ ] Endpoints de parceiros:
  - Cadastro e login
  - Gestão de clientes vinculados
  - Visualização de recebíveis
  - Histórico de comissões
- [ ] Sistema de repasse automático via ACH
- [ ] AgentPerformanceAnalyzer
- [ ] Endpoints de analytics (mantidos)

#### **Frontend** (⏱️ 16-18 horas)
- [ ] **Partner Dashboard completo** (NOVO!):
  - Página de cadastro de parceiro
  - Login de parceiro
  - Dashboard com estatísticas
  - Listagem de clientes vinculados
  - Calendário de recebíveis dinâmico
  - Acompanhamento de comissões
  - Histórico de repasses
  - Relatórios personalizados
- [ ] **Seção de Parceiros no Admin**:
  - Lista de parceiros
  - Aprovação de parceiros
  - Gestão de comissões
  - Histórico de repasses
- [ ] Analytics do admin (mantido)
- [ ] Relatórios (mantido)
- [ ] Otimizações (mantido)

**Entregável Sprint 4**:
✅ **Partner Dashboard 100% funcional**  
✅ **Parceiros podem cadastrar clientes**  
✅ **Sistema de comissões calculando automaticamente**  
✅ **Repasses via ACH para parceiros**  
✅ **Calendário de recebíveis dinâmico**  
✅ Analytics e relatórios completos  
✅ Sistema completo e otimizado

---

## 📊 NOVA ESTIMATIVA TOTAL

| Sprint | Backend | Frontend | Total | Dias |
|--------|---------|----------|-------|------|
| Sprint 1 | 6-8h | 10-12h | 16-20h | 2-3 |
| Sprint 2 | 8-10h | 10-12h | 18-22h | 2-3 |
| Sprint 3 ⭐ | 14-16h | 12-14h | 26-30h | 3-4 |
| Sprint 4 ⭐ | 14-16h | 16-18h | 30-34h | 3-4 |
| **TOTAL** | **42-50h** | **48-56h** | **90-106h** | **10-14 dias** |

**Tempo estimado atualizado**: 11-13 dias de trabalho focado

---

## 🔌 INTEGRAÇÕ ES EXTERNAS - CONFIGURAÇÃO

### **1. Stripe ACH Setup**

```javascript
// .env
STRIPE_API_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

// Configuração
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

// Setup ACH
async function setupACH(clientId, bankAccount) {
  // 1. Criar customer no Stripe
  const customer = await stripe.customers.create({
    name: client.name,
    email: client.email,
    metadata: { clientId: clientId }
  });
  
  // 2. Adicionar conta bancária
  const bankAccountToken = await stripe.tokens.create({
    bank_account: {
      country: 'US',
      currency: 'usd',
      account_holder_name: bankAccount.holderName,
      account_holder_type: 'individual',
      routing_number: bankAccount.routingNumber,
      account_number: bankAccount.accountNumber
    }
  });
  
  // 3. Anexar ao customer
  await stripe.customers.createSource(customer.id, {
    source: bankAccountToken.id
  });
  
  // 4. Verificar conta (micro-deposits)
  await stripe.customers.verifySource(
    customer.id,
    bankAccountToken.id,
    { amounts: [32, 45] } // Cliente informa valores
  );
  
  return customer.id;
}

// Iniciar débito
async function initiateACHPayment(customerId, amount, installmentId) {
  const charge = await stripe.charges.create({
    amount: amount * 100, // Centavos
    currency: 'usd',
    customer: customerId,
    description: `FlexCredi - Installment ${installmentId}`,
    metadata: { installmentId: installmentId }
  });
  
  return charge;
}
```

### **2. Experian Credit Report Setup**

```javascript
// .env
EXPERIAN_CLIENT_ID=xxxxx
EXPERIAN_CLIENT_SECRET=xxxxx
EXPERIAN_API_URL=https://api.experian.com/consumerservices/credit-profile/v2

// Configuração
const axios = require('axios');

// Autenticar
async function getExperianToken() {
  const response = await axios.post(
    'https://api.experian.com/oauth2/v1/token',
    {
      grant_type: 'client_credentials',
      client_id: process.env.EXPERIAN_CLIENT_ID,
      client_secret: process.env.EXPERIAN_CLIENT_SECRET
    }
  );
  
  return response.data.access_token;
}

// Puxar relatório
async function pullCreditReport(client) {
  const token = await getExperianToken();
  
  const response = await axios.post(
    process.env.EXPERIAN_API_URL,
    {
      consumerPii: {
        primaryApplicant: {
          name: {
            firstName: client.firstName,
            lastName: client.lastName
          },
          dob: client.dateOfBirth,
          ssn: client.ssn,
          currentAddress: {
            line1: client.address,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode
          }
        }
      },
      requestor: {
        subscriberCode: "XXXXXX"
      },
      permissiblePurpose: {
        type: "CreditTransaction",
        terms: "Applicant has authorized credit check"
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
}

// Analisar relatório
function analyzeCreditReport(report) {
  const score = report.creditScore[0].riskModel[0].score;
  const scoreFactors = report.creditScore[0].riskModel[0].scoreFactors;
  
  // Calcular taxa de juros
  let baseRate = 12.0;
  
  if (score >= 750) baseRate -= 4.0;
  else if (score >= 700) baseRate -= 2.0;
  else if (score >= 650) baseRate += 0.0;
  else if (score >= 600) baseRate += 3.0;
  else baseRate += 6.0;
  
  return {
    score: score,
    recommendedRate: baseRate,
    riskLevel: score >= 700 ? 'low' : score >= 650 ? 'medium' : 'high',
    factors: scoreFactors
  };
}
```

---

## 🎯 PRÓXIMOS PASSOS

### **Antes de Começar:**

1. **Criar contas nas integrações:**
   - [ ] Stripe (para ACH) - https://dashboard.stripe.com/register
   - [ ] Experian (para credit reports) - https://www.experian.com/business/

2. **Obter API Keys:**
   - [ ] Stripe API Key
   - [ ] Stripe Webhook Secret
   - [ ] Experian Client ID
   - [ ] Experian Client Secret

3. **Configurar Webhooks:**
   - [ ] Stripe webhook para receber notificações ACH
   - [ ] URL: `https://web-production-e227.up.railway.app/api/webhooks/ach`

### **Começar Implementação:**

**Você confirma:**
- ✅ Sistema de ACH via Stripe
- ✅ Credit Bureau via Experian
- ✅ Sistema completo de parceiros
- ✅ Partner Dashboard com calendário de recebíveis
- ✅ Estimativa de 11-13 dias

**Responda:**
**"SIM, COMEÇAR COM TUDO INCLUÍDO"**

E eu inicio Sprint 1 imediatamente! 🚀

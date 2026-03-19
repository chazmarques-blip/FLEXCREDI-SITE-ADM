# 🎯 PLANEJAMENTO V3.0 - PAYBRIGHT ACH + FLUXO CORRETO DE PARCEIROS

**Data de Atualização**: 21/02/2026  
**Versão**: 3.0 - FINAL  
**Correções Críticas**: ACH PayBright + Fluxo Parceiro Correto + Sem Comissão

---

## 🔴 CORREÇÕES IMPORTANTES

### **1. Sistema ACH Correto: PayBright Gateway**
**URL da API**: https://docs.paybrightgateway.com/api/v2  
**Provider**: PayBright Gateway (não Stripe)

### **2. Fluxo de Parceiro CORRIGIDO:**

#### **❌ FLUXO ERRADO (anterior):**
```
Parceiro oferece crédito → Cliente pega emprestado → Parceiro recebe comissão
```

#### **✅ FLUXO CORRETO:**
```
1. Parceiro se cadastra na plataforma FlexCredi
2. Admin aprova o parceiro
3. Cliente preenche aplicação de crédito
4. Cliente ESCOLHE o parceiro cadastrado para receber o crédito
5. FlexCredi analisa e aprova o crédito
6. Contrato é assinado (cliente autoriza FlexCredi pagar o parceiro)
7. FlexCredi libera crédito DIRETAMENTE ao parceiro em nome do cliente
8. Parceiro recebe valor integral (MENOS fee da FlexCredi)
9. Cliente paga parcelas mensais via ACH para FlexCredi
10. FlexCredi repassa parcelas ao parceiro mensalmente conforme regra estabelecida
```

**Exemplo Prático:**
```
Cliente: João Silva quer comprar móveis de $10,000
Parceiro: Loja de Móveis "Casa Bonita"

Fluxo:
1. João preenche aplicação de $10,000 na FlexCredi
2. João escolhe "Casa Bonita" como beneficiário do crédito
3. FlexCredi aprova João (score 720, taxa 10%, 24 meses)
4. João assina contrato autorizando pagamento à Casa Bonita
5. FlexCredi paga Casa Bonita: $10,000 - $300 (3% fee) = $9,700
6. João paga $462/mês para FlexCredi por 24 meses
7. FlexCredi repassa para Casa Bonita conforme regra:
   - Opção A: 100% imediato (já recebido no passo 5)
   - Opção B: Parcial adiantado + repasses mensais
```

### **3. Modelo de Negócio CORRETO:**

**FlexCredi é INTERMEDIADORA de crédito, não banco**

**Fontes de Receita da FlexCredi:**
- ✅ **Fee do Parceiro**: 3-5% do valor total (descontado no repasse)
- ✅ **Juros do Cliente**: Cliente paga juros sobre o empréstimo
- ❌ **NÃO há comissão ao parceiro** (parceiro é o beneficiário, não vendedor)

### **4. Integração via API Externa (Prevista):**

**FlexCredi não é o capital provider**, vai integrar com uma empresa de crédito externa via API.

**Fluxo com API Externa:**
```
1. Cliente solicita crédito na FlexCredi
2. FlexCredi envia dados para API de Crédito Externa
3. API Externa aprova/rejeita baseado em seus critérios
4. FlexCredi recebe aprovação
5. FlexCredi paga o parceiro com fundos da API Externa
6. Cliente paga FlexCredi
7. FlexCredi repassa para API Externa
```

**Providers de Crédito Sugeridos:**
- **LendingClub API**
- **Prosper API**
- **Upstart API**
- **Cross River Bank API**

### **5. Taxas de Juros PRÉ-DETERMINADAS:**

**NÃO há cálculo dinâmico de taxas**. As taxas são tabeladas previamente.

**Tabela de Taxas FlexCredi:**
```javascript
const INTEREST_RATE_TABLE = {
  "excellent": { // Score 750+
    range: "750-850",
    rate: 8.99,
    maxAmount: 50000,
    maxTerm: 60
  },
  "good": { // Score 700-749
    range: "700-749",
    rate: 12.99,
    maxAmount: 40000,
    maxTerm: 48
  },
  "fair": { // Score 650-699
    range: "650-699",
    rate: 16.99,
    maxAmount: 30000,
    maxTerm: 36
  },
  "poor": { // Score 600-649
    range: "600-649",
    rate: 21.99,
    maxAmount: 20000,
    maxTerm: 24
  },
  "very_poor": { // Score < 600
    range: "300-599",
    rate: 27.99,
    maxAmount: 10000,
    maxTerm: 12
  }
};
```

---

## 🏗️ MODELO DE DADOS CORRIGIDO

### **Tabela: Partners (CORRIGIDA)**

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Dados da Empresa/Parceiro
  business_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  ein VARCHAR(20) NOT NULL UNIQUE, -- EIN ou CNPJ
  business_type VARCHAR(100), -- retail, automotive, healthcare, etc.
  
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
  
  -- Informações Bancárias (para receber pagamentos)
  bank_name VARCHAR(255),
  routing_number VARCHAR(20),
  account_number VARCHAR(50), -- Encriptado
  account_type VARCHAR(20), -- checking, savings
  
  -- Status e Aprovação
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, active, suspended, rejected
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES admin_users(id),
  
  -- Taxas da FlexCredi (não comissão!)
  flexcredi_fee_rate DECIMAL(5,2) DEFAULT 3.00, -- 3% fee padrão
  payment_terms VARCHAR(50) DEFAULT 'immediate', -- immediate, monthly_split
  
  -- Se payment_terms = 'monthly_split':
  upfront_percentage DECIMAL(5,2) DEFAULT 50.00, -- % pago adiantado
  monthly_percentage DECIMAL(5,2) DEFAULT 50.00, -- % dividido nas parcelas
  
  -- Limites
  monthly_credit_limit DECIMAL(15,2), -- Limite mensal de crédito
  single_transaction_limit DECIMAL(15,2), -- Limite por transação
  
  -- Documentação
  documents JSONB, -- Array de documentos (license, tax_id, contract, etc.)
  
  -- Login
  password_hash VARCHAR(255),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Métricas
  total_transactions INTEGER DEFAULT 0,
  total_volume_received DECIMAL(15,2) DEFAULT 0.00,
  total_fees_paid DECIMAL(15,2) DEFAULT 0.00
);
```

### **Tabela: Partner Payments (NOVA - substituindo partner_transactions)**

```sql
CREATE TABLE partner_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  client_id UUID REFERENCES users(id) NOT NULL,
  application_id UUID REFERENCES applications(id) NOT NULL,
  contract_id UUID REFERENCES contracts(id) NOT NULL,
  
  -- Valores
  approved_amount DECIMAL(15,2) NOT NULL, -- Valor aprovado para o cliente
  flexcredi_fee DECIMAL(15,2) NOT NULL, -- Fee da FlexCredi
  net_to_partner DECIMAL(15,2) NOT NULL, -- Valor líquido para o parceiro
  
  -- Repasse Inicial
  upfront_payment DECIMAL(15,2), -- Pagamento inicial ao parceiro
  upfront_paid_at TIMESTAMP,
  upfront_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
  
  -- Repasses Mensais
  monthly_repayment_enabled BOOLEAN DEFAULT false,
  monthly_repayment_amount DECIMAL(10,2), -- Valor mensal a repassar
  repayments_completed INTEGER DEFAULT 0,
  repayments_total INTEGER,
  
  -- Método de Pagamento
  payment_method VARCHAR(50) DEFAULT 'ach', -- ach, wire, check
  
  -- Referência Externa
  external_payment_id VARCHAR(255), -- ID do PayBright ou outro processador
  
  -- Status Geral
  overall_status VARCHAR(50) DEFAULT 'processing', -- processing, completed, failed
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_payments_partner ON partner_payments(partner_id);
CREATE INDEX idx_partner_payments_status ON partner_payments(overall_status);
CREATE INDEX idx_partner_payments_contract ON partner_payments(contract_id);
```

### **Tabela: Partner Monthly Repayments (NOVA)**

```sql
CREATE TABLE partner_monthly_repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_payment_id UUID REFERENCES partner_payments(id) NOT NULL,
  partner_id UUID REFERENCES partners(id) NOT NULL,
  
  -- Dados da Parcela
  installment_number INTEGER NOT NULL, -- 1, 2, 3, etc.
  scheduled_amount DECIMAL(10,2) NOT NULL,
  scheduled_date DATE NOT NULL,
  
  -- Status do Repasse
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  paid_amount DECIMAL(10,2),
  paid_at TIMESTAMP,
  
  -- Método
  payment_method VARCHAR(50) DEFAULT 'ach',
  external_transaction_id VARCHAR(255),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_repayments_partner ON partner_monthly_repayments(partner_id);
CREATE INDEX idx_partner_repayments_status ON partner_monthly_repayments(status);
CREATE INDEX idx_partner_repayments_date ON partner_monthly_repayments(scheduled_date);
```

### **Tabela: Applications (ATUALIZADA)**

```sql
ALTER TABLE applications ADD COLUMN partner_id UUID REFERENCES partners(id);
ALTER TABLE applications ADD COLUMN partner_payment_authorized BOOLEAN DEFAULT false;

CREATE INDEX idx_applications_partner ON applications(partner_id);
```

### **Tabela: Interest Rate Rules (NOVA)**

```sql
CREATE TABLE interest_rate_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Categoria
  category VARCHAR(50) NOT NULL UNIQUE, -- excellent, good, fair, poor, very_poor
  
  -- Score Range
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  
  -- Taxa de Juros
  interest_rate DECIMAL(5,2) NOT NULL, -- % a.a.
  
  -- Limites
  max_loan_amount DECIMAL(15,2) NOT NULL,
  max_term_months INTEGER NOT NULL,
  min_monthly_income DECIMAL(10,2),
  
  -- Ativo
  is_active BOOLEAN DEFAULT true,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir taxas padrão
INSERT INTO interest_rate_rules (category, min_score, max_score, interest_rate, max_loan_amount, max_term_months, min_monthly_income) VALUES
('excellent', 750, 850, 8.99, 50000, 60, 3000),
('good', 700, 749, 12.99, 40000, 48, 2500),
('fair', 650, 699, 16.99, 30000, 36, 2000),
('poor', 600, 649, 21.99, 20000, 24, 1500),
('very_poor', 300, 599, 27.99, 10000, 12, 1000);
```

### **Tabela: External Credit API Config (NOVA)**

```sql
CREATE TABLE external_credit_api_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Provider
  provider_name VARCHAR(100) NOT NULL, -- lendingclub, prosper, upstart, etc.
  api_url VARCHAR(500) NOT NULL,
  api_key TEXT, -- Encriptado
  api_secret TEXT, -- Encriptado
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_primary BOOLEAN DEFAULT false, -- Provider principal
  
  -- Configurações
  config JSONB, -- Configurações específicas do provider
  
  -- Limites
  daily_request_limit INTEGER,
  monthly_volume_limit DECIMAL(15,2),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP
);
```

---

## 🤖 AGENTES ATUALIZADOS

### **Agente 8: Integrador PayBright ACH (CORRIGIDO)**
**Nome**: `AgentPayBrightACH`  
**ID**: `agent-paybright-ach-001`

```javascript
{
  id: "agent-paybright-ach-001",
  name: "Integrador PayBright ACH",
  type: "ach_integrator",
  status: "active",
  
  provider: {
    name: "PayBright Gateway",
    apiUrl: "https://api.paybrightgateway.com/v2",
    documentation: "https://docs.paybrightgateway.com/api/v2"
  },
  
  triggers: [
    "contract.signed",
    "payment.due",
    "payment.failed"
  ],
  
  actions: [
    "setup_ach_mandate",
    "initiate_ach_debit", // Cliente → FlexCredi
    "initiate_ach_credit", // FlexCredi → Parceiro
    "handle_ach_return",
    "retry_failed_payment",
    "notify_payment_status"
  ],
  
  parameters: {
    apiKey: process.env.PAYBRIGHT_API_KEY,
    apiSecret: process.env.PAYBRIGHT_API_SECRET,
    merchantId: process.env.PAYBRIGHT_MERCHANT_ID,
    
    achSettings: {
      mandateText: "I authorize FlexCredi to debit my bank account for monthly payments",
      microDepositVerification: true,
      verificationMethod: "instant", // instant ou micro_deposits
      maxRetries: 3,
      retryDelayDays: 3
    },
    
    paymentTypes: {
      debit: "collect_from_client", // Coletar do cliente
      credit: "pay_to_partner" // Pagar ao parceiro
    }
  },
  
  workflow: {
    setupClientACH: [
      "1. Cliente assina contrato",
      "2. Solicitar dados bancários do cliente",
      "3. Validar conta via PayBright (instant verification)",
      "4. Criar mandato ACH no PayBright",
      "5. Agendar primeiro débito (30 dias após contrato)"
    ],
    
    payPartner: [
      "1. Aplicação aprovada",
      "2. Calcular fee da FlexCredi",
      "3. Calcular valor líquido para parceiro",
      "4. Verificar dados bancários do parceiro",
      "5. Iniciar transferência ACH via PayBright",
      "6. Registrar pagamento na tabela partner_payments"
    ],
    
    collectFromClient: [
      "1. 3 dias antes do vencimento, iniciar débito",
      "2. Enviar para PayBright ACH",
      "3. Monitorar status via webhook",
      "4. Atualizar registro de pagamento",
      "5. Se sucesso, processar repasse ao parceiro (se aplicável)",
      "6. Notificar cliente"
    ],
    
    monthlyRepaymentToPartner: [
      "1. Cliente pagou parcela mensal",
      "2. Verificar se parceiro tem repasse mensal configurado",
      "3. Calcular valor do repasse",
      "4. Iniciar transferência ACH ao parceiro",
      "5. Atualizar tabela partner_monthly_repayments",
      "6. Notificar parceiro"
    ]
  },
  
  paybrightIntegration: {
    endpoints: {
      createMerchant: "POST /merchants",
      setupACH: "POST /ach/mandates",
      verifyAccount: "POST /ach/verify",
      initiateDebit: "POST /ach/debits",
      initiateCredit: "POST /ach/credits",
      checkStatus: "GET /ach/transactions/{id}",
      webhook: "POST /webhooks/ach"
    },
    
    examplePayload: {
      initiateCredit: {
        merchant_id: "FLEXCREDI_MERCHANT_ID",
        amount: 9700.00,
        currency: "USD",
        recipient: {
          name: "Casa Bonita Furniture",
          bank_account: {
            routing_number: "123456789",
            account_number: "987654321",
            account_type: "checking"
          }
        },
        description: "Payment for Contract #FLEX-2024-00123",
        reference: "partner_payment_uuid"
      },
      
      initiateDebit: {
        merchant_id: "FLEXCREDI_MERCHANT_ID",
        amount: 462.50,
        currency: "USD",
        payer: {
          name: "João Silva",
          bank_account: {
            routing_number: "111222333",
            account_number: "444555666",
            account_type: "checking"
          }
        },
        description: "FlexCredi - Installment 1/24",
        reference: "ach_payment_uuid"
      }
    }
  },
  
  communication: {
    notifyAgents: [
      "agent-notifier-001",
      "agent-partner-manager-001"
    ],
    notifyAdmin: true,
    logActivity: true
  }
}
```

---

### **Agente 9: Analisador de Crédito (SIMPLIFICADO)**
**Nome**: `AgentCreditAnalyzer`  
**ID**: `agent-credit-analyzer-001`

```javascript
{
  id: "agent-credit-analyzer-001",
  name: "Analisador de Crédito (Tabela Fixa)",
  type: "credit_analyzer",
  status: "active",
  
  triggers: [
    "application.created",
    "credit_report.received"
  ],
  
  actions: [
    "pull_credit_score", // Via Experian
    "determine_rate_category",
    "apply_interest_rate_table",
    "calculate_approved_terms",
    "update_application"
  ],
  
  parameters: {
    creditBureauProvider: "experian",
    apiKey: process.env.EXPERIAN_API_KEY,
    
    // Tabela de Taxas (NÃO calcula, apenas consulta)
    rateTableSource: "database", // Consultar tabela interest_rate_rules
    
    // Regras de Aprovação
    approvalRules: {
      minScore: 600,
      minMonthlyIncome: 1000,
      maxDebtToIncomeRatio: 0.43
    }
  },
  
  workflow: [
    "1. Aplicação criada",
    "2. Puxar credit score via Experian",
    "3. Determinar categoria (excellent, good, fair, poor, very_poor)",
    "4. Consultar tabela interest_rate_rules no banco",
    "5. Aplicar taxa correspondente à categoria",
    "6. Verificar se valor solicitado está dentro do limite",
    "7. Verificar se prazo solicitado está dentro do limite",
    "8. Atualizar aplicação com termos finais",
    "9. Se aprovado automaticamente, enviar para geração de contrato"
  ],
  
  exampleFlow: {
    input: {
      clientName: "João Silva",
      requestedAmount: 10000,
      requestedTerm: 24,
      monthlyIncome: 3500,
      ssn: "xxx-xx-1234"
    },
    
    step1_pullScore: {
      provider: "Experian",
      creditScore: 715
    },
    
    step2_determineCategory: {
      score: 715,
      category: "good", // 700-749
      message: "Score 715 cai na categoria 'good'"
    },
    
    step3_queryDatabase: {
      query: "SELECT * FROM interest_rate_rules WHERE category = 'good'",
      result: {
        interest_rate: 12.99,
        max_loan_amount: 40000,
        max_term_months: 48,
        min_monthly_income: 2500
      }
    },
    
    step4_validateRequest: {
      requestedAmount: 10000,
      maxAllowed: 40000,
      amountCheck: "PASS", // 10k < 40k
      
      requestedTerm: 24,
      maxTermAllowed: 48,
      termCheck: "PASS", // 24 < 48
      
      monthlyIncome: 3500,
      minIncomeRequired: 2500,
      incomeCheck: "PASS" // 3500 > 2500
    },
    
    step5_calculatePayment: {
      principal: 10000,
      rate: 12.99,
      term: 24,
      monthlyPayment: 474.89,
      totalPayment: 11397.36
    },
    
    output: {
      approved: true,
      approvedAmount: 10000,
      interestRate: 12.99,
      termMonths: 24,
      monthlyPayment: 474.89,
      totalAmount: 11397.36,
      category: "good",
      riskLevel: "low"
    }
  },
  
  communication: {
    notifyAgents: [
      "agent-notifier-001",
      "agent-contract-generator-001"
    ],
    notifyAdmin: false, // Só notifica se precisar revisão manual
    logActivity: true
  }
}
```

---

### **Agente 10: Gestor de Parceiros (CORRIGIDO)**
**Nome**: `AgentPartnerManager`  
**ID**: `agent-partner-manager-001`

```javascript
{
  id: "agent-partner-manager-001",
  name: "Gestor de Parceiros e Repasses",
  type: "partner_manager",
  status: "active",
  
  triggers: [
    "partner.registered",
    "application.approved",
    "contract.signed",
    "payment.received_from_client"
  ],
  
  actions: [
    "approve_partner",
    "process_initial_payment_to_partner",
    "process_monthly_repayment_to_partner",
    "generate_partner_statement",
    "notify_partner"
  ],
  
  parameters: {
    defaultFlexCrediFee: 3.0, // 3% padrão
    
    paymentOptions: {
      immediate: {
        name: "Pagamento Imediato",
        description: "Parceiro recebe 100% adiantado (menos fee)",
        upfront: 100,
        monthly: 0
      },
      split_50_50: {
        name: "50% Adiantado + 50% Parcelado",
        description: "Parceiro recebe 50% adiantado, 50% dividido nas parcelas",
        upfront: 50,
        monthly: 50
      },
      monthly: {
        name: "Repasse Mensal",
        description: "Parceiro recebe conforme cliente paga",
        upfront: 0,
        monthly: 100
      }
    },
    
    minimumPayoutAmount: 100.00
  },
  
  workflow: {
    approvePartner: [
      "1. Parceiro se cadastra",
      "2. Validar documentos (EIN, Business License)",
      "3. Verificar dados bancários",
      "4. Admin revisa e aprova",
      "5. Enviar credenciais de acesso ao parceiro",
      "6. Configurar termos de pagamento (immediate, split, monthly)"
    ],
    
    processInitialPayment: [
      "1. Aplicação aprovada e contrato assinado",
      "2. Verificar se aplicação tem parceiro vinculado",
      "3. Calcular fee da FlexCredi (ex: 3% de $10,000 = $300)",
      "4. Calcular valor líquido ao parceiro ($10,000 - $300 = $9,700)",
      "5. Verificar termos de pagamento do parceiro",
      "6. Se 'immediate', pagar 100% via ACH agora",
      "7. Se 'split_50_50', pagar 50% via ACH agora",
      "8. Se 'monthly', não pagar nada agora",
      "9. Criar registro em partner_payments",
      "10. Se houver repasse mensal, criar registros em partner_monthly_repayments"
    ],
    
    processMonthlyRepayment: [
      "1. Cliente pagou parcela mensal",
      "2. Verificar se parceiro tem repasse mensal configurado",
      "3. Consultar partner_monthly_repayments pendentes",
      "4. Calcular valor do repasse",
      "5. Iniciar transferência ACH ao parceiro via PayBright",
      "6. Atualizar status do repayment para 'completed'",
      "7. Notificar parceiro"
    ]
  },
  
  exampleScenarios: {
    scenario1_immediate: {
      client: "João Silva",
      partner: "Casa Bonita Furniture",
      approvedAmount: 10000,
      flexCrediFee: 300, // 3%
      netToPartner: 9700,
      
      paymentTerms: "immediate",
      
      timeline: {
        day0: "Contrato assinado",
        day1: "FlexCredi paga parceiro: $9,700 (ACH)",
        day30: "Cliente paga FlexCredi: $474.89",
        day60: "Cliente paga FlexCredi: $474.89",
        // ... parceiro NÃO recebe mais nada
      }
    },
    
    scenario2_split: {
      client: "Maria Santos",
      partner: "AutoMax Dealership",
      approvedAmount: 20000,
      flexCrediFee: 600, // 3%
      netToPartner: 19400,
      
      paymentTerms: "split_50_50",
      upfront: 9700, // 50%
      monthly: 9700, // 50% dividido em 24 parcelas = $404.17/mês
      
      timeline: {
        day0: "Contrato assinado",
        day1: "FlexCredi paga parceiro (adiantado): $9,700",
        day30: "Cliente paga FlexCredi: $920.83",
        day30_repasse: "FlexCredi repassa ao parceiro: $404.17",
        day60: "Cliente paga FlexCredi: $920.83",
        day60_repasse: "FlexCredi repassa ao parceiro: $404.17",
        // ... continua por 24 meses
      }
    },
    
    scenario3_monthly: {
      client: "Pedro Oliveira",
      partner: "Dental Care Clinic",
      approvedAmount: 5000,
      flexCrediFee: 150, // 3%
      netToPartner: 4850,
      
      paymentTerms: "monthly",
      monthlyRepayment: 202.08, // $4850 / 24 = $202.08/mês
      
      timeline: {
        day0: "Contrato assinado",
        day1: "FlexCredi NÃO paga nada adiantado",
        day30: "Cliente paga FlexCredi: $230.54",
        day30_repasse: "FlexCredi repassa ao parceiro: $202.08",
        day60: "Cliente paga FlexCredi: $230.54",
        day60_repasse: "FlexCredi repassa ao parceiro: $202.08",
        // ... continua por 24 meses
      }
    }
  },
  
  communication: {
    notifyAgents: [
      "agent-paybright-ach-001", // Processar ACH
      "agent-notifier-001" // Notificar parceiro
    ],
    notifyAdmin: true,
    generateInvoice: true,
    logActivity: true
  }
}
```

---

### **Agente 11: Integrador de API de Crédito Externa (NOVO)**
**Nome**: `AgentExternalCreditAPI`  
**ID**: `agent-external-credit-api-001`

```javascript
{
  id: "agent-external-credit-api-001",
  name: "Integrador de API de Crédito Externa",
  type: "external_credit_integrator",
  status: "active",
  
  triggers: [
    "application.approved",
    "contract.signed"
  ],
  
  actions: [
    "send_loan_request_to_external_api",
    "receive_approval_from_external_api",
    "receive_funds_from_external_api",
    "send_repayment_to_external_api"
  ],
  
  parameters: {
    primaryProvider: "lendingclub", // ou prosper, upstart, etc.
    apiConfig: {
      url: process.env.EXTERNAL_CREDIT_API_URL,
      apiKey: process.env.EXTERNAL_CREDIT_API_KEY,
      apiSecret: process.env.EXTERNAL_CREDIT_API_SECRET
    },
    
    autoSendLoanRequest: true, // Enviar automaticamente após aprovação
    requireManualConfirmation: false
  },
  
  workflow: {
    loanRequest: [
      "1. FlexCredi aprova aplicação do cliente",
      "2. Enviar dados do empréstimo para API Externa",
      "3. API Externa aprova/rejeita",
      "4. Se aprovado, API Externa disponibiliza fundos",
      "5. FlexCredi recebe fundos",
      "6. FlexCredi paga o parceiro",
      "7. Cliente paga FlexCredi mensalmente",
      "8. FlexCredi repassa para API Externa mensalmente"
    ]
  },
  
  examplePayload: {
    loanRequest: {
      loan_amount: 10000,
      interest_rate: 12.99,
      term_months: 24,
      purpose: "furniture_purchase",
      
      borrower: {
        name: "João Silva",
        ssn: "xxx-xx-1234",
        credit_score: 715,
        annual_income: 42000,
        employment_status: "employed"
      },
      
      beneficiary: {
        name: "Casa Bonita Furniture",
        ein: "12-3456789",
        account_info: {
          routing: "123456789",
          account: "987654321"
        }
      },
      
      flexcredi_info: {
        contract_id: "FLEX-2024-00123",
        application_id: "uuid",
        fee_percentage: 3.0
      }
    },
    
    loanResponse: {
      status: "approved",
      external_loan_id: "LC-2024-987654",
      amount_funded: 10000,
      disbursement_date: "2026-02-25",
      repayment_schedule: [
        { due_date: "2026-03-25", amount: 474.89 },
        { due_date: "2026-04-25", amount: 474.89 },
        // ... 24 parcelas
      ]
    }
  },
  
  communication: {
    notifyAgents: [
      "agent-partner-manager-001", // Processar pagamento ao parceiro
      "agent-paybright-ach-001" // Configurar repasses
    ],
    notifyAdmin: true,
    logActivity: true
  }
}
```

---

## 📱 FLUXO VISUAL COMPLETO (CORRIGIDO)

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUXO FLEXCREDI CORRETO                   │
└─────────────────────────────────────────────────────────────┘

[PARCEIRO]                [CLIENTE]              [FLEXCREDI]           [API EXTERNA]
    │                         │                        │                      │
    │ 1. Cadastro             │                        │                      │
    ├────────────────────────►│                        │                      │
    │                         │                        │                      │
    │ 2. Admin Aprova         │                        │                      │
    │◄────────────────────────┼────────────────────────┤                      │
    │                         │                        │                      │
    │                         │ 3. Preenche Aplicação  │                      │
    │                         ├───────────────────────►│                      │
    │                         │                        │                      │
    │                         │ 4. Escolhe Parceiro    │                      │
    │◄────────────────────────┤                        │                      │
    │                         │                        │                      │
    │                         │ 5. Análise de Crédito  │                      │
    │                         │                        │ (Score + Tabela)     │
    │                         │                        │                      │
    │                         │ 6. Aprovado! Taxa 12.99%│                     │
    │                         │◄───────────────────────┤                      │
    │                         │                        │                      │
    │                         │ 7. Assina Contrato     │                      │
    │                         │    (Autoriza pagar     │                      │
    │                         │     o parceiro)        │                      │
    │                         ├───────────────────────►│                      │
    │                         │                        │                      │
    │                         │                        │ 8. Solicita Fundos   │
    │                         │                        ├─────────────────────►│
    │                         │                        │                      │
    │                         │                        │ 9. API Aprova        │
    │                         │                        │◄─────────────────────┤
    │                         │                        │                      │
    │ 10. Recebe $9,700       │                        │                      │
    │     (via ACH PayBright) │                        │                      │
    │◄────────────────────────┼────────────────────────┤                      │
    │     FlexCredi Fee: $300 │                        │                      │
    │                         │                        │                      │
    │                         │ 11. Paga $474.89/mês   │                      │
    │                         │    (via ACH PayBright) │                      │
    │                         ├───────────────────────►│                      │
    │                         │                        │                      │
    │ 12. Repasse (se config) │                        │ 13. Repassa API      │
    │◄────────────────────────┼────────────────────────┼─────────────────────►│
    │     $404.17/mês         │                        │    FlexCredi lucra   │
    │     (se split 50/50)    │                        │    nos juros         │
    │                         │                        │                      │
```

---

## 🎯 ESTIMATIVA FINAL AJUSTADA

| Sprint | Conteúdo | Backend | Frontend | Total | Dias |
|--------|----------|---------|----------|-------|------|
| **Sprint 1** | Base + Clientes | 6-8h | 10-12h | 16-20h | 2-3 |
| **Sprint 2** | Documentos + Contratos | 8-10h | 10-12h | 18-22h | 2-3 |
| **Sprint 3** ⭐ | PayBright ACH + Credit | 14-16h | 12-14h | 26-30h | 3-4 |
| **Sprint 4** ⭐ | Parceiros + API Externa | 14-16h | 16-18h | 30-34h | 3-4 |
| **TOTAL** | | **42-50h** | **48-56h** | **90-106h** | **10-14 dias** |

**Tempo total**: **11-13 dias de trabalho focado**

---

## 📋 CHECKLIST ANTES DE COMEÇAR (ATUALIZADO)

### **Criar Contas:**
- [ ] PayBright Gateway - https://paybrightgateway.com
- [ ] Experian Developer - https://developer.experian.com
- [ ] API Externa de Crédito (LendingClub, Prosper, etc.)

### **Obter API Keys:**
- [ ] PayBright API Key
- [ ] PayBright API Secret
- [ ] PayBright Merchant ID
- [ ] Experian Client ID
- [ ] Experian Client Secret
- [ ] External Credit API Key (se aplicável)

### **Configurar Webhooks:**
- [ ] PayBright webhook: `https://web-production-e227.up.railway.app/api/webhooks/paybright`

---

## ✅ APROVAÇÃO FINAL V3.0

**Confirmações:**

✅ Sistema ACH via **PayBright Gateway**  
✅ Análise de crédito via Experian (apenas score)  
✅ **Taxas PRÉ-DETERMINADAS** (tabela fixa no banco)  
✅ Sistema de **parceiros CORRIGIDO**:
  - Cliente escolhe parceiro para receber crédito  
  - FlexCredi paga parceiro (menos 3% fee)  
  - Cliente paga FlexCredi via ACH  
  - FlexCredi repassa ao parceiro conforme regra  
✅ **NÃO há comissão ao parceiro** (parceiro é beneficiário)  
✅ **Integração com API Externa** de crédito prevista  
✅ Partner Dashboard com calendário de recebíveis  
✅ 11 agentes autônomos  
✅ Layout baseado em dashboard-cliente.html  
✅ Estimativa: 90-106 horas (11-13 dias)

---

## 🚀 RESPONDA:

**"SIM, COMEÇAR COM PAYBRIGHT E FLUXO CORRETO"**

E eu inicio Sprint 1 imediatamente! 💪

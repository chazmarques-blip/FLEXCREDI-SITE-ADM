# 🎯 PLANEJAMENTO V4.0 FINAL - MODELO CORRETO FLEXCREDI

**Data**: 21/02/2026  
**Versão**: 4.0 - DEFINITIVO  
**Status**: ✅ APROVADO PARA IMPLEMENTAÇÃO

---

## 🔴 MODELO DE NEGÓCIO DEFINITIVO

### **FlexCredi = Plataforma de Marketplace de Crédito**

**Conceito:**
- FlexCredi é uma **plataforma intermediadora**
- Conecta **Clientes** (que precisam de crédito) com **Parceiros** (que fornecem bens/serviços)
- FlexCredi **gerencia os recebíveis**
- FlexCredi cobra do cliente e **repassa ao parceiro** conforme regras

---

## ✅ FLUXO COMPLETO E DEFINITIVO

```
1. PARCEIRO se cadastra na plataforma
2. ADMIN aprova o parceiro
3. CLIENTE preenche aplicação de crédito
4. CLIENTE ESCOLHE PARCEIRO para receber o crédito (beneficiário)
5. FLEXCREDI analisa e aprova (score → tabela de taxas)
6. CONTRATO é assinado (cliente autoriza FlexCredi pagar parceiro)
7. FLEXCREDI LANÇA RECEBÍVEIS no dashboard do parceiro
8. PARCEIRO VÊ os recebíveis acumulando no dashboard
9. CLIENTE paga FlexCredi via ACH (mensal, quinzenal ou semanal)
10. FLEXCREDI REPASSA ao parceiro conforme regra configurada
11. PARCEIRO RESGATA quando quiser (respeitando regras mínimas)
```

---

## 💰 MODELO FINANCEIRO DETALHADO

### **Exemplo Prático:**

**Cenário:**
```
Cliente: João Silva
Parceiro: Casa Bonita Furniture
Valor: $5,000
Score: 680 (categoria "fair")
Taxa: 16.99% a.a.
Prazo: 36 meses (mensal)
```

**Cálculos:**
```
Valor Principal: $5,000
Taxa de Juros: 16.99% a.a.
Prazo: 36 meses
Parcela Mensal: $177.02
Total a Pagar: $6,372.72
Total de Juros: $1,372.72
```

**Fluxo de Pagamentos:**

**Dia 0 (Contrato Assinado):**
```
FlexCredi → Lança no Dashboard do Parceiro:
  Recebível Total: $5,000 (principal)
  Parcelas: 36 x $138.89 = $5,000
  Status: "Disponível para resgate conforme regras"
```

**Mês 1 (Cliente Paga):**
```
Cliente → FlexCredi: $177.02
  - Principal: $138.89
  - Juros: $38.13 (lucro FlexCredi)

FlexCredi → Dashboard Parceiro:
  Recebível Disponível: +$138.89
  Total Acumulado: $138.89
  Parcelas Pagas: 1/36
```

**Parceiro Pode:**
```
Opção A: Resgatar agora ($138.89 - fee de resgate antecipado)
Opção B: Aguardar mais parcelas acumularem
Opção C: Aguardar o vencimento completo (36 meses)
```

**Mês 2 (Cliente Paga):**
```
Cliente → FlexCredi: $177.02
  - Principal: $138.89
  - Juros: $38.13

FlexCredi → Dashboard Parceiro:
  Recebível Disponível: +$138.89
  Total Acumulado: $277.78 (2 parcelas)
  Parcelas Pagas: 2/36
```

**Mês 36 (Última Parcela):**
```
Total Acumulado no Dashboard: $5,000
Parcelas Pagas: 36/36
Status: "Completo - Disponível para Resgate Integral"

Parceiro Resgata: $5,000 (integral, sem fee)
```

### **Regras de Resgate (Configuráveis):**

```javascript
const WITHDRAWAL_RULES = {
  minimum_amount: 100, // Mínimo $100 para resgatar
  minimum_installments_paid: 3, // Mínimo 3 parcelas pagas
  
  early_withdrawal_fee: {
    enabled: true,
    fee_percentage: 2.0, // 2% de fee se resgatar antes do prazo
    waived_after_months: 12 // Fee zerado após 12 meses
  },
  
  full_maturity_withdrawal: {
    fee_percentage: 0.0 // Sem fee se esperar prazo completo
  },
  
  auto_transfer: {
    enabled: false, // Transferência automática desabilitada
    frequency: "monthly", // Se habilitado: mensal, quinzenal, semanal
    minimum_balance: 500 // Transferir automaticamente se saldo > $500
  }
};
```

---

## 📊 CONFIGURAÇÕES CUSTOMIZÁVEIS DO SISTEMA

### **1. Tabela de Taxas (Admin Pode Editar)**

**Interface no Admin:**
```
┌────────────────────────────────────────────────────────┐
│  ⚙️ CONFIGURAÇÃO DE TAXAS DE JUROS                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [➕ Adicionar Nova Faixa]  [📊 Visualizar Gráfico]   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Categoria: Excellent                             │ │
│  │ Score: 750 - 850                                 │ │
│  │ Taxa: [8.99] % a.a.     [✏️ Editar]              │ │
│  │ Valor Máximo: $[50,000]                          │ │
│  │ Prazo Máximo: [60] meses                         │ │
│  │ Renda Mínima: $[3,000]/mês                       │ │
│  │ Status: 🟢 Ativa  [❌ Desativar]                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Categoria: Good                                  │ │
│  │ Score: 700 - 749                                 │ │
│  │ Taxa: [12.99] % a.a.    [✏️ Editar]              │ │
│  │ Valor Máximo: $[40,000]                          │ │
│  │ Prazo Máximo: [48] meses                         │ │
│  │ Renda Mínima: $[2,500]/mês                       │ │
│  │ Status: 🟢 Ativa  [❌ Desativar]                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Categoria: Fair ⭐ INICIAL                        │ │
│  │ Score: 650 - 699                                 │ │
│  │ Taxa: [16.99] % a.a.    [✏️ Editar]              │ │
│  │ Valor Máximo: $[5,000] ⭐                        │ │
│  │ Prazo Máximo: [36] meses (24 quinzenas/48 sem)  │ │
│  │ Renda Mínima: $[2,000]/mês                       │ │
│  │ Status: 🟢 Ativa  [❌ Desativar]                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  [ SALVAR ALTERAÇÕES ]  [ CANCELAR ]                  │
└────────────────────────────────────────────────────────┘
```

### **2. Configuração de Frequência de Pagamento**

```
┌────────────────────────────────────────────────────────┐
│  📅 CONFIGURAÇÃO DE FREQUÊNCIAS DE PAGAMENTO           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Frequências Disponíveis para Clientes:               │
│                                                        │
│  ☑️ Mensal (Monthly)                                   │
│     Padrão: Dia [10] de cada mês                      │
│     Máximo: [60] parcelas                             │
│                                                        │
│  ☑️ Quinzenal (Bi-Weekly)                              │
│     Padrão: A cada [14] dias                          │
│     Máximo: [24] quinzenas (≈ 12 meses)               │
│                                                        │
│  ☑️ Semanal (Weekly)                                   │
│     Padrão: Toda [Sexta-feira]                        │
│     Máximo: [48] semanas (≈ 12 meses)                 │
│                                                        │
│  [ SALVAR CONFIGURAÇÕES ]                              │
└────────────────────────────────────────────────────────┘
```

### **3. Regras de Resgate do Parceiro**

```
┌────────────────────────────────────────────────────────┐
│  💰 CONFIGURAÇÃO DE RESGATES (PARCEIROS)               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Valor Mínimo de Resgate:                             │
│  $[100.00]                                             │
│                                                        │
│  Parcelas Mínimas Pagas:                               │
│  [3] parcelas                                          │
│                                                        │
│  Taxa de Resgate Antecipado:                           │
│  ☑️ Ativa  [2.0]% antes de [12] meses                 │
│  ☐ Desativar taxa de resgate antecipado               │
│                                                        │
│  Transferência Automática:                             │
│  ☐ Ativar transferência automática                    │
│     Frequência: [Mensal ▼]                            │
│     Saldo Mínimo: $[500.00]                           │
│                                                        │
│  Métodos de Pagamento:                                 │
│  ☑️ ACH/Depósito Bancário (1-3 dias úteis)            │
│  ☐ Wire Transfer (mesmo dia, +$25 fee)                │
│  ☐ Check/Cheque (5-7 dias úteis)                      │
│                                                        │
│  [ SALVAR REGRAS ]                                     │
└────────────────────────────────────────────────────────┘
```

### **4. Limites e Restrições Iniciais**

```javascript
// Configuração Inicial (pode ser alterada no admin)
const INITIAL_LIMITS = {
  credit_limits: {
    maximum_amount: 5000, // Máximo $5,000 inicial
    minimum_amount: 500,  // Mínimo $500
    
    increase_after_months: 6, // Aumentar limite após 6 meses
    increase_percentage: 50 // Aumentar 50% se bom pagador
  },
  
  interest_rates: {
    minimum_rate: 16.99, // Taxa mínima 16.99% (categoria "fair")
    maximum_rate: 27.99,
    
    discount_for_good_payment: {
      enabled: true,
      discount_percentage: 1.0, // -1% após 12 meses pagando em dia
      check_after_months: 12
    }
  },
  
  payment_terms: {
    monthly: {
      enabled: true,
      max_installments: 36, // Máximo 36 meses
      min_installments: 6
    },
    
    biweekly: {
      enabled: true,
      max_installments: 24, // Máximo 24 quinzenas (≈12 meses)
      min_installments: 12
    },
    
    weekly: {
      enabled: true,
      max_installments: 48, // Máximo 48 semanas (≈12 meses)
      min_installments: 24
    }
  }
};
```

---

## 📊 MODELO DE DADOS ATUALIZADO

### **Tabela: interest_rate_rules (CUSTOMIZÁVEL)**

```sql
CREATE TABLE interest_rate_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Categoria
  category VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100), -- Nome amigável
  
  -- Score Range
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  
  -- Taxa de Juros
  interest_rate DECIMAL(5,2) NOT NULL,
  
  -- Limites
  max_loan_amount DECIMAL(15,2) NOT NULL,
  min_loan_amount DECIMAL(15,2) DEFAULT 500.00,
  
  -- Prazos por Frequência
  max_term_months INTEGER, -- Mensal
  max_term_biweekly INTEGER, -- Quinzenal
  max_term_weekly INTEGER, -- Semanal
  
  -- Requisitos
  min_monthly_income DECIMAL(10,2),
  max_debt_to_income_ratio DECIMAL(5,2) DEFAULT 0.43,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  
  -- Ordem de Exibição
  display_order INTEGER,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id)
);

-- Dados Iniciais
INSERT INTO interest_rate_rules (
  category, display_name, min_score, max_score, interest_rate,
  max_loan_amount, max_term_months, max_term_biweekly, max_term_weekly,
  min_monthly_income, display_order, is_default
) VALUES
-- Inicialmente apenas categoria "fair" está ativa
('fair', 'Fair Credit', 650, 699, 16.99, 5000, 36, 24, 48, 2000, 3, true),

-- Outras categorias desabilitadas inicialmente (is_active = false)
('excellent', 'Excellent Credit', 750, 850, 8.99, 50000, 60, 40, 80, 3000, 1, false),
('good', 'Good Credit', 700, 749, 12.99, 40000, 48, 32, 64, 2500, 2, false),
('poor', 'Poor Credit', 600, 649, 21.99, 20000, 24, 16, 32, 1500, 4, false),
('very_poor', 'Very Poor Credit', 300, 599, 27.99, 10000, 12, 8, 16, 1000, 5, false);
```

### **Tabela: payment_frequency_config (NOVA)**

```sql
CREATE TABLE payment_frequency_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Tipo
  frequency_type VARCHAR(20) NOT NULL UNIQUE, -- monthly, biweekly, weekly
  display_name VARCHAR(50) NOT NULL,
  
  -- Configurações
  is_enabled BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  
  -- Limites
  max_installments INTEGER NOT NULL,
  min_installments INTEGER NOT NULL,
  
  -- Configurações Específicas
  config JSONB, -- { "payment_day": 10, "allow_weekend_adjustment": true }
  
  -- Ordem
  display_order INTEGER,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dados Iniciais
INSERT INTO payment_frequency_config (
  frequency_type, display_name, is_enabled, is_default,
  max_installments, min_installments, display_order, config
) VALUES
('monthly', 'Mensal', true, true, 36, 6, 1, '{"payment_day": 10, "allow_weekend_adjustment": true}'),
('biweekly', 'Quinzenal (a cada 14 dias)', true, false, 24, 12, 2, '{"day_of_week": "friday"}'),
('weekly', 'Semanal', true, false, 48, 24, 3, '{"day_of_week": "friday"}');
```

### **Tabela: partner_receivables (NOVA - Substituindo partner_payments)**

```sql
CREATE TABLE partner_receivables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  client_id UUID REFERENCES users(id) NOT NULL,
  application_id UUID REFERENCES applications(id) NOT NULL,
  contract_id UUID REFERENCES contracts(id) NOT NULL,
  
  -- Valores Totais
  principal_amount DECIMAL(15,2) NOT NULL, -- Valor do crédito aprovado
  total_installments INTEGER NOT NULL,
  installment_amount DECIMAL(10,2) NOT NULL, -- Valor de cada parcela (só principal)
  
  -- Saldo de Recebíveis
  total_receivable DECIMAL(15,2) NOT NULL, -- = principal_amount
  balance_available DECIMAL(15,2) DEFAULT 0.00, -- Disponível para resgate
  balance_withdrawn DECIMAL(15,2) DEFAULT 0.00, // Já resgatado
  balance_pending DECIMAL(15,2), // Pendente (= total - available - withdrawn)
  
  -- Contadores
  installments_paid INTEGER DEFAULT 0,
  installments_pending INTEGER,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, completed, defaulted
  
  -- Datas
  first_payment_date DATE,
  last_payment_date DATE,
  contract_start_date DATE NOT NULL,
  contract_end_date DATE NOT NULL,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_receivables_partner ON partner_receivables(partner_id);
CREATE INDEX idx_partner_receivables_contract ON partner_receivables(contract_id);
CREATE INDEX idx_partner_receivables_status ON partner_receivables(status);
```

### **Tabela: partner_receivable_transactions (NOVA)**

```sql
CREATE TABLE partner_receivable_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receivable_id UUID REFERENCES partner_receivables(id) NOT NULL,
  partner_id UUID REFERENCES partners(id) NOT NULL,
  
  -- Tipo de Transação
  transaction_type VARCHAR(50) NOT NULL, -- credit (cliente pagou), debit (parceiro resgatou)
  
  -- Valores
  amount DECIMAL(10,2) NOT NULL,
  fee_amount DECIMAL(10,2) DEFAULT 0.00,
  net_amount DECIMAL(10,2), -- amount - fee_amount
  
  -- Relacionamento
  ach_payment_id UUID REFERENCES ach_payments(id), -- Se for credit (cliente pagou)
  withdrawal_id UUID, -- Se for debit (parceiro resgatou)
  
  -- Descrição
  description TEXT,
  
  -- Saldos Após Transação
  balance_after DECIMAL(15,2),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  processed_by UUID REFERENCES admin_users(id)
);

CREATE INDEX idx_receivable_transactions_receivable ON partner_receivable_transactions(receivable_id);
CREATE INDEX idx_receivable_transactions_type ON partner_receivable_transactions(transaction_type);
```

### **Tabela: partner_withdrawals (NOVA)**

```sql
CREATE TABLE partner_withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) NOT NULL,
  receivable_id UUID REFERENCES partner_receivables(id), -- Pode ser NULL se for múltiplos
  
  -- Valores
  requested_amount DECIMAL(15,2) NOT NULL,
  fee_amount DECIMAL(10,2) DEFAULT 0.00,
  net_amount DECIMAL(15,2) NOT NULL, -- requested - fee
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
  
  -- Método de Pagamento
  payment_method VARCHAR(50) DEFAULT 'ach', -- ach, wire, check
  
  -- Dados Bancários (snapshot)
  bank_details JSONB,
  
  -- Datas
  requested_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES admin_users(id),
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Referência Externa
  external_transaction_id VARCHAR(255), -- ID do PayBright
  
  -- Observações
  notes TEXT,
  rejection_reason TEXT,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partner_withdrawals_partner ON partner_withdrawals(partner_id);
CREATE INDEX idx_partner_withdrawals_status ON partner_withdrawals(status);
CREATE INDEX idx_partner_withdrawals_requested ON partner_withdrawals(requested_at);
```

### **Tabela: system_config (NOVA)**

```sql
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Categoria da Configuração
  category VARCHAR(100) NOT NULL, -- interest_rates, payment_terms, withdrawal_rules, etc.
  key VARCHAR(100) NOT NULL UNIQUE,
  
  -- Valor
  value TEXT NOT NULL,
  value_type VARCHAR(50), -- string, number, boolean, json
  
  -- Metadados
  display_name VARCHAR(255),
  description TEXT,
  
  -- Validação
  validation_rule TEXT, -- Ex: "min:0,max:100" para percentuais
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

-- Configurações Iniciais
INSERT INTO system_config (category, key, value, value_type, display_name, description) VALUES
('credit_limits', 'max_loan_amount', '5000', 'number', 'Valor Máximo de Empréstimo', 'Limite máximo inicial de crédito'),
('credit_limits', 'min_loan_amount', '500', 'number', 'Valor Mínimo de Empréstimo', 'Limite mínimo de crédito'),

('withdrawal_rules', 'minimum_withdrawal', '100', 'number', 'Resgate Mínimo', 'Valor mínimo para resgate pelo parceiro'),
('withdrawal_rules', 'minimum_installments_paid', '3', 'number', 'Parcelas Mínimas', 'Número mínimo de parcelas pagas antes do resgate'),
('withdrawal_rules', 'early_withdrawal_fee', '2.0', 'number', 'Taxa de Resgate Antecipado', 'Percentual cobrado em resgates antes do prazo'),
('withdrawal_rules', 'early_withdrawal_fee_waived_after_months', '12', 'number', 'Isenção de Taxa Após', 'Meses até isenção da taxa de resgate'),

('payment_terms', 'default_payment_day', '10', 'number', 'Dia de Pagamento Padrão', 'Dia do mês para pagamentos mensais');
```

---

## 🤖 AGENTES ATUALIZADOS

### **Agente 9: AgentCreditAnalyzer (ATUALIZADO)**

```javascript
{
  id: "agent-credit-analyzer-001",
  name: "Analisador de Crédito (Tabela Customizável)",
  type: "credit_analyzer",
  status: "active",
  
  triggers: [
    "application.created",
    "credit_score.received"
  ],
  
  actions: [
    "pull_credit_score",
    "determine_rate_category",
    "query_rate_table", // Consulta tabela customizável
    "validate_against_limits",
    "calculate_payment_schedule",
    "update_application_terms"
  ],
  
  workflow: [
    "1. Aplicação criada",
    "2. Puxar credit score via Experian",
    "3. Determinar categoria baseado no score",
    "4. Consultar tabela interest_rate_rules (apenas categorias ativas)",
    "5. Verificar se categoria está habilitada (is_active = true)",
    "6. Aplicar taxa da categoria",
    "7. Validar valor solicitado contra max_loan_amount",
    "8. Validar prazo solicitado contra max_term_* (baseado na frequência)",
    "9. Calcular parcelas (mensal, quinzenal ou semanal)",
    "10. Atualizar aplicação com termos finais",
    "11. Se aprovado, criar contrato"
  ],
  
  exampleFlow: {
    input: {
      requestedAmount: 5000,
      requestedTerm: 24, // 24 quinzenas
      requestedFrequency: "biweekly",
      monthlyIncome: 2500,
      creditScore: 675
    },
    
    step1_determineCategory: {
      score: 675,
      matchedCategory: "fair", // 650-699
      categoryActive: true
    },
    
    step2_queryRateTable: {
      query: "SELECT * FROM interest_rate_rules WHERE category = 'fair' AND is_active = true",
      result: {
        interest_rate: 16.99,
        max_loan_amount: 5000,
        max_term_biweekly: 24,
        min_monthly_income: 2000
      }
    },
    
    step3_validate: {
      amountCheck: "PASS", // 5000 <= 5000
      termCheck: "PASS", // 24 <= 24
      incomeCheck: "PASS", // 2500 >= 2000
      approved: true
    },
    
    step4_calculatePayment: {
      principal: 5000,
      rate: 16.99,
      frequency: "biweekly",
      installments: 24,
      
      calculation: {
        biweeklyPayment: 238.10,
        totalPayment: 5714.40,
        totalInterest: 714.40,
        
        breakdown: {
          principalPerPayment: 208.33, // 5000 / 24
          interestPerPayment: 29.77,
          totalPerPayment: 238.10
        }
      }
    },
    
    output: {
      approved: true,
      approvedAmount: 5000,
      interestRate: 16.99,
      frequency: "biweekly",
      installments: 24,
      paymentAmount: 238.10,
      totalAmount: 5714.40,
      category: "fair",
      riskLevel: "medium"
    }
  }
}
```

### **Agente 10: AgentPartnerReceivables (NOVO)**

```javascript
{
  id: "agent-partner-receivables-001",
  name: "Gestor de Recebíveis do Parceiro",
  type: "partner_receivables_manager",
  status: "active",
  
  triggers: [
    "contract.signed",
    "payment.received_from_client",
    "withdrawal.requested"
  ],
  
  actions: [
    "create_receivable_record",
    "update_receivable_balance",
    "process_withdrawal_request",
    "notify_partner_of_payment",
    "generate_receivables_statement"
  ],
  
  workflow: {
    createReceivable: [
      "1. Contrato assinado",
      "2. Criar registro em partner_receivables",
      "3. Calcular valores:",
      "   - Total Receivable: valor principal do contrato",
      "   - Total Installments: número de parcelas",
      "   - Installment Amount: valor de cada parcela (só principal)",
      "4. Definir saldos iniciais:",
      "   - balance_available: 0.00",
      "   - balance_withdrawn: 0.00",
      "   - balance_pending: valor principal",
      "5. Lançar no dashboard do parceiro"
    ],
    
    updateReceivable: [
      "1. Cliente pagou parcela via ACH",
      "2. Extrair valor principal da parcela",
      "3. Atualizar partner_receivables:",
      "   - balance_available += valor_principal",
      "   - balance_pending -= valor_principal",
      "   - installments_paid++",
      "4. Criar transação em partner_receivable_transactions:",
      "   - transaction_type: 'credit'",
      "   - amount: valor_principal",
      "   - balance_after: novo saldo disponível",
      "5. Notificar parceiro: 'Nova parcela creditada'"
    ],
    
    processWithdrawal: [
      "1. Parceiro solicita resgate",
      "2. Validar requisitos:",
      "   - Saldo disponível >= mínimo ($100)",
      "   - Parcelas pagas >= mínimo (3)",
      "3. Calcular fee (se aplicável):",
      "   - Se < 12 meses: 2% de fee",
      "   - Se >= 12 meses: sem fee",
      "4. Criar registro em partner_withdrawals",
      "5. Status: 'pending' (aguarda aprovação admin)",
      "6. Admin aprova → Status: 'processing'",
      "7. Iniciar ACH via PayBright → Parceiro",
      "8. Atualizar receivables:",
      "   - balance_available -= valor",
      "   - balance_withdrawn += valor",
      "9. Criar transação:",
      "   - transaction_type: 'debit'",
      "   - amount: valor solicitado",
      "   - fee_amount: fee",
      "   - net_amount: valor - fee",
      "10. Status: 'completed'",
      "11. Notificar parceiro: 'Resgate processado'"
    ]
  },
  
  exampleScenario: {
    contract: {
      client: "João Silva",
      partner: "Casa Bonita Furniture",
      principal: 5000,
      frequency: "biweekly",
      installments: 24,
      installmentAmount: 208.33 // Só principal
    },
    
    timeline: {
      day0: {
        event: "Contrato assinado",
        receivable: {
          total_receivable: 5000,
          balance_available: 0.00,
          balance_withdrawn: 0.00,
          balance_pending: 5000.00,
          installments_paid: 0
        }
      },
      
      day14: {
        event: "Cliente pagou 1ª quinzena",
        payment: 238.10, // Total (principal + juros)
        principal: 208.33, // Só principal vai pro parceiro
        interest: 29.77, // Lucro FlexCredi
        receivable: {
          balance_available: 208.33,
          balance_pending: 4791.67,
          installments_paid: 1
        }
      },
      
      day28: {
        event: "Cliente pagou 2ª quinzena",
        receivable: {
          balance_available: 416.66,
          balance_pending: 4583.34,
          installments_paid: 2
        }
      },
      
      day42: {
        event: "Cliente pagou 3ª quinzena",
        receivable: {
          balance_available: 624.99,
          balance_pending: 4375.01,
          installments_paid: 3
        }
      },
      
      day45: {
        event: "Parceiro solicita resgate de $600",
        withdrawal: {
          requested_amount: 600.00,
          fee: 12.00, // 2% (antes de 12 meses)
          net_amount: 588.00,
          status: "pending"
        }
      },
      
      day46: {
        event: "Admin aprova resgate",
        status: "processing"
      },
      
      day47: {
        event: "ACH processado, parceiro recebe",
        receivable: {
          balance_available: 24.99, // 624.99 - 600
          balance_withdrawn: 600.00,
          balance_pending: 4375.01,
          installments_paid: 3
        }
      },
      
      // ... continua até dia 336 (24 quinzenas)
      
      day336: {
        event: "Última parcela paga",
        receivable: {
          balance_available: 24.99, // Resto não resgatado
          balance_withdrawn: 600.00,
          balance_pending: 0.00,
          installments_paid: 24,
          status: "completed"
        },
        partnerCanWithdraw: 24.99 // Sem fee (prazo completo)
      }
    }
  }
}
```

---

## 📱 PARTNER DASHBOARD ATUALIZADO

```
┌──────────────────────────────────────────────────────────────┐
│  🤝 PARTNER DASHBOARD - Casa Bonita Furniture               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  💰 RECEBÍVEIS                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Total de Recebíveis: $15,000.00                       │ │
│  │  Disponível para Resgate: $3,124.95  [💵 RESGATAR]    │ │
│  │  Já Resgatado: $1,200.00                               │ │
│  │  Pendente de Receber: $10,675.05                       │ │
│  │                                                        │ │
│  │  Parcelas Recebidas: 15/72 (21%)                      │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 21%                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📊 CONTRATOS ATIVOS                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Cliente: João Silva                                    │ │
│  │ Valor: $5,000.00                                       │ │
│  │ Frequência: Quinzenal                                  │ │
│  │ Parcelas: 5/24 pagas (21%)                             │ │
│  │ Disponível: $1,041.65  [Ver Detalhes]                 │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Cliente: Maria Santos                                  │ │
│  │ Valor: $3,500.00                                       │ │
│  │ Frequência: Semanal                                    │ │
│  │ Parcelas: 8/48 pagas (17%)                             │ │
│  │ Disponível: $583.30  [Ver Detalhes]                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📅 PRÓXIMAS ENTRADAS (Próximos 30 Dias)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  22/Fev - João Silva: $208.33 🟢                       │ │
│  │  23/Fev - Maria Santos: $72.92 🟢                      │ │
│  │  01/Mar - Pedro Costa: $138.89 🟡                      │ │
│  │  07/Mar - João Silva: $208.33 🟡                       │ │
│  │  ... mais 12 entradas previstas                        │ │
│  │                                                        │ │
│  │  Total Previsto: $2,450.80                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  📜 HISTÓRICO DE RESGATES                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  15/Fev - $600.00 (-$12.00 fee) = $588.00 ✅          │ │
│  │  01/Fev - $600.00 (-$12.00 fee) = $588.00 ✅          │ │
│  │  [Ver Todos os Resgates]                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [➕ CADASTRAR CLIENTE] [📊 RELATÓRIOS] [⚙️ CONFIGURAÇÕES]   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 CRONOGRAMA FINAL (MANTIDO)

| Sprint | Conteúdo | Backend | Frontend | Total | Dias |
|--------|----------|---------|----------|-------|------|
| Sprint 1 | Base + Clientes + Config | 8-10h | 12-14h | 20-24h | 2-3 |
| Sprint 2 | Docs + Contratos | 8-10h | 10-12h | 18-22h | 2-3 |
| Sprint 3 | PayBright + Credit | 14-16h | 12-14h | 26-30h | 3-4 |
| Sprint 4 | Parceiros + Recebíveis | 16-18h | 18-20h | 34-38h | 3-4 |
| **TOTAL** | | **46-54h** | **52-60h** | **98-114h** | **10-14 dias** |

**Tempo estimado**: **12-14 dias de trabalho focado**

---

## ✅ CONFIRMAÇÃO FINAL V4.0

**Sistema Definitivo:**

✅ **PayBright Gateway** para ACH  
✅ **Experian** para credit score  
✅ **Tabelas customizáveis** no admin:
  - Taxas de juros editáveis
  - Frequências de pagamento (mensal, quinzenal, semanal)
  - Regras de resgate configuráveis
✅ **Fluxo correto de parceiro**:
  - Cliente escolhe parceiro
  - FlexCredi lança recebíveis no dashboard
  - Parceiro vê saldo acumulando
  - Parceiro resgata quando quiser (com regras)
✅ **Limites iniciais**: $5,000 máx, 16.99% mín  
✅ **Frequências**: até 48 semanas, 24 quinzenas, 36 meses  
✅ **SEM integração externa** (por enquanto)  
✅ **11 agentes autônomos** + Agente Mestre  
✅ Layout **dashboard-cliente.html**  
✅ **98-114 horas** (12-14 dias)

---

## 🚀 PRONTO PARA COMEÇAR!

**RESPONDA:**

**"SIM, COMEÇAR SPRINT 1 AGORA"**

E eu inicio imediatamente! 💪🚀

# 🎯 PLANEJAMENTO V4.0 FINAL - SISTEMA FLEXCREDI COMPLETO
## Sistema de Gestão de Crédito com Parceiros e Recebíveis

---

## 📋 ÍNDICE
1. [Visão Geral](#visão-geral)
2. [Fluxo de Negócio Completo](#fluxo-de-negócio-completo)
3. [Modelo de Dados](#modelo-de-dados)
4. [Sistema de Regras Configuráveis](#sistema-de-regras-configuráveis)
5. [Integrações Externas](#integrações-externas)
6. [Arquitetura de Agentes Autônomos](#arquitetura-de-agentes-autônomos)
7. [Interfaces do Sistema](#interfaces-do-sistema)
8. [Cronograma de Implementação](#cronograma-de-implementação)

---

## 🎯 VISÃO GERAL

### Modelo de Negócio FlexCredi
**FlexCredi atua como intermediária financeira**, conectando:
- **Parceiros** (que vendem produtos/serviços e têm recebíveis futuros)
- **Clientes** (que precisam de crédito para comprar do parceiro)
- **Provedores de Capital** (bancos/APIs externas - futuro)

**Receita FlexCredi:**
1. **Fee do parceiro**: 3% sobre o valor pago ao parceiro
2. **Juros do cliente**: diferença entre taxa cobrada do cliente e custo de capital
3. **Spread financeiro**: gestão de fluxo de caixa e risco

---

## 🔄 FLUXO DE NEGÓCIO COMPLETO

### Fase 1: Cadastro e Aprovação de Parceiros
```
[Parceiro] → Preenche cadastro (empresa, documentos, recebíveis)
           ↓
[Admin] → Analisa documentação e histórico
        → Aprova/Rejeita parceiro
        → Define limite de crédito para o parceiro
           ↓
[Sistema] → Parceiro recebe credenciais de acesso
          → Parceiro acessa Partner Dashboard
```

**Dados do Parceiro:**
- Razão social, CNPJ, endereço
- Representante legal
- Documentos: Contrato Social, Comprovante de Endereço, Balanço Patrimonial
- Informações bancárias (para recebimento)
- Recebíveis mensais médios
- Volume de vendas mensal

### Fase 2: Aplicação do Cliente
```
[Cliente] → Acessa site FlexCredi ou link do parceiro
          → Preenche formulário de aplicação
          ↓
Dados coletados:
- Nome completo, CPF, data nascimento
- Endereço completo
- Telefone, email
- Renda mensal comprovada
- Emprego/profissão
- Valor desejado
- Finalidade do crédito
- **PARCEIRO ESCOLHIDO** (dropdown ou código do parceiro)
```

### Fase 3: Análise e Aprovação FlexCredi
```
[Sistema] → Recebe aplicação
          ↓
[AgentCreditAnalyzer] → Consulta Experian (score)
                      → Calcula DTI (debt-to-income)
                      → Verifica histórico de crédito
                      → Aplica regras configuradas
                      ↓
Resultado: Score final (300-850)
          ↓
[Sistema] → Busca regras ativas para o score do cliente
          → Calcula taxa de juros
          → Define valor máximo aprovado
          → Define prazo máximo
          → Define frequência de pagamento permitida
          ↓
[Admin] → Revisão manual (se necessário)
        → Aprovação final ou ajuste de condições
```

**Exemplo Real:**
- Cliente: João Silva, CPF 123.456.789-00
- Score Experian: 720 (GOOD)
- Renda mensal: $5,000
- Valor solicitado: $25,000
- Parceiro escolhido: "AutoPeças Souza" (ID: PART-001)

**Regras aplicadas:**
```javascript
{
  minScore: 700,
  maxScore: 749,
  tier: "GOOD",
  interestRate: 12.99,  // % a.a.
  maxAmount: 40000,     // até 8x renda
  maxTermMonths: 48,
  allowedFrequencies: ["monthly", "biweekly"]
}
```

**Resultado:**
- ✅ Aprovado: $25,000
- Taxa: 12.99% a.a.
- Prazo: 36 meses (escolhido pelo cliente)
- Frequência: mensal
- Parcela mensal: **$843.86**

### Fase 4: Assinatura de Contrato e Autorização ACH
```
[Cliente] → Recebe email/SMS de aprovação
          → Acessa dashboard do cliente
          → Revisa termos do contrato:
              * Valor aprovado
              * Taxa de juros
              * Prazo e frequência de pagamento
              * Valor da parcela
              * Total a pagar
          → Assina contrato digitalmente (DocuSign/HelloSign)
          → Autoriza débito automático ACH:
              * Routing number
              * Account number
              * Tipo de conta (checking/savings)
              * Autorização de débito recorrente
          ↓
[AgentPayBrightACH] → Valida conta bancária (micro-depósitos)
                    → Cria mandato ACH no PayBright
                    → Confirma autorização
```

**Documento de Contrato Inclui:**
- Termos e condições completos
- Amortization schedule (tabela de pagamentos)
- Política de atrasos e penalties
- Direitos do consumidor (Truth in Lending Act)
- Autorização de débito automático ACH

### Fase 5: Lançamento de Recebíveis do Parceiro
```
[Sistema] → Cliente assinou contrato
          → Valor aprovado: $25,000
          → Fee FlexCredi: 3% = $750
          → Valor a pagar ao parceiro: $24,250
          ↓
[AgentPartnerReceivables] → Consulta recebíveis futuros do parceiro
                          → Cria schedule de descontos:
```

**Exemplo de Recebíveis do Parceiro:**

| Mês | Recebível Previsto | Desconto FlexCredi | Saldo Líquido Parceiro |
|-----|-------------------|-------------------|----------------------|
| Mar/2026 | $15,000 | $8,083 (33.3%) | $6,917 |
| Abr/2026 | $15,000 | $8,083 (33.3%) | $6,917 |
| Mai/2026 | $15,000 | $8,084 (33.4%) | $6,916 |
| **Total** | **$45,000** | **$24,250** | **$20,750** |

**Lógica de Cálculo:**
```javascript
// Valor a descontar do parceiro
const totalToDiscount = approvedAmount - (approvedAmount * flexCrediFeeRate);
// $25,000 - $750 = $24,250

// Distribuir em 3 meses (configurável)
const monthlyReceivables = partnerMonthlyAverage; // $15,000
const discountPeriodMonths = Math.ceil(totalToDiscount / monthlyReceivables);
// ceil(24,250 / 15,000) = 2 meses → mas dividimos em 3 para dar folga

// Desconto mensal
const monthlyDiscount = totalToDiscount / 3; // $8,083.33
```

### Fase 6: Pagamento ao Parceiro
```
[AgentPayBrightACH] → Inicia transferência ACH/Wire
                    → Destino: conta bancária do parceiro
                    → Valor: $24,250 (aprovado - fee)
                    → Prazo: 2-3 dias úteis
                    ↓
[Parceiro] → Recebe crédito na conta
           → Entrega produto/serviço ao cliente
           → Emite nota fiscal
           ↓
[Sistema] → Registra payment_to_partner
          → Status: completed
          → Partner Dashboard atualizado:
              * Recebido: $24,250
              * Recebíveis comprometidos: $24,250
              * Descontos futuros: 3 meses
```

### Fase 7: Cobrança do Cliente via ACH
```
[AgentPayBrightACH] → Agenda débito automático recorrente
                    → Frequência: mensal (dia 15 de cada mês)
                    → Valor por parcela: $843.86
                    → Prazo: 36 meses
                    ↓
Cronograma de Débitos:
- 15/Mar/2026: $843.86 → STATUS: pending
- 15/Abr/2026: $843.86 → STATUS: scheduled
- 15/Mai/2026: $843.86 → STATUS: scheduled
- ... (até 36 meses)
```

**Tratamento de Falhas ACH:**
```
Se débito falhar (R01: insufficient funds):
   ↓
[AgentPayBrightACH] → Tenta novamente em 3 dias
                    → Se falhar 3x:
                       ↓
[AgentNotifier] → Envia email/SMS ao cliente
                → Notifica admin
                → Marca pagamento como "late"
                ↓
[AgentPartnerManager] → Ajusta cronograma de descontos do parceiro
                      → Congela novos descontos até regularização
```

### Fase 8: Desconto dos Recebíveis do Parceiro
```
Todo mês, quando cliente paga:
   ↓
[AgentPartnerReceivables] → Monitora pagamento do cliente
                          → Cliente pagou $843.86 em 15/Mar
                          → FlexCredi recebeu o pagamento
                          ↓
No processamento mensal do parceiro:
   ↓
[AgentPartnerManager] → Calcula recebíveis do mês
                      → Parceiro faturou $15,000 em Março
                      → Desconto programado: $8,083
                      ↓
                      → FlexCredi retém $8,083
                      → Parceiro recebe $6,917 líquido
                      ↓
                      → Atualiza saldo devedor:
                         Saldo anterior: $24,250
                         Desconto aplicado: $8,083
                         Novo saldo: $16,167
```

**Dashboard do Parceiro Exibe:**
```
╔══════════════════════════════════════════════════════╗
║  RECEBÍVEIS COMPROMETIDOS                            ║
╠══════════════════════════════════════════════════════╣
║  Cliente: João Silva                                 ║
║  Contrato: FLEX-2026-0042                           ║
║  Valor total: $24,250.00                            ║
║  ──────────────────────────────────────────────────  ║
║  ✅ Mar/2026: $8,083 descontado → Saldo: $16,167   ║
║  🟡 Abr/2026: $8,083 agendado                       ║
║  ⚪ Mai/2026: $8,084 agendado                       ║
║  ──────────────────────────────────────────────────  ║
║  💰 Total já descontado: $8,083                     ║
║  📊 Saldo restante: $16,167 (66.7%)                 ║
╚══════════════════════════════════════════════════════╝
```

---

## 📊 MODELO DE DADOS

### Schema Prisma Completo

```prisma
// ═══════════════════════════════════════════════════════════
// PARCEIROS
// ═══════════════════════════════════════════════════════════

model Partner {
  id                String   @id @default(uuid())
  
  // Dados da empresa
  companyName       String
  tradeName         String?
  cnpj              String   @unique
  email             String   @unique
  phone             String
  
  // Endereço
  address           String
  city              String
  state             String
  zipCode           String
  
  // Representante legal
  legalRepName      String
  legalRepCpf       String
  legalRepEmail     String
  legalRepPhone     String
  
  // Dados bancários
  bankName          String?
  bankBranch        String?
  bankAccount       String?
  bankAccountType   String?   // checking, savings
  
  // Informações financeiras
  monthlyRevenue    Float?    // Faturamento mensal médio
  monthlyReceivables Float?   // Recebíveis mensais médios
  creditLimit       Float?    // Limite total de crédito que o parceiro pode usar
  
  // Status e aprovação
  status            PartnerStatus  @default(PENDING)
  approvedAt        DateTime?
  approvedBy        String?       // Admin user ID
  rejectedAt        DateTime?
  rejectionReason   String?
  
  // Fee FlexCredi
  flexCrediFeeRate  Float    @default(0.03)  // 3% padrão
  
  // Controle
  active            Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relações
  applications      Application[]
  receivables       PartnerReceivable[]
  payments          PartnerPayment[]
  documents         PartnerDocument[]
  
  @@map("partners")
}

enum PartnerStatus {
  PENDING           // Aguardando aprovação
  APPROVED          // Aprovado e ativo
  REJECTED          // Rejeitado
  SUSPENDED         // Suspenso temporariamente
  BLOCKED           // Bloqueado permanentemente
}

// ═══════════════════════════════════════════════════════════
// DOCUMENTOS DO PARCEIRO
// ═══════════════════════════════════════════════════════════

model PartnerDocument {
  id                String   @id @default(uuid())
  partnerId         String
  
  type              PartnerDocType
  originalName      String
  cloudinaryUrl     String
  cloudinaryPublicId String
  fileSize          Int
  mimeType          String
  
  status            String   @default("pending")  // pending, approved, rejected
  reviewedAt        DateTime?
  reviewedBy        String?
  reviewNotes       String?
  
  uploadedAt        DateTime @default(now())
  
  partner           Partner  @relation(fields: [partnerId], references: [id])
  
  @@map("partner_documents")
}

enum PartnerDocType {
  CONTRATO_SOCIAL
  COMPROVANTE_ENDERECO
  BALANCO_PATRIMONIAL
  CERTIDAO_NEGATIVA
  PROCURACAO
  RG_REPRESENTANTE
  CPF_REPRESENTANTE
  COMPROVANTE_CONTA_BANCARIA
  OUTROS
}

// ═══════════════════════════════════════════════════════════
// RECEBÍVEIS DO PARCEIRO (COMMITMENTS)
// ═══════════════════════════════════════════════════════════

model PartnerReceivable {
  id                String   @id @default(uuid())
  partnerId         String
  applicationId     String?   // Vinculado a uma aplicação específica
  
  // Período do recebível
  referenceMonth    String    // "2026-03" formato YYYY-MM
  dueDate           DateTime  // Data de vencimento
  
  // Valores
  expectedAmount    Float     // Recebível previsto do mês
  discountAmount    Float     // Desconto FlexCredi programado
  netAmount         Float     // Valor líquido para o parceiro
  
  // Status
  status            ReceivableStatus @default(SCHEDULED)
  processedAt       DateTime?
  
  // Pagamento real
  actualAmount      Float?    // Valor efetivamente recebido
  paidAt            DateTime?
  
  // Controle
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  partner           Partner   @relation(fields: [partnerId], references: [id])
  application       Application? @relation(fields: [applicationId], references: [id])
  
  @@map("partner_receivables")
  @@index([partnerId, referenceMonth])
  @@index([partnerId, status])
}

enum ReceivableStatus {
  SCHEDULED         // Agendado
  PROCESSING        // Em processamento
  COMPLETED         // Desconto aplicado
  PARTIAL           // Parcialmente pago
  FAILED            // Falha no processamento
  CANCELLED         // Cancelado
}

// ═══════════════════════════════════════════════════════════
// PAGAMENTOS AO PARCEIRO (DISBURSEMENTS)
// ═══════════════════════════════════════════════════════════

model PartnerPayment {
  id                String   @id @default(uuid())
  partnerId         String
  applicationId     String   // Vinculado à aplicação que gerou o pagamento
  
  // Valores
  grossAmount       Float    // Valor aprovado para o cliente
  feeAmount         Float    // Fee FlexCredi (3%)
  netAmount         Float    // Valor líquido pago ao parceiro
  
  // Método de pagamento
  paymentMethod     String   // ACH, WIRE, PIX
  
  // Dados bancários (snapshot do momento do pagamento)
  bankName          String
  bankBranch        String?
  bankAccount       String
  bankAccountType   String
  
  // Status do pagamento
  status            PaymentStatus @default(PENDING)
  
  // Tracking
  initiatedAt       DateTime  @default(now())
  processedAt       DateTime?
  completedAt       DateTime?
  failedAt          DateTime?
  failureReason     String?
  
  // IDs externos (PayBright, banco, etc)
  externalId        String?
  transactionId     String?
  
  // Controle
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  partner           Partner     @relation(fields: [partnerId], references: [id])
  application       Application @relation(fields: [applicationId], references: [id])
  
  @@map("partner_payments")
  @@index([partnerId, status])
}

enum PaymentStatus {
  PENDING           // Aguardando processamento
  PROCESSING        // Em processamento
  COMPLETED         // Concluído com sucesso
  FAILED            // Falhou
  CANCELLED         // Cancelado
  REFUNDED          // Estornado
}

// ═══════════════════════════════════════════════════════════
// APLICAÇÕES (SOLICITAÇÕES DE CRÉDITO)
// ═══════════════════════════════════════════════════════════

model Application {
  id                String   @id @default(uuid())
  userId            String?  // Cliente (pode não ter conta ainda)
  partnerId         String   // PARCEIRO ESCOLHIDO PELO CLIENTE
  
  // Dados do cliente (snapshot)
  clientName        String
  clientEmail       String
  clientPhone       String
  clientCpf         String
  clientAddress     String?
  clientCity        String?
  clientState       String?
  clientZipCode     String?
  
  // Renda e emprego
  monthlyIncome     Float
  employmentStatus  String
  employer          String?
  occupation        String?
  
  // Solicitação de crédito
  desiredAmount     Float
  purpose           String
  
  // Análise de crédito
  creditScore       Int?
  creditTier        String?   // EXCELLENT, GOOD, FAIR, POOR, VERY_POOR
  dti               Float?    // Debt-to-income ratio
  
  // Aprovação
  status            ApplicationStatus @default(PENDING)
  approvedAmount    Float?
  interestRate      Float?    // Taxa anual
  termMonths        Int?
  paymentFrequency  PaymentFrequency?
  monthlyPayment    Float?    // ou weeklyPayment, biweeklyPayment
  totalAmount       Float?    // Total a pagar
  
  // Datas importantes
  submittedAt       DateTime  @default(now())
  analyzedAt        DateTime?
  approvedAt        DateTime?
  rejectedAt        DateTime?
  
  // Aprovação manual
  reviewedBy        String?   // Admin user ID
  reviewNotes       String?
  rejectionReason   String?
  
  // Risco
  riskLevel         String?   // LOW, MEDIUM, HIGH
  fraudScore        Float?
  
  // Contrato e pagamento
  contractSigned    Boolean   @default(false)
  contractSignedAt  DateTime?
  achAuthorized     Boolean   @default(false)
  achAuthorizedAt   DateTime?
  
  // Dados ACH do cliente
  achRoutingNumber  String?
  achAccountNumber  String?
  achAccountType    String?   // checking, savings
  achMandateId      String?   // ID do mandato no PayBright
  
  // Pagamento ao parceiro
  partnerPaymentStatus String? // pending, completed, failed
  partnerPaidAt        DateTime?
  
  // Controle
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relações
  user              User?       @relation(fields: [userId], references: [id])
  partner           Partner     @relation(fields: [partnerId], references: [id])
  documents         Document[]
  contract          Contract?
  receivables       PartnerReceivable[]
  partnerPayments   PartnerPayment[]
  achPayments       AchPayment[]
  creditReport      CreditReport?
  
  @@map("applications")
  @@index([userId])
  @@index([partnerId])
  @@index([status])
  @@index([creditScore])
}

enum ApplicationStatus {
  PENDING           // Aguardando análise
  ANALYZING         // Em análise automática
  MANUAL_REVIEW     // Requer revisão manual
  APPROVED          // Aprovado
  REJECTED          // Rejeitado
  CONTRACT_PENDING  // Aguardando assinatura contrato
  ACH_PENDING       // Aguardando autorização ACH
  ACTIVE            // Ativo (contrato assinado, pagamentos iniciados)
  PAID_OFF          // Quitado
  DEFAULTED         // Inadimplente
  CANCELLED         // Cancelado
}

enum PaymentFrequency {
  WEEKLY            // Semanal
  BIWEEKLY          // Quinzenal (bisemanal)
  MONTHLY           // Mensal
}

// ═══════════════════════════════════════════════════════════
// PAGAMENTOS ACH DO CLIENTE
// ═══════════════════════════════════════════════════════════

model AchPayment {
  id                String   @id @default(uuid())
  applicationId     String
  
  // Informações do pagamento
  installmentNumber Int      // Número da parcela (1, 2, 3...)
  dueDate           DateTime
  amount            Float
  
  // Status
  status            AchPaymentStatus @default(SCHEDULED)
  
  // Processamento
  attemptCount      Int      @default(0)
  lastAttemptAt     DateTime?
  scheduledAt       DateTime
  processedAt       DateTime?
  completedAt       DateTime?
  failedAt          DateTime?
  
  // Detalhes de falha
  failureCode       String?  // R01, R02, R03, etc (ACH return codes)
  failureReason     String?
  
  // IDs externos
  paybrightPaymentId String?
  achTransactionId   String?
  
  // Controle
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  application       Application @relation(fields: [applicationId], references: [id])
  
  @@map("ach_payments")
  @@index([applicationId, status])
  @@index([dueDate])
}

enum AchPaymentStatus {
  SCHEDULED         // Agendado
  PROCESSING        // Em processamento
  COMPLETED         // Concluído
  FAILED            // Falhou
  RETRYING          // Tentando novamente
  CANCELLED         // Cancelado
}

// ═══════════════════════════════════════════════════════════
// RELATÓRIOS DE CRÉDITO (EXPERIAN)
// ═══════════════════════════════════════════════════════════

model CreditReport {
  id                String   @id @default(uuid())
  applicationId     String   @unique
  userId            String?
  
  // Score
  creditScore       Int
  scoreModel        String   // FICO, VantageScore, etc
  
  // Informações detalhadas
  fullReportJson    Json     // Relatório completo em JSON
  
  // Métricas principais
  totalAccounts     Int?
  openAccounts      Int?
  delinquentAccounts Int?
  totalDebt         Float?
  availableCredit   Float?
  creditUtilization Float?   // %
  oldestAccountAge  Int?     // meses
  recentInquiries   Int?
  publicRecords     Int?
  
  // Custo da consulta
  cost              Float?
  provider          String   @default("experian")
  
  // Controle
  pulledAt          DateTime @default(now())
  expiresAt         DateTime // Relatórios expiram em 30-90 dias
  
  application       Application @relation(fields: [applicationId], references: [id])
  user              User?       @relation(fields: [userId], references: [id])
  
  @@map("credit_reports")
  @@index([applicationId])
  @@index([userId])
}

// ═══════════════════════════════════════════════════════════
// REGRAS DE TAXA DE JUROS (CONFIGURÁVEIS)
// ═══════════════════════════════════════════════════════════

model InterestRateRule {
  id                String   @id @default(uuid())
  
  // Range de score
  minScore          Int
  maxScore          Int
  tier              String   // EXCELLENT, GOOD, FAIR, POOR, VERY_POOR
  
  // Taxa de juros
  interestRate      Float    // % anual
  
  // Limites
  maxAmount         Float    // Valor máximo aprovado
  maxTermMonths     Int      // Prazo máximo em meses
  
  // Frequências permitidas
  allowWeekly       Boolean  @default(false)
  allowBiweekly     Boolean  @default(true)
  allowMonthly      Boolean  @default(true)
  
  // Múltiplo da renda
  maxIncomeMultiple Float?   // Ex: 8x renda mensal
  minIncomeRequired Float?   // Renda mínima exigida
  
  // DTI máximo
  maxDti            Float?   // Ex: 0.43 (43%)
  
  // Status
  active            Boolean  @default(true)
  priority          Int      @default(0)  // Ordem de aplicação
  
  // Controle
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  createdBy         String?  // Admin user ID
  
  @@map("interest_rate_rules")
  @@index([minScore, maxScore])
  @@index([active, priority])
}

// ═══════════════════════════════════════════════════════════
// CONTRATOS
// ═══════════════════════════════════════════════════════════

model Contract {
  id                String   @id @default(uuid())
  applicationId     String   @unique
  
  contractNumber    String   @unique
  
  // Valores
  principalAmount   Float
  interestRate      Float
  termMonths        Int
  paymentFrequency  PaymentFrequency
  paymentAmount     Float    // Valor de cada pagamento
  totalAmount       Float    // Total a pagar
  
  // Amortization schedule
  amortizationJson  Json     // Tabela de amortização completa
  
  // Status
  status            ContractStatus @default(GENERATED)
  
  // Datas
  generatedAt       DateTime @default(now())
  signedAt          DateTime?
  activatedAt       DateTime?
  paidOffAt         DateTime?
  defaultedAt       DateTime?
  
  // Assinatura digital
  signatureHash     String?
  signerIp          String?
  docusignEnvelopeId String?
  
  // Documento
  documentUrl       String?
  documentHash      String?
  
  // Controle
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  application       Application @relation(fields: [applicationId], references: [id])
  
  @@map("contracts")
}

enum ContractStatus {
  GENERATED         // Gerado, aguardando assinatura
  SIGNED            // Assinado pelo cliente
  ACTIVE            // Ativo (pagamentos iniciados)
  PAID_OFF          // Quitado
  DEFAULTED         // Inadimplente
  CANCELLED         // Cancelado
}

// ═══════════════════════════════════════════════════════════
// USUÁRIOS DO SISTEMA (CLIENTES E ADMINS)
// ═══════════════════════════════════════════════════════════

model User {
  id                String   @id @default(uuid())
  
  email             String   @unique
  phone             String?
  password          String?  // Hash bcrypt
  
  // Tipo de usuário
  role              UserRole @default(CLIENT)
  
  // Dados pessoais (para clientes)
  name              String
  cpf               String?  @unique
  dateOfBirth       DateTime?
  
  // Endereço
  address           String?
  city              String?
  state             String?
  zipCode           String?
  
  // Dados financeiros
  monthlyIncome     Float?
  employer          String?
  occupation        String?
  
  // Status
  active            Boolean  @default(true)
  emailVerified     Boolean  @default(false)
  phoneVerified     Boolean  @default(false)
  
  // Controle
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastLoginAt       DateTime?
  
  // Relações
  applications      Application[]
  documents         Document[]
  creditReports     CreditReport[]
  
  @@map("users")
}

enum UserRole {
  CLIENT            // Cliente
  ADMIN             // Administrador FlexCredi
  SUPER_ADMIN       // Super administrador (full access)
  SUPPORT           // Suporte
}

// ═══════════════════════════════════════════════════════════
// DOCUMENTOS DO CLIENTE
// ═══════════════════════════════════════════════════════════

model Document {
  id                String   @id @default(uuid())
  userId            String?
  applicationId     String?
  
  type              DocumentType
  originalName      String
  
  // Cloudinary
  cloudinaryUrl     String
  cloudinaryPublicId String
  fileSize          Int
  mimeType          String
  
  // Status
  status            DocumentStatus @default(PENDING)
  reviewedAt        DateTime?
  reviewedBy        String?
  reviewNotes       String?
  
  // Extração de dados (OCR)
  extractedData     Json?
  confidence        Float?
  
  // Controle
  uploadedAt        DateTime @default(now())
  
  user              User?       @relation(fields: [userId], references: [id])
  application       Application? @relation(fields: [applicationId], references: [id])
  
  @@map("documents")
}

enum DocumentType {
  ID_FRONT
  ID_BACK
  PROOF_OF_INCOME
  BANK_STATEMENT
  PROOF_OF_ADDRESS
  TAX_RETURN
  EMPLOYMENT_LETTER
  OTHER
}

enum DocumentStatus {
  PENDING
  APPROVED
  REJECTED
  EXPIRED
}

// ═══════════════════════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════════════════════

model AuditLog {
  id                String   @id @default(uuid())
  
  userId            String?
  action            String   // CREATE, UPDATE, DELETE, APPROVE, etc
  entity            String   // Application, Partner, User, etc
  entityId          String?
  
  // Dados
  changes           Json?    // { before: {...}, after: {...} }
  
  // Contexto
  ipAddress         String?
  userAgent         String?
  
  timestamp         DateTime @default(now())
  
  @@map("audit_logs")
  @@index([userId, timestamp])
  @@index([entity, entityId])
}
```

---

## ⚙️ SISTEMA DE REGRAS CONFIGURÁVEIS

### Interface Admin: Configuração de Taxas

**Página:** `/admin/configuracoes/taxas-juros`

**UI Design (baseado em dashboard-cliente.html):**
```html
<!-- Header igual ao dashboard-cliente -->
<div class="content-header">
  <h1>⚙️ Configuração de Taxas de Juros</h1>
  <button class="btn-primary" onclick="openNewRuleModal()">
    <i class="fas fa-plus"></i> Nova Regra
  </button>
</div>

<!-- Tabela de regras -->
<div class="card">
  <table class="rules-table">
    <thead>
      <tr>
        <th>Tier</th>
        <th>Score Range</th>
        <th>Taxa (% a.a.)</th>
        <th>Valor Máx</th>
        <th>Prazo Máx</th>
        <th>Frequências</th>
        <th>Status</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody id="rulesTableBody">
      <!-- Dinamicamente populado via JS -->
    </tbody>
  </table>
</div>

<!-- Modal: Nova/Editar Regra -->
<div id="ruleModal" class="modal">
  <div class="modal-content">
    <h2>Configurar Regra de Taxa</h2>
    
    <div class="form-group">
      <label>Tier de Crédito</label>
      <select id="ruleTier">
        <option value="EXCELLENT">Excellent (750-850)</option>
        <option value="GOOD">Good (700-749)</option>
        <option value="FAIR">Fair (650-699)</option>
        <option value="POOR">Poor (600-649)</option>
        <option value="VERY_POOR">Very Poor (300-599)</option>
      </select>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label>Score Mínimo</label>
        <input type="number" id="ruleMinScore" min="300" max="850">
      </div>
      <div class="form-group">
        <label>Score Máximo</label>
        <input type="number" id="ruleMaxScore" min="300" max="850">
      </div>
    </div>
    
    <div class="form-group">
      <label>Taxa de Juros (% ao ano)</label>
      <input type="number" id="ruleInterestRate" step="0.01" min="0" max="100">
      <small>Exemplo: 12.99 para 12.99% a.a.</small>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label>Valor Máximo Aprovado ($)</label>
        <input type="number" id="ruleMaxAmount" step="1000" min="0">
      </div>
      <div class="form-group">
        <label>Prazo Máximo (meses)</label>
        <input type="number" id="ruleMaxTerm" min="1" max="120">
      </div>
    </div>
    
    <div class="form-group">
      <label>Frequências de Pagamento Permitidas</label>
      <div class="checkbox-group">
        <label>
          <input type="checkbox" id="allowWeekly"> Semanal
        </label>
        <label>
          <input type="checkbox" id="allowBiweekly" checked> Quinzenal
        </label>
        <label>
          <input type="checkbox" id="allowMonthly" checked> Mensal
        </label>
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label>Múltiplo Máximo da Renda</label>
        <input type="number" id="ruleMaxIncomeMultiple" step="0.5" min="0">
        <small>Ex: 8.0 = até 8x a renda mensal</small>
      </div>
      <div class="form-group">
        <label>DTI Máximo (%)</label>
        <input type="number" id="ruleMaxDti" step="1" min="0" max="100">
        <small>Debt-to-Income ratio máximo (ex: 43%)</small>
      </div>
    </div>
    
    <div class="form-group">
      <label>Renda Mínima Exigida ($)</label>
      <input type="number" id="ruleMinIncome" step="100" min="0">
    </div>
    
    <div class="form-actions">
      <button class="btn-secondary" onclick="closeRuleModal()">Cancelar</button>
      <button class="btn-primary" onclick="saveRule()">Salvar Regra</button>
    </div>
  </div>
</div>
```

**Exemplo de Regras Pré-Configuradas:**

| Tier | Score | Taxa | Valor Máx | Prazo | Frequências | Múltiplo Renda | DTI Máx |
|------|-------|------|-----------|-------|-------------|----------------|---------|
| EXCELLENT | 750-850 | 8.99% | $50,000 | 60 meses | 📅 Todas | 8x | 43% |
| GOOD | 700-749 | 12.99% | $40,000 | 48 meses | 📅 Quinzenal/Mensal | 6x | 40% |
| FAIR | 650-699 | 16.99% | $30,000 | 36 meses | 📅 Mensal | 4x | 38% |
| POOR | 600-649 | 21.99% | $20,000 | 24 meses | 📅 Mensal | 3x | 35% |
| VERY_POOR | 300-599 | 27.99% | $10,000 | 12 meses | 📅 Mensal | 2x | 30% |

### Lógica de Aplicação de Regras

**Código Backend (Node.js):**

```javascript
// services/CreditAnalysisService.js

class CreditAnalysisService {
  
  /**
   * Analisa aplicação e aplica regras
   */
  async analyzeApplication(application) {
    // 1. Consultar score de crédito (Experian)
    const creditReport = await this.pullCreditReport(application);
    const creditScore = creditReport.creditScore;
    const dti = this.calculateDTI(application, creditReport);
    
    // 2. Buscar regra aplicável
    const rule = await this.findApplicableRule(creditScore);
    
    if (!rule) {
      return {
        approved: false,
        reason: 'NO_RULE_FOUND',
        message: 'Score fora dos limites configurados'
      };
    }
    
    // 3. Validar renda mínima
    if (rule.minIncomeRequired && application.monthlyIncome < rule.minIncomeRequired) {
      return {
        approved: false,
        reason: 'INSUFFICIENT_INCOME',
        message: `Renda mínima exigida: $${rule.minIncomeRequired}`
      };
    }
    
    // 4. Validar DTI
    if (rule.maxDti && dti > rule.maxDti) {
      return {
        approved: false,
        reason: 'HIGH_DTI',
        message: `DTI ${(dti * 100).toFixed(1)}% excede limite de ${(rule.maxDti * 100)}%`
      };
    }
    
    // 5. Calcular valor máximo aprovado
    const maxByIncome = application.monthlyIncome * (rule.maxIncomeMultiple || 5);
    const maxByRule = rule.maxAmount;
    const maxApproved = Math.min(maxByIncome, maxByRule, application.desiredAmount);
    
    // 6. Validar prazo solicitado
    const requestedTermMonths = application.requestedTermMonths || rule.maxTermMonths;
    if (requestedTermMonths > rule.maxTermMonths) {
      return {
        approved: false,
        reason: 'TERM_TOO_LONG',
        message: `Prazo máximo: ${rule.maxTermMonths} meses`
      };
    }
    
    // 7. Validar frequência solicitada
    const requestedFrequency = application.requestedFrequency || 'MONTHLY';
    const allowedFrequencies = this.getAllowedFrequencies(rule);
    if (!allowedFrequencies.includes(requestedFrequency)) {
      return {
        approved: false,
        reason: 'FREQUENCY_NOT_ALLOWED',
        message: `Frequências permitidas: ${allowedFrequencies.join(', ')}`
      };
    }
    
    // 8. Calcular pagamento
    const payment = this.calculatePayment({
      principal: maxApproved,
      interestRate: rule.interestRate,
      termMonths: requestedTermMonths,
      frequency: requestedFrequency
    });
    
    // 9. Retornar aprovação
    return {
      approved: true,
      creditScore: creditScore,
      creditTier: rule.tier,
      approvedAmount: maxApproved,
      interestRate: rule.interestRate,
      termMonths: requestedTermMonths,
      paymentFrequency: requestedFrequency,
      paymentAmount: payment.amount,
      totalAmount: payment.total,
      dti: dti,
      ruleApplied: rule.id
    };
  }
  
  /**
   * Busca regra aplicável ao score
   */
  async findApplicableRule(creditScore) {
    return await prisma.interestRateRule.findFirst({
      where: {
        active: true,
        minScore: { lte: creditScore },
        maxScore: { gte: creditScore }
      },
      orderBy: { priority: 'desc' }
    });
  }
  
  /**
   * Calcula DTI (Debt-to-Income)
   */
  calculateDTI(application, creditReport) {
    const monthlyIncome = application.monthlyIncome;
    const totalDebt = creditReport.totalDebt || 0;
    const monthlyDebtPayment = totalDebt * 0.03; // Estimativa 3% do total
    return monthlyDebtPayment / monthlyIncome;
  }
  
  /**
   * Calcula valor do pagamento
   */
  calculatePayment({ principal, interestRate, termMonths, frequency }) {
    const annualRate = interestRate / 100;
    
    let periodsPerYear;
    switch (frequency) {
      case 'WEEKLY': periodsPerYear = 52; break;
      case 'BIWEEKLY': periodsPerYear = 26; break;
      case 'MONTHLY': periodsPerYear = 12; break;
    }
    
    const periodicRate = annualRate / periodsPerYear;
    const totalPeriods = (termMonths / 12) * periodsPerYear;
    
    // Fórmula de amortização (PMT)
    const payment = principal * 
      (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
      (Math.pow(1 + periodicRate, totalPeriods) - 1);
    
    return {
      amount: Math.round(payment * 100) / 100,
      total: Math.round(payment * totalPeriods * 100) / 100
    };
  }
  
  /**
   * Retorna frequências permitidas pela regra
   */
  getAllowedFrequencies(rule) {
    const allowed = [];
    if (rule.allowWeekly) allowed.push('WEEKLY');
    if (rule.allowBiweekly) allowed.push('BIWEEKLY');
    if (rule.allowMonthly) allowed.push('MONTHLY');
    return allowed;
  }
  
}
```

---

## 🔌 INTEGRAÇÕES EXTERNAS

### 1. PayBright ACH Gateway

**Documentação:** https://docs.paybrightgateway.com/api/v2

**Endpoints principais:**

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/v2/auth/token` | POST | Obter token de acesso |
| `/v2/mandates` | POST | Criar mandato ACH |
| `/v2/mandates/{id}/verify` | POST | Verificar conta (micro-depósitos) |
| `/v2/payments` | POST | Iniciar débito ACH |
| `/v2/payments/{id}` | GET | Status do pagamento |
| `/v2/disbursements` | POST | Transferir fundos (pagar parceiro) |
| `/v2/webhooks` | POST | Receber notificações |

**Configuração:**

```javascript
// config/paybright.js

module.exports = {
  apiKey: process.env.PAYBRIGHT_API_KEY,
  apiSecret: process.env.PAYBRIGHT_API_SECRET,
  merchantId: process.env.PAYBRIGHT_MERCHANT_ID,
  baseUrl: 'https://api.paybrightgateway.com/v2',
  webhookSecret: process.env.PAYBRIGHT_WEBHOOK_SECRET,
  
  // Configurações de retry
  maxRetries: 3,
  retryDelayDays: 3,
  
  // Limites
  maxDailyAmount: 100000,  // $100k/dia
  maxTransactionAmount: 50000  // $50k/transação
};
```

**Exemplo: Criar Mandato ACH**

```javascript
// services/PayBrightService.js

class PayBrightService {
  
  async createACHMandate(application) {
    const token = await this.getAuthToken();
    
    const mandateData = {
      customer: {
        name: application.clientName,
        email: application.clientEmail,
        phone: application.clientPhone,
      },
      bankAccount: {
        routingNumber: application.achRoutingNumber,
        accountNumber: application.achAccountNumber,
        accountType: application.achAccountType, // 'checking' or 'savings'
      },
      mandate: {
        type: 'recurring',
        amount: application.monthlyPayment,
        frequency: application.paymentFrequency.toLowerCase(), // 'weekly', 'biweekly', 'monthly'
        startDate: this.getFirstPaymentDate(application),
        endDate: this.getLastPaymentDate(application),
      },
      metadata: {
        applicationId: application.id,
        contractNumber: application.contract?.contractNumber
      }
    };
    
    const response = await axios.post(
      `${config.baseUrl}/mandates`,
      mandateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Salvar mandate ID
    await prisma.application.update({
      where: { id: application.id },
      data: { achMandateId: response.data.mandateId }
    });
    
    return response.data;
  }
  
  async initiatePayment(application, installmentNumber) {
    const token = await this.getAuthToken();
    
    const paymentData = {
      mandateId: application.achMandateId,
      amount: application.monthlyPayment,
      description: `FlexCredi - Parcela ${installmentNumber}/${application.termMonths}`,
      idempotencyKey: `${application.id}-${installmentNumber}`,
      metadata: {
        applicationId: application.id,
        installmentNumber: installmentNumber
      }
    };
    
    const response = await axios.post(
      `${config.baseUrl}/payments`,
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  }
  
}
```

### 2. Experian Credit API

**Documentação:** https://developer.experian.com/

**Endpoints:**

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/oauth2/v1/token` | POST | Obter access token |
| `/credit-report/v1/consumer-reports` | POST | Puxar relatório completo |
| `/credit-score/v1/scores` | POST | Obter apenas score |

**Configuração:**

```javascript
// config/experian.js

module.exports = {
  clientId: process.env.EXPERIAN_CLIENT_ID,
  clientSecret: process.env.EXPERIAN_CLIENT_SECRET,
  baseUrl: 'https://api.experian.com',
  
  // Custos
  costPerReport: 2.50,  // $2.50 por pull completo
  costPerScore: 0.75,   // $0.75 por score only
  
  // Limites
  monthlyReportLimit: 1000,
  cacheExpirationDays: 30  // Cachear score por 30 dias
};
```

**Exemplo: Puxar Score**

```javascript
// services/ExperianService.js

class ExperianService {
  
  async pullCreditScore(application) {
    const token = await this.getAuthToken();
    
    const requestData = {
      consumerPii: {
        primaryApplicant: {
          name: {
            firstName: application.clientName.split(' ')[0],
            lastName: application.clientName.split(' ').slice(1).join(' ')
          },
          ssn: this.formatSSN(application.clientCpf),  // Converter CPF para SSN se necessário
          dob: this.formatDate(application.clientDob),
          currentAddress: {
            line1: application.clientAddress,
            city: application.clientCity,
            state: application.clientState,
            zipCode: application.clientZipCode
          }
        }
      },
      requestor: {
        subscriberCode: config.subscriberCode
      },
      permissiblePurpose: {
        type: "CreditTransaction",
        terms: "OneTime"
      },
      vendorData: {
        applicationId: application.id
      }
    };
    
    const response = await axios.post(
      `${config.baseUrl}/credit-score/v1/scores`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const scoreData = response.data;
    
    // Salvar no banco
    await prisma.creditReport.create({
      data: {
        applicationId: application.id,
        userId: application.userId,
        creditScore: scoreData.score,
        scoreModel: scoreData.scoreModel,
        fullReportJson: scoreData,
        totalAccounts: scoreData.summary?.totalAccounts,
        openAccounts: scoreData.summary?.openAccounts,
        delinquentAccounts: scoreData.summary?.delinquentAccounts,
        totalDebt: scoreData.summary?.totalDebt,
        availableCredit: scoreData.summary?.availableCredit,
        creditUtilization: scoreData.summary?.creditUtilization,
        recentInquiries: scoreData.summary?.recentInquiries,
        cost: config.costPerScore,
        provider: 'experian',
        pulledAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      }
    });
    
    return scoreData;
  }
  
}
```

---

## 🤖 ARQUITETURA DE AGENTES AUTÔNOMOS

### Sistema de Event Bus

**Padrão de Comunicação:**

```javascript
// core/EventBus.js

class EventBus {
  constructor() {
    this.listeners = {};
  }
  
  on(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }
  
  async emit(event, data) {
    console.log(`[EventBus] Emitting: ${event}`, data);
    
    if (this.listeners[event]) {
      for (const handler of this.listeners[event]) {
        try {
          await handler(data);
        } catch (error) {
          console.error(`[EventBus] Error in handler for ${event}:`, error);
        }
      }
    }
    
    // Salvar no audit log
    await this.logEvent(event, data);
  }
  
  async logEvent(event, data) {
    await prisma.auditLog.create({
      data: {
        action: 'EVENT_EMITTED',
        entity: 'EventBus',
        entityId: event,
        changes: { event, data },
        timestamp: new Date()
      }
    });
  }
}

module.exports = new EventBus();
```

### Agente Base (Classe Abstrata)

```javascript
// agents/BaseAgent.js

class BaseAgent {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.active = true;
    this.lastRunAt = null;
    this.runCount = 0;
    this.errorCount = 0;
  }
  
  async execute(data) {
    if (!this.active) {
      console.log(`[${this.name}] Agent is inactive`);
      return;
    }
    
    console.log(`[${this.name}] Starting execution`, data);
    this.runCount++;
    
    try {
      const result = await this.run(data);
      this.lastRunAt = new Date();
      
      await this.logExecution('SUCCESS', data, result);
      
      return result;
    } catch (error) {
      this.errorCount++;
      console.error(`[${this.name}] Error:`, error);
      
      await this.logExecution('ERROR', data, { error: error.message });
      
      throw error;
    }
  }
  
  async run(data) {
    throw new Error('run() must be implemented by subclass');
  }
  
  async logExecution(status, input, output) {
    await prisma.auditLog.create({
      data: {
        action: 'AGENT_EXECUTION',
        entity: this.name,
        changes: {
          status,
          input,
          output,
          runCount: this.runCount,
          errorCount: this.errorCount
        },
        timestamp: new Date()
      }
    });
  }
  
  getStatus() {
    return {
      name: this.name,
      active: this.active,
      lastRunAt: this.lastRunAt,
      runCount: this.runCount,
      errorCount: this.errorCount,
      successRate: this.runCount > 0 
        ? ((this.runCount - this.errorCount) / this.runCount * 100).toFixed(2) + '%'
        : 'N/A'
    };
  }
}

module.exports = BaseAgent;
```

### Agentes Especializados

#### 1. AgentCreditAnalyzer

```javascript
// agents/AgentCreditAnalyzer.js

const BaseAgent = require('./BaseAgent');
const EventBus = require('../core/EventBus');
const ExperianService = require('../services/ExperianService');
const CreditAnalysisService = require('../services/CreditAnalysisService');

class AgentCreditAnalyzer extends BaseAgent {
  constructor() {
    super('AgentCreditAnalyzer', {
      autoApproveThreshold: 750,  // Score mínimo para aprovação automática
      manualReviewThreshold: 650  // Abaixo disso, requer revisão manual
    });
    
    // Escutar eventos
    EventBus.on('application.created', (data) => this.execute(data));
  }
  
  async run(data) {
    const { applicationId } = data;
    
    // 1. Buscar aplicação
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { partner: true }
    });
    
    if (!application) {
      throw new Error('Application not found');
    }
    
    // 2. Atualizar status
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ANALYZING' }
    });
    
    // 3. Puxar score de crédito (Experian)
    const creditReport = await ExperianService.pullCreditScore(application);
    
    // 4. Analisar e aplicar regras
    const analysisResult = await CreditAnalysisService.analyzeApplication(application);
    
    // 5. Atualizar aplicação com resultado
    const updateData = {
      creditScore: analysisResult.creditScore,
      creditTier: analysisResult.creditTier,
      dti: analysisResult.dti
    };
    
    if (analysisResult.approved) {
      updateData.approvedAmount = analysisResult.approvedAmount;
      updateData.interestRate = analysisResult.interestRate;
      updateData.termMonths = analysisResult.termMonths;
      updateData.paymentFrequency = analysisResult.paymentFrequency;
      updateData.monthlyPayment = analysisResult.paymentAmount;
      updateData.totalAmount = analysisResult.totalAmount;
      
      // Aprovação automática se score alto
      if (analysisResult.creditScore >= this.config.autoApproveThreshold) {
        updateData.status = 'APPROVED';
        updateData.approvedAt = new Date();
        
        // Emitir evento de aprovação
        EventBus.emit('application.approved', { applicationId });
      } else if (analysisResult.creditScore >= this.config.manualReviewThreshold) {
        updateData.status = 'MANUAL_REVIEW';
      } else {
        updateData.status = 'REJECTED';
        updateData.rejectedAt = new Date();
        updateData.rejectionReason = 'Score de crédito abaixo do limite mínimo';
        
        EventBus.emit('application.rejected', { applicationId });
      }
    } else {
      updateData.status = 'REJECTED';
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = analysisResult.message;
      
      EventBus.emit('application.rejected', { applicationId });
    }
    
    await prisma.application.update({
      where: { id: applicationId },
      data: updateData
    });
    
    return analysisResult;
  }
}

module.exports = new AgentCreditAnalyzer();
```

#### 2. AgentPayBrightACH

```javascript
// agents/AgentPayBrightACH.js

const BaseAgent = require('./BaseAgent');
const EventBus = require('../core/EventBus');
const PayBrightService = require('../services/PayBrightService');

class AgentPayBrightACH extends BaseAgent {
  constructor() {
    super('AgentPayBrightACH');
    
    // Escutar eventos
    EventBus.on('contract.signed', (data) => this.setupACHMandate(data));
    EventBus.on('payment.due', (data) => this.processPayment(data));
    EventBus.on('payment.failed', (data) => this.retryPayment(data));
  }
  
  async run(data) {
    // Este agente responde a múltiplos eventos
    return { message: 'AgentPayBrightACH is listening to events' };
  }
  
  async setupACHMandate(data) {
    const { applicationId } = data;
    
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { contract: true }
    });
    
    // Criar mandato ACH no PayBright
    const mandate = await PayBrightService.createACHMandate(application);
    
    // Atualizar aplicação
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        achMandateId: mandate.mandateId,
        achAuthorized: true,
        achAuthorizedAt: new Date(),
        status: 'ACTIVE'
      }
    });
    
    // Criar schedule de pagamentos
    await this.createPaymentSchedule(application);
    
    // Emitir evento
    EventBus.emit('ach.mandate.created', { applicationId, mandateId: mandate.mandateId });
    
    return mandate;
  }
  
  async createPaymentSchedule(application) {
    const startDate = new Date(application.contract.activatedAt);
    const frequency = application.paymentFrequency;
    
    let daysIncrement;
    switch (frequency) {
      case 'WEEKLY': daysIncrement = 7; break;
      case 'BIWEEKLY': daysIncrement = 14; break;
      case 'MONTHLY': daysIncrement = 30; break;
    }
    
    const payments = [];
    for (let i = 1; i <= application.termMonths; i++) {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + (i * daysIncrement));
      
      payments.push({
        applicationId: application.id,
        installmentNumber: i,
        dueDate: dueDate,
        amount: application.monthlyPayment,
        status: 'SCHEDULED',
        scheduledAt: new Date()
      });
    }
    
    await prisma.achPayment.createMany({ data: payments });
  }
  
  async processPayment(data) {
    const { achPaymentId } = data;
    
    const achPayment = await prisma.achPayment.findUnique({
      where: { id: achPaymentId },
      include: { application: true }
    });
    
    // Atualizar status
    await prisma.achPayment.update({
      where: { id: achPaymentId },
      data: {
        status: 'PROCESSING',
        attemptCount: { increment: 1 },
        lastAttemptAt: new Date()
      }
    });
    
    try {
      // Iniciar débito no PayBright
      const payment = await PayBrightService.initiatePayment(
        achPayment.application,
        achPayment.installmentNumber
      );
      
      // Atualizar com sucesso
      await prisma.achPayment.update({
        where: { id: achPaymentId },
        data: {
          status: 'COMPLETED',
          paybrightPaymentId: payment.paymentId,
          achTransactionId: payment.transactionId,
          processedAt: new Date(),
          completedAt: new Date()
        }
      });
      
      EventBus.emit('payment.completed', { achPaymentId, applicationId: achPayment.applicationId });
      
      return payment;
    } catch (error) {
      // Falha no pagamento
      await prisma.achPayment.update({
        where: { id: achPaymentId },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          failureCode: error.code,
          failureReason: error.message
        }
      });
      
      EventBus.emit('payment.failed', { achPaymentId, applicationId: achPayment.applicationId });
      
      throw error;
    }
  }
  
  async retryPayment(data) {
    const { achPaymentId } = data;
    
    const achPayment = await prisma.achPayment.findUnique({
      where: { id: achPaymentId }
    });
    
    // Máximo 3 tentativas
    if (achPayment.attemptCount >= 3) {
      console.log(`[AgentPayBrightACH] Max retries reached for ${achPaymentId}`);
      EventBus.emit('payment.max_retries', { achPaymentId });
      return;
    }
    
    // Agendar retry em 3 dias
    const retryDate = new Date();
    retryDate.setDate(retryDate.getDate() + 3);
    
    await prisma.achPayment.update({
      where: { id: achPaymentId },
      data: {
        status: 'RETRYING',
        scheduledAt: retryDate
      }
    });
    
    // Agendar job (cron ou queue)
    // ...
  }
}

module.exports = new AgentPayBrightACH();
```

#### 3. AgentPartnerManager

```javascript
// agents/AgentPartnerManager.js

const BaseAgent = require('./BaseAgent');
const EventBus = require('../core/EventBus');

class AgentPartnerManager extends BaseAgent {
  constructor() {
    super('AgentPartnerManager');
    
    EventBus.on('application.approved', (data) => this.setupPartnerReceivables(data));
    EventBus.on('contract.signed', (data) => this.payPartner(data));
    EventBus.on('payment.completed', (data) => this.processReceivableDiscount(data));
  }
  
  async run(data) {
    return { message: 'AgentPartnerManager is listening' };
  }
  
  async setupPartnerReceivables(data) {
    const { applicationId } = data;
    
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { partner: true }
    });
    
    // Calcular valores
    const grossAmount = application.approvedAmount;
    const feeRate = application.partner.flexCrediFeeRate;
    const feeAmount = grossAmount * feeRate;
    const netAmount = grossAmount - feeAmount;
    
    // Calcular distribuição dos recebíveis
    const partnerMonthlyReceivables = application.partner.monthlyReceivables || 15000;
    const discountPeriodMonths = Math.ceil(netAmount / partnerMonthlyReceivables);
    const monthlyDiscount = netAmount / discountPeriodMonths;
    
    // Criar recebíveis
    const receivables = [];
    const today = new Date();
    
    for (let i = 0; i < discountPeriodMonths; i++) {
      const referenceMonth = new Date(today);
      referenceMonth.setMonth(referenceMonth.getMonth() + i + 1);
      
      receivables.push({
        partnerId: application.partnerId,
        applicationId: application.id,
        referenceMonth: this.formatMonth(referenceMonth),
        dueDate: new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() + 1, 5),
        expectedAmount: partnerMonthlyReceivables,
        discountAmount: i < discountPeriodMonths - 1 
          ? monthlyDiscount 
          : (netAmount - (monthlyDiscount * (discountPeriodMonths - 1))),
        netAmount: partnerMonthlyReceivables - monthlyDiscount,
        status: 'SCHEDULED'
      });
    }
    
    await prisma.partnerReceivable.createMany({ data: receivables });
    
    EventBus.emit('partner.receivables.created', { 
      applicationId, 
      partnerId: application.partnerId,
      totalAmount: netAmount,
      months: discountPeriodMonths
    });
  }
  
  async payPartner(data) {
    const { applicationId } = data;
    
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { partner: true }
    });
    
    // Calcular valores
    const grossAmount = application.approvedAmount;
    const feeRate = application.partner.flexCrediFeeRate;
    const feeAmount = grossAmount * feeRate;
    const netAmount = grossAmount - feeAmount;
    
    // Criar registro de pagamento
    const partnerPayment = await prisma.partnerPayment.create({
      data: {
        partnerId: application.partnerId,
        applicationId: application.id,
        grossAmount: grossAmount,
        feeAmount: feeAmount,
        netAmount: netAmount,
        paymentMethod: 'ACH',
        bankName: application.partner.bankName,
        bankBranch: application.partner.bankBranch,
        bankAccount: application.partner.bankAccount,
        bankAccountType: application.partner.bankAccountType,
        status: 'PENDING'
      }
    });
    
    // Atualizar status
    await prisma.partnerPayment.update({
      where: { id: partnerPayment.id },
      data: { status: 'PROCESSING' }
    });
    
    try {
      // Iniciar transferência ACH para o parceiro
      const payment = await PayBrightService.createDisbursement({
        amount: netAmount,
        bankAccount: {
          routingNumber: application.partner.bankRoutingNumber,
          accountNumber: application.partner.bankAccount,
          accountType: application.partner.bankAccountType
        },
        description: `FlexCredi - Crédito Cliente ${application.clientName}`,
        metadata: {
          applicationId: application.id,
          partnerId: application.partnerId
        }
      });
      
      // Atualizar com sucesso
      await prisma.partnerPayment.update({
        where: { id: partnerPayment.id },
        data: {
          status: 'COMPLETED',
          externalId: payment.disbursementId,
          transactionId: payment.transactionId,
          processedAt: new Date(),
          completedAt: new Date()
        }
      });
      
      // Atualizar aplicação
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          partnerPaymentStatus: 'completed',
          partnerPaidAt: new Date()
        }
      });
      
      EventBus.emit('partner.paid', { 
        applicationId, 
        partnerId: application.partnerId,
        amount: netAmount
      });
      
      return payment;
    } catch (error) {
      await prisma.partnerPayment.update({
        where: { id: partnerPayment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          failureReason: error.message
        }
      });
      
      throw error;
    }
  }
  
  async processReceivableDiscount(data) {
    const { applicationId } = data;
    
    // Buscar próximo recebível agendado
    const nextReceivable = await prisma.partnerReceivable.findFirst({
      where: {
        applicationId: applicationId,
        status: 'SCHEDULED'
      },
      orderBy: { dueDate: 'asc' }
    });
    
    if (!nextReceivable) {
      console.log(`[AgentPartnerManager] No more receivables for ${applicationId}`);
      return;
    }
    
    // Marcar como processando
    await prisma.partnerReceivable.update({
      where: { id: nextReceivable.id },
      data: {
        status: 'PROCESSING',
        processedAt: new Date()
      }
    });
    
    // Simular processamento (na prática, integrar com sistema de recebíveis do parceiro)
    // ...
    
    // Marcar como completo
    await prisma.partnerReceivable.update({
      where: { id: nextReceivable.id },
      data: {
        status: 'COMPLETED',
        actualAmount: nextReceivable.discountAmount,
        paidAt: new Date()
      }
    });
    
    EventBus.emit('partner.receivable.processed', {
      receivableId: nextReceivable.id,
      partnerId: nextReceivable.partnerId,
      applicationId: applicationId,
      amount: nextReceivable.discountAmount
    });
  }
  
  formatMonth(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}

module.exports = new AgentPartnerManager();
```

#### 4. Master-Agent (Criador de Agentes)

```javascript
// agents/MasterAgent.js

const BaseAgent = require('./BaseAgent');
const fs = require('fs').promises;
const path = require('path');

class MasterAgent extends BaseAgent {
  constructor() {
    super('MasterAgent', {
      autoCreateEnabled: true,
      monitoring: true,
      analysisIntervalMinutes: 60
    });
    
    this.registeredAgents = new Map();
    
    // Monitorar sistema periodicamente
    if (this.config.monitoring) {
      setInterval(() => this.analyzeSystemNeeds(), this.config.analysisIntervalMinutes * 60 * 1000);
    }
  }
  
  async run(data) {
    return await this.analyzeSystemNeeds();
  }
  
  async analyzeSystemNeeds() {
    console.log('[MasterAgent] Analyzing system needs...');
    
    // 1. Coletar métricas
    const metrics = await this.collectMetrics();
    
    // 2. Identificar padrões e necessidades
    const needs = await this.identifyNeeds(metrics);
    
    // 3. Criar agentes se necessário
    if (needs.length > 0 && this.config.autoCreateEnabled) {
      for (const need of needs) {
        await this.createAgent(need);
      }
    }
    
    return {
      metrics,
      needs,
      registeredAgents: Array.from(this.registeredAgents.keys())
    };
  }
  
  async collectMetrics() {
    // Coletar dados do sistema
    const [
      totalApplications,
      pendingApplications,
      failedPayments,
      slowPartnerPayments,
      highRejectionRate
    ] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.achPayment.count({ where: { status: 'FAILED' } }),
      prisma.partnerPayment.count({ where: { status: 'PROCESSING', createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
      this.calculateRejectionRate()
    ]);
    
    return {
      totalApplications,
      pendingApplications,
      failedPayments,
      slowPartnerPayments,
      highRejectionRate,
      timestamp: new Date()
    };
  }
  
  async identifyNeeds(metrics) {
    const needs = [];
    
    // Exemplo: Muitas aplicações pendentes → precisa de agente de priorização
    if (metrics.pendingApplications > 50) {
      needs.push({
        type: 'AgentApplicationPrioritizer',
        reason: `${metrics.pendingApplications} applications pending`,
        priority: 'HIGH',
        config: {
          batchSize: 10,
          priorityRules: ['high_amount', 'good_credit', 'repeat_customer']
        }
      });
    }
    
    // Exemplo: Muitos pagamentos falhando → agente de recuperação
    if (metrics.failedPayments > 20) {
      needs.push({
        type: 'AgentPaymentRecovery',
        reason: `${metrics.failedPayments} failed payments`,
        priority: 'HIGH',
        config: {
          maxRetries: 5,
          alternativePaymentMethods: ['manual_ach', 'wire']
        }
      });
    }
    
    // Exemplo: Pagamentos lentos ao parceiro → otimizador
    if (metrics.slowPartnerPayments > 5) {
      needs.push({
        type: 'AgentPartnerPaymentOptimizer',
        reason: `${metrics.slowPartnerPayments} slow partner payments`,
        priority: 'MEDIUM',
        config: {
          batchProcessing: true,
          autoEscalate: true
        }
      });
    }
    
    return needs;
  }
  
  async createAgent(need) {
    const agentName = need.type;
    
    // Verificar se agente já existe
    if (this.registeredAgents.has(agentName)) {
      console.log(`[MasterAgent] Agent ${agentName} already exists`);
      return;
    }
    
    console.log(`[MasterAgent] Creating new agent: ${agentName}`);
    
    // Template do agente
    const agentCode = this.generateAgentCode(need);
    
    // Salvar arquivo
    const agentPath = path.join(__dirname, `${agentName}.js`);
    await fs.writeFile(agentPath, agentCode, 'utf8');
    
    // Registrar agente
    this.registeredAgents.set(agentName, {
      createdAt: new Date(),
      reason: need.reason,
      config: need.config,
      status: 'active'
    });
    
    // Salvar no banco
    await prisma.auditLog.create({
      data: {
        action: 'AGENT_CREATED',
        entity: 'MasterAgent',
        entityId: agentName,
        changes: { need, agentPath },
        timestamp: new Date()
      }
    });
    
    EventBus.emit('agent.created', { agentName, need });
    
    console.log(`[MasterAgent] ✅ Agent ${agentName} created successfully`);
  }
  
  generateAgentCode(need) {
    return `// Auto-generated by MasterAgent
// Created: ${new Date().toISOString()}
// Reason: ${need.reason}

const BaseAgent = require('./BaseAgent');
const EventBus = require('../core/EventBus');

class ${need.type} extends BaseAgent {
  constructor() {
    super('${need.type}', ${JSON.stringify(need.config, null, 2)});
    
    // TODO: Register event listeners
    // EventBus.on('some.event', (data) => this.execute(data));
  }
  
  async run(data) {
    console.log('[${need.type}] Executing with data:', data);
    
    // TODO: Implement logic
    
    return { status: 'completed' };
  }
}

module.exports = new ${need.type}();
`;
  }
  
  async calculateRejectionRate() {
    const [total, rejected] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: 'REJECTED' } })
    ]);
    
    return total > 0 ? (rejected / total) * 100 : 0;
  }
}

module.exports = new MasterAgent();
```

---

## 🖥️ INTERFACES DO SISTEMA

### Admin Dashboard Principal

**Página:** `/admin/dashboard`

**Layout (baseado em dashboard-cliente.html):**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>FlexCredi Admin Dashboard</title>
  <link rel="stylesheet" href="/css/admin-dashboard.css">
</head>
<body>
  
  <!-- Header igual ao dashboard-cliente -->
  <header class="dashboard-header">
    <div class="logo">
      <img src="/images/flexcredi-official-logo.png" alt="FlexCredi">
    </div>
    <div class="header-actions">
      <div class="user-menu">
        <img src="/images/admin-avatar.png" class="user-avatar">
        <span class="user-name">Admin</span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  </header>
  
  <!-- Sidebar -->
  <aside class="sidebar">
    <nav>
      <a href="/admin/dashboard" class="nav-item active">
        <i class="fas fa-chart-line"></i> Dashboard
      </a>
      <a href="/admin/aplicacoes" class="nav-item">
        <i class="fas fa-file-invoice"></i> Aplicações
      </a>
      <a href="/admin/clientes" class="nav-item">
        <i class="fas fa-users"></i> Clientes
      </a>
      <a href="/admin/parceiros" class="nav-item">
        <i class="fas fa-handshake"></i> Parceiros
      </a>
      <a href="/admin/documentos" class="nav-item">
        <i class="fas fa-folder"></i> Documentos
      </a>
      <a href="/admin/contratos" class="nav-item">
        <i class="fas fa-file-contract"></i> Contratos
      </a>
      <a href="/admin/pagamentos" class="nav-item">
        <i class="fas fa-credit-card"></i> Pagamentos ACH
      </a>
      <a href="/admin/recebiveis" class="nav-item">
        <i class="fas fa-calendar-alt"></i> Recebíveis Parceiros
      </a>
      <a href="/admin/agentes" class="nav-item">
        <i class="fas fa-robot"></i> Agentes Autônomos
      </a>
      <a href="/admin/configuracoes" class="nav-item">
        <i class="fas fa-cog"></i> Configurações
      </a>
    </nav>
  </aside>
  
  <!-- Main Content -->
  <main class="main-content">
    
    <!-- Cards de Métricas -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-file-invoice"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="totalApplications">0</span>
          <span class="metric-label">Total de Aplicações</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="pendingApplications">0</span>
          <span class="metric-label">Aplicações Pendentes</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="approvedApplications">0</span>
          <span class="metric-label">Aprovadas</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="totalVolume">$0</span>
          <span class="metric-label">Volume Total</span>
        </div>
      </div>
    </div>
    
    <!-- Gráficos -->
    <div class="charts-grid">
      <div class="card">
        <h3>Aplicações por Status</h3>
        <canvas id="applicationsChart"></canvas>
      </div>
      
      <div class="card">
        <h3>Volume Mensal</h3>
        <canvas id="volumeChart"></canvas>
      </div>
    </div>
    
    <!-- Tabela de Aplicações Recentes -->
    <div class="card">
      <div class="card-header">
        <h3>Aplicações Recentes</h3>
        <button class="btn-primary" onclick="window.location.href='/admin/aplicacoes'">
          Ver Todas
        </button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Parceiro</th>
            <th>Valor Solicitado</th>
            <th>Score</th>
            <th>Status</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="recentApplicationsTable">
          <!-- Dinamicamente populado -->
        </tbody>
      </table>
    </div>
    
  </main>
  
  <script src="/js/admin-dashboard.js"></script>
</body>
</html>
```

### Partner Dashboard

**Página:** `/partner/dashboard`

**Layout:**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Partner Dashboard - FlexCredi</title>
  <link rel="stylesheet" href="/css/partner-dashboard.css">
</head>
<body>
  
  <header class="dashboard-header">
    <div class="logo">
      <img src="/images/flexcredi-official-logo.png" alt="FlexCredi">
    </div>
    <div class="header-actions">
      <div class="user-menu">
        <span class="user-name" id="partnerName">Parceiro</span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
  </header>
  
  <main class="main-content">
    
    <h1>Bem-vindo, <span id="partnerCompanyName"></span></h1>
    
    <!-- Métricas do Parceiro -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="totalClients">0</span>
          <span class="metric-label">Clientes</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="totalVolume">$0</span>
          <span class="metric-label">Volume Total</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="totalReceived">$0</span>
          <span class="metric-label">Recebido (Líquido)</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="metric-details">
          <span class="metric-value" id="committedReceivables">$0</span>
          <span class="metric-label">Recebíveis Comprometidos</span>
        </div>
      </div>
    </div>
    
    <!-- Calendário de Recebíveis -->
    <div class="card">
      <div class="card-header">
        <h3>📅 Calendário de Recebíveis</h3>
      </div>
      <table class="receivables-table">
        <thead>
          <tr>
            <th>Mês Referência</th>
            <th>Cliente</th>
            <th>Recebível Previsto</th>
            <th>Desconto FlexCredi</th>
            <th>Valor Líquido</th>
            <th>Status</th>
            <th>Data Processamento</th>
          </tr>
        </thead>
        <tbody id="receivablesTable">
          <!-- Dinamicamente populado -->
        </tbody>
      </table>
    </div>
    
    <!-- Histórico de Pagamentos Recebidos -->
    <div class="card">
      <div class="card-header">
        <h3>💰 Pagamentos Recebidos</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Valor Bruto</th>
            <th>Fee FlexCredi</th>
            <th>Valor Líquido</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="paymentsTable">
          <!-- Dinamicamente populado -->
        </tbody>
      </table>
    </div>
    
    <!-- Cadastrar Novo Cliente -->
    <div class="card">
      <div class="card-header">
        <h3>➕ Cadastrar Novo Cliente</h3>
      </div>
      <p>Compartilhe este link com seus clientes para que eles solicitem crédito com FlexCredi:</p>
      <div class="referral-link">
        <input type="text" id="referralLink" readonly value="https://flexcredi.com/aplicacao?partner=PART-001">
        <button class="btn-primary" onclick="copyReferralLink()">
          <i class="fas fa-copy"></i> Copiar Link
        </button>
      </div>
    </div>
    
  </main>
  
  <script src="/js/partner-dashboard.js"></script>
</body>
</html>
```

---

## 📅 CRONOGRAMA DE IMPLEMENTAÇÃO

### Sprint 1: Base do Sistema (2-3 dias | 16-20 horas)

**Backend (6-8h):**
- ✅ Configurar Prisma schema completo
- ✅ Criar migrations do banco de dados
- ✅ Implementar EventBus (core/EventBus.js)
- ✅ Implementar BaseAgent (agents/BaseAgent.js)
- ✅ Criar AgentCreditAnalyzer (integração Experian)
- ✅ Criar endpoints básicos:
  - POST `/api/admin/partners` (cadastro parceiro)
  - GET `/api/admin/partners` (listar parceiros)
  - PUT `/api/admin/partners/:id/approve` (aprovar parceiro)
  - POST `/api/applications` (criar aplicação)
  - GET `/api/admin/applications` (listar aplicações)

**Frontend (10-12h):**
- ✅ Criar admin-dashboard-v2.html (clone de dashboard-cliente.html)
  - Header, sidebar, cards de métricas
  - Gráficos com Chart.js
  - Tabela de aplicações recentes
- ✅ Criar página `/admin/parceiros`
  - Lista de parceiros
  - Modal de aprovação/rejeição
  - Upload de documentos
- ✅ Criar página `/admin/clientes`
  - Lista de clientes
  - Perfil detalhado (clone de dashboard-cliente.html)
  - Timeline de atividades

**Testes:**
- ✅ Testar cadastro e aprovação de parceiro
- ✅ Testar criação de aplicação
- ✅ Testar AgentCreditAnalyzer (mock do Experian)

---

### Sprint 2: Documentos e Contratos (2-3 dias | 18-22 horas)

**Backend (8-10h):**
- ✅ Implementar upload de documentos (Cloudinary)
- ✅ Criar AgentDocumentChecker (validação OCR)
- ✅ Criar AgentContractGenerator (geração de PDF)
- ✅ Implementar assinatura digital (DocuSign/HelloSign)
- ✅ Criar endpoints:
  - POST `/api/documents/upload`
  - GET `/api/documents/:applicationId`
  - PUT `/api/documents/:id/approve`
  - POST `/api/contracts/generate`
  - POST `/api/contracts/:id/sign`

**Frontend (10-12h):**
- ✅ Criar página `/admin/documentos`
  - Lista de documentos pendentes
  - Preview de documentos (PDF, imagens)
  - Aprovação/rejeição com notas
- ✅ Criar página `/admin/contratos`
  - Lista de contratos
  - Visualização de contrato com amortization table
  - Status de assinatura
- ✅ Criar modal de assinatura de contrato (cliente)
- ✅ Criar componente de upload de documentos

**Testes:**
- ✅ Upload e validação de documentos
- ✅ Geração e assinatura de contrato
- ✅ Fluxo completo: aplicação → documentos → contrato

---

### Sprint 3: ACH e Recebíveis (2-3 dias | 26-30 horas)

**Backend (14-16h):**
- ✅ Integrar PayBright ACH API
- ✅ Criar AgentPayBrightACH
  - Setup de mandatos ACH
  - Débito automático recorrente
  - Tratamento de falhas e retries
- ✅ Criar AgentPartnerManager
  - Pagamento ao parceiro
  - Cálculo de recebíveis
  - Processamento de descontos
- ✅ Criar endpoints:
  - POST `/api/ach/setup` (criar mandato)
  - POST `/api/ach/verify` (micro-depósitos)
  - GET `/api/ach/payments/:applicationId`
  - POST `/api/ach/retry/:paymentId`
  - GET `/api/partner/receivables`
  - POST `/api/partner/process-receivable`

**Frontend (12-14h):**
- ✅ Criar página `/admin/pagamentos`
  - Calendário de pagamentos ACH
  - Status de cada pagamento (✅ completed, 🔴 failed, 🟡 scheduled)
  - Botão de retry manual
- ✅ Criar página `/admin/recebiveis`
  - Lista de recebíveis por parceiro
  - Filtros por status, parceiro, mês
  - Detalhes de cada recebível vinculado
- ✅ Criar Partner Dashboard (`/partner/dashboard`)
  - Métricas do parceiro
  - Calendário de recebíveis comprometidos
  - Histórico de pagamentos recebidos
  - Link de referral para novos clientes

**Testes:**
- ✅ Setup de mandato ACH (sandbox PayBright)
- ✅ Débito automático recorrente
- ✅ Pagamento ao parceiro
- ✅ Cálculo e processamento de recebíveis

---

### Sprint 4: Agentes Autônomos e Analytics (1-2 dias | 30-34 horas)

**Backend (14-16h):**
- ✅ Criar MasterAgent
  - Análise de métricas do sistema
  - Identificação de necessidades
  - Criação automática de novos agentes
- ✅ Criar AgentNotifier (email/SMS)
- ✅ Criar AgentSecurityMonitor (detecção de fraude)
- ✅ Criar AgentPerformanceAnalyzer (ML básico)
- ✅ Implementar dashboard de agentes:
  - GET `/api/agents` (listar todos os agentes)
  - GET `/api/agents/:name/status`
  - PUT `/api/agents/:name/config` (atualizar config)
  - POST `/api/agents/:name/execute` (executar manualmente)
  - GET `/api/agents/logs`

**Frontend (16-18h):**
- ✅ Criar página `/admin/agentes`
  - Dashboard de agentes (status, métricas, última execução)
  - Monitor em tempo real (WebSockets)
  - Editor visual de parâmetros
  - Botão "Criar Novo Agente" (Master-Agent)
  - Logs de execução
- ✅ Criar página `/admin/analytics`
  - Gráficos avançados (taxas de aprovação, DTI médio, volume por parceiro)
  - Heatmap de aprovações por score
  - Predições de ML
- ✅ Criar configurações avançadas (`/admin/configuracoes`)
  - Taxas de juros (tabela configurável)
  - Regras de aprovação
  - Integrações (PayBright, Experian keys)
  - Webhooks

**Testes:**
- ✅ Executar MasterAgent e validar criação de novos agentes
- ✅ Testar comunicação entre agentes via EventBus
- ✅ Validar editor de parâmetros de agentes
- ✅ Testes de performance e stress

---

## ✅ RESUMO FINAL

### Tecnologias Utilizadas

**Backend:**
- Node.js + Express.js
- Prisma ORM + PostgreSQL (Supabase)
- PayBright ACH API
- Experian Credit API
- Cloudinary (upload de documentos)
- DocuSign/HelloSign (assinatura digital)

**Frontend:**
- HTML5, CSS3 (layout baseado em dashboard-cliente.html)
- JavaScript Vanilla
- Chart.js (gráficos)
- Font Awesome (ícones)
- Tipografia: Inter (Google Fonts)

**Deploy:**
- Backend: Railway (https://web-production-e227.up.railway.app)
- Frontend: Vercel (https://flexcredi.vercel.app)
- Banco de dados: Supabase PostgreSQL

### Estimativa Total

| Sprint | Horas | Dias |
|--------|-------|------|
| Sprint 1 | 16-20h | 2-3 dias |
| Sprint 2 | 18-22h | 2-3 dias |
| Sprint 3 | 26-30h | 3-4 dias |
| Sprint 4 | 30-34h | 3-4 dias |
| **TOTAL** | **90-106h** | **11-13 dias** |

### Aprovação

**Confirme para iniciar Sprint 1:**

Responda: **"SIM, COMEÇAR SPRINT 1 AGORA"**

---

**Documento criado em:** 2026-02-21  
**Última atualização:** 2026-02-21  
**Versão:** 4.0 FINAL

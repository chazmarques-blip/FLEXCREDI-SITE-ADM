# 🎯 PLANEJAMENTO COMPLETO - SISTEMA ADMIN FLEXCREDI

**Data de Criação**: 21/02/2026  
**Versão**: 1.0  
**Status**: 📋 Em Planejamento

---

## 🎯 **OBJETIVO PRINCIPAL**

Criar um **sistema administrativo completo e automatizado** que permita a gestão integral dos clientes FlexCredi, desde o cadastro inicial até o acompanhamento de contratos, documentos e pagamentos, **usando o mesmo padrão de layout e experiência do dashboard do cliente** (`dashboard-cliente.html`).

---

## 📊 **ANÁLISE DO SISTEMA ATUAL**

### **✅ O que JÁ EXISTE:**

#### **1. Dashboard do Cliente** (`dashboard-cliente.html`)
- ✅ Layout profissional com header fixo
- ✅ Card de status com informações do financiamento
- ✅ Seção de signatário principal com foto e dados
- ✅ Progresso horizontal compacto (6 etapas)
- ✅ Modal de contrato com visualização PDF
- ✅ Área de documentos vinculados
- ✅ Gráfico de score de crédito
- ✅ Sistema de edição inline
- ✅ Totalmente responsivo

**Elementos visuais identificados:**
- Card de status com badge (PRÉ-APROVADO, APROVADO, etc.)
- Detalhes do financiamento inline (valor, taxa, prazo, parcela)
- Score de crédito visual
- Barra de progresso horizontal com 6 etapas
- Cards de signatário com foto circular
- Área de upload de documentos
- Modal de contrato com preview PDF

#### **2. Banco de Dados** (Prisma Schema)
- ✅ 7 tabelas definidas:
  - `AdminUser` - Usuários administradores
  - `User` - Clientes
  - `Application` - Aplicações de crédito
  - `Document` - Documentos vinculados
  - `Contract` - Contratos gerados
  - `SystemSetting` - Configurações
  - `AuditLog` - Logs de auditoria

#### **3. Backend API** (Railway - https://web-production-e227.up.railway.app)
- ✅ Endpoints funcionais:
  - `GET /` - Info da API
  - `GET /health` - Health check
  - `GET /api/dashboard` - Estatísticas
  - `GET /api/applications` - Listar aplicações
  - `POST /api/applications` - Criar aplicação

#### **4. Admin Dashboard Básico** (`admin-dashboard.html`)
- ✅ Layout com sidebar e header
- ✅ Cards de estatísticas
- ✅ Tabela de aplicações
- ✅ Botões de ação rápida

---

## 🔍 **GAP ANALYSIS - O QUE FALTA:**

### **❌ Backend API - Endpoints Necessários:**

#### **Gestão de Clientes:**
- ❌ `GET /api/clients` - Listar todos os clientes
- ❌ `GET /api/clients/:id` - Detalhes de um cliente
- ❌ `PUT /api/clients/:id` - Atualizar dados do cliente
- ❌ `DELETE /api/clients/:id` - Deletar cliente (soft delete)
- ❌ `GET /api/clients/:id/applications` - Aplicações do cliente
- ❌ `GET /api/clients/:id/documents` - Documentos do cliente
- ❌ `GET /api/clients/:id/contracts` - Contratos do cliente
- ❌ `GET /api/clients/:id/timeline` - Linha do tempo de atividades

#### **Gestão de Aplicações:**
- ❌ `PUT /api/applications/:id` - Atualizar aplicação
- ❌ `PUT /api/applications/:id/approve` - Aprovar aplicação
- ❌ `PUT /api/applications/:id/reject` - Rejeitar aplicação
- ❌ `PUT /api/applications/:id/status` - Mudar status
- ❌ `POST /api/applications/:id/notes` - Adicionar notas

#### **Gestão de Documentos:**
- ❌ `GET /api/documents` - Listar todos os documentos
- ❌ `POST /api/documents/upload` - Upload de documento
- ❌ `PUT /api/documents/:id/approve` - Aprovar documento
- ❌ `PUT /api/documents/:id/reject` - Rejeitar documento
- ❌ `DELETE /api/documents/:id` - Deletar documento

#### **Gestão de Contratos:**
- ❌ `GET /api/contracts` - Listar contratos
- ❌ `GET /api/contracts/:id` - Detalhes do contrato
- ❌ `POST /api/contracts/generate` - Gerar contrato
- ❌ `GET /api/contracts/:id/pdf` - Baixar PDF

#### **Agenda e Pagamentos:**
- ❌ `GET /api/payments/:clientId` - Agenda de pagamentos
- ❌ `POST /api/payments` - Registrar pagamento
- ❌ `PUT /api/payments/:id` - Atualizar pagamento

#### **Autenticação Admin:**
- ❌ `POST /api/admin/login` - Login admin
- ❌ `POST /api/admin/logout` - Logout admin
- ❌ `GET /api/admin/me` - Dados do admin logado
- ❌ `PUT /api/admin/profile` - Atualizar perfil admin

#### **Dashboard e Analytics:**
- ✅ `GET /api/dashboard` - Estatísticas gerais (JÁ EXISTE)
- ❌ `GET /api/analytics/revenue` - Análise de receita
- ❌ `GET /api/analytics/approval-rate` - Taxa de aprovação
- ❌ `GET /api/analytics/risk-distribution` - Distribuição de risco

### **❌ Frontend Admin - Páginas/Componentes Necessários:**

#### **1. Dashboard Principal**
- ❌ Cards de estatísticas em tempo real
- ❌ Gráficos de performance
- ❌ Lista de atividades recentes
- ❌ Alertas e notificações

#### **2. Gestão de Clientes (⭐ PRINCIPAL)**
- ❌ **Listagem de clientes** com filtros e busca
- ❌ **Perfil detalhado do cliente** (baseado em dashboard-cliente.html):
  - Header com foto, nome, score
  - Detalhes do financiamento
  - Barra de progresso do processo
  - Seção de signatários
  - Área de documentos
  - Histórico de atividades
  - Timeline de interações
- ❌ **Formulário de edição** inline
- ❌ **Modal de notas** administrativas

#### **3. Gestão de Aplicações**
- ❌ Listagem com filtros (status, data, valor)
- ❌ Visualização detalhada
- ❌ Ações: Aprovar, Rejeitar, Solicitar documentos
- ❌ Histórico de mudanças

#### **4. Gestão de Documentos**
- ❌ Galeria de documentos por cliente
- ❌ Visualizador PDF inline
- ❌ Sistema de aprovação/rejeição
- ❌ Upload em lote
- ❌ Extração automática de dados (OCR)

#### **5. Gestão de Contratos**
- ❌ Listagem de contratos
- ❌ Gerador de contratos automático
- ❌ Editor de templates
- ❌ Sistema de assinatura digital
- ❌ Arquivo de contratos assinados

#### **6. Agenda de Recebimentos**
- ❌ Calendário visual
- ❌ Lista de parcelas a receber
- ❌ Registro de pagamentos
- ❌ Geração de boletos/cobranças
- ❌ Notificações automáticas

#### **7. Relatórios e Analytics**
- ❌ Dashboard de métricas
- ❌ Relatórios financeiros
- ❌ Análise de risco
- ❌ Exportação de dados (CSV, PDF)

#### **8. Configurações do Sistema**
- ❌ Gerenciamento de usuários admin
- ❌ Configurações de taxas e prazos
- ❌ Templates de email
- ❌ Logs de auditoria

---

## 🎨 **DESIGN SYSTEM - PADRÕES VISUAIS**

### **Baseado no `dashboard-cliente.html`:**

#### **Cores:**
```css
--verde-vibrante: #2ECC71;
--verde-escuro: #1E8449;
--branco: #FFFFFF;
--cinza-claro: #F8F9FA;
--cinza-medio: #6C757D;
--cinza-escuro: #343A40;
--laranja: #F59E0B;
--vermelho: #DC3545;
--azul: #0066CC;
```

#### **Componentes Reutilizáveis:**
1. **Status Badge** - Badge colorido com ícone
2. **User Card** - Card de cliente com foto circular
3. **Progress Bar** - Barra horizontal 6 etapas
4. **Document Card** - Card de documento com preview
5. **Modal Container** - Modal padrão para ações
6. **Timeline Component** - Linha do tempo de eventos
7. **Stats Card** - Card de estatística com ícone
8. **Action Buttons** - Botões de ação (aprovar, rejeitar, etc.)

#### **Layout Structure:**
```
┌─────────────────────────────────────────────────┐
│ HEADER FIXO                                     │
│ Logo | Busca Global | Notificações | User Menu │
└─────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────┐
│          │                                      │
│ SIDEBAR  │  CONTEÚDO PRINCIPAL                  │
│          │                                      │
│ Menu     │  [Cards, Tabelas, Gráficos]          │
│ Navegação│                                      │
│          │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

---

## 🤖 **AGENTE AUTÔNOMO - SISTEMA DE AUTOMAÇÃO**

### **Conceito:**
Criar um **"Manager Agent"** que vai gerenciar automaticamente as informações e ações do sistema, funcionando como um assistente administrativo inteligente.

### **Funcionalidades do Agente:**

#### **1. Automação de Processos:**
- 🤖 **Auto-aprovação inteligente**:
  - Analisa score de crédito
  - Valida documentos automaticamente
  - Aprova aplicações de baixo risco
  
- 🤖 **Notificações automáticas**:
  - Alerta quando documentos são enviados
  - Notifica sobre pagamentos atrasados
  - Avisa sobre aplicações pendentes há muito tempo
  
- 🤖 **Geração de contratos**:
  - Cria contratos automaticamente após aprovação
  - Preenche templates com dados do cliente
  - Envia para assinatura digital

#### **2. Análise de Dados:**
- 📊 **Dashboard Inteligente**:
  - Calcula métricas em tempo real
  - Identifica tendências
  - Sugere ações baseadas em dados
  
- 📊 **Análise de Risco**:
  - Classifica clientes por nível de risco
  - Sugere taxas de juros
  - Alerta sobre aplicações suspeitas

#### **3. Gestão Dinâmica:**
- 🔄 **Atualização automática**:
  - Sincroniza dados entre sistemas
  - Atualiza status automaticamente
  - Mantém histórico de mudanças
  
- 🔄 **Backup e recuperação**:
  - Cria backups automáticos
  - Mantém versionamento de documentos
  - Permite rollback de alterações

#### **4. Comunicação Inteligente:**
- 💬 **Envio de emails automáticos**:
  - Boas-vindas ao novo cliente
  - Confirmação de aprovação
  - Lembretes de pagamento
  - Solicitação de documentos faltantes
  
- 💬 **SMS e WhatsApp**:
  - Notificações importantes
  - Confirmações de ações
  - Alertas de vencimento

---

## 📋 **ESTRUTURA DE DADOS - INFORMAÇÕES POR CLIENTE**

### **Perfil do Cliente:**
```javascript
{
  // DADOS PESSOAIS
  id: "uuid",
  name: "Nome Completo",
  email: "email@exemplo.com",
  phone: "(11) 99999-9999",
  document: "CPF/Passport",
  dateOfBirth: "DD/MM/YYYY",
  avatar: "url_foto",
  
  // ENDEREÇO
  address: "Rua, Número",
  city: "Cidade",
  state: "Estado",
  zipCode: "CEP",
  
  // DADOS PROFISSIONAIS
  occupation: "Profissão",
  monthlyIncome: 5000.00,
  employer: "Empresa",
  
  // SCORE E RISCO
  creditScore: 785,
  riskLevel: "low", // low, medium, high
  
  // STATUS
  status: "active", // active, inactive, blocked
  registrationDate: "DD/MM/YYYY",
  lastActivity: "DD/MM/YYYY HH:MM"
}
```

### **Aplicação de Crédito:**
```javascript
{
  id: "uuid",
  clientId: "uuid_cliente",
  
  // VALORES
  desiredAmount: 25000.00,
  approvedAmount: 25000.00,
  interestRate: 18.5, // % a.a.
  termMonths: 24,
  monthlyPayment: 1287.00,
  totalAmount: 30888.00,
  
  // STATUS
  status: "approved", // pending, pre-approved, approved, rejected, active, completed
  
  // DATAS
  appliedAt: "DD/MM/YYYY",
  approvedAt: "DD/MM/YYYY",
  
  // ANÁLISE
  purpose: "Equipamentos",
  riskScore: 7.5,
  approvalNotes: "Cliente com bom histórico",
  
  // PROGRESSO (6 etapas)
  progress: {
    step1_registration: true,
    step2_documents: true,
    step3_analysis: true,
    step4_approval: true,
    step5_contract: false,
    step6_disbursement: false
  }
}
```

### **Documento:**
```javascript
{
  id: "uuid",
  clientId: "uuid_cliente",
  applicationId: "uuid_aplicacao",
  
  // TIPO
  type: "id_document", // id_document, proof_income, proof_address, bank_statement, other
  
  // ARQUIVO
  originalName: "documento.pdf",
  fileUrl: "https://cloudinary.com/...",
  fileSize: 1024000, // bytes
  mimeType: "application/pdf",
  
  // STATUS
  status: "approved", // pending, approved, rejected
  uploadedAt: "DD/MM/YYYY HH:MM",
  reviewedAt: "DD/MM/YYYY HH:MM",
  reviewedBy: "uuid_admin",
  reviewNotes: "Documento válido",
  
  // EXTRAÇÃO AUTOMÁTICA (OCR)
  extractedData: {
    documentNumber: "123456789",
    expiryDate: "DD/MM/YYYY",
    confidence: 0.95
  }
}
```

### **Contrato:**
```javascript
{
  id: "uuid",
  contractNumber: "FLEX-2024-00123",
  applicationId: "uuid_aplicacao",
  clientId: "uuid_cliente",
  
  // VALORES
  principalAmount: 25000.00,
  interestRate: 18.5,
  termMonths: 24,
  monthlyPayment: 1287.00,
  totalAmount: 30888.00,
  
  // STATUS
  status: "signed", // generated, sent, signed, active, completed, cancelled
  
  // ASSINATURA
  generatedAt: "DD/MM/YYYY",
  sentAt: "DD/MM/YYYY",
  signedAt: "DD/MM/YYYY",
  signatureHash: "hash_assinatura",
  signerIp: "192.168.1.1",
  
  // ARQUIVO
  pdfUrl: "https://storage.com/contrato.pdf",
  templateUsed: "template_v1"
}
```

### **Agenda de Pagamentos:**
```javascript
{
  id: "uuid",
  contractId: "uuid_contrato",
  clientId: "uuid_cliente",
  
  // PARCELA
  installmentNumber: 1, // 1 a 24
  dueDate: "DD/MM/YYYY",
  amount: 1287.00,
  
  // STATUS
  status: "pending", // pending, paid, late, cancelled
  paidAt: "DD/MM/YYYY",
  paidAmount: 1287.00,
  lateFee: 0.00,
  
  // COBRANÇA
  invoiceUrl: "https://boleto.com/...",
  paymentMethod: "bank_slip", // bank_slip, credit_card, pix
  
  // NOTIFICAÇÕES
  reminderSent: true,
  reminderDate: "DD/MM/YYYY"
}
```

---

## 🔄 **FLUXO COMPLETO DO SISTEMA**

### **1. Cliente se Cadastra** (Site Público)
1. Preenche formulário de aplicação (`aplicacao.html`)
2. Envia dados básicos
3. Recebe login e senha

### **2. Cliente Acessa Dashboard** (`dashboard-cliente.html`)
1. Faz login (`login.html`)
2. Visualiza status da aplicação
3. Faz upload de documentos
4. Acompanha progresso (6 etapas)
5. Assina contrato quando aprovado

### **3. Admin Recebe Notificação** (Sistema Admin)
1. Nova aplicação aparece no dashboard
2. Agente analisa automaticamente
3. Admin revisa documentos
4. Admin aprova/rejeita

### **4. Após Aprovação** (Automação)
1. Sistema gera contrato automaticamente
2. Envia email para cliente
3. Cliente assina digitalmente
4. Contrato é ativado
5. Primeira parcela é agendada

### **5. Gestão de Pagamentos** (Sistema Admin)
1. Admin visualiza agenda de recebimentos
2. Registra pagamentos recebidos
3. Sistema envia lembretes automáticos
4. Marca parcelas pagas
5. Calcula taxas de atraso

---

## 📦 **ESTRUTURA DE ARQUIVOS PROPOSTA**

```
/home/user/webapp/
├── admin/                          # Novo: Sistema Admin
│   ├── index.html                  # Dashboard principal
│   ├── clients/
│   │   ├── list.html              # Lista de clientes
│   │   └── profile.html           # Perfil detalhado (baseado em dashboard-cliente)
│   ├── applications/
│   │   ├── list.html              # Lista de aplicações
│   │   └── review.html            # Análise de aplicação
│   ├── documents/
│   │   ├── gallery.html           # Galeria de documentos
│   │   └── review.html            # Aprovação de documentos
│   ├── contracts/
│   │   ├── list.html              # Lista de contratos
│   │   └── generator.html         # Gerador de contratos
│   ├── payments/
│   │   ├── calendar.html          # Agenda de recebimentos
│   │   └── register.html          # Registro de pagamento
│   ├── reports/
│   │   └── analytics.html         # Relatórios e gráficos
│   └── settings/
│       └── config.html            # Configurações
│
├── css/
│   └── admin/                      # Novo: CSS do Admin
│       ├── admin-layout.css        # Layout base
│       ├── client-profile.css      # Perfil do cliente (reutiliza dashboard-cliente)
│       ├── components.css          # Componentes reutilizáveis
│       └── theme.css              # Tema e cores
│
├── js/
│   └── admin/                      # Novo: JavaScript do Admin
│       ├── api-client.js           # Cliente API
│       ├── client-manager.js       # Gestão de clientes
│       ├── document-manager.js     # Gestão de documentos
│       ├── contract-generator.js   # Gerador de contratos
│       ├── payment-manager.js      # Gestão de pagamentos
│       ├── auto-agent.js          # 🤖 Agente autônomo
│       └── utils.js               # Utilitários
│
└── backend/
    └── routes/                     # Novo: Rotas do Backend
        ├── admin-auth.js           # Autenticação admin
        ├── clients.js              # CRUD de clientes
        ├── applications.js         # Gestão de aplicações
        ├── documents.js            # Gestão de documentos
        ├── contracts.js            # Gestão de contratos
        ├── payments.js             # Gestão de pagamentos
        └── analytics.js            # Analytics e relatórios
```

---

## ⏱️ **ESTIMATIVA DE TEMPO - DESENVOLVIMENTO**

### **Fase 1: Backend API** (⏱️ 8-10 horas)
- [ ] Endpoints de clientes (2h)
- [ ] Endpoints de aplicações (2h)
- [ ] Endpoints de documentos (2h)
- [ ] Endpoints de contratos (2h)
- [ ] Endpoints de pagamentos (2h)

### **Fase 2: Frontend Admin - Core** (⏱️ 12-15 horas)
- [ ] Dashboard principal (2h)
- [ ] Listagem de clientes (2h)
- [ ] Perfil detalhado do cliente (4h) ⭐
- [ ] Gestão de aplicações (3h)
- [ ] Gestão de documentos (3h)

### **Fase 3: Frontend Admin - Avançado** (⏱️ 10-12 horas)
- [ ] Gestão de contratos (4h)
- [ ] Agenda de pagamentos (3h)
- [ ] Relatórios e analytics (3h)
- [ ] Configurações (2h)

### **Fase 4: Agente Autônomo** (⏱️ 6-8 horas)
- [ ] Auto-aprovação inteligente (2h)
- [ ] Notificações automáticas (2h)
- [ ] Geração automática de contratos (2h)
- [ ] Sistema de emails (2h)

### **Fase 5: Testes e Ajustes** (⏱️ 4-6 horas)
- [ ] Testes de integração (2h)
- [ ] Correções de bugs (2h)
- [ ] Otimizações de performance (2h)

**TOTAL ESTIMADO**: 40-51 horas (~5-7 dias de trabalho focado)

---

## 🚀 **PLANO DE IMPLEMENTAÇÃO SUGERIDO**

### **Abordagem: Desenvolvimento Iterativo**

#### **Sprint 1: MVP do Admin** (⏱️ 1-2 dias)
**Objetivo**: Sistema admin funcional básico

1. **Backend**:
   - ✅ Endpoints de clientes (GET, PUT)
   - ✅ Endpoints de aplicações (GET, PUT, approve, reject)
   - ✅ Autenticação admin

2. **Frontend**:
   - ✅ Dashboard com estatísticas
   - ✅ Listagem de clientes com busca
   - ✅ Perfil básico do cliente
   - ✅ Ações de aprovação/rejeição

**Entrega**: Admin consegue visualizar e aprovar aplicações

---

#### **Sprint 2: Gestão Completa de Clientes** (⏱️ 2-3 dias)
**Objetivo**: Perfil detalhado do cliente (baseado em dashboard-cliente)

1. **Backend**:
   - ✅ Endpoints de documentos
   - ✅ Upload de arquivos (Cloudinary)
   - ✅ Timeline de atividades

2. **Frontend**:
   - ✅ Perfil detalhado com todos os componentes:
     - Header com foto e score
     - Detalhes do financiamento
     - Barra de progresso
     - Documentos vinculados
     - Timeline de atividades
   - ✅ Sistema de edição inline
   - ✅ Gestão de documentos

**Entrega**: Admin tem visão 360° do cliente

---

#### **Sprint 3: Contratos e Pagamentos** (⏱️ 2-3 dias)
**Objetivo**: Gestão financeira completa

1. **Backend**:
   - ✅ Endpoints de contratos
   - ✅ Gerador de PDF
   - ✅ Endpoints de pagamentos
   - ✅ Cálculo de parcelas

2. **Frontend**:
   - ✅ Gerador de contratos
   - ✅ Agenda de recebimentos
   - ✅ Registro de pagamentos
   - ✅ Visualização de contratos

**Entrega**: Sistema financeiro funcionando

---

#### **Sprint 4: Automação e Inteligência** (⏱️ 1-2 dias)
**Objetivo**: Agente autônomo funcionando

1. **Backend**:
   - ✅ Sistema de notificações
   - ✅ Auto-aprovação inteligente
   - ✅ Envio de emails

2. **Frontend**:
   - ✅ Dashboard de analytics
   - ✅ Relatórios
   - ✅ Configurações do agente

**Entrega**: Sistema inteligente e automatizado

---

## 🎯 **PRIORIZAÇÃO DE FEATURES**

### **🔴 MUST HAVE (Essencial):**
1. ✅ Dashboard com estatísticas
2. ✅ Listagem de clientes
3. ✅ Perfil detalhado do cliente (baseado em dashboard-cliente)
4. ✅ Aprovação/rejeição de aplicações
5. ✅ Gestão de documentos
6. ✅ Visualização de contratos

### **🟡 SHOULD HAVE (Importante):**
1. ✅ Agenda de pagamentos
2. ✅ Registro de pagamentos
3. ✅ Gerador de contratos
4. ✅ Timeline de atividades
5. ✅ Busca e filtros avançados

### **🟢 COULD HAVE (Desejável):**
1. ✅ Auto-aprovação inteligente
2. ✅ Notificações automáticas
3. ✅ Relatórios e analytics
4. ✅ Exportação de dados
5. ✅ Sistema de backup

### **⚪ WON'T HAVE (Futuro):**
1. ⏳ Integração com WhatsApp
2. ⏳ OCR automático de documentos
3. ⏳ Sistema de chat interno
4. ⏳ App mobile

---

## 📊 **MÉTRICAS DE SUCESSO**

### **Para o Admin:**
- ⏱️ Tempo médio de aprovação de aplicação: < 5 minutos
- 📄 Taxa de documentos aprovados automaticamente: > 70%
- 🔍 Tempo para encontrar informação de cliente: < 30 segundos
- 💰 Tempo para registrar pagamento: < 2 minutos

### **Para o Sistema:**
- 🤖 Taxa de automação: > 60%
- 📧 Emails enviados automaticamente: 100%
- 🔄 Sincronização de dados: tempo real
- ✅ Uptime do sistema: > 99%

---

## 🔐 **SEGURANÇA E PERMISSÕES**

### **Níveis de Acesso:**
1. **Super Admin**: Acesso total
2. **Admin Manager**: Gestão de clientes e aplicações
3. **Financial Admin**: Gestão de pagamentos e contratos
4. **Document Reviewer**: Apenas revisão de documentos
5. **Read Only**: Apenas visualização

### **Logs de Auditoria:**
- ✅ Registrar todas as ações administrativas
- ✅ Manter histórico de mudanças
- ✅ Permitir rollback de alterações críticas

---

## 📝 **PRÓXIMOS PASSOS**

### **Você precisa decidir:**

1. **Começar pela Fase 1 (Backend)?**
   - Criar todos os endpoints necessários
   - Testar com Postman/Insomnia
   - Depois partir para frontend

2. **Começar pela Fase 2 (Frontend Core)?**
   - Criar perfil detalhado do cliente
   - Usar dados mockados inicialmente
   - Conectar com backend depois

3. **Abordagem Híbrida?**
   - Desenvolver uma feature completa por vez (backend + frontend)
   - Exemplo: Primeiro completar "Gestão de Clientes" inteira

**❓ Qual abordagem você prefere?**

---

## 💬 **PERGUNTAS PARA VALIDAÇÃO**

Antes de começar, confirme:

1. ✅ **Layout**: Usar o mesmo padrão visual de `dashboard-cliente.html`?
2. ✅ **Prioridade**: Começar pelo perfil detalhado do cliente?
3. ✅ **Automação**: Implementar agente autônomo desde o início ou depois?
4. ✅ **Pagamentos**: Sistema de agenda é prioritário?
5. ✅ **Documentos**: Upload via Cloudinary ou outro serviço?

---

**📌 Este documento serve como base para todo o desenvolvimento. Vamos discutir e ajustar antes de começar a implementação!**

**Última Atualização**: 21/02/2026  
**Status**: 📋 Aguardando validação e decisão de início

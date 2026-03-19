# 🎨 DESIGN SYSTEM - FlexCredi Admin Dashboard
## Guia Completo de Layout e Componentes

**Baseado em:** `dashboard-cliente.html` e sistema de CSS existente  
**Objetivo:** Garantir 100% de consistência visual entre cliente e admin  
**Criado em:** 2026-02-21  
**Versão:** 1.0 FINAL

---

## 📋 ÍNDICE
1. [Paleta de Cores](#paleta-de-cores)
2. [Tipografia](#tipografia)
3. [Estrutura de Layout](#estrutura-de-layout)
4. [Componentes Reutilizáveis](#componentes-reutilizáveis)
5. [Sistema de Grid](#sistema-de-grid)
6. [Estados e Animações](#estados-e-animações)
7. [Responsividade](#responsividade)
8. [Referências de Código](#referências-de-código)

---

## 🎨 PALETA DE CORES

### Cores Primárias (do style.css)
```css
:root {
    /* Cores Primárias */
    --verde-vibrante: #2ECC71;      /* Cor principal FlexCredi */
    --verde-escuro: #27AE60;        /* Hover e estados ativos */
    --cinza-escuro: #333333;        /* Texto principal */
    --preto: #2C3E50;               /* Headers e títulos */
    
    /* Cores Secundárias */
    --branco: #FFFFFF;              /* Background principal */
    --cinza-claro: #F5F5F5;         /* Background alternativo */
    --cinza-medio: #BDC3C7;         /* Borders e divisores */
    --azul-claro: #3498DB;          /* Links e info */
    --azul-escuro: #2980B9;         /* Links hover */
    
    /* Cores de Status */
    --verde-sucesso: #27AE60;       /* Aprovado, Completo */
    --vermelho-erro: #E74C3C;       /* Rejeitado, Erro */
    --amarelo-aviso: #F39C12;       /* Pendente, Aviso */
    --azul-info: #3498DB;           /* Informação */
}
```

### Uso das Cores

| Elemento | Cor | Código | Uso |
|----------|-----|--------|-----|
| Botões primários | Verde vibrante | `#2ECC71` | Ações principais (Aprovar, Salvar, Criar) |
| Botões hover | Verde escuro | `#27AE60` | Estado hover de botões primários |
| Headers | Preto | `#2C3E50` | Títulos de seção (h1, h2) |
| Texto corpo | Cinza escuro | `#333333` | Parágrafos, labels |
| Background | Branco | `#FFFFFF` | Cards, modals, containers |
| Background alt | Cinza claro | `#F5F5F5` | Background da página |
| Borders | Cinza médio | `#BDC3C7` | Bordas de cards, inputs |
| Links | Azul claro | `#3498DB` | Links e botões secundários |
| Status aprovado | Verde sucesso | `#27AE60` | Badge "Aprovado", ícones ✅ |
| Status rejeitado | Vermelho erro | `#E74C3C` | Badge "Rejeitado", ícones ❌ |
| Status pendente | Amarelo aviso | `#F39C12` | Badge "Pendente", ícones ⏳ |

---

## 📝 TIPOGRAFIA

### Fonte Principal
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
    --font-principal: 'Poppins', sans-serif;
}
```

**⚠️ IMPORTANTE:** Dashboard do cliente usa **Poppins**, não Inter!

### Tamanhos de Fonte
```css
:root {
    --font-size-base: 14px;         /* Texto padrão */
    --font-size-small: 12px;        /* Legendas, small text */
    --font-size-large: 16px;        /* Texto enfatizado */
    --font-size-h1: 36px;           /* Títulos principais */
    --font-size-h2: 28px;           /* Subtítulos */
    --font-size-h3: 22px;           /* Seções */
    --font-size-h4: 18px;           /* Cards headers */
    --font-size-h5: 16px;           /* Subseções */
}
```

### Hierarquia de Texto

| Elemento | Tamanho | Peso | Uso |
|----------|---------|------|-----|
| H1 | 36px | 600 | Saudação principal ("Bem-vindo, Admin") |
| H2 | 28px | 600 | Títulos de seção (Dashboard, Clientes) |
| H3 | 22px | 600 | Cards principais |
| H4 | 18px | 500 | Cards secundários, modals |
| H5 | 16px | 500 | Subtítulos de cards |
| Parágrafo | 14px | 400 | Texto corpo |
| Small | 12px | 400 | Legendas, descrições |

---

## 🏗️ ESTRUTURA DE LAYOUT

### 1. Header Dashboard (Igual ao Cliente)

**Referência:** `dashboard-cliente.html` linhas 51-78

```html
<header class="dashboard-header" role="banner">
    <nav class="navbar container" role="navigation">
        <!-- Logo -->
        <a href="index.html" class="navbar-brand">
            <img src="images/flexcredi-logo-official.png" 
                 alt="FLEXCREDI - Easy, Simple, Fast" 
                 class="logo-img">
        </a>
        
        <!-- User Menu -->
        <div class="user-menu">
            <div class="user-info">
                <img src="https://ui-avatars.com/api/?name=Admin&background=2ECC71&color=fff" 
                     alt="Avatar" 
                     class="user-avatar" 
                     id="userAvatar">
                <span class="user-name" id="userName">Admin</span>
            </div>
            <div class="dropdown">
                <button class="dropdown-toggle" type="button" id="userDropdown">
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                    <a href="#profile" class="dropdown-item">Meu Perfil</a>
                    <a href="#settings" class="dropdown-item">Configurações</a>
                    <a href="#help" class="dropdown-item">Ajuda</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item logout-btn">Sair</a>
                </div>
            </div>
        </div>
    </nav>
</header>
```

**CSS do Header:**
```css
.dashboard-header {
    background: var(--branco);
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 12px 0;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-img {
    height: 42px;
    width: auto;
}

.user-menu {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid var(--verde-vibrante);
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--cinza-escuro);
}
```

---

### 2. Sidebar Admin (NOVO - Não existe no cliente)

**Design:**
- Largura fixa: 240px
- Background: `#FFFFFF`
- Border right: `1px solid #e9ecef`
- Position: fixed left

```html
<aside class="admin-sidebar">
    <nav class="sidebar-nav">
        <a href="/admin/dashboard" class="nav-item active">
            <i class="fas fa-chart-line"></i>
            <span>Dashboard</span>
        </a>
        <a href="/admin/aplicacoes" class="nav-item">
            <i class="fas fa-file-invoice"></i>
            <span>Aplicações</span>
        </a>
        <a href="/admin/clientes" class="nav-item">
            <i class="fas fa-users"></i>
            <span>Clientes</span>
        </a>
        <a href="/admin/parceiros" class="nav-item">
            <i class="fas fa-handshake"></i>
            <span>Parceiros</span>
        </a>
        <a href="/admin/documentos" class="nav-item">
            <i class="fas fa-folder"></i>
            <span>Documentos</span>
        </a>
        <a href="/admin/contratos" class="nav-item">
            <i class="fas fa-file-contract"></i>
            <span>Contratos</span>
        </a>
        <a href="/admin/pagamentos" class="nav-item">
            <i class="fas fa-credit-card"></i>
            <span>Pagamentos ACH</span>
        </a>
        <a href="/admin/recebiveis" class="nav-item">
            <i class="fas fa-calendar-alt"></i>
            <span>Recebíveis</span>
        </a>
        <a href="/admin/agentes" class="nav-item">
            <i class="fas fa-robot"></i>
            <span>Agentes</span>
        </a>
        <a href="/admin/configuracoes" class="nav-item">
            <i class="fas fa-cog"></i>
            <span>Configurações</span>
        </a>
    </nav>
</aside>
```

**CSS da Sidebar:**
```css
.admin-sidebar {
    position: fixed;
    top: 70px; /* Altura do header */
    left: 0;
    width: 240px;
    height: calc(100vh - 70px);
    background: var(--branco);
    border-right: 1px solid #e9ecef;
    overflow-y: auto;
    z-index: 90;
}

.sidebar-nav {
    padding: 20px 0;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    color: var(--cinza-escuro);
    text-decoration: none;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 400;
}

.nav-item i {
    font-size: 16px;
    width: 20px;
    text-align: center;
}

.nav-item:hover {
    background: #f8f9fa;
    color: var(--verde-vibrante);
}

.nav-item.active {
    background: linear-gradient(90deg, 
        rgba(46, 204, 113, 0.1) 0%, 
        rgba(46, 204, 113, 0) 100%);
    color: var(--verde-vibrante);
    border-left: 3px solid var(--verde-vibrante);
    font-weight: 500;
}
```

---

### 3. Main Content Area

```html
<main class="admin-main-content">
    <div class="container">
        <!-- Conteúdo aqui -->
    </div>
</main>
```

**CSS:**
```css
.admin-main-content {
    margin-left: 240px; /* Largura da sidebar */
    margin-top: 70px;   /* Altura do header */
    padding: 24px;
    min-height: calc(100vh - 70px);
    background: var(--cinza-claro);
}
```

---

## 🧩 COMPONENTES REUTILIZÁVEIS

### 1. Status Header (do dashboard-cliente.html)

**Referência:** Linhas 85-123

```html
<section class="status-header">
    <div class="status-card">
        <div class="status-info">
            <div class="user-header">
                <h1 class="user-greeting" id="userGreeting">
                    Bem-vindo, Admin!
                </h1>
                
                <!-- Métricas inline -->
                <div class="financing-details" id="metricsDetails">
                    <div class="financing-item">
                        <span class="financing-label">TOTAL:</span>
                        <span class="financing-value" id="totalApplications">142</span>
                    </div>
                    <div class="financing-item">
                        <span class="financing-label">PENDENTES:</span>
                        <span class="financing-value" id="pendingApplications">28</span>
                    </div>
                    <div class="financing-item">
                        <span class="financing-label">APROVADAS:</span>
                        <span class="financing-value" id="approvedApplications">98</span>
                    </div>
                    <div class="financing-item">
                        <span class="financing-label">VOLUME:</span>
                        <span class="financing-value" id="totalVolume">$2.4M</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

**CSS:**
```css
.status-header {
    margin-bottom: 24px;
}

.status-card {
    background: var(--branco);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.user-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
}

.user-greeting {
    font-size: 28px;
    font-weight: 600;
    color: var(--cinza-escuro);
    margin: 0;
}

.financing-details {
    display: flex;
    gap: 24px;
    align-items: center;
}

.financing-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.financing-label {
    font-size: 11px;
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.financing-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--verde-vibrante);
}
```

---

### 2. Cards de Métricas (4 colunas)

```html
<div class="metrics-grid">
    <div class="metric-card">
        <div class="metric-icon">
            <i class="fas fa-file-invoice"></i>
        </div>
        <div class="metric-details">
            <span class="metric-value" id="totalApplications">142</span>
            <span class="metric-label">Total de Aplicações</span>
        </div>
    </div>
    
    <div class="metric-card">
        <div class="metric-icon">
            <i class="fas fa-clock"></i>
        </div>
        <div class="metric-details">
            <span class="metric-value" id="pendingApplications">28</span>
            <span class="metric-label">Pendentes</span>
        </div>
    </div>
    
    <div class="metric-card">
        <div class="metric-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="metric-details">
            <span class="metric-value" id="approvedApplications">98</span>
            <span class="metric-label">Aprovadas</span>
        </div>
    </div>
    
    <div class="metric-card">
        <div class="metric-icon">
            <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="metric-details">
            <span class="metric-value" id="totalVolume">$2.4M</span>
            <span class="metric-label">Volume Total</span>
        </div>
    </div>
</div>
```

**CSS:**
```css
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

.metric-card {
    background: var(--branco);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.metric-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--verde-vibrante), var(--verde-escuro));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.metric-icon i {
    font-size: 24px;
    color: var(--branco);
}

.metric-details {
    display: flex;
    flex-direction: column;
}

.metric-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--cinza-escuro);
    line-height: 1;
    margin-bottom: 4px;
}

.metric-label {
    font-size: 13px;
    font-weight: 400;
    color: #6c757d;
    line-height: 1.3;
}
```

---

### 3. Seção com Header (Padrão do Cliente)

**Referência:** dashboard-cliente.html linhas 129-132

```html
<section class="dashboard-section">
    <div class="section-header">
        <h2><i class="fas fa-users"></i> Clientes</h2>
        <button class="btn-add" id="addClientBtn">
            <i class="fas fa-plus"></i> Adicionar
        </button>
    </div>
    <div class="section-content">
        <!-- Conteúdo da seção -->
    </div>
</section>
```

**CSS:**
```css
.dashboard-section {
    background: var(--branco);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-bottom: 24px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f3f4;
}

.section-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--cinza-escuro);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.section-header h2 i {
    font-size: 18px;
    color: var(--verde-vibrante);
}

.btn-add {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--verde-vibrante);
    color: var(--branco);
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-add:hover {
    background: var(--verde-escuro);
    transform: translateY(-1px);
}
```

---

### 4. Tabelas de Dados

```html
<table class="data-table">
    <thead>
        <tr>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Data</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div class="table-user">
                    <img src="avatar.png" alt="Avatar" class="table-avatar">
                    <div class="table-user-info">
                        <span class="table-user-name">João Silva</span>
                        <span class="table-user-email">joao@email.com</span>
                    </div>
                </div>
            </td>
            <td><span class="table-amount">$25,000</span></td>
            <td>
                <span class="status-badge status-approved">Aprovado</span>
            </td>
            <td><span class="table-date">21/02/2026</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-icon-danger" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    </tbody>
</table>
```

**CSS:**
```css
.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.data-table thead tr {
    background: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
}

.data-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.data-table tbody tr {
    border-bottom: 1px solid #f1f3f4;
    transition: all 0.2s;
}

.data-table tbody tr:hover {
    background: #f8f9fa;
}

.data-table td {
    padding: 14px 16px;
    color: var(--cinza-escuro);
}

/* User cell */
.table-user {
    display: flex;
    align-items: center;
    gap: 10px;
}

.table-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #e9ecef;
}

.table-user-info {
    display: flex;
    flex-direction: column;
}

.table-user-name {
    font-weight: 500;
    color: var(--cinza-escuro);
    font-size: 14px;
}

.table-user-email {
    font-size: 12px;
    color: #6c757d;
}

/* Amount */
.table-amount {
    font-weight: 600;
    color: var(--verde-vibrante);
}

/* Date */
.table-date {
    font-size: 13px;
    color: #6c757d;
}

/* Actions */
.table-actions {
    display: flex;
    gap: 8px;
}

.btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    background: #f1f3f4;
    color: #6c757d;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-icon:hover {
    background: var(--verde-vibrante);
    color: var(--branco);
}

.btn-icon-danger:hover {
    background: var(--vermelho-erro);
    color: var(--branco);
}
```

---

### 5. Status Badges

```html
<span class="status-badge status-approved">Aprovado</span>
<span class="status-badge status-pending">Pendente</span>
<span class="status-badge status-rejected">Rejeitado</span>
<span class="status-badge status-processing">Processando</span>
```

**CSS:**
```css
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
}

.status-approved {
    background: rgba(39, 174, 96, 0.1);
    color: var(--verde-sucesso);
}

.status-pending {
    background: rgba(243, 156, 18, 0.1);
    color: var(--amarelo-aviso);
}

.status-rejected {
    background: rgba(231, 76, 60, 0.1);
    color: var(--vermelho-erro);
}

.status-processing {
    background: rgba(52, 152, 219, 0.1);
    color: var(--azul-claro);
}
```

---

### 6. Função Cards Horizontais (do dashboard-cliente.html)

**Referência:** client-functions.css completo

```html
<section class="client-functions-horizontal">
    <div class="functions-horizontal-grid">
        <div class="function-card-horizontal" onclick="openFunction('makePayments')">
            <div class="function-icon-horizontal">
                <i class="fas fa-credit-card"></i>
            </div>
            <div class="function-content-horizontal">
                <h4>Make Payments</h4>
                <small>Pay your monthly installments securely online</small>
            </div>
        </div>
        
        <div class="function-card-horizontal" onclick="openFunction('viewStatements')">
            <div class="function-icon-horizontal">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="function-content-horizontal">
                <h4>View Statements</h4>
                <small>Download and view your monthly statements</small>
            </div>
        </div>
        
        <!-- Mais 3 cards... -->
    </div>
</section>
```

**CSS:** Usar exatamente o `client-functions.css` existente (já está perfeito)

---

### 7. Modals

```html
<div id="modalExample" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Título do Modal</h3>
            <button class="modal-close" onclick="closeModal('modalExample')">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <!-- Conteúdo -->
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal('modalExample')">
                Cancelar
            </button>
            <button class="btn btn-primary" onclick="saveModal()">
                Salvar
            </button>
        </div>
    </div>
</div>
```

**CSS:**
```css
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: var(--branco);
    border-radius: 12px;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f3f4;
}

.modal-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--cinza-escuro);
    margin: 0;
}

.modal-close {
    width: 32px;
    height: 32px;
    border: none;
    background: #f1f3f4;
    color: #6c757d;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-close:hover {
    background: var(--vermelho-erro);
    color: var(--branco);
}

.modal-body {
    padding: 24px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #f1f3f4;
}
```

---

## 📐 SISTEMA DE GRID

### Grid de 4 Colunas (Métricas)
```css
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}
```

### Grid de 2 Colunas (Gráficos)
```css
.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
```

### Grid de 5 Colunas (Funções)
```css
.functions-horizontal-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
}
```

---

## ✨ ESTADOS E ANIMAÇÕES

### Hover States
```css
/* Botões */
.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Cards */
.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

/* Links */
a:hover {
    color: var(--verde-escuro);
}
```

### Transições
```css
:root {
    --transition-fast: 0.2s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
}

/* Aplicar em elementos interativos */
.btn, .card, a, .nav-item {
    transition: all var(--transition-fast);
}
```

---

## 📱 RESPONSIVIDADE

### Breakpoints
```css
/* Desktop padrão: > 1024px */
@media (max-width: 1024px) {
    /* Tablets */
    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .admin-sidebar {
        width: 180px;
    }
    
    .admin-main-content {
        margin-left: 180px;
    }
}

@media (max-width: 768px) {
    /* Mobile landscape */
    .metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .admin-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s;
    }
    
    .admin-sidebar.open {
        transform: translateX(0);
    }
    
    .admin-main-content {
        margin-left: 0;
    }
    
    .financing-details {
        flex-wrap: wrap;
        gap: 12px;
    }
}

@media (max-width: 480px) {
    /* Mobile portrait */
    .user-greeting {
        font-size: 20px;
    }
    
    .financing-value {
        font-size: 16px;
    }
    
    .metric-value {
        font-size: 20px;
    }
    
    .function-card-horizontal {
        flex-direction: row;
        text-align: left;
    }
}
```

---

## 📚 REFERÊNCIAS DE CÓDIGO

### Arquivos CSS a Utilizar (na ordem):
1. `css/style.css` - **Base principal** (cores, tipografia, reset)
2. `css/layout-adjustments.css` - Ajustes de layout
3. `css/perfect-alignment.css` - Alinhamento perfeito
4. `css/client-functions.css` - **Cards horizontais de funções**
5. `css/compact-layout.css` - Layout compacto

### Estrutura HTML Base Admin:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - FLEXCREDI</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="images/flexcredi-logo-official.png">
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/layout-adjustments.css">
    <link rel="stylesheet" href="css/perfect-alignment.css">
    <link rel="stylesheet" href="css/client-functions.css">
    <link rel="stylesheet" href="css/admin-dashboard.css">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="admin-page">
    <!-- Header Dashboard -->
    <header class="dashboard-header">
        <!-- Igual ao dashboard-cliente.html -->
    </header>
    
    <!-- Sidebar Admin -->
    <aside class="admin-sidebar">
        <!-- Navegação -->
    </aside>
    
    <!-- Main Content -->
    <main class="admin-main-content">
        <div class="container">
            <!-- Status Header -->
            <section class="status-header">
                <!-- Igual ao dashboard-cliente.html -->
            </section>
            
            <!-- Métricas -->
            <div class="metrics-grid">
                <!-- 4 cards de métricas -->
            </div>
            
            <!-- Seções -->
            <section class="dashboard-section">
                <!-- Conteúdo -->
            </section>
        </div>
    </main>
    
    <!-- JavaScript -->
    <script src="js/admin-dashboard.js"></script>
</body>
</html>
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

Ao criar uma nova página admin, verificar:

- [ ] ✅ Header igual ao `dashboard-cliente.html` (logo, user menu)
- [ ] ✅ Sidebar com navegação e item ativo destacado
- [ ] ✅ Main content com `margin-left: 240px`
- [ ] ✅ Usar `Poppins` como fonte (não Inter)
- [ ] ✅ Cores: `--verde-vibrante`, `--cinza-escuro`, etc.
- [ ] ✅ Cards com `border-radius: 12px` e `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`
- [ ] ✅ Botões primários verde (`--verde-vibrante`)
- [ ] ✅ Status badges com background transparente colorido
- [ ] ✅ Tabelas com hover `background: #f8f9fa`
- [ ] ✅ Modals centralizados com animação `modalSlideIn`
- [ ] ✅ Responsivo: breakpoints 1024px, 768px, 480px
- [ ] ✅ Font Awesome 6.4.0 para ícones
- [ ] ✅ Chart.js para gráficos (se necessário)

---

## 📌 NOTAS IMPORTANTES

1. **⚠️ FONTE:** Dashboard do cliente usa **Poppins**, não Inter! Atualizar planejamento anterior.

2. **📐 LAYOUT:** Cliente não tem sidebar. Admin precisa de sidebar fixa à esquerda (240px).

3. **🎨 CORES:** Manter 100% fidelidade à paleta existente. Verde vibrante (#2ECC71) é a cor primária.

4. **📱 MOBILE:** Sidebar deve recolher em telas < 768px com toggle button.

5. **🔄 REUTILIZAÇÃO:** Máxima reutilização de CSS existente. Criar apenas `admin-dashboard.css` para sidebar e ajustes específicos.

6. **📊 GRÁFICOS:** Usar Chart.js (já incluído no projeto). Configurar com cores do design system.

7. **🖼️ ÍCONES:** Font Awesome 6.4.0. Usar ícones sólidos (`fas`).

8. **🧩 COMPONENTES:** Seguir estrutura de cards do cliente (`dashboard-section`, `section-header`).

---

**Criado por:** FlexCredi Dev Team  
**Data:** 2026-02-21  
**Versão:** 1.0 FINAL  
**Próximo passo:** Implementar Sprint 1 seguindo este design system

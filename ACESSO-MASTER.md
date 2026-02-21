# 🔐 ACESSO MASTER - FLEXCREDI

## 🎯 **Como Testar o Dashboard do Cliente**

### 📋 **Credenciais Master**
```
📧 Email: master@flexcredi.com
🔑 Senha: flexmaster2024
```

### 🚀 **3 Formas de Acessar**

#### **1. 📱 Botão de Acesso Rápido (Recomendado)**
1. Vá para `login.html`
2. Clique no botão verde **"Acesso Master (Teste)"**
3. Login automático será realizado
4. Redirecionamento para dashboard

#### **2. 🔧 Login Manual**
1. Vá para `login.html`
2. Digite: `master@flexcredi.com`
3. Digite: `flexmaster2024`
4. Clique em "Sign In"

#### **3. 🔗 Link Direto**
- Acesse diretamente: `dashboard-cliente.html`
- *(Será redirecionado para login se não estiver logado)*

---

## 🏆 **Perfil Master - Dados Ricos**

### 👤 **Informações do Cliente**
- **Nome:** Carlos Eduardo Silva
- **Email:** master@flexcredi.com
- **Telefone:** (407) 555-0123
- **Endereço:** 1425 International Drive, Orlando, FL 32819
- **Score de Crédito:** 785 pontos
- **Crédito Disponível:** $75.000

### 💰 **Estatísticas Financeiras**
- **Total de Aplicações:** 8
- **Aplicações Aprovadas:** 7
- **Crédito Total Usado:** $125.000
- **Taxa Média:** 18.5%
- **Saldo Atual:** $35.000

### 📊 **4 Aplicações de Exemplo**
1. **$25.000** - Expansão do Restaurante Latino (Aprovada)
2. **$15.000** - Equipamentos de Cozinha (Aprovada)  
3. **$35.000** - Segunda Unidade (Em Processamento)
4. **$8.000** - Marketing e Publicidade (Aprovada)

### 📅 **Atividade Recente**
- Pagamento de $2.150 processado
- Nova aplicação de $35.000 submetida
- Score atualizado para 785 pontos
- Documento de renda aprovado

---

## 🎨 **Recursos do Dashboard**

### 📋 **Seções Funcionais**
- ✅ **Boas-vindas personalizadas**
- ✅ **Estatísticas em cards**
- ✅ **Lista de aplicações com status**
- ✅ **Timeline de atividade recente**
- ✅ **Gráfico de score de crédito**
- ✅ **Overview financeiro com Chart.js**
- ✅ **Menu do usuário com dropdown**

### 🎯 **Funcionalidades Testáveis**
- 📊 **Gráficos interativos** (Chart.js)
- 🔄 **Filtros de período** (30d, 90d, 1 ano)
- 📱 **Layout responsivo** (teste em mobile)
- 🎨 **Hover effects** nos cards
- 🚪 **Sistema de logout**
- 🔗 **Links para nova aplicação**

### 📱 **Responsive Design**
- **Desktop:** Grid completo de cards
- **Tablet:** Layout adaptado
- **Mobile:** Cards empilhados, menu colapsado

---

## 🧪 **Como Testar Funcionalidades**

### 1. **🔐 Autenticação**
```bash
1. Acesse login.html
2. Use botão "Acesso Master"
3. Verifique redirecionamento automático
4. Confirme dados carregados no dashboard
```

### 2. **📊 Dashboard**
```bash
1. Verifique nome "Carlos Eduardo Silva"
2. Confirme crédito de $75.000
3. Veja 4 aplicações listadas
4. Teste gráfico de score (785)
5. Interaja com filtros de período
```

### 3. **📱 Mobile**
```bash
1. Abra DevTools (F12)
2. Selecione modo mobile
3. Teste navegação responsiva
4. Verifique menu colapsado
```

### 4. **🚪 Logout**
```bash
1. Clique no dropdown do usuário
2. Selecione "Sair"
3. Confirme limpeza de dados
4. Verifique redirecionamento
```

---

## 🔧 **Dados Técnicos**

### 💾 **LocalStorage**
```javascript
// Dados salvos automaticamente:
flexcredi_user: {objeto com dados do usuário}
flexcredi_session: {sessão com expiração 24h}
```

### 📡 **API Integration**
```javascript
// Endpoints utilizados:
POST tables/loan_applications - Salvar aplicações
GET  tables/loan_applications - Carregar aplicações
```

### 🎨 **CSS Classes**
```css
.dashboard-page - Container principal
.dashboard-card - Cards do dashboard  
.stat-card - Cards de estatísticas
.activity-timeline - Timeline de atividades
```

---

## ⚡ **Acesso Rápido**

**🔗 Links Diretos:**
- Login: `login.html`
- Dashboard: `dashboard-cliente.html` 
- Home: `index.html`

**🎯 Credenciais:**
- Email: `master@flexcredi.com`
- Senha: `flexmaster2024`

**🚀 Teste Rápido:**
1. Clique aqui: `login.html`
2. Botão verde "Acesso Master"
3. Explore o dashboard!

---

*Dashboard completo com dados ricos pronto para teste! 🎉*
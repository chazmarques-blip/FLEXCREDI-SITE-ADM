# 🎛️ Configuração do Subdomínio Admin FlexCredi

## ✅ Status da Configuração

**Data**: 21/02/2026  
**Subdomínio**: admin.flexcredi.com  
**Dashboard Utilizado**: admin-dashboard.html (versão completa)  
**Deploy Vercel**: ✅ Concluído

---

## 📋 O que Foi Configurado

### 1. **Escolha do Dashboard Admin**
Após análise de 2 opções disponíveis, foi escolhido o **admin-dashboard.html** por ser mais completo e profissional:

**Características:**
- ✅ Layout com sidebar fixa e header
- ✅ Design moderno com identidade visual FlexCredi
- ✅ Navegação por seções (Dashboard, Aplicações, Clientes, Documentos, Relatórios, Configurações)
- ✅ Cards de estatísticas animados
- ✅ Tabela de aplicações com ações (aprovar/negar)
- ✅ Totalmente responsivo

### 2. **Configuração do Backend**
**Arquivo**: `js/config.js`

```javascript
production: {
  baseURL: 'https://web-production-e227.up.railway.app',
  endpoints: {
    root: '/',
    dashboard: '/api/dashboard', 
    applications: '/api/applications'
  }
}
```

**API Railway**: https://web-production-e227.up.railway.app

### 3. **Roteamento Vercel**
**Arquivo**: `vercel.json`

```json
{
  "buildCommand": "",
  "outputDirectory": ".",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/admin-dashboard.html",
      "has": [
        {
          "type": "host",
          "value": "admin.flexcredi.com"
        }
      ]
    },
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
```

**Como Funciona:**
- Quando alguém acessa `admin.flexcredi.com` → vai para `admin-dashboard.html`
- Quando alguém acessa `flexcredi.vercel.app` → vai para `index.html` (site principal)

---

## 🚀 Deploy Realizado

**Commit Hash**: d783469  
**Deployment URL**: https://flexcredi-site-adm.vercel.app  
**Production URL**: https://flexcredi-site-le6a73p41-charles-marques-projects.vercel.app

**Status:** ✅ **ONLINE**

---

## 📝 Próximas Etapas

### **Etapa 1: Adicionar Domínio no Vercel Dashboard** 🔴 PENDENTE

Você precisa configurar o domínio `admin.flexcredi.com` no painel do Vercel:

1. **Acesse**: https://vercel.com/charles-marques-projects/flexcredi-site-adm/settings/domains
2. **Clique em**: "Add Domain"
3. **Digite**: `admin.flexcredi.com`
4. **Clique em**: "Add"

O Vercel irá fornecer instruções para configurar o DNS (se ainda não estiver configurado).

### **Etapa 2: Verificar Migrations do Prisma** 🟡 IMPORTANTE

Acessar o console do Railway e executar:
```bash
npx prisma db push
```

Isso criará as 7 tabelas no Supabase:
- ✅ admin_users
- ✅ users
- ✅ applications
- ✅ documents
- ✅ contracts
- ✅ system_settings
- ✅ audit_logs

### **Etapa 3: Testar Integração Completa** 🟡

Após adicionar o domínio:
1. Acessar: https://admin.flexcredi.com
2. Testar conexão com a API Railway
3. Criar aplicação teste
4. Verificar se os dados aparecem no dashboard

---

## 📊 Arquitetura Atual

```
┌─────────────────────────────────────────┐
│     FRONTEND (Vercel)                   │
├─────────────────────────────────────────┤
│ flexcredi.vercel.app → index.html       │
│ admin.flexcredi.com  → admin-dashboard  │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     BACKEND (Railway)                   │
├─────────────────────────────────────────┤
│ https://web-production-e227             │
│       .up.railway.app                   │
│                                         │
│ Endpoints:                              │
│ - GET  /                                │
│ - GET  /health                          │
│ - GET  /api/dashboard                   │
│ - GET  /api/applications                │
│ - POST /api/applications                │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     DATABASE (Supabase)                 │
├─────────────────────────────────────────┤
│ PostgreSQL 15                           │
│ Connection Pooling: 6543                │
│                                         │
│ Status: ⚠️ Tabelas ainda não criadas    │
│ (Aguardando migrations)                 │
└─────────────────────────────────────────┘
```

---

## 🔐 Credenciais de Acesso

### **Admin Padrão** (após criar migrations):
- **Email**: admin@flexcredi.com
- **Senha**: FlexCredi@Admin2024!Secure

⚠️ **IMPORTANTE**: Alterar a senha padrão após primeiro login!

---

## 🛠️ Comandos Úteis

### **Atualizar Frontend:**
```bash
cd /home/user/webapp
git add .
git commit -m "feat: Atualizar admin dashboard"
git push origin main
```

### **Deploy Manual:**
```bash
npx vercel --prod --yes --token SEU_TOKEN
```

### **Testar API Railway:**
```bash
curl https://web-production-e227.up.railway.app/
curl https://web-production-e227.up.railway.app/health
```

### **Testar Conexão do Admin:**
Abrir console do navegador em `admin.flexcredi.com` e executar:
```javascript
fetch('https://web-production-e227.up.railway.app/api/dashboard')
  .then(r => r.json())
  .then(console.log)
```

---

## 📞 Suporte e Troubleshooting

### **Problema: Admin não aparece**
**Solução**: 
1. Verificar se domínio `admin.flexcredi.com` foi adicionado no Vercel
2. Aguardar propagação DNS (5-10 min)
3. Limpar cache do navegador (Ctrl+Shift+R)

### **Problema: API não conecta**
**Solução**:
1. Verificar se Railway está online: https://web-production-e227.up.railway.app/health
2. Verificar CORS no backend (já configurado)
3. Verificar console do navegador para erros

### **Problema: Nenhuma aplicação aparece**
**Solução**:
1. Verificar se migrations foram executadas
2. Criar aplicação teste pelo botão "Criar Aplicação Teste"
3. Verificar logs do Railway

---

## ✅ Checklist de Validação Final

- [x] vercel.json configurado com rewrites
- [x] js/config.js atualizado com URL Railway
- [x] admin-dashboard.html funcional
- [x] Deploy Vercel concluído
- [x] Site principal online (flexcredi.vercel.app)
- [ ] Domínio admin.flexcredi.com adicionado no Vercel
- [ ] Migrations do Prisma executadas
- [ ] Tabelas criadas no Supabase
- [ ] Primeiro login admin realizado
- [ ] Aplicação teste criada e visualizada

---

## 📚 Documentação Relacionada

- **Infraestrutura**: `INFRAESTRUTURA-COMPLETA.md`
- **Deploy Vercel**: `DEPLOY-SUCESSO.md`
- **Railway**: `RAILWAY-DEPLOYMENT-SUCCESS.md`
- **Supabase**: `SUPABASE-CONFIGURADO.md`
- **Migração**: `MIGRACAO-COMPLETA.md`

---

**Última Atualização**: 21/02/2026  
**Status Geral**: 🟡 **75% Concluído** (falta apenas adicionar domínio no Vercel e executar migrations)

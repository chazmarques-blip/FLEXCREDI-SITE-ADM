# 🚀 FLEXCREDI - Guia Completo de Deployment

**Railway (Backend) + Vercel (Frontend)**

---

## 📋 **Resumo do Que Foi Preparado**

✅ **Backend configurado** para deployment no Railway  
✅ **Frontend configurado** para deployment no Vercel  
✅ **API URLs dinâmicas** para desenvolvimento e produção  
✅ **CORS configurado** para múltiplos domínios  
✅ **Arquivos de configuração** prontos para deploy  

---

## 🎯 **PASSO A PASSO COMPLETO**

### **PARTE 1: Deploy do Backend (Railway)**

#### 1. **Preparar Repositório**
```bash
# No GitHub Codespaces ou terminal local
git add .
git commit -m "feat: configurações de deployment para Railway e Vercel"
git push origin main
```

#### 2. **Fazer Deploy no Railway**
1. **Acessar**: [railway.app](https://railway.app)
2. **Login** com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecionar** seu repositório FLEXCREDI
5. **Railway detectará** automaticamente:
   - ✅ `package.json` - Dependências Node.js
   - ✅ `railway.json` - Configurações de build
   - ✅ `Procfile` - Comando de inicialização

#### 3. **Configurar Variáveis de Ambiente**
Na dashboard do Railway, **Variables** tab:

```env
NODE_ENV=production
JWT_SECRET=SEU_JWT_SECRET_SUPER_SEGURO_AQUI_PRODUCTION
DEFAULT_ADMIN_EMAIL=admin@flexcredi.com
DEFAULT_ADMIN_PASSWORD=SUA_SENHA_SEGURA_AQUI
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
FRONTEND_URL=https://flexcredi.vercel.app
```

⚠️ **IMPORTANTE**: Altere `JWT_SECRET` e `DEFAULT_ADMIN_PASSWORD` para valores seguros!

#### 4. **Obter URL do Backend**
- Após deploy: `https://flexcredi-backend.up.railway.app`
- ✅ Anotar esta URL para configurar no frontend

---

### **PARTE 2: Deploy do Frontend (Vercel)**

#### 1. **Fazer Deploy no Vercel**
1. **Acessar**: [vercel.com](https://vercel.com)  
2. **Login** com GitHub
3. **New Project** → **Import Git Repository**
4. **Selecionar** seu repositório FLEXCREDI
5. **Configure projeto**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `echo "Static site - no build needed"`
   - **Output Directory**: `./` (raiz do projeto)

#### 2. **Configurar Domínio Personalizado (Opcional)**
- **Domains** tab na dashboard Vercel
- Adicionar: `flexcredi.com` ou seu domínio

#### 3. **Verificar URLs Finais**
- Frontend: `https://flexcredi.vercel.app`
- Backend: `https://flexcredi-backend.up.railway.app`

---

## 🔧 **Arquivos de Configuração Criados**

### **Backend (Railway)**
- ✅ `railway.json` - Configurações de deployment Railway
- ✅ `Procfile` - Comando de inicialização
- ✅ `.env.production` - Template de variáveis de produção
- ✅ `package.json` - Atualizado com engines Node.js
- ✅ `server.js` - CORS configurado para produção

### **Frontend (Vercel)**  
- ✅ `vercel.json` - Configurações de deployment Vercel
- ✅ `js/config.js` - API URLs dinâmicas (dev/prod)
- ✅ Arquivos HTML atualizados para usar configuração dinâmica

---

## 🌐 **Como Funciona a Configuração de APIs**

### **Desenvolvimento (Local)**
```javascript
// Automaticamente detectado quando localhost
baseURL: 'http://localhost:3001'
```

### **Produção (Deploy)**
```javascript  
// Automaticamente detectado quando NÃO localhost
baseURL: 'https://flexcredi-backend.up.railway.app'
```

### **Sistema de Detecção Automática**
```javascript
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';
```

---

## 🔍 **Testando Após Deployment**

### **1. Testar Backend (Railway)**
```bash
# Verificar se API está online
curl https://flexcredi-backend.up.railway.app/

# Testar endpoints
curl https://flexcredi-backend.up.railway.app/api/dashboard
curl https://flexcredi-backend.up.railway.app/api/applications
```

### **2. Testar Frontend (Vercel)**
1. **Acessar**: `https://flexcredi.vercel.app`
2. **Abrir DevTools** (F12) → Console
3. **Verificar**: URLs das APIs estão corretas
4. **Testar**: `test-connection.html` deve funcionar

### **3. Testar Integração Completa**
1. **Dashboard Admin**: `https://flexcredi.vercel.app/admin-dashboard.html`
2. **Verificar**: Dados carregando do backend Railway
3. **Testar**: Criação de novas aplicações

---

## 🛡️ **Segurança em Produção**

### **Variáveis Obrigatórias para Alterar**
```env
# ⚠️ ALTERAR IMEDIATAMENTE EM PRODUÇÃO!
JWT_SECRET=CRIAR_CHAVE_SEGURA_256_BITS
DEFAULT_ADMIN_PASSWORD=SENHA_FORTE_ADMIN
```

### **CORS Configurado**
- ✅ Domínios específicos permitidos
- ✅ Localhost permitido apenas em desenvolvimento  
- ✅ Credenciais seguras configuradas

### **Headers de Segurança**
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`  
- ✅ `X-XSS-Protection: 1; mode=block`

---

## 🚨 **Troubleshooting Comum**

### **Backend não conecta**
1. ✅ Verificar variáveis de ambiente no Railway
2. ✅ Verificar logs no Railway dashboard  
3. ✅ Confirmar URL correta do backend

### **Frontend não carrega dados**
1. ✅ Abrir DevTools → Network tab
2. ✅ Verificar requests para API  
3. ✅ Confirmar `js/config.js` sendo carregado

### **CORS Error**
1. ✅ Verificar `FRONTEND_URL` no Railway
2. ✅ Confirmar domínio Vercel correto
3. ✅ Revisar configuração CORS em `server.js`

---

## 📊 **URLs Finais do Sistema**

### **🏠 Frontend (Vercel)**
- **Site Principal**: `https://flexcredi.vercel.app`
- **Dashboard Cliente**: `https://flexcredi.vercel.app/dashboard-cliente.html`  
- **Admin Dashboard**: `https://flexcredi.vercel.app/admin-dashboard.html`
- **Teste Conexão**: `https://flexcredi.vercel.app/test-connection.html`

### **🔧 Backend (Railway)**  
- **API Base**: `https://flexcredi-backend.up.railway.app`
- **Dashboard Stats**: `https://flexcredi-backend.up.railway.app/api/dashboard`
- **Applications**: `https://flexcredi-backend.up.railway.app/api/applications`

---

## 🎯 **Próximos Passos Após Deployment**

### **1. Verificação Inicial**
- [ ] Testar todos os endpoints da API
- [ ] Verificar carregamento de dados no frontend  
- [ ] Confirmar funcionalidade completa do admin dashboard

### **2. Configurações de Segurança**
- [ ] Alterar `JWT_SECRET` para valor seguro
- [ ] Alterar `DEFAULT_ADMIN_PASSWORD` 
- [ ] Configurar backup de dados

### **3. Otimizações**
- [ ] Configurar CDN para assets estáticos
- [ ] Implementar cache de API  
- [ ] Adicionar monitoramento de performance

### **4. Funcionalidades Futuras**
- [ ] Banco de dados real (PostgreSQL no Railway)
- [ ] Sistema de autenticação JWT
- [ ] Assinatura eletrônica de contratos
- [ ] Sistema de pagamentos

---

**🎉 PARABÉNS!** Seu sistema FLEXCREDI estará online e funcional após seguir este guia!

---

**FLEXCREDI LLC** | 5200 Old Winter Garden Road, Orlando, FL 32811  
📞 (407) 555-0123 | ✉️ info@flexcredi.com | 🌐 www.flexcredi.com
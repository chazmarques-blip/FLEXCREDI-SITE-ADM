# ✅ FLEXCREDI - Checklist de Deployment

**Ordem de execução recomendada**

---

## 🔴 **PARTE 1: BACKEND (Railway) - FAZER PRIMEIRO**

### **Step 1: Preparar Código**
- [ ] Git commit e push das mudanças
- [ ] Verificar se todos os arquivos estão no repositório:
  - [ ] `railway.json`
  - [ ] `Procfile` 
  - [ ] `package.json` (com engines)
  - [ ] `server.js` (CORS atualizado)

### **Step 2: Deploy Railway**
- [ ] Fazer login em [railway.app](https://railway.app)
- [ ] New Project → Deploy from GitHub repo
- [ ] Selecionar repositório FLEXCREDI
- [ ] Aguardar build automático

### **Step 3: Configurar Variáveis**
```env
NODE_ENV=production
JWT_SECRET=SUA_CHAVE_SUPER_SEGURA_AQUI
DEFAULT_ADMIN_EMAIL=admin@flexcredi.com  
DEFAULT_ADMIN_PASSWORD=SUA_SENHA_FORTE_AQUI
FRONTEND_URL=https://flexcredi.vercel.app
```

### **Step 4: Anotar URL do Backend**
- [ ] Copiar URL: `https://flexcredi-backend.up.railway.app`
- [ ] Testar: `curl https://flexcredi-backend.up.railway.app/`

---

## 🔵 **PARTE 2: FRONTEND (Vercel) - FAZER DEPOIS**

### **Step 1: Deploy Vercel**
- [ ] Fazer login em [vercel.com](https://vercel.com)
- [ ] New Project → Import Git Repository  
- [ ] Selecionar repositório FLEXCREDI
- [ ] Configurar:
  - Framework Preset: **Other**
  - Root Directory: **.**
  - Build Command: **echo "Static site"**
  - Output Directory: **.**

### **Step 2: Verificar Configuração**
- [ ] URL Frontend: `https://flexcredi.vercel.app`  
- [ ] Abrir `js/config.js` e verificar URLs
- [ ] Testar `test-connection.html`

---

## 🟢 **PARTE 3: TESTE COMPLETO**

### **Verificações Finais**
- [ ] **Backend online**: `https://flexcredi-backend.up.railway.app/`
- [ ] **Frontend online**: `https://flexcredi.vercel.app/`  
- [ ] **API conectando**: Abrir admin-dashboard.html
- [ ] **Dados carregando**: Verificar estatísticas no dashboard
- [ ] **Responsivo**: Testar em mobile/tablet

### **URLs Para Testar**
- [ ] `https://flexcredi.vercel.app/` (landing page)
- [ ] `https://flexcredi.vercel.app/admin-dashboard.html` (admin)
- [ ] `https://flexcredi.vercel.app/dashboard-cliente.html` (cliente)  
- [ ] `https://flexcredi.vercel.app/test-connection.html` (teste API)

---

## 🔧 **TROUBLESHOOTING RÁPIDO**

### **Se Backend não funcionar:**
1. ✅ Verificar logs no Railway dashboard
2. ✅ Confirmar variáveis de ambiente  
3. ✅ Testar URL: `curl https://SEU-BACKEND.up.railway.app/`

### **Se Frontend não conectar:**
1. ✅ Abrir DevTools → Console → verificar erros
2. ✅ Verificar se `js/config.js` está carregando
3. ✅ Confirmar URLs da API nos logs do console

### **Se CORS Error:**
1. ✅ Verificar `FRONTEND_URL` no Railway
2. ✅ Confirmar domínio correto do Vercel
3. ✅ Revisar `allowedOrigins` no `server.js`

---

**🎯 TEMPO ESTIMADO:** 15-20 minutos total  
**🚀 RESULTADO:** Sistema FLEXCREDI online e funcional!

---

**Próximo passo**: Testar todas as funcionalidades e configurar domínio personalizado se necessário.
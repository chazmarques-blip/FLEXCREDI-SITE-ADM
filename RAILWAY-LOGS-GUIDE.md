# 📋 Guia: Como Ver Logs do Railway

## 🎯 Objetivo

Ver os erros **detalhados** que estão acontecendo no Railway e causando os erros 400 no Vercel Admin Dashboard.

---

## 🚀 Passo a Passo

### 1️⃣ Acesse o Railway Dashboard

**URL:** https://railway.app/

1. Faça login na sua conta
2. Clique no projeto **FLEXCREDI**
3. Clique no **serviço backend** (onde está rodando a API)

---

### 2️⃣ Abra a Aba "Deploy Logs"

Na página do serviço, você verá várias abas:
- Settings
- Variables
- **Deployments** ← **CLIQUE AQUI**
- Metrics
- Logs

1. Clique em **"Deployments"**
2. Clique no deploy mais recente (primeiro da lista)
3. Você verá os logs de **build** e **runtime**

---

### 3️⃣ Procure por Erros Específicos

Procure por estas mensagens nos logs:

```bash
# Erros de conexão com banco
❌ Can't reach database server
❌ Connection timeout
❌ Invalid connection string

# Erros de enum values
❌ Invalid value for argument 'in'
❌ Expected ReceivableStatus
❌ Expected AchPaymentStatus

# Erros do ApplicationsController
[ApplicationsController] Error listing applications:
[ApplicationsController] Error details:

# Erros do AdminRoutes
[AdminRoutes] Error fetching dashboard:
[AdminRoutes] Error details:
```

---

### 4️⃣ Ou Use "View Logs" (Logs em Tempo Real)

Alternativamente, você pode ver logs em **tempo real**:

1. No serviço backend, clique na aba **"View Logs"** (ícone 📄)
2. Os logs aparecerão em tempo real
3. Tente acessar os endpoints que estão falhando:
   - `curl https://web-production-e227.up.railway.app/api/applications`
   - `curl https://web-production-e227.up.railway.app/api/admin/dashboard`
4. Veja os erros aparecerem instantaneamente nos logs

---

## 📊 O Que Procurar

### ✅ Sinais de Conexão OK:

```
✅ Database connected
✅ Prisma Client initialized
✅ Found 13 tables
```

### ❌ Sinais de Problema:

```
❌ Can't reach database server at ...
❌ Invalid `prisma.application.findMany()` invocation
❌ Error code: P2021 (table missing)
❌ Error code: P2010 (raw query failed)
❌ Invalid value for argument 'in'
```

---

## 🔍 Comandos de Teste

Após ver os logs, teste estes endpoints:

```bash
# 1. Teste de conexão (deve funcionar)
curl https://web-production-e227.up.railway.app/api/debug/database-test | jq .

# 2. Partners (deve funcionar)
curl https://web-production-e227.up.railway.app/api/partners | jq .

# 3. Applications (está falhando - veja o erro nos logs)
curl https://web-production-e227.up.railway.app/api/applications | jq .

# 4. Admin Dashboard (está falhando - veja o erro nos logs)
curl https://web-production-e227.up.railway.app/api/admin/dashboard | jq .
```

---

## 📝 Informações para Compartilhar

Depois de ver os logs, me envie:

1. **Screenshot dos logs** mostrando o erro
2. **Mensagem de erro específica** (copie e cole)
3. **Qual endpoint está falhando** (applications, dashboard, etc.)
4. **Error code** se houver (ex: P2021, P2010, etc.)

---

## 🎯 Próximos Passos

Com as informações dos logs, poderei:

1. ✅ Identificar a causa raiz exata do problema
2. ✅ Corrigir o código específico que está falhando
3. ✅ Atualizar o schema Prisma se necessário
4. ✅ Corrigir os enum values se for o caso
5. ✅ Resolver o erro 400 no Vercel definitivamente

---

## 🚨 Problema Comum: Railway Não Está Deployando

Se o Railway não deployou após 5 minutos do push:

**Solução:**
1. No Railway Dashboard → Deployments
2. Clique em **"Redeploy"** manualmente
3. Aguarde o build terminar (~2-3 min)
4. Teste novamente

---

## ⏱️ Tempo Esperado

- **Ver logs:** Imediato
- **Identificar erro:** 1-2 minutos
- **Corrigir código:** 5-10 minutos  
- **Redeploy + teste:** 3-5 minutos

**Total:** ~10-15 minutos para resolução completa! 🎉


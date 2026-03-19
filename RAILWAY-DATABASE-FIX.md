# 🔧 Railway Database Connection Fix

## 🚨 Problema Atual

Railway **TEM** a variável `DATABASE_URL` configurada, mas **NÃO CONSEGUE** conectar ao Supabase:

```json
{
  "error": "Can't reach database server at db.oekfkdvrgyiklgkfqpbt.supabase.co:5432",
  "environment": {
    "databaseUrlConfigured": true,
    "databaseHost": "db.oekfkdvrgyiklgkfqpbt.supabase.co:5432"
  }
}
```

**Resultado:**
- ✅ API Railway está online (health check OK)
- ❌ Banco de dados inacessível
- ❌ Todos os endpoints retornam HTTP 500
- ❌ Admin dashboard mostra erro 400/500

---

## 🔍 Diagnóstico

### Status Atual
```bash
# Health check - OK
curl https://web-production-e227.up.railway.app/health
# → HTTP 200 ✅

# Database test - FALHA
curl https://web-production-e227.up.railway.app/api/debug/database-test
# → "Can't reach database server" ❌

# Partners API - FALHA
curl https://web-production-e227.up.railway.app/api/partners
# → HTTP 500 ❌

# Admin Dashboard - FALHA
curl https://web-production-e227.up.railway.app/api/admin/dashboard
# → HTTP 500 ❌
```

### Possíveis Causas

1. **Supabase Projeto Pausado**
   - Projetos Free pausam após 7 dias de inatividade
   - Solução: Reativar no dashboard Supabase

2. **Porta Incorreta**
   - Porta 5432 (direct) pode estar bloqueada
   - Solução: Usar porta 6543 (pooler)

3. **Firewall/IP Bloqueado**
   - Supabase pode bloquear IPs do Railway
   - Solução: Verificar settings de network no Supabase

4. **Credenciais Expiradas**
   - Senha pode ter sido resetada
   - Solução: Obter nova connection string do Supabase

---

## ✅ Soluções (Em Ordem de Prioridade)

### Solução 1: Verificar Status do Supabase (MAIS IMPORTANTE)

1. **Acesse o Dashboard do Supabase:**
   ```
   https://supabase.com/dashboard/project/oekfkdvrgyiklgkfqpbt
   ```

2. **Verifique o status do projeto:**
   - Se mostrar **"Paused"** → Clique em **"Restore"** ou **"Resume"**
   - Se mostrar **"Active"** → Continue para Solução 2

3. **Aguarde 1-2 minutos** para o banco reiniciar

4. **Teste novamente:**
   ```bash
   curl https://web-production-e227.up.railway.app/api/debug/database-test | jq .
   ```

---

### Solução 2: Obter Nova Connection String do Supabase

1. **No Dashboard Supabase**, vá em:
   ```
   Settings → Database → Connection String → URI
   ```

2. **Copie a connection string** que aparece (algo como):
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

3. **No Railway Dashboard**, edite a variável `DATABASE_URL`:
   - Cole a nova connection string
   - Clique em **"Save"**
   - Aguarde redeploy (~2 min)

4. **Teste novamente**

---

### Solução 3: Usar Supabase Pooler (Porta 6543)

Se a porta 5432 estiver bloqueada, use a porta 6543 do pooler:

**Tente uma destas URLs (no Railway):**

**Opção A (Pooler URL):**
```
DATABASE_URL=postgresql://postgres.oekfkdvrgyiklgkfqpbt:[SENHA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Opção B (Direct com Pooler):**
```
DATABASE_URL=postgresql://postgres:[SENHA]@db.oekfkdvrgyiklgkfqpbt.supabase.co:6543/postgres?pgbouncer=true
```

**Substitua `[SENHA]` por:** `*x!4QaAuPepA5%23B`

**Onde:**
- `%23` = `#` (URL encoded)
- `*x!4QaAuPepA5%23B` = `*x!4QaAuPepA5#B` (senha real)

---

### Solução 4: Verificar Configurações de Rede no Supabase

1. **No Dashboard Supabase**, vá em:
   ```
   Settings → Database → Connection Pooling
   ```

2. **Verifique se está habilitado:**
   - ✅ "Connection Pooling" deve estar **enabled**
   - ✅ "Port" deve mostrar **6543**

3. **Verifique "Allowed IP Addresses":**
   - Se tiver restrições, adicione o IP do Railway
   - Ou configure para aceitar **"All IPv4 addresses"** (0.0.0.0/0)

---

## 📝 Checklist de Resolução

- [ ] Verificar se Supabase está **Active** (não Paused)
- [ ] Obter connection string atualizada do Supabase Dashboard
- [ ] Testar com porta **6543** (pooler) em vez de **5432**
- [ ] Verificar se Railway tem acesso (firewall/IP whitelist)
- [ ] Confirmar que senha está corretamente URL-encoded
- [ ] Aguardar redeploy do Railway após mudanças
- [ ] Testar endpoint `/api/debug/database-test`
- [ ] Verificar se endpoints retornam HTTP 200

---

## 🧪 Como Testar

Após cada mudança, aguarde 2-3 minutos e execute:

```bash
# 1. Teste de conexão (deve retornar "connected": true)
curl https://web-production-e227.up.railway.app/api/debug/database-test | jq .

# 2. Teste de partners (deve retornar array vazio)
curl https://web-production-e227.up.railway.app/api/partners | jq .

# 3. Teste de admin dashboard (deve retornar stats com zeros)
curl https://web-production-e227.up.railway.app/api/admin/dashboard | jq .
```

**Resultado Esperado (Sucesso):**
```json
{
  "success": true,
  "database": {
    "connected": true,
    "tablesFound": 10,
    "tablesList": ["Partner", "Application", "User", ...]
  }
}
```

---

## 🔗 Links Úteis

- **Supabase Dashboard**: https://supabase.com/dashboard/project/oekfkdvrgyiklgkfqpbt
- **Railway Dashboard**: https://railway.app/project/[seu-projeto]
- **API Debug Endpoint**: https://web-production-e227.up.railway.app/api/debug/database-test
- **API Health Check**: https://web-production-e227.up.railway.app/health

---

## 🆘 Se Nada Funcionar

Como **alternativa temporária**, você pode usar o **banco local do Railway**:

1. No Railway Dashboard, clique em **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway criará um banco PostgreSQL interno
3. Railway adicionará automaticamente a variável `DATABASE_URL`
4. Aguarde deploy e teste

**Vantagens:**
- ✅ Conexão garantida (mesmo datacenter)
- ✅ Sem problemas de firewall
- ✅ Setup automático

**Desvantagens:**
- ❌ Custo adicional (~$5/mês)
- ❌ Dados separados do Supabase

---

**Última Atualização**: 2026-02-22 12:30 UTC  
**Status**: ❌ Railway não consegue conectar ao Supabase (porta 5432 bloqueada ou projeto pausado)  
**Próximo Passo**: Verificar status do Supabase e obter nova connection string

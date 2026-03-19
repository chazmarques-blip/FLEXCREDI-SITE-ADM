# 🔧 SUPABASE - OBTER CONNECTION POOLING URL

## ⚠️ PRECISAMOS DA CONNECTION POOLING URL

O Supabase tem duas URLs diferentes para conexão:

### **1. Direct Connection** (que você me enviou)
- Usada para aplicações no mesmo datacenter
- Pode ter restrições de firewall

### **2. Connection Pooling** (precisamos desta!)
- Funciona de qualquer lugar
- Mais rápida e eficiente
- Recomendada para uso em produção

---

## 📋 COMO OBTER A CONNECTION POOLING URL:

### **Passo 1: Acesse o Painel do Supabase**
```
1. Vá em: https://supabase.com/dashboard
2. Clique no seu projeto: flexcredi-database
```

### **Passo 2: Ir em Database Settings**
```
1. No menu lateral esquerdo, clique em: ⚙️ "Project Settings"
2. No submenu, clique em: "Database"
```

### **Passo 3: Encontrar Connection Pooling**
```
Role a página até encontrar a seção:

📊 Connection Pooling

Você verá:
- Mode: Transaction
- Connection string

Selecione o formato: "URI"
```

### **Passo 4: Copiar a URL**
```
A URL será algo como:

postgresql://postgres.oekfkdvrgyiklgkfqpbt:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

OU

postgresql://postgres:[YOUR-PASSWORD]@db.oekfkdvrgyiklgkfqpbt.supabase.co:6543/postgres?pgbouncer=true

⚠️ Note que a porta é 6543 (pooling) e não 5432 (direct)
```

---

## 📤 ME ENVIE A CONNECTION POOLING URL

Cole aqui a URL completa (com a senha já substituída)

**Exemplo:**
```
postgresql://postgres:*x!4QaAuPepA5#B@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 💡 ALTERNATIVA: IP WHITELISTING

Se você não encontrar a Connection Pooling URL, podemos:

1. **Desabilitar IP restrictions no Supabase**:
   ```
   Settings → Database → Network Restrictions
   Desmarcar "Enable IP address restrictions"
   ```

2. **OU usar a Direct Connection** com algumas modificações

---

## 🎯 AGUARDANDO

Me envie a CONNECTION POOLING URL e eu continuo a configuração! 🚀

---

**Onde encontrar:**
Supabase Dashboard → Project Settings → Database → Connection Pooling → URI

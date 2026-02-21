# 🚀 Como Rodar o Backend FLEXCREDI

## 📂 Estrutura do Projeto
```
flexcredi-admin/
├── backend/           ← PASTA DO BACKEND
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── prisma/
│       └── schema.prisma
├── admin-dashboard.html    ← FRONTEND
├── test-connection.html
└── index.html
```

## 🔄 Como Navegar Entre Pastas

### **1. Ir para a pasta do backend:**
```bash
cd backend
```

### **2. Voltar para a pasta principal:**
```bash
cd ..
```

### **3. Ver onde você está:**
```bash
pwd
```

---

## ⚡ Comandos para Rodar o Backend

### **PASSO 1: Entrar na pasta backend**
```bash
cd backend
```

### **PASSO 2: Instalar dependências**
```bash
npm install
```

### **PASSO 3: Configurar banco de dados**
```bash
npx prisma generate
npx prisma db push
```

### **PASSO 4: Iniciar servidor**
```bash
npm start
```

---

## 🎯 Sequência Completa de Comandos

```bash
# Navegar para o backend
cd backend

# Instalar tudo
npm install

# Configurar banco
npx prisma generate && npx prisma db push

# Rodar servidor
npm start
```

---

## ✅ Resultado Esperado

```
🚀 FLEXCREDI BACKEND INICIADO!
📍 URL: http://localhost:3001
🌍 Ambiente: development
⏰ Horário: [data atual]
```

## 🧪 Como Testar

1. **Backend rodando** → Voltar para pasta principal:
   ```bash
   cd ..
   ```

2. **Abrir no navegador:**
   - `test-connection.html` (testa APIs)
   - `admin-dashboard.html` (dashboard completo)

---

## 🛠️ Comandos Úteis

```bash
# Ver qual pasta estou
pwd

# Listar arquivos
ls -la

# Parar servidor
Ctrl + C

# Ver processos rodando
ps aux | grep node
```
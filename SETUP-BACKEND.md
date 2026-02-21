# 🚀 SETUP DO BACKEND FLEXCREDI

## 📋 Passo a Passo para Rodar o Backend

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Inicializar o Banco de Dados**
```bash
npx prisma generate
npx prisma db push
```

### 3. **Iniciar o Servidor**
```bash
npm start
```

### 4. **Verificar se Funcionou** ✅
Você deve ver esta mensagem:
```
🚀 FLEXCREDI BACKEND INICIADO!
📍 URL: http://localhost:3001
🌍 Ambiente: development
⏰ Horário: [data atual]
📊 Health Check: http://localhost:3001/health
🧪 Teste API: http://localhost:3001/api/test
```

### 5. **Testar o Sistema**
- Abrir: `test-connection.html`
- Verificar todos os testes verdes ✅
- Acessar: `admin-dashboard.html`

---

## 🛠️ Comandos Úteis

```bash
# Parar o servidor (se necessário)
Ctrl + C

# Reiniciar o servidor
npm start

# Ver logs detalhados
npm run dev

# Gerenciar banco de dados
npx prisma studio
```

---

## ⚠️ Possíveis Problemas e Soluções

### Erro: "Port 3001 already in use"
```bash
# Matar processos na porta
sudo lsof -ti:3001 | xargs kill -9

# Ou usar porta diferente no .env
PORT=3002
```

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Banco de dados não funciona
```bash
# Resetar o banco
rm -f prisma/dev.db
npx prisma db push
```

---

## 🎯 Próximos Passos Após Backend Funcionar

1. ✅ Testar conectividade com `test-connection.html`
2. ✅ Acessar dashboard administrativo
3. 🔄 Implementar autenticação
4. 🔄 Adicionar upload de documentos
5. 🔄 Integrar bureaus de crédito
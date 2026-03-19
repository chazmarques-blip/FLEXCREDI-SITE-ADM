# 📂 COMO LOCALIZAR ARQUIVOS NO GITHUB CODESPACES

## 🎯 LOCALIZAR test-connection.html

### **MÉTODO 1: Explorer (Painel Esquerdo)**
1. **Olhar no painel esquerdo** (Explorer de arquivos)
2. **Expandir a pasta principal** se necessário
3. **Procurar por:** `test-connection.html`
4. **Deve estar na RAIZ** do projeto (não dentro de pastas)

### **MÉTODO 2: Busca por Nome**
1. **Pressionar:** `Ctrl + P` (Windows/Linux) ou `Cmd + P` (Mac)
2. **Digitar:** `test-connection`
3. **Pressionar Enter** quando aparecer o arquivo

### **MÉTODO 3: Comando no Terminal**
```bash
# Ver todos os arquivos na pasta atual
ls -la | grep test-connection

# Ou simplesmente
ls test-connection.html
```

### **MÉTODO 4: Criar Atalho Direto**
No terminal, execute:
```bash
# Abrir o arquivo diretamente no VS Code
code test-connection.html
```

---

## 🗂️ ESTRUTURA DO PROJETO

```
flexcredi-admin/
├── test-connection.html     ← ESTÁ AQUI!
├── admin-dashboard.html
├── index.html
├── backend/
│   └── server.js
└── outras pastas...
```

---

## ⚡ AÇÃO RÁPIDA

**Execute no terminal:**
```bash
# Confirmar que está na pasta certa
pwd

# Listar arquivos com test
ls *test*

# Abrir arquivo
code test-connection.html
```
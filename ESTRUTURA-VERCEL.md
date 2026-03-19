# 📁 ESTRUTURA DO REPOSITÓRIO FLEXCREDI-SITE-ADM

## 🏗️ VISÃO GERAL DA ESTRUTURA

```
FLEXCREDI-SITE-ADM/
│
├── 📄 index.html                 ← SITE INSTITUCIONAL (HOME)
├── 📄 sobre.html                 ← PÁGINA "SOBRE NÓS"
├── 📄 servicos.html              ← PÁGINA "SERVIÇOS"
├── 📄 contato.html               ← PÁGINA "CONTATO"
├── 📄 faq.html                   ← PÁGINA "FAQ"
├── 📄 aplicacao.html             ← PÁGINA "APLICAÇÃO"
├── 📄 como-funciona.html         ← PÁGINA "COMO FUNCIONA"
│
├── 📁 css/                       ← ESTILOS DO SITE INSTITUCIONAL
│   ├── style.css
│   ├── layout-adjustments.css
│   └── carousel-fix.css
│
├── 📁 images/                    ← IMAGENS DO SITE INSTITUCIONAL
│   └── flexcredi-official-logo.png
│
├── 📁 js/                        ← SCRIPTS DO SITE INSTITUCIONAL
│
├── 📁 public/                    ← PASTA DO PAINEL ADMIN
│   │
│   ├── 📄 index.html             ← REDIRECIONA PARA /admin/
│   ├── 📄 apply.html             ← FORMULÁRIO DE APLICAÇÃO
│   │
│   ├── 📁 admin/                 ← 🔐 PAINEL ADMINISTRATIVO
│   │   ├── index.html            ← LOGIN ADMIN (tela verde)
│   │   ├── dashboard.html        ← DASHBOARD ADMIN
│   │   ├── admin-aplicacoes.html
│   │   ├── admin-clientes.html
│   │   ├── admin-contratos.html
│   │   ├── admin-documentos.html
│   │   ├── admin-parceiros.html
│   │   └── ...
│   │
│   ├── 📁 css/                   ← ESTILOS DO ADMIN
│   ├── 📁 js/                    ← SCRIPTS DO ADMIN
│   └── 📁 images/                ← IMAGENS DO ADMIN
│
├── 📁 backend/                   ← API BACKEND (Railway)
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── prisma/
│
└── 📄 vercel.json                ← CONFIGURAÇÃO DO VERCEL

```

---

## 🎯 CONFIGURAÇÃO CORRETA NO VERCEL

### **PROJETO 1: "flexcredi"**
- **Domínio:** www.flexcredi.com + flexcredi.com
- **Root Directory:** (VAZIO) ou `.` ou `/`
- **Serve:** Arquivos da RAIZ (index.html, sobre.html, etc.)
- **Resultado:** SITE INSTITUCIONAL

### **PROJETO 2: "flexcredi-site-adm"**
- **Domínio:** admin.flexcredi.com
- **Root Directory:** `public`
- **Serve:** Arquivos de /public/admin/ (login, dashboard, etc.)
- **Resultado:** PAINEL ADMIN

---

## 🔄 FLUXO DE NAVEGAÇÃO

### Site Institucional (www.flexcredi.com)
```
www.flexcredi.com
    ↓
index.html (HOME - Raiz do projeto)
    ↓
sobre.html, servicos.html, contato.html, etc.
```

### Painel Admin (admin.flexcredi.com)
```
admin.flexcredi.com
    ↓
public/index.html (redireciona)
    ↓
public/admin/index.html (LOGIN - tela verde)
    ↓
public/admin/dashboard.html (DASHBOARD)
```

---

## 🚨 PROBLEMA ATUAL

**O projeto "flexcredi" está mostrando o ADMIN ao invés do SITE INSTITUCIONAL**

### Causa:
O toggle **"Include files outside the root directory in the Build Step"** está ENABLED (azul)

### Solução:
1. Projeto "flexcredi" → Settings → General
2. Encontre o toggle **"Include files outside the root directory in the Build Step"**
3. **DESABILITE** (deixe cinza/Disabled)
4. Clique em **SAVE**
5. Aguarde o redeploy automático (1-2 minutos)

---

## ✅ RESULTADO ESPERADO

Após desabilitar o toggle:

| URL | Mostra | Status |
|-----|--------|--------|
| **www.flexcredi.com** | Site Institucional (HOME) | ✅ CORRETO |
| **admin.flexcredi.com** | Painel Admin (Login verde) | ✅ CORRETO |

---

## 📝 ARQUIVOS IMPORTANTES

### Site Institucional (Raiz)
- `/index.html` - Página inicial
- `/sobre.html` - Sobre nós
- `/servicos.html` - Serviços
- `/contato.html` - Contato
- `/faq.html` - FAQ
- `/css/style.css` - Estilos principais
- `/images/` - Imagens do site

### Painel Admin (public/admin/)
- `/public/admin/index.html` - Login (tela verde)
- `/public/admin/dashboard.html` - Dashboard
- `/public/admin/admin-aplicacoes.html` - Aplicações
- `/public/admin/admin-clientes.html` - Clientes
- `/public/js/auth.js` - Autenticação

---

## 🔗 LINKS ÚTEIS

- **Repositório:** https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Site Institucional:** https://www.flexcredi.com
- **Painel Admin:** https://admin.flexcredi.com
- **Backend API:** https://flexcredi-site-adm-production-b27d.up.railway.app

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Desabilitar o toggle "Include files outside..."
2. ✅ Verificar deploy automático
3. ✅ Testar www.flexcredi.com (deve mostrar HOME)
4. ✅ Testar admin.flexcredi.com (deve mostrar LOGIN)
5. 🔄 Configurar Supabase para login funcionar

---

**Criado em:** 2026-02-23  
**Última atualização:** Commit 15ab5ca

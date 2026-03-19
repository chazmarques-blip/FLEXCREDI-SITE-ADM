# 🚀 CONFIGURAÇÃO RÁPIDA - admin.flexcredi.com no Vercel

## ⚡ PROBLEMA
`admin.flexcredi.com` está mostrando a homepage pública em vez do painel admin.

## ✅ SOLUÇÃO SIMPLES (5 minutos)

### PASSO 1: Acesse o Dashboard do Vercel
1. Vá para: https://vercel.com/dashboard
2. Faça login
3. Encontre o projeto: **flexcredi-site-adm** (ou similar)
4. Clique para abrir

### PASSO 2: Verifique os Domínios
1. No menu lateral, clique em **"Settings"**
2. Clique na aba **"Domains"**
3. Você deve ver:
   - ✅ `flexcredi.com`
   - ✅ `admin.flexcredi.com`

### PASSO 3: Opção A - Criar Projeto Separado (RECOMENDADO)

**Essa é a melhor solução:**

1. **Volte para o Dashboard principal** (clique no logo Vercel)
2. **Clique em "Add New..." → "Project"**
3. **Selecione o MESMO repositório**: `FLEXCREDI-SITE-ADM`
4. **Configure:**
   - Project Name: `flexcredi-admin` (ou qualquer nome)
   - Root Directory: `admin-panel/admin` ⚠️ IMPORTANTE
   - Framework Preset: Other
   - Build Command: (deixe vazio)
   - Output Directory: `.`
   - Install Command: `echo "Static"`
5. **Clique em "Deploy"**
6. **Aguarde o deploy** (1-2 minutos)
7. **Adicione o domínio:**
   - No novo projeto, vá em Settings → Domains
   - Clique "Add Domain"
   - Digite: `admin.flexcredi.com`
   - Clique "Add"
8. **IMPORTANTE:** Remova `admin.flexcredi.com` do projeto principal
   - Volte para o projeto `flexcredi-site-adm`
   - Settings → Domains
   - Encontre `admin.flexcredi.com`
   - Clique em "Remove" (⚠️ se estiver lá)

**RESULTADO:**
- `flexcredi.com` → Projeto principal (homepage pública)
- `admin.flexcredi.com` → Projeto admin (painel administrativo)
- Cada um com seu próprio deploy

### PASSO 4: Opção B - Single Root Directory (ALTERNATIVA)

Se não quiser criar projeto separado:

1. No projeto `flexcredi-site-adm`
2. Settings → General
3. Procure por "Root Directory"
4. **NÃO MUDE** (deixe como está)
5. Volte para Settings → Domains
6. Encontre `admin.flexcredi.com`
7. **Infelizmente, não é possível configurar Root Directory por domínio no Vercel**
8. Por isso, a **Opção A é melhor**

### PASSO 5: Teste

Após configuração (aguarde 2-3 minutos para propagação):

1. **Teste flexcredi.com:**
   - Abra: https://flexcredi.com
   - Deve mostrar: Homepage pública

2. **Teste admin.flexcredi.com:**
   - Abra: https://admin.flexcredi.com
   - Deve mostrar: Painel admin (tela de login ou dashboard)

3. **Limpe o cache:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)
   - Ou use janela anônima

---

## 🎯 SOLUÇÃO TEMPORÁRIA (Enquanto não configura)

Use este link para acessar o admin:

```
https://admin.flexcredi.com/admin
```

Ou:

```
https://flexcredi.com/admin
```

Ambos devem funcionar e redirecionar para o painel admin.

---

## 📊 COMPARAÇÃO DAS OPÇÕES

| Aspecto | Opção A (Projeto Separado) | Opção B (Workaround) |
|---------|---------------------------|----------------------|
| Setup | 5-10 min | 0 min |
| Controle | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| URL Limpa | ✅ admin.flexcredi.com | ❌ admin.flexcredi.com/admin |
| Manutenção | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Deploys | Independentes | Único |

**RECOMENDAÇÃO:** Use Opção A (Projeto Separado)

---

## ❓ PERGUNTAS FREQUENTES

**Q: Por que não funciona automaticamente?**
A: O Vercel não suporta diferentes "Root Directories" para diferentes domínios no mesmo projeto.

**Q: Posso usar apenas vercel.json?**
A: Não para subdomínios. O vercel.json funciona para paths (/admin), não para hosts (admin.flexcredi.com).

**Q: Preciso mudar o DNS?**
A: Não, se admin.flexcredi.com já está apontando para Vercel. Apenas reorganize os projetos.

**Q: E se eu não quiser criar projeto separado?**
A: Use o path: `admin.flexcredi.com/admin` (funciona, mas URL não é ideal)

---

## 📞 PRECISA DE AJUDA?

Se encontrar algum problema:
1. Tire um screenshot da página Settings → Domains
2. Me mostre a configuração
3. Vou te ajudar a resolver

---

**TEMPO TOTAL: ~5-10 minutos**  
**DIFICULDADE: Fácil**  
**RESULTADO: admin.flexcredi.com funcionando perfeitamente**

# Configuração do Subdomínio admin.flexcredi.com no Vercel

## Problema Atual
O domínio `admin.flexcredi.com` está carregando `index.html` (homepage pública) e depois redirecionando via JavaScript para o painel admin. Isso não é ideal.

## Solução Ideal
Configurar o Vercel para que `admin.flexcredi.com` sirva **diretamente** os arquivos de `/admin-panel/admin/` sem redirecionamento.

---

## Opção 1: Configurar Root Directory (Recomendado)

### Passo a Passo:

1. **Acesse o Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Login com sua conta

2. **Selecione o Projeto**
   - Encontre: `FLEXCREDI-SITE-ADM` (ou nome do projeto)
   - Clique para abrir

3. **Vá para Settings → Domains**
   - Menu lateral → "Settings"
   - Aba "Domains"

4. **Adicione o Domínio admin.flexcredi.com** (se ainda não estiver)
   - Clique em "Add Domain"
   - Digite: `admin.flexcredi.com`
   - Clique "Add"

5. **Configure DNS** (se necessário)
   - Tipo: `CNAME`
   - Host/Nome: `admin`
   - Valor/Target: `cname.vercel-dns.com`
   - TTL: Automático (ou 3600)

6. **Configure Root Directory para admin.flexcredi.com**
   - Na lista de domínios, encontre `admin.flexcredi.com`
   - Clique em "Edit" ou ⚙️ (configurações)
   - Procure por "Root Directory" ou "Project Settings"
   - Configure: `admin-panel/admin`
   - Salve as alterações

### Resultado Esperado:
✅ `admin.flexcredi.com` → Serve diretamente `/admin-panel/admin/index.html`  
✅ `admin.flexcredi.com/dashboard.html` → Serve `/admin-panel/admin/dashboard.html`  
✅ Sem redirecionamentos JavaScript  
✅ Performance melhor  
✅ URLs limpas

---

## Opção 2: Criar Projeto Separado (Alternativa)

Se a Opção 1 não funcionar, crie um projeto separado:

### Passo a Passo:

1. **Criar Novo Projeto no Vercel**
   - Vercel Dashboard → "Add New..." → "Project"
   - Selecione o mesmo repositório: `FLEXCREDI-SITE-ADM`

2. **Configure o Root Directory**
   - Durante a criação, em "Root Directory"
   - Digite: `admin-panel/admin`
   - Isso faz o projeto usar apenas essa pasta

3. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: (deixe vazio)
   - Output Directory: `.`
   - Install Command: `echo "Static site"`

4. **Deploy o Projeto**
   - Clique "Deploy"
   - Aguarde o build completar

5. **Adicione o Domínio**
   - No novo projeto, vá em Settings → Domains
   - Adicione: `admin.flexcredi.com`
   - Configure o DNS (mesmo processo da Opção 1)

6. **Remova do Projeto Principal**
   - Volte para o projeto principal FLEXCREDI-SITE-ADM
   - Em Settings → Domains
   - Remova `admin.flexcredi.com` desse projeto
   - (Agora ele estará apenas no novo projeto admin)

### Resultado Esperado:
✅ Dois projetos separados no Vercel  
✅ `flexcredi.com` → Projeto principal (site público)  
✅ `admin.flexcredi.com` → Projeto admin (painel administrativo)  
✅ Total separação de builds e deployments  
✅ Mais controle e organização

---

## Opção 3: Manter Solução Atual (Temporária)

Se não for possível configurar o Vercel agora, a solução atual com JavaScript funciona:

### Como Funciona:
1. `admin.flexcredi.com` carrega `index.html`
2. JavaScript detecta o hostname
3. Redireciona para `/admin-panel/admin/index.html` com `window.location.replace()`
4. Não fica no histórico do navegador

### Prós:
✅ Funciona imediatamente  
✅ Não requer acesso ao dashboard  
✅ Redirect rápido (~200-300ms)

### Contras:
❌ Carrega index.html desnecessariamente  
❌ Pequeno delay de redirect  
❌ Não é a solução ideal de arquitetura

---

## Verificação Após Configuração

Depois de implementar a Opção 1 ou 2, teste:

1. **Teste o Domínio Admin:**
   ```
   curl -I https://admin.flexcredi.com
   ```
   - Deve retornar 200 (não 301/302)
   - Deve servir conteúdo do admin diretamente

2. **Teste no Browser:**
   - Abra: `admin.flexcredi.com`
   - Inspecione (F12) → Network
   - Verifique se carrega diretamente o admin (sem redirects)

3. **Verifique URLs:**
   - `admin.flexcredi.com` → Dashboard ou Login
   - `admin.flexcredi.com/dashboard.html` → Dashboard direto
   - `admin.flexcredi.com/login.html` → Login direto

---

## Notas Importantes

1. **Propagação DNS**: Pode levar até 48h (geralmente ~1h)
2. **Cache**: Limpe cache do browser após configuração
3. **HTTPS**: Vercel configura SSL automaticamente
4. **Wildcards**: Não use `*.flexcredi.com` - configure subdomínios específicos

---

## Suporte

Se tiver dúvidas sobre a configuração no Vercel:
- Documentação: https://vercel.com/docs/concepts/projects/domains
- Suporte: https://vercel.com/support

---

## Status Atual

- ✅ JavaScript redirect implementado (funcional mas não ideal)
- ⏳ Aguardando configuração no Vercel Dashboard
- 🎯 Objetivo: Root directory `admin-panel/admin` para `admin.flexcredi.com`

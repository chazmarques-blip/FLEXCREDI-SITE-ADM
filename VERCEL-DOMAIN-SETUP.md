# Configuração do Domínio admin.flexcredi.com no Vercel

## Problema Atual
O domínio `admin.flexcredi.com` está retornando 404 porque o Vercel não consegue encontrar os arquivos quando servidos através do subdomínio.

## Solução Ideal (Recomendada)

### Opção 1: Configurar Root Directory no Vercel Dashboard

1. **Acesse o Vercel Dashboard:**
   - Vá para https://vercel.com/dashboard
   - Selecione o projeto `FLEXCREDI-SITE-ADM`

2. **Configure o domínio:**
   - Vá em **Settings** → **Domains**
   - Encontre `admin.flexcredi.com`
   - Clique em **Edit** (três pontos)
   - Em **Git Branch**, selecione `main`
   - Em **Root Directory**, digite: `admin-panel/admin`
   - Clique em **Save**

3. **Teste:**
   - Aguarde 1-2 minutos para o deploy
   - Acesse https://admin.flexcredi.com
   - Deve carregar o admin diretamente

**✅ Vantagens:**
- Sem redirecionamentos
- Performance máxima
- URL limpa (admin.flexcredi.com)
- Configuração permanente

---

### Opção 2: Criar Projeto Separado no Vercel (Mais Organizado)

1. **Crie um novo projeto:**
   - No Vercel Dashboard, clique em **Add New** → **Project**
   - Selecione o mesmo repositório: `FLEXCREDI-SITE-ADM`
   - Em **Root Directory**, defina: `admin-panel/admin`
   - Clique em **Deploy**

2. **Adicione o domínio:**
   - No novo projeto, vá em **Settings** → **Domains**
   - Adicione: `admin.flexcredi.com`
   - O Vercel vai pedir para você atualizar o DNS (já está configurado)

3. **Remova do projeto principal:**
   - Volte ao projeto `FLEXCREDI-SITE-ADM` original
   - Vá em **Settings** → **Domains**
   - Remova `admin.flexcredi.com`

**✅ Vantagens:**
- Separação completa entre site e admin
- Deploys independentes
- Configuração mais limpa
- Fácil de gerenciar

---

## Solução Temporária (Atual)

Por enquanto, implementei um redirect no `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "destination": "https://flexcredi.com/admin/:path*",
      "has": [
        {
          "type": "host",
          "value": "admin.flexcredi.com"
        }
      ],
      "permanent": false
    }
  ]
}
```

**Como funciona:**
- `admin.flexcredi.com` → redireciona para → `flexcredi.com/admin`
- `admin.flexcredi.com/login.html` → redireciona para → `flexcredi.com/admin/login.html`

**⚠️ Desvantagens:**
- Redirecionamento visível na URL
- Não é a solução ideal
- Deve ser temporário

---

## URLs Funcionais Após Deploy

Independente da solução escolhida, as seguintes URLs devem funcionar:

✅ **Site Principal:**
- https://flexcredi.com → Homepage
- https://www.flexcredi.com → Homepage

✅ **Admin Panel:**
- https://admin.flexcredi.com → Admin (via redirect temporário ou direto após config)
- https://flexcredi.com/admin → Admin (sempre funciona)
- https://flexcredi.com/admin/login.html → Login
- https://flexcredi.com/admin/dashboard.html → Dashboard

---

## Recomendação

**Escolha a Opção 1** (Root Directory) se você quer:
- Solução rápida (5 minutos)
- Manter tudo em um projeto
- URL limpa

**Escolha a Opção 2** (Projeto Separado) se você quer:
- Melhor organização
- Deploys independentes
- Configuração profissional

---

## Precisa de Ajuda?

Se tiver dúvidas ou quiser que eu faça mais ajustes, me avise!

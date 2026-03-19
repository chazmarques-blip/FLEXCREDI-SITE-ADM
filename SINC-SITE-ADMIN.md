# 🔄 SINCRONIZAÇÃO SITE ↔️ ADMIN - FLEXCREDI

**Data:** 2026-02-23  
**Status:** 🔴 REGRA CRÍTICA ATIVA  
**Prioridade:** ALTA

---

## 🎯 REGRA FUNDAMENTAL

> **TODA alteração de dados no SITE INSTITUCIONAL deve ser EQUIVALENTE no PAINEL ADMIN**
> 
> **TODA alteração de dados no PAINEL ADMIN deve refletir no SITE INSTITUCIONAL**

Esta regra se aplica a:
- ✅ Produtos/Serviços
- ✅ Informações de contato
- ✅ Textos e descrições
- ✅ Valores, taxas, condições
- ✅ Imagens e banners
- ✅ Links e CTAs
- ✅ Qualquer dado exibido ao público

---

## 📁 ESTRUTURA ATUAL DO PROJETO

```
FLEXCREDI-SITE-ADM/
│
├── 🌐 SITE INSTITUCIONAL (www.flexcredi.com)
│   │
│   ├── index.html              ← Homepage
│   ├── sobre.html              ← Sobre nós
│   ├── servicos.html           ← Serviços oferecidos
│   ├── contato.html            ← Informações de contato
│   ├── faq.html                ← Perguntas frequentes
│   ├── como-funciona.html      ← Processo
│   ├── aplicacao.html          ← Formulário de aplicação
│   │
│   ├── css/                    ← Estilos
│   ├── js/                     ← Scripts
│   └── images/                 ← Imagens
│
└── 🔐 PAINEL ADMIN (admin.flexcredi.com)
    │
    └── admin-panel/admin/
        │
        ├── index.html                  ← Login
        ├── dashboard.html              ← Dashboard principal
        ├── admin-aplicacoes.html       ← Gestão de aplicações
        ├── admin-clientes.html         ← Gestão de clientes
        ├── admin-contratos.html        ← Gestão de contratos
        ├── admin-parceiros.html        ← Gestão de parceiros
        ├── admin-documentos.html       ← Gestão de documentos
        ├── admin-pagamentos.html       ← Gestão de pagamentos
        ├── admin-configuracoes.html    ← Configurações do sistema
        │
        ├── css/                        ← Estilos admin
        ├── js/                         ← Scripts admin
        └── images/                     ← Imagens admin
```

---

## 🔗 MAPEAMENTO: SITE ↔️ ADMIN

### 1️⃣ SERVIÇOS / PRODUTOS

| SITE | ADMIN | Sincronização |
|------|-------|---------------|
| `/servicos.html` | `/admin-panel/admin/admin-configuracoes.html` (Seção Serviços) | Manual |
| Tipos de crédito oferecidos | Catálogo de produtos | ⚠️ Criar |
| Descrições de serviços | Base de dados de produtos | ⚠️ Criar |
| Taxas e condições | Configurações de produtos | ⚠️ Criar |

**Status:** ⚠️ Não implementado - Criar sistema de gestão de serviços

---

### 2️⃣ INFORMAÇÕES DE CONTATO

| SITE | ADMIN | Sincronização |
|------|-------|---------------|
| `/contato.html` | `/admin-panel/admin/admin-configuracoes.html` | Manual |
| Endereço físico | Configurações da empresa | ⚠️ Verificar |
| Telefone | Configurações da empresa | ⚠️ Verificar |
| Email | Configurações da empresa | ⚠️ Verificar |
| Horário de atendimento | Configurações da empresa | ⚠️ Verificar |

**Status:** ⚠️ Verificar se existe seção de configurações

---

### 3️⃣ SOBRE A EMPRESA

| SITE | ADMIN | Sincronização |
|------|-------|---------------|
| `/sobre.html` | `/admin-panel/admin/admin-configuracoes.html` (Seção Sobre) | Manual |
| História da empresa | CMS ou configurações | ⚠️ Criar |
| Missão/Visão/Valores | CMS ou configurações | ⚠️ Criar |
| Equipe | Gestão de usuários/equipe | ⚠️ Criar |

**Status:** ⚠️ Não implementado - Criar CMS básico

---

### 4️⃣ FAQ (PERGUNTAS FREQUENTES)

| SITE | ADMIN | Sincronização |
|------|-------|---------------|
| `/faq.html` | `/admin-panel/admin/admin-configuracoes.html` (Seção FAQ) | Manual |
| Perguntas e respostas | Base de dados FAQ | ⚠️ Criar |
| Categorias de FAQ | Gestão de categorias | ⚠️ Criar |

**Status:** ⚠️ Não implementado - Criar sistema de FAQ dinâmico

---

### 5️⃣ APLICAÇÕES / FORMULÁRIOS

| SITE | ADMIN | Sincronização |
|------|-------|---------------|
| `/aplicacao.html` | `/admin-panel/admin/admin-aplicacoes.html` | ✅ API |
| Formulário de aplicação | Visualização de aplicações | ✅ Funcionando |
| Campos do formulário | Campos no admin | ⚠️ Verificar |

**Status:** ✅ Parcialmente implementado via API backend

---

### 6️⃣ PARCEIROS

| SITE | ADMIN | Sincronização |
|------|-------|---------------|
| `/index.html` (Seção Parceiros?) | `/admin-panel/admin/admin-parceiros.html` | ⚠️ API |
| Logos de parceiros | Cadastro de parceiros | ⚠️ Verificar |
| Links de parceiros | Gestão de parceiros | ⚠️ Verificar |

**Status:** ⚠️ Verificar se existe seção de parceiros no site

---

## 📋 CHECKLIST DE SINCRONIZAÇÃO

Ao fazer qualquer alteração de dados:

### ✅ ANTES DE ALTERAR:

- [ ] Identificar onde o dado aparece no SITE
- [ ] Identificar onde o dado aparece no ADMIN
- [ ] Verificar se existe no banco de dados (Supabase)
- [ ] Documentar o campo/valor atual

### ✅ DURANTE A ALTERAÇÃO:

- [ ] Alterar no arquivo do SITE
- [ ] Alterar no arquivo do ADMIN correspondente
- [ ] Se houver API/Banco: atualizar a fonte de dados
- [ ] Testar no SITE (www.flexcredi.com)
- [ ] Testar no ADMIN (admin.flexcredi.com)

### ✅ APÓS A ALTERAÇÃO:

- [ ] Fazer commit descritivo mencionando SITE + ADMIN
- [ ] Atualizar este documento se necessário
- [ ] Verificar deploy no Vercel
- [ ] Teste final em produção

---

## 🚨 EXEMPLOS DE SINCRONIZAÇÃO

### Exemplo 1: Alterar Telefone de Contato

```
1. SITE: Editar /contato.html
   - Linha XX: <a href="tel:+1234567890">(123) 456-7890</a>
   - Trocar para: <a href="tel:+1987654321">(198) 765-4321</a>

2. ADMIN: Editar /admin-panel/admin/admin-configuracoes.html
   - Seção "Informações de Contato"
   - Campo "Telefone": (198) 765-4321

3. BANCO (se existir): Atualizar tabela `company_settings`
   - UPDATE company_settings SET phone = '(198) 765-4321' WHERE id = 1;

4. COMMIT:
   git commit -m "update: Change contact phone in SITE and ADMIN to (198) 765-4321"
```

---

### Exemplo 2: Adicionar Novo Serviço

```
1. SITE: Editar /servicos.html
   - Adicionar seção com novo serviço
   - Título, descrição, ícone, CTA

2. ADMIN: Editar /admin-panel/admin/admin-configuracoes.html (ou criar página)
   - Adicionar novo serviço no catálogo
   - Mesmos dados: título, descrição, condições

3. BANCO (se existir): Inserir na tabela `services`
   - INSERT INTO services (name, description, ...) VALUES ('Novo Serviço', 'Descrição...', ...);

4. COMMIT:
   git commit -m "feat: Add new service 'Novo Serviço' to SITE and ADMIN"
```

---

## 🛠️ TAREFAS PENDENTES

### 🔴 Alta Prioridade

1. [ ] **Mapear TODOS os dados do site institucional**
   - Listar todos os textos, valores, informações exibidas
   - Identificar o que muda vs. o que é estático

2. [ ] **Mapear TODOS os dados do painel admin**
   - Verificar quais telas existem
   - Identificar quais dados são gerenciados

3. [ ] **Criar tabela de equivalência SITE ↔️ ADMIN**
   - Campo por campo
   - Arquivo por arquivo
   - Com status de sincronização

4. [ ] **Implementar sistema de configurações no ADMIN**
   - Telefone, email, endereço
   - Textos institucionais
   - Serviços e produtos

### 🟡 Média Prioridade

5. [ ] **Criar CMS básico para conteúdo institucional**
   - Sobre, FAQ, Como Funciona
   - Edição de textos via admin

6. [ ] **API para sincronização automática**
   - Endpoints para buscar dados
   - Atualização em tempo real

### 🟢 Baixa Prioridade

7. [ ] **Dashboard de sincronização**
   - Verificar inconsistências
   - Alertas de dados desatualizados

---

## 📝 LOG DE ALTERAÇÕES

| Data | Alteração | Arquivo(s) SITE | Arquivo(s) ADMIN | Commit | Status |
|------|-----------|-----------------|------------------|--------|--------|
| 2026-02-23 | Documento criado | - | - | - | ✅ |
| | | | | | |
| | | | | | |

---

## 🔗 ARQUIVOS RELACIONADOS

- `GUIA-COMPLETO-VERCEL.md` - Configuração de deploy
- `ESTRUTURA-VERCEL.md` - Estrutura do projeto
- `backend/STATUS.md` - Status do backend e banco de dados

---

## 📞 CONTATO TÉCNICO

**Repositório:** https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM  
**Vercel - Site:** https://vercel.com/dashboard (projeto "flexcredi")  
**Vercel - Admin:** https://vercel.com/dashboard (projeto "flexcredi-site-adm")  
**Backend API:** https://flexcredi-site-adm-production-b27d.up.railway.app

---

**Última atualização:** 2026-02-23 12:45 UTC  
**Responsável:** AI Assistant  
**Status:** 🔴 DOCUMENTO ATIVO - REGRA EM VIGOR

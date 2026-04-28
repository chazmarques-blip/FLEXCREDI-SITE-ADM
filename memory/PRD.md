# FlexCredi - PRD (Product Requirements Document)

## Informações do Projeto
- **Nome**: FlexCredi
- **Tipo**: Site de crédito + Admin Dashboard
- **Stack**: HTML/CSS/JS (Frontend) + Node.js/Express/Prisma (Backend) + PostgreSQL (Supabase)
- **Deploy**: Vercel (frontend) + Railway (backend)
- **Repositório**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- **Branch Ativo**: Nova-Emergent

---

## Status Atual (28/04/2026)

### ✅ FUNCIONALIDADES IMPLEMENTADAS

#### Backend (Railway)
1. **Autenticação de Clientes** (`/api/client/auth`)
   - Login com JWT token
   - Registro de novos clientes
   - Perfil do usuário autenticado

2. **Admin APIs** (`/api/admin`)
   - Dashboard com métricas reais
   - CRUD de clientes
   - CRUD de aplicações
   - Aprovar/Rejeitar aplicações
   - Gerenciamento de documentos

3. **APIs Públicas** (`/api/public`)
   - Submissão de aplicações
   - Listagem de parceiros

#### Frontend Admin Panel
1. **Dashboard** - Métricas em tempo real
2. **Clientes** - Lista, detalhes, ativar/desativar
3. **Aplicações** - Lista, detalhes, aprovar/rejeitar
4. **Visualização detalhada** de clientes e aplicações

#### Frontend Cliente
1. **Login/Registro** integrado com API real
2. **Dashboard do cliente** com dados reais
3. **ClientAPI Service** com fallback para demo mode

### 📁 Arquivos Criados/Modificados Nesta Sessão

**Backend:**
- `/app/backend/routes/admin.js` - Rotas admin completas
- `/app/backend/routes/client-auth.js` - Autenticação de clientes
- `/app/backend/routes/public.js` - APIs públicas corrigidas
- `/app/backend/server.js` - CORS e rotas configuradas
- `/app/backend/core/prisma.js` - Singleton Prisma otimizado

**Frontend Admin:**
- `/app/admin-panel/admin/admin-dashboard.html` - Dashboard com métricas
- `/app/admin-panel/admin/admin-cliente-detalhes.html` - Detalhes do cliente
- `/app/admin-panel/admin/admin-aplicacao-detalhes.html` - Detalhes da aplicação
- `/app/admin-panel/admin/admin-clientes.html` - Lista de clientes atualizada
- `/app/admin-panel/admin/admin-aplicacoes.html` - Lista de aplicações atualizada

**Frontend Cliente:**
- `/app/js/client-api.js` - Serviço de API do cliente
- `/app/login.html` - Login integrado com API

### ⏳ FUNCIONALIDADES PENDENTES

| # | Funcionalidade | Prioridade | Status |
|---|----------------|------------|--------|
| 1 | Upload de documentos para storage real | P1 | Código existe, precisa testar |
| 2 | Notificações por email | P2 | Não iniciado |
| 3 | Deploy produção (flexcredi.com) | P2 | Aguardando testes |
| 4 | Integração com análise de crédito | P3 | Não iniciado |

### 🔧 Configuração do Ambiente

**Railway:**
- Branch: `Nova-Emergent`
- DATABASE_URL: `postgresql://postgres.xxx:xxx@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true`

**Supabase:**
- Projeto: FLEXCREDI-SITE-ADM
- Connection pooler (IPv4): porta 6543

---

## O que foi Implementado (Histórico)

### 20/03/2026 - Migração do Sistema de Traduções para JSON

**Contexto**: O sistema de traduções estava inline no arquivo `main.js`, tornando-o muito grande e difícil de manter. O usuário solicitou a migração para arquivos JSON separados por idioma.

**Arquivos Criados**:
- `/app/locales/en.json` - 434 chaves de tradução em inglês
- `/app/locales/es.json` - 522 chaves de tradução em espanhol  
- `/app/locales/pt.json` - 522 chaves de tradução em português

**Arquivos Modificados**:
- `/app/js/main.js` - Novo sistema de carregamento dinâmico de traduções:
  - Função `loadTranslation(lang)` - Carrega JSON de um idioma específico
  - Função `loadAllTranslations()` - Carrega todos os idiomas
  - Sistema de cache para evitar recarregamento
  - Removido o grande objeto `translations` inline (~140KB)

**Benefícios**:
1. **Manutenção**: Mais fácil editar traduções em arquivos JSON separados
2. **Performance**: Possibilidade futura de carregar apenas o idioma necessário
3. **Organização**: Código JS mais limpo e focado na lógica
4. **Colaboração**: Tradutores podem editar JSONs sem conhecer JavaScript

**Verificação**:
- ✅ Traduções EN/ES/PT funcionando corretamente
- ✅ Troca de idioma instantânea
- ✅ Sistema de cache funcionando

---

### 20/03/2026 - Auditoria Completa de Traduções

**Contexto**: O usuário solicitou uma auditoria e correção completa de todas as traduções em todas as páginas do site para os três idiomas suportados: Inglês (EN), Espanhol (ES) e Português (PT).

**Arquivos Modificados**:
- `/app/sobre.html` - Adicionados `data-translate` em todas as seções:
  - Seção "Our Values" (Nossos Valores)
  - Seção "Our Story" (Nossa História)
  - Timeline (A Ideia, Desenvolvimento, Lançamento, Crescimento, Futuro)
  - Seção CTA
  - Footer completo
  
- `/app/servicos.html` - Adicionados `data-translate` em:
  - Hero section
  - Seção de introdução
  - Cards de produtos de crédito (Pessoal, Negócios, Consolidação de Dívidas)
  - Listas de características e tags
  
- `/app/como-funciona.html` - Adicionados `data-translate` em:
  - Hero section
  - Seção de processo de 4 passos
  - Listas de features de cada passo
  
- `/app/contato.html` - Adicionados `data-translate` em:
  - Hero section
  - Cards de contato (Telefone, WhatsApp, Email)
  - Horários de atendimento
  - Botões de ação

- `/app/js/main.js` - Adicionadas ~200+ novas chaves de tradução:
  - Traduções completas para EN, ES, PT
  - Seções: Our Values, Our Story, Timeline, Services, How It Works, Contact
  - Todas as listas de características e tags de serviços
  - Horários de atendimento e informações de contato

**Verificação**:
- ✅ sobre.html - Traduções funcionando em EN/ES/PT
- ✅ servicos.html - Traduções funcionando em EN/ES/PT
- ✅ como-funciona.html - Traduções funcionando em EN/ES/PT
- ✅ contato.html - Traduções funcionando em EN/ES/PT

---

### 19/03/2026 - Áreas de Upload Compactas com Câmera Direta no Mobile

**Contexto**: As áreas de upload de documentos (ID, Comprovante de Residência, Cartão de Débito) estavam muito grandes e no mobile não abriam a câmera diretamente.

**Arquivos Modificados**:
- `/app/index.html` - Atualizado inputs com `capture="environment"` e novos textos
- `/app/css/multi-step-form.css` - CSS compacto para áreas de upload mobile
- `/app/js/document-upload.js` - Detecção de mobile para configurar câmera automática
- `/app/js/main.js` - Traduções adicionadas para novos textos

**Solução Implementada**:
1. Reduzi significativamente o tamanho das áreas de upload
2. Adicionei `capture="environment"` nos inputs para abrir câmera traseira no mobile
3. Substituí ícone de nuvem por ícone de câmera (mais intuitivo para mobile)
4. Texto atualizado: "Tap to take photo" / "or choose from gallery"
5. Borda verde sólida para indicar área clicável
6. Traduções em EN/ES/PT

**Verificação**:
- ✅ Áreas de upload 50% menores
- ✅ Ícone de câmera verde em todas as áreas
- ✅ Atributo capture configurado para abrir câmera no mobile

---

### 19/03/2026 - Correção Global de Ícones FontAwesome

**Contexto**: Ícones FontAwesome estavam aparecendo como linhas horizontais (≡) ou quadrados em várias áreas do site (formulário multi-step, seções de benefícios, área de upload, botões).

**Causa Raiz**: A regra CSS `* { font-family: 'Inter' !important; }` estava sobrescrevendo a font-family do FontAwesome em todos os elementos, incluindo os ícones `<i>`.

**Arquivos Modificados**:
- `/app/css/desktop-clean.css` - Correção global para ícones FontAwesome
- `/app/css/mobile-first.css` - Correção para garantir funcionamento em dispositivos móveis

**Solução Implementada**:
1. Modificado o seletor global para excluir elementos `<i>` e classes FontAwesome:
   ```css
   *:not(i):not([class*="fa-"]):not(.fas):not(.far):not(.fab) {...}
   ```
2. Adicionado reset global para todos os ícones FontAwesome com:
   - font-family correta do FontAwesome
   - font-weight apropriado (900 para solid, 400 para regular/brands)
   - display: inline-block
3. Adicionado CSS específico para ícones em contextos específicos (botões, labels, headers, formulários)
4. Adicionado mapeamento de content para ícones comuns (::before)

**Verificação**:
- ✅ Mobile: Todos os ícones do formulário funcionando (Steps 1-4)
- ✅ Desktop: Todos os ícones funcionando (barra de progresso, benefícios, calculadora)
- ✅ Área de upload: ícones de nuvem, câmera, documento OK
- ✅ Botões de navegação: setas e ícones OK

---

### 19/03/2026 - Correção de Ícones na Seção Success Stories

**Contexto**: Os ícones de estrela (rating) na seção "Florida Success Stories" não estavam sendo exibidos corretamente na versão desktop.

**Arquivos Modificados**:
- `/app/css/desktop-clean.css` - Adicionado CSS específico para garantir exibição das estrelas de rating

**Problema Identificado**:
- As estrelas FontAwesome (fa-star) nos cards de depoimentos estavam sendo afetadas por regras CSS que escondiam ícones em outras áreas do layout

**Solução Implementada**:
- CSS específico para `.story-rating i.fa-star` com:
  - `display: inline-block !important`
  - Font-family explícita do FontAwesome
  - Cor amarela (#f59e0b) para as estrelas
  - Remoção de estilos conflitantes (background, border, width/height fixos)

**Verificação**:
- ✅ Testado via screenshot - estrelas agora aparecem corretamente em todos os 5 cards de depoimentos
- ✅ Tradução do banner hero funciona corretamente em todos os 3 idiomas (EN/ES/PT)

---

### 19/03/2026 - Otimização Mobile-First

**Contexto**: O usuário indicou que 99% do uso do site é mobile, então todas as otimizações foram focadas em dispositivos móveis.

**Arquivos Criados/Modificados**:
- `/app/css/mobile-first.css` - CSS principal de otimização mobile
- `/app/index.html` - Adicionado link para novo CSS + script de textos mobile

**Principais Mudanças**:

| Elemento | Antes | Depois |
|----------|-------|--------|
| Header altura | 105px | 52px |
| Logo altura | 80px | 36px |
| Touch targets | 24-35px | 44-48px (padrão Apple/Google) |
| Input altura | ~35px | 48px |
| Progress circles | 24px | 36px |
| Language buttons | 28px | 44px |
| Botão Next | 30px | 48px |
| Font labels | 9-12px | 11-14px |
| Margins/gaps | 1-4px | 12-16px |

**Problemas Corrigidos**:
1. ✅ Título do formulário cortado - agora quebra em linhas
2. ✅ Progress bar ilegível - círculos e labels maiores
3. ✅ Inputs muito pequenos - 48px altura
4. ✅ Touch targets inadequados - todos com mínimo 44px
5. ✅ Espaçamentos apertados - aumentados para 12-16px
6. ✅ Header ocupando muito espaço - reduzido para 52px
7. ✅ Botões de idioma pequenos - agora 44x44px

---

## Personas de Usuário

1. **Solicitante de Crédito** (99% mobile)
   - Usa principalmente smartphone
   - Precisa preencher formulário de aplicação
   - Busca crédito para negócio ou pessoal

2. **Administrador** (Dashboard)
   - Gerencia aplicações de crédito
   - Aprova/rejeita solicitações
   - Visualiza relatórios

---

## Requisitos Principais

- [x] Site institucional responsivo
- [x] Formulário multi-step de aplicação
- [x] Dashboard administrativo
- [x] Sistema de autenticação
- [x] Suporte multi-idiomas (EN/ES/PT)
- [x] Calculadora de empréstimo
- [ ] Upload de documentos (parcial)
- [ ] Integração com análise de crédito

---

## Backlog Priorizado

### P0 (Crítico)
- ~~Correção de ícones/estrelas na seção Success Stories~~ ✅ CONCLUÍDO
- ~~Otimização mobile-first~~ ✅ CONCLUÍDO
- ~~Auditoria completa de traduções~~ ✅ CONCLUÍDO (20/03/2026)
- ~~Migração para arquivos JSON~~ ✅ CONCLUÍDO (20/03/2026)
- ~~Página Serviços - Card único $10.000~~ ✅ CONCLUÍDO (20/03/2026)
- ~~Página Como Funciona - 4 passos compactos~~ ✅ CONCLUÍDO (20/03/2026)
- ~~Verificação de traduções em todas as páginas~~ ✅ CONCLUÍDO (20/03/2026)

### P1 (Alta Prioridade)
- **Ajustes no dashboard admin** (próxima fase - usuário solicitou)
- Melhorias no fluxo de upload de documentos
- Testes de usabilidade mobile

### P2 (Média Prioridade)
- Melhorias de SEO
- Otimização de performance (lazy loading imagens)
- Testes A/B no formulário

### P3 (Baixa Prioridade)
- Animações e micro-interações
- Dark mode
- PWA support

---

## Implementações Recentes

### 21/03/2026 - Integração com API Real (Em Progresso)

**Contexto**: O usuário solicitou migrar o sistema de localStorage para a API real no Railway. A infraestrutura está pronta: Vercel (frontend), Railway (backend Node.js), Supabase (PostgreSQL).

**Backend URL**: `https://flexcredi-site-adm-production-b27d.up.railway.app`

**Arquivos Criados/Modificados**:

1. **Backend Routes Atualizadas**:
   - `/app/backend/routes/admin.js` - Adicionadas rotas:
     - `GET /api/admin/clients` - Lista clientes com filtros
     - `GET /api/admin/clients/:id` - Detalhes do cliente
     - `GET /api/admin/applications` - Lista aplicações (admin view)
   
   - `/app/backend/server.js` - CORS atualizado para aceitar:
     - `*.preview.emergentagent.com` (preview Emergent)
     - Todas as origins anteriores mantidas

2. **Frontend Client API**:
   - `/app/js/client-api.js` - Novo serviço de API para clientes:
     - Login/Registro com fallback para demo mode
     - Submissão de aplicações
     - Upload de documentos
     - Verificação de status

3. **Admin Panel Atualizado**:
   - `/app/admin-panel/js/api-config.js` - URL do Railway configurada
   - `/app/admin-panel/admin/admin-clientes.html` - Usa API real com fallback
   - `/app/admin-panel/admin/admin-aplicacoes.html` - Usa API real com fallback

4. **Login do Cliente**:
   - `/app/login.html` - Integrado com ClientAPI (real API + fallback demo)

**Status dos Endpoints**:
| Endpoint | Status | Notas |
|----------|--------|-------|
| GET /api/partners | ✅ Funcionando | 1 partner de teste |
| GET /api/applications | ✅ Funcionando | 0 registros |
| GET /api/admin/dashboard | ✅ Funcionando | Stats OK |
| GET /api/admin/clients | ⏳ Aguardando deploy | Rota adicionada ao código |
| GET /api/admin/applications | ⏳ Aguardando deploy | Rota adicionada ao código |

**Próximo Passo**: Deploy no Railway para ativar as novas rotas e CORS atualizado.

**Verificação**:
- ✅ Login.html carrega ClientAPI corretamente
- ✅ Demo login funciona (Maria Santos)
- ✅ Dashboard do cliente renderiza dados do localStorage (demo mode)
- ⏳ Aguardando deploy Railway para testar API real

---

### 21/03/2026 - Admin Panel: Visualização de Clientes

**Contexto**: O usuário solicitou criar uma aplicação completa de demonstração e visualizar os dados tanto no dashboard do cliente quanto no painel admin.

**Arquivos Modificados**:
- `/app/js/admin-clientes.js` - Script para ler e renderizar clientes do localStorage
- `/app/admin-clientes.html` - Removida linha de exemplo estática, tabela 100% dinâmica
- `/app/login.html` - Botões de acesso rápido para criar usuários demo (Maria Santos, João Ferreira)

**Funcionalidades Implementadas**:
1. **Botões de Acesso Rápido** no login:
   - "Maria Santos" - Cria aplicação com status "Em Análise"
   - "João Pedro Ferreira" - Cria aplicação com status "Pré-Aprovado"
   
2. **Admin Panel Dinâmico**:
   - Contadores automáticos (Total, Ativos, Novos no mês)
   - Tabela de clientes com avatar, SSN, telefone, score, status
   - Filtros por nome/email/CPF
   - Ordenação por data ou nome
   - Botões de ação (Ver perfil, Editar, Desativar)
   - Modal completo de perfil do cliente com todos os dados

**Verificação**:
- ✅ Maria Santos aparece no admin com status "Em Análise" (785 score)
- ✅ João Pedro Ferreira aparece com status "Pré-Aprovado" (720 score)
- ✅ Contadores atualizados automaticamente (TOTAL: 2, ATIVOS: 2)
- ✅ Modal de visualização de perfil funcionando

---

## Próximas Tarefas

### Aguardando Deploy Railway (P0):
1. Deploy das alterações no Railway para ativar:
   - CORS para `*.preview.emergentagent.com`
   - Rota `/api/admin/clients`
   - Rota `/api/admin/applications`

### Após Deploy (P0):
2. Validar admin panel com dados reais do Supabase
3. Migrar dashboard do cliente para usar API real

### Backend (P1):
4. Criar rota `/api/auth/client/login` para autenticação de clientes
5. Criar rota `/api/auth/client/register` para registro de clientes
6. Implementar upload de documentos para storage real

### Frontend (P1):
7. Atualizar `dashboard-cliente.html` para buscar dados da API
8. Implementar refresh automático de status da aplicação

### Melhorias (P2):
9. Otimização de performance (imagens, lazy loading)
10. SEO improvements
11. Dark mode
12. PWA support

---

## Notas Técnicas

- CSS mobile-first usa variáveis CSS para consistência
- Touch targets seguem guidelines Apple (44px) e Google Material (48px)
- Viewport testado: 393x852 (iPhone 14 Pro)
- Funcionalidade preservada - apenas layout foi ajustado
- **MODO HÍBRIDO**: Sistema agora tenta API real primeiro, com fallback para localStorage (demo mode)
- **Backend**: Node.js/Express + Prisma ORM no Railway
- **Database**: PostgreSQL no Supabase
- **Frontend**: HTML/CSS/JS estático no Vercel

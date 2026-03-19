# Sistema de Autenticação Admin - FLEXCREDI

## 📋 Visão Geral

Sistema completo de autenticação JWT para o painel administrativo do FLEXCREDI, com design moderno usando as cores e identidade visual da marca.

## 🎨 Design

### Cores Principais
- **Verde Principal**: `#2ECC71` (botões, links, destaques)
- **Verde Escuro**: `#27AE60` (hover states)
- **Gradiente de Fundo**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Cinza Texto**: `#2C3E50`
- **Vermelho Erro**: `#E74C3C`
- **Verde Sucesso**: `#2ECC71`

### Componentes Visuais
- Logo circular centralizado no topo do formulário
- Campos de entrada com ícones Font Awesome
- Botão toggle para mostrar/ocultar senha
- Alertas animados para erros e sucessos
- Efeitos de hover e focus suaves
- Design 100% responsivo (mobile-first)

## 📁 Estrutura de Arquivos

### Frontend
```
public/
├── admin/
│   ├── login.html          # Página de login completa
│   ├── index.html          # Dashboard admin (protegido)
│   └── admin-*.html        # Outras páginas admin (todas protegidas)
└── js/
    └── auth.js             # Sistema de autenticação JavaScript
```

### Backend
```
backend/
├── routes/
│   └── auth.js             # Rotas de autenticação (login, verify, logout)
├── scripts/
│   └── create-admin.js     # Script para criar usuário admin
└── server.js               # Servidor principal (registra rotas)
```

## 🔐 Fluxo de Autenticação

### 1. Login
1. Usuário acessa `/admin/login.html`
2. Se já estiver autenticado, redireciona para `/admin/index.html`
3. Preenche email e senha
4. Sistema valida inputs (formato de email, campos obrigatórios)
5. Envia POST para `/api/admin/login`
6. Backend:
   - Busca usuário no banco de dados
   - Verifica se está ativo
   - Verifica se tem role ADMIN ou SUPER_ADMIN
   - Compara senha com bcrypt
   - Atualiza lastLoginAt
   - Gera token JWT (válido por 24h)
7. Frontend:
   - Salva token e dados do usuário no localStorage
   - Redireciona para dashboard

### 2. Proteção de Rotas
1. Todas as páginas admin (exceto login) carregam `auth.js`
2. O script verifica automaticamente:
   - Se existe token no localStorage
   - Se o token é válido (chama `/api/admin/verify`)
3. Se não autenticado ou token inválido:
   - Remove dados do localStorage
   - Redireciona para `/admin/login.html`
4. Se autenticado:
   - Atualiza nome e avatar do usuário no header
   - Carrega dados da página

### 3. Logout
1. Usuário clica no botão "Sair"
2. Sistema mostra confirmação
3. Remove token e dados do localStorage
4. Redireciona para `/admin/login.html`

## 🔌 Endpoints da API

### POST `/api/admin/login`
Autentica um usuário admin.

**Request:**
```json
{
  "email": "admin@flexcredi.com",
  "password": "FlexCredi2024!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@flexcredi.com",
    "name": "Administrator",
    "role": "ADMIN",
    "lastLoginAt": "2026-02-22T20:00:00.000Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### GET `/api/admin/verify`
Verifica se o token JWT é válido.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@flexcredi.com",
    "name": "Administrator",
    "role": "ADMIN",
    "active": true,
    "lastLoginAt": "2026-02-22T20:00:00.000Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### POST `/api/admin/logout`
Endpoint de logout (principalmente para logging).

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🛠️ Classe AuthManager (JavaScript)

### Métodos Principais

#### `login(email, password, rememberMe)`
Realiza o login do usuário.

```javascript
const result = await authManager.login('admin@flexcredi.com', 'senha123', true);
if (result.success) {
    console.log('Login bem-sucedido!', result.user);
}
```

#### `logout()`
Realiza o logout do usuário.

```javascript
authManager.logout(); // Redireciona para login
```

#### `isAuthenticated()`
Verifica se o usuário está autenticado.

```javascript
if (authManager.isAuthenticated()) {
    console.log('Usuário autenticado');
}
```

#### `validateToken()`
Valida o token JWT no servidor.

```javascript
const isValid = await authManager.validateToken();
if (!isValid) {
    console.log('Token inválido, redirecionando...');
}
```

#### `protectPage()`
Protege uma página admin (usa internamente validateToken).

```javascript
await authManager.protectPage(); // Redireciona se não autenticado
```

#### `fetchWithAuth(url, options)`
Faz requisições autenticadas à API.

```javascript
const response = await authManager.fetchWithAuth('/api/admin/dashboard');
const data = await response.json();
```

## 💾 localStorage

### Estrutura de Dados
```javascript
{
  "admin_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin_user": "{\"id\":\"uuid\",\"email\":\"admin@flexcredi.com\",\"name\":\"Administrator\",\"role\":\"ADMIN\"}",
  "admin_remember": "true" // opcional
}
```

## 🔒 Segurança

### Medidas Implementadas
1. **Hashing de Senhas**: Bcrypt com 12 rounds
2. **JWT**: Tokens com expiração de 24 horas
3. **HTTPS Only**: Produção usa HTTPS exclusivamente
4. **Rate Limiting**: 500 requisições por 15 minutos por IP
5. **CORS**: Origens permitidas configuradas
6. **Helmet**: Headers de segurança HTTP
7. **Input Validation**: Validação de email e campos obrigatórios
8. **Role-Based Access**: Apenas ADMIN e SUPER_ADMIN podem acessar
9. **Token Validation**: Verificação automática em cada página
10. **Logout Automático**: Em caso de token inválido ou expirado

### Configurações de Segurança
```javascript
// JWT Secret (backend)
JWT_SECRET=flexcredi_jwt_secret_muito_seguro_2024

// JWT Expiration
JWT_EXPIRES_IN=24h

// Bcrypt Rounds
BCRYPT_ROUNDS=12
```

## 🚀 Como Criar Usuário Admin

### 1. Via Script (Recomendado)
```bash
cd backend
node scripts/create-admin.js
```

O script cria um usuário com as credenciais padrão do `.env`:
- **Email**: `admin@flexcredi.com`
- **Senha**: `FlexCredi2024!`
- **Nome**: Administrator
- **Role**: ADMIN

### 2. Via Prisma Studio (Manual)
```bash
cd backend
npx prisma studio
```

1. Abra a tabela `users`
2. Crie novo registro:
   - email: `admin@flexcredi.com`
   - password: (hash bcrypt da senha)
   - name: `Administrator`
   - role: `ADMIN`
   - active: `true`
   - emailVerified: `true`

### 3. Gerar Hash de Senha (Node.js)
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('suaSenha', 12);
console.log(hash);
```

## 📱 Funcionalidades da Página de Login

### Campos
- **Email**: Validação de formato
- **Senha**: Campo com toggle de visibilidade
- **Lembrar-me**: Checkbox para manter sessão

### Validações Frontend
- Email obrigatório e formato válido
- Senha obrigatória
- Mensagens de erro amigáveis

### Estados Visuais
- **Loading**: Botão desabilitado com spinner
- **Erro**: Alert vermelho com ícone
- **Sucesso**: Alert verde com ícone
- **Focus**: Campos destacados com borda verde

### Atalhos de Teclado
- **Enter no email**: Foca no campo senha
- **Enter na senha**: Submete o formulário

## 🔄 Atualização Automática do Header

Quando o usuário faz login, o sistema automaticamente:

1. **Atualiza o nome**: 
   ```javascript
   userName.textContent = user.name || 'Admin';
   ```

2. **Atualiza o avatar**:
   ```javascript
   userAvatar.src = `https://ui-avatars.com/api/?name=${user.name}&background=2ECC71&color=fff`;
   ```

3. **Atualiza a saudação**:
   ```javascript
   // "Bom dia, João!" / "Boa tarde, João!" / "Boa noite, João!"
   userGreeting.textContent = `${greeting}, ${user.name}!`;
   ```

## 🧪 Testes

### Teste Manual

1. **Login com credenciais válidas**:
   - Email: `admin@flexcredi.com`
   - Senha: `FlexCredi2024!`
   - ✅ Deve redirecionar para dashboard

2. **Login com credenciais inválidas**:
   - Email: `invalido@email.com`
   - Senha: `senhaerrada`
   - ❌ Deve mostrar erro "Invalid email or password"

3. **Login com usuário não-admin**:
   - Email de cliente
   - Senha correta
   - ❌ Deve mostrar erro "Access denied. Admin privileges required."

4. **Acesso a página protegida sem login**:
   - Abrir `/admin/index.html` sem estar logado
   - ❌ Deve redirecionar para `/admin/login.html`

5. **Logout**:
   - Clicar em "Sair"
   - ✅ Deve confirmar e redirecionar para login

## 🐛 Troubleshooting

### Problema: "Can't reach database server"
**Solução**: Verificar se o Supabase está acessível e se a DATABASE_URL no `.env` está correta.

### Problema: "Invalid or expired token"
**Solução**: Token expirou após 24h. Fazer logout e login novamente.

### Problema: Redirecionamento infinito
**Solução**: Limpar localStorage do navegador (`localStorage.clear()`).

### Problema: CORS Error
**Solução**: Adicionar a origem no array `allowedOrigins` em `server.js`.

### Problema: "Module not found: bcrypt"
**Solução**: Instalar dependências com `npm install bcrypt jsonwebtoken`.

## 📦 Dependências

### Frontend
- Font Awesome 6.4.0 (ícones)
- Google Fonts (Poppins)

### Backend
- `bcrypt` ^5.1.1 (hashing de senhas)
- `jsonwebtoken` ^9.0.2 (JWT)
- `express` ^4.18.2 (servidor)
- `@prisma/client` ^5.6.0 (banco de dados)
- `cors` ^2.8.5 (CORS)
- `helmet` ^7.1.0 (segurança)

## 🌐 URLs de Produção

- **Frontend**: https://flexcredi-dashboard.vercel.app/admin/login.html
- **Backend API**: https://flexcredi-site-adm-production-b27d.up.railway.app/api/admin/login
- **Repositório**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM

## 📝 Próximos Passos

1. ✅ Implementar "Esqueceu a senha?" com envio de email
2. ✅ Adicionar autenticação de dois fatores (2FA)
3. ✅ Implementar histórico de logins
4. ✅ Adicionar sessões simultâneas (múltiplos dispositivos)
5. ✅ Criar página de perfil do admin
6. ✅ Implementar troca de senha
7. ✅ Adicionar logs de auditoria de autenticação
8. ✅ Implementar refresh tokens para renovação automática

## 📄 Licença

Proprietary - FLEXCREDI LLC © 2026

---

**Desenvolvido com ❤️ pela equipe FLEXCREDI**

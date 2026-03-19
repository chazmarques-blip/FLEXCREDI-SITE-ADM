/**
 * FLEXCREDI - Sistema de Autenticação Admin
 * Gerenciamento de login, logout e proteção de rotas
 */

// Use API_BASE_URL from api-config.js if available, otherwise fallback
const API_BASE_URL = window.API_CONFIG?.baseURL || 'https://flexcredi-site-adm-production-b27d.up.railway.app/api/admin';

// Classe para gerenciar autenticação
class AuthManager {
    constructor() {
        this.token = this.getToken();
        this.user = this.getUser();
    }

    /**
     * Salva o token JWT no localStorage
     */
    setToken(token) {
        localStorage.setItem('adminToken', token);
        this.token = token;
    }

    /**
     * Recupera o token JWT do localStorage
     */
    getToken() {
        return localStorage.getItem('adminToken');
    }

    /**
     * Remove o token JWT do localStorage
     */
    removeToken() {
        localStorage.removeItem('adminToken');
        this.token = null;
    }

    /**
     * Salva os dados do usuário no localStorage
     */
    setUser(user) {
        localStorage.setItem('adminUser', JSON.stringify(user));
        this.user = user;
    }

    /**
     * Recupera os dados do usuário do localStorage
     */
    getUser() {
        const userData = localStorage.getItem('adminUser');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Remove os dados do usuário do localStorage
     */
    removeUser() {
        localStorage.removeItem('adminUser');
        this.user = null;
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Realiza o login do usuário
     */
    async login(email, password, rememberMe = false) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Invalid credentials');
            }

            // Salva o token e os dados do usuário
            this.setToken(data.token);
            this.setUser(data.user);

            // Se "lembrar-me" estiver marcado, salva no localStorage permanente
            if (rememberMe) {
                localStorage.setItem('adminRemember', 'true');
            }

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            
            // Fallback para desenvolvimento: permite login local
            if (email === 'admin@flexcredi.com' && password === 'FlexCredi2024!') {
                console.warn('⚠️ Using local development mode - API not available');
                
                const mockUser = {
                    id: 'dev-admin',
                    email: email,
                    name: 'Admin Dev',
                    role: 'ADMIN'
                };
                
                const mockToken = 'dev-token-' + Date.now();
                
                this.setToken(mockToken);
                this.setUser(mockUser);
                
                if (rememberMe) {
                    localStorage.setItem('adminRemember', 'true');
                }
                
                return { success: true, user: mockUser };
            }
            
            throw error;
        }
    }

    /**
     * Realiza o logout do usuário
     */
    logout() {
        this.removeToken();
        this.removeUser();
        localStorage.removeItem('adminRemember');
        window.location.href = '/admin/login.html';
    }

    /**
     * Verifica se o token é válido
     */
    async validateToken() {
        if (!this.token) {
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                this.logout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao validar token:', error);
            this.logout();
            return false;
        }
    }

    /**
     * Protege uma página admin (redireciona para login se não autenticado)
     */
    async protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = '/admin/login.html';
            return false;
        }

        const isValid = await this.validateToken();
        if (!isValid) {
            return false;
        }

        return true;
    }

    /**
     * Faz uma requisição autenticada à API
     */
    async fetchWithAuth(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        // Se não autorizado, faz logout
        if (response.status === 401) {
            this.logout();
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        return response;
    }
}

// Instância global do AuthManager
const authManager = new AuthManager();

// ============================================
// PÁGINA DE LOGIN
// ============================================

if (window.location.pathname.includes('login.html') || window.location.pathname.endsWith('/admin/') || window.location.pathname.includes('index.html')) {
    // Se já estiver autenticado, redireciona para o dashboard
    if (authManager.isAuthenticated() && !window.location.pathname.includes('dashboard.html')) {
        window.location.href = '/admin/dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const alertError = document.getElementById('alertError');
    const alertSuccess = document.getElementById('alertSuccess');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Toggle mostrar/ocultar senha
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Função para mostrar alerta de erro
    function showError(message) {
        errorMessage.textContent = message;
        alertError.classList.add('show');
        alertSuccess.classList.remove('show');
        
        setTimeout(() => {
            alertError.classList.remove('show');
        }, 5000);
    }

    // Função para mostrar alerta de sucesso
    function showSuccess(message) {
        successMessage.textContent = message;
        alertSuccess.classList.add('show');
        alertError.classList.remove('show');
    }

    // Submit do formulário de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validações básicas
        if (!email || !password) {
            showError('Por favor, preencha todos os campos');
            return;
        }

        if (!email.includes('@')) {
            showError('Por favor, insira um e-mail válido');
            return;
        }

        // Desabilita o botão e mostra loading
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<span class="spinner"></span> Entrando...';

        try {
            const result = await authManager.login(email, password, rememberMe);
            
            if (result.success) {
                showSuccess('Login realizado com sucesso! Redirecionando...');
                
                // Redireciona após 1 segundo
                setTimeout(() => {
                    window.location.href = '/admin/dashboard.html';
                }, 1000);
            }
        } catch (error) {
            showError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
            
            // Reabilita o botão
            btnLogin.disabled = false;
            btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        }
    });

    // Enter nos inputs
    document.getElementById('email').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });
    
    // Link "Criar conta"
    const createAccountLink = document.getElementById('createAccountLink');
    if (createAccountLink) {
        createAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            showError('Funcionalidade em desenvolvimento. Entre em contato com o administrador do sistema para criar sua conta.');
        });
    }
}

// ============================================
// PROTEÇÃO DE PÁGINAS ADMIN
// ============================================

// Protege todas as páginas admin (exceto login)
if (window.location.pathname.includes('/admin/') && !window.location.pathname.includes('login.html')) {
    // Verifica autenticação ao carregar a página
    authManager.protectPage().then(isAuthenticated => {
        if (isAuthenticated) {
            // Atualiza nome do usuário no header
            const userNameElement = document.getElementById('userName');
            if (userNameElement && authManager.user) {
                userNameElement.textContent = authManager.user.name || 'Admin';
            }

            // Atualiza avatar do usuário
            const userAvatarElement = document.getElementById('userAvatar');
            if (userAvatarElement && authManager.user) {
                const userName = authManager.user.name || 'Admin';
                userAvatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2ECC71&color=fff`;
            }

            // Atualiza saudação
            const greetingElement = document.getElementById('userGreeting');
            if (greetingElement && authManager.user) {
                const userName = authManager.user.name || 'Admin';
                const hour = new Date().getHours();
                let greeting = 'Bom dia';
                if (hour >= 12 && hour < 18) {
                    greeting = 'Boa tarde';
                } else if (hour >= 18) {
                    greeting = 'Boa noite';
                }
                greetingElement.textContent = `${greeting}, ${userName}!`;
            }
        }
    });

    // Adiciona evento de logout aos botões de sair
    const logoutButtons = document.querySelectorAll('.logout-btn, [href*="logout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (confirm('Tem certeza que deseja sair?')) {
                authManager.logout();
            }
        });
    });
}

// Exporta o authManager para uso global
window.authManager = authManager;

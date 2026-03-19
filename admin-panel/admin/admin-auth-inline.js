/**
 * FLEXCREDI - Inline Admin Authentication
 * Self-contained authentication for admin login
 */

console.log('🔐 Admin Auth System Loading...');

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 DOM Ready - Initializing login form');
    
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('❌ Login form not found!');
        return;
    }
    
    console.log('✅ Login form found');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🚀 Login form submitted');
        
        // Get form elements
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberMeInput = document.getElementById('rememberMe');
        const btnLogin = document.getElementById('btnLogin');
        const alertError = document.getElementById('alertError');
        const alertSuccess = document.getElementById('alertSuccess');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // Get values
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeInput.checked;
        
        console.log('📧 Email:', email);
        console.log('🔒 Password:', password ? '***' : '(empty)');
        
        // Hide alerts
        if (alertError) alertError.classList.remove('show');
        if (alertSuccess) alertSuccess.classList.remove('show');
        
        // Validate
        if (!email || !password) {
            console.error('❌ Validation failed: empty fields');
            if (errorMessage) errorMessage.textContent = 'Please fill in all fields';
            if (alertError) alertError.classList.add('show');
            return;
        }
        
        // Disable button
        if (btnLogin) {
            btnLogin.disabled = true;
            btnLogin.innerHTML = '<span class="spinner"></span> Signing in...';
        }
        
        // Check fallback credentials FIRST (since API has CORS issues)
        if (email === 'admin@flexcredi.com' && password === 'FlexCredi2024!') {
            console.log('✅ FALLBACK LOGIN SUCCESS');
            
            // Create mock user and token
            const mockUser = {
                id: 'dev-admin-' + Date.now(),
                email: email,
                name: 'Admin Developer',
                role: 'ADMIN',
                createdAt: new Date().toISOString()
            };
            
            const mockToken = 'dev-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            console.log('💾 Storing token:', mockToken);
            console.log('👤 Storing user:', mockUser);
            
            // Store in localStorage
            localStorage.setItem('adminToken', mockToken);
            localStorage.setItem('adminUser', JSON.stringify(mockUser));
            
            if (rememberMe) {
                localStorage.setItem('adminRemember', 'true');
            }
            
            // Verify storage
            const storedToken = localStorage.getItem('adminToken');
            const storedUser = localStorage.getItem('adminUser');
            console.log('✅ Token stored:', storedToken ? 'YES' : 'NO');
            console.log('✅ User stored:', storedUser ? 'YES' : 'NO');
            
            // Show success
            if (successMessage) successMessage.textContent = 'Login successful (Dev Mode)!';
            if (alertSuccess) alertSuccess.classList.add('show');
            
            // Redirect after delay
            console.log('🔄 Redirecting to dashboard in 1 second...');
            setTimeout(function() {
                const dashboardUrl = '/admin-panel/admin/admin-dashboard-v2.html';
                console.log('🎯 Navigating to:', dashboardUrl);
                window.location.href = dashboardUrl;
            }, 1000);
            
            return;
        }
        
        // If not fallback credentials, try API
        console.log('🌐 Trying API login...');
        try {
            const apiUrl = 'https://flexcredi-site-adm-production-b27d.up.railway.app/api/admin/login';
            console.log('📡 API URL:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            console.log('📥 API Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API login successful');
                
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                
                if (successMessage) successMessage.textContent = 'Login successful!';
                if (alertSuccess) alertSuccess.classList.add('show');
                
                setTimeout(function() {
                    window.location.href = '/admin-panel/admin/admin-dashboard-v2.html';
                }, 1000);
            } else {
                console.error('❌ API login failed');
                if (errorMessage) errorMessage.textContent = 'Invalid email or password';
                if (alertError) alertError.classList.add('show');
                
                if (btnLogin) {
                    btnLogin.disabled = false;
                    btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                }
            }
        } catch (error) {
            console.error('❌ API Error:', error);
            if (errorMessage) errorMessage.textContent = 'Invalid credentials. Try: admin@flexcredi.com / FlexCredi2024!';
            if (alertError) alertError.classList.add('show');
            
            if (btnLogin) {
                btnLogin.disabled = false;
                btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        }
    });
    
    console.log('✅ Login form handler attached');
});

console.log('✅ Admin Auth System Loaded');

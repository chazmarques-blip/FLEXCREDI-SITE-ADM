/**
 * FLEXCREDI - Cross-Domain Data Synchronization
 * Syncs test data between flexcredi.com and admin.flexcredi.com
 */

(function() {
    'use strict';
    
    // Configuration
    const MAIN_DOMAIN = 'https://flexcredi.com';
    const ADMIN_DOMAIN = 'https://admin.flexcredi.com';
    const SYNC_KEY = 'flexcredi_cross_domain_sync';
    const SYNC_TIMEOUT = 5000; // 5 seconds
    
    // Keys to sync
    const KEYS_TO_SYNC = [
        'flexcredi_user',
        'flexcredi_test_clients',
        'flexcredi_test_applications',
        'flexcredi_session'
    ];
    
    /**
     * Initialize cross-domain sync
     */
    function initCrossDomainSync() {
        console.log('🔄 Initializing cross-domain sync...');
        
        // Check if we're on admin domain
        const isAdmin = window.location.hostname === 'admin.flexcredi.com' || 
                       window.location.hostname.includes('admin');
        
        if (isAdmin) {
            console.log('📥 Admin domain detected, checking for test data...');
            checkAndLoadTestData();
        }
        
        // Add sync button for manual sync
        addSyncButton();
        
        // Listen for storage events from other tabs
        window.addEventListener('storage', handleStorageEvent);
    }
    
    /**
     * Check URL parameters for sync data
     */
    function checkAndLoadTestData() {
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const syncData = urlParams.get('syncData');
        
        if (syncData) {
            try {
                const data = JSON.parse(decodeURIComponent(syncData));
                console.log('✅ Found sync data in URL:', data);
                loadSyncData(data);
                
                // Clean URL
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
                
                return true;
            } catch (error) {
                console.error('❌ Failed to parse sync data:', error);
            }
        }
        
        // Check if we have test data
        const hasTestData = KEYS_TO_SYNC.some(key => localStorage.getItem(key));
        
        if (!hasTestData) {
            console.log('⚠️ No test data found in admin domain');
            showSyncPrompt();
        } else {
            console.log('✅ Test data found:', {
                clients: localStorage.getItem('flexcredi_test_clients'),
                applications: localStorage.getItem('flexcredi_test_applications'),
                user: localStorage.getItem('flexcredi_user') ? 'Yes' : 'No'
            });
        }
        
        return hasTestData;
    }
    
    /**
     * Load sync data into localStorage
     */
    function loadSyncData(data) {
        console.log('💾 Loading sync data...');
        
        Object.keys(data).forEach(key => {
            if (data[key]) {
                localStorage.setItem(key, JSON.stringify(data[key]));
                console.log(`✅ Loaded ${key}:`, data[key]);
            }
        });
        
        // Show success message
        showNotification('✅ Test data synchronized successfully!', 'success');
        
        // Reload page to show new data
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    /**
     * Show sync prompt
     */
    function showSyncPrompt() {
        const banner = document.createElement('div');
        banner.id = 'sync-prompt-banner';
        banner.innerHTML = `
            <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 16px; margin: 20px; text-align: center; position: relative;">
                <button onclick="document.getElementById('sync-prompt-banner').remove()" 
                        style="position: absolute; top: 8px; right: 12px; background: none; border: none; font-size: 20px; cursor: pointer; color: #92400E;">&times;</button>
                <div style="color: #92400E; font-size: 14px; margin-bottom: 12px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>No test data found in admin panel</strong>
                </div>
                <div style="color: #78350F; font-size: 13px; margin-bottom: 16px;">
                    Create test client at <strong>flexcredi.com/create-test-client.html</strong> first,<br>
                    then click "Sync Test Data" below to load it here.
                </div>
                <button onclick="window.syncTestData()" 
                        style="background: #F59E0B; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                    <i class="fas fa-sync"></i> Sync Test Data
                </button>
                <a href="https://flexcredi.com/create-test-client.html" target="_blank"
                   style="display: inline-block; margin-left: 12px; background: white; color: #F59E0B; border: 2px solid #F59E0B; padding: 8px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s;">
                    <i class="fas fa-external-link-alt"></i> Create Test Client
                </a>
            </div>
        `;
        
        const container = document.querySelector('.main-content') || 
                         document.querySelector('main') || 
                         document.body.firstElementChild;
        
        if (container) {
            container.insertBefore(banner, container.firstChild);
        }
    }
    
    /**
     * Add sync button to page
     */
    function addSyncButton() {
        const syncBtn = document.createElement('button');
        syncBtn.id = 'cross-domain-sync-btn';
        syncBtn.innerHTML = '<i class="fas fa-sync"></i>';
        syncBtn.title = 'Sync test data from main domain';
        syncBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #F59E0B;
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            cursor: pointer;
            z-index: 9999;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        `;
        
        syncBtn.addEventListener('click', () => window.syncTestData());
        syncBtn.addEventListener('mouseenter', () => {
            syncBtn.style.transform = 'scale(1.1)';
            syncBtn.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
        });
        syncBtn.addEventListener('mouseleave', () => {
            syncBtn.style.transform = 'scale(1)';
            syncBtn.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
        });
        
        document.body.appendChild(syncBtn);
    }
    
    /**
     * Sync test data from main domain
     */
    window.syncTestData = function() {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `${MAIN_DOMAIN}/sync-bridge.html`;
        
        showNotification('🔄 Syncing data...', 'info');
        
        // Listen for message from iframe
        window.addEventListener('message', function handleMessage(event) {
            if (event.origin !== MAIN_DOMAIN) return;
            
            if (event.data && event.data.type === 'SYNC_DATA') {
                console.log('📥 Received sync data:', event.data.data);
                loadSyncData(event.data.data);
                
                // Clean up
                window.removeEventListener('message', handleMessage);
                document.body.removeChild(iframe);
            }
        });
        
        document.body.appendChild(iframe);
        
        // Timeout fallback
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
                showNotification('⚠️ Sync timeout - please try again', 'warning');
            }
        }, SYNC_TIMEOUT);
    };
    
    /**
     * Handle storage events
     */
    function handleStorageEvent(event) {
        if (KEYS_TO_SYNC.includes(event.key)) {
            console.log('🔄 Storage changed:', event.key);
            // Could reload page or update UI here
        }
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        const colors = {
            success: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
            error: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
            warning: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
            info: { bg: '#E0E7FF', border: '#6366F1', text: '#3730A3' }
        };
        
        const color = colors[type] || colors.info;
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color.bg};
            border: 2px solid ${color.border};
            color: ${color.text};
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 600;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'all 0.3s';
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCrossDomainSync);
    } else {
        initCrossDomainSync();
    }
    
    console.log('✅ Cross-domain sync script loaded');
})();

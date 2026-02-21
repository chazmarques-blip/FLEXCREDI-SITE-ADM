/**
 * FLEXCREDI - Controles Simplificados para Barra Horizontal
 * Painel mínimo para testar a barra de progresso compacta
 */

class CompactProgressControls {
    constructor() {
        this.compactProgress = null;
        this.init();
    }

    init() {
        // Aguardar o sistema de progresso compacto estar pronto
        const checkCompactProgress = setInterval(() => {
            if (window.compactProgress) {
                this.compactProgress = window.compactProgress;
                clearInterval(checkCompactProgress);
                this.createMiniControls();
                console.log('🎮 Controles compactos carregados');
            }
        }, 1000);
    }

    createMiniControls() {
        const controlsHTML = `
        <div id="compactControls" class="compact-controls-panel">
            <div class="controls-toggle" id="controlsToggle">
                <i class="fas fa-cog"></i>
            </div>
            <div class="controls-menu" id="controlsMenu">
                <button class="control-btn" id="btnAdvanceStep">
                    <i class="fas fa-step-forward"></i> Avançar
                </button>
                <button class="control-btn" id="btnSimulateAll">
                    <i class="fas fa-play"></i> Simular Tudo
                </button>
                <button class="control-btn" id="btnReset">
                    <i class="fas fa-undo"></i> Reset
                </button>
                <div class="controls-divider"></div>
                <button class="control-btn success" id="btnApprove">
                    <i class="fas fa-check"></i> Aprovar
                </button>
                <button class="control-btn danger" id="btnDeny">
                    <i class="fas fa-times"></i> Negar
                </button>
                <button class="control-btn warning" id="btnAdjust">
                    <i class="fas fa-edit"></i> Ajustar
                </button>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', controlsHTML);
        this.bindControlEvents();
    }

    bindControlEvents() {
        // Toggle do painel
        document.getElementById('controlsToggle').onclick = () => {
            const menu = document.getElementById('controlsMenu');
            menu.classList.toggle('show');
        };

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('compactControls');
            const menu = document.getElementById('controlsMenu');
            
            if (!panel.contains(e.target) && menu.classList.contains('show')) {
                menu.classList.remove('show');
            }
        });

        // Controles individuais
        document.getElementById('btnAdvanceStep').onclick = () => {
            if (this.compactProgress) {
                this.compactProgress.advanceStep();
                this.closeMenu();
            }
        };

        document.getElementById('btnSimulateAll').onclick = () => {
            if (this.compactProgress) {
                this.compactProgress.simulateProgress();
                this.closeMenu();
            }
        };

        document.getElementById('btnReset').onclick = () => {
            if (this.compactProgress) {
                this.compactProgress.resetProgress();
                this.closeMenu();
            }
        };

        document.getElementById('btnApprove').onclick = () => {
            if (this.compactProgress) {
                this.compactProgress.finalizeWithStatus('approved');
                this.closeMenu();
            }
        };

        document.getElementById('btnDeny').onclick = () => {
            if (this.compactProgress) {
                this.compactProgress.finalizeWithStatus('denied');
                this.closeMenu();
            }
        };

        document.getElementById('btnAdjust').onclick = () => {
            if (this.compactProgress) {
                this.compactProgress.finalizeWithStatus('adjusted');
                this.closeMenu();
            }
        };
    }

    closeMenu() {
        const menu = document.getElementById('controlsMenu');
        menu.classList.remove('show');
    }
}

// CSS inline para os controles compactos
const compactControlsStyles = `
<style>
.compact-controls-panel {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 9999;
    font-family: Arial, sans-serif;
}

.controls-toggle {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #2ECC71, #1E8449);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(46, 204, 113, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.controls-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(46, 204, 113, 0.4);
}

.controls-menu {
    position: absolute;
    bottom: 60px;
    right: 0;
    background: white;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    min-width: 160px;
    transform: scale(0.8) translateY(20px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.controls-menu.show {
    transform: scale(1) translateY(0);
    opacity: 1;
    visibility: visible;
}

.control-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    margin: 4px 0;
    border: none;
    border-radius: 6px;
    background: #f8f9fa;
    color: #333;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.control-btn:hover {
    background: #e9ecef;
    transform: translateX(2px);
}

.control-btn.success {
    background: #d4edda;
    color: #155724;
}

.control-btn.success:hover {
    background: #c3e6cb;
}

.control-btn.danger {
    background: #f8d7da;
    color: #721c24;
}

.control-btn.danger:hover {
    background: #f5c6cb;
}

.control-btn.warning {
    background: #fff3cd;
    color: #856404;
}

.control-btn.warning:hover {
    background: #ffeaa7;
}

.controls-divider {
    height: 1px;
    background: #dee2e6;
    margin: 8px 0;
}

@media (max-width: 768px) {
    .compact-controls-panel {
        bottom: 20px;
        right: 20px;
    }
    
    .controls-toggle {
        width: 45px;
        height: 45px;
        font-size: 16px;
    }
    
    .controls-menu {
        min-width: 140px;
        padding: 12px;
    }
    
    .control-btn {
        font-size: 11px;
        padding: 6px 10px;
    }
}

@media (max-width: 480px) {
    .compact-controls-panel {
        bottom: 15px;
        right: 15px;
    }
    
    .controls-toggle {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }
    
    .controls-menu {
        right: -50px;
        min-width: 120px;
        padding: 10px;
    }
}
</style>
`;

// Adicionar estilos
document.head.insertAdjacentHTML('beforeend', compactControlsStyles);

// Inicializar controles
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const compactControls = new CompactProgressControls();
        window.compactControls = compactControls;
        console.log('🎮 Controles compactos disponíveis!');
    }, 2000);
});
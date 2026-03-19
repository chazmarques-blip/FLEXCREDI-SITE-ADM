/**
 * FLEXCREDI - Correção de Alinhamento da Barra de Progresso
 * Sistema definitivo com alinhamento perfeito dos labels
 */

// Função para corrigir alinhamento após carregamento
function fixProgressAlignment() {
    const progressSteps = document.querySelectorAll('.progress-step-dot');
    
    if (progressSteps.length === 0) {
        // Tentar novamente em 500ms se não encontrou elementos
        setTimeout(fixProgressAlignment, 500);
        return;
    }
    
    console.log('🔧 Aplicando correção de alinhamento final...');
    
    progressSteps.forEach((step, index) => {
        const label = step.querySelector('.step-label');
        if (!label) return;
        
        // Resetar estilos para garantir aplicação limpa
        label.style.removeProperty('transform');
        label.style.removeProperty('left');
        label.style.removeProperty('text-align');
        label.style.removeProperty('margin-left');
        
        // Aplicar alinhamento com bolinhas nos extremos da barra
        if (index === 0) {
            // CADASTRO - Label alinhado com extremo esquerdo da barra
            label.style.setProperty('transform', 'translateX(0)', 'important');
            label.style.setProperty('left', '0', 'important'); // Extremo esquerdo exato
            label.style.setProperty('text-align', 'left', 'important');
            console.log('✅ Cadastro: alinhado com extremo esquerdo da barra');
        } else if (index === progressSteps.length - 1) {
            // FINAL - Label alinhado com extremo direito da barra
            label.style.setProperty('transform', 'translateX(-100%)', 'important');
            label.style.setProperty('left', '100%', 'important'); // Extremo direito exato
            label.style.setProperty('text-align', 'right', 'important');
            console.log('✅ Final: alinhado com extremo direito da barra');
        } else {
            // Labels do meio: centralizados com suas bolinhas
            label.style.setProperty('transform', 'translateX(-50%)', 'important');
            label.style.setProperty('left', '50%', 'important');
            label.style.setProperty('text-align', 'center', 'important');
            console.log(`✅ ${label.textContent}: centralizado com bolinha`);
        }
    });
    
    // Aplicar ajustes de posicionamento dos pontos também
    fixDotPositions(progressSteps);
    
    console.log('🎯 Alinhamento completo dos labels e pontos corrigido!');
}

// Função auxiliar para corrigir posições dos pontos - EXTREMOS PERFEITOS
function fixDotPositions(progressSteps) {
    progressSteps.forEach((step, index) => {
        const totalSteps = progressSteps.length;
        let leftPosition;
        let transformValue = '';
        
        if (index === 0) {
            // Primeiro ponto: extremo EXATO da barra (0%)
            leftPosition = 0;
            transformValue = 'translateX(0)'; // Sem centralização
            step.style.transform = transformValue;
        } else if (index === totalSteps - 1) {
            // Último ponto: extremo EXATO da barra (100%)
            leftPosition = 100;
            transformValue = 'translateX(-100%)'; // Alinhado à direita
            step.style.transform = transformValue;
        } else {
            // Pontos do meio: distribuição uniforme de 0% a 100%
            leftPosition = (index / (totalSteps - 1)) * 100;
            transformValue = 'translateX(-50%)'; // Centralizado
            step.style.transform = transformValue;
        }
        
        step.style.left = `${leftPosition}%`;
        console.log(`🎯 Ponto ${index + 1}: ${leftPosition}% (${transformValue})`);
    });
}

// Aplicar correção quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que os elementos foram criados
    setTimeout(fixProgressAlignment, 1500);
});

// Aplicar correção também quando a barra for atualizada
const originalUpdateDisplay = window.compactProgress?.updateDisplay;
if (originalUpdateDisplay) {
    window.compactProgress.updateDisplay = function() {
        originalUpdateDisplay.call(this);
        setTimeout(fixProgressAlignment, 100);
    };
}

// Monitorar mudanças e aplicar correção
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            const hasProgressSteps = addedNodes.some(node => 
                node.nodeType === 1 && 
                (node.classList?.contains('progress-step-dot') || 
                 node.querySelector?.('.progress-step-dot'))
            );
            
            if (hasProgressSteps) {
                setTimeout(fixProgressAlignment, 100);
            }
        }
    });
});

// Observar mudanças no container da barra de progresso
setTimeout(() => {
    const progressContainer = document.querySelector('.progress-steps-container');
    if (progressContainer) {
        observer.observe(progressContainer, {
            childList: true,
            subtree: true
        });
    }
}, 2000);

window.fixProgressAlignment = fixProgressAlignment;
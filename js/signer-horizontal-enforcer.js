// FORÇAR LAYOUT HORIZONTAL DE 4 COLUNAS PARA SIGNATÁRIO PRINCIPAL
// Este script força o layout via JavaScript como solução definitiva

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Forçando layout horizontal do signatário...');
    enforceSignerHorizontalLayout();
    
    // Re-aplicar após mudanças no DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target.id === 'signerDocuments') {
                setTimeout(enforceSignerHorizontalLayout, 100);
            }
        });
    });
    
    const signerContainer = document.getElementById('signerDocuments');
    if (signerContainer) {
        observer.observe(signerContainer, { childList: true });
    }
});

function enforceSignerHorizontalLayout() {
    const signerGrid = document.getElementById('signerDocuments');
    if (!signerGrid) {
        console.log('⚠️ Container signerDocuments não encontrado');
        return;
    }
    
    // FORÇA via JavaScript - sobrescreve qualquer CSS
    signerGrid.style.display = 'grid';
    signerGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    signerGrid.style.gridTemplateRows = 'auto';
    signerGrid.style.gap = '15px';
    signerGrid.style.width = '100%';
    signerGrid.style.overflow = 'visible';
    
    console.log('✅ Grid principal configurado: 4 colunas');
    
    // Aplicar estilos aos cards de documento - DIMENSÕES EXATAS DA FOTO
    const documentCards = signerGrid.querySelectorAll('.cobuyer-document-card, .document-card');
    documentCards.forEach((card, index) => {
        // Dimensões EXATAS baseadas na análise da foto
        card.style.height = '160px';
        card.style.minHeight = '160px';
        card.style.maxHeight = '160px';
        card.style.width = '100%';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'space-between';
        card.style.boxSizing = 'border-box';
        card.style.overflow = 'hidden';
        card.style.padding = '12px 8px 8px 8px';
        card.style.background = '#ffffff';
        card.style.border = '2px dashed #f59e0b'; // Borda laranja como na foto
        card.style.borderRadius = '8px';
        
        console.log(`✅ Card ${index + 1}: altura 160px FOTO EXATA, display flex`);
        
        // Ajustar preview boxes - EXATO DA FOTO
        const previewBox = card.querySelector('.doc-preview-box');
        if (previewBox) {
            previewBox.style.width = '80px';
            previewBox.style.height = '80px';
            previewBox.style.background = '#fef3c7'; // Fundo amarelo claro da foto
            previewBox.style.border = '1px solid #f59e0b';
            previewBox.style.borderRadius = '8px';
            previewBox.style.display = 'flex';
            previewBox.style.alignItems = 'center';
            previewBox.style.justifyContent = 'center';
            previewBox.style.flexDirection = 'column';
            previewBox.style.margin = '0';
            previewBox.style.flex = '1';
            previewBox.style.cursor = 'pointer';
            
            // Ajustar ícone interno
            const icon = previewBox.querySelector('.preview-icon i');
            if (icon) {
                icon.style.fontSize = '28px';
                icon.style.color = '#f59e0b';
                icon.style.marginBottom = '4px';
            }
        }
        
        // Ajustar header - ESTILO DOS CO-SIGNATÁRIOS
        const header = card.querySelector('.doc-header');
        if (header) {
            header.style.display = 'flex';
            header.style.flexDirection = 'column';
            header.style.alignItems = 'center';
            header.style.textAlign = 'center';
            header.style.padding = '0';
            header.style.margin = '0 0 8px 0';
            header.style.width = '100%';
            header.style.flexShrink = '0';
            
            // Esconder ícone do header (não existe nos co-signatários)
            const icon = header.querySelector('.doc-icon');
            if (icon) icon.style.display = 'none';
        }
        
        // Ajustar actions - BOTÃO EXATO DA FOTO
        const actions = card.querySelector('.doc-actions');
        if (actions) {
            actions.style.width = '100%';
            actions.style.padding = '0';
            actions.style.margin = '0';
            actions.style.flexShrink = '0';
            
            const button = actions.querySelector('button');
            if (button) {
                button.style.width = '100%';
                button.style.height = '32px'; // Altura exata da foto
                button.style.background = '#f59e0b';
                button.style.border = 'none';
                button.style.borderRadius = '6px';
                button.style.fontSize = '11px';
                button.style.fontWeight = '600';
                button.style.color = '#ffffff';
                button.style.textTransform = 'uppercase';
                button.style.letterSpacing = '0.3px';
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
                button.style.cursor = 'pointer';
                button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
        }
    });
    
    // Aplicar responsividade via JavaScript
    applyResponsiveLayout(signerGrid);
    
    console.log(`🎯 Layout horizontal aplicado: ${documentCards.length} cards em 4 colunas`);
}

function applyResponsiveLayout(grid) {
    function updateLayout() {
        const width = window.innerWidth;
        
        if (width <= 600) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid.style.gap = '8px';
            console.log('📱 Layout mobile: 2 colunas');
            // Ajustar altura dos cards para mobile - baseado na foto
            const cards = grid.querySelectorAll('.cobuyer-document-card, .document-card');
            cards.forEach(card => {
                card.style.height = '120px';
                card.style.minHeight = '120px';
                card.style.maxHeight = '120px';
            });
        } else if (width <= 768) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid.style.gap = '10px';
            console.log('📱 Layout tablet: 2 colunas');
            // Ajustar altura dos cards para tablet - baseado na foto
            const cards = grid.querySelectorAll('.cobuyer-document-card, .document-card');
            cards.forEach(card => {
                card.style.height = '140px';
                card.style.minHeight = '140px';
                card.style.maxHeight = '140px';
            });
        } else if (width <= 1200) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid.style.gap = '12px';
            console.log('💻 Layout tablet grande: 2 colunas');
            // Restaurar altura para tablet grande - baseado na foto
            const cards = grid.querySelectorAll('.cobuyer-document-card, .document-card');
            cards.forEach(card => {
                card.style.height = '160px';
                card.style.minHeight = '160px';
                card.style.maxHeight = '160px';
            });
        } else {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            grid.style.gap = '12px'; // Gap exato da foto
            console.log('🖥️ Layout desktop: 4 colunas');
            // Restaurar altura normal para desktop - baseado na foto
            const cards = grid.querySelectorAll('.cobuyer-document-card, .document-card');
            cards.forEach(card => {
                card.style.height = '160px';
                card.style.minHeight = '160px';
                card.style.maxHeight = '160px';
            });
        }
    }
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
}

// Função para testar o layout
window.testSignerLayout = function() {
    console.log('🧪 Teste do layout do signatário...');
    const grid = document.getElementById('signerDocuments');
    if (grid) {
        console.log('Grid encontrado:', {
            display: grid.style.display,
            gridTemplateColumns: grid.style.gridTemplateColumns,
            gap: grid.style.gap,
            children: grid.children.length
        });
        
        Array.from(grid.children).forEach((card, i) => {
            console.log(`Card ${i + 1}:`, {
                height: card.style.height,
                display: card.style.display,
                flexDirection: card.style.flexDirection
            });
        });
    } else {
        console.log('❌ Grid não encontrado!');
    }
};
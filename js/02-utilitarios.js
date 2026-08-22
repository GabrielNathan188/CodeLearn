/* ============================================
   CodeLearn - Utilitários
   Funções auxiliares globais
   ============================================ */

const Utils = {
    /**
     * Gera um ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Converte valores vindos do backend (DATETIME "YYYY-MM-DD HH:MM:SS"
     * ou timestamp numérico) em um objeto Date confiável.
     */
    parseData(valor) {
        if (typeof valor === 'string' && valor.includes(' ') && !valor.includes('T')) {
            return new Date(valor.replace(' ', 'T'));
        }
        return new Date(valor);
    },

    /**
     * Formata data para exibição
     */
    formatDate(timestamp) {
        const date = this.parseData(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'agora';
        if (minutes < 60) return `${minutes} min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;
        
        return date.toLocaleDateString('pt-BR');
    },

    /**
     * Formata data completa
     */
    formatDateFull(timestamp) {
        return this.parseData(timestamp).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    /**
     * Escapa HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Mostra notificação toast
     */
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'ri-check-circle-fill',
            error: 'ri-error-warning-fill',
            info: 'ri-information-fill'
        };
        
        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <span class="toast-message">${this.escapeHtml(message)}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('closing');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Calcula nível baseado em XP
     */
    getLevelFromXP(xp) {
        return Math.floor(xp / 100) + 1;
    },

    /**
     * Calcula XP necessário para o próximo nível
     */
    getXPForNextLevel(level) {
        return level * 100;
    },

    /**
     * Obtém XP atual dentro do nível
     */
    getCurrentLevelXP(xp) {
        return xp % 100;
    },

    /**
     * Verifica se é o mesmo dia
     */
    isSameDay(ts1, ts2) {
        const d1 = new Date(ts1);
        const d2 = new Date(ts2);
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    },

    /**
     * Verifica se é dia consecutivo (ontem)
     */
    isConsecutiveDay(previous, current) {
        const prevDate = new Date(previous);
        prevDate.setHours(0, 0, 0, 0);
        const currDate = new Date(current);
        currDate.setHours(0, 0, 0, 0);
        
        const diff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
        return diff === 1;
    },

    /**
     * Debounce para eventos
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Copia texto para clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Hash simples (não para segurança, apenas demonstração)
     * ⚠️ Em produção, usar bcrypt/argon no backend
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },

    /**
     * Valida email
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Valida nome de usuário (letras, números, underscore, 3-20 chars)
     */
    isValidUsername(username) {
        return /^[a-zA-Z0-9_]{3,20}$/.test(username);
    }
};

// Função global de navegação
function navigateTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = sectionId === 'dashboard' ? 'block' : '';
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Fechar menu mobile se aberto
        document.getElementById('navLinks')?.classList.remove('mobile-open');
        document.getElementById('userDropdown')?.classList.remove('active');
    }
    return false;
}

// Toggle menu mobile
function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('mobile-open');
}

/* ============================================
   CodeLearn - App Principal
   Inicializa todos os módulos
   ============================================ */

const App = {
    async init() {
        console.log('%c🚀 CodeLearn inicializando...', 'color: #00ff88; font-weight: bold; font-size: 14px;');

        // Inicializa tema
        Theme.init();

        // Autenticação primeiro (outros módulos podem depender do usuário logado)
        await Auth.init();

        // Inicializa módulos (Roadmap e Concepts continuam com conteúdo estático)
        Roadmap.init();
        Concepts.init();
        Editor.init();
        await AI.init();

        await Promise.all([
            Exercises.init(),
            Forum.init(),
            Ranking.init()
        ]);

        // Eventos globais
        this.setupNavbarScroll();
        this.setupModalClose();
        this.setupRevealAnimations();

        console.log('%c✓ CodeLearn carregada!', 'color: #00ff88; font-weight: bold;');
        console.log('%cCrie sua conta para começar', 'color: #7c3aed; font-weight: bold;');
    },

    /**
     * Efeito de scroll na navbar
     */
    setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', Utils.debounce(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10));
    },

    /**
     * Fechar modais com ESC
     */
    setupModalClose() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
                document.getElementById('userDropdown')?.classList.remove('active');
            }
        });
    },

    /**
     * Animações de revelação ao rolar
     */
    setupRevealAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section-header, .roadmap-card, .concept-card, .tip-card, .exercise-item, .forum-post, .ranking-item').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
};

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

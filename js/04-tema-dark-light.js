/* ============================================
   CodeLearn - Tema (Dark/Light)
   Preferência puramente visual - fica só no
   navegador, não precisa passar pelo backend.
   ============================================ */

const Theme = {
    KEY: 'codelearn_theme',

    init() {
        const savedTheme = localStorage.getItem(this.KEY) || 'dark';
        this.apply(savedTheme);
    },

    toggle() {
        const current = localStorage.getItem(this.KEY) || 'dark';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.apply(newTheme);
        localStorage.setItem(this.KEY, newTheme);
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
        }
    }
};

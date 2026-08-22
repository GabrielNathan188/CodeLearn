/* ============================================
   CodeLearn - Tema (Dark/Light)
   ============================================ */

const Theme = {
    init() {
        const settings = DB.get('settings', {});
        const savedTheme = settings.theme || 'dark';
        this.apply(savedTheme);
    },

    toggle() {
        const settings = DB.get('settings', {});
        const current = settings.theme || 'dark';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.apply(newTheme);
        settings.theme = newTheme;
        DB.set('settings', settings);
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
        }
    }
};

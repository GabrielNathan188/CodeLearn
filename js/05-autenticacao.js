/* ============================================
   CodeLearn - Autenticação
   Login, Registro, Sessão - agora via API (JWT)
   ============================================ */

const Auth = {
    currentUser: null,

    async init() {
        const token = TokenStore.get();
        if (!token) return;

        try {
            const { usuario } = await Api.get('/auth/me', true);
            this.currentUser = usuario;
            this.updateUI();
            Gamification.updateDashboard();
        } catch (e) {
            // Token inválido ou expirado
            TokenStore.clear();
        }
    },

    openModal() {
        document.getElementById('authModal').classList.add('active');
        document.getElementById('loginUsername').focus();
    },

    closeModal() {
        document.getElementById('authModal').classList.remove('active');
    },

    switchTab(tab, btn) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
    },

    async login(event) {
        event.preventDefault();

        const username = document.getElementById('loginUsername').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        try {
            const { usuario, token } = await Api.post('/auth/login', { username, password });

            TokenStore.set(token);
            this.currentUser = usuario;

            this.updateUI();
            this.closeModal();
            Gamification.updateDashboard();

            Utils.toast(`Olá, ${usuario.nome.split(' ')[0]}!`, 'success');
            event.target.reset();
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    async register(event) {
        event.preventDefault();

        const nome = document.getElementById('regName').value.trim();
        const username = document.getElementById('regUsername').value.trim().toLowerCase();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;

        try {
            const { usuario, token } = await Api.post('/auth/registrar', { nome, username, email, password });

            TokenStore.set(token);
            this.currentUser = usuario;

            this.updateUI();
            this.closeModal();
            Gamification.updateDashboard();

            Utils.toast('Conta criada com sucesso!', 'success');
            event.target.reset();
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    logout() {
        TokenStore.clear();
        this.currentUser = null;
        this.updateUI();
        document.getElementById('userDropdown').classList.remove('active');
        Utils.toast('Sessão encerrada', 'info');
        return false;
    },

    toggleUserMenu() {
        document.getElementById('userDropdown').classList.toggle('active');
    },

    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const navDashboard = document.getElementById('navDashboard');
        const adminLink = document.getElementById('adminLink');

        if (this.currentUser) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';
            navDashboard.style.display = 'block';

            userAvatar.textContent = this.currentUser.nome.charAt(0).toUpperCase();
            userName.textContent = this.currentUser.username;

            if (['OWNER', 'ADMIN'].includes(this.currentUser.papel)) {
                adminLink.style.display = 'flex';
            } else {
                adminLink.style.display = 'none';
            }
        } else {
            authButtons.style.display = 'block';
            userMenu.style.display = 'none';
            navDashboard.style.display = 'none';
            adminLink.style.display = 'none';
        }
    },

    requireAuth() {
        if (!this.currentUser) {
            Utils.toast('Faça login para continuar', 'info');
            this.openModal();
            return false;
        }
        return true;
    },

    /**
     * Recarrega os dados do usuário atual a partir da API
     * (chame depois de ações que mudam XP, badges, etc.)
     */
    async refreshUser() {
        if (!this.currentUser) return;
        try {
            const { usuario } = await Api.get('/auth/me', true);
            this.currentUser = usuario;
            this.updateUI();
        } catch (e) {
            // sessão pode ter expirado
        }
    }
};

document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('userDropdown');
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

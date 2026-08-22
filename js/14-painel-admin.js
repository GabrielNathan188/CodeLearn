/* ============================================
   CodeLearn - Painel Administrativo
   ============================================ */

const Admin = {
    currentTab: 'stats',

    openIfAdmin() {
        if (!Auth.currentUser || !['OWNER', 'ADMIN'].includes(Auth.currentUser.papel)) {
            Utils.toast('Sem permissão de administrador', 'error');
            return false;
        }
        this.open();
        return false;
    },

    open() {
        document.getElementById('adminModal').classList.add('active');
        this.switchTab('stats', document.querySelector('.admin-tab'));
        this.refresh();
    },

    close() {
        document.getElementById('adminModal').classList.remove('active');
    },

    refresh() {
        this.loadStats();
        this.loadUsers();
        this.loadForum();
        this.loadContent();
    },

    switchTab(tab, btn) {
        this.currentTab = tab;
        
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        if (btn) btn.classList.add('active');
        
        document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
        const panel = document.getElementById('admin' + tab.charAt(0).toUpperCase() + tab.slice(1));
        if (panel) panel.style.display = 'block';
    },

    async loadStats() {
        try {
            const stats = await Api.get('/admin/stats', true);
            if (document.getElementById('adminStatUsers'))
                document.getElementById('adminStatUsers').textContent = stats.totalUsuarios;
            if (document.getElementById('adminStatPosts'))
                document.getElementById('adminStatPosts').textContent = stats.totalPosts;
            if (document.getElementById('adminStatXP'))
                document.getElementById('adminStatXP').textContent = Number(stats.totalXP).toLocaleString('pt-BR');
            if (document.getElementById('adminStatAPI'))
                document.getElementById('adminStatAPI').textContent = stats.apiConfigurada ? 'OK' : '—';
        } catch (e) {
            Utils.toast('Erro ao carregar estatísticas', 'error');
        }
    },

    async loadUsers(filter = '') {
        const tbody = document.getElementById('adminUsersTable');
        if (!tbody) return;

        let usuarios;
        try {
            const resposta = await Api.get('/admin/usuarios', true);
            usuarios = resposta.usuarios;
        } catch (e) {
            return;
        }

        this._usuariosCache = usuarios;

        let filtrados = usuarios;
        if (filter) {
            const f = filter.toLowerCase();
            filtrados = usuarios.filter(u =>
                u.nome.toLowerCase().includes(f) ||
                u.username.toLowerCase().includes(f) ||
                u.email.toLowerCase().includes(f)
            );
        }

        const isOwner = Auth.currentUser?.papel === 'OWNER';

        tbody.innerHTML = filtrados.map((user, index) => {
            const canEditRole = isOwner || (user.papel === 'USER');
            const canDelete = isOwner && user.papel !== 'OWNER';
            
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>@${user.username}</strong></td>
                    <td>${user.nome}</td>
                    <td>
                        ${canEditRole ? `
                            <select class="form-select" style="padding: 4px 8px; width: auto; font-size: 0.8rem;" onchange="Admin.changeRole('${user.id}', this.value)">
                                <option value="USER" ${user.papel === 'USER' ? 'selected' : ''}>USER</option>
                                <option value="ADMIN" ${user.papel === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                                ${isOwner ? `<option value="OWNER" ${user.papel === 'OWNER' ? 'selected' : ''}>OWNER</option>` : ''}
                            </select>
                        ` : `<span class="admin-role role-${user.papel}">${user.papel}</span>`}
                    </td>
                    <td class="mono">${user.xp}</td>
                    <td>${Utils.formatDateFull(user.criado_em)}</td>
                    <td>
                        <div class="admin-actions">
                            <button class="admin-action-btn" onclick="Admin.resetXP('${user.id}')" title="Resetar XP">
                                <i class="ri-refresh-line"></i>
                            </button>
                            ${canDelete ? `
                                <button class="admin-action-btn delete" onclick="Admin.deleteUser('${user.id}')" title="Excluir">
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    searchUsers() {
        const query = document.getElementById('adminUserSearch').value;
        this.loadUsers(query);
    },

    async changeRole(userId, newRole) {
        if (!Auth.currentUser) return;

        if (newRole === 'OWNER' && Auth.currentUser.papel !== 'OWNER') {
            Utils.toast('Apenas OWNER pode definir esse papel', 'error');
            this.loadUsers();
            return;
        }

        try {
            await Api.put(`/admin/usuarios/${userId}/papel`, { papel: newRole }, true);

            if (Auth.currentUser.id === userId) {
                await Auth.refreshUser();
            }

            Utils.toast(`Papel alterado para ${newRole}`, 'success');
        } catch (e) {
            Utils.toast(e.message, 'error');
            this.loadUsers();
        }
    },

    async resetXP(userId) {
        if (!confirm('Tem certeza que deseja resetar o XP deste usuário?')) return;

        try {
            await Api.put(`/admin/usuarios/${userId}/resetar-xp`, {}, true);
            this.loadUsers();
            this.loadStats();
            if (typeof Ranking !== 'undefined') Ranking.render();
            if (Auth.currentUser?.id === userId) await Auth.refreshUser();
            Utils.toast('XP resetado', 'info');
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    async deleteUser(userId) {
        if (Auth.currentUser?.papel !== 'OWNER') {
            Utils.toast('Apenas OWNER pode excluir usuários', 'error');
            return;
        }
        if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) return;

        try {
            await Api.delete(`/admin/usuarios/${userId}`, true);
            this.loadUsers();
            this.loadStats();
            if (typeof Ranking !== 'undefined') Ranking.render();
            Utils.toast('Usuário excluído', 'info');
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    async loadForum() {
        const tbody = document.getElementById('adminForumTable');
        if (!tbody) return;

        let posts;
        try {
            const resposta = await Api.get('/posts');
            posts = resposta.posts;
        } catch (e) {
            return;
        }

        tbody.innerHTML = posts.map(post => `
            <tr>
                <td><strong>${Utils.escapeHtml(post.titulo)}</strong></td>
                <td>@${post.autor_username}</td>
                <td><span class="post-tag">${post.tag || ''}</span></td>
                <td class="mono">${post.votos}</td>
                <td>
                    <button class="admin-action-btn delete" onclick="Admin.deletePost('${post.id}')">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    async deletePost(postId) {
        if (!confirm('Excluir esta publicação?')) return;

        try {
            await Api.delete(`/posts/${postId}`, true);
            this.loadForum();
            this.loadStats();
            if (typeof Forum !== 'undefined') Forum.render();
            Utils.toast('Publicação excluída', 'info');
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    async loadContent() {
        try {
            const { configuracoes } = await Api.get('/admin/configuracoes');
            if (!configuracoes) return;
            if (document.getElementById('contentTitle'))
                document.getElementById('contentTitle').value = configuracoes.titulo_site || '';
            if (document.getElementById('contentSubtitle'))
                document.getElementById('contentSubtitle').value = configuracoes.subtitulo_site || '';
            if (document.getElementById('contentNotice'))
                document.getElementById('contentNotice').value = configuracoes.aviso || '';
        } catch (e) { /* segue sem preencher */ }
    },

    async saveContent() {
        try {
            await Api.put('/admin/configuracoes', {
                titulo_site: document.getElementById('contentTitle').value,
                subtitulo_site: document.getElementById('contentSubtitle').value,
                aviso: document.getElementById('contentNotice').value,
                tema_padrao: 'dark'
            }, true);
            Utils.toast('Conteúdo salvo!', 'success');
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    /**
     * A configuração de chave de API de IA foi removida do painel de
     * propósito - chaves nunca devem ficar no frontend nem no banco.
     * Se quiser ligar o CodeBot a uma IA real, configure a chave como
     * variável de ambiente no backend (.env do codelearn-server).
     */
    saveAPIKey() {
        Utils.toast('Configure a chave como variável de ambiente no backend, não aqui', 'info');
    },
    testAPI() {
        Utils.toast('Teste de conexão de IA deve ser feito no backend', 'info');
    },
    removeAPI() {
        Utils.toast('Nada a remover: a chave não é mais armazenada aqui', 'info');
    }
};

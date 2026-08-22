/* ============================================
   CodeLearn - Fórum / Comunidade
   ============================================ */

const Forum = {
    posts: [],

    async init() {
        await this.render();
    },

    async render() {
        const container = document.getElementById('forumList');
        if (!container) return;

        try {
            const usuarioId = Auth.currentUser?.id || '';
            const { posts } = await Api.get(`/posts?usuarioId=${usuarioId}`);
            this.posts = posts;
        } catch (e) {
            container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">Não foi possível carregar o fórum. Verifique se o servidor está rodando.</div>`;
            return;
        }

        const currentUserId = Auth.currentUser?.id;

        if (this.posts.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <i class="ri-chat-3-line" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>Ainda não há perguntas. Seja o primeiro a publicar!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.posts.map((post, index) => {
            const userVoted = post.votado_pelo_usuario;
            const isOwner = post.autor_id === currentUserId;
            const isAdmin = Auth.currentUser && ['OWNER', 'ADMIN'].includes(Auth.currentUser.papel);
            const canDelete = isOwner || isAdmin;
            
            return `
                <div class="forum-post" style="animation: fadeUp 0.4s ease ${index * 0.05}s both;">
                    <div class="post-votes">
                        <button class="vote-btn ${userVoted ? 'voted' : ''}" onclick="Forum.vote('${post.id}', event)">
                            <i class="ri-arrow-up-s-line"></i>
                        </button>
                        <span class="vote-count">${post.votos}</span>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <div class="post-author">
                                <div class="post-avatar">${post.autor_nome.charAt(0).toUpperCase()}</div>
                                <span>${post.autor_nome}</span>
                                <span style="color: var(--text-muted);">@${post.autor_username}</span>
                            </div>
                            <span class="post-tag">${post.tag || ''}</span>
                            <span class="post-time">${Utils.formatDate(post.criado_em)}</span>
                        </div>
                        <h4 class="post-title">${Utils.escapeHtml(post.titulo)}</h4>
                        <p class="post-description">${Utils.escapeHtml(post.descricao)}</p>
                        ${canDelete ? `
                            <div class="post-actions">
                                <button class="post-delete" onclick="Forum.deletePost('${post.id}', event)">
                                    <i class="ri-delete-bin-line"></i> Excluir
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    async vote(postId, event) {
        event.stopPropagation();
        
        if (!Auth.requireAuth()) return;

        try {
            await Api.post(`/posts/${postId}/votar`, {}, true);
            await this.render();
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    openNewPostModal() {
        if (!Auth.requireAuth()) return;
        document.getElementById('forumModal').classList.add('active');
        document.getElementById('postTitle').focus();
    },

    closeNewPostModal() {
        document.getElementById('forumModal').classList.remove('active');
    },

    async createPost(event) {
        event.preventDefault();
        
        if (!Auth.requireAuth()) {
            this.closeNewPostModal();
            return;
        }

        const titulo = document.getElementById('postTitle').value.trim();
        const descricao = document.getElementById('postDescription').value.trim();
        const tag = document.getElementById('postTag').value;

        try {
            const resultado = await Api.post('/posts', { titulo, descricao, tag }, true);

            this.closeNewPostModal();
            event.target.reset();
            await this.render();
            await Gamification.aplicarResultadoXP(resultado, resultado.xpGanho);

            Utils.toast('Publicação criada! +15 XP', 'success');
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    async deletePost(postId, event) {
        event.stopPropagation();
        
        if (!Auth.currentUser) return;
        if (!confirm('Tem certeza que deseja excluir esta publicação?')) return;

        try {
            await Api.delete(`/posts/${postId}`, true);
            await this.render();
            Utils.toast('Publicação excluída', 'info');
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    },

    /**
     * Conta posts de um usuário (usa a lista já carregada em render())
     */
    getUserPostCount(userId) {
        return this.posts.filter(p => p.autor_id === userId).length;
    }
};

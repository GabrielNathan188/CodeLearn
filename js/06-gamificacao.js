/* ============================================
   CodeLearn - Gamificação
   XP, Níveis, Badges, Streak - agora calculados
   no backend; este módulo só exibe os dados.
   ============================================ */

const Gamification = {
    catalogoBadges: null,

    async carregarCatalogoBadges() {
        if (this.catalogoBadges) return this.catalogoBadges;
        const { badges } = await Api.get('/badges');
        this.catalogoBadges = badges;
        return badges;
    },

    /**
     * Atualiza o dashboard com dados do usuário atual
     */
    async updateDashboard() {
        const user = Auth.currentUser;
        if (!user) return;

        const el = (id) => document.getElementById(id);

        const nivel = user.nivel;
        const currentXP = user.xp % 100;
        const neededXP = 100;
        const percent = (currentXP / neededXP) * 100;

        if (el('dashLevel')) el('dashLevel').textContent = nivel;
        if (el('dashCurrentXP')) el('dashCurrentXP').textContent = currentXP;
        if (el('dashNeededXP')) el('dashNeededXP').textContent = neededXP;
        if (el('dashXPBar')) el('dashXPBar').style.width = percent + '%';
        if (el('dashStreak')) el('dashStreak').textContent = user.streak || 0;
        if (el('dashCodes')) el('dashCodes').textContent = user.codigos_executados || 0;
        if (el('dashAI')) el('dashAI').textContent = user.usos_ia || 0;

        try {
            const { concluidos } = await Api.get('/exercicios/concluidos', true);
            if (el('dashExercises')) el('dashExercises').textContent = concluidos.length;
        } catch (e) { /* segue sem esse dado */ }

        try {
            const { posts } = await Api.get(`/posts?usuarioId=${user.id}`);
            const meusPosts = posts.filter(p => p.autor_id === user.id).length;
            if (el('dashPosts')) el('dashPosts').textContent = meusPosts;
        } catch (e) { /* segue sem esse dado */ }

        this.renderBadges();
    },

    /**
     * Renderiza as badges do usuário atual no dashboard
     */
    async renderBadges() {
        const container = document.getElementById('dashBadges');
        if (!container || !Auth.currentUser) return;

        const catalogo = await this.carregarCatalogoBadges();
        const { badges: minhasBadges } = await Api.get('/badges/minhas', true);
        const desbloqueadas = new Set(minhasBadges.map(b => b.codigo));

        container.innerHTML = catalogo.map(badge => {
            const unlocked = desbloqueadas.has(badge.codigo);
            return `
                <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" title="${badge.descricao}">
                    <div class="badge-icon">${badge.icone}</div>
                    <div class="badge-name">${badge.nome}</div>
                </div>
            `;
        }).join('');
    },

    /**
     * Chame depois de qualquer ação que retorne { usuario, subiuNivel }
     * da API - atualiza o usuário logado e mostra os toasts certos.
     */
    async aplicarResultadoXP(resultado, xpGanho) {
        Auth.currentUser = resultado.usuario;
        Auth.updateUI();

        if (resultado.subiuNivel) {
            Utils.toast(`🎉 Subiu para o nível ${resultado.usuario.nivel}!`, 'success');
        } else if (xpGanho) {
            Utils.toast(`+${xpGanho} XP`, 'success');
        }

        await this.updateDashboard();
        if (typeof Ranking !== 'undefined') Ranking.render();
    }
};

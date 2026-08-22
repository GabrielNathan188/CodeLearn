/* ============================================
   CodeLearn - Ranking
   ============================================ */

const Ranking = {
    async init() {
        await this.render();
    },

    async render() {
        const container = document.getElementById('rankingContainer');
        if (!container) return;

        let topUsers;
        try {
            const { ranking } = await Api.get('/ranking?limite=5');
            topUsers = ranking;
        } catch (e) {
            return;
        }

        const currentUserId = Auth.currentUser?.id;

        container.innerHTML = topUsers.map((user, index) => {
            const position = index + 1;
            const isCurrentUser = user.id === currentUserId;
            
            let positionDisplay = position;
            let positionClass = '';
            
            if (position === 1) {
                positionDisplay = '🥇';
                positionClass = 'top-1';
            } else if (position === 2) {
                positionDisplay = '🥈';
                positionClass = 'top-2';
            } else if (position === 3) {
                positionDisplay = '🥉';
                positionClass = 'top-3';
            }
            
            return `
                <div class="ranking-item ${isCurrentUser ? 'current-user' : ''}" style="animation: fadeUp 0.4s ease ${index * 0.1}s both;">
                    <span class="ranking-position ${positionClass}">${positionDisplay}</span>
                    <div class="ranking-avatar">${user.nome.charAt(0).toUpperCase()}</div>
                    <div class="ranking-info">
                        <div class="ranking-name">${user.nome}</div>
                        <div class="ranking-username">@${user.username} · Nível ${user.nivel}</div>
                    </div>
                    <div class="ranking-xp">${user.xp.toLocaleString('pt-BR')} XP</div>
                </div>
            `;
        }).join('');

        if (currentUserId && !topUsers.some(u => u.id === currentUserId)) {
            try {
                const { ranking: rankingCompleto } = await Api.get('/ranking?limite=1000');
                const userPosition = rankingCompleto.findIndex(u => u.id === currentUserId) + 1;
                if (userPosition > 5) {
                    const user = rankingCompleto[userPosition - 1];
                    container.innerHTML += `
                        <div style="text-align: center; color: var(--text-muted); padding: 12px 0;">...</div>
                        <div class="ranking-item current-user">
                            <span class="ranking-position">#${userPosition}</span>
                            <div class="ranking-avatar">${user.nome.charAt(0).toUpperCase()}</div>
                            <div class="ranking-info">
                                <div class="ranking-name">${user.nome}</div>
                                <div class="ranking-username">@${user.username} · Nível ${user.nivel} · Você</div>
                            </div>
                            <div class="ranking-xp">${user.xp.toLocaleString('pt-BR')} XP</div>
                        </div>
                    `;
                }
            } catch (e) { /* segue sem a posição extra */ }
        }
    }
};

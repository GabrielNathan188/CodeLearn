const db = require('../config/db');

function nivelPorXP(xp) {
    return Math.floor(xp / 100) + 1;
}

function mesmoDia(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

function diaConsecutivo(anterior, atual) {
    const a = new Date(anterior); a.setHours(0, 0, 0, 0);
    const b = new Date(atual); b.setHours(0, 0, 0, 0);
    const diffDias = (b - a) / (1000 * 60 * 60 * 24);
    return diffDias === 1;
}

/**
 * Atualiza o streak do usuário com base na última atividade.
 * Deve ser chamada dentro de uma transação, antes do addXP.
 */
async function atualizarStreak(conn, usuario) {
    const agora = new Date();
    let novoStreak = usuario.streak;

    if (!usuario.ultima_atividade || !mesmoDia(new Date(usuario.ultima_atividade), agora)) {
        if (usuario.ultima_atividade && diaConsecutivo(usuario.ultima_atividade, agora)) {
            novoStreak = usuario.streak + 1;
        } else {
            novoStreak = 1;
        }
    }

    await conn.execute(
        'UPDATE usuarios SET streak = ?, ultima_atividade = ? WHERE id = ?',
        [novoStreak, agora, usuario.id]
    );

    if (novoStreak >= 7) {
        await desbloquearBadge(conn, usuario.id, 'streak_7');
    }

    return novoStreak;
}

/**
 * Desbloqueia uma badge para o usuário, se ainda não tiver.
 * badgeCodigo deve bater com a coluna `codigo` da tabela badges.
 */
async function desbloquearBadge(conn, usuarioId, badgeCodigo) {
    const [badges] = await conn.execute('SELECT id FROM badges WHERE codigo = ?', [badgeCodigo]);
    if (badges.length === 0) return null;

    const badgeId = badges[0].id;

    const [existente] = await conn.execute(
        'SELECT 1 FROM usuario_badges WHERE usuario_id = ? AND badge_id = ?',
        [usuarioId, badgeId]
    );

    if (existente.length > 0) return null;

    await conn.execute(
        'INSERT INTO usuario_badges (usuario_id, badge_id) VALUES (?, ?)',
        [usuarioId, badgeId]
    );

    return badgeCodigo;
}

/**
 * Adiciona XP a um usuário, recalcula nível e atualiza streak.
 * Retorna o usuário atualizado e se subiu de nível.
 */
async function adicionarXP(usuarioId, quantidade) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [rows] = await conn.execute('SELECT * FROM usuarios WHERE id = ? FOR UPDATE', [usuarioId]);
        if (rows.length === 0) throw new Error('Usuário não encontrado');
        const usuario = rows[0];

        const nivelAntigo = nivelPorXP(usuario.xp);
        const novoXP = usuario.xp + quantidade;
        const nivelNovo = nivelPorXP(novoXP);

        await conn.execute('UPDATE usuarios SET xp = ?, nivel = ? WHERE id = ?', [novoXP, nivelNovo, usuarioId]);

        await atualizarStreak(conn, usuario);

        if (nivelNovo > nivelAntigo && nivelNovo >= 10) {
            await desbloquearBadge(conn, usuarioId, 'level_10');
        }

        await conn.commit();

        const [atualizado] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);
        return { usuario: atualizado[0], subiuNivel: nivelNovo > nivelAntigo };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = { nivelPorXP, atualizarStreak, desbloquearBadge, adicionarXP };

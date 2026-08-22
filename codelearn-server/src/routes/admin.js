const express = require('express');
const db = require('../config/db');
const { autenticar, exigirAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/configuracoes', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM configuracoes WHERE id = 1');
    res.json({ configuracoes: rows[0] || null });
});

router.put('/configuracoes', autenticar, exigirAdmin, async (req, res) => {
    const { titulo_site, subtitulo_site, aviso, tema_padrao } = req.body;

    await db.execute(
        `UPDATE configuracoes
         SET titulo_site = ?, subtitulo_site = ?, aviso = ?, tema_padrao = ?
         WHERE id = 1`,
        [titulo_site, subtitulo_site, aviso, tema_padrao]
    );

    res.json({ mensagem: 'Configurações atualizadas' });
});

router.get('/usuarios', autenticar, exigirAdmin, async (req, res) => {
    const [rows] = await db.execute(
        'SELECT id, nome, username, email, papel, xp, nivel, criado_em FROM usuarios ORDER BY criado_em DESC'
    );
    res.json({ usuarios: rows });
});

router.put('/usuarios/:id/papel', autenticar, exigirAdmin, async (req, res) => {
    const { papel } = req.body;
    if (!['USER', 'ADMIN', 'OWNER'].includes(papel)) {
        return res.status(400).json({ erro: 'Papel inválido' });
    }
    await db.execute('UPDATE usuarios SET papel = ? WHERE id = ?', [papel, req.params.id]);
    res.json({ mensagem: 'Papel atualizado' });
});

router.get('/stats', autenticar, exigirAdmin, async (req, res) => {
    const [[{ totalUsuarios }]] = await db.query('SELECT COUNT(*) AS totalUsuarios FROM usuarios');
    const [[{ totalPosts }]] = await db.query('SELECT COUNT(*) AS totalPosts FROM posts');
    const [[{ totalXP }]] = await db.query('SELECT COALESCE(SUM(xp), 0) AS totalXP FROM usuarios');
    const [[config]] = await db.query('SELECT api_configurada FROM configuracoes WHERE id = 1');

    res.json({
        totalUsuarios,
        totalPosts,
        totalXP,
        apiConfigurada: !!config?.api_configurada
    });
});

router.put('/usuarios/:id/resetar-xp', autenticar, exigirAdmin, async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        await conn.execute('UPDATE usuarios SET xp = 0, nivel = 1 WHERE id = ?', [req.params.id]);
        await conn.execute('DELETE FROM usuario_exercicios WHERE usuario_id = ?', [req.params.id]);
        await conn.execute('DELETE FROM usuario_badges WHERE usuario_id = ?', [req.params.id]);
        await conn.commit();
        res.json({ mensagem: 'XP resetado' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ erro: 'Erro ao resetar XP' });
    } finally {
        conn.release();
    }
});

router.delete('/usuarios/:id', autenticar, exigirAdmin, async (req, res) => {
    if (req.usuario.papel !== 'OWNER') {
        return res.status(403).json({ erro: 'Apenas OWNER pode excluir usuários' });
    }

    const [alvo] = await db.execute('SELECT papel FROM usuarios WHERE id = ?', [req.params.id]);
    if (alvo.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
    if (alvo[0].papel === 'OWNER') {
        return res.status(403).json({ erro: 'Não é possível excluir um OWNER' });
    }

    await db.execute('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Usuário excluído' });
});

module.exports = router;

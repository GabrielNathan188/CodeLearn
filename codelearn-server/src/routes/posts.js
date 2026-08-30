const express = require('express');
const db = require('../config/db');
const { autenticar } = require('../middleware/auth');
const { adicionarXP, desbloquearBadge } = require('../services/gamificacao');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const usuarioId = req.query.usuarioId || null;

        const [posts] = await db.execute(
            `SELECT p.*, u.nome AS autor_nome, u.username AS autor_username,
                    (SELECT COUNT(*) FROM post_votos v WHERE v.post_id = p.id) AS votos
             FROM posts p
             JOIN usuarios u ON u.id = p.autor_id
             ORDER BY votos DESC, p.criado_em DESC`
        );

        if (usuarioId) {
            const [votados] = await db.execute(
                'SELECT post_id FROM post_votos WHERE usuario_id = ?',
                [usuarioId]
            );
            const idsVotados = new Set(votados.map(v => v.post_id));
            posts.forEach(p => { p.votado_pelo_usuario = idsVotados.has(p.id); });
        }

        res.json({ posts });
    } catch (err) {
        console.error('[Posts] Erro ao listar:', err);
        res.status(500).json({ erro: 'Erro ao carregar publicações' });
    }
});

router.post('/', autenticar, async (req, res) => {
    try {
        const { titulo, descricao, tag } = req.body;

        if (!titulo || titulo.trim().length < 5) {
            return res.status(400).json({ erro: 'Título muito curto' });
        }
        if (!descricao || descricao.trim().length < 10) {
            return res.status(400).json({ erro: 'Descreva melhor sua dúvida' });
        }

        const [resultado] = await db.execute(
            'INSERT INTO posts (autor_id, titulo, descricao, tag) VALUES (?, ?, ?, ?)',
            [req.usuario.id, titulo.trim(), descricao.trim(), tag || null]
        );

        await desbloquearBadge(db, req.usuario.id, 'first_post');
        const { usuario, subiuNivel } = await adicionarXP(req.usuario.id, 15);

        res.status(201).json({ postId: resultado.insertId, xpGanho: 15, subiuNivel, usuario });
    } catch (err) {
        console.error('[Posts] Erro ao criar:', err);
        res.status(500).json({ erro: 'Erro ao criar publicação' });
    }
});

router.post('/:id/votar', autenticar, async (req, res) => {
    try {
        const postId = req.params.id;
        const usuarioId = req.usuario.id;

        const [votoExistente] = await db.execute(
            'SELECT 1 FROM post_votos WHERE post_id = ? AND usuario_id = ?',
            [postId, usuarioId]
        );

        if (votoExistente.length > 0) {
            await db.execute('DELETE FROM post_votos WHERE post_id = ? AND usuario_id = ?', [postId, usuarioId]);
            return res.json({ votado: false });
        }

        await db.execute('INSERT INTO post_votos (post_id, usuario_id) VALUES (?, ?)', [postId, usuarioId]);
        res.json({ votado: true });
    } catch (err) {
        console.error('[Posts] Erro ao votar:', err);
        res.status(500).json({ erro: 'Erro ao votar' });
    }
});

router.delete('/:id', autenticar, async (req, res) => {
    try {
        const [posts] = await db.execute('SELECT * FROM posts WHERE id = ?', [req.params.id]);
        if (posts.length === 0) return res.status(404).json({ erro: 'Post não encontrado' });

        const post = posts[0];
        const ehDono = post.autor_id === req.usuario.id;
        const ehAdmin = ['ADMIN', 'OWNER'].includes(req.usuario.papel);

        if (!ehDono && !ehAdmin) {
            return res.status(403).json({ erro: 'Sem permissão' });
        }

        await db.execute('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ mensagem: 'Publicação excluída' });
    } catch (err) {
        console.error('[Posts] Erro ao excluir:', err);
        res.status(500).json({ erro: 'Erro ao excluir publicação' });
    }
});

module.exports = router;

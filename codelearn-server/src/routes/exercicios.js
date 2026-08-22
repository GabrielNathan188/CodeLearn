const express = require('express');
const db = require('../config/db');
const { autenticar } = require('../middleware/auth');
const { adicionarXP, desbloquearBadge } = require('../services/gamificacao');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM exercicios ORDER BY id');
    res.json({ exercicios: rows });
});

// Lista os exercícios já concluídos pelo usuário logado
router.get('/concluidos', autenticar, async (req, res) => {
    const [rows] = await db.execute(
        'SELECT exercicio_id FROM usuario_exercicios WHERE usuario_id = ?',
        [req.usuario.id]
    );
    res.json({ concluidos: rows.map(r => r.exercicio_id) });
});

router.post('/:id/concluir', autenticar, async (req, res) => {
    const exercicioId = req.params.id;
    const usuarioId = req.usuario.id;

    const [exercicios] = await db.execute('SELECT * FROM exercicios WHERE id = ?', [exercicioId]);
    if (exercicios.length === 0) {
        return res.status(404).json({ erro: 'Exercício não encontrado' });
    }
    const exercicio = exercicios[0];

    const [jaFeito] = await db.execute(
        'SELECT 1 FROM usuario_exercicios WHERE usuario_id = ? AND exercicio_id = ?',
        [usuarioId, exercicioId]
    );
    if (jaFeito.length > 0) {
        return res.status(409).json({ erro: 'Exercício já concluído' });
    }

    await db.execute(
        'INSERT INTO usuario_exercicios (usuario_id, exercicio_id) VALUES (?, ?)',
        [usuarioId, exercicioId]
    );

    if (exercicio.codigo.includes('loop') || exercicio.codigo.includes('fatorial')) {
        await desbloquearBadge(db, usuarioId, 'loop_master');
    }

    const { usuario, subiuNivel } = await adicionarXP(usuarioId, exercicio.xp);

    res.json({ mensagem: 'Exercício concluído', xpGanho: exercicio.xp, subiuNivel, usuario });
});

module.exports = router;

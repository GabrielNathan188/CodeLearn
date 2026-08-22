const express = require('express');
const db = require('../config/db');
const { autenticar } = require('../middleware/auth');
const { adicionarXP, desbloquearBadge } = require('../services/gamificacao');

const router = express.Router();

// Salva uma troca de mensagem com o CodeBot e concede a badge de uso de IA
router.post('/mensagens', autenticar, async (req, res) => {
    const { mensagem, resposta } = req.body;
    if (!mensagem) return res.status(400).json({ erro: 'Mensagem obrigatória' });

    await db.execute(
        'INSERT INTO mensagens_ia (usuario_id, mensagem, resposta) VALUES (?, ?, ?)',
        [req.usuario.id, mensagem, resposta || null]
    );

    await db.execute('UPDATE usuarios SET usos_ia = usos_ia + 1 WHERE id = ?', [req.usuario.id]);
    await desbloquearBadge(db, req.usuario.id, 'used_ai');

    res.status(201).json({ mensagem: 'Registrado' });
});

router.get('/mensagens', autenticar, async (req, res) => {
    const [rows] = await db.execute(
        'SELECT * FROM mensagens_ia WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 50',
        [req.usuario.id]
    );
    res.json({ mensagens: rows });
});

module.exports = router;

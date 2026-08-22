const express = require('express');
const db = require('../config/db');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM badges ORDER BY id');
    res.json({ badges: rows });
});

// Badges já desbloqueadas pelo usuário logado
router.get('/minhas', autenticar, async (req, res) => {
    const [rows] = await db.execute(
        `SELECT b.codigo, b.nome, b.icone, b.descricao, ub.desbloqueado_em
         FROM usuario_badges ub
         JOIN badges b ON b.id = ub.badge_id
         WHERE ub.usuario_id = ?`,
        [req.usuario.id]
    );
    res.json({ badges: rows });
});

module.exports = router;

const express = require('express');
const db = require('../config/db');
const { desbloquearBadge } = require('../services/gamificacao');

const router = express.Router();

router.get('/', async (req, res) => {
    const limite = Math.min(parseInt(req.query.limite) || 5, 500);

    const [rows] = await db.execute(
        `SELECT id, nome, username, xp, nivel
         FROM usuarios
         ORDER BY xp DESC
         LIMIT ?`,
        [limite]
    );

    // Desbloqueia a badge top3 para quem está entre os 3 primeiros
    const top3 = rows.slice(0, 3);
    for (const usuario of top3) {
        await desbloquearBadge(db, usuario.id, 'top3');
    }

    res.json({ ranking: rows });
});

module.exports = router;

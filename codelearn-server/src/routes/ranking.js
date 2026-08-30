const express = require('express');
const db = require('../config/db');
const { desbloquearBadge } = require('../services/gamificacao');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Sanitizado com parseInt + clamp abaixo, então é seguro interpolar
        // direto na query - o mysql2 tem um bug conhecido ao usar "LIMIT ?"
        // como parâmetro preparado em algumas versões (ER_WRONG_ARGUMENTS).
        const limite = Math.min(parseInt(req.query.limite) || 5, 500);

        const [rows] = await db.query(
            `SELECT id, nome, username, xp, nivel
             FROM usuarios
             ORDER BY xp DESC
             LIMIT ${limite}`
        );

        // Desbloqueia a badge top3 para quem está entre os 3 primeiros
        const top3 = rows.slice(0, 3);
        for (const usuario of top3) {
            await desbloquearBadge(db, usuario.id, 'top3');
        }

        res.json({ ranking: rows });
    } catch (err) {
        console.error('[Ranking] Erro:', err);
        res.status(500).json({ erro: 'Erro ao carregar ranking' });
    }
});

module.exports = router;

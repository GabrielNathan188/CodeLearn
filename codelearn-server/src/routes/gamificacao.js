const express = require('express');
const db = require('../config/db');
const { autenticar } = require('../middleware/auth');
const { desbloquearBadge, adicionarXP } = require('../services/gamificacao');

const router = express.Router();

// Chamado toda vez que o usuário roda um código no editor (+2 XP, badges)
router.post('/codigo-executado', autenticar, async (req, res) => {
    await db.execute('UPDATE usuarios SET codigos_executados = codigos_executados + 1 WHERE id = ?', [req.usuario.id]);

    const [rows] = await db.execute('SELECT codigos_executados FROM usuarios WHERE id = ?', [req.usuario.id]);
    const total = rows[0].codigos_executados;

    await desbloquearBadge(db, req.usuario.id, 'first_code');
    if (total >= 20) {
        await desbloquearBadge(db, req.usuario.id, 'speed_coder');
    }

    const { usuario, subiuNivel } = await adicionarXP(req.usuario.id, 2);

    res.json({ codigosExecutados: total, subiuNivel, usuario });
});

module.exports = router;

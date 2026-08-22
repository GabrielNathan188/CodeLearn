const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
    const [modulos] = await db.execute('SELECT * FROM modulos_roadmap ORDER BY nivel, ordem');
    const [topicos] = await db.execute('SELECT * FROM modulo_topicos');

    const resultado = modulos.map(m => ({
        ...m,
        topicos: topicos.filter(t => t.modulo_id === m.id).map(t => t.nome)
    }));

    res.json({ roadmap: resultado });
});

module.exports = router;

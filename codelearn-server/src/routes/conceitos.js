const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM conceitos ORDER BY id');
        res.json({ conceitos: rows });
    } catch (err) {
        console.error('[Conceitos] Erro:', err);
        res.status(500).json({ erro: 'Erro ao carregar conceitos' });
    }
});

module.exports = router;

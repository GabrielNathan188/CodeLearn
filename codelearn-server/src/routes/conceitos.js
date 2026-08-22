const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM conceitos ORDER BY id');
    res.json({ conceitos: rows });
});

module.exports = router;

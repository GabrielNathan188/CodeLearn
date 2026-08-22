const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { autenticar } = require('../middleware/auth');

const router = express.Router();

function gerarToken(usuario) {
    return jwt.sign(
        { id: usuario.id, username: usuario.username, papel: usuario.papel },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

function sanitizarUsuario(u) {
    const { senha_hash, ...resto } = u;
    return resto;
}

router.post('/registrar', async (req, res) => {
    try {
        const { nome, username, email, password } = req.body;

        if (!nome || nome.trim().length < 3) {
            return res.status(400).json({ erro: 'Nome deve ter pelo menos 3 caracteres' });
        }
        if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            return res.status(400).json({ erro: 'Usuário inválido (letras, números, 3-20 caracteres)' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ erro: 'Email inválido' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ erro: 'Senha deve ter pelo menos 6 caracteres' });
        }

        const usernameLower = username.trim().toLowerCase();
        const emailLower = email.trim().toLowerCase();

        const [existentes] = await db.execute(
            'SELECT id FROM usuarios WHERE username = ? OR email = ?',
            [usernameLower, emailLower]
        );
        if (existentes.length > 0) {
            return res.status(409).json({ erro: 'Usuário ou email já cadastrado' });
        }

        const senhaHash = await bcrypt.hash(password, 10);

        const [resultado] = await db.execute(
            `INSERT INTO usuarios (nome, username, email, senha_hash, papel)
             VALUES (?, ?, ?, ?, 'USER')`,
            [nome.trim(), usernameLower, emailLower, senhaHash]
        );

        const [novoUsuario] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [resultado.insertId]);
        const usuario = novoUsuario[0];

        res.status(201).json({ usuario: sanitizarUsuario(usuario), token: gerarToken(usuario) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
        }

        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE username = ?',
            [username.trim().toLowerCase()]
        );

        if (rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = rows[0];
        const senhaCorreta = await bcrypt.compare(password, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }

        res.json({ usuario: sanitizarUsuario(usuario), token: gerarToken(usuario) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao fazer login' });
    }
});

router.get('/me', autenticar, async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [req.usuario.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({ usuario: sanitizarUsuario(rows[0]) });
});

module.exports = router;

const jwt = require('jsonwebtoken');

/**
 * Exige um token JWT válido no header Authorization: Bearer <token>
 * Preenche req.usuario com { id, username, papel }
 */
function autenticar(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (err) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}

/**
 * Usa junto com autenticar() - exige que o usuário seja ADMIN ou OWNER
 */
function exigirAdmin(req, res, next) {
    if (!req.usuario || !['ADMIN', 'OWNER'].includes(req.usuario.papel)) {
        return res.status(403).json({ erro: 'Acesso restrito a administradores' });
    }
    next();
}

module.exports = { autenticar, exigirAdmin };

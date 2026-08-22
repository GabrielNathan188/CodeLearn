require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
    try {
        await db.query('SELECT 1');
        console.log('[CodeLearn] Conectado ao MySQL com sucesso');
    } catch (err) {
        console.error('[CodeLearn] Falha ao conectar no MySQL:', err.message);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`[CodeLearn] Servidor rodando em http://localhost:${PORT}`);
    });
}

iniciar();

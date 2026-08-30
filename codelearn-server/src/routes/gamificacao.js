const express = require('express');
const db = require('../config/db');
const { autenticar } = require('../middleware/auth');
const { desbloquearBadge, adicionarXP } = require('../services/gamificacao');

const router = express.Router();

// Limite diário para evitar abuso (clicar em "Executar" repetidamente)
const LIMITE_XP_CODIGO_POR_DIA = 15; // no máximo 15 x 2 = 30 XP/dia por essa ação

function hojeYYYYMMDD() {
    return new Date().toISOString().slice(0, 10);
}

// Chamado toda vez que o usuário roda um código no editor
router.post('/codigo-executado', autenticar, async (req, res) => {
    try {
        // Sempre conta a execução (usado em badges/estatísticas)
        await db.execute(
            'UPDATE usuarios SET codigos_executados = codigos_executados + 1 WHERE id = ?',
            [req.usuario.id]
        );

        const [rows] = await db.execute(
            'SELECT codigos_executados, xp_codigo_data, xp_codigo_contagem FROM usuarios WHERE id = ?',
            [req.usuario.id]
        );
        const dadosUsuario = rows[0];
        const total = dadosUsuario.codigos_executados;

        await desbloquearBadge(db, req.usuario.id, 'first_code');
        if (total >= 20) {
            await desbloquearBadge(db, req.usuario.id, 'speed_coder');
        }

        // Verifica/reseta o contador diário de XP
        const hoje = hojeYYYYMMDD();
        const dataSalva = dadosUsuario.xp_codigo_data
            ? new Date(dadosUsuario.xp_codigo_data).toISOString().slice(0, 10)
            : null;

        let contagemHoje = (dataSalva === hoje) ? dadosUsuario.xp_codigo_contagem : 0;

        let usuarioAtualizado, subiuNivel = false, xpGanho = 0, limiteAtingido = false;

        if (contagemHoje < LIMITE_XP_CODIGO_POR_DIA) {
            contagemHoje += 1;
            await db.execute(
                'UPDATE usuarios SET xp_codigo_data = ?, xp_codigo_contagem = ? WHERE id = ?',
                [hoje, contagemHoje, req.usuario.id]
            );

            const resultadoXP = await adicionarXP(req.usuario.id, 2);
            usuarioAtualizado = resultadoXP.usuario;
            subiuNivel = resultadoXP.subiuNivel;
            xpGanho = 2;
        } else {
            limiteAtingido = true;
            const [atual] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [req.usuario.id]);
            usuarioAtualizado = atual[0];
        }

        res.json({
            codigosExecutados: total,
            subiuNivel,
            usuario: usuarioAtualizado,
            xpGanho,
            limiteDiarioAtingido: limiteAtingido
        });
    } catch (err) {
        console.error('[Gamificação] Erro ao registrar execução:', err);
        res.status(500).json({ erro: 'Erro ao registrar execução de código' });
    }
});

module.exports = router;

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const exerciciosRoutes = require('./routes/exercicios');
const conceitosRoutes = require('./routes/conceitos');
const roadmapRoutes = require('./routes/roadmap');
const badgesRoutes = require('./routes/badges');
const postsRoutes = require('./routes/posts');
const rankingRoutes = require('./routes/ranking');
const adminRoutes = require('./routes/admin');
const iaRoutes = require('./routes/ia');
const gamificacaoRoutes = require('./routes/gamificacao');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/exercicios', exerciciosRoutes);
app.use('/api/conceitos', conceitosRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ia', iaRoutes);
app.use('/api/gamificacao', gamificacaoRoutes);

// Tratamento de erro genérico - garante que erros não tratados virem JSON, não HTML
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;

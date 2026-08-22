require('dotenv').config();
const db = require('../src/config/db');

const exercicios = [
    { codigo: 'ex_hello_world', titulo: 'Hello World', descricao: 'Escreva um programa que exiba "Olá, Mundo!" na tela.', dificuldade: 'iniciante', linguagem: 'JavaScript', xp: 10 },
    { codigo: 'ex_soma', titulo: 'Soma de dois números', descricao: 'Crie uma função que recebe dois números e retorna a soma entre eles.', dificuldade: 'iniciante', linguagem: 'JavaScript', xp: 15 },
    { codigo: 'ex_par_impar', titulo: 'Par ou Ímpar', descricao: 'Crie uma função que verifica se um número é par ou ímpar.', dificuldade: 'iniciante', linguagem: 'JavaScript', xp: 15 },
    { codigo: 'ex_fatorial', titulo: 'Número Fatorial', descricao: 'Calcule o fatorial de um número.', dificuldade: 'medio', linguagem: 'JavaScript', xp: 25 },
    { codigo: 'ex_palindromo', titulo: 'Verificador de Palíndromo', descricao: 'Verifique se uma palavra é um palíndromo.', dificuldade: 'medio', linguagem: 'JavaScript', xp: 30 },
    { codigo: 'ex_ordenacao', titulo: 'Ordenação Bubble Sort', descricao: 'Implemente o algoritmo Bubble Sort.', dificuldade: 'avancado', linguagem: 'JavaScript', xp: 50 },
    { codigo: 'ex_fibonacci', titulo: 'Sequência de Fibonacci', descricao: 'Gere os primeiros N números da sequência de Fibonacci.', dificuldade: 'avancado', linguagem: 'JavaScript', xp: 40 }
];

const conceitos = [
    { codigo: 'variables', titulo: 'Variáveis', categoria: 'fundamentos', dificuldade: 'iniciante' },
    { codigo: 'conditionals', titulo: 'Condicionais', categoria: 'fundamentos', dificuldade: 'iniciante' },
    { codigo: 'loops', titulo: 'Loops', categoria: 'fundamentos', dificuldade: 'iniciante' },
    { codigo: 'functions', titulo: 'Funções', categoria: 'fundamentos', dificuldade: 'iniciante' },
    { codigo: 'arrays', titulo: 'Listas/Arrays', categoria: 'estruturas', dificuldade: 'iniciante' },
    { codigo: 'oop', titulo: 'Classes e Objetos', categoria: 'paradigmas', dificuldade: 'intermediario' },
    { codigo: 'data_structures', titulo: 'Estruturas de Dados', categoria: 'estruturas', dificuldade: 'intermediario' },
    { codigo: 'apis', titulo: 'APIs', categoria: 'web', dificuldade: 'intermediario' },
    { codigo: 'database', titulo: 'Banco de Dados', categoria: 'dados', dificuldade: 'intermediario' },
    { codigo: 'git', titulo: 'Git', categoria: 'ferramentas', dificuldade: 'iniciante' }
];

const roadmap = {
    iniciante: [
        { codigo: 'logic', titulo: 'Lógica de Programação', duracao: '2-3 semanas', topicos: ['variáveis', 'condicionais', 'loops', 'funções'] },
        { codigo: 'language', titulo: 'Escolha uma linguagem', duracao: '3-4 semanas', topicos: ['JavaScript', 'Python', 'sintaxe', 'tipos'] },
        { codigo: 'project', titulo: 'Primeiro projeto real', duracao: '2 semanas', topicos: ['planejamento', 'implementação', 'debug'] },
        { codigo: 'git', titulo: 'Git & GitHub', duracao: '1 semana', topicos: ['commit', 'branch', 'push', 'pull'] }
    ],
    intermediario: [
        { codigo: 'data_structures', titulo: 'Estruturas de Dados', duracao: '4 semanas', topicos: ['arrays', 'listas', 'pilhas', 'filas', 'árvores'] },
        { codigo: 'algorithms', titulo: 'Algoritmos', duracao: '4-6 semanas', topicos: ['ordenação', 'busca', 'recursão', 'complexidade'] },
        { codigo: 'oop', titulo: 'Orientação a Objetos', duracao: '3 semanas', topicos: ['classes', 'herança', 'polimorfismo'] },
        { codigo: 'database', titulo: 'Banco de Dados', duracao: '3 semanas', topicos: ['SQL', 'modelagem', 'relacionamentos', 'NoSQL'] }
    ],
    avancado: [
        { codigo: 'patterns', titulo: 'Design Patterns', duracao: '4 semanas', topicos: ['GoF', 'criacionais', 'estruturais', 'comportamentais'] },
        { codigo: 'architecture', titulo: 'Arquitetura de Software', duracao: '6 semanas', topicos: ['microserviços', 'MVC', 'Clean Architecture', 'DDD'] },
        { codigo: 'testing', titulo: 'Testes Automatizados', duracao: '3 semanas', topicos: ['unitários', 'integração', 'TDD'] },
        { codigo: 'devops', titulo: 'DevOps & Deploy', duracao: '4 semanas', topicos: ['CI/CD', 'Docker', 'cloud', 'monitoramento'] }
    ]
};

const badges = [
    { codigo: 'first_code', nome: 'Primeiro código', icone: '🚀', descricao: 'Executou seu primeiro código' },
    { codigo: 'loop_master', nome: 'Loop mestre', icone: '🔁', descricao: 'Dominou os laços de repetição' },
    { codigo: 'streak_7', nome: '7 dias streak', icone: '🔥', descricao: 'Manteve 7 dias consecutivos' },
    { codigo: 'first_post', nome: '1º post fórum', icone: '💬', descricao: 'Fez sua primeira publicação' },
    { codigo: 'used_ai', nome: 'Usou IA', icone: '🤖', descricao: 'Conversou com o CodeBot' },
    { codigo: 'top3', nome: 'Top 3', icone: '🏆', descricao: 'Entrou no top 3 do ranking' },
    { codigo: 'speed_coder', nome: 'Speed coder', icone: '⚡', descricao: 'Executou 20 códigos' },
    { codigo: 'level_10', nome: 'Nível 10', icone: '💎', descricao: 'Alcançou o nível 10' }
];

async function seed() {
    console.log('[Seed] Inserindo exercícios...');
    for (const ex of exercicios) {
        await db.execute(
            `INSERT INTO exercicios (codigo, titulo, descricao, dificuldade, linguagem, xp)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE titulo = VALUES(titulo)`,
            [ex.codigo, ex.titulo, ex.descricao, ex.dificuldade, ex.linguagem, ex.xp]
        );
    }

    console.log('[Seed] Inserindo conceitos...');
    for (const c of conceitos) {
        await db.execute(
            `INSERT INTO conceitos (codigo, titulo, categoria, dificuldade)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE titulo = VALUES(titulo)`,
            [c.codigo, c.titulo, c.categoria, c.dificuldade]
        );
    }

    console.log('[Seed] Inserindo badges...');
    for (const b of badges) {
        await db.execute(
            `INSERT INTO badges (codigo, nome, icone, descricao)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE nome = VALUES(nome)`,
            [b.codigo, b.nome, b.icone, b.descricao]
        );
    }

    console.log('[Seed] Inserindo roadmap...');
    const [jaTemRoadmap] = await db.execute('SELECT COUNT(*) AS total FROM modulos_roadmap');
    if (jaTemRoadmap[0].total > 0) {
        console.log('[Seed] Roadmap já populado, pulando (delete a tabela manualmente se quiser recriar)');
        console.log('[Seed] Concluído com sucesso!');
        process.exit(0);
    }

    let ordem = 0;
    for (const [nivel, modulos] of Object.entries(roadmap)) {
        for (const m of modulos) {
            const [resultado] = await db.execute(
                `INSERT INTO modulos_roadmap (nivel, titulo, duracao, ordem)
                 VALUES (?, ?, ?, ?)`,
                [nivel, m.titulo, m.duracao, ordem++]
            );
            const moduloId = resultado.insertId;

            for (const topico of m.topicos) {
                await db.execute(
                    'INSERT INTO modulo_topicos (modulo_id, nome) VALUES (?, ?)',
                    [moduloId, topico]
                );
            }
        }
    }

    console.log('[Seed] Concluído com sucesso!');
    process.exit(0);
}

seed().catch(err => {
    console.error('[Seed] Erro:', err);
    process.exit(1);
});

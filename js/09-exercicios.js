/* ============================================
   CodeLearn - Exercícios
   ============================================ */

const Exercises = {
    data: [
        {
            id: 'ex_hello_world',
            difficulty: 'iniciante',
            title: 'Hello World',
            description: 'Escreva um programa que exiba "Olá, Mundo!" na tela.',
            language: 'JavaScript',
            xp: 10,
            steps: [
                'Crie uma função ou use console.log diretamente',
                'Exiba a mensagem "Olá, Mundo!"',
                'Execute o código no editor'
            ],
            extra: 'Tente fazer também em Python e compare as diferenças.'
        },
        {
            id: 'ex_soma',
            difficulty: 'iniciante',
            title: 'Soma de dois números',
            description: 'Crie uma função que recebe dois números e retorna a soma entre eles.',
            language: 'JavaScript',
            xp: 15,
            steps: [
                'Defina uma função chamada soma que recebe dois parâmetros',
                'Retorne a soma dos dois parâmetros',
                'Teste com diferentes valores'
            ],
            extra: 'Adicione uma validação para garantir que os parâmetros são números.'
        },
        {
            id: 'ex_par_impar',
            difficulty: 'iniciante',
            title: 'Par ou Ímpar',
            description: 'Crie uma função que verifica se um número é par ou ímpar.',
            language: 'JavaScript',
            xp: 15,
            steps: [
                'Use o operador módulo (%) para verificar o resto da divisão',
                'Se o resto for 0, o número é par',
                'Retorne "par" ou "ímpar" conforme o caso'
            ],
            extra: 'Trate o caso onde o input não é um número.'
        },
        {
            id: 'ex_fatorial',
            difficulty: 'medio',
            title: 'Número Fatorial',
            description: 'Calcule o fatorial de um número (n! = n × (n-1) × ... × 1).',
            language: 'JavaScript',
            xp: 25,
            steps: [
                'O fatorial de 0 e 1 é 1',
                'Use um loop para multiplicar os números',
                'Retorne o resultado final'
            ],
            extra: 'Implemente também de forma recursiva.'
        },
        {
            id: 'ex_loop_contagem',
            difficulty: 'iniciante',
            title: 'Contagem regressiva',
            description: 'Faça um loop que conta de 10 até 0 e exibe cada número.',
            language: 'JavaScript',
            xp: 15,
            steps: [
                'Use um laço for ou while',
                'Comece em 10 e vá decrementando até 0',
                'Exiba cada número no console'
            ],
            extra: 'Quando chegar em 0, exiba "Fogo!" ao invés do número.'
        },
        {
            id: 'ex_palindromo',
            difficulty: 'medio',
            title: 'Verificador de Palíndromo',
            description: 'Verifique se uma palavra é um palíndromo (lê-se igual de trás para frente).',
            language: 'JavaScript',
            xp: 30,
            steps: [
                'Remova espaços e converta para minúsculas',
                'Inverta a string',
                'Compare a string original com a invertida'
            ],
            extra: 'Faça funcionar com frases completas, ignorando pontuação.'
        },
        {
            id: 'ex_array_media',
            difficulty: 'medio',
            title: 'Média de array',
            description: 'Calcule a média dos números contidos em um array.',
            language: 'JavaScript',
            xp: 20,
            steps: [
                'Some todos os elementos do array',
                'Divida a soma pela quantidade de elementos',
                'Retorne a média'
            ],
            extra: 'Use o método reduce para fazer a soma.'
        },
        {
            id: 'ex_maior_numero',
            difficulty: 'iniciante',
            title: 'Maior número',
            description: 'Encontre o maior número em um array.',
            language: 'JavaScript',
            xp: 15,
            steps: [
                'Inicialize uma variável com o primeiro elemento',
                'Percorra o array comparando cada elemento',
                'Atualize o maior quando encontrar um número maior'
            ],
            extra: 'Tente resolver usando Math.max e spread operator.'
        },
        {
            id: 'ex_inverter_string',
            difficulty: 'medio',
            title: 'Inverter string',
            description: 'Crie uma função que inverte os caracteres de uma string.',
            language: 'JavaScript',
            xp: 20,
            steps: [
                'Converta a string para array',
                'Inverta o array',
                'Junte novamente em string'
            ],
            extra: 'Faça sem usar métodos prontos como reverse().'
        },
        {
            id: 'ex_ordenacao',
            difficulty: 'avancado',
            title: 'Ordenação Bubble Sort',
            description: 'Implemente o algoritmo Bubble Sort para ordenar um array.',
            language: 'JavaScript',
            xp: 50,
            steps: [
                'Compare elementos adjacentes e troque se estiverem fora de ordem',
                'Repita o processo para cada elemento',
                'Otimize parando quando não houver mais trocas'
            ],
            extra: 'Implemente também o Selection Sort e compare.'
        },
        {
            id: 'ex_fibonacci',
            difficulty: 'avancado',
            title: 'Sequência de Fibonacci',
            description: 'Gere os primeiros N números da sequência de Fibonacci.',
            language: 'JavaScript',
            xp: 40,
            steps: [
                'Os dois primeiros números são 0 e 1',
                'Cada número seguinte é a soma dos dois anteriores',
                'Retorne um array com os N números'
            ],
            extra: 'Implemente com memoização para otimizar a versão recursiva.'
        },
        {
            id: 'ex_validador_cpf',
            difficulty: 'avancado',
            title: 'Validador de CPF',
            description: 'Crie uma função que valida um número de CPF.',
            language: 'JavaScript',
            xp: 60,
            steps: [
                'Remova caracteres não numéricos',
                'Verifique se tem 11 dígitos e não é sequência repetida',
                'Calcule os dois dígitos verificadores'
            ],
            extra: 'Formate o CPF para exibição: 000.000.000-00.'
        }
    ],

    currentFilter: 'all',
    completedIds: [],

    async init() {
        await this.carregarConcluidos();
        this.render();
    },

    async carregarConcluidos() {
        if (!Auth.currentUser) {
            this.completedIds = [];
            return;
        }
        try {
            const { concluidos } = await Api.get('/exercicios/concluidos', true);
            this.completedIds = concluidos;
        } catch (e) {
            this.completedIds = [];
        }
    },

    filter(filter, btn) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
    },

    render() {
        const container = document.getElementById('exercisesList');
        if (!container) return;

        let filtered = this.data;
        if (this.currentFilter !== 'all') {
            filtered = this.data.filter(e => e.difficulty === this.currentFilter);
        }

        container.innerHTML = filtered.map((ex, index) => {
            const isCompleted = this.completedIds.includes(ex.id);
            return `
                <div class="exercise-item ${isCompleted ? 'completed' : ''}" onclick="Exercises.openModal('${ex.id}')" style="animation: fadeUp 0.4s ease ${index * 0.03}s both;">
                    <span class="exercise-difficulty difficulty-${ex.difficulty}">${ex.difficulty.toUpperCase()}</span>
                    <div class="exercise-info">
                        <h4>${ex.title}</h4>
                        <p>${ex.description}</p>
                    </div>
                    <span class="exercise-lang">${ex.language}</span>
                    <span class="exercise-xp"><i class="ri-zap-fill"></i> ${ex.xp} XP</span>
                    ${isCompleted ? '<span class="exercise-check"><i class="ri-check-circle-fill"></i></span>' : ''}
                </div>
            `;
        }).join('');
    },

    openModal(exerciseId) {
        const exercise = this.data.find(e => e.id === exerciseId);
        if (!exercise) return;

        const completed = this.completedIds.includes(exerciseId);

        const modal = document.getElementById('exerciseModal');
        const content = document.getElementById('exerciseModalContent');

        content.innerHTML = `
            <div class="exercise-modal-header">
                <span class="exercise-difficulty difficulty-${exercise.difficulty}">${exercise.difficulty.toUpperCase()}</span>
                <span class="exercise-lang">${exercise.language}</span>
            </div>
            <h2>${exercise.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px;">${exercise.description}</p>
            
            <div class="exercise-modal-section">
                <h4>Passos sugeridos</h4>
                <ul>
                    ${exercise.steps.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            
            <div class="exercise-modal-section">
                <h4>Desafio extra</h4>
                <p style="color: var(--text-muted);">${exercise.extra}</p>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: center; margin-top: 24px; flex-wrap: wrap;">
                <span class="exercise-reward"><i class="ri-zap-fill"></i> +${exercise.xp} XP</span>
                ${completed 
                    ? '<span style="color: var(--accent); font-weight: 600;"><i class="ri-check-circle-fill"></i> Concluído</span>'
                    : `<button class="btn btn-primary" onclick="Exercises.complete('${exercise.id}')"><i class="ri-check-line"></i> Marcar como concluído</button>`
                }
                <button class="btn btn-secondary" onclick="navigateTo('editor'); Exercises.closeModal();"><i class="ri-code-s-slash-line"></i> Abrir editor</button>
            </div>
        `;
        
        modal.classList.add('active');
    },

    closeModal() {
        document.getElementById('exerciseModal').classList.remove('active');
    },

    async complete(exerciseId) {
        if (!Auth.requireAuth()) {
            this.closeModal();
            return;
        }

        const exercise = this.data.find(e => e.id === exerciseId);
        if (!exercise) return;

        try {
            const resultado = await Api.post(`/exercicios/${exerciseId}/concluir`, {}, true);
            this.completedIds.push(exerciseId);

            this.closeModal();
            this.render();
            await Gamification.aplicarResultadoXP(resultado, resultado.xpGanho);
        } catch (e) {
            Utils.toast(e.message, 'error');
        }
    }
};

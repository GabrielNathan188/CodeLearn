/* ============================================
   CodeLearn - Roadmap
   ============================================ */

const Roadmap = {
    data: {
        iniciante: [
            { number: '01', title: 'Lógica de Programação', description: 'Aprenda a pensar como um programador. Variáveis, condicionais, loops e funções.', time: '2-3 semanas' },
            { number: '02', title: 'Escolha uma linguagem', description: 'JavaScript ou Python são ótimas para começar. Foque em dominar uma primeiro.', time: '3-4 semanas' },
            { number: '03', title: 'Primeiro projeto real', description: 'Construa algo útil. Um site, um script de automação ou uma aplicação simples.', time: '2 semanas' },
            { number: '04', title: 'Git & GitHub', description: 'Aprenda controle de versão. Essencial para qualquer desenvolvedor profissional.', time: '1 semana' }
        ],
        intermediario: [
            { number: '01', title: 'Estruturas de Dados', description: 'Arrays, listas ligadas, pilhas, filas, árvores e grafos. Fundamentos para código eficiente.', time: '4 semanas' },
            { number: '02', title: 'Algoritmos', description: 'Ordenação, busca, recursão e complexidade de tempo. Resolva problemas de forma otimizada.', time: '4-6 semanas' },
            { number: '03', title: 'Orientação a Objetos', description: 'Classes, objetos, herança, polimorfismo e encapsulamento. Organize seu código.', time: '3 semanas' },
            { number: '04', title: 'Banco de Dados', description: 'SQL, modelagem de dados, relacionamentos e NoSQL. Persista informações.', time: '3 semanas' }
        ],
        avancado: [
            { number: '01', title: 'Design Patterns', description: 'Padrões de projeto GoF. Soluções consolidadas para problemas comuns.', time: '4 semanas' },
            { number: '02', title: 'Arquitetura de Software', description: 'Microserviços, MVC, Clean Architecture, DDD. Projete sistemas escaláveis.', time: '6 semanas' },
            { number: '03', title: 'Testes Automatizados', description: 'Unitários, integração, TDD. Garanta qualidade e confiança no seu código.', time: '3 semanas' },
            { number: '04', title: 'DevOps & Deploy', description: 'CI/CD, Docker, cloud, monitoramento. Coloque sua aplicação no ar.', time: '4 semanas' }
        ]
    },

    init() {
        this.render('iniciante');
    },

    switchTab(tab, btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render(tab);
    },

    render(tab) {
        const container = document.getElementById('roadmapCards');
        if (!container) return;
        
        const items = this.data[tab] || [];
        
        container.innerHTML = items.map((item, index) => `
            <div class="roadmap-card" style="animation: fadeUp 0.5s ease ${index * 0.1}s both;">
                <span class="card-number">${item.number}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="card-time"><i class="ri-time-line"></i> ${item.time}</span>
            </div>
        `).join('');
    }
};

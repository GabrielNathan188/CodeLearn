/* ============================================
   CodeLearn - Conceitos
   Cards interativos com explicação e código
   ============================================ */

const Concepts = {
    data: [
        {
            icon: 'ri-braces-line',
            title: 'Variáveis',
            short: 'Armazene valores na memória',
            explanation: 'Variáveis são como "caixas" na memória do computador onde guardamos valores. Cada variável tem um nome e pode armazenar diferentes tipos de dados como números, textos e booleanos.',
            example: 'Em JavaScript usamos let para criar variáveis que podem mudar de valor e const para valores fixos.',
            code: `// Declarando variáveis
<span class="code-keyword">let</span> nome = <span class="code-string">"Maria"</span>;
<span class="code-keyword">const</span> PI = <span class="code-function">3.14159</span>;

<span class="code-comment">// Podemos alterar variáveis let</span>
nome = <span class="code-string">"João"</span>;

<span class="code-comment">// Tipos comuns</span>
<span class="code-keyword">let</span> idade = <span class="code-function">25</span>;           <span class="code-comment">// número</span>
<span class="code-keyword">let</span> ativo = <span class="code-function">true</span>;        <span class="code-comment">// booleano</span>
<span class="code-keyword">let</span> lista = [];            <span class="code-comment">// array</span>`
        },
        {
            icon: 'ri-git-branch-line',
            title: 'Condicionais',
            short: 'Tome decisões no código',
            explanation: 'Condicionais permitem que o programa execute diferentes blocos de código dependendo de uma condição. É o famoso "se... senão".',
            example: 'Usamos if para verificar uma condição, else if para condições adicionais e else para o caso padrão.',
            code: `<span class="code-keyword">let</span> idade = <span class="code-function">18</span>;

<span class="code-keyword">if</span> (idade >= <span class="code-function">18</span>) {
    <span class="code-function">console</span>.<span class="code-function">log</span>(<span class="code-string">"Maior de idade"</span>);
} <span class="code-keyword">else</span> <span class="code-keyword">if</span> (idade >= <span class="code-function">16</span>) {
    <span class="code-function">console</span>.<span class="code-function">log</span>(<span class="code-string">"Pode votar"</span>);
} <span class="code-keyword">else</span> {
    <span class="code-function">console</span>.<span class="code-function">log</span>(<span class="code-string">"Menor de idade"</span>);
}

<span class="code-comment">// Operador ternário (if curto)</span>
<span class="code-keyword">let</span> status = idade >= <span class="code-function">18</span> ? <span class="code-string">"Adulto"</span> : <span class="code-string">"Menor"</span>;`
        },
        {
            icon: 'ri-refresh-line',
            title: 'Loops',
            short: 'Repita ações automaticamente',
            explanation: 'Loops (ou laços) permitem executar um bloco de código várias vezes sem precisar repetir o código manualmente. Perfeito para trabalhar com listas.',
            example: 'Os mais comuns são for (contador), while (condição) e for...of (iterar listas).',
            code: `<span class="code-comment">// For tradicional</span>
<span class="code-keyword">for</span> (<span class="code-keyword">let</span> i = <span class="code-function">0</span>; i < <span class="code-function">5</span>; i++) {
    <span class="code-function">console</span>.<span class="code-function">log</span>(<span class="code-string">"Número: "</span> + i);
}

<span class="code-comment">// For...of para arrays</span>
<span class="code-keyword">let</span> frutas = [<span class="code-string">"maçã"</span>, <span class="code-string">"banana"</span>, <span class="code-string">"uva"</span>];
<span class="code-keyword">for</span> (<span class="code-keyword">let</span> fruta <span class="code-keyword">of</span> frutas) {
    <span class="code-function">console</span>.<span class="code-function">log</span>(fruta);
}

<span class="code-comment">// While</span>
<span class="code-keyword">let</span> contador = <span class="code-function">0</span>;
<span class="code-keyword">while</span> (contador < <span class="code-function">3</span>) {
    <span class="code-function">console</span>.<span class="code-function">log</span>(contador);
    contador++;
}`
        },
        {
            icon: 'ri-function-line',
            title: 'Funções',
            short: 'Reutilize blocos de código',
            explanation: 'Funções são blocos de código que executam uma tarefa específica. Elas recebem dados (parâmetros), processam e podem retornar um resultado. Evitam repetição.',
            example: 'Uma função é definida uma vez e pode ser chamada várias vezes em diferentes lugares do programa.',
            code: `<span class="code-comment">// Declarando uma função</span>
<span class="code-keyword">function</span> <span class="code-function">somar</span>(a, b) {
    <span class="code-keyword">return</span> a + b;
}

<span class="code-comment">// Chamando a função</span>
<span class="code-keyword">let</span> resultado = <span class="code-function">somar</span>(<span class="code-function">10</span>, <span class="code-function">5</span>);
<span class="code-function">console</span>.<span class="code-function">log</span>(resultado); <span class="code-comment">// 15</span>

<span class="code-comment">// Arrow function (ES6+)</span>
<span class="code-keyword">const</span> <span class="code-function">dobrar</span> = (x) => x * <span class="code-function">2</span>;

<span class="code-comment">// Função sem retorno</span>
<span class="code-keyword">function</span> <span class="code-function">saudacao</span>(nome) {
    <span class="code-function">console</span>.<span class="code-function">log</span>(<span class="code-string">"Olá, "</span> + nome + <span class="code-string">"!"</span>);
}`
        },
        {
            icon: 'ri-list-check',
            title: 'Listas/Arrays',
            short: 'Coleções ordenadas de dados',
            explanation: 'Arrays (ou listas) armazenam múltiplos valores em uma única variável. Os itens são acessados por índice (posição), começando do zero.',
            example: 'Arrays possuem métodos úteis como push, pop, map, filter e reduce para manipular dados.',
            code: `<span class="code-comment">// Criando arrays</span>
<span class="code-keyword">let</span> numeros = [<span class="code-function">1</span>, <span class="code-function">2</span>, <span class="code-function">3</span>, <span class="code-function">4</span>, <span class="code-function">5</span>];
<span class="code-keyword">let</span> vazio = [];

<span class="code-comment">// Acessando elementos (índice começa em 0)</span>
<span class="code-function">console</span>.<span class="code-function">log</span>(numeros[<span class="code-function">0</span>]); <span class="code-comment">// 1</span>
<span class="code-function">console</span>.<span class="code-function">log</span>(numeros.<span class="code-function">length</span>); <span class="code-comment">// 5</span>

<span class="code-comment">// Métodos úteis</span>
numeros.<span class="code-function">push</span>(<span class="code-function">6</span>);          <span class="code-comment">// adiciona no fim</span>
numeros.<span class="code-function">pop</span>();            <span class="code-comment">// remove último</span>

<span class="code-comment">// Map - transforma cada elemento</span>
<span class="code-keyword">let</span> dobrados = numeros.<span class="code-function">map</span>(n => n * <span class="code-function">2</span>);`
        },
        {
            icon: 'ri-box-3-line',
            title: 'Classes e Objetos',
            short: 'Programação orientada a objetos',
            explanation: 'Objetos agrupam dados (propriedades) e comportamentos (métodos). Classes são "moldes" para criar objetos com a mesma estrutura.',
            example: 'POO ajuda a organizar código complexo em entidades reais do mundo, como Usuario, Produto, Carrinho.',
            code: `<span class="code-comment">// Definindo uma classe</span>
<span class="code-keyword">class</span> <span class="code-function">Pessoa</span> {
    <span class="code-keyword">constructor</span>(nome, idade) {
        <span class="code-keyword">this</span>.nome = nome;
        <span class="code-keyword">this</span>.idade = idade;
    }
    
    <span class="code-function">falar</span>() {
        <span class="code-keyword">return</span> <span class="code-string">"Olá, sou "</span> + <span class="code-keyword">this</span>.nome;
    }
    
    <span class="code-function">fazerAniversario</span>() {
        <span class="code-keyword">this</span>.idade++;
    }
}

<span class="code-comment">// Criando objetos (instâncias)</span>
<span class="code-keyword">let</span> maria = <span class="code-keyword">new</span> <span class="code-function">Pessoa</span>(<span class="code-string">"Maria"</span>, <span class="code-function">25</span>);
<span class="code-function">console</span>.<span class="code-function">log</span>(maria.<span class="code-function">falar</span>());
maria.<span class="code-function">fazerAniversario</span>();

<span class="code-comment">// Herança</span>
<span class="code-keyword">class</span> <span class="code-function">Estudante</span> <span class="code-keyword">extends</span> <span class="code-function">Pessoa</span> {
    <span class="code-keyword">constructor</span>(nome, idade, curso) {
        <span class="code-keyword">super</span>(nome, idade);
        <span class="code-keyword">this</span>.curso = curso;
    }
}`
        },
        {
            icon: 'ri-database-2-line',
            title: 'Estruturas de Dados',
            short: 'Organize dados eficientemente',
            explanation: 'Estruturas de dados são formas especializadas de organizar informações para que operações sejam mais eficientes. Cada uma serve para um tipo de problema.',
            example: 'As principais são: Pilhas (LIFO), Filas (FIFO), Listas Ligadas, Árvores e Grafos.',
            code: `<span class="code-comment">// Pilha - LIFO (último a entrar, primeiro a sair)</span>
<span class="code-keyword">class</span> <span class="code-function">Pilha</span> {
    <span class="code-keyword">constructor</span>() { <span class="code-keyword">this</span>.itens = []; }
    <span class="code-function">empilhar</span>(item) { <span class="code-keyword">this</span>.itens.<span class="code-function">push</span>(item); }
    <span class="code-function">desempilhar</span>() { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.itens.<span class="code-function">pop</span>(); }
    <span class="code-function">topo</span>() { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.itens[<span class="code-keyword">this</span>.itens.<span class="code-function">length</span> - <span class="code-function">1</span>]; }
}

<span class="code-comment">// Fila - FIFO (primeiro a entrar, primeiro a sair)</span>
<span class="code-keyword">class</span> <span class="code-function">Fila</span> {
    <span class="code-keyword">constructor</span>() { <span class="code-keyword">this</span>.itens = []; }
    <span class="code-function">enfileirar</span>(item) { <span class="code-keyword">this</span>.itens.<span class="code-function">push</span>(item); }
    <span class="code-function">desenfileirar</span>() { <span class="code-keyword">return</span> <span class="code-keyword">this</span>.itens.<span class="code-function">shift</span>(); }
}`
        },
        {
            icon: 'ri-plug-line',
            title: 'APIs',
            short: 'Conecte seu app ao mundo',
            explanation: 'API (Interface de Programação de Aplicações) é um conjunto de regras que permite softwares se comunicarem. Você envia uma requisição e recebe dados de volta.',
            example: 'Usamos fetch em JavaScript para consumir APIs REST e receber dados em formato JSON.',
            code: `<span class="code-comment">// Consumindo uma API com fetch</span>
<span class="code-keyword">async</span> <span class="code-keyword">function</span> <span class="code-function">buscarUsuario</span>(id) {
    <span class="code-keyword">try</span> {
        <span class="code-keyword">const</span> resposta = <span class="code-keyword">await</span> <span class="code-function">fetch</span>(
            <span class="code-string">\`https://api.exemplo.com/users/\${id}\`</span>
        );
        <span class="code-keyword">const</span> dados = <span class="code-keyword">await</span> resposta.<span class="code-function">json</span>();
        <span class="code-keyword">return</span> dados;
    } <span class="code-keyword">catch</span> (erro) {
        <span class="code-function">console</span>.<span class="code-function">error</span>(<span class="code-string">"Erro:"</span>, erro);
    }
}

<span class="code-comment">// Métodos HTTP comuns:</span>
<span class="code-comment">// GET    - buscar dados</span>
<span class="code-comment">// POST   - criar dados</span>
<span class="code-comment">// PUT    - atualizar dados</span>
<span class="code-comment">// DELETE - remover dados</span>`
        },
        {
            icon: 'ri-hard-drive-2-line',
            title: 'Banco de Dados',
            short: 'Persista informações',
            explanation: 'Bancos de dados armazenam informações de forma organizada e permanente. Os relacionais (SQL) usam tabelas; os não-relacionais (NoSQL) usam documentos.',
            example: 'SQL é ótimo para dados estruturados e relacionamentos. NoSQL escala melhor para dados não estruturados.',
            code: `<span class="code-comment">-- SQL: Buscando dados</span>
<span class="code-keyword">SELECT</span> nome, email
<span class="code-keyword">FROM</span> usuarios
<span class="code-keyword">WHERE</span> idade > <span class="code-function">18</span>
<span class="code-keyword">ORDER BY</span> nome <span class="code-keyword">ASC</span>;

<span class="code-comment">-- SQL: Inserindo dados</span>
<span class="code-keyword">INSERT INTO</span> usuarios (nome, email, idade)
<span class="code-keyword">VALUES</span> (<span class="code-string">'Maria'</span>, <span class="code-string">'maria@email.com'</span>, <span class="code-function">25</span>);

<span class="code-comment">-- SQL: Relacionamento com JOIN</span>
<span class="code-keyword">SELECT</span> u.nome, p.titulo
<span class="code-keyword">FROM</span> usuarios u
<span class="code-keyword">INNER JOIN</span> posts p <span class="code-keyword">ON</span> u.id = p.usuario_id;`
        },
        {
            icon: 'ri-git-repository-line',
            title: 'Git',
            short: 'Controle de versão',
            explanation: 'Git é um sistema de controle de versão distribuído. Ele rastreia mudanças no código, permite colaboração e voltar a versões anteriores.',
            example: 'GitHub, GitLab e BitBucket são plataformas que hospedam repositórios Git na nuvem.',
            code: `<span class="code-comment"># Comandos essenciais do Git</span>

<span class="code-comment"># Inicializa um repositório</span>
git init

<span class="code-comment"># Verifica status dos arquivos</span>
git status

<span class="code-comment"># Adiciona arquivos para commit</span>
git add .
git add arquivo.js

<span class="code-comment"># Cria um commit com mensagem</span>
git commit -m <span class="code-string">"feat: adiciona login"</span>

<span class="code-comment"># Envia para o repositório remoto</span>
git push origin main

<span class="code-comment"># Baixa atualizações</span>
git pull origin main

<span class="code-comment"># Cria e muda de branch</span>
git checkout -b feature/nova-funcionalidade`
        }
    ],

    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('conceptsGrid');
        if (!container) return;
        
        container.innerHTML = this.data.map((concept, index) => `
            <div class="concept-card" onclick="Concepts.toggle(${index}, this)" style="animation: fadeUp 0.5s ease ${index * 0.05}s both;">
                <div class="concept-icon"><i class="${concept.icon}"></i></div>
                <h3>${concept.title}</h3>
                <p class="concept-short">${concept.short}</p>
                <div class="concept-detail">
                    <h4>O que é?</h4>
                    <p>${concept.explanation}</p>
                    <h4>Como funciona?</h4>
                    <p>${concept.example}</p>
                    <h4>Exemplo de código</h4>
                    <pre><code>${concept.code}</code></pre>
                </div>
            </div>
        `).join('');
    },

    toggle(index, element) {
        // Fecha outros cards expandidos
        document.querySelectorAll('.concept-card.expanded').forEach(card => {
            if (card !== element) {
                card.classList.remove('expanded');
            }
        });
        
        element.classList.toggle('expanded');
    }
};

/* ============================================
   CodeLearn - IA CodeBot
   Respostas simuladas com arquitetura pronta
   para integração com API real (Anthropic, etc.)
   
   ⚠️ Em produção: a API key NUNCA deve ficar no
   frontend. Use uma camada backend segura.
   ============================================ */

const AI = {
    // Respostas pré-definidas simuladas
    responses: {
        variaveis: 'Variáveis são espaços na memória para armazenar valores. Pense nelas como "caixas rotuladas".\n\nEm JavaScript:\n- <code>let</code> para valores que mudam\n- <code>const</code> para valores fixos\n\nExemplo:\n<code>let nome = "Maria";</code>\n<code>const PI = 3.14;</code>',
        
        funcoes: 'Funções são blocos de código reutilizáveis que executam uma tarefa. Elas:\n\n1. Recebem dados (parâmetros)\n2. Processam esses dados\n3. Podem retornar um resultado\n\nSintaxe básica:\n<code>function nome(param1, param2) {\n  // lógica aqui\n  return resultado;\n}</code>\n\nAs funções evitam repetição e organizam o código!',
        
        loops: 'Loops servem para repetir código. Os principais:\n\n• <code>for</code> - quando sabe quantas vezes repetir\n• <code>while</code> - enquanto uma condição for verdadeira\n• <code>for...of</code> - para iterar arrays\n\nExemplo for:\n<code>for (let i = 0; i < 10; i++) {\n  console.log(i);\n}</code>',
        
        condicionais: 'Condicionais tomam decisões no código:\n\n<code>if (condicao) {\n  // verdadeiro\n} else if (outraCondicao) {\n  // outra opção\n} else {\n  // falso\n}</code>\n\nUse operadores de comparação:\n<code>></code> maior, <code><</code> menor, <code>===</code> igual, <code>!==</code> diferente.',
        
        arrays: 'Arrays armazenam múltiplos valores em ordem:\n\n<code>const frutas = ["maçã", "banana", "uva"];</code>\n\nMétodos úteis:\n• <code>.push(item)</code> - adiciona no fim\n• <code>.pop()</code> - remove último\n• <code>.map(fn)</code> - transforma cada item\n• <code>.filter(fn)</code> - filtra itens\n• <code>.length</code> - quantidade',
        
        git: 'Git é controle de versão. Comandos essenciais:\n\n<code>git init</code> - inicia repositório\n<code>git add .</code> - prepara arquivos\n<code>git commit -m "msg"</code> - salva versão\n<code>git push</code> - envia para nuvem\n<code>git pull</code> - baixa atualizações\n\nCada commit é um "checkpoint" do código!',
        
        oque_e_programacao: 'Programação é a arte de dar instruções ao computador para resolver problemas.\n\nO processo básico:\n1. Entender o problema\n2. Planejar a solução (lógica)\n3. Escrever o código\n4. Testar e corrigir\n5. Otimizar\n\nO mais importante não é decorar sintaxe, e sim desenvolver o raciocínio lógico!',
        
        por_onde_comecar: 'Para começar a programar:\n\n1. **Escolha uma linguagem**: JavaScript ou Python são ótimas para iniciantes\n2. **Aprenda lógica**: variáveis, condicionais, loops, funções\n3. **Pratique muito**: faça exercícios e pequenos projetos\n4. **Use a comunidade**: tire dúvidas no fórum\n5. **Construa projetos**: um portfólio vale mais que certificados\n\nComece pelo nosso Roadmap na seção "Iniciante"!'
    },

    init() {
        // Configura se API key existe
        const settings = DB.get('settings', {});
        this.apiConfigured = settings.apiConfigured || false;
    },

    /**
     * Detecta intenção da mensagem
     */
    detectIntent(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('variável') || msg.includes('variavel') || msg.includes('let ') || msg.includes('const')) return 'variaveis';
        if (msg.includes('função') || msg.includes('funcao') || msg.includes('function')) return 'funcoes';
        if (msg.includes('loop') || msg.includes('laço') || msg.includes('laco') || msg.includes('for ') || msg.includes('while')) return 'loops';
        if (msg.includes('if') || msg.includes('else') || msg.includes('condicional') || msg.includes('decisão')) return 'condicionais';
        if (msg.includes('array') || msg.includes('lista') || msg.includes('vetor')) return 'arrays';
        if (msg.includes('git') || msg.includes('github') || msg.includes('commit')) return 'git';
        if (msg.includes('o que é programação') || msg.includes('oque é programação') || msg.includes('o que e programacao')) return 'oque_e_programacao';
        if (msg.includes('por onde começar') || msg.includes('como começar') || msg.includes('por onde comecar')) return 'por_onde_comecar';
        
        return null;
    },

    /**
     * Gera resposta
     */
    async generateResponse(userMessage) {
        // Se tiver API configurada, tentaria chamar backend
        // Em produção: POST /api/chat { message }
        if (this.apiConfigured) {
            // Simula delay de rede
            await new Promise(r => setTimeout(r, 800));
            // Aqui seria a chamada real via backend
            // return await this.callBackendAPI(userMessage);
        }

        // Respostas simuladas
        await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
        
        const intent = this.detectIntent(userMessage);
        
        if (intent && this.responses[intent]) {
            return this.responses[intent];
        }

        // Resposta genérica baseada em palavras-chave
        const msg = userMessage.toLowerCase();
        
        if (msg.includes('erro') || msg.includes('bug')) {
            return 'Para resolver erros, tente:\n\n1. **Leia a mensagem de erro** - ela diz o que deu errado e onde\n2. **Verifique a sintaxe**: vírgulas, parênteses, chaves\n3. **Use console.log** para inspecionar valores\n4. **Pesquise o erro** no Google ou Stack Overflow\n5. **Comente linhas** até encontrar o problema\n\nSe quiser, cole o código e o erro aqui que ajudo a analisar!';
        }
        
        if (msg.includes('projeto') || msg.includes('ideia')) {
            return 'Ótimas ideias de projetos para iniciantes:\n\n• Calculadora simples\n• Lista de tarefas (ToDo)\n• Jogo da velha\n• Conversor de moedas\n• Gerador de senhas\n• Pokédex usando API\n\nComece pequeno e vá adicionando funcionalidades aos poucos. O importante é construir!';
        }
        
        if (msg.includes('estudar') || msg.includes('aprender') || msg.includes('tempo')) {
            return 'Sugestão de rotina de estudos:\n\n• **30-60 min/dia** é melhor que 8h uma vez por semana\n• **Manhã**: conceitos novos (cérebro fresco)\n• **Tarde**: exercícios práticos\n• **Noite**: projetos pessoais\n\nA consistência (streak) é mais importante que a quantidade! Use o sistema de XP para se motivar.';
        }

        // Resposta padrão
        return `Olá! Recebi sua pergunta sobre: "${userMessage.slice(0, 60)}${userMessage.length > 60 ? '...' : ''}"\n\nSou o CodeBot, seu tutor de IA. Posso ajudar com:\n\n• Explicação de conceitos de programação\n• Dúvidas sobre JavaScript e Python\n• Revisão de código\n• Dicas de estudos e carreira\n• Resolução de exercícios\n\nTente me perguntar sobre:\n- "O que são variáveis?"\n- "Como funcionam funções?"\n- "Por onde começar a programar?"\n\nOu descreva o problema que está enfrentando!`;
    },

    /**
     * Envia mensagem no chat
     */
    async send() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        if (!Auth.requireAuth()) return;

        // Adiciona mensagem do usuário
        this.addMessage('user', message);
        input.value = '';
        input.style.height = 'auto';

        // Mostra digitando
        this.showTyping();

        // Gera resposta
        const response = await this.generateResponse(message);
        
        // Remove digitando e adiciona resposta
        this.removeTyping();
        this.addMessage('bot', response);

        // Registra a troca no backend (concede badge + contador de usos)
        try {
            const resultado = await Api.post('/ia/mensagens', { mensagem: message, resposta: response }, true);
            await Auth.refreshUser();
        } catch (e) { /* segue sem bloquear o chat */ }
    },

    /**
     * Adiciona mensagem ao chat
     */
    addMessage(type, content) {
        const container = document.getElementById('chatMessages');
        const isBot = type === 'bot';
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${type}`;
        msgDiv.innerHTML = `
            <div class="message-avatar ${type}">
                <i class="${isBot ? 'ri-robot-2-line' : 'ri-user-line'}"></i>
            </div>
            <div class="message-content">
                <div class="message-name">${isBot ? 'CodeBot' : (Auth.currentUser?.nome || 'Você')}</div>
                <div class="message-bubble">${content}</div>
            </div>
        `;
        
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Mostra indicador de digitando
     */
    showTyping() {
        const container = document.getElementById('chatMessages');
        const typing = document.createElement('div');
        typing.className = 'chat-message bot';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="message-avatar bot"><i class="ri-robot-2-line"></i></div>
            <div class="message-content">
                <div class="message-name">CodeBot</div>
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Remove indicador de digitando
     */
    removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    },

    /**
     * Trata tecla Enter
     */
    handleKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.send();
        }
    },

    /**
     * Chamada real de API (para implementar no backend)
     */
    async callBackendAPI(message) {
        // Em produção, o frontend chamaria um endpoint próprio
        // que repassaria para a Anthropic com a API key segura
        // 
        // Exemplo:
        // const res = await fetch('/api/chat', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ message, userId: Auth.currentUser.id })
        // });
        // return await res.text();
        
        throw new Error('Backend não implementado nesta demo');
    }
};

// Auto-resize textarea do chat
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
});

/* ============================================
   CodeLearn - Editor de Código
   Suporta JavaScript e Python (simulado)
   ============================================ */

const Editor = {
    challenges: {
        javascript: {
            free: '// Escreva seu código JavaScript livremente\nconsole.log("Olá!");',
            hello: '// Exiba "Hello World" na tela\nconsole.log("Hello World");',
            variables: '// Trabalhando com variáveis\nlet nome = "CodeLearn";\nlet ano = 2026;\nconsole.log(nome + " - " + ano);',
            loops: '// Exemplo de loop\nfor (let i = 1; i <= 5; i++) {\n    console.log("Contagem: " + i);\n}',
            functions: '// Função que soma dois números\nfunction somar(a, b) {\n    return a + b;\n}\n\nconsole.log("Resultado: " + somar(10, 5));'
        },
        python: {
            free: '# Escreva seu código Python livremente\nprint("Olá!")',
            hello: '# Exiba "Hello World" na tela\nprint("Hello World")',
            variables: '# Trabalhando com variáveis\nnome = "CodeLearn"\nano = 2026\nprint(f"{nome} - {ano}")',
            loops: '# Exemplo de loop\nfor i in range(1, 6):\n    print(f"Contagem: {i}")',
            functions: '# Função que soma dois números\ndef somar(a, b):\n    return a + b\n\nprint(f"Resultado: {somar(10, 5)}")'
        }
    },

    init() {
        this.loadChallenge();
    },

    changeLanguage() {
        this.loadChallenge();
    },

    loadChallenge() {
        const lang = document.getElementById('editorLanguage').value;
        const challenge = document.getElementById('editorChallenge').value;
        const editor = document.getElementById('codeEditor');
        
        if (this.challenges[lang] && this.challenges[lang][challenge]) {
            editor.value = this.challenges[lang][challenge];
        }
        
        // Atualiza placeholder
        editor.placeholder = lang === 'javascript' 
            ? '// Escreva seu código JavaScript aqui...'
            : '# Escreva seu código Python aqui...';
    },

    clear() {
        document.getElementById('codeEditor').value = '';
        document.getElementById('codeOutput').innerHTML = '<span class="output-placeholder">O resultado aparecerá aqui...</span>';
    },

    run() {
        const code = document.getElementById('codeEditor').value;
        const lang = document.getElementById('editorLanguage').value;
        const output = document.getElementById('codeOutput');
        
        if (!code.trim()) {
            output.innerHTML = '<span class="output-error">Escreva algum código primeiro!</span>';
            return;
        }

        if (lang === 'javascript') {
            this.runJavaScript(code, output);
        } else {
            this.runPythonSimulated(code, output);
        }

        // Registra execução se usuário logado
        if (Auth.currentUser) {
            Api.post('/gamificacao/codigo-executado', {}, true)
                .then(resultado => Gamification.aplicarResultadoXP(resultado, 2))
                .catch(() => {});
        }
    },

    runJavaScript(code, output) {
        const logs = [];
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = (...args) => {
            logs.push({ type: 'log', content: args.map(a => 
                typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
            ).join(' ') });
        };
        
        console.error = (...args) => {
            logs.push({ type: 'error', content: args.join(' ') });
        };

        try {
            const result = eval(code);
            if (result !== undefined && logs.length === 0) {
                logs.push({ type: 'result', content: String(result) });
            }
        } catch (e) {
            logs.push({ type: 'error', content: `${e.name}: ${e.message}` });
        }

        console.log = originalLog;
        console.error = originalError;

        this.renderOutput(logs, output);
    },

    runPythonSimulated(code, output) {
        const logs = [];
        const lines = code.split('\n');
        const variables = {};
        
        try {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (!line || line.startsWith('#')) continue;
                
                // print
                const printMatch = line.match(/^print\s*\((.*)\)$/);
                if (printMatch) {
                    let content = printMatch[1];
                    // f-string simples
                    content = content.replace(/f["'](.*?)["']/g, (_, str) => {
                        return str.replace(/\{(\w+)\}/g, (_, varName) => variables[varName] ?? `{${varName}}`);
                    });
                    // Remove aspas
                    content = content.replace(/^["']|["']$/g, '');
                    // Substitui variáveis
                    Object.keys(variables).forEach(v => {
                        content = content.replace(new RegExp(`\\b${v}\\b`, 'g'), variables[v]);
                    });
                    logs.push({ type: 'log', content });
                    continue;
                }
                
                // Atribuição simples
                const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
                if (assignMatch) {
                    const [, varName, value] = assignMatch;
                    let parsedValue = value.trim();
                    
                    // Número
                    if (!isNaN(parsedValue) && parsedValue !== '') {
                        variables[varName] = Number(parsedValue);
                    } 
                    // String
                    else if (parsedValue.startsWith('"') || parsedValue.startsWith("'")) {
                        variables[varName] = parsedValue.slice(1, -1);
                    }
                    // f-string
                    else if (parsedValue.startsWith('f"') || parsedValue.startsWith("f'")) {
                        let str = parsedValue.slice(2, -1);
                        str = str.replace(/\{(\w+)\}/g, (_, v) => variables[v] ?? `{${v}}`);
                        variables[varName] = str;
                    }
                    continue;
                }
                
                // for range simples
                const forMatch = line.match(/^for\s+(\w+)\s+in\s+range\s*\((\d+),\s*(\d+)\)\s*:$/);
                if (forMatch) {
                    const [, varName, start, end] = forMatch;
                    const nextLine = lines[i + 1]?.trim();
                    const bodyMatch = nextLine?.match(/^print\s*\((.*)\)$/);
                    if (bodyMatch) {
                        for (let j = Number(start); j < Number(end); j++) {
                            let content = bodyMatch[1];
                            if (content.startsWith('f"') || content.startsWith("f'")) {
                                content = content.slice(2, -1).replace(/\{(\w+)\}/g, (_, v) => 
                                    v === varName ? j : (variables[v] ?? `{${v}}`)
                                );
                            }
                            logs.push({ type: 'log', content });
                        }
                        i++;
                    }
                    continue;
                }
                
                // def function (declaração, ignora corpo)
                if (line.match(/^def\s+\w+\s*\(.*\)\s*:$/)) {
                    // Pula linhas indentadas do corpo
                    while (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t'))) {
                        i++;
                    }
                    continue;
                }
                
                // Chamada de função (simulada - somar)
                const funcCallMatch = line.match(/^print\s*\(f?"?([^"()]*)"?\s*\+\s*(\w+)\s*\(([^)]*)\)\)?\)$/);
                if (funcCallMatch) {
                    const [, prefix, funcName, args] = funcCallMatch;
                    if (funcName === 'somar') {
                        const argVals = args.split(',').map(a => {
                            const v = a.trim();
                            return variables[v] ?? Number(v);
                        });
                        const result = argVals.reduce((a, b) => a + b, 0);
                        logs.push({ type: 'log', content: (prefix || '').replace(/["']/g, '') + result });
                        continue;
                    }
                }
            }
            
            if (logs.length === 0) {
                logs.push({ type: 'info', content: 'Código executado (sem saída).' });
            }
        } catch (e) {
            logs.push({ type: 'error', content: `Erro: ${e.message}` });
        }

        this.renderOutput(logs, output);
    },

    renderOutput(logs, output) {
        output.innerHTML = logs.map(log => {
            const classes = ['output-line'];
            if (log.type === 'error') classes.push('output-error');
            if (log.type === 'result' || log.type === 'info') classes.push('output-success');
            return `<span class="${classes.join(' ')}">${Utils.escapeHtml(log.content)}</span>`;
        }).join('');
    }
};

// Suporte a Tab no editor
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('codeEditor');
    if (editor) {
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
            }
        });
    }
});

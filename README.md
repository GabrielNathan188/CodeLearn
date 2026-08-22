# CodeLearn 🚀

Plataforma completa de aprendizado de programação com gamificação, editor de código, IA e comunidade.

## ✨ Funcionalidades

- **Roadmap** - Caminho organizado por níveis (Iniciante, Intermediário, Avançado)
- **Conceitos** - Cards interativos com explicações e exemplos de código
- **Exercícios** - Lista prática com diferentes dificuldades e recompensas em XP
- **Dicas** - Conselhos para desenvolvedores
- **Editor de Código** - Execute JavaScript e Python direto no navegador
- **CodeBot IA** - Tutor de inteligência artificial com respostas simuladas
- **Comunidade/Fórum** - Publique perguntas, vote e interaja
- **Gamificação** - XP, níveis, streak de dias e badges
- **Ranking** - Top 5 usuários por XP
- **Autenticação** - Login e registro com persistência
- **Dashboard** - Seu progresso pessoal
- **Painel Admin** - Gerenciamento completo da plataforma

## 🎨 Identidade Visual

- **Tema Dark**: `#0a0a0f` background, verde neon `#00ff88`, roxo `#7c3aed`
- **Tema Light**: Alternável pelo botão na navbar
- **Fontes**: Syne (interface) + Space Mono (código)
- **Estilo**: Minimalista, futurista, terminal, cyberpunk clean

## 📁 Estrutura do Projeto

Os arquivos são **numerados** para indicar a ordem de carregamento e dependência.

```
CODELEARN/
├── index.html                    # Página principal - estrutura HTML de todas as seções
├── README.md                     # Esta documentação
│
├── css/
│   ├── 01-estilos-base.css       # Variáveis de tema, reset, navbar, hero, animações
│   ├── 02-componentes.css        # Botões, formulários, cards, modais, toasts
│   └── 03-responsivo.css         # Media queries para celular, tablet e desktop
│
├── js/
│   ├── 01-app-inicializacao.js   # 🚀 Ponto de entrada - inicializa TODOS os módulos
│   ├── 02-utilitarios.js         # 🔧 Funções auxiliares (datas, validações, toasts)
│   ├── 03-armazenamento-db.js    # 💾 Camada DB abstrata + dados iniciais
│   ├── 04-tema-dark-light.js     # 🌓 Alternância entre tema escuro e claro
│   ├── 05-autenticacao.js        # 🔐 Login, registro, sessão, menu do usuário
│   ├── 06-gamificacao.js         # ⭐ XP, níveis, streak, badges, recompensas
│   ├── 07-roadmap.js             # 🗺️ Seção Roadmap com 3 níveis e abas dinâmicas
│   ├── 08-conceitos.js           # 📚 Cards interativos de conceitos com código
│   ├── 09-exercicios.js          # ✏️ Lista de exercícios + filtros + modal
│   ├── 10-editor-codigo.js       # 💻 Editor JS/Python com execução no navegador
│   ├── 11-chat-ia-codebot.js     # 🤖 Chat do tutor IA CodeBot
│   ├── 12-forum-comunidade.js    # 💬 Fórum: posts, votos, publicações
│   ├── 13-ranking-usuarios.js    # 🏆 Ranking global baseado em XP
│   └── 14-painel-admin.js        # ⚙️ Painel administrativo completo
│
├── assets/
│   ├── img/                      # 🖼️ Pasta para imagens
│   └── icons/                    # 🎨 Pasta para ícones locais
│
└── data/
    ├── exercises.json            # Dados estruturados dos exercícios
    ├── concepts.json             # Dados estruturados dos conceitos
    └── roadmap.json              # Dados estruturados do roadmap
```

## 🚀 Como Executar

1. Baixe todos os arquivos mantendo a estrutura de pastas
2. Abra o arquivo `index.html` diretamente no navegador
3. Ou use um servidor local:
   ```bash
   # Python
   python3 -m http.server 8000
   
   # Node.js
   npx serve .
   ```
4. Acesse `http://localhost:8000`

## 📝 Primeiro Acesso

### Conta Admin padrão:

| Usuário | Senha | Papel |
|---------|-------|-------|
| `admin` | `admin123` | **OWNER** (acesso total) |

> ⚠️ **Aviso**: Esta conta existe apenas para facilitar o primeiro acesso. **Mude a senha ou crie sua própria conta** antes de colocar em produção.

### Criando sua própria conta:

1. Clique em **"Entrar"** na navbar
2. Vá para a aba **"Criar conta"**
3. Cadastre-se com seu nome, usuário, email e senha
4. Para promover sua conta a admin, abra o console (F12) e execute:
> ```javascript
> const users = JSON.parse(localStorage.getItem('codelearn_users'));
> users[users.length - 1].role = 'OWNER';
> localStorage.setItem('codelearn_users', JSON.stringify(users));
> location.reload();
> ```

## 🏆 Badges

- 🚀 **Primeiro código** - Executou seu primeiro código
- 🔁 **Loop mestre** - Dominou os laços de repetição
- 🔥 **7 dias streak** - Manteve 7 dias consecutivos
- 💬 **1º post fórum** - Fez sua primeira publicação
- 🤖 **Usou IA** - Conversou com o CodeBot
- 🏆 **Top 3** - Entrou no top 3 do ranking
- ⚡ **Speed coder** - Executou 20 códigos
- 💎 **Nível 10** - Alcançou o nível 10

## 🏗️ Arquitetura

### Camada de Armazenamento

O projeto usa uma interface `DB` abstrata que facilita trocar o backend:

```javascript
DB.get(key, defaultValue)   // Obtém dado
DB.set(key, value)          // Salva dado
DB.delete(key)              // Remove dado
```

Atualmente implementado com `localStorage` para demonstração. Para produção, basta reimplementar esses métodos com:
- Firebase
- Supabase
- API REST própria
- PostgreSQL

### Segurança

- ⚠️ **Senhas**: A demo usa hash simples. Em produção use `bcrypt`/`argon2` no backend
- ⚠️ **API Keys**: Nunca exponha chaves de API no frontend. Use uma camada backend
- ⚠️ **XSS**: Todas as entradas de usuário são escapadas via `Utils.escapeHtml()`

## 🔌 Integração IA

O módulo `11-chat-ia-codebot.js` está preparado para integração real:

```javascript
// Arquitetura planejada:
// Frontend → Backend (com API key) → Anthropic API

async callBackendAPI(message) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, userId: Auth.currentUser.id })
  });
  return await res.text();
}
```

## 📱 Responsividade

A plataforma funciona perfeitamente em:
- Desktop (1200px+)
- Notebook (1024px)
- Tablet (768px)
- Celular (480px e abaixo)

## 🛠️ Tecnologias

- **HTML5** - Semântico e moderno
- **CSS3** - Grid, Flexbox, animações, variáveis
- **JavaScript ES6+** - Módulos organizados, sem dependências
- **Remix Icon** - Biblioteca de ícones via CDN
- **Google Fonts** - Syne + Space Mono

## 📝 Licença

Projeto educacional. Sinta-se livre para usar, modificar e distribuir.

---

**Aprenda a programar de verdade. Do zero ao avançado.** 💚

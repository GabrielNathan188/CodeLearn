# CodeLearn - Backend

API REST em Express + MySQL para o CodeLearn (TCC). Substitui a camada
`localStorage` do frontend original por um banco de dados de verdade.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com os dados da sua
   connection do MySQL Workbench (host, porta, usuário, senha, nome do banco):
   ```bash
   cp .env.example .env
   ```

3. Popule as tabelas de conteúdo (exercícios, conceitos, roadmap, badges)
   com os dados reais do projeto original:
   ```bash
   npm run seed
   ```

4. Suba o servidor:
   ```bash
   npm start
   ```
   Ou, durante o desenvolvimento (reinicia sozinho ao salvar):
   ```bash
   npm run dev
   ```

5. Teste se está no ar:
   ```
   GET http://localhost:3000/api/health
   ```

## Rotas principais

| Método | Rota                          | Descrição                              | Autenticação |
|--------|--------------------------------|-----------------------------------------|--------------|
| POST   | /api/auth/registrar            | Cria uma conta                          | -            |
| POST   | /api/auth/login                | Login, retorna token JWT                | -            |
| GET    | /api/auth/me                   | Dados do usuário logado                 | Sim          |
| GET    | /api/exercicios                | Lista exercícios                        | -            |
| POST   | /api/exercicios/:id/concluir   | Marca exercício concluído (+XP)         | Sim          |
| GET    | /api/conceitos                 | Lista conceitos                         | -            |
| GET    | /api/roadmap                   | Módulos + tópicos do roadmap            | -            |
| GET    | /api/badges                    | Catálogo de badges                      | -            |
| GET    | /api/badges/minhas             | Badges do usuário logado                | Sim          |
| GET    | /api/posts                     | Lista posts do fórum                    | -            |
| POST   | /api/posts                     | Cria post (+XP)                         | Sim          |
| POST   | /api/posts/:id/votar           | Vota/remove voto                        | Sim          |
| DELETE | /api/posts/:id                 | Exclui post (dono ou admin)             | Sim          |
| GET    | /api/ranking                   | Top usuários por XP                     | -            |
| POST   | /api/gamificacao/codigo-executado | Registra execução de código no editor | Sim          |
| POST   | /api/ia/mensagens              | Salva troca de mensagem com o CodeBot   | Sim          |
| GET/PUT| /api/admin/configuracoes       | Configurações do site                   | PUT: admin   |
| GET    | /api/admin/usuarios            | Lista usuários (painel admin)           | admin        |

Rotas autenticadas esperam o header:
```
Authorization: Bearer <token retornado no login/registro>
```

## Próximo passo: conectar o frontend

O arquivo `js/03-armazenamento-db.js` do CodeLearn hoje fala só com
`localStorage`. O passo seguinte é reescrever os módulos `Auth`,
`Gamification`, `Forum`, etc. para chamar essas rotas via `fetch()`
em vez de `DB.get/set`. Posso ajudar a adaptar cada módulo quando
você quiser seguir para essa parte.

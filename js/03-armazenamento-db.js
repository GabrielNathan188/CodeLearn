/* ============================================
   CodeLearn - Cliente da API
   Substitui o antigo DB baseado em localStorage.
   Agora só o TOKEN de sessão fica no navegador;
   todo o resto dos dados vive no MySQL, acessado
   via API REST (backend Node.js + Express).
   ============================================ */

const API_BASE_URL = 'http://localhost:3000/api';

const TokenStore = {
    KEY: 'codelearn_token',

    get() {
        return localStorage.getItem(this.KEY);
    },

    set(token) {
        localStorage.setItem(this.KEY, token);
    },

    clear() {
        localStorage.removeItem(this.KEY);
    }
};

const Api = {
    /**
     * Faz uma requisição à API, anexando o token de autenticação
     * automaticamente quando existir.
     */
    async request(path, { method = 'GET', body = null, autenticado = false } = {}) {
        const headers = { 'Content-Type': 'application/json' };

        if (autenticado) {
            const token = TokenStore.get();
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }

        let resposta;
        try {
            resposta = await fetch(`${API_BASE_URL}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });
        } catch (e) {
            throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        }

        let dados = null;
        try {
            dados = await resposta.json();
        } catch (e) {
            // resposta sem corpo (ex: 204)
        }

        if (!resposta.ok) {
            const mensagem = dados?.erro || `Erro ${resposta.status}`;
            throw new Error(mensagem);
        }

        return dados;
    },

    get(path, autenticado = false) {
        return this.request(path, { method: 'GET', autenticado });
    },

    post(path, body, autenticado = false) {
        return this.request(path, { method: 'POST', body, autenticado });
    },

    put(path, body, autenticado = false) {
        return this.request(path, { method: 'PUT', body, autenticado });
    },

    delete(path, autenticado = false) {
        return this.request(path, { method: 'DELETE', autenticado });
    }
};

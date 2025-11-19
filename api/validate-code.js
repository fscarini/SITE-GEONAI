// Arquivo: api/validate-code.js

import { Redis } from '@upstash/redis'; 

// Inicialização do Redis (Usando as variáveis de ambiente)
const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // CORREÇÃO DO ReferenceError: Variáveis declaradas aqui para terem escopo correto
    let userCode = '';
    let storedCodeRaw = null; 

    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email e Código são obrigatórios' });
        }

        // Normaliza o e-mail para buscar a chave
        const lookupEmail = email.toLowerCase().trim(); 

        // 1. Busca o código salvo no KV
        storedCodeRaw = await kv.get(lookupEmail);
        userCode = code.trim(); // Limpa espaços em branco do código do usuário

        // 2. Validação de Expiração/Existência
        if (storedCodeRaw === null || storedCodeRaw === undefined) { 
            return res.status(400).json({ error: 'Código expirado. Tente novamente.' });
        }
        
        // 3. Validação do Código (Robustez): Garante que storedCode seja uma string limpa
        const storedCode = ('' + storedCodeRaw).trim();

        if (storedCode !== userCode) {
            return res.status(400).json({ error: 'Código inválido. Tente novamente.' });
        }

        // SUCESSO! O código é válido.
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Erro ao validar código:', error);
        // Mensagem mais clara para o caso de falha de credenciais/conexão
        return res.status(500).json({ error: 'Falha interna ao validar o código. Verifique se as variáveis de ambiente estão carregadas no Vercel Dev.' });
    }
}
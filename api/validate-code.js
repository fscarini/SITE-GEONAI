// Arquivo: api/validate-code.js
import { Redis } from '@upstash/redis';

// Inicialização do Redis (Usando as variáveis de ambiente que existem no seu Vercel)
const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email e Código são obrigatórios' });
        }

        // 1. Busca o código salvo no KV
        const storedCode = await kv.get(email);
        const userCode = code.trim(); // Limpa espaços em branco

        // 2. Validação de Expiração
        if (!storedCode) {
            return res.status(400).json({ error: 'Código expirado. Tente novamente.' });
        }

        // 3. Validação do Código
        if (storedCode !== userCode) {
            return res.status(400).json({ error: 'Código inválido. Tente novamente.' });
        }

        // SUCESSO! O código é válido.
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Erro ao validar código:', error);
        // Retorna 500 para indicar falha de serviço (Upstash ou conexão)
        return res.status(500).json({ error: 'Falha interna ao validar o código.' });
    }
}
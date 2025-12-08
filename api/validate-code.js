// Arquivo: api/validate-code.js

import Redis from 'ioredis'; 

const kv = new Redis(process.env.REDIS_URL_RAILWAY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let userCode = '';
    let storedCodeRaw = null; 

    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Email e Código são obrigatórios' });
        }

        const lookupEmail = email.toLowerCase().trim(); 

        // ioredis retorna null se não encontrar, o que é compatível com sua lógica
        storedCodeRaw = await kv.get(lookupEmail);
        userCode = code.trim();

        if (storedCodeRaw === null || storedCodeRaw === undefined) { 
            return res.status(400).json({ error: 'Código expirado. Tente novamente.' });
        }
        
        const storedCode = ('' + storedCodeRaw).trim();

        if (storedCode !== userCode) {
            return res.status(400).json({ error: 'Código inválido. Tente novamente.' });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Erro ao validar código:', error);
        return res.status(500).json({ error: 'Falha interna ao validar o código.' });
    }
}
// Arquivo: api/validate-code.js

import Redis from 'ioredis'; 

const kv = new Redis(process.env.REDIS_URL_RAILWAY);

// Lista de origens permitidas
const allowedOrigins = [
  'https://geonai.com.br',
  'https://www.geonai.com.br',
  'https://geonai.tech',
  'https://geonai.ai',
  'https://site-geonai.vercel.app',
  'http://localhost:3000'
];

function setCorsHeaders(res, origin) {
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req, res) {
    // 1. Aplica cabeçalhos CORS
    setCorsHeaders(res, req.headers.origin);

    // 2. Responde ao Preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

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
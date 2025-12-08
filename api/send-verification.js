// Arquivo: /api/send-verification.js

import { Resend } from 'resend';
import Redis from 'ioredis'; 

const resend = new Resend(process.env.RESEND_API_KEY);
const kv = new Redis(process.env.REDIS_URL_RAILWAY);

// 📌 Mantenha esta lista atualizada com todos os seus domínios
const allowedOrigins = [
  'https://geonai.com.br',
  'https://www.geonai.com.br',
  'https://geonai.tech',
  'https://geonai.ai', // ✅ Adicionado/Garantido
  'https://site-geonai.vercel.app',
  'http://localhost:3000'
];

/**
 * Define os cabeçalhos CORS na resposta.
 */
function setCorsHeaders(res, origin) {
  if (allowedOrigins.includes(origin)) {
    // Permite que a origem da requisição acesse o recurso
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // Métodos e cabeçalhos permitidos para requisições
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req, res) {
    const origin = req.headers.origin;
    // 1. Defina os cabeçalhos CORS na resposta, antes de qualquer outra lógica
    setCorsHeaders(res, origin); 

    // 2. Responda imediatamente a requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // 3. Continue com a verificação do método POST
    if (req.method !== 'POST') {
        // Embora o OPTIONS seja tratado, é bom manter este
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const lookupEmail = email.toLowerCase().trim();
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await kv.set(lookupEmail, code, 'EX', 300); // Expira em 5 minutos

        await resend.emails.send({
            from: 'noreply@geonai.com.br', 
            to: email,
            subject: 'Seu código de verificação Geon AI',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Verificação de E-mail</h2>
                    <p>Olá! Seu código de verificação é:</p>
                    <h1 style="font-size: 48px; letter-spacing: 5px; margin: 20px;">
                        ${code}
                    </h1>
                    <p>Este código expira em 5 minutos.</p>
                    <p><i>Se você não solicitou isso, por favor ignore este e-mail.</i></p>
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">Geon AI</p>
                </div>
            `,
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Erro ao enviar código:', error);
        return res.status(500).json({ error: 'Falha ao enviar o código de verificação.' });
    }
}
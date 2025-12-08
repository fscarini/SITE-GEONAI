// Arquivo: /api/send-verification.js

import { Resend } from 'resend';
import Redis from 'ioredis'; // Importação padrão do ioredis

const resend = new Resend(process.env.RESEND_API_KEY);

// Conecta usando a URL completa da Railway (ex: redis://...)
const kv = new Redis(process.env.REDIS_URL_RAILWAY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const lookupEmail = email.toLowerCase().trim();
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // MUDANÇA CRÍTICA AQUI:
        // Sintaxe do ioredis: chave, valor, 'EX', tempo_em_segundos
        await kv.set(lookupEmail, code, 'EX', 300);

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
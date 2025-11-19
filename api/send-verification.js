// Arquivo: /api/send-verification.js

import { Resend } from 'resend';
import { Redis } from '@upstash/redis'; 

const resend = new Resend(process.env.RESEND_API_KEY);

const kv = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // MUDANÇA: Normaliza o e-mail para ser usado como chave
        const lookupEmail = email.toLowerCase().trim();

        // 1. Gera um código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Salva o código no Vercel KV usando a chave normalizada
        await kv.set(lookupEmail, code, { ex: 300 });

        // 3. Envia o e-mail para o usuário com o código
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

        // 4. Responde ao frontend
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Erro ao enviar código:', error);
        return res.status(500).json({ error: 'Falha ao enviar o código de verificação.' });
    }
}
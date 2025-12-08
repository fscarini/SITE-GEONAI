// Arquivo: /api/verify-and-submit.js

import { Resend } from 'resend';
import Redis from 'ioredis'; 

const resend = new Resend(process.env.RESEND_API_KEY);
const kv = new Redis(process.env.REDIS_URL_RAILWAY);

const ADMIN_EMAIL = 'contato@geonai.com.br';

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

    try {
        const {
            name,
            website,
            phone,
            email,
            employees,
            goal,
            message
        } = req.body;
        
        const lookupEmail = email.toLowerCase().trim(); 

        await resend.emails.send({
            from: 'noreply@geonai.com.br', 
            to: ADMIN_EMAIL,
            subject: `Novo Lead (Formulário Imersivo): ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Novo Lead Recebido!</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Telefone:</strong> ${phone}</p>
                    <p><strong>Website:</strong> ${website || 'Não informado'}</p>
                    <hr>
                    <p><strong>Colaboradores:</strong> ${employees}</p>
                    <p><strong>Objetivo:</strong> ${goal}</p>
                    <p><strong>Problema Descrito:</strong></p>
                    <p style="padding: 10px; background: #f4f4f4; border-radius: 5px;">
                        ${message}
                    </p>
                </div>
            `,
        });

        // Remove o código do Redis após o uso bem-sucedido
        await kv.del(lookupEmail); 

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('❌ Erro ao verificar e enviar:', error);
        return res.status(500).json({ error: 'Falha ao enviar sua solicitação.' });
    }
}
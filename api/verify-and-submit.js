// Arquivo: /api/verify-and-submit.js
import { Resend } from 'resend';
import { Redis } from '@upstash/redis'; // MUDANÇA: Usando Upstash Redis

const resend = new Resend(process.env.RESEND_API_KEY);

// MUDANÇA: Inicializa o Redis com as variáveis de ambiente corretas
const kv = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// E-mail do admin que receberá a notificação de novo lead
const ADMIN_EMAIL = 'contato@geonai.com.br';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. Coleta todos os dados do formulário
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

        // 3. Se o código foi validado no Passo 5, envia o e-mail para o admin
        await resend.emails.send({
            from: 'noreply@geonai.com.br', // MUDANÇA: Garante o remetente correto
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

        // 4. Limpa o código do KV após o sucesso
        await kv.del(email);

        // 5. Responde ao frontend
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('❌ Erro ao verificar e enviar:', error);
        // MUDANÇA: Retorna um erro 500 para falhas de serviço (Resend)
        return res.status(500).json({ error: 'Falha ao enviar sua solicitação. Verifique as chaves Resend.' });
    }
}
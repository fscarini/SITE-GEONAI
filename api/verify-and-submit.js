// Arquivo: /api/verify-and-submit.js
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY);
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
            code, // O código de verificação
            employees,
            goal,
            message
        } = req.body;

        // 2. Busca o código salvo no Vercel KV
        const storedCode = await kv.get(email);

        const userCode = code ? code.trim() : null; // Garante que o código do usuário seja limpo.

        // 3. Validação do código
        if (!storedCode) {
            return res.status(400).json({ error: 'Código expirado. Tente novamente.' });
        }

        if (storedCode !== code) {
            // O script do frontend espera por esta mensagem específica!
            return res.status(400).json({ error: 'Código inválido. Tente novamente.' });
        }

        // 4. Se o código estiver CORRETO, envia o e-mail para o admin
        await resend.emails.send({
            from: 'noreply@seusite.com', // Mesmo e-mail verificado
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

        // 5. Limpa o código do KV após o sucesso
        await kv.del(email);

        // 6. Responde ao frontend
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Erro ao verificar e enviar:', error);
        return res.status(500).json({ error: 'Falha ao enviar sua solicitação.' });
    }
}
import sgMail from '@sendgrid/mail';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const allowedOrigins = [
  'https://geonai.tech',
  'https://geonai.ai',
  'https://geonai.com.br'
];

// Esta é a configuração mais segura para produção
const corsMiddleware = cors({
  origin: allowedOrigins,
  methods: ['POST', 'OPTIONS'],
});

// Helper para executar o middleware em um ambiente serverless
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  // 3. Executar o middleware no início da função
  await runMiddleware(req, res, corsMiddleware);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // O resto do seu código permanece o mesmo...
  await Promise.all([
    body('name').trim().notEmpty().withMessage('Nome é obrigatório').run(req),
    body('email').trim().isEmail().withMessage('E-mail inválido').run(req),
    body('message').trim().notEmpty().withMessage('Mensagem é obrigatória').run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, company, position, message } = req.body;

  const msg = {
    to: process.env.EMAIL_DESTINO,
    from: 'no-reply@geonai.com.br',
    subject: `[Site] Novo contato: ${name}`,
    replyTo: {
        name: name,
        email: email,
    },
    text: `${message}\n\n---\nNome: ${name}\nEmail: ${email}\nEmpresa: ${company || '-'}\nCargo: ${position || '-'}`,
    html: `
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Empresa:</strong> ${company || '-'}</p>
      <p><strong>Cargo:</strong> ${position || '-'}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao enviar e-mail com SendGrid:', err.message);
    if (err.response) {
      console.error(err.response.body);
    }
    return res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
}
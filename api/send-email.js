import sgMail from '@sendgrid/mail';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import cors from 'cors';
import { Redis } from '@upstash/redis';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const isDev = process.env.NODE_ENV

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function isRateLimited(ip) {
  const key = `rate_limit:${ip}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, 60);
  }

  return current > 5;
}


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

  // Cabeçalhos de segurança
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');

  // Executa middleware CORS
  await runMiddleware(req, res, corsMiddleware);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Honeypot contra bots
  if (req.body.website) {
    return res.status(400).json({ error: 'Bot detectado.' });
  }

  //  Pega IP do usuário
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  //  Verifica rate limit
  if (await isRateLimited(ip)) {
    return res.status(429).json({ error: 'Muitas solicitações. Tente novamente mais tarde.' });
  }

  await Promise.all([
    body('name').trim().escape().notEmpty().withMessage('Nome é obrigatório').run(req),
    body('email').trim().escape().isEmail().withMessage('E-mail inválido').run(req),
    body('message').trim().escape().notEmpty().withMessage('Mensagem é obrigatória').run(req),
    body('company').optional().trim().escape(),
    body('position').optional().trim().escape()
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, company, position, message } = req.body;
  const cleanName = name.replace(/(\r|\n)/g, '');
  const cleanEmail = email.replace(/(\r|\n)/g, '');


  const msg = {
    to: process.env.EMAIL_DESTINO,
    from: 'no-reply@geonai.com.br',
    subject: `[Site] Novo contato: ${cleanName}`,
    replyTo: {
        name: cleanName,
        email: cleanEmail,
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
    if (isDev && err.response) {
      console.error('Detalhes do erro: ', err.response.body);
    }
    return res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
}
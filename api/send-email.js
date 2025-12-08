import sgMail from '@sendgrid/mail';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import cors from 'cors';
import Redis from 'ioredis'; // MUDANÇA: Usando ioredis

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const isDev = process.env.NODE_ENV;

// MUDANÇA: Conexão com Railway Redis
const redis = new Redis(process.env.REDIS_URL_RAILWAY);

async function isRateLimited(ip) {
  const key = `rate_limit:${ip}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, 60);
  }

  return current > 5;
}

const allowedOrigins = [
  'https://geonai.com.br',
  'https://www.geonai.com.br',
  'https://geonai.tech',
  'https://geonai.ai',
  'https://site-geonai.vercel.app',
  'http://localhost:3000'
];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

function setCorsHeaders(res, origin) {
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  if (req.body.website) {
    return res.status(400).json({ error: 'Bot detectado.' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  // Bloco try-catch para proteger caso o Redis falhe
  try {
      if (await isRateLimited(ip)) {
        return res.status(429).json({ error: 'Muitas solicitações. Tente novamente mais tarde.' });
      }
  } catch (err) {
      console.error('Erro no Rate Limit (Redis):', err);
      // Opcional: permitir passar se o Redis falhar, ou bloquear. Aqui deixamos passar.
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
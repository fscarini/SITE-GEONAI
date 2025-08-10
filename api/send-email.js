import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Validação básica
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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false',
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Geon AI <no-reply@geonai.com.br>',
      to: process.env.EMAIL_DESTINO,
      subject: `[Site] Novo contato: ${name}`,
      replyTo: `${name} <${email}>`,
      text: `${message}\n\n---\nNome: ${name}\nEmail: ${email}\nEmpresa: ${company || '-'}\nCargo: ${position || '-'}`,
      html: `
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || '-'}</p>
        <p><strong>Cargo:</strong> ${position || '-'}</p>
      `,
    });

    return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao enviar e-mail:', err.message);
    return res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
}
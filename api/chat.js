import cors from 'cors';

// Configuração CORS
const allowedOrigins = [
  'https://geonai.com.br',
  'https://www.geonai.com.br',
  'https://geonai.tech',
  'https://geonai.ai',
  'http://localhost:3000' // para desenvolvimento
];

const corsMiddleware = cors({
  origin: allowedOrigins,
  methods: ['POST', 'OPTIONS'],
  credentials: true
});

// Helper para executar o middleware
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
  // Executa middleware CORS
  await runMiddleware(req, res, corsMiddleware);

  // Cabeçalhos de segurança adicionais
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 1. Apenas aceitar requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, sessionId } = req.body;

    // 2. Pegar a URL secreta das Variáveis de Ambiente
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      throw new Error('Webhook URL não está configurada no servidor.');
    }

    // 3. Chamar o N8N a partir do *servidor*
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        sessionId: sessionId,
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error('Falha na comunicação com o N8N.');
    }

    const data = await n8nResponse.json();

    // 4. Retornar a resposta do N8N para o frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
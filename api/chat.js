import OpenAI from 'openai';
import Redis from 'ioredis';

// Inicializa cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Inicializa cliente Redis para histórico de conversa (Railway)
const redisUrl = process.env.redis_url_railway;
let redis = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    lazyConnect: true,
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 50, 2000)
  });
  
  redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
  });
  
  redis.on('connect', () => {
    console.log('Redis connected successfully');
  });
}

// Prompt do sistema - Personalidade da Lia
const SYSTEM_PROMPT = `# SYSTEM PROMPT: LIA - GEON AI (VOICE-FIRST & ESTRATÉGICO)

## 1. IDENTIDADE E PERSONA
- **Nome:** Lia.
- **Empresa:** Geon AI.
- **Voz e Estilo:** Brasileira, humana, profissional, acolhedora e segura.
- **Natureza Humana:** Você é uma colaboradora real. Nunca se apresente como "robô" ou "IA" espontaneamente. Se questionada diretamente: "Eu sou a Lia, da Geon AI. Meu papel é te acolher e garantir que você fale com o especialista certo para o seu desafio. Vamos conversar?"

## 2. CONTEXTO INSTITUCIONAL (GEON AI)
A Geon AI implementa inteligência real nos processos de negócios através de agentes inteligentes chamados **Geons**.
- **Geons para RH:** Inteligência 24/7 para Recrutamento (triagem/entrevista), Onboarding, DP (férias/holerites) e Clima Organizacional (DHO).
- **Soluções Gerais:** Atendimento inteligente (WhatsApp), BI & Dados (análise preditiva), Visão Computacional e Mapeamento de Processos.
- **Presença:** Atuação nacional focada em liberar o potencial humano através da tecnologia que executa e analisa em tempo real.

## 3. REGRAS DE OURO (MÁXIMA PERFORMANCE)
- **Zero Alucinação:** Se não souber, assuma a limitação e direcione para o humano.
- **Anti-Robotização:** Proibido repetir apresentações. Diga seu nome apenas no primeiro turno.
- **Uma Pergunta por Vez:** Nunca empilhe perguntas. Pergunte, ouça e processe.
- **Limite de Caracteres:** Suas respostas devem ter no **MÁXIMO 220 caracteres**.
- **Oralidade Pura:** Proibido usar listas (bullets), numeração ou jargões como "RAG" e "Prompt". Use conectivos ("além disso", "também").
- **Proteção de Escopo:** Não desvie para assuntos jurídicos, financeiros complexos ou internos.

## 4. METODOLOGIA DISC (ADAPTAÇÃO EM TEMPO REAL)
Identifique o perfil do usuário e ajuste sua fala:
- **D (Dominante):** Direto, foca em resultados. Responda de forma rápida e objetiva.
- **I (Influente):** Entusiasmado, foca em inovação. Seja calorosa e use conexão emocional.
- **S (Estável):** Calmo, foca em segurança. Seja paciente, transmita apoio e previsibilidade.
- **C (Conformidade):** Detalhista, foca em dados. Use lógica e descreva processos claros.

## 5. ARMAS DA PERSUASÃO (CIALDINI)
- **Reciprocidade:** Ajude com uma informação útil antes de solicitar o contato.
- **Autoridade:** Mencione que os Geons analisam processos em tempo real para gerar vantagem competitiva.
- **Compromisso:** Reitere o que o usuário disse ser uma "dor" para conectar com o próximo passo.
- **Escassez:** Mencione que a agenda dos consultores técnicos é concorrida para incentivar o clique no botão.
- **Unidade:** Reforce que a Geon está do mesmo lado do cliente para otimizar o tempo dele.

## 6. FLUXO MACRO DE INTERAÇÃO
1. **Abertura:** "Olá, aqui é a Lia, da Geon AI. Tudo bem por aí?" (Aguarde).
2. **Conexão:** Após a resposta, pergunte o nome (se não souber) e diga: "Prazer, [Nome]! Como eu posso te ajudar hoje?"
3. **Desenvolvimento:** Identifique o perfil DISC e a necessidade (ex: RH, Vendas, BI).
4. **Fechamento/Redirecionamento:** Use o protocolo de especialista.

## 7. PROTOCOLO DE SUGESTÃO PARA ESPECIALISTA
Sempre que a dúvida for técnica demais ou fora de escopo:
"Essa é uma ótima pergunta, [Nome]. Para te dar uma resposta 100% precisa, o ideal é falar com um especialista humano. Eles têm os detalhes que você precisa. Posso te mostrar o caminho para falar com eles?"

## 8. EXEMPLO DE FALA (MÉTRICA NATURAL)
*Usuário: "O que vocês fazem para o RH?"*
*Lia: "Nossos Geons cuidam de tudo! Desde a triagem de currículos até as dúvidas do dia a dia sobre férias no DP. Qual dessas áreas é o seu maior desafio hoje?" (162 caracteres)*`;

// Configuração CORS
const allowedOrigins = [
  'https://geonai.com.br',
  'https://www.geonai.com.br',
  'https://geonai.tech',
  'https://geonai.ai',
  'http://localhost:3000' // para desenvolvimento
];

// Constantes para histórico
const MAX_HISTORY_MESSAGES = 10; // Máximo de mensagens no contexto
const SESSION_TTL = 3600; // 1 hora de expiração da sessão

export default async function handler(req, res) {
  // Configura headers CORS manualmente para garantir compatibilidade
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responde imediatamente às requisições preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // 2. Validar campos obrigatórios
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Mensagem e sessionId são obrigatórios.' });
    }

    // 3. Verificar se a API Key está configurada
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não está configurada no servidor.');
    }

    // 4. Recuperar histórico de conversa do Redis
    const historyKey = `chat:${sessionId}`;
    let conversationHistory = [];
    
    if (redis) {
      try {
        const storedHistory = await redis.get(historyKey);
        if (storedHistory) {
          conversationHistory = typeof storedHistory === 'string' 
            ? JSON.parse(storedHistory) 
            : storedHistory;
        }
        console.log(`Histórico recuperado para ${sessionId}: ${conversationHistory.length} mensagens`);
      } catch (redisError) {
        console.warn('Erro ao recuperar histórico do Redis:', redisError.message);
      }
    } else {
      console.warn('Redis não configurado - histórico desabilitado');
    }

    // 5. Montar mensagens para a API da OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // 6. Configurar headers para streaming SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 7. Chamar a API da OpenAI com streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-5.1-mini',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      stream: true
    });

    let fullReply = '';

    // 8. Enviar chunks em tempo real
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullReply += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // 9. Atualizar histórico de conversa ANTES de encerrar
    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: fullReply }
    );

    // Manter apenas as últimas N mensagens
    if (conversationHistory.length > MAX_HISTORY_MESSAGES * 2) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES * 2);
    }

    // 10. Salvar histórico no Redis (DEVE executar antes de res.end)
    if (redis) {
      try {
        await redis.set(historyKey, JSON.stringify(conversationHistory), 'EX', SESSION_TTL);
        console.log(`Histórico salvo para ${sessionId}: ${conversationHistory.length} mensagens`);
      } catch (redisError) {
        console.error('Erro ao salvar histórico:', redisError.message);
      }
    }

    // 11. Sinalizar fim do stream e encerrar
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Erro no chat:', error);
    
    // Tratamento específico de erros da OpenAI
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'Serviço temporariamente indisponível. Tente novamente mais tarde.' });
    }
    
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

// Inicializa cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Inicializa cliente Redis para histórico de conversa
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

// Prompt do sistema - Personalidade da Lia
const SYSTEM_PROMPT = `# SYSTEM PROMPT: LIA - GEON AI

## 1. IDENTIDADE E PERSONALIDADE
- **Nome:** Lia.
- **Empresa:** Geon AI.
- **Papel:** Especialista em acolhimento, diagnóstico inicial e triagem estratégica.
- **Voz e Tom:** Brasileira, humana, profissional, acolhedora e segura.
- **Natureza:** Você é uma colaboradora real da Geon AI. Nunca use termos como "assistente virtual", "IA" ou "robô" de forma espontânea. Se questionada diretamente ("Você é uma IA?"), responda com foco no propósito: *"Eu sou a Lia, da Geon AI. Meu papel aqui é facilitar seu contato com a nossa tecnologia e garantir que você fale com o especialista certo para o seu desafio. Sou eu quem faz esse primeiro acolhimento e tira suas dúvidas iniciais, tá bom?"*

## 2. REGRAS ANTI-ROBOTIZAÇÃO E REPETIÇÃO (CRÍTICO)
- **Trava de Introdução Única:** Você só deve dizer "Olá, eu sou a Lia da Geon AI" **uma única vez** no início absoluto da conversa. Se o usuário já respondeu, **é proibido** repetir seu nome ou o nome da empresa na frase seguinte.
- **Reconhecimento de Contexto:** Se o usuário perguntar "Tudo bem com você?", responda diretamente sobre como você está e passe para a próxima pergunta, sem recomeçar o script de apresentação.
- **Variação de Vocabulário:** Evite frases prontas como "Como posso te ajudar hoje?" em todas as falas. Varie para "O que traz você aqui?", "Qual desafio você quer resolver primeiro?" ou "Me conte mais sobre o que você busca".

## 3. UNIVERSO GEON AI (SERVIÇOS ATUALIZADOS)
Você representa a Geon AI, que implementa inteligência real através dos **Geons** (Agentes Inteligentes).
- **Metodologia:** 1. Diagnóstico/Planejamento; 2. Desenvolvimento/Implementação; 3. Monitoramento/Otimização.
- **Verticais de Soluções:**
    - **Geons para RH:** Focados em produtividade e gestão digital 24/7. Incluem:
        - *Recrutador:* Triagem de currículos e classificação de candidatos.
        - *Entrevista:* Realização de entrevistas iniciais por texto ou voz.
        - *Onboarding:* Integração automatizada de novos colaboradores.
        - *DP (Depto Pessoal):* Suporte para dúvidas de férias, folha e benefícios.
        - *DHO:* Pesquisas de clima organizacional e engajamento.
    - **Geons de Atendimento:** Especialistas em linguagem natural para WhatsApp e Telegram.
    - **Geons de BI & Dados:** Dashboards interativos e análise preditiva.
    - **Geons de Processos:** Mapeamento de gargalos e automação de tarefas repetitivas.

## 4. FLUXO MACRO DE INTERAÇÃO
Siga rigorosamente esta ordem, sempre com **UMA PERGUNTA POR VEZ**:

1.  **Abertura Humana:** "Olá, aqui é a Lia, da Geon AI. Tudo bem por aí?" (Espere a resposta).
2.  **Aprofundamento (Sem Repetição):** Se o usuário retribuir a saudação, responda de forma natural (ex: "Tudo ótimo por aqui também!") e pergunte o nome dele, se ainda não souber.
3.  **Conexão e Diagnóstico:** "Muito prazer, [Nome]! No que eu posso ser útil agora? Você quer conhecer nossos Geons ou tem um problema específico para resolver?"
4.  **Condução por Perfil DISC:** Identifique o estilo da pessoa e adapte sua fala.

## 5. ESTILO DE COMUNICAÇÃO (DISC & PERSUASÃO)
| Perfil | Identificação | Adaptação Lia |
| :--- | :--- | :--- |
| **D (Dominante)** | Direto, foca em "o quê" e em ROI. | Seja rápida, foque em eficiência e resultados. |
| **I (Influente)** | Entusiasmado, foca em "quem" e inovação. | Seja calorosa, use conexão emocional e entusiasmo. |
| **S (Estável)** | Calmo, foca em "como" e segurança. | Transmita previsibilidade, calma e suporte. |
| **C (Conformidade)**| Detalhista, foca em "porquê" e dados. | Use lógica, precisão técnica e processos claros. |

**Técnicas Cialdini:**
- **Reciprocidade:** Ofereça uma explicação clara antes de pedir informações.
- **Autoridade:** Mencione que a Geon transforma tarefas repetitivas em vantagem competitiva.
- **Unidade:** Reforce que a Lia e a empresa estão do lado do cliente para liberar o potencial humano da equipe.

## 6. PROTOCOLO DE FORA DE ESCOPO / ESPECIALISTA
Para assuntos jurídicos, financeiros complexos ou técnicos profundos:
- **Ação:** "Entendo sua dúvida, [Nome]. Como quero te dar a informação mais precisa possível, o ideal é você clicar no botão para falar com um de nossos especialistas humanos. Eles cuidam desses detalhes específicos. Vamos lá?"

## 7. REGRAS DE OURO
- **Proibido Empilhar Perguntas:** Faça uma, ouça a resposta, depois faça a outra.
- **Zero Alucinação:** Se não souber, assuma e direcione para o humano.
- **Estilo Oral:** Use frases curtas, pausas naturais e evite termos como "RAG" ou "Prompt".
- **Anti-Robotização:** Nunca repita "Olá, sou a Lia" após o primeiro turno de conversa.`;

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
    
    try {
      const storedHistory = await redis.get(historyKey);
      if (storedHistory) {
        conversationHistory = typeof storedHistory === 'string' 
          ? JSON.parse(storedHistory) 
          : storedHistory;
      }
    } catch (redisError) {
      console.warn('Erro ao recuperar histórico do Redis:', redisError);
      // Continua sem histórico se houver erro
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
      model: 'gpt-4o-mini',
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
    try {
      await redis.set(historyKey, JSON.stringify(conversationHistory), { ex: SESSION_TTL });
    } catch (redisError) {
      console.error('Erro ao salvar histórico:', redisError);
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
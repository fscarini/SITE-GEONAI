import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? '✅ Configurada' : '❌ NÃO CONFIGURADA',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ Configurada' : '❌ NÃO CONFIGURADA',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ NÃO CONFIGURADA',
    },
    redis: {
      connection: 'Não testada',
      write: 'Não testado',
      read: 'Não testado',
    }
  };

  // Testa conexão Redis apenas se as variáveis existirem
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN
      });

      diagnostics.redis.connection = '✅ Cliente criado';

      // Teste de escrita
      const testKey = 'test:ping:' + Date.now();
      const testValue = { test: true, time: Date.now() };
      
      await redis.set(testKey, JSON.stringify(testValue), { ex: 60 });
      diagnostics.redis.write = '✅ Escrita OK';

      // Teste de leitura
      const readValue = await redis.get(testKey);
      diagnostics.redis.read = readValue ? '✅ Leitura OK: ' + JSON.stringify(readValue) : '❌ Leitura falhou';

      // Listar todas as chaves de chat
      const allKeys = await redis.keys('chat:*');
      diagnostics.redis.chatKeys = allKeys.length > 0 ? allKeys : 'Nenhuma sessão de chat encontrada';

      // Limpa o teste
      await redis.del(testKey);

    } catch (error) {
      diagnostics.redis.error = error.message;
      diagnostics.redis.stack = error.stack;
    }
  } else {
    diagnostics.redis.error = 'Variáveis de ambiente do Redis não configuradas no Vercel';
  }

  return res.status(200).json(diagnostics);
}

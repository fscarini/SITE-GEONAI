import Redis from 'ioredis';

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
      redis_url_railway: process.env.redis_url_railway ? '✅ Configurada' : '❌ NÃO CONFIGURADA',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ NÃO CONFIGURADA',
    },
    redis: {
      connection: 'Não testada',
      write: 'Não testado',
      read: 'Não testado',
    }
  };

  // Testa conexão Redis apenas se a variável existir
  if (process.env.redis_url_railway) {
    try {
      const redis = new Redis(process.env.redis_url_railway, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        enableReadyCheck: false,
        connectTimeout: 10000
      });

      // Conecta explicitamente
      await redis.connect();
      diagnostics.redis.connection = '✅ Conectado';

      // Teste de escrita
      const testKey = 'test:ping:' + Date.now();
      const testValue = JSON.stringify({ test: true, time: Date.now() });
      
      await redis.set(testKey, testValue, 'EX', 60);
      diagnostics.redis.write = '✅ Escrita OK';

      // Teste de leitura
      const readValue = await redis.get(testKey);
      diagnostics.redis.read = readValue ? '✅ Leitura OK' : '❌ Leitura falhou';

      // Listar chaves de chat
      const allKeys = await redis.keys('chat:*');
      diagnostics.redis.chatSessions = allKeys.length;
      diagnostics.redis.chatKeys = allKeys.slice(0, 5); // Mostra até 5

      // Limpa o teste
      await redis.del(testKey);
      
      // Desconecta
      await redis.quit();

    } catch (error) {
      diagnostics.redis.error = error.message;
    }
  } else {
    diagnostics.redis.error = 'Variável redis_url_railway não configurada no Vercel';
  }

  return res.status(200).json(diagnostics);
}

export default async function handler(req, res) {
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
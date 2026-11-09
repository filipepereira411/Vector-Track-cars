export default async function handler(req, res) {
  // 1. Permitir apenas pedidos GET (ou adapta conforme o teu frontend)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Obter os parâmetros da query enviados pelo teu frontend (ex: ?matricula=XX-XX-XX)
  const { matricula } = req.query;

  if (!matricula) {
    return res.status(400).json({ error: 'A matrícula é obrigatória.' });
  }

  // Obter o Token das variáveis de ambiente da Vercel (opcional, se a API externa exigir)
  const API_TOKEN = process.env.MATRICULAZ_TOKEN;

  try {
    // 2. Fazer o pedido real para a API externa (ajusta o URL conforme a documentação real da API que usas)
    const apiResponse = await fetch(`https://matriculaz.pt{matricula}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ error: 'Erro ao consultar a API externa' });
    }

    const data = await apiResponse.json();

    // 3. Devolver os dados recebidos de volta para o teu frontend
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor proxy', detalhes: error.message });
  }
}

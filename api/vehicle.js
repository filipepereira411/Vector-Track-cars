const API_URL = 'https://api.matriculaz.pt/api/vehicles/data/license-plate';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const rawIdentifier = req.query.matricula;
  if (typeof rawIdentifier !== 'string' || !rawIdentifier.trim()) {
    return res.status(400).json({ error: 'Indique uma matrícula ou VIN.' });
  }

  const identifier = rawIdentifier.trim().toUpperCase();
  const token = process.env.MATRICULAZ_TOKEN;
  if (!token) {
    return res.status(503).json({
      error: 'A consulta está indisponível: falta configurar MATRICULAZ_TOKEN na Vercel.',
    });
  }

  const isVin = /^[A-Z0-9]{17}$/.test(identifier);
  const url = isVin ? `${API_URL}/vin` : API_URL;
  const body = isVin ? { vin: identifier } : { plate: identifier };

  try {
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await apiResponse.json();
    } catch {
      console.error('Matriculaz API returned a non-JSON response.');
      return res.status(502).json({ error: 'Resposta inválida da API Matriculaz.' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(apiResponse.status).json(data);
  } catch (error) {
    console.error('Matriculaz API request failed:', error);
    return res.status(502).json({ error: 'Não foi possível contactar a API Matriculaz.' });
  }
}

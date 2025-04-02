const http = require('http');
const url = require('url');

async function getBitcoin(currency) {
  const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.bitcoin && data.bitcoin[currency]) {
      return data.bitcoin[currency];
    } else {
      throw new Error('Ops, preço do Bitcoin não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao consultar a API CoinGecko:', error);
    throw new Error('Não foi possível obter o preço do Bitcoin.');
  }
}

function suggestPurchase(price, currency) {
  let suggestion = '';

  if (currency === 'brl') {
    if (price < 300000) {
      suggestion = 'Bom momento para compra!';
    } else if (price >= 300000 && price <= 450000) {
      suggestion = 'Preço razoável. Avalie antes de comprar.';
    } else {
      suggestion = 'Bitcoin está caro. Pode ser melhor esperar.';
    }
  } else if (currency === 'usd') {
    if (price < 60000) {
      suggestion = 'Bom momento para compra!';
    } else if (price >= 60000 && price <= 80000) {
      suggestion = 'Preço razoável. Avalie antes de comprar.';
    } else {
      suggestion = 'Bitcoin está caro. Pode ser melhor esperar.';
    }
  }

  return suggestion;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (method === 'GET' && pathname === '/stock-insight') {
    const currency = query.currency || 'usd'; 
    try {
      const price = await getBitcoin(currency);
      const suggestion = suggestPurchase(price, currency);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        btc_price: price,
        currency: currency,
        suggestion: suggestion
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

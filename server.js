const http = require('http');
const url = require('url');

let counter = 0;

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const requestListener = (req, res) => {
  const { method, url: reqUrl } = req;
  const parsedUrl = url.parse(reqUrl, true); 

  if (method === 'GET' && parsedUrl.pathname === '/health-check') {
    const timestamp = new Date().toISOString();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, timestamp }));
    return;
  }

  if (method === 'GET' && parsedUrl.pathname === '/is-prime-number') {
    const { number } = parsedUrl.query;

    if (!number || isNaN(number) || number < 1) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid input' }));
      return;
    }

    const num = parseInt(number);
    const primeCheck = isPrime(num);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ isPrime: primeCheck }));
    return;
  }

  if (method === 'POST' && parsedUrl.pathname === '/count') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const { incrementBy } = JSON.parse(body);

        if (!Number.isInteger(incrementBy) || incrementBy <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid input' }));
          return;
        }

        counter += incrementBy;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ counter }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid input' }));
      }
    });

    return;
  }


  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
};

const server = http.createServer(requestListener);

const port = 4000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

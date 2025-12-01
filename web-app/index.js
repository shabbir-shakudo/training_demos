const http = require('http');
const { URL } = require('url');

const port = process.env.PORT || 3000;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

const server = http.createServer((req, res) => {
  // Log incoming request
  log(`Incoming request: ${req.method} ${req.url} from ${req.socket.remoteAddress || 'unknown'}`);

  // Log when the response has been sent
  res.on('finish', () => {
    log(`Response sent: ${res.statusCode} for ${req.method} ${req.url}`);
  });

  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsed.pathname;

  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('OK\n');
    return;
  }

  if (pathname === '/') {
    const rawName = (parsed.searchParams.get('name') || '').trim();
    const name = rawName ? escapeHtml(rawName) : 'Team';

    const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Hello</title></head>
  <body>
    <h1>Hello ${name}</h1>
  </body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found\n');
});

server.listen(port, () => {
  log(`Server listening on http://localhost:${port}`);
});

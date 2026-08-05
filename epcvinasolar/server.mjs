import http from 'node:http';
import compression from 'compression';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';

const { handler } = await import('./dist/server/entry.mjs');
const compress = compression({ threshold: 1024 });
const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 3000;

const server = http.createServer((request, response) => {
  const forwardedHost = request.headers['x-forwarded-host'];
  const requestHost = String(forwardedHost || request.headers.host || '')
    .split(',')[0]
    .trim()
    .toLowerCase()
    .split(':')[0];

  if (requestHost === 'www.epcvina.com') {
    response.writeHead(308, {
      Location: `https://epcvina.com${request.url || '/'}`,
      'Cache-Control': 'public, max-age=86400',
    });
    response.end();
    return;
  }

  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'SAMEORIGIN');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  if ((request.url || '').startsWith('/_astro/')) {
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (/\.(?:avif|webp|png|jpe?g|gif|svg|ico|woff2?)$/i.test(request.url || '')) {
    response.setHeader('Cache-Control', 'public, max-age=604800');
  } else {
    response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  compress(request, response, () => handler(request, response));
});

server.listen(port, host, () => {
  console.log(`EPCVINA Solar listening on http://${host}:${port}`);
});

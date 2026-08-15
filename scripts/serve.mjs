import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';

const root = await realpath(process.cwd());
const rootPrefix = `${root}${sep}`;
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; img-src 'self' data: https://www.google-analytics.com; style-src 'self'; font-src 'self'",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
};

function send(res, method, status, body, headers = {}) {
  res.writeHead(status, { ...securityHeaders, ...headers });
  res.end(method === 'HEAD' ? undefined : body);
}

async function notFound(res, method) {
  const body = await readFile(join(root, '404.html'));
  send(res, method, 404, body, {
    'Cache-Control': 'no-store',
    'Content-Type': types['.html']
  });
}

createServer(async (req, res) => {
  const method = req.method || 'GET';
  if (!['GET', 'HEAD'].includes(method)) {
    send(res, method, 405, 'Method not allowed', {
      Allow: 'GET, HEAD',
      'Cache-Control': 'no-store',
      'Content-Type': types['.txt']
    });
    return;
  }

  try {
    const pathname = decodeURIComponent(new URL(req.url || '/', 'http://local').pathname);
    if (pathname.includes('\0')) throw new Error('Invalid path');

    let file = normalize(join(root, pathname));
    if (file !== root && !file.startsWith(rootPrefix)) throw new Error('Path traversal');
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');

    const resolved = await realpath(file);
    if (!resolved.startsWith(rootPrefix)) throw new Error('Symlink escape');
    const info = await stat(resolved);
    if (!info.isFile()) throw new Error('Not a file');

    const body = await readFile(resolved);
    const extension = extname(resolved).toLowerCase();
    send(res, method, 200, body, {
      'Cache-Control': extension === '.html'
        ? 'public, max-age=0, must-revalidate'
        : 'public, max-age=3600, stale-while-revalidate=86400',
      'Content-Length': body.byteLength,
      'Content-Type': types[extension] || 'application/octet-stream'
    });
  } catch {
    await notFound(res, method);
  }
}).listen(4173, '127.0.0.1', () => {
  console.log('Servidor QA: http://127.0.0.1:4173');
});

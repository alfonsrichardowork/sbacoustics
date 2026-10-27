import express from 'express';
import { createServer } from 'http';
import next from 'next';
import { join } from 'path';

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const trustedProxyIps = (process.env.TRUSTED_PROXY_IPS || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);

  // Forwarded client IPs are trusted only when the direct peer matches this allowlist.
  server.set('trust proxy', trustedProxyIps);

  server.use((req, res, next) => {
    req.headers['x-sba-client-ip'] = req.ip;
    next();
  });

  // Add CORS headers for static files
  server.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  server.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  server.use((req, res) => {
    handle(req, res);
  });

  createServer(server).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${hostname === '0.0.0.0' ? process.env.NEXT_PUBLIC_ROOT_URL : hostname}`);
  });
});
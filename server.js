const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const path = require('path');

// Force production mode
process.env.NODE_ENV = 'production';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const port = parseInt(process.env.PORT || '5172', 10);

  // Serve public folder sebagai static files
  server.use('/asset', express.static(path.join(__dirname, 'public/asset')));
  server.use('/public', express.static(path.join(__dirname, 'public')));

  // Handle semua request lainnya dengan Next.js
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

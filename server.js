// // const { createServer } = require('http');
// // const { parse } = require('url');
// // const { readFile } = require('fs/promises');
// // const { join } = require('path');
// // const next = require('next');

// // const dev = false;
// // const hostname = 'localhost';
// // const port = 3000;

// // const app = next({ dev, hostname, port });
// // const handle = app.getRequestHandler();

// // app.prepare().then(() => {
// //   createServer(async (req, res) => {
// //     try {
// //       let reqUrl = req.url
// //         .replaceAll(/\[/g, '%5B')
// //         .replaceAll(/\]/g, '%5D')
// //         .replaceAll('%5b', '%5B')
// //         .replaceAll('%5d', '%5D');

// //       const parsedUrl = parse(reqUrl, true);
// //       const { pathname, query } = parsedUrl;

// //       if (pathname.startsWith('/uploads/')) {
// //         const rawPath = decodeURIComponent(reqUrl.split('?')[0]);
// //         const filePath = join(__dirname, rawPath.replace(/^\/+/, ''));
// //         try {
// //           const data = await readFile(filePath);
// //           res.statusCode = 200;

// //           if (filePath.match(/\.(jpg|jpeg)$/i)) {
// //             res.setHeader('Content-Type', 'image/jpeg');
// //           } else if (filePath.match(/\.png$/i)) {
// //             res.setHeader('Content-Type', 'image/png');
// //           } else if (filePath.match(/\.webp$/i)) {
// //             res.setHeader('Content-Type', 'image/webp');
// //           }

// //           res.end(data);
// //         } catch (err) {
// //           console.error('File serve error:', err);
// //           res.statusCode = 404;
// //           res.end('File not found');
// //         }
// //         return;
// //       }

// //       // Custom routes
// //       if (pathname === '/a') {
// //         await app.render(req, res, '/a', query);
// //       } else if (pathname === '/b') {
// //         await app.render(req, res, '/b', query);
// //       } else {
// //         await handle(req, res, parsedUrl);
// //       }
// //     } catch (err) {
// //       console.error('Error occurred handling', req.url, err);
// //       res.statusCode = 500;
// //       res.end('internal server error');
// //     }
// //   }).listen(port, (err) => {
// //     if (err) throw err;
// //     console.log(`> Ready on http://${hostname}:${port}`);
// //   });
// // });





// const express = require("express");
// const next = require("next");
// const path = require("path");

// const dev = false;
// const port = 3000;
// const hostname = "0.0.0.0";

// const nextApp = next({ dev });
// const handle = nextApp.getRequestHandler();

// nextApp.prepare().then(() => {
//   const server = express();

//   server.use(
//     "/uploads",
//     express.static(path.join(__dirname, "uploads"), {
//       maxAge: "365d",
//       immutable: true,
//     })
//   );

//   server.use((req, res) => {
//     return handle(req, res);
//   });

//   server.listen(port, hostname, () => {
//     console.log(`> Ready on port ${port}`);
//   });
// });












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
import http from 'http';
import url from 'url';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

http
  .createServer({}, async (req, res) => {
    const { pathname, ...info } = url.parse(req.url);

    try {
      const path = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      let resbody;
      if (path === '') {
        resbody = await readFile('./dist/index.html');
        res.setHeader('Content-Type', 'text/html');
      } else if (/\.css$/.test(path)) {
        resbody = await readFile(`./dist/${path}`);
        res.setHeader('Content-Type', 'text/css');
      } else if (/\.(mjs|js)$/.test(path)) {
        resbody = await readFile(`./dist/${path}`);
        res.setHeader('Content-Type', 'text/javascript');
      } else if (/\.png$/.test(path)) {
        resbody = await readFile(`./dist/${path}`);
        res.setHeader('Content-Type', 'image/png');
      } else if (/\.ico$/.test(path)) {
        resbody = await readFile(`./dist/${path}`);
        res.setHeader('Content-Type', 'image/x-icon');
      } else if (/^api/.test(path)) {
        res.setHeader('Content-Type', 'application/json');
        resbody = JSON.stringify(['/sys']);
      }
      res.statusCode = 200;
      res.end(resbody);
    } catch (err) {
      console.error(err);
      res.statusCode = err.code || 404;
      res.end(null);
    }
  })
  .listen(8888, '0.0.0.0');

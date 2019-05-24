import http from 'http';
import url from 'url';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

http
  .createServer({}, async (req, res) => {
    const { pathname, ...info } = url.parse(req.url);

    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      const indexHTML = await readFile('./index.html');
      res.end(indexHTML, 'utf-8');
    } else if (/\.mjs$/.test(pathname)) {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      const js = await readFile(`./dist${pathname}`);
      res.end(js, 'utf-8');
    } else if (/\.ico$/.test(pathname)) {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      try {
        const ico = await readFile(`./dist${pathname}`);
        res.end(ico, 'utf-8');
      } catch (err) {
        console.error(err);
        res.end(null);
      }
    }
  })
  .listen(9999, '0.0.0.0');

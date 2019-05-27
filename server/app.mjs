import http from 'http';
import url from 'url';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

http
  .createServer({}, async (req, res) => {
    const { pathname, ...info } = url.parse(req.url);

    if (pathname === '/') {
      const indexHTML = await readFile('./index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHTML, 'utf-8');
    } else if (/\.css$/.test(pathname)) {
      try {
        const css = await readFile(`./public${pathname}`);
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(css);
      } catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.end(null);
      }
    } else if (/\.mjs$/.test(pathname)) {
      const js = await readFile(`./dist${pathname}`);
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(js, 'utf-8');
    } else if (/\.png$/.test(pathname)) {
      try {
        const png = await readFile(`./public${pathname}`);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(png);
      } catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.end(null);
      }
    } else if (/\.ico$/.test(pathname)) {
      try {
        const ico = await readFile(`./dist${pathname}`);
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end(ico, 'utf-8');
      } catch (err) {
        console.error(err);
        res.statusCode = 404;
        res.end(null);
      }
    } else {
      res.statusCode = 404;
      res.end(null);
    }
  })
  .listen(9999, '0.0.0.0');

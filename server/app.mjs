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
      } else if (path === 'sys') {
        resbody = await readFile('./dist/sys.html');
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
      } else if (/^api\/auth/.test(path)) {
        /**
         * handle /api/auth
         * 
         * @returns String[]
         * @author charlesmoone
         **/
        res.setHeader('Content-Type', 'application/json');
        resbody = JSON.stringify(['article/list']);
      } else {
        throw { code: 404, msg: 'resource not found' };
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

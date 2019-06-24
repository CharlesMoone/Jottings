import Router from 'koa-router';
import fs from 'fs';
import { typeToMime } from '../utils/imageTypeMap.mjs';

const router = new Router();

router
  .get('/favicon.ico', async ctx => {
    try {
      const file = fs.readFileSync('./dist/favicon.ico');
      ctx.set('Content-Type', 'X-Icon');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/', async ctx => {
    try {
      const file = fs.readFileSync('./dist/index.html');
      ctx.set('Content-Type', 'text/html');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/article', async ctx => {
    try {
      const file = fs.readFileSync('./dist/article.html');
      ctx.set('Content-Type', 'text/html');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/article/content', async ctx => {
    try {
      const file = fs.readFileSync('./dist/content.html');
      ctx.set('Content-Type', 'text/html');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/css/:css', async ctx => {
    const { css } = ctx.params;
    try {
      const file = fs.readFileSync(`./dist/css/${css}`);
      ctx.set('Content-Type', 'text/css');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/:js', async (ctx, next) => {
    const { js } = ctx.params;
    if (!js.endsWith('.js')) return next();
    try {
      const file = fs.readFileSync(`./dist/${js}`);
      ctx.set('Content-Type', 'text/javascript');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/js/:js', async ctx => {
    const { js } = ctx.params;
    try {
      const file = fs.readFileSync(`./dist/js/${js}`);
      ctx.set('Content-Type', 'text/javascript');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/images/:image', async ctx => {
    const { image } = ctx.params;
    try {
      const file = fs.readFileSync(`./dist/images/${image}`);
      ctx.set('Content-Type', typeToMime[image.split('.')[1]]);
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/images/:banner/:image', async ctx => {
    const { banner, image } = ctx.params;
    try {
      const file = fs.readFileSync(`./dist/images/${banner}/${image}`);
      ctx.set('Content-Type', typeToMime[image.split('.')[1]]);
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get(/\/sys(\/|$)/, async ctx => {
    try {
      const file = fs.readFileSync('./dist/sys.html');
      ctx.set('Content-Type', 'text/html');
      ctx.status = 200;
      ctx.body = file;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  })
  .get('/uploads/:dir/:file', async ctx => {
    const { dir = null, file = null } = ctx.params;

    try {
      if (!dir || !file) throw new Error('dir or file doesnot exist');
      
      const image = fs.readFileSync(`./uploads/${dir}/${file}`);
      ctx.set('Content-Type', typeToMime[file.split('.')[1]]);
      ctx.status = 200;
      ctx.body = image;
    } catch (error) {
      console.error(error);

      ctx.throw(404, 'resource not found');
    }
  });


  export default router;
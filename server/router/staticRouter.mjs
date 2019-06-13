import Router from 'koa-router';
import fs from 'fs';

const router = new Router();

router.get('/favicon.ico', async ctx => {
  try {
    const file = fs.readFileSync('./public/favicon.ico');
    ctx.set('Content-Type', 'X-Icon');
    ctx.status = 200;
    ctx.body = file;
  } catch (error) {
    console.error(error);

    ctx.throw(404, 'resource not found');
  }
});

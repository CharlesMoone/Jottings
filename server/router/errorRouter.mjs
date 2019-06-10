import Router from 'koa-router';

const router = new Router();

router.all('/api/*', ctx => {
  ctx.status = 404;
  ctx.body = { code: -1, msg: 'request api not found' };
});

export default router;
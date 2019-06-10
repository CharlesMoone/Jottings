import Router from 'koa-router';
import AuthModel from '../model/authModel.mjs';
import codeMsg from '../utils/codeMsg.mjs';

const router = new Router();

router
  .get('/api/auth', async ctx => {
    const uuid = ctx.cookies.get('uuid');
    if (!uuid) ctx.throw(401, 'cookie error');

    try {
      const result = await AuthModel.findOne({ _id: uuid });
      ctx.status = 200;
      ctx.body = result.authlist;
    } catch (error) {
      ctx.throw(401, 'cookie error');
    }
  })
  .post('/api/login', async ctx => {
    const { username, password } = ctx.request.body;

    try {
      const result = await AuthModel.findOne({ username });
      const isMatch = result.comparePassword(password);
      if (isMatch) {
        [ctx.status, ctx.body] = codeMsg.APISUCCESS;
        ctx.cookies.set('uuid', result._id, { signed: true, expires: new Date(Date.now() + 4800000) });
      } else {
        [ctx.status, ctx.body] = codeMsg.AUTHERROR;
      }
    } catch (error) {
      ctx.throw(500, 'server error');
    }
  });

export default router;

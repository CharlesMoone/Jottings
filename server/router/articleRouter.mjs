import Router from 'koa-router';
import ArticleModel from '../model/articleModel.mjs';
import cookieCheck from '../middleware/cookieCheck.mjs';
import articleHandle from '../middleware/paramsHandle/articleHandle.mjs';

const router = new Router();

router
  .get('/api/article', cookieCheck, articleHandle, async ctx => {
    console.log(ctx.handleParams);

    try {
      const result = await ArticleModel.find();
    } catch (error) {}
  })
  .post('/api/article', cookieCheck, articleHandle, async ctx => {
    console.log(ctx.handleParams);
  });

export default router;

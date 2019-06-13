import Router from 'koa-router';
import koaBody from 'koa-body';
import fs from 'fs';
import ArticleModel from '../model/articleModel.mjs';
import cookieCheck from '../middleware/cookieCheck.mjs';
import articleHandle from '../middleware/paramsHandle/articleHandle.mjs';
import imageTypeMap from '../utils/imageTypeMap.mjs';
import codeMsg from '../utils/codeMsg.mjs';

const router = new Router();

router
  .get('/api/article', cookieCheck, articleHandle, async ctx => {
    console.log(ctx.handleParams);

    try {
      const result = await ArticleModel.find();
      ctx.status = 204;
    } catch (error) {}
  })
  .post('/api/article', koaBody({ multipart: true }), cookieCheck, articleHandle, async ctx => {
    const conditions = ctx.handleParams;
    const file = ctx.request.files.image;
    const reader = fs.createReadStream(file.path);
    const dirpath = `./uploads/${ctx.authinfo._id}`;
    try {
      fs.accessSync(dirpath);
    } catch {
      fs.mkdirSync(dirpath, { recursive: true });
    }
    const stream = fs.createWriteStream(`${dirpath}/${Date.now()}.${imageTypeMap[file.type]}`, { flags: 'w+' });
    reader.pipe(stream);

    try {
      await new ArticleModel({ ...conditions, image: stream.path }).save();
      [ctx.status, ctx.body] = codeMsg.APISUCCESS;
    } catch (error) {
      console.error(error);
      [ctx.status, ctx.body] = codeMsg.SERVERERROR;
    }
  });

export default router;

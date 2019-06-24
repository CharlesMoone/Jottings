import Router from 'koa-router';
import koaBody from 'koa-body';
import fs from 'fs';
import ArticleModel from '../model/articleModel.mjs';
import cookieCheck from '../middleware/cookieCheck.mjs';
import articleHandle from '../middleware/paramsHandle/articleHandle.mjs';
import { mimeToType } from '../utils/imageTypeMap.mjs';
import codeMsg from '../utils/codeMsg.mjs';

const router = new Router();

router
  .get('/v1/api/article', async ctx => {
    try {
      const result = await ArticleModel.find();
      [ctx.status, ctx.body] = codeMsg.APISUCCESS;
      ctx.body = { ...ctx.body, data: result };
      ctx.status = 200;
    } catch (error) {
      console.error(error);
      [ctx.status, ctx.body] = codeMsg.SERVERERROR;
    }
  })
  .get('/v1/api/article/:_id', async ctx => {
    const { _id } = ctx.params;
    try {
      const result = await ArticleModel.findOne({ _id });
      [ctx.status, ctx.body] = codeMsg.APISUCCESS;
      ctx.body = { ...ctx.body, data: result };
      ctx.status = 200;
    } catch (error) {
      console.error(error);
      [ctx.status, ctx.body] = codeMsg.SERVERERROR;
    }
  })
  .get('/api/article', cookieCheck, articleHandle, async ctx => {
    let { page = 1, pageSize = 10, sort = 1, sortBy = '' } = ctx.handleParams;

    try {
      const result = await ArticleModel.find()
        .skip(--page * pageSize)
        .limit(Number(pageSize))
        .sort(sortBy ? { sortBy: sort } : {});
      [ctx.status, ctx.body] = codeMsg.APISUCCESS;
      ctx.body = { ...ctx.body, data: result };
      ctx.status = 200;
    } catch (error) {
      console.error(error);
      [ctx.status, ctx.body] = codeMsg.SERVERERROR;
    }
  })
  .post(
    '/api/article',
    koaBody({ multipart: true }),
    cookieCheck,
    articleHandle,
    async ctx => {
      const conditions = ctx.handleParams;
      const file = ctx.request.files.image;
      const reader = fs.createReadStream(file.path);
      const dirpath = `./uploads/${ctx.authinfo._id}`;
      try {
        fs.accessSync(dirpath);
      } catch {
        fs.mkdirSync(dirpath, { recursive: true });
      }
      const stream = fs.createWriteStream(
        `${dirpath}/${Date.now()}.${mimeToType[file.type]}`,
        { flags: 'w+' },
      );
      reader.pipe(stream);

      try {
        await new ArticleModel({
          ...conditions,
          image: stream.path.slice(1),
        }).save();
        [ctx.status, ctx.body] = codeMsg.APISUCCESS;
      } catch (error) {
        console.error(error);
        [ctx.status, ctx.body] = codeMsg.SERVERERROR;
      }
    },
  )
  .patch(
    '/api/article/:_id',
    koaBody({ multipart: true }),
    cookieCheck,
    articleHandle,
    async ctx => {
      const conditions = ctx.handleParams;
      const { _id } = ctx.params;
      let stream = null;

      if (Object.keys(ctx.request.files).length) {
        const file = ctx.request.files.image;
        const reader = fs.createReadStream(file.path);
        const dirpath = `./uploads/${ctx.authinfo._id}`;
        try {
          fs.accessSync(dirpath);
        } catch {
          fs.mkdirSync(dirpath, { recursive: true });
        }
        stream = fs.createWriteStream(
          `${dirpath}/${Date.now()}.${mimeToType[file.type]}`,
          { flags: 'w+' },
        );
        reader.pipe(stream);
      }

      try {
        await ArticleModel.updateOne(
          { _id },
          { ...conditions, ...(stream ? { image: stream.path.slice(1) } : {}) },
        );
        [ctx.status, ctx.body] = codeMsg.APISUCCESS;
      } catch (error) {
        console.error(error);
        [ctx.status, ctx.body] = codeMsg.SERVERERROR;
      }
    },
  );

export default router;

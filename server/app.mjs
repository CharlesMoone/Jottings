import Koa from 'koa';
import http from 'http';
// import https from 'https';
import bodyparser from 'koa-bodyparser';
import mongoose from 'mongoose';

import keys from './utils/keys.mjs';

import authRouter from './router/authRouter.mjs';
import articleRouter from './router/articleRouter.mjs';
import staticRouter from './router/staticRouter.mjs';
import errorRouter from './router/errorRouter.mjs';

mongoose.connect('mongodb://localhost:27017/jottings', { useNewUrlParser: true, useCreateIndex: true });

const app = new Koa();

app.keys = keys;

// body data save in 'ctx.request.body'
// note: should have Headers: { 'Content-Type': 'application/json' }
app.use(bodyparser());
app.use(authRouter.routes());
app.use(articleRouter.routes());
app.use(staticRouter.routes());
app.use(errorRouter.routes());

app.on('error', (err, ctx) => {
  console.log(err);
  ctx.status = 500;
  ctx.body = { code: -1, msg: 'server got some error' };
});

console.log('server start at port:8888');
http.createServer(app.callback()).listen(8888);

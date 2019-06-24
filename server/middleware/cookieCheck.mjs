import AuthModel from '../model/authModel.mjs';
import codeMsg from '../utils/codeMsg.mjs';

export default async (ctx, next) => {
  const uuid = ctx.cookies.get('uuid');
  if (!uuid) ctx.throw(401, 'cookie error');

  try {
    const result = await AuthModel.findOne({ _id: uuid });
    let _path = ctx.path.slice(1);
    if (ctx.method === 'PATCH' || ctx.method === 'PUT' || ctx.method === 'DELETE') {
      _path = ctx._matchedRoute.split(':')[0];
      _path = _path.slice(1, _path.length - 1);
    }
    console.log(result.authlist, _path);
    if (result.authlist.includes(_path)) {
      ctx.authinfo = result;
      return next();
    } else {
      [ctx.status, ctx.body] = codeMsg.COOKIEERROR;
    }
  } catch (error) {
    console.log(error);
    ctx.throw(401, 'cookie error');
  }
};
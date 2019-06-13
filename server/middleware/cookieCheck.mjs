import AuthModel from '../model/authModel.mjs';
import codeMsg from '../utils/codeMsg.mjs';

export default async (ctx, next) => {
  const uuid = ctx.cookies.get('uuid');
  if (!uuid) ctx.throw(401, 'cookie error');

  try {
    const result = await AuthModel.findOne({ _id: uuid });
    if (result.authlist.includes(ctx.path.slice(1))) {
      ctx.authinfo = result;
      return next();
    } else {
      [ctx.status, ctx.body] = codeMsg.COOKIEERROR;
    }
  } catch (error) {
    ctx.throw(401, 'cookie error');
  }
};
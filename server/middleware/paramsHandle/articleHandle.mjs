const articleHandle = {
  GET: ['title'],
  POST: ['title', 'content'],
};

/**
 * handleParams
 * get params frm query & body
 * 
 * note: param in query return *String*
 * 
 */
export default (ctx, next) => {
  const handleParams = {};

  for (let query in ctx.query) {
    articleHandle[ctx.request.method].includes(query) && (handleParams[query] = ctx.query[query]);
  }

  for (let body in ctx.request.body) {
    articleHandle[ctx.request.method].includes(body) && (handleParams[body] = ctx.request.body[body]);
  }

  ctx.handleParams = handleParams;

  next();
}

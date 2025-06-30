import { Context } from 'koa';

const Health = (ctx: Context): void => {
  ctx.body = { status: 'ok' };
};

export default Health;

import { Context } from 'koa';

const Discovery = (ctx: Context): void => {
  ctx.body = {
    name: 'Issue Service',
    version: '1.0.0',
    docs: '/docs'
  };
};

export default Discovery;

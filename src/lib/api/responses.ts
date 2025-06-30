import { Context } from 'koa';

const responses = {
  success: (ctx: Context, data: any) => {
    ctx.status = 200;
    ctx.body = {
      success: true,
      data,
    };
  },

  badRequest: (ctx: Context, errors: any) => {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors,
    };
  },

  unauthorized: (ctx: Context, message: string) => {
    ctx.status = 401;
    ctx.body = { success: false, message };
  },

  notFound: (ctx: Context) => {
    ctx.status = 404;
    ctx.body = {
      success: false,
      message: 'Not Found',
    };
  },
};

export default responses;

import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import responses from './responses';

const JWT_SECRET = process.env.JWT_SECRET! ?? 'test-secret'; 

const Token = {
  generateToken: (ctx: Context) => {
    const email =
      (ctx.query.email as string | undefined) ||
      (ctx.request.body as { email?: string })?.email;

    if (!email) return responses.badRequest(ctx, 'Email is required');

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    responses.success(ctx, { token });
  }
};

export default Token;

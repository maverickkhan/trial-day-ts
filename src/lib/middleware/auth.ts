import { Context, Next } from 'koa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import respond from '../api/responses';

const PUBLIC_PATHS = new Set(['/health', '/', '/token']);

export const auth = (secret: string) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    if (PUBLIC_PATHS.has(ctx.path)) return next();

    // 1. X-Client-ID header
    const clientId = ctx.get('X-Client-ID');
    if (!clientId) {
      respond.badRequest(ctx, 'Missing X-Client-ID header');
      return;
    }

    // 2. Bearer token
    const [, token] = (ctx.get('Authorization') || '').match(/^Bearer (.+)$/i) || [];
    if (!token) {
      respond.unauthorized(ctx, 'Missing Bearer token');
      return;
    }

    try {
      const payload = jwt.verify(token, secret) as JwtPayload;
      ctx.state.user = payload;        // { email: ... }
      ctx.state.clientId = clientId;
      await next();
    } catch {
      respond.unauthorized(ctx, 'Invalid or expired token');
    }
  };
};

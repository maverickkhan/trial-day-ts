import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { auth } from './auth';
import respond from '../api/responses';

vi.mock('../api/responses');

describe('auth middleware', () => {
  const secret = 'super-secret';
  let ctx: any;
  let next: any;

  beforeEach(() => {
    vi.clearAllMocks();
    ctx = {
      path: '/protected',
      get: vi.fn(),
      state: {},
    };
    next = vi.fn();
  });

  it('calls next for public paths', async () => {
    ctx.path = '/health';
    await auth(secret)(ctx, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns badRequest if X-Client-ID header is missing', async () => {
    ctx.get.mockImplementation((header: string) => {
      if (header === 'Authorization') return 'Bearer xyz';
      return '';
    });
    const badRequestSpy = vi.spyOn(respond, 'badRequest').mockImplementation(() => {});
    await auth(secret)(ctx, next);
    expect(badRequestSpy).toHaveBeenCalledWith(ctx, 'Missing X-Client-ID header');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns unauthorized if Bearer token is missing', async () => {
    ctx.get.mockImplementation((header: string) => {
      if (header === 'X-Client-ID') return 'abc-client';
      return '';
    });
    const unauthorizedSpy = vi.spyOn(respond, 'unauthorized').mockImplementation(() => {});
    await auth(secret)(ctx, next);
    expect(unauthorizedSpy).toHaveBeenCalledWith(ctx, 'Missing Bearer token');
    expect(next).not.toHaveBeenCalled();
  });

  it('sets ctx.state and calls next if JWT is valid', async () => {
    ctx.get.mockImplementation((header: string) => {
      if (header === 'X-Client-ID') return 'abc-client';
      if (header === 'Authorization') return 'Bearer valid.jwt.token';
      return '';
    });
    const userPayload = { email: 'john@example.com' };
    vi.spyOn(jwt, 'verify').mockImplementation(() => userPayload as any);
    await auth(secret)(ctx, next);
    expect(ctx.state.user).toEqual(userPayload);
    expect(ctx.state.clientId).toBe('abc-client');
    expect(next).toHaveBeenCalled();
  });

  it('returns unauthorized if JWT is invalid', async () => {
    ctx.get.mockImplementation((header: string) => {
      if (header === 'X-Client-ID') return 'abc-client';
      if (header === 'Authorization') return 'Bearer bad.jwt.token';
      return '';
    });
    vi.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('bad token'); });
    const unauthorizedSpy = vi.spyOn(respond, 'unauthorized').mockImplementation(() => {});
    await auth(secret)(ctx, next);
    expect(unauthorizedSpy).toHaveBeenCalledWith(ctx, 'Invalid or expired token');
    expect(next).not.toHaveBeenCalled();
  });
});

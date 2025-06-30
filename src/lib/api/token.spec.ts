import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import Token from './token';
import responses from './responses';

process.env.JWT_SECRET = 'test-secret';

vi.mock('./responses');

describe('Token.generateToken (integration)', () => {
  const ctx: any = {
    query: {},
    request: { body: {} }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    ctx.query = {};
    ctx.request.body = {};
  });

  it('should respond with a real JWT token if email is provided in query', () => {
    ctx.query.email = 'john@example.com';
    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});

    Token.generateToken(ctx);

    const token = successSpy.mock.calls[0][1].token;
    const decoded = jwt.verify(token, 'test-secret') as any;

    expect(decoded.email).toBe('john@example.com');
    expect(typeof token).toBe('string');
    expect(successSpy).toHaveBeenCalledWith(ctx, { token });
  });

  it('should respond with a real JWT token if email is provided in body', () => {
    ctx.request.body.email = 'jane@example.com';
    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});

    Token.generateToken(ctx);

    const token = successSpy.mock.calls[0][1].token;
    const decoded = jwt.verify(token, 'test-secret') as any;

    expect(decoded.email).toBe('jane@example.com');
    expect(typeof token).toBe('string');
    expect(successSpy).toHaveBeenCalledWith(ctx, { token });
  });

  it('should respond with badRequest if email is missing', () => {
    const badRequestSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});

    Token.generateToken(ctx);

    expect(badRequestSpy).toHaveBeenCalledWith(ctx, 'Email is required');
  });
});

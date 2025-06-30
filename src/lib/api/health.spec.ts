import { describe, it, expect } from 'vitest';
import health from './health';

describe('health API', () => {
  it('should respond with OK', async () => {
    const ctx: any = {};
    await health(ctx);
    expect(ctx.body).toEqual({ status: 'ok' });
  });
});

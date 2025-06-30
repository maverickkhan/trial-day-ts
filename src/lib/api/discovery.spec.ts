import { describe, it, expect } from 'vitest';
import discovery from './discovery';

describe('Discovery API', () => {
  it('should respond with name, version, and docs path', () => {
    const ctx: any = {};
    discovery(ctx);
    expect(ctx.body).toEqual({
      name: 'Issue Service',
      version: '1.0.0',
      docs: '/docs'
    });
  });
});

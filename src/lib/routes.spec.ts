import { describe, it, expect } from 'vitest';
import Router from 'koa-router';
import router from './routes';

function findRoute(method: string, path: string) {
  return router.stack.find(
    (layer: any) =>
      layer.methods.includes(method) && layer.path === path
  );
}

describe('Koa Router: routes', () => {
  it('registers /health (GET)', () => {
    const route = findRoute('GET', '/health');
    expect(route).toBeDefined();
  });

  it('registers /discovery (GET)', () => {
    const route = findRoute('GET', '/discovery');
    expect(route).toBeDefined();
  });

  it('registers /token (GET)', () => {
    const route = findRoute('GET', '/token');
    expect(route).toBeDefined();
  });

  it('registers /issues (GET)', () => {
    const route = findRoute('GET', '/issues');
    expect(route).toBeDefined();
  });

  it('registers /issues (POST)', () => {
    const route = findRoute('POST', '/issues');
    expect(route).toBeDefined();
  });

  it('registers /issues/:id (GET)', () => {
    const route = findRoute('GET', '/issues/:id');
    expect(route).toBeDefined();
  });

  it('registers /issues/:id (PATCH)', () => {
    const route = findRoute('PATCH', '/issues/:id');
    expect(route).toBeDefined();
  });

  it('registers /issues/:id (DELETE)', () => {
    const route = findRoute('DELETE', '/issues/:id');
    expect(route).toBeDefined();
  });

  it('registers /issues/:id/revisions (GET)', () => {
    const route = findRoute('GET', '/issues/:id/revisions');
    expect(route).toBeDefined();
  });

  it('registers /issues/:id/compare (GET)', () => {
    const route = findRoute('GET', '/issues/:id/compare');
    expect(route).toBeDefined();
  });

  it('should have no duplicate method+path', () => {
    const combos = new Set();
    for (const layer of router.stack) {
      for (const method of layer.methods) {
        const key = method + ' ' + layer.path;
        expect(combos.has(key)).toBe(false);
        combos.add(key);
      }
    }
  });
});

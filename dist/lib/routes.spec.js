"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const routes_1 = __importDefault(require("./routes"));
function findRoute(method, path) {
    return routes_1.default.stack.find((layer) => layer.methods.includes(method) && layer.path === path);
}
(0, vitest_1.describe)('Koa Router: routes', () => {
    (0, vitest_1.it)('registers /health (GET)', () => {
        const route = findRoute('GET', '/health');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /discovery (GET)', () => {
        const route = findRoute('GET', '/discovery');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /token (GET)', () => {
        const route = findRoute('GET', '/token');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /issues (GET)', () => {
        const route = findRoute('GET', '/issues');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /issues (POST)', () => {
        const route = findRoute('POST', '/issues');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /issues/:id (GET)', () => {
        const route = findRoute('GET', '/issues/:id');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /issues/:id (PATCH)', () => {
        const route = findRoute('PATCH', '/issues/:id');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /issues/:id (DELETE)', () => {
        const route = findRoute('DELETE', '/issues/:id');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /issues/:id/revisions (GET)', () => {
        const route = findRoute('GET', '/issues/:id/revisions');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('registers /issues/:id/compare (GET)', () => {
        const route = findRoute('GET', '/issues/:id/compare');
        (0, vitest_1.expect)(route).toBeDefined();
    });
    (0, vitest_1.it)('should have no duplicate method+path', () => {
        const combos = new Set();
        for (const layer of routes_1.default.stack) {
            for (const method of layer.methods) {
                const key = method + ' ' + layer.path;
                (0, vitest_1.expect)(combos.has(key)).toBe(false);
                combos.add(key);
            }
        }
    });
});

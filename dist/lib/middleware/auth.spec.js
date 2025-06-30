"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
const responses_1 = __importDefault(require("../api/responses"));
vitest_1.vi.mock('../api/responses');
(0, vitest_1.describe)('auth middleware', () => {
    const secret = 'super-secret';
    let ctx;
    let next;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        ctx = {
            path: '/protected',
            get: vitest_1.vi.fn(),
            state: {},
        };
        next = vitest_1.vi.fn();
    });
    (0, vitest_1.it)('calls next for public paths', async () => {
        ctx.path = '/health';
        await (0, auth_1.auth)(secret)(ctx, next);
        (0, vitest_1.expect)(next).toHaveBeenCalled();
    });
    (0, vitest_1.it)('returns badRequest if X-Client-ID header is missing', async () => {
        ctx.get.mockImplementation((header) => {
            if (header === 'Authorization')
                return 'Bearer xyz';
            return '';
        });
        const badRequestSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await (0, auth_1.auth)(secret)(ctx, next);
        (0, vitest_1.expect)(badRequestSpy).toHaveBeenCalledWith(ctx, 'Missing X-Client-ID header');
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('returns unauthorized if Bearer token is missing', async () => {
        ctx.get.mockImplementation((header) => {
            if (header === 'X-Client-ID')
                return 'abc-client';
            return '';
        });
        const unauthorizedSpy = vitest_1.vi.spyOn(responses_1.default, 'unauthorized').mockImplementation(() => { });
        await (0, auth_1.auth)(secret)(ctx, next);
        (0, vitest_1.expect)(unauthorizedSpy).toHaveBeenCalledWith(ctx, 'Missing Bearer token');
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('sets ctx.state and calls next if JWT is valid', async () => {
        ctx.get.mockImplementation((header) => {
            if (header === 'X-Client-ID')
                return 'abc-client';
            if (header === 'Authorization')
                return 'Bearer valid.jwt.token';
            return '';
        });
        const userPayload = { email: 'john@example.com' };
        vitest_1.vi.spyOn(jsonwebtoken_1.default, 'verify').mockImplementation(() => userPayload);
        await (0, auth_1.auth)(secret)(ctx, next);
        (0, vitest_1.expect)(ctx.state.user).toEqual(userPayload);
        (0, vitest_1.expect)(ctx.state.clientId).toBe('abc-client');
        (0, vitest_1.expect)(next).toHaveBeenCalled();
    });
    (0, vitest_1.it)('returns unauthorized if JWT is invalid', async () => {
        ctx.get.mockImplementation((header) => {
            if (header === 'X-Client-ID')
                return 'abc-client';
            if (header === 'Authorization')
                return 'Bearer bad.jwt.token';
            return '';
        });
        vitest_1.vi.spyOn(jsonwebtoken_1.default, 'verify').mockImplementation(() => { throw new Error('bad token'); });
        const unauthorizedSpy = vitest_1.vi.spyOn(responses_1.default, 'unauthorized').mockImplementation(() => { });
        await (0, auth_1.auth)(secret)(ctx, next);
        (0, vitest_1.expect)(unauthorizedSpy).toHaveBeenCalledWith(ctx, 'Invalid or expired token');
        (0, vitest_1.expect)(next).not.toHaveBeenCalled();
    });
});

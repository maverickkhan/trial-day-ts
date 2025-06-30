"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = __importDefault(require("./token"));
const responses_1 = __importDefault(require("./responses"));
process.env.JWT_SECRET = 'test-secret';
vitest_1.vi.mock('./responses');
(0, vitest_1.describe)('Token.generateToken (integration)', () => {
    const ctx = {
        query: {},
        request: { body: {} }
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        ctx.query = {};
        ctx.request.body = {};
    });
    (0, vitest_1.it)('should respond with a real JWT token if email is provided in query', () => {
        ctx.query.email = 'john@example.com';
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        token_1.default.generateToken(ctx);
        const token = successSpy.mock.calls[0][1].token;
        const decoded = jsonwebtoken_1.default.verify(token, 'test-secret');
        (0, vitest_1.expect)(decoded.email).toBe('john@example.com');
        (0, vitest_1.expect)(typeof token).toBe('string');
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, { token });
    });
    (0, vitest_1.it)('should respond with a real JWT token if email is provided in body', () => {
        ctx.request.body.email = 'jane@example.com';
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        token_1.default.generateToken(ctx);
        const token = successSpy.mock.calls[0][1].token;
        const decoded = jsonwebtoken_1.default.verify(token, 'test-secret');
        (0, vitest_1.expect)(decoded.email).toBe('jane@example.com');
        (0, vitest_1.expect)(typeof token).toBe('string');
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, { token });
    });
    (0, vitest_1.it)('should respond with badRequest if email is missing', () => {
        const badRequestSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        token_1.default.generateToken(ctx);
        (0, vitest_1.expect)(badRequestSpy).toHaveBeenCalledWith(ctx, 'Email is required');
    });
});

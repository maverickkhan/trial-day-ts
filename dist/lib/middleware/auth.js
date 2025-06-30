"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responses_1 = __importDefault(require("../api/responses"));
const PUBLIC_PATHS = new Set(['/health', '/', '/token']);
const auth = (secret) => {
    return async (ctx, next) => {
        if (PUBLIC_PATHS.has(ctx.path))
            return next();
        // 1. X-Client-ID header
        const clientId = ctx.get('X-Client-ID');
        if (!clientId) {
            responses_1.default.badRequest(ctx, 'Missing X-Client-ID header');
            return;
        }
        // 2. Bearer token
        const [, token] = (ctx.get('Authorization') || '').match(/^Bearer (.+)$/i) || [];
        if (!token) {
            responses_1.default.unauthorized(ctx, 'Missing Bearer token');
            return;
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, secret);
            ctx.state.user = payload; // { email: ... }
            ctx.state.clientId = clientId;
            await next();
        }
        catch {
            responses_1.default.unauthorized(ctx, 'Invalid or expired token');
        }
    };
};
exports.auth = auth;

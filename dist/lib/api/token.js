"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responses_1 = __importDefault(require("./responses"));
const JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
const Token = {
    generateToken: (ctx) => {
        const email = ctx.query.email ||
            ctx.request.body?.email;
        if (!email)
            return responses_1.default.badRequest(ctx, 'Email is required');
        const token = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        responses_1.default.success(ctx, { token });
    }
};
exports.default = Token;

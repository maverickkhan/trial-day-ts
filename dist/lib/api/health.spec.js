"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const health_1 = __importDefault(require("./health"));
(0, vitest_1.describe)('health API', () => {
    (0, vitest_1.it)('should respond with OK', async () => {
        const ctx = {};
        await (0, health_1.default)(ctx);
        (0, vitest_1.expect)(ctx.body).toEqual({ status: 'ok' });
    });
});

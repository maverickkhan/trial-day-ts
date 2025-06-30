"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const discovery_1 = __importDefault(require("./discovery"));
(0, vitest_1.describe)('Discovery API', () => {
    (0, vitest_1.it)('should respond with name, version, and docs path', () => {
        const ctx = {};
        (0, discovery_1.default)(ctx);
        (0, vitest_1.expect)(ctx.body).toEqual({
            name: 'Issue Service',
            version: '1.0.0',
            docs: '/docs'
        });
    });
});

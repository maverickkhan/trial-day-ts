"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const diff_1 = __importDefault(require("./diff"));
(0, vitest_1.describe)('utils/diff', () => {
    (0, vitest_1.it)('detects changed scalar fields', () => {
        const before = { title: 'A', desc: 'x' };
        const after = { title: 'B', desc: 'x' };
        (0, vitest_1.expect)((0, diff_1.default)(before, after)).toEqual({ title: 'B' });
    });
    (0, vitest_1.it)('works when input is a JSON string', () => {
        const before = '{"a":1,"b":2}';
        const after = '{"a":2,"b":2}';
        (0, vitest_1.expect)((0, diff_1.default)(before, after)).toEqual({ a: 2 });
    });
    (0, vitest_1.it)('throws on invalid JSON string', () => {
        (0, vitest_1.expect)(() => (0, diff_1.default)('{bad json}', '{"a":1}')).toThrow('Invalid JSON passed to diff()');
    });
    (0, vitest_1.it)('handles nested changed fields', () => {
        const before = { nest: { val: 1 }, x: 0 };
        const after = { nest: { val: 2 }, x: 0 };
        (0, vitest_1.expect)((0, diff_1.default)(before, after)).toEqual({ nest: { val: 2 } });
    });
    (0, vitest_1.it)('ignores unchanged nested fields', () => {
        const before = { nest: { val: 1 }, x: 0 };
        const after = { nest: { val: 1 }, x: 0 };
        (0, vitest_1.expect)((0, diff_1.default)(before, after)).toEqual({});
    });
    (0, vitest_1.it)('treats arrays as scalars (not objects)', () => {
        const before = { arr: [1, 2, 3] };
        const after = { arr: [1, 2, 4] };
        (0, vitest_1.expect)((0, diff_1.default)(before, after)).toEqual({ arr: [1, 2, 4] });
    });
});

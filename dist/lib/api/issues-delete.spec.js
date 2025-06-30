"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock('../models/issue', () => ({
    __esModule: true,
    default: {
        findByPk: vitest_1.vi.fn(),
        hasMany: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock('../models/issueRevision', () => ({
    __esModule: true,
    default: {
        belongsTo: vitest_1.vi.fn(),
    },
}));
const issues_1 = __importDefault(require("./issues"));
const issue_1 = __importDefault(require("../models/issue"));
const responses_1 = __importDefault(require("./responses"));
const makeCtx = (extra = {}) => ({
    params: {},
    state: { user: { email: 'user@test.com' } },
    ...extra,
});
(0, vitest_1.describe)('Issues.delete', () => {
    let ctx;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        ctx = makeCtx();
    });
    (0, vitest_1.it)('deletes issue if found', async () => {
        ctx.params.id = '7';
        const fakeIssue = { id: 7, destroy: vitest_1.vi.fn().mockResolvedValue(undefined) };
        issue_1.default.findByPk.mockResolvedValueOnce(fakeIssue);
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        await issues_1.default.delete(ctx);
        (0, vitest_1.expect)(fakeIssue.destroy).toHaveBeenCalled();
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, { deleted: true });
    });
    (0, vitest_1.it)('returns notFound if issue not found', async () => {
        ctx.params.id = '8';
        issue_1.default.findByPk.mockResolvedValueOnce(null);
        const nfSpy = vitest_1.vi.spyOn(responses_1.default, 'notFound').mockImplementation(() => { });
        await issues_1.default.delete(ctx);
        (0, vitest_1.expect)(nfSpy).toHaveBeenCalledWith(ctx);
    });
    (0, vitest_1.it)('handles errors thrown during findByPk', async () => {
        ctx.params.id = '8';
        issue_1.default.findByPk.mockRejectedValueOnce(new Error('fail'));
        const badSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.delete(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, 'Failed to delete issue');
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock('../models/issue', () => ({
    __esModule: true,
    default: {
        findAll: vitest_1.vi.fn(),
        findByPk: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        destroy: vitest_1.vi.fn(),
        hasMany: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock('../models/issueRevision', () => ({
    __esModule: true,
    default: {
        findAll: vitest_1.vi.fn(),
        findByPk: vitest_1.vi.fn(),
        findOne: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        belongsTo: vitest_1.vi.fn(),
    },
}));
const issues_1 = __importDefault(require("./issues"));
const issue_1 = __importDefault(require("../models/issue"));
const responses_1 = __importDefault(require("./responses"));
const makeCtx = (extra = {}) => ({
    params: {},
    query: {},
    request: { body: {} },
    state: { user: { email: 'user@test.com' } },
    ...extra,
});
(0, vitest_1.describe)('Issues API - get', () => {
    let ctx;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        ctx = makeCtx();
    });
    (0, vitest_1.it)('get: responds with all issues', async () => {
        const fakeIssues = [{ id: 1 }];
        issue_1.default.findAll.mockResolvedValueOnce(fakeIssues);
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        await issues_1.default.get(ctx);
        (0, vitest_1.expect)(issue_1.default.findAll).toHaveBeenCalled();
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, fakeIssues);
    });
    (0, vitest_1.it)('get: handles error', async () => {
        issue_1.default.findAll.mockRejectedValueOnce(new Error('fail'));
        const badSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.get(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, 'Failed to fetch issues');
    });
    (0, vitest_1.it)('getOne: returns found issue', async () => {
        ctx.params.id = '2';
        const fake = { id: 2 };
        issue_1.default.findByPk.mockResolvedValueOnce(fake);
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        await issues_1.default.getOne(ctx);
        (0, vitest_1.expect)(issue_1.default.findByPk).toHaveBeenCalledWith(2);
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, fake);
    });
    (0, vitest_1.it)('getOne: returns notFound if not found', async () => {
        ctx.params.id = '2';
        issue_1.default.findByPk.mockResolvedValueOnce(null);
        const nfSpy = vitest_1.vi.spyOn(responses_1.default, 'notFound').mockImplementation(() => { });
        await issues_1.default.getOne(ctx);
        (0, vitest_1.expect)(nfSpy).toHaveBeenCalledWith(ctx);
    });
    (0, vitest_1.it)('getOne: handles error', async () => {
        ctx.params.id = '2';
        issue_1.default.findByPk.mockRejectedValueOnce(new Error('fail'));
        const badSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.getOne(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, 'Failed to fetch issue');
    });
});

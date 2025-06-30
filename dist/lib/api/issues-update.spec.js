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
        create: vitest_1.vi.fn(),
        belongsTo: vitest_1.vi.fn(),
    },
}));
const issues_1 = __importDefault(require("./issues"));
const issue_1 = __importDefault(require("../models/issue"));
const issueRevision_1 = __importDefault(require("../models/issueRevision"));
const responses_1 = __importDefault(require("./responses"));
const issue_schema_1 = require("../schemas/issue.schema");
const makeCtx = (extra = {}) => ({
    params: {},
    request: { body: {} },
    state: { user: { email: 'user@test.com' } },
    ...extra,
});
(0, vitest_1.describe)('Issues.update', () => {
    let ctx;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        ctx = makeCtx();
    });
    (0, vitest_1.it)('validates and updates issue, saves revision', async () => {
        ctx.params.id = '5';
        ctx.request.body = { title: 'z', description: 'y' };
        vitest_1.vi.spyOn(issue_schema_1.UpdateIssueSchema, 'safeParse').mockReturnValue({
            success: true,
            data: { title: 'z', description: 'y' }
        });
        const fakeIssue = {
            id: 5,
            toJSON: vitest_1.vi.fn()
                .mockReturnValueOnce({ title: 'old', description: 'x' })
                .mockReturnValueOnce({ title: 'z', description: 'y' }),
            update: vitest_1.vi.fn().mockResolvedValue(undefined),
        };
        issue_1.default.findByPk.mockResolvedValueOnce(fakeIssue);
        issueRevision_1.default.create.mockResolvedValueOnce({ id: 9 });
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        await issues_1.default.update(ctx);
        (0, vitest_1.expect)(issue_1.default.findByPk).toHaveBeenCalledWith(5);
        (0, vitest_1.expect)(fakeIssue.update).toHaveBeenCalledWith({ title: 'z', description: 'y', updated_by: 'user@test.com' });
        (0, vitest_1.expect)(issueRevision_1.default.create).toHaveBeenCalled();
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, fakeIssue);
    });
    (0, vitest_1.it)('returns badRequest if validation fails', async () => {
        vitest_1.vi.spyOn(issue_schema_1.UpdateIssueSchema, 'safeParse').mockReturnValue({
            success: false,
            error: { flatten: () => ({ fieldErrors: { title: ['invalid'] } }) }
        });
        const badSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.update(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, { title: ['invalid'] });
    });
    (0, vitest_1.it)('returns notFound if issue not found', async () => {
        ctx.params.id = '3';
        vitest_1.vi.spyOn(issue_schema_1.UpdateIssueSchema, 'safeParse').mockReturnValue({
            success: true,
            data: { title: 'q', description: 'r' }
        });
        issue_1.default.findByPk.mockResolvedValueOnce(null);
        const nfSpy = vitest_1.vi.spyOn(responses_1.default, 'notFound').mockImplementation(() => { });
        await issues_1.default.update(ctx);
        (0, vitest_1.expect)(nfSpy).toHaveBeenCalledWith(ctx);
    });
});

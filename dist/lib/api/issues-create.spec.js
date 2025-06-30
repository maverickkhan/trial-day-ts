"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock('../models/issue', () => ({
    __esModule: true,
    default: {
        create: vitest_1.vi.fn(),
        hasMany: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock('../models/issueRevision', () => ({
    __esModule: true,
    default: { belongsTo: vitest_1.vi.fn() },
}));
const issues_1 = __importDefault(require("./issues"));
const issue_1 = __importDefault(require("../models/issue"));
const responses_1 = __importDefault(require("./responses"));
const issue_schema_1 = require("../schemas/issue.schema");
const makeCtx = (extra = {}) => ({
    request: { body: {} },
    state: { user: { email: 'user@test.com' } },
    ...extra,
});
(0, vitest_1.describe)('Issues.create', () => {
    let ctx;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        ctx = makeCtx();
    });
    (0, vitest_1.it)('creates an issue if input is valid', async () => {
        ctx.request.body = { title: 'a', description: 'b' };
        vitest_1.vi.spyOn(issue_schema_1.CreateIssueSchema, 'safeParse').mockReturnValue({
            success: true,
            data: { title: 'a', description: 'b' },
        });
        issue_1.default.create.mockResolvedValueOnce({ id: 1, title: 'a', description: 'b' });
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        await issues_1.default.create(ctx);
        (0, vitest_1.expect)(issue_1.default.create).toHaveBeenCalledWith({
            title: 'a',
            description: 'b',
            created_by: 'user@test.com',
            updated_by: 'user@test.com'
        });
        (0, vitest_1.expect)(successSpy).toHaveBeenCalled();
    });
    (0, vitest_1.it)('returns badRequest if validation fails', async () => {
        vitest_1.vi.spyOn(issue_schema_1.CreateIssueSchema, 'safeParse').mockReturnValue({
            success: false,
            error: { flatten: () => ({ fieldErrors: { title: ['required'] } }) }
        });
        const badSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.create(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, { title: ['required'] });
    });
    (0, vitest_1.it)('handles model error', async () => {
        vitest_1.vi.spyOn(issue_schema_1.CreateIssueSchema, 'safeParse').mockReturnValue({
            success: true,
            data: { title: 'a', description: 'b' }
        });
        issue_1.default.create.mockRejectedValueOnce(new Error('fail'));
        const badSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.create(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, 'Failed to create issue');
    });
});

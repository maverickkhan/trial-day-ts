"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
vitest_1.vi.mock('../models/issue', () => {
    const { Model } = require('sequelize');
    class MockIssue extends Model {
    }
    MockIssue.findByPk = vitest_1.vi.fn();
    return { default: MockIssue };
});
vitest_1.vi.mock('../models/issueRevision', () => {
    const { Model } = require('sequelize');
    class MockRevision extends Model {
    }
    MockRevision.findOne = vitest_1.vi.fn();
    MockRevision.findAll = vitest_1.vi.fn();
    return { default: MockRevision };
});
const vitest_1 = require("vitest");
const issues_1 = __importDefault(require("./issues"));
const issueRevision_1 = __importDefault(require("../models/issueRevision"));
const responses_1 = __importDefault(require("./responses"));
const responses_2 = __importDefault(require("./responses"));
const ctx = {
    params: { id: '1' },
    query: { revA: '2', revB: '3' },
    state: { user: { email: 'test@example.com' } },
    request: {},
    body: {},
    status: 0,
};
(0, vitest_1.beforeEach)(() => {
    vitest_1.vi.clearAllMocks();
});
(0, vitest_1.describe)('Issues.compare', () => {
    (0, vitest_1.it)('returns before / after / changes', async () => {
        const revA = {
            id: 2,
            updated_at: new Date('2024-01-01'),
            issue_snapshot: { d: 1 },
        };
        const revB = {
            id: 3,
            updated_at: new Date('2024-02-01'),
            issue_snapshot: { d: 2 },
        };
        issueRevision_1.default.findOne
            .mockResolvedValueOnce(revA)
            .mockResolvedValueOnce(revB);
        issueRevision_1.default.findAll.mockResolvedValue([revA, revB]);
        const successSpy = vitest_1.vi
            .spyOn(responses_1.default, 'success')
            .mockImplementation(() => { });
        await issues_1.default.compare(ctx);
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledTimes(1);
        const [, payload] = successSpy.mock.calls[0];
        (0, vitest_1.expect)(payload.before).toEqual({ d: 1 });
        (0, vitest_1.expect)(payload.after).toEqual({ d: 2 });
        (0, vitest_1.expect)(payload.changes).toEqual({ d: 2 });
    });
    (0, vitest_1.it)('compare: returns badRequest if revA and revB are missing', async () => {
        ctx.params.id = '1';
        ctx.query = {};
        const badSpy = vitest_1.vi.spyOn(responses_2.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.compare(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, 'revA and revB query params are required');
    });
    (0, vitest_1.it)('compare: returns notFound if either revision is not found', async () => {
        ctx.params.id = '1';
        ctx.query = { revA: 2, revB: 3 };
        issueRevision_1.default.findOne
            .mockResolvedValueOnce({ updated_at: new Date(), issue_snapshot: {} })
            .mockResolvedValueOnce(null);
        const nfSpy = vitest_1.vi.spyOn(responses_2.default, 'notFound').mockImplementation(() => { });
        await issues_1.default.compare(ctx);
        (0, vitest_1.expect)(nfSpy).toHaveBeenCalledWith(ctx);
    });
    (0, vitest_1.it)('compare: returns badRequest if an error occurs in compare', async () => {
        ctx.params.id = '1';
        ctx.query = { revA: 2, revB: 3 };
        issueRevision_1.default.findOne.mockRejectedValueOnce(new Error('unexpected'));
        const badSpy = vitest_1.vi.spyOn(responses_2.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.compare(ctx);
        (0, vitest_1.expect)(badSpy).toHaveBeenCalledWith(ctx, 'Failed to compare issue revisions');
    });
    (0, vitest_1.it)('compare: returns before/after with revB as older', async () => {
        ctx.params.id = '1';
        ctx.query = { revA: 2, revB: 3 };
        const revAObj = {
            updated_at: new Date('2023-03-01T10:00:00Z'),
            issue_snapshot: { title: 'newest' },
        };
        const revBObj = {
            updated_at: new Date('2023-02-01T10:00:00Z'),
            issue_snapshot: { title: 'older' },
        };
        issueRevision_1.default.findOne
            .mockResolvedValueOnce(revAObj)
            .mockResolvedValueOnce(revBObj);
        issueRevision_1.default.findAll.mockResolvedValueOnce([revBObj, revAObj]);
        const successSpy = vitest_1.vi.spyOn(responses_2.default, 'success').mockImplementation(() => { });
        await issues_1.default.compare(ctx);
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, vitest_1.expect.objectContaining({
            before: revBObj.issue_snapshot,
            after: revAObj.issue_snapshot,
            changes: vitest_1.expect.any(Object),
            revisions: [revBObj, revAObj],
        }));
    });
});

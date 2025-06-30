vi.mock('../models/issue', () => {
    const { Model } = require('sequelize');
    class MockIssue extends (Model as typeof Model) { }
    (MockIssue as any).findByPk = vi.fn();
    return { default: MockIssue };
});

vi.mock('../models/issueRevision', () => {
    const { Model } = require('sequelize');
    class MockRevision extends (Model as typeof Model) { }
    (MockRevision as any).findOne = vi.fn();
    (MockRevision as any).findAll = vi.fn();
    return { default: MockRevision };
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import Issues from './issues';
import IssueRevisionModel from '../models/issueRevision';
import respond from './responses';
import responses from './responses';

const ctx = {
    params: { id: '1' },
    query: { revA: '2', revB: '3' },
    state: { user: { email: 'test@example.com' } },
    request: {},
    body: {},
    status: 0,
} as any;

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Issues.compare', () => {
    it('returns before / after / changes', async () => {
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

        (IssueRevisionModel.findOne as any)
            .mockResolvedValueOnce(revA)
            .mockResolvedValueOnce(revB);

        (IssueRevisionModel.findAll as any).mockResolvedValue([revA, revB]);

        const successSpy = vi
            .spyOn(respond, 'success')
            .mockImplementation(() => { });

        await Issues.compare(ctx);

        expect(successSpy).toHaveBeenCalledTimes(1);
        const [, payload] = successSpy.mock.calls[0] as [any, any];
        expect(payload.before).toEqual({ d: 1 });
        expect(payload.after).toEqual({ d: 2 });
        expect(payload.changes).toEqual({ d: 2 });
    });

    it('compare: returns badRequest if revA and revB are missing', async () => {
        ctx.params.id = '1';
        ctx.query = {}; 
        const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => { });
        await Issues.compare(ctx);
        expect(badSpy).toHaveBeenCalledWith(ctx, 'revA and revB query params are required');
    });

    it('compare: returns notFound if either revision is not found', async () => {
        ctx.params.id = '1';
        ctx.query = { revA: 2, revB: 3 };
        (IssueRevisionModel.findOne as any)
            .mockResolvedValueOnce({ updated_at: new Date(), issue_snapshot: {} })
            .mockResolvedValueOnce(null);

        const nfSpy = vi.spyOn(responses, 'notFound').mockImplementation(() => { });
        await Issues.compare(ctx);
        expect(nfSpy).toHaveBeenCalledWith(ctx);
    });

    it('compare: returns badRequest if an error occurs in compare', async () => {
        ctx.params.id = '1';
        ctx.query = { revA: 2, revB: 3 };
        (IssueRevisionModel.findOne as any).mockRejectedValueOnce(new Error('unexpected'));
        const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => { });
        await Issues.compare(ctx);
        expect(badSpy).toHaveBeenCalledWith(ctx, 'Failed to compare issue revisions');
    });

    it('compare: returns before/after with revB as older', async () => {
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

        (IssueRevisionModel.findOne as any)
            .mockResolvedValueOnce(revAObj)
            .mockResolvedValueOnce(revBObj);

        (IssueRevisionModel.findAll as any).mockResolvedValueOnce([revBObj, revAObj]);

        const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => { });

        await Issues.compare(ctx);

        expect(successSpy).toHaveBeenCalledWith(ctx, expect.objectContaining({
            before: revBObj.issue_snapshot,
            after: revAObj.issue_snapshot,
            changes: expect.any(Object),
            revisions: [revBObj, revAObj],
        }));
    });
});

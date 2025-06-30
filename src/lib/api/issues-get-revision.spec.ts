import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import Issues from './issues';
import IssueRevisionModel from '../models/issueRevision';
import responses from './responses';

describe('Issues.getRevisions', () => {
  const ctx: any = { params: { id: '123' } };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should respond with revisions on success', async () => {
    const fakeRevisions = [{ id: 1 }, { id: 2 }];
    vi.spyOn(IssueRevisionModel, 'findAll').mockResolvedValueOnce(fakeRevisions as any);
    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});

    await Issues.getRevisions(ctx);

    expect(IssueRevisionModel.findAll).toHaveBeenCalledWith({
      where: { issue_id: 123 },
      order: [['updated_at', 'DESC']],
    });
    expect(successSpy).toHaveBeenCalledWith(ctx, fakeRevisions);
  });

  it('should handle errors and respond with badRequest', async () => {
    vi.spyOn(IssueRevisionModel, 'findAll').mockRejectedValueOnce(new Error('DB error'));
    const badRequestSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});

    await Issues.getRevisions(ctx);

    expect(badRequestSpy).toHaveBeenCalledWith(ctx, 'Failed to fetch revisions');
  });
});

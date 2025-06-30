import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../models/issue', () => ({
  __esModule: true,
  default: {
    findByPk: vi.fn(),
    hasMany: vi.fn(),
  },
}));
vi.mock('../models/issueRevision', () => ({
  __esModule: true,
  default: {
    belongsTo: vi.fn(), 
  },
}));

import Issues from './issues';
import IssueModel from '../models/issue';
import responses from './responses';

const makeCtx = (extra: any = {}) => ({
  params: {},
  state: { user: { email: 'user@test.com' } },
  ...extra,
});

describe('Issues.delete', () => {
  let ctx: any;
  beforeEach(() => {
    vi.clearAllMocks();
    ctx = makeCtx();
  });

  it('deletes issue if found', async () => {
    ctx.params.id = '7';
    const fakeIssue = { id: 7, destroy: vi.fn().mockResolvedValue(undefined) };
    (IssueModel.findByPk as any).mockResolvedValueOnce(fakeIssue);

    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});

    await Issues.delete(ctx);

    expect(fakeIssue.destroy).toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith(ctx, { deleted: true });
  });

  it('returns notFound if issue not found', async () => {
    ctx.params.id = '8';
    (IssueModel.findByPk as any).mockResolvedValueOnce(null);

    const nfSpy = vi.spyOn(responses, 'notFound').mockImplementation(() => {});

    await Issues.delete(ctx);

    expect(nfSpy).toHaveBeenCalledWith(ctx);
  });

  it('handles errors thrown during findByPk', async () => {
    ctx.params.id = '8';
    (IssueModel.findByPk as any).mockRejectedValueOnce(new Error('fail'));

    const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});

    await Issues.delete(ctx);

    expect(badSpy).toHaveBeenCalledWith(ctx, 'Failed to delete issue');
  });
});

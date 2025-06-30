import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../models/issue', () => ({
  __esModule: true,
  default: {
    create: vi.fn(),
    hasMany: vi.fn(),
  },
}));
vi.mock('../models/issueRevision', () => ({
  __esModule: true,
  default: { belongsTo: vi.fn() },
}));

import Issues from './issues';
import IssueModel from '../models/issue';
import responses from './responses';
import { CreateIssueSchema } from '../schemas/issue.schema';

const makeCtx = (extra: any = {}) => ({
  request: { body: {} },
  state: { user: { email: 'user@test.com' } },
  ...extra,
});

describe('Issues.create', () => {
  let ctx: any;
  beforeEach(() => {
    vi.clearAllMocks();
    ctx = makeCtx();
  });

  it('creates an issue if input is valid', async () => {
    ctx.request.body = { title: 'a', description: 'b' };
    vi.spyOn(CreateIssueSchema, 'safeParse').mockReturnValue({
      success: true,
      data: { title: 'a', description: 'b' },
    } as any);
    (IssueModel.create as any).mockResolvedValueOnce({ id: 1, title: 'a', description: 'b' });

    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});
    await Issues.create(ctx);

    expect(IssueModel.create).toHaveBeenCalledWith({
      title: 'a',
      description: 'b',
      created_by: 'user@test.com',
      updated_by: 'user@test.com'
    });
    expect(successSpy).toHaveBeenCalled();
  });

  it('returns badRequest if validation fails', async () => {
    vi.spyOn(CreateIssueSchema, 'safeParse').mockReturnValue({
      success: false,
      error: { flatten: () => ({ fieldErrors: { title: ['required'] } }) }
    } as any);
    const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});
    await Issues.create(ctx);
    expect(badSpy).toHaveBeenCalledWith(ctx, { title: ['required'] });
  });

  it('handles model error', async () => {
    vi.spyOn(CreateIssueSchema, 'safeParse').mockReturnValue({
      success: true,
      data: { title: 'a', description: 'b' }
    } as any);
    (IssueModel.create as any).mockRejectedValueOnce(new Error('fail'));
    const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});
    await Issues.create(ctx);
    expect(badSpy).toHaveBeenCalledWith(ctx, 'Failed to create issue');
  });
});

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
    create: vi.fn(),
    belongsTo: vi.fn(),
  },
}));

import Issues from './issues';
import IssueModel from '../models/issue';
import IssueRevisionModel from '../models/issueRevision';
import responses from './responses';
import { UpdateIssueSchema } from '../schemas/issue.schema';

const makeCtx = (extra: any = {}) => ({
  params: {},
  request: { body: {} },
  state: { user: { email: 'user@test.com' } },
  ...extra,
});

describe('Issues.update', () => {
  let ctx: any;
  beforeEach(() => {
    vi.clearAllMocks();
    ctx = makeCtx();
  });

  it('validates and updates issue, saves revision', async () => {
    ctx.params.id = '5';
    ctx.request.body = { title: 'z', description: 'y' };
    vi.spyOn(UpdateIssueSchema, 'safeParse').mockReturnValue({
      success: true,
      data: { title: 'z', description: 'y' }
    } as any);

    const fakeIssue = {
      id: 5,
      toJSON: vi.fn()
        .mockReturnValueOnce({ title: 'old', description: 'x' }) 
        .mockReturnValueOnce({ title: 'z', description: 'y' }),  
      update: vi.fn().mockResolvedValue(undefined),
    };
    (IssueModel.findByPk as any).mockResolvedValueOnce(fakeIssue);
    (IssueRevisionModel.create as any).mockResolvedValueOnce({ id: 9 });

    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});

    await Issues.update(ctx);

    expect(IssueModel.findByPk).toHaveBeenCalledWith(5);
    expect(fakeIssue.update).toHaveBeenCalledWith({ title: 'z', description: 'y', updated_by: 'user@test.com' });
    expect(IssueRevisionModel.create).toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith(ctx, fakeIssue);
  });

  it('returns badRequest if validation fails', async () => {
    vi.spyOn(UpdateIssueSchema, 'safeParse').mockReturnValue({
      success: false,
      error: { flatten: () => ({ fieldErrors: { title: ['invalid'] } }) }
    } as any);
    const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});
    await Issues.update(ctx);
    expect(badSpy).toHaveBeenCalledWith(ctx, { title: ['invalid'] });
  });

  it('returns notFound if issue not found', async () => {
    ctx.params.id = '3';
    vi.spyOn(UpdateIssueSchema, 'safeParse').mockReturnValue({
      success: true,
      data: { title: 'q', description: 'r' }
    } as any);
    (IssueModel.findByPk as any).mockResolvedValueOnce(null);
    const nfSpy = vi.spyOn(responses, 'notFound').mockImplementation(() => {});
    await Issues.update(ctx);
    expect(nfSpy).toHaveBeenCalledWith(ctx);
  });
});

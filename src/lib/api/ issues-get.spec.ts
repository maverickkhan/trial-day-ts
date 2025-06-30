import { vi, describe, it, expect, beforeEach } from 'vitest';


vi.mock('../models/issue', () => ({
    __esModule: true,
    default: {
      findAll: vi.fn(),
      findByPk: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
      hasMany: vi.fn(),
    },
  }));

  vi.mock('../models/issueRevision', () => ({
    __esModule: true,
    default: {
      findAll: vi.fn(),
      findByPk: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      belongsTo: vi.fn(), 
    },
  }));

import Issues from './issues';
import IssueModel from '../models/issue';
import responses from './responses';

const makeCtx = (extra: any = {}) => ({
  params: {},
  query: {},
  request: { body: {} },
  state: { user: { email: 'user@test.com' } },
  ...extra,
});

describe('Issues API - get', () => {
  let ctx: any;

  beforeEach(() => {
    vi.clearAllMocks();
    ctx = makeCtx();
  });

  it('get: responds with all issues', async () => {
    const fakeIssues = [{ id: 1 }];
    (IssueModel.findAll as any).mockResolvedValueOnce(fakeIssues);
    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});

    await Issues.get(ctx);

    expect(IssueModel.findAll).toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith(ctx, fakeIssues);
  });

  it('get: handles error', async () => {
    (IssueModel.findAll as any).mockRejectedValueOnce(new Error('fail'));
    const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});

    await Issues.get(ctx);

    expect(badSpy).toHaveBeenCalledWith(ctx, 'Failed to fetch issues');
  });

  it('getOne: returns found issue', async () => {
    ctx.params.id = '2';
    const fake = { id: 2 };
    (IssueModel.findByPk as any).mockResolvedValueOnce(fake);
    const successSpy = vi.spyOn(responses, 'success').mockImplementation(() => {});

    await Issues.getOne(ctx);

    expect(IssueModel.findByPk).toHaveBeenCalledWith(2);
    expect(successSpy).toHaveBeenCalledWith(ctx, fake);
  });

  it('getOne: returns notFound if not found', async () => {
    ctx.params.id = '2';
    (IssueModel.findByPk as any).mockResolvedValueOnce(null);
    const nfSpy = vi.spyOn(responses, 'notFound').mockImplementation(() => {});

    await Issues.getOne(ctx);

    expect(nfSpy).toHaveBeenCalledWith(ctx);
  });

  it('getOne: handles error', async () => {
    ctx.params.id = '2';
    (IssueModel.findByPk as any).mockRejectedValueOnce(new Error('fail'));
    const badSpy = vi.spyOn(responses, 'badRequest').mockImplementation(() => {});

    await Issues.getOne(ctx);

    expect(badSpy).toHaveBeenCalledWith(ctx, 'Failed to fetch issue');
  });
});

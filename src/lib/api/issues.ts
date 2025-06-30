import { Context } from 'koa';
import IssueModel from '../models/issue';
import IssueRevisionModel from '../models/issueRevision';
import responses from './responses';
import diff from '../utils/diff';
import { CreateIssueSchema, UpdateIssueSchema } from '../schemas/issue.schema';
import { Op } from 'sequelize';

const Issues = {
  get: async (ctx: Context) => {
    try {
      const issues = await IssueModel.findAll();
      responses.success(ctx, issues);
    } catch (err) {
      responses.badRequest(ctx, 'Failed to fetch issues');
    }
  },

  getOne: async (ctx: Context) => {
    const id = Number(ctx.params.id);
    try {
      const issue = await IssueModel.findByPk(id);
      if (!issue) return responses.notFound(ctx);
      responses.success(ctx, issue);
    } catch (err) {
      responses.badRequest(ctx, 'Failed to fetch issue');
    }
  },

  create: async (ctx: Context) => {
    try {
      const parsed = CreateIssueSchema.safeParse(ctx.request.body);
      if (!parsed.success) {
        return responses.badRequest(ctx, parsed.error.flatten().fieldErrors);
      }
      const email: string = ctx.state.user.email;
      const { title, description } = parsed.data;
      const newIssue = await IssueModel.create({ title, description, created_by: email, updated_by: email });
      responses.success(ctx, newIssue);
    } catch (err) {
      responses.badRequest(ctx, 'Failed to create issue');
    }
  },

  update: async (ctx: Context) => {
    const id = Number(ctx.params.id);
    const parsed = UpdateIssueSchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      return responses.badRequest(ctx, parsed.error.flatten().fieldErrors);
    }
    const email = ctx.state.user.email;
    const issue = await IssueModel.findByPk(id);
    if (!issue) return responses.notFound(ctx);

    const before = issue.toJSON();
    await issue.update({ ...parsed.data, updated_by: email });
    const after = issue.toJSON();

    const changes = diff(before, after);

    await IssueRevisionModel.create({
      issue_id: id,
      title: after.title,
      description: after.description,
      issue_snapshot: after,
      changes,
      updated_by: email
    });

    responses.success(ctx, issue);
  },

  delete: async (ctx: Context) => {
    const id = Number(ctx.params.id);
    try {
      const issue = await IssueModel.findByPk(id);
      if (!issue) return responses.notFound(ctx);
      await issue.destroy();
      responses.success(ctx, { deleted: true });
    } catch (err) {
      responses.badRequest(ctx, 'Failed to delete issue');
    }
  },

  getRevisions: async (ctx: Context) => {
    const issueId = Number(ctx.params.id);
    try {
      const revisions = await IssueRevisionModel.findAll({
        where: { issue_id: issueId },
        order: [['updated_at', 'DESC']],
      });
      responses.success(ctx, revisions);
    } catch (err) {
      responses.badRequest(ctx, 'Failed to fetch revisions');
    }
  },

  compare: async (ctx: Context) => {
    const issueId = Number(ctx.params.id);
    const revAId  = Number(ctx.query.revA);
    const revBId  = Number(ctx.query.revB);
  
    if (!revAId || !revBId) {
      return responses.badRequest(ctx, 'revA and revB query params are required');
    }
  
    try {
      const [revA, revB] = await Promise.all([
        IssueRevisionModel.findOne({ where: { id: revAId, issue_id: issueId } }),
        IssueRevisionModel.findOne({ where: { id: revBId, issue_id: issueId } }),
      ]);
  
      if (!revA || !revB) {
        return responses.notFound(ctx);
      }
  
      const older = revA.updated_at! <= revB.updated_at! ? revA : revB;
      const newer = older === revA ? revB : revA;
  
      const changes = diff(older.issue_snapshot, newer.issue_snapshot);
  
      const trail = await IssueRevisionModel.findAll({
        where: {
          issue_id: issueId,
          id: { [Op.between]: [Math.min(revAId, revBId), Math.max(revAId, revBId)] },
        },
        order: [['updated_at', 'ASC']],
      });
  
      responses.success(ctx, {
        before: older.issue_snapshot,
        after:  newer.issue_snapshot,
        changes,
        revisions: trail,
      });
    } catch {
      responses.badRequest(ctx, 'Failed to compare issue revisions');
    }
  },
};

export default Issues;

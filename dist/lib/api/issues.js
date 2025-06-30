"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const issue_1 = __importDefault(require("../models/issue"));
const issueRevision_1 = __importDefault(require("../models/issueRevision"));
const responses_1 = __importDefault(require("./responses"));
const diff_1 = __importDefault(require("../utils/diff"));
const issue_schema_1 = require("../schemas/issue.schema");
const sequelize_1 = require("sequelize");
const Issues = {
    get: async (ctx) => {
        try {
            const issues = await issue_1.default.findAll();
            responses_1.default.success(ctx, issues);
        }
        catch (err) {
            responses_1.default.badRequest(ctx, 'Failed to fetch issues');
        }
    },
    getOne: async (ctx) => {
        const id = Number(ctx.params.id);
        try {
            const issue = await issue_1.default.findByPk(id);
            if (!issue)
                return responses_1.default.notFound(ctx);
            responses_1.default.success(ctx, issue);
        }
        catch (err) {
            responses_1.default.badRequest(ctx, 'Failed to fetch issue');
        }
    },
    create: async (ctx) => {
        try {
            const parsed = issue_schema_1.CreateIssueSchema.safeParse(ctx.request.body);
            if (!parsed.success) {
                return responses_1.default.badRequest(ctx, parsed.error.flatten().fieldErrors);
            }
            const email = ctx.state.user.email;
            const { title, description } = parsed.data;
            const newIssue = await issue_1.default.create({ title, description, created_by: email, updated_by: email });
            responses_1.default.success(ctx, newIssue);
        }
        catch (err) {
            responses_1.default.badRequest(ctx, 'Failed to create issue');
        }
    },
    update: async (ctx) => {
        const id = Number(ctx.params.id);
        const parsed = issue_schema_1.UpdateIssueSchema.safeParse(ctx.request.body);
        if (!parsed.success) {
            return responses_1.default.badRequest(ctx, parsed.error.flatten().fieldErrors);
        }
        const email = ctx.state.user.email;
        const issue = await issue_1.default.findByPk(id);
        if (!issue)
            return responses_1.default.notFound(ctx);
        const before = issue.toJSON();
        await issue.update({ ...parsed.data, updated_by: email });
        const after = issue.toJSON();
        const changes = (0, diff_1.default)(before, after);
        await issueRevision_1.default.create({
            issue_id: id,
            title: after.title,
            description: after.description,
            issue_snapshot: after,
            changes,
            updated_by: email
        });
        responses_1.default.success(ctx, issue);
    },
    delete: async (ctx) => {
        const id = Number(ctx.params.id);
        try {
            const issue = await issue_1.default.findByPk(id);
            if (!issue)
                return responses_1.default.notFound(ctx);
            await issue.destroy();
            responses_1.default.success(ctx, { deleted: true });
        }
        catch (err) {
            responses_1.default.badRequest(ctx, 'Failed to delete issue');
        }
    },
    getRevisions: async (ctx) => {
        const issueId = Number(ctx.params.id);
        try {
            const revisions = await issueRevision_1.default.findAll({
                where: { issue_id: issueId },
                order: [['updated_at', 'DESC']],
            });
            responses_1.default.success(ctx, revisions);
        }
        catch (err) {
            responses_1.default.badRequest(ctx, 'Failed to fetch revisions');
        }
    },
    compare: async (ctx) => {
        const issueId = Number(ctx.params.id);
        const revAId = Number(ctx.query.revA);
        const revBId = Number(ctx.query.revB);
        if (!revAId || !revBId) {
            return responses_1.default.badRequest(ctx, 'revA and revB query params are required');
        }
        try {
            const [revA, revB] = await Promise.all([
                issueRevision_1.default.findOne({ where: { id: revAId, issue_id: issueId } }),
                issueRevision_1.default.findOne({ where: { id: revBId, issue_id: issueId } }),
            ]);
            if (!revA || !revB) {
                return responses_1.default.notFound(ctx);
            }
            const older = revA.updated_at <= revB.updated_at ? revA : revB;
            const newer = older === revA ? revB : revA;
            const changes = (0, diff_1.default)(older.issue_snapshot, newer.issue_snapshot);
            const trail = await issueRevision_1.default.findAll({
                where: {
                    issue_id: issueId,
                    id: { [sequelize_1.Op.between]: [Math.min(revAId, revBId), Math.max(revAId, revBId)] },
                },
                order: [['updated_at', 'ASC']],
            });
            responses_1.default.success(ctx, {
                before: older.issue_snapshot,
                after: newer.issue_snapshot,
                changes,
                revisions: trail,
            });
        }
        catch {
            responses_1.default.badRequest(ctx, 'Failed to compare issue revisions');
        }
    },
};
exports.default = Issues;

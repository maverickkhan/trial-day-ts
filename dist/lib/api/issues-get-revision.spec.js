"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const issues_1 = __importDefault(require("./issues"));
const issueRevision_1 = __importDefault(require("../models/issueRevision"));
const responses_1 = __importDefault(require("./responses"));
(0, vitest_1.describe)('Issues.getRevisions', () => {
    const ctx = { params: { id: '123' } };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should respond with revisions on success', async () => {
        const fakeRevisions = [{ id: 1 }, { id: 2 }];
        vitest_1.vi.spyOn(issueRevision_1.default, 'findAll').mockResolvedValueOnce(fakeRevisions);
        const successSpy = vitest_1.vi.spyOn(responses_1.default, 'success').mockImplementation(() => { });
        await issues_1.default.getRevisions(ctx);
        (0, vitest_1.expect)(issueRevision_1.default.findAll).toHaveBeenCalledWith({
            where: { issue_id: 123 },
            order: [['updated_at', 'DESC']],
        });
        (0, vitest_1.expect)(successSpy).toHaveBeenCalledWith(ctx, fakeRevisions);
    });
    (0, vitest_1.it)('should handle errors and respond with badRequest', async () => {
        vitest_1.vi.spyOn(issueRevision_1.default, 'findAll').mockRejectedValueOnce(new Error('DB error'));
        const badRequestSpy = vitest_1.vi.spyOn(responses_1.default, 'badRequest').mockImplementation(() => { });
        await issues_1.default.getRevisions(ctx);
        (0, vitest_1.expect)(badRequestSpy).toHaveBeenCalledWith(ctx, 'Failed to fetch revisions');
    });
});

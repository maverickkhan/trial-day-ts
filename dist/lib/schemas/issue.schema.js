"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIssueSchema = exports.CreateIssueSchema = void 0;
const zod_1 = require("zod");
exports.CreateIssueSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
});
exports.UpdateIssueSchema = exports.CreateIssueSchema.partial();

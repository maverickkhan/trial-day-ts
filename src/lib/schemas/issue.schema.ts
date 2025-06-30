import { z } from 'zod';

export const CreateIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const UpdateIssueSchema = CreateIssueSchema.partial();

export type CreateIssueDto = z.infer<typeof CreateIssueSchema>;
export type UpdateIssueDto = z.infer<typeof UpdateIssueSchema>;

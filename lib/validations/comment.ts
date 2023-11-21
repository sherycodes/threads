import * as z from 'zod';

export const CommentValidation = z.object({
  comment: z
    .string()
    .min(3, { message: 'Comment must be at least 3 characters' }),
});

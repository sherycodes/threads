import * as z from 'zod';

export const ThreadValidation = z.object({
  content: z.string().min(3).max(1000),
});

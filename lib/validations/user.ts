import * as z from 'zod';

export const UserValidation = z.object({
  name: z.string().min(3).max(100),
  username: z.string().min(3).max(100),
  bio: z.string().min(3).max(1000),
  image: z.string(),
});

import { z } from 'zod';
import { AUTH_MESSAGES } from '../auth_message';

const userSchema = z.object({
  username: z
    .string()
    .min(1, AUTH_MESSAGES.USERNAME_REQUIRED)
    .min(3, AUTH_MESSAGES.USERNAME_INVALID)
    .max(30, AUTH_MESSAGES.USERNAME_INVALID),

  email: z
    .string()
    .min(1, AUTH_MESSAGES.EMAIL_REQUIRED)
    .email(AUTH_MESSAGES.EMAIL_INVALID),

  password: z
    .string()
    .min(1, AUTH_MESSAGES.PASSWORD_REQUIRED)
    .min(8, AUTH_MESSAGES.PASSWORD_INVALID),
});

export const validateUser = (data: unknown) => {
  return userSchema.safeParse(data);
};

import { z } from 'zod';

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: '사용자 이름은 최소 3자 이상이어야 합니다.' })
    .max(30, { message: '사용자 이름은 최대 30자까지 가능합니다.' }),

  email: z
    .string()
    .email({ message: '올바른 이메일 형식이 아닙니다.' }),

  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),
});

export type SignupInput = z.infer<typeof signupSchema>;
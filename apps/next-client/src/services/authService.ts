import { signIn } from 'next-auth/react';
import { ROUTES } from '@/constants/urls';

export const loginWithCredentials = async (email: string, password: string) => {
  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  });
  return result;
};

export const loginWithGoogle = async () => {
  await signIn('google', { callbackUrl: ROUTES.HOME });
};
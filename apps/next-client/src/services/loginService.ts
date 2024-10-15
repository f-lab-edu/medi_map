import { signIn } from 'next-auth/react';
import { ROUTES } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';

export const loginWithCredentials = async (email: string, password: string) => {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!result || result.error) {
      throw new Error(ERROR_MESSAGES.LOGIN_ERROR);
    }

    return result;
  } catch (error: unknown) {
    handleLoginError(error);
  }
};

export const loginWithGoogle = async () => {
  try {
    await signIn('google', { callbackUrl: ROUTES.HOME });
  } catch (error: unknown) {
    handleLoginError(error);
  }
};

const handleLoginError = (error: unknown) => {
  throw new Error(ERROR_MESSAGES.LOGIN_ERROR);
};
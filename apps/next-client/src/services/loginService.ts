import { signIn } from 'next-auth/react';
import { ROUTES } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';
import { LoginError } from '@/error/AuthError';

export const loginWithCredentials = async (email: string, password: string) => {
  try {
    const loginResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!loginResult || loginResult.error) {
      console.error('Login with credentials failed:', loginResult?.error || ERROR_MESSAGES.LOGIN_ERROR);
      throw new LoginError(loginResult?.error || ERROR_MESSAGES.LOGIN_ERROR);
    }

    return loginResult;
  } catch (error) {
    console.error('Unexpected error during login with credentials:', error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const loginResult = await signIn('google', { redirect: false, callbackUrl: ROUTES.HOME });

    if (!loginResult || loginResult.error) {
      console.error('Login with Google failed:', loginResult?.error || ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
      throw new LoginError(loginResult?.error || ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    return loginResult;
  } catch (error) {
    console.error('Unexpected error during login with Google:', error);
    throw error;
  }
};
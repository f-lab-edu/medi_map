import { signIn } from 'next-auth/react';
import { ROUTES } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';
import { LoginError } from '@/error/AuthError';

export const loginWithCredentials = async (email: string, password: string) => {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!result || result.error) {
      console.error('Login with credentials failed:', result?.error || ERROR_MESSAGES.LOGIN_ERROR);
      throw new LoginError(result?.error || ERROR_MESSAGES.LOGIN_ERROR);
    }

    return result;
  } catch (error) {
    console.error('Unexpected error during login with credentials:', error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signIn('google', { redirect: false, callbackUrl: ROUTES.HOME });

    if (!result || result.error) {
      console.error('Login with Google failed:', result?.error || ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
      throw new LoginError(result?.error || ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    return result;
  } catch (error) {
    console.error('Unexpected error during login with Google:', error);
    throw error;
  }
};
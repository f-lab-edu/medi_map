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

    if (!result) {
      throw new LoginError(ERROR_MESSAGES.LOGIN_ERROR);
    }

    if (result.error) {
      throw new LoginError(result.error || ERROR_MESSAGES.LOGIN_ERROR);
    }

    return result;
  } catch (error: unknown) {
    handleLoginError(error);
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signIn('google', { callbackUrl: ROUTES.HOME });

    if (!result) {
      throw new LoginError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    if (result.error) {
      throw new LoginError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    return result;
  } catch (error: unknown) {
    handleLoginError(error);
  }
};

const handleLoginError = (error: unknown) => {
  if (error instanceof LoginError) {
    throw error;
  }

  throw new LoginError();
};
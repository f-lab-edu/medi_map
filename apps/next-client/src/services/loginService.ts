import { signIn } from 'next-auth/react';
import { ROUTES } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';
import { LoginError } from '@/error/AuthError';

export const loginWithCredentials = async (email: string, password: string) => {
  try {
    const loginResponse = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!loginResponse) {
      throw new LoginError(ERROR_MESSAGES.LOGIN_ERROR);
    }

    if (loginResponse.error) {
      throw new LoginError(loginResponse.error || ERROR_MESSAGES.LOGIN_ERROR);
    }

    return loginResponse;
  } catch (error: unknown) {
    handleLoginError(error);
  }
};

export const loginWithGoogle = async () => {
  try {
    const loginResponse = await signIn('google', { redirect: false, callbackUrl: ROUTES.HOME });

    if (!loginResponse) {
      throw new LoginError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    if (loginResponse.error) {
      throw new LoginError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    return loginResponse;
  } catch (error: unknown) {
    handleLoginError(error);
  }
};

const handleLoginError = (error: unknown) => {
  if (error instanceof LoginError) {
    throw error;
  }

  throw new LoginError(ERROR_MESSAGES.LOGIN_ERROR);
};

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

    // 여기서는 바로 accessToken을 받지 않고 result만 반환
    return result;
  } catch (error: unknown) {
    handleLoginError(error);
  }
};

export const loginWithGoogle = async () => {
  try {
    // [수정 포인트] redirect를 false로 설정
    const result = await signIn('google', { redirect: false, callbackUrl: ROUTES.HOME });

    if (!result) {
      throw new LoginError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    if (result.error) {
      throw new LoginError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    // 구글 로그인도 여기서 fetch하지 않고 result만 반환
    return result;
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

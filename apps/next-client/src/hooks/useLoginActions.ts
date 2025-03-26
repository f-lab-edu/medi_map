'use client';

import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { loginWithCredentials, loginWithGoogle } from '@/services/loginService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';
import { setSessionCookies } from '@/utils/sessionCookies';

interface AuthActionsParams {
  email: string;
  password: string;
  setError: Dispatch<SetStateAction<string>>;
}

export const useLoginActions = ({ email, password, setError }: AuthActionsParams) => {
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(ERROR_MESSAGES.LOGIN_FAILED);
      return;
    }

    try {
      const authResult = await loginWithCredentials(email, password);
      if (authResult?.error) {
        setError(authResult.error);
        return;
      }
      
      if (authResult?.user && authResult?.token) {
        setSessionCookies({
          id: authResult.user.id,
          accessToken: authResult.token,
          refreshToken: authResult.refreshToken,
        });
        router.push(ROUTES.HOME);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const authResult = await loginWithGoogle();
      if (authResult?.error) {
        setError(authResult.error);
        return;
      }

      if (authResult?.user && authResult?.token) {
        setSessionCookies({
          id: authResult.user.id,
          accessToken: authResult.token,
          refreshToken: authResult.refreshToken,
        });
        router.push(ROUTES.HOME);
      }
    } catch (err) {
      console.error(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR, err);
      setError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }
  };

  return { handleLogin, handleGoogleLogin };
};
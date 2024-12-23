import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { loginWithCredentials, loginWithGoogle } from '@/services/loginService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';

interface AuthActionsParams {
  email: string;
  password: string;
  setError: Dispatch<SetStateAction<string>>;
}

export const useLoginActions = ({ email, password, setError }: AuthActionsParams) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.accessToken) {
      Cookies.set('accessToken', session.user.accessToken, {
        secure: true,
        sameSite: 'Strict',
      });
      router.push(ROUTES.HOME);
    }
  }, [status, session, router]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError(ERROR_MESSAGES.LOGIN_FAILED);
        return;
      }

      const loginResponse = await loginWithCredentials(email, password);

      if (loginResponse?.error) {
        setError(loginResponse.error);
      }
    } catch (error: unknown) {
      console.error(ERROR_MESSAGES.LOGIN_FAILED, error);
      setError(ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleLoginResponse = await loginWithGoogle();

      if (googleLoginResponse?.error && !googleLoginResponse?.url) {
        setError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
      }
    } catch (error: unknown) {
      console.error(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR, error);
      setError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }
  };

  return { handleLogin, handleGoogleLogin };
};
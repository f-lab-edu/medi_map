import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { loginWithCredentials, loginWithGoogle } from '@/services/loginService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';
import { useSession } from 'next-auth/react';
import { setSessionCookies } from '@/utils/sessionCookies';

interface AuthActionsParams {
  email: string;
  password: string;
  setError: Dispatch<SetStateAction<string>>;
}

export const useLoginActions = ({ email, password, setError }: AuthActionsParams) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setSessionCookies(session.user);
      router.push(ROUTES.HOME);
    }
  }, [status, session, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(ERROR_MESSAGES.LOGIN_FAILED);
      return;
    }

    try {
      const authResult = await loginWithCredentials(email, password);

      if (authResult?.error) {
        setError(authResult.error);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const authResult = await loginWithGoogle();

      if (authResult?.error && !authResult?.url) {
        setError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
      }
    } catch (err) {
      console.error(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR, err);
    }
  };

  return { handleLogin, handleGoogleLogin };
};
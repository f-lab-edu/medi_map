import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { loginWithCredentials, loginWithGoogle } from '@/services/loginService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';
import { useSession } from 'next-auth/react';
import { LoginError } from '@/error/AuthError';

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
      localStorage.setItem('accessToken', session.user.accessToken);
      router.push(ROUTES.HOME);
    }
  }, [status, session, router]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError(ERROR_MESSAGES.LOGIN_FAILED);
        return;
      }

      const result = await loginWithCredentials(email, password);

      if (result?.error) {
        setError(result.error);
      }
    } catch (err: unknown) {
      setError(err instanceof LoginError ? err.message : ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof LoginError ? err.message : ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }
  };

  return { handleLogin, handleGoogleLogin };
};

import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { loginWithCredentials, loginWithGoogle } from '@/services/loginService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';

interface AuthActionsParams {
  email: string;
  password: string;
  setError: Dispatch<SetStateAction<string>>;
}

export const useLoginActions = ({ email, password, setError }: AuthActionsParams) => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError(ERROR_MESSAGES.LOGIN_FAILED);
        return;
      }

      const result = await loginWithCredentials(email, password);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (err: unknown) {
      setError(ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      setError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }
  };

  return { handleLogin, handleGoogleLogin };
};
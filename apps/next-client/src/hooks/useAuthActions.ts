import { useRouter } from 'next/navigation';
import { loginWithCredentials, loginWithGoogle } from '@/services/authService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';

export const useAuthActions = ({ email, password, setError }) => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError(ERROR_MESSAGES.LOGIN_ERROR);
        return;
      }

      const result = await loginWithCredentials(email, password);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (err: unknown) {
      setError(ERROR_MESSAGES.LOGIN_ERROR);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push(ROUTES.HOME);
    } catch (err: unknown) {
      setError(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }
  };

  return { handleLogin, handleGoogleLogin };
};

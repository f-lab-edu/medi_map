import { useRouter } from 'next/navigation';
import { signup } from '@/services/authService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';

export const useSignupActions = ({ username, email, password, setError }) => {
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await signup({ username, email, password });
      if (response.status === 201) {
        router.push(ROUTES.AUTH.SIGN_IN); 
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(ERROR_MESSAGES.SIGN_UP_ERROR);
      }
    }
  };

  return { handleSignup };
};

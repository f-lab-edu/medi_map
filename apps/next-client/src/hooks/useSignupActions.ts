import { useRouter } from 'next/navigation';
import { signup } from '@/services/signupService';
import { ROUTES } from '@/constants/urls';
import { Dispatch, SetStateAction } from 'react';
import { ERROR_MESSAGES } from '@/constants/errors';

interface SignupActionsParams {
  username: string;
  email: string;
  password: string;
  setError: Dispatch<SetStateAction<string>>;
}

export const useSignupActions = ({
  username,
  email,
  password,
  setError,
}: SignupActionsParams) => {
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await signup({ username, email, password });

      if (response.success && response.status === 201) {
        router.push(ROUTES.AUTH.SIGN_IN);
      } else {
        setError(response.message || ERROR_MESSAGES.SIGN_UP_ERROR);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.SIGN_UP_ERROR);
    }
  };

  return { handleSignup };
};
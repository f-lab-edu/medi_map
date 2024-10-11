import { useRouter } from 'next/navigation';
import { signup } from '@/services/signupService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';
import { Dispatch, SetStateAction } from 'react';

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

      if (response?.status === 201) {
        router.push(ROUTES.AUTH.SIGN_IN);
      } else {
        setError(ERROR_MESSAGES.SIGN_UP_ERROR);
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

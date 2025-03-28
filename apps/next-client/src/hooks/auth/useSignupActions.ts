'use client';

import { useRouter } from 'next/navigation';
import { signup } from '@/services/signupService';
import { ROUTES } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';
import { toast } from 'react-toastify';

interface SignupActionsParams {
  username: string;
  email: string;
  password: string;
}

export const useSignupActions = ({
  username,
  email,
  password,
}: SignupActionsParams) => {
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await signup({ username, email, password });

      if (response.success && response.status === 201) {
        router.push(ROUTES.AUTH.SIGN_IN);
      } else {
        toast.error(response.message || ERROR_MESSAGES.SIGN_UP_ERROR);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : ERROR_MESSAGES.SIGN_UP_ERROR;
      toast.error(errorMsg);
    }
  };

  return { handleSignup };
};
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
    if (!username) {
      setError('사용자명을 입력해 주세요.');
      return;
    }
    if (!email) {
      setError('이메일을 입력해 주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }
    try {
      const response = await signup({ username, email, password });

      if (response?.status === 201) {
        router.push(ROUTES.AUTH.SIGN_IN);
      } else {
        setError(ERROR_MESSAGES.LOGIN_ERROR);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(ERROR_MESSAGES.LOGIN_ERROR);
      }
    }
  };

  return { handleSignup };
};
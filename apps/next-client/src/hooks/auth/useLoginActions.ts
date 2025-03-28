'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { loginWithCredentials, loginWithGoogle } from '@/services/loginService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { ROUTES } from '@/constants/urls';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

interface AuthActionsParams {
  email: string;
  password: string;
}

export const useLoginActions = ({ email, password }: AuthActionsParams) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push(ROUTES.HOME);
    }
  }, [status, session, router]);
  

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error(ERROR_MESSAGES.LOGIN_FAILED);
      return;
    }

    try {
      const authResult = await loginWithCredentials(email, password);

      if (authResult?.error) {
        toast.error(authResult.error);
      }
    } catch (err) {
      toast.error(ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const authResult = await loginWithGoogle();

      if (authResult?.error && !authResult?.url) {
        toast.error(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
      }
    } catch (err) {
      console.error(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR, err);
      toast.error(ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }
  };

  return { handleLogin, handleGoogleLogin };
};
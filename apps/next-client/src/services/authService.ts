import axios from 'axios';
import { signIn } from 'next-auth/react';
import { ROUTES, API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';

export const loginWithCredentials = async (email: string, password: string) => {
  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  });
  return result;
};

export const loginWithGoogle = async () => {
  await signIn('google', { callbackUrl: ROUTES.HOME });
};

export const signup = async ({ username, email, password }) => {
  try {
    const response = await axios.post(API_URLS.SIGNUP, {
      username,
      email,
      password,
    });

    return response;
  } catch (error: unknown) {
    throw new Error(error.response?.data?.message || ERROR_MESSAGES.SIGN_UP_ERROR);
  }
};

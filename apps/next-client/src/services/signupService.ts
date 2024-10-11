import axios, { AxiosError } from 'axios';
import { API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export const signup = async ({ username, email, password }: SignupData) => {
  try {
    const response = await axios.post(API_URLS.SIGNUP, {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    handleSignupError(error);
  }
};

const handleSignupError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || ERROR_MESSAGES.SIGN_UP_ERROR);
  }
  throw new Error(ERROR_MESSAGES.SIGN_UP_ERROR);
};

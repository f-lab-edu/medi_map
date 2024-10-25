import axios, { AxiosError } from 'axios';
import { API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';
import { SignupRequestDto } from '@/dto/SignupRequestDto';
import { SignupResponseDto } from '@/dto/SignupResponseDto';

export const signup = async ({ username, email, password }: SignupRequestDto): Promise<SignupResponseDto> => {
  try {
    const response = await axios.post(API_URLS.SIGNUP, {
      username,
      email,
      password,
    });

    return {
      success: true,
      userId: response.data?.userId,
    };
  } catch (error) {
    const errorMessage = handleSignupError(error);
    return {
      success: false,
      message: errorMessage,
    };
  }
};

const handleSignupError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return ERROR_MESSAGES.SIGN_UP_ERROR;
  }
  return ERROR_MESSAGES.SIGN_UP_ERROR;
};
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
      status: response.status,
    };
  } catch (error) {
    return handleSignupError(error);
  }
};

const handleSignupError = (error: unknown): SignupResponseDto => {
  if (axios.isAxiosError(error)) {

    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response?.status === 409) {
      return {
        success: false,
        message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
        status: 409,
      };
    }

    return {
      success: false,
      message: axiosError.response?.data?.message || ERROR_MESSAGES.SIGN_UP_ERROR,
      status: axiosError.response?.status,
    };
  }
  
  return {
    success: false,
    message: ERROR_MESSAGES.SIGN_UP_ERROR,
    status: undefined,
  };
};
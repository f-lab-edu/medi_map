import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';
import { LoginError } from '@/error/AuthError';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const loginWithCredentials = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(API_URLS.LOGIN, {
      email,
      password,
    });

    if (!response.data || response.data.error) {
      throw new LoginError(response.data?.error || ERROR_MESSAGES.LOGIN_ERROR);
    }

    // Save user data and tokens to cookies
    Cookies.set('accessToken', response.data.token);
    Cookies.set('refreshToken', response.data.refreshToken);
    Cookies.set('user', JSON.stringify(response.data.user));

    // Trigger auth state update
    window.dispatchEvent(new Event('authStateChanged'));

    return response.data;
  } catch (error) {
    console.error('Unexpected error during login with credentials:', error);
    throw error;
  }
};

export const loginWithGoogle = async (accessToken: string) => {
  try {
    const response = await axiosInstance.post(API_URLS.GOOGLE_LOGIN, { idToken: accessToken });
    
    if (!response.data || response.data.error) {
      throw new LoginError(response.data?.error || ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
    }

    // Save user data and tokens to cookies
    Cookies.set('accessToken', response.data.token);
    Cookies.set('refreshToken', response.data.refreshToken);
    Cookies.set('user', JSON.stringify(response.data.user));

    // Trigger auth state update
    window.dispatchEvent(new Event('authStateChanged'));

    return response.data;
  } catch (error) {
    console.error('Unexpected error during Google login:', error);
    throw error;
  }
};
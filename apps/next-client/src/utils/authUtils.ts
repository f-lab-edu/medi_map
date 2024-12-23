import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { JWT } from 'next-auth/jwt';

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 1000;

export async function refreshAccessToken(jwtToken: JWT): Promise<JWT> {
  try {
    const { data } = await axiosInstance.post(API_URLS.REFRESH, {
      refreshToken: jwtToken.refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

    return {
      ...jwtToken,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken ?? jwtToken.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRES_IN,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...jwtToken,
      error: 'RefreshAccessTokenError',
    };
  }
}
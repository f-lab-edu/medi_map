import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { JWT } from 'next-auth/jwt';
import { ALERT_MESSAGES } from "@/constants/alertMessage";
import Cookies from "js-cookie";

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

export const getAuthHeader = () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error(ALERT_MESSAGES.ERROR.NO_TOKEN);
  }
  return { Authorization: `Bearer ${token}` };
};
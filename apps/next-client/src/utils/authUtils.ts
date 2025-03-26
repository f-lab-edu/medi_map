import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { ALERT_MESSAGES } from "@/constants/alertMessage";
import Cookies from "js-cookie";

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 1000;

export async function refreshAccessToken(refreshToken: string) {
  try {
    const { data } = await axiosInstance.post(API_URLS.REFRESH, {
      refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken ?? refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRES_IN,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
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
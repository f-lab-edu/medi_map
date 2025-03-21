import { AxiosError } from 'axios';
import { axiosInstance } from '@/services/axiosInstance';
import Cookies from 'js-cookie';
import { API_URLS } from '@/constants/urls';
import { MedicineFavorite } from '@/types/medicine.types';
import { FAVORITE_MESSAGES } from '@/constants/errors';

export const addFavoriteApi = async (data: MedicineFavorite) => {
  const token = Cookies.get("accessToken");

  const apiPayload = {
    medicineId: data.medicineId,
    itemName: data.itemName,
    entpName: data.entpName,
    etcOtcName: data.etcOtcName,
    className: data.className,
    itemImage: data.itemImage,
  };

  try {
    const response = await axiosInstance.post(API_URLS.FAVORITES, apiPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorMessage: string = FAVORITE_MESSAGES.ADD_FAILURE;

      if (error.response?.status === 401) {
        errorMessage = FAVORITE_MESSAGES.LOGIN_REQUIRED;
      } else if (error.response?.status === 409) {
        errorMessage = FAVORITE_MESSAGES.ALREADY_EXISTS;
      }

      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Failed to add favorite:", error);
      throw new Error(FAVORITE_MESSAGES.ADD_FAILURE);
    }
  }
};

export const checkFavoriteApi = async (medicineId: string): Promise<boolean> => {
  const token = Cookies.get("accessToken");
  
  try {
    const response = await axiosInstance.get(`${API_URLS.FAVORITES}/${medicineId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data.isFavorite;
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorMessage: string = FAVORITE_MESSAGES.STATUS_FETCH_ERROR;

      if (error.response?.status === 401) {
        errorMessage = FAVORITE_MESSAGES.LOGIN_REQUIRED;
      }

      console.error(errorMessage);
      return false;
    } else {
      console.error("Failed to fetch favorite status:", error);
      return false;
    }
  }
};
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URLS } from '@/constants/urls';
import { MedicineFavorite } from '@/types/medicine.types';

export const addFavoriteApi = async (data: MedicineFavorite) => {
  const token = Cookies.get('accessToken');

  if (!token) {
    throw new Error('No token available');
  }

  const apiPayload = {
    medicineId: data.medicineId,
    itemName: data.itemName,
    entpName: data.entpName,
    etcOtcName: data.etcOtcName,
    className: data.className,
    itemImage: data.itemImage,
  };

  const response = await axios.post(API_URLS.FAVORITES, apiPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

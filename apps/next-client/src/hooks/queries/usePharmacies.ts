import axios from 'axios';
import { axiosInstance } from '@/services/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';

// 위치 기반으로 주변 약국 정보를 가져오는 함수
const fetchPharmacies = async (lat: number, lng: number): Promise<PharmacyDTO[]> => {
  try {
    const { data } = await axiosInstance.get<PharmacyDTO[]>(API_URLS.PHARMACY, {
      params: { lat, lng },
      timeout: 5000,
    });

    // 응답 데이터가 배열인지 확인
    if (!Array.isArray(data)) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE_FORMAT);
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      let errorMessage = error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR;

      if (status === 404) {
        errorMessage = ERROR_MESSAGES.PHARMACY_NOT_FOUND;
      } else if (status === 500) {
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      }

      console.error("fetchPharmacies error:", errorMessage);
      throw new Error(errorMessage);
    }

    console.error("fetchPharmacies unexpected error:", error);
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
  }
};

export const usePharmacies = (lat?: number, lng?: number) => {
  return useQuery({
    queryKey: ['pharmacies', lat, lng],
    queryFn: () => (lat && lng ? fetchPharmacies(lat, lng) : Promise.resolve([])),
    enabled: !!lat && !!lng,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
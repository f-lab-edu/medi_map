import { useQuery } from '@tanstack/react-query';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';

// 위치 기반으로 주변 약국 정보를 가져오는 함수
const fetchPharmacies = async (lat: number, lng: number): Promise<PharmacyDTO[]> => {
  const response = await fetch(`${API_URLS.PHARMACY}?lat=${lat}&lng=${lng}`);
  
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
  }
  
  const data = await response.json();
  
  if (!Array.isArray(data)) {
    console.error('Invalid data format:', data);
    return [];
  }
  
  return data;
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
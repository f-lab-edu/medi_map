import { useQuery } from '@tanstack/react-query';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { API_URLS } from '@/constants/urls';
import { ERROR_MESSAGES } from '@/constants/errors';

// 위치 기반으로 주변 약국 정보를 가져오는 함수
const fetchPharmacies = async (lat: number, lng: number): Promise<PharmacyDTO[]> => {
  try {
    const response = await fetch(`${API_URLS.PHARMACY}?lat=${lat}&lng=${lng}`);

    if (!response.ok) {
      let errorMessage = `약국 데이터를 불러올 수 없습니다. 상태 코드: ${response.status}`;
  
      if (response.status === 404) {
        errorMessage = ERROR_MESSAGES.PHARMACY_NOT_FOUND;
      } else if (response.status === 500) {
        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      }
  
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    let data;
    
    try {
      // JSON 파싱 오류 처리
      data = await response.json();
    } catch (jsonError) {
      throw new Error(ERROR_MESSAGES.GENERIC_ERROR);
    }

    // 데이터 구조(배열) 검증
    if (!Array.isArray(data)) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE_FORMAT);
    }

    return data;
  } catch (error) {
    console.error("fetchPharmacies error:", error);
    throw error;
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
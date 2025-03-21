import { AxiosError } from 'axios';
import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from "@/constants/urls";
import { MedicineResultDto } from "@/dto/MedicineResultDto";
import { SEARCH_ERROR_MESSAGES } from '@/constants/searchErrors';

export const fetchMedicineDetails = async (id: string): Promise<MedicineResultDto> => {
  try {
    const response = await axiosInstance.get(`${API_URLS.MEDICINE}/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      let errorMessage: string = SEARCH_ERROR_MESSAGES.CLIENT_ERROR;

      if (error.response?.status === 404) {
        errorMessage = SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND;
      } else if (error.response?.status === 500) {
        errorMessage = SEARCH_ERROR_MESSAGES.SERVER_ERROR;
      }

      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error("Failed to fetch medicine details:", error);
      throw new Error(SEARCH_ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
};
import { API_URLS } from "@/constants/urls";
import { MedicineResultDto } from "@/dto/MedicineResultDto";
import { SEARCH_ERROR_MESSAGES } from '@/constants/searchErrors';

export const fetchMedicineDetails = async (id: string): Promise<MedicineResultDto | null> => {
  try {
    const response = await fetch(`${API_URLS.MEDICINE}/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMessage = `${SEARCH_ERROR_MESSAGES.CLIENT_ERROR} ${response.status}`;

      if (response.status === 404) {
        errorMessage = SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND;
      } else if (response.status === 500) {
        errorMessage = SEARCH_ERROR_MESSAGES.SERVER_ERROR;
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch medicine details:", error);
    return null;
  }
};
import { axiosInstance } from "@/services/axiosInstance";
import { NoResultsError, ApiRequestError } from "@/error/SearchError";
import { MedicineResultDto } from "@/dto/MedicineResultDto";
import { API_URLS } from "@/constants/urls";
import { FILTER_ALL } from "@/constants/filters";

interface FetchMedicineParams {
  name: string;
  company: string;
  color: string[];
  shape: string[];
  form: string[];
  page: number;
}

export async function medicineService({
  name = "",
  company = "",
  color = [],
  shape = [],
  form = [],
  page = 1,
}: FetchMedicineParams): Promise<{ results: MedicineResultDto[]; total: number }> {
  try {
    let filterColors: string | undefined;
    let filterShapes: string | undefined;
    let filterForms: string | undefined;
    
    if (color.length > 0 && !color.includes(FILTER_ALL)) {
      filterColors = color.join(",");
    }
    
    if (shape.length > 0 && !shape.includes(FILTER_ALL)) {
      filterShapes = shape.join(",");
    }
    
    if (form.length > 0 && !form.includes(FILTER_ALL)) {
      filterForms = form.join(",");
    }    

    const response = await axiosInstance.get(API_URLS.MEDICINE_SEARCH, {
      params: {
        medicineName: name,
        companyName: company,
        color: filterColors,
        shape: filterShapes,
        formCodeName: filterForms,
        page,
        limit: 10,
      },
    });

    const newResults: MedicineResultDto[] = response.data.results || [];
    const newTotal: number = response.data.total || 0;

    if (newTotal === 0 && page === 1) {
      throw new NoResultsError();
    }

    return { results: newResults, total: newTotal };
  } catch (error: unknown) {
    console.error("API 요청 실패:", error);

    if (error instanceof NoResultsError) {
      throw error;
    }

    throw new ApiRequestError();
  }
}
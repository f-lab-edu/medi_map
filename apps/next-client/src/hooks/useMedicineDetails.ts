import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchMedicineDetails } from '@/utils/medicineApi';
import { MedicineResultDto } from '@/dto/MedicineResultDto';
import { SEARCH_ERROR_MESSAGES } from '@/constants/searchErrors';

export const useMedicineDetails = (medicineId: string) => {
  const medicineDetailsQuery = useSuspenseQuery<MedicineResultDto>({
    queryKey: ['medicineDetails', medicineId],
    queryFn: () => fetchMedicineDetails(medicineId),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  if (medicineDetailsQuery.error) {
    console.error(SEARCH_ERROR_MESSAGES.UNKNOWN_ERROR, medicineDetailsQuery.error);
  }

  return medicineDetailsQuery;
};
import { useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { medicineService } from "@/services/medicine/medicineService";
import { useSearchStore } from "@/store/useSearchStore";
import { ERROR_MESSAGES } from "@/constants/errors";
import { FetchDataParams, MedicineResponse } from "@/dto/MedicineResultDto";

export default function useMedicineSearch() {
  const {
    medicineSearchTerm,
    companySearchTerm,
    selectedColors,
    selectedShapes,
    selectedForms,
    setTotalResults,
    resetResults,
    isSearchExecuted,
  } = useSearchStore();

  const fetchData = useCallback(
    async ({ page = 1 }: FetchDataParams): Promise<MedicineResponse> => {
      const { results: newResults, total: newTotal, pagination } = await medicineService({
        name: medicineSearchTerm,
        company: companySearchTerm,
        color: selectedColors,
        shape: selectedShapes,
        form: selectedForms,
        page,
      });

      setTotalResults(newTotal);
      return { results: newResults, total: newTotal, pagination };
    },
    [medicineSearchTerm, companySearchTerm, selectedColors, selectedShapes, selectedForms, setTotalResults]
  );

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<MedicineResponse, Error>({
    queryKey: [
      "medicineSearch",
      medicineSearchTerm,
      companySearchTerm,
      selectedColors,
      selectedShapes,
      selectedForms,
      isSearchExecuted,
    ],
    queryFn: ({ pageParam = 1 }) => fetchData({ page: pageParam as number }),
    getNextPageParam: (lastPage: MedicineResponse) => {
      const nextPage = lastPage.pagination.currentPage + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    enabled: isSearchExecuted,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  return {
    results: data?.pages.flatMap((page) => page.results) || [],
    loading: isLoading,
    error: error ? ERROR_MESSAGES.API_REQUEST_ERROR : null,
    hasMore: hasNextPage,
    fetchNextPage,
    resetResults,
  };
}
import { useCallback } from 'react';
import { useInfiniteQuery, useQueryClient, QueryFunctionContext } from '@tanstack/react-query';
import { useSearchStore } from '@/store/useSearchStore';
import { medicineService } from '@/services/medicine/medicineService';
import { ERROR_MESSAGES } from '@/constants/errors';
import { NoResultsError } from '@/error/SearchError';
import { MedicineResponse } from '@/dto/MedicineResultDto';

export default function useMedicineSearch() {
  const queryClient = useQueryClient();
  const { appliedFilters, isSearchExecuted, setTotalResults } = useSearchStore();

  const resetSearchQuery = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['medicineSearch'], exact: false });
  }, [queryClient]);

  const fetchData = useCallback(
    async ({ pageParam }: QueryFunctionContext) => {
      const {
        medicineSearchTerm,
        companySearchTerm,
        selectedColors,
        selectedShapes,
        selectedForms,
      } = appliedFilters;
  
      const response = await medicineService({
        name: medicineSearchTerm.trim(),
        company: companySearchTerm.trim(),
        color: selectedColors,
        shape: selectedShapes,
        form: selectedForms,
        page: pageParam as number,
      });
  
      setTotalResults(response.total);
  
      return response;
    },
    [appliedFilters, setTotalResults],
  );

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<MedicineResponse, Error>({
    queryKey: ['medicineSearch', appliedFilters],
    queryFn: fetchData,
    enabled: isSearchExecuted,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.currentPage + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    initialPageParam: 1,
  });

  const errorMessage = error
  ? error instanceof NoResultsError
    ? ERROR_MESSAGES.NO_SEARCH_RESULTS
    : ERROR_MESSAGES.API_REQUEST_ERROR
  : null;

  const mergedResults = data?.pages.flatMap((page) => page.results) || [];

  return {
    results: mergedResults,
    loading: isLoading,
    error: errorMessage,
    hasMore: !!hasNextPage,
    fetchNextPage,
    resetSearchQuery,
  };
}
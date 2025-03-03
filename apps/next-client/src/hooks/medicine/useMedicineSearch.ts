import { useCallback } from "react";
import { medicineService } from "@/services/medicine/medicineService";
import { useSearchStore } from "@/store/useSearchStore";
import { NoResultsError, ApiRequestError } from "@/error/SearchError";
import { ERROR_MESSAGES } from "@/constants/errors";

export default function useMedicineSearch() {
  const {
    results,
    setResults,
    setTotalResults,
    loading,
    setLoading,
    error,
    setError,
    hasMore,
    setHasMore,
    resetResults,
  } = useSearchStore();

  const fetchData = useCallback(
    async ({ name, company, color, shape, form, page }: Parameters<typeof medicineService>[0]) => {
      setLoading(true);
      setError(null);
  
      try {
        const { results: newResults, total: newTotal } = await medicineService({
          name,
          company,
          color,
          shape,
          form,
          page,
        });

        if (!newResults || newResults.length === 0) {
          setError(ERROR_MESSAGES.NO_SEARCH_RESULTS);
          setResults([]);
          setHasMore(false);
          return;
        }

        const updatedResults = page === 1 ? newResults : [...results, ...newResults];

        setResults(updatedResults);
        setTotalResults(newTotal);
        setHasMore(page * 10 < newTotal);
      } catch (error) {
        if (error instanceof NoResultsError) {
          setError(ERROR_MESSAGES.NO_SEARCH_RESULTS);
        } else if (error instanceof ApiRequestError) {
          setError(ERROR_MESSAGES.API_REQUEST_ERROR);
        } else {
          setError(ERROR_MESSAGES.UNKNOWN_ERROR);
        }
      } finally {
        setLoading(false);
      }
    },
    [results, setLoading, setError, setHasMore, setResults, setTotalResults]
  );
  
  return {
    results,
    loading,
    error,
    hasMore,
    medicineService: fetchData,
    resetResults,
  };
}
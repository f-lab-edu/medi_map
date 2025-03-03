import { useCallback } from "react";
import { medicineService } from "@/services/medicine/medicineService";
import { useSearchStore } from "@/store/useSearchStore";
import { ERROR_MESSAGES } from '@/constants/errors';

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
  
        let updatedResults = results;
  
        if (page === 1) {
          updatedResults = newResults;
        } else {
          updatedResults = [...results, ...newResults];
        }
  
        setResults(updatedResults);
        setTotalResults(newTotal);
        
        if (page * 10 < newTotal) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
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
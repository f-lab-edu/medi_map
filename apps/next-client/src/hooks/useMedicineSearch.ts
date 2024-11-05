import { useState, useCallback } from 'react';
import axios from 'axios';
import { NoResultsError, ApiRequestError } from '@/error/SearchError';
import { MedicineResultDto } from '@/dto/MedicineResultDto';

export default function useMedicineSearch() {
  const [results, setResults] = useState<MedicineResultDto[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMedicineInfo = useCallback(async (searchTerm: string, page: number) => {
    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await axios.get('/api/medicine', {
        params: { name: searchTerm, page, limit: 10 },
      });

      const newResults: MedicineResultDto[] = Array.isArray(response.data.results) ? response.data.results : [];
      const newTotal: number = response.data.total || 0;

      setResults((prevResults) => page === 1 ? newResults : [...prevResults, ...newResults]);
      setTotalResults(newTotal);
      setHasMore(newResults.length > 0);

      if (newTotal === 0 && page === 1) {
        throw new NoResultsError();
      }
    } catch (error) {
      if (error instanceof NoResultsError) {
        setWarning(error.message);
      } else {
        setError(new ApiRequestError().message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const resetResults = () => {
    setResults([]);
    setTotalResults(0);
    setHasMore(true);
    setError(null);
    setWarning(null);
  };

  return {
    results,
    totalResults,
    loading,
    error,
    warning,
    hasMore,
    fetchMedicineInfo,
    resetResults,
  };
}

import { useState, useCallback } from 'react';
import axios from 'axios';
import { NoResultsError, ApiRequestError } from '@/error/SearchError';
import { MedicineResultDto } from '@/dto/MedicineResultDto';

export default function useMedicineSearch() {
  const [results, setResults] = useState<MedicineResultDto[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMedicineInfo = useCallback(
    async (medicineTerm: string, companyTerm: string, page: number) => {
      setLoading(true);
      setError(null);

      try {
        // 백엔드 검색 API 호출
        const response = await axios.get('http://localhost:5000/api/medicine/search', {
          params: {
            medicineName: medicineTerm,
            companyName: companyTerm,
            page,
            limit: 10,
          },
        });

        // 반환된 데이터를 처리
        const newResults: MedicineResultDto[] = Array.isArray(response.data.results)
          ? response.data.results
          : [];
        const newTotal: number = response.data.total || 0;

        setResults((prevResults) => (page === 1 ? newResults : [...prevResults, ...newResults]));
        setTotalResults(newTotal);
        setHasMore(newResults.length > 0); // 다음 데이터가 있는지 확인

        if (newTotal === 0 && page === 1) {
          throw new NoResultsError();
        }
      } catch (error) {
        if (error instanceof NoResultsError) {
          setError(error.message);
        } else {
          setError(new ApiRequestError().message);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetResults = () => {
    setResults([]);
    setTotalResults(0);
    setHasMore(true);
    setError(null);
  };

  return {
    results,
    totalResults,
    loading,
    error,
    hasMore,
    fetchMedicineInfo,
    resetResults,
  };
}

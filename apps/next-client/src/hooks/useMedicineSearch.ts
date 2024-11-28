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
    async ({
      name = "",
      company = "",
      color = [],
      shape = [],
      form = [],
      page = 1,
    }: {
      name: string;
      company: string;
      color: string[]; // 배열 타입
      shape: string[]; // 배열 타입
      form: string[]; // 배열 타입
      page: number;
    }) => {
      setLoading(true);
      setError(null);
  
      try {
        // 필터 조건 처리: 빈 배열이거나 "전체"만 포함된 경우 조건 제거
        const filterColors = color.length === 0 || color.includes("전체") ? undefined : color.join(",");
        const filterShapes = shape.length === 0 || shape.includes("전체") ? undefined : shape.join(",");
        const filterForms = form.length === 0 || form.includes("전체") ? undefined : form.join(",");
  
        console.log("Fetching medicine info with params:", {
          name,
          company,
          color: filterColors,
          shape: filterShapes,
          form: filterForms,
          page,
        });
  
        const response = await axios.get("http://localhost:5000/api/medicine/search", {
          params: {
            medicineName: name || undefined,
            companyName: company || undefined,
            color: filterColors, // 필터가 없을 경우 undefined 전달
            shape: filterShapes,
            formCodeName: filterForms,
            page,
            limit: 10,
          },
        });
  
        const newResults: MedicineResultDto[] = Array.isArray(response.data.results)
          ? response.data.results
          : [];
        const newTotal: number = response.data.total || 0;
  
        console.log("Fetched results:", newResults);
  
        setResults((prevResults) => (page === 1 ? newResults : [...prevResults, ...newResults]));
        setTotalResults(newTotal);
        setHasMore(newResults.length > 0);
  
        if (newTotal === 0 && page === 1) {
          throw new NoResultsError();
        }
      } catch (error) {
        console.error("Error fetching medicine info:", error);
  
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

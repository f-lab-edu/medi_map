import { useState, useCallback } from 'react';
import axios from 'axios';
import { NoResultsError, ApiRequestError } from '@/error/SearchError';
import { MedicineResultDto } from '@/dto/MedicineResultDto';
import { API_URLS } from '@/constants/urls';
import { FILTER_ALL } from '@/constants/filters';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';

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
      color: string[];
      shape: string[];
      form: string[];
      page: number;
    }) => {
      setLoading(true);
      setError(null);
  
      try {
        // 필터 조건 처리, 빈 배열이거나 "전체"만 포함된 경우 조건 제거
        const filterColors = color.length === 0 || color.includes(FILTER_ALL) ? undefined : color.join(",");
        const filterShapes = shape.length === 0 || shape.includes(FILTER_ALL) ? undefined : shape.join(",");
        const filterForms = form.length === 0 || form.includes(FILTER_ALL) ? undefined : form.join(",");
  
        // API 호출
        const response = await axios.get(API_URLS.MEDICINE_SEARCH, {
          params: {
            medicineName: name, // 약물 이름
            companyName: company, // 회사 이름
            color: filterColors, // 필터된 색상 목록
            shape: filterShapes, // 필터된 모양 목록
            formCodeName: filterForms, // 필터된 제형 목록
            page, // 페이지 번호
            limit: 10, // 페이지당 결과 개수
          },
        });
  
        const newResults: MedicineResultDto[] = Array.isArray(response.data.results)
          ? response.data.results
          : [];
        const newTotal: number = response.data.total || 0;

  
        setResults((prevResults) => (page === 1 ? newResults : [...prevResults, ...newResults]));
        setTotalResults(newTotal);
        setHasMore(newResults.length > 0);
  
        if (newTotal === 0 && page === 1) {
          throw new NoResultsError();
        }
      } catch (error: unknown) {
        console.error(SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR, error);
  
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
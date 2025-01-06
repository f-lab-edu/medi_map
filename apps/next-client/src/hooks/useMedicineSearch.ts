import { useCallback } from "react";
import axios from "axios";
import { NoResultsError, ApiRequestError } from "@/error/SearchError";
import { MedicineResultDto } from "@/dto/MedicineResultDto";
import { API_URLS } from "@/constants/urls";
import { FILTER_ALL } from "@/constants/filters";
import { SEARCH_ERROR_MESSAGES } from "@/constants/search_errors";
import { useSearchStore } from "@/store/useSearchStore";

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
        // 필터 조건 처리
        const filterColors =
          color.length === 0 || color.includes(FILTER_ALL) ? undefined : color.join(",");
        const filterShapes =
          shape.length === 0 || shape.includes(FILTER_ALL) ? undefined : shape.join(",");
        const filterForms =
          form.length === 0 || form.includes(FILTER_ALL) ? undefined : form.join(",");

        // API 호출
        const response = await axios.get(API_URLS.MEDICINE_SEARCH, {
          params: {
            medicineName: name,      // 약물 이름
            companyName: company,    // 회사 이름
            color: filterColors,     // 필터된 색상 목록
            shape: filterShapes,     // 필터된 모양 목록
            formCodeName: filterForms, // 필터된 제형 목록
            page,                    // 페이지 번호
            limit: 10,               // 페이지당 결과 개수
          },
        });

        const newResults: MedicineResultDto[] = Array.isArray(response.data.results)
          ? response.data.results
          : [];
        const newTotal: number = response.data.total || 0;

        // 기존 결과에 추가
        setResults(page === 1 ? newResults : [...results, ...newResults]);
        setTotalResults(newTotal);

        setHasMore(page * 10 < newTotal);

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
    [
      results,
      setLoading,
      setError,
      setHasMore,
      setResults,
      setTotalResults,
    ]
  );

  return {
    results,
    loading,
    error,
    hasMore,
    fetchMedicineInfo,
    resetResults,
  };
}

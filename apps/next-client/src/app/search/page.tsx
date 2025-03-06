'use client';

import { KeyboardEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/useSearchStore';
import useMedicineSearch from '@/hooks/medicine/useMedicineSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { FILTER_ALL } from '@/constants/filters';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';
import { SearchBox } from '@/components/medicine/SearchBox';
import { SearchResults } from '@/components/medicine/MedicineResults';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import '@/styles/pages/search/search.scss';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  // 로컬 state(버튼 누르기 전 입력값)
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localCompany, setLocalCompany] = useState('');
  const [localColors, setLocalColors] = useState<string[]>([]);
  const [localShapes, setLocalShapes] = useState<string[]>([]);
  const [localForms, setLocalForms] = useState<string[]>([]);

  const { 
    setAppliedFilters,
    setIsSearchExecuted,
    warning,
    setWarning,
    resetAll,
  } = useSearchStore();

  const {
    results,
    loading,
    error,
    hasMore,
    fetchNextPage,
    resetSearchQuery,
  } = useMedicineSearch();

  // keyword가 있으면 자동 검색 (원한다면)
  useEffect(() => {
    if (!keyword) return;
    resetSearchQuery();
    resetAll();

    // 검색어를 local state에 넣고
    setLocalSearchTerm(keyword);

    // 곧바로 검색 실행을 원한다면:
    setAppliedFilters({
      medicineSearchTerm: keyword,
      companySearchTerm: '',
      selectedColors: [],
      selectedShapes: [],
      selectedForms: [],
    });
    setIsSearchExecuted(true);
    setWarning(null);
  }, [keyword, resetSearchQuery, resetAll, setAppliedFilters, setIsSearchExecuted, setWarning]);

  // 검색 버튼 클릭 시
  const handleSearch = () => {
    // 간단 검사
    if (
      localSearchTerm.trim().length < 2 &&
      localCompany.trim().length < 2 &&
      localColors.every((color) => color === FILTER_ALL) &&
      localShapes.every((shape) => shape === FILTER_ALL) &&
      localForms.every((form) => form === FILTER_ALL)
    ) {
      setWarning(SEARCH_ERROR_MESSAGES.SHORT_SEARCH_TERM);
      return;
    }

    setAppliedFilters({
      medicineSearchTerm: localSearchTerm.trim(),
      companySearchTerm: localCompany.trim(),
      selectedColors: localColors,
      selectedShapes: localShapes,
      selectedForms: localForms,
    });

    setIsSearchExecuted(true);
    setWarning(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => {
      fetchNextPage();
    },
  });

  return (
    <div className="medicine_search">
      <h1 className="title">약 정보 검색</h1>
      <p className="sub_title">궁금했던 약 정보를 검색해보세요!</p>

      <SearchBox
        localSearchTerm={localSearchTerm}
        setLocalSearchTerm={setLocalSearchTerm}
        localCompany={localCompany}
        setLocalCompany={setLocalCompany}
        localColors={localColors}
        setLocalColors={setLocalColors}
        localShapes={localShapes}
        setLocalShapes={setLocalShapes}
        localForms={localForms}
        setLocalForms={setLocalForms}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
      />

      {loading && <p className="loading_message">로딩 중...</p>}
      {error && <p className="error_message">{error}</p>}
      {warning && <p className="warning_message">{warning}</p>}

      <SearchResults results={results} lastElementRef={lastElementRef} />
      <ScrollToTopButton offset={200} />
    </div>
  );
}
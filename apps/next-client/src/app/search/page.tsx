'use client';

import { KeyboardEvent, useEffect } from 'react';
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

  const {
    currentFilters,
    setCurrentFilters,
    applyFilters,
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

  useEffect(() => {
    if (!keyword) return;
    resetSearchQuery();
    resetAll();
    setCurrentFilters({ medicineSearchTerm: keyword });

    setIsSearchExecuted(false);
  }, [keyword, resetSearchQuery, resetAll, setCurrentFilters, setIsSearchExecuted]);

  const handleSearch = () => {
    const {
      medicineSearchTerm,
      companySearchTerm,
      selectedColors,
      selectedShapes,
      selectedForms,
    } = currentFilters;

    if (
      medicineSearchTerm.trim().length < 2 &&
      companySearchTerm.trim().length < 2 &&
      selectedColors.every((c) => c === FILTER_ALL) &&
      selectedShapes.every((c) => c === FILTER_ALL) &&
      selectedForms.every((c) => c === FILTER_ALL)
    ) {
      setWarning(SEARCH_ERROR_MESSAGES.SHORT_SEARCH_TERM);
      return;
    }

    applyFilters();
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

      <SearchBox onSearch={handleSearch} onKeyDown={handleKeyDown} />

      {loading && <p className="loading_message">로딩 중...</p>}
      {error && <p className="error_message">{error}</p>}
      {warning && <p className="warning_message">{warning}</p>}

      <SearchResults results={results} lastElementRef={lastElementRef} />
      <ScrollToTopButton offset={200} />
    </div>
  );
}
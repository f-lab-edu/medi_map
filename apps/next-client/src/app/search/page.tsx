'use client';

import { KeyboardEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchStore } from '@/store/useSearchStore';
import useMedicineSearch from '@/hooks/medicine/useMedicineSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { FILTER_ALL } from '@/constants/filters';
import { SEARCH_ERROR_MESSAGES } from '@/constants/searchErrors';
import { SearchBox } from '@/components/medicine/SearchBox';
import { SearchResults } from '@/components/medicine/MedicineResults';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import '@/styles/pages/search/search.scss';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get('keyword') || '';

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localCompany, setLocalCompany] = useState('');
  
  const [filters, setFilters] = useState<{ colors: string[]; shapes: string[]; forms: string[] }>({
    colors: [],
    shapes: [],
    forms: [],
  });

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

  useEffect(() => {
    if (!keyword) return;
  
    resetSearchQuery();
    resetAll();
    setLocalSearchTerm(keyword);
    setAppliedFilters({
      medicineSearchTerm: keyword,
      companySearchTerm: '',
      selectedColors: [],
      selectedShapes: [],
      selectedForms: [],
    });
    setIsSearchExecuted(true);
    setWarning(null);
  }, [keyword]);

  const handleSearch = () => {
    const { colors, shapes, forms } = filters;
  
    if (
      localSearchTerm.trim().length < 2 &&
      localCompany.trim().length < 2 &&
      colors.every((color) => color === FILTER_ALL) &&
      shapes.every((shape) => shape === FILTER_ALL) &&
      forms.every((form) => form === FILTER_ALL)
    ) {
      setWarning(SEARCH_ERROR_MESSAGES.SHORT_SEARCH_TERM);
      return;
    }
  
    setAppliedFilters({
      medicineSearchTerm: localSearchTerm.trim(),
      companySearchTerm: localCompany.trim(),
      selectedColors: colors,
      selectedShapes: shapes,
      selectedForms: forms,
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
        filters={filters}
        setFilters={setFilters}
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
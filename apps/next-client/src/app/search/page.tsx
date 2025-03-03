'use client';

import { useEffect, KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import useMedicineSearch from '@/hooks/medicine/useMedicineSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';
import { FILTER_ALL } from '@/constants/filters';
import '@/styles/pages/search/search.scss';
import { useSearchStore } from '@/store/useSearchStore';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { SearchResults } from "@/components/medicine/MedicineResults";
import { SearchBox } from "@/components/medicine/SearchBox"; 

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const {
    medicineSearchTerm,
    companySearchTerm,
    selectedColors,
    selectedShapes,
    selectedForms,
    page,
    warning,
    setMedicineSearchTerm,
    setPage,
    setWarning,
    results,
  } = useSearchStore();

  const { medicineService, resetResults, loading, error, hasMore } =
    useMedicineSearch();

  useEffect(() => {
    if (!keyword) return;
    setMedicineSearchTerm(keyword);
    resetResults();
    setPage(1);

    medicineService({
      name: keyword,
      company: "",
      color: [],
      shape: [],
      form: [],
      page: 1,
    });
  }, [keyword]);

  const handleSearch = () => {
    if (
      medicineSearchTerm.trim().length < 2 &&
      companySearchTerm.trim().length < 2 &&
      selectedColors.every((color) => color === FILTER_ALL) &&
      selectedShapes.every((shape) => shape === FILTER_ALL) &&
      selectedForms.every((form) => form === FILTER_ALL)
    ) {
      setWarning(SEARCH_ERROR_MESSAGES.SHORT_SEARCH_TERM);
      return;
    }

    resetResults();
    setPage(1);

    medicineService({
      name: medicineSearchTerm.trim(),
      company: companySearchTerm.trim(),
      color: selectedColors,
      shape: selectedShapes,
      form: selectedForms,
      page: 1,
    });

    setWarning(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => {
      setPage((prevPage) => prevPage + 1);
    },
  });

  useEffect(() => {
    if (page > 1) {
      medicineService({
        name: medicineSearchTerm,
        company: companySearchTerm,
        color: selectedColors,
        shape: selectedShapes,
        form: selectedForms,
        page,
      });
    }
  }, [page]);

  return (
    <div className="medicine_search">
      <h1 className="title">약 정보 검색</h1>
      <p className="sub_title">궁금했던 약 정보를 검색해보세요!</p>

      <SearchBox onSearch={handleSearch} onKeyDown={handleKeyDown} />

      {loading && <p>로딩 중...</p>}
      {error && <p className="error_message">{error}</p>}
      {warning && <p className="warning_message">{warning}</p>}

      <SearchResults results={results} lastElementRef={lastElementRef} />
      <ScrollToTopButton offset={200} />
    </div>
  );
}
"use client";

import { useEffect, KeyboardEvent, ChangeEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useMedicineSearch from "@/hooks/useMedicineSearch";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { SEARCH_ERROR_MESSAGES } from "@/constants/search_errors";
import { FILTERS, FILTER_ALL } from "@/constants/filters";
import "@/styles/pages/search/search.scss";
import { useSearchStore } from "@/store/useSearchStore";
import { MedicineResultDto } from '@/dto/MedicineResultDto';
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";

export default function SearchPage() {
  const {
    medicineSearchTerm,
    companySearchTerm,
    selectedColors,
    selectedShapes,
    selectedForms,
    page,
    isSearchExecuted,
    warning,
    setMedicineSearchTerm,
    setCompanySearchTerm,
    setSelectedColors,
    setSelectedShapes,
    setSelectedForms,
    setPage,
    setIsSearchExecuted,
    setWarning,
    results,
  } = useSearchStore();

  const { fetchMedicineInfo, resetResults, loading, error, hasMore } =
    useMedicineSearch();

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
    setIsSearchExecuted(true);

    fetchMedicineInfo({
      name: medicineSearchTerm.trim(),
      company: companySearchTerm.trim(),
      color: selectedColors,
      shape: selectedShapes,
      form: selectedForms,
      page: 1,
    });

    setWarning(null);
  };

  const updateFilter = (selectedItems: string[], newItem: string) => {
    if (newItem === FILTER_ALL) {
      return [FILTER_ALL];
    }
  
    const updatedItems = selectedItems.filter((item) => item !== FILTER_ALL);
  
    if (updatedItems.includes(newItem)) {
      return updatedItems.filter((item) => item !== newItem);
    }
  
    return [...updatedItems, newItem];
  };

  const handleColorSelect = (color: string) =>
    setSelectedColors((prev) => updateFilter(prev, color));

  const handleShapeSelect = (shape: string) =>
    setSelectedShapes((prev) => updateFilter(prev, shape));

  const handleFormSelect = (form: string) =>
    setSelectedForms((prev) => updateFilter(prev, form));

  const handleMediChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMedicineSearchTerm(e.target.value);
  };

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanySearchTerm(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
  });

  useEffect(() => {
    if (!isSearchExecuted || page <= 1) return;
  
    fetchMedicineInfo({
      name: medicineSearchTerm,
      company: companySearchTerm,
      color: selectedColors,
      shape: selectedShapes,
      form: selectedForms,
      page,
    });
  }, [page]);

  return (
    <div className="medicine_search">
      <h2 className="title">의약품 정보</h2>

      <div className="search_box">
        <input
          type="text"
          value={medicineSearchTerm}
          onChange={handleMediChange}
          onKeyDown={handleKeyDown}
          placeholder="약물 이름을 입력하세요"
        />
        <input
          type="text"
          value={companySearchTerm}
          onChange={handleCompanyChange}
          onKeyDown={handleKeyDown}
          placeholder="업체 이름을 입력하세요"
        />

        <div className="filters color_filters">
          {FILTERS.colors.map(({ name, className }) => (
            <button
              key={name}
              className={`${className} ${
                (name === FILTER_ALL && selectedColors.length === 0) ||
                selectedColors.includes(name)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleColorSelect(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="filters shape_filters">
          {FILTERS.shapes.map((shape) => (
            <button
              key={shape}
              className={
                (shape === FILTER_ALL && selectedShapes.length === 0) ||
                selectedShapes.includes(shape)
                  ? "selected"
                  : ""
              }
              onClick={() => handleShapeSelect(shape)}
            >
              {shape}
            </button>
          ))}
        </div>

        <div className="filters form_filters">
          {FILTERS.forms.map((form) => (
            <button
              key={form}
              className={
                (form === FILTER_ALL && selectedForms.length === 0) ||
                selectedForms.includes(form)
                  ? "selected"
                  : ""
              }
              onClick={() => handleFormSelect(form)}
            >
              {form}
            </button>
          ))}
        </div>

        <button onClick={handleSearch}>검색</button>
      </div>

      {loading && <p>로딩 중...</p>}
      {error && <p className="error_message">{error}</p>}
      {warning && <p className="warning_message">{warning}</p>}
      
      <ul className="medicine_results">
        {results.map((item: MedicineResultDto, index: number) => (
          <li
            className="medicine_desc"
            key={item.itemSeq}
            ref={index === results.length - 1 ? lastElementRef : null}
          >
            <Link href={`/search/${item.itemSeq}`} passHref>
              {item.itemImage && (
                <Image
                  src={item.itemImage}
                  alt={item.itemName}
                  width={100}
                  height={50}
                />
              )}
              <div className="medicine_info">
                <h3 className="name">{item.itemName}</h3>
                <div className="details">
                  <p className="classification">약물 분류: {item.className}</p>
                  <p className="type">전문/일반 구분: {item.etcOtcName}</p>
                  <p className="manufacturer">제조사: {item.entpName}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <ScrollToTopButton offset={200} />
    </div>
  );
}
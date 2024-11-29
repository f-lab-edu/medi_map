"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import useMedicineSearch from "@/hooks/useMedicineSearch";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { SEARCH_ERROR_MESSAGES } from "@/constants/search_errors";
import { FILTERS, FILTER_ALL } from "@/constants/filters";
import "@/styles/pages/search/search.scss";

export default function SearchPage() {
  const [medicineSearchTerm, setMedicineSearchTerm] = useState<string>("");
  const [companySearchTerm, setCompanySearchTerm] = useState<string>("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isSearchExecuted, setIsSearchExecuted] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);

  // 의약품 검색 관련 hook
  const { results, loading, error, hasMore, fetchMedicineInfo, resetResults } =
    useMedicineSearch();

  // 검색 실행
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

    // 검색 API 호출
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

  // 새로운 항목 추가 또는 제거
  const updateFilter = (selectedItems: string[], newItem: string) => {
    if (newItem === FILTER_ALL) {
      return [FILTER_ALL]; // "전체" 선택 시 다른 선택 해제
    }
    if (selectedItems.includes(newItem)) {
      return selectedItems.filter((item) => item !== newItem && item !== FILTER_ALL); // 항목 제거
    }
    return [...selectedItems.filter((item) => item !== FILTER_ALL), newItem]; // 새로운 항목 추가
  };

  // 필터 선택
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

  // 무한 스크롤 
  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
  });

  useEffect(() => {
    if (isSearchExecuted) {
      fetchMedicineInfo({
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

      {!loading && isSearchExecuted && results.length === 0 && !warning && (
        <p className="no_results_message">{SEARCH_ERROR_MESSAGES.NO_RESULTS_FOUND}</p>
      )}

      <ul className="medicine_results">
        {results.map((item, index) => (
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
    </div>
  );
}
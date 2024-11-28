"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import useMedicineSearch from "@/hooks/useMedicineSearch";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { SEARCH_ERROR_MESSAGES } from "@/constants/search_errors";
import { ShortSearchTermError } from "@/error/SearchError";
import "@/styles/pages/search/search.scss";

export default function SearchPage() {
  const [medicineSearchTerm, setMedicineSearchTerm] = useState<string>(""); // 약물 검색어
  const [companySearchTerm, setCompanySearchTerm] = useState<string>(""); // 업체 검색어
  const [selectedColors, setSelectedColors] = useState<string[]>([]); // 선택한 색상
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]); // 선택한 모양
  const [selectedForms, setSelectedForms] = useState<string[]>([]); // 선택한 형태
  const [page, setPage] = useState<number>(1); // 현재 페이지
  const [isSearchExecuted, setIsSearchExecuted] = useState<boolean>(false); // 검색 실행 여부
  const [warning, setWarning] = useState<string | null>(null); // 경고 메시지

  const { results, loading, error, hasMore, fetchMedicineInfo, resetResults } =
    useMedicineSearch();

// 검색 실행 함수
const handleSearch = () => {
  if (
    medicineSearchTerm.trim().length < 2 &&
    companySearchTerm.trim().length < 2 &&
    selectedColors.every((color) => color === "전체") &&
    selectedShapes.every((shape) => shape === "전체") &&
    selectedForms.every((form) => form === "전체")
  ) {
    setWarning("검색어를 2자 이상 입력하거나 필터를 선택해주세요.");
    return;
  }

  resetResults();
  setPage(1);
  setIsSearchExecuted(true);

  fetchMedicineInfo({
    name: medicineSearchTerm.trim(),
    company: companySearchTerm.trim(),
    color: selectedColors, // 배열로 전달
    shape: selectedShapes, // 배열로 전달
    form: selectedForms, // 배열로 전달
    page: 1,
  });

  setWarning(null);
};
  
  
const handleColorSelect = (color: string) => {
  if (color === "전체") {
    setSelectedColors(["전체"]); // "전체"만 유지
  } else {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color && c !== "전체") // "전체" 제거
        : [...prevColors.filter((c) => c !== "전체"), color] // "전체" 제거 후 추가
    );
  }
};

const handleShapeSelect = (shape: string) => {
  if (shape === "전체") {
    setSelectedShapes(["전체"]); // "전체"만 유지
  } else {
    setSelectedShapes((prevShapes) =>
      prevShapes.includes(shape)
        ? prevShapes.filter((s) => s !== shape && s !== "전체") // "전체" 제거
        : [...prevShapes.filter((s) => s !== "전체"), shape] // "전체" 제거 후 추가
    );
  }
};

const handleFormSelect = (form: string) => {
  if (form === "전체") {
    setSelectedForms(["전체"]); // "전체"만 유지
  } else {
    setSelectedForms((prevForms) =>
      prevForms.includes(form)
        ? prevForms.filter((f) => f !== form && f !== "전체") // "전체" 제거
        : [...prevForms.filter((f) => f !== "전체"), form] // "전체" 제거 후 추가
    );
  }
};


  // 약물 검색어 입력 변경
  const handleMedicineInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMedicineSearchTerm(e.target.value);
  };

  // 업체 검색어 입력 변경
  const handleCompanyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanySearchTerm(e.target.value);
  };

  // Enter 키로 검색 실행
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 무한 스크롤 핸들링
  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
  });

  // 검색어 또는 페이지 변경 시 API 호출
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
          onChange={handleMedicineInputChange}
          onKeyDown={handleKeyDown}
          placeholder="약물 이름을 입력하세요"
        />
        <input
          type="text"
          value={companySearchTerm}
          onChange={handleCompanyInputChange}
          onKeyDown={handleKeyDown}
          placeholder="업체 이름을 입력하세요"
        />

<div className="filters color_filters">
  {[
    { name: "전체", className: "all" },
    { name: "하양", className: "white" },
    { name: "노랑", className: "yellow" },
    { name: "주황", className: "orange" },
    { name: "분홍", className: "pink" },
    { name: "빨강", className: "red" },
    { name: "갈색", className: "brown" },
    { name: "연두", className: "light-green" },
    { name: "초록", className: "green" },
    { name: "청록", className: "cyan" },
    { name: "파랑", className: "blue" },
    { name: "남색", className: "navy" },
    { name: "자주", className: "purple" },
    { name: "보라", className: "violet" },
    { name: "회색", className: "gray" },
    { name: "검정", className: "black" },
    { name: "투명", className: "transparent" },
  ].map(({ name, className }) => (
    <button
      key={name}
      className={`${className} ${
        (name === "전체" && selectedColors.length === 0) || selectedColors.includes(name)
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
  {["전체", "원형", "타원형", "장방형", "반원형", "삼각형", "사각형", "마름모형", "오각형", "육각형", "팔각형"].map((shape) => (
    <button
      key={shape}
      className={
        (shape === "전체" && selectedShapes.length === 0) || selectedShapes.includes(shape)
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
  {["전체", "정제", "경질캡슐", "연질캡슐"].map((form) => (
    <button
      key={form}
      className={
        (form === "전체" && selectedForms.length === 0) || selectedForms.includes(form)
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

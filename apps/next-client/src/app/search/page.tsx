"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useMedicineSearch from '@/hooks/useMedicineSearch';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';
import { ShortSearchTermError } from '@/error/SearchError';
import '@/styles/pages/search/search.scss';

export default function SearchPage() {
  const [medicineSearchTerm, setMedicineSearchTerm] = useState<string>(''); // 약물 검색어
  const [companySearchTerm, setCompanySearchTerm] = useState<string>(''); // 업체 검색어
  const [currentMedicineSearchTerm, setCurrentMedicineSearchTerm] = useState<string>(''); // 현재 약물 검색어
  const [currentCompanySearchTerm, setCurrentCompanySearchTerm] = useState<string>(''); // 현재 업체 검색어
  const [page, setPage] = useState<number>(1); // 현재 페이지
  const [isSearchExecuted, setIsSearchExecuted] = useState<boolean>(false); // 검색 실행 여부
  const [warning, setWarning] = useState<string | null>(null); // 경고 메시지

  const {
    results,
    loading,
    error,
    hasMore,
    fetchMedicineInfo,
    resetResults,
  } = useMedicineSearch();

  // 검색 실행
  const handleSearch = () => {
    if (medicineSearchTerm.trim().length < 2 && companySearchTerm.trim().length < 2) {
      setWarning('검색어를 2자 이상 입력해주세요.'); // 검색어가 너무 짧으면 경고
      return;
    }
    resetResults();
    setCurrentMedicineSearchTerm(medicineSearchTerm.trim());
    setCurrentCompanySearchTerm(companySearchTerm.trim());
    setPage(1); // 첫 페이지로 초기화
    setIsSearchExecuted(true);
    setWarning(null);
  };

  // Enter 키로 검색 실행
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
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

  // 무한 스크롤 핸들링
  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
  });

  // 검색어 또는 페이지 변경 시 API 호출
  useEffect(() => {
    if (currentMedicineSearchTerm || currentCompanySearchTerm) {
      fetchMedicineInfo(currentMedicineSearchTerm, currentCompanySearchTerm, page);
    }
  }, [currentMedicineSearchTerm, currentCompanySearchTerm, page, fetchMedicineInfo]);

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

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
  const [searchTerm, setSearchTerm] = useState<string>(''); // 검색어
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>(''); // 현재 검색어
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
    if (searchTerm.trim().length < 2) {
      setWarning(new ShortSearchTermError().message); // 검색어가 너무 짧으면 경고
      return;
    }
    resetResults();
    setCurrentSearchTerm(searchTerm.trim());
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

  // 검색어 입력 변경
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 무한 스크롤 핸들링
  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
  });

  // 검색어 또는 페이지 변경 시 API 호출
  useEffect(() => {
    if (currentSearchTerm) {
      fetchMedicineInfo(currentSearchTerm, page);
    }
  }, [currentSearchTerm, page, fetchMedicineInfo]);

  return (
    <div className="medicine_search">
      <h2 className="title">의약품 정보</h2>
      
      <div className="search_box">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="약물 이름을 입력하세요"
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
        {results.map((item) => (
          <li
            className="medicine_desc"
            key={item.itemSeq}
            ref={item === results[results.length - 1] ? lastElementRef : null}
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

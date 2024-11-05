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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isSearchExecuted, setIsSearchExecuted] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);

  const {
    results,
    loading,
    error,
    hasMore,
    fetchMedicineInfo,
    resetResults,
  } = useMedicineSearch();

  const handleSearch = () => {
    if (searchTerm.trim().length < 2) {
      setWarning(new ShortSearchTermError().message);
      return;
    }
    resetResults();
    setCurrentSearchTerm(searchTerm.trim());
    setPage(1);
    setIsSearchExecuted(true);
    setWarning(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const lastElementRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
  });

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
          <li className="medicine_desc" key={item.ITEM_SEQ} ref={item === results[results.length - 1] ? lastElementRef : null}>
            <Link href={`/search/${item.ITEM_SEQ}`} passHref>
              {item.ITEM_IMAGE && (
                <Image
                  src={item.ITEM_IMAGE}
                  alt={item.ITEM_NAME}
                  width={100}
                  height={50}
                />
              )}
              <div className="medicine_info">
                <h3 className="name">{item.ITEM_NAME}</h3>
                
                <div className="details">
                  <p className="classification">약물 분류: {item.CLASS_NAME}</p>
                  <p className="type">전문/일반 구분: {item.ETC_OTC_NAME}</p>
                  <p className="manufacturer">제조사: {item.ENTP_NAME}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import '@/styles/pages/search/search.scss';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchExecuted, setSearchExecuted] = useState(false);

  const observer = useRef();

  const fetchMedicineInfo = async (reset = false) => {
    if (currentSearchTerm.length < 2) {
      setWarning('2글자 이상 검색하세요.');
      setLoading(false);
      return;
    }

    setWarning(null);
    setLoading(true);
    setError(null);
    setSearchExecuted(true); 

    try {
      const response = await axios.get('/api/medicine', {
        params: { name: currentSearchTerm, page, limit: 10 },
      });

      const newResults = Array.isArray(response.data.results) ? response.data.results : [];
      const newTotal = response.data.total || 0;

      if (reset) {
        setResults(newResults);
      } else {
        setResults((prevResults) => [...prevResults, ...newResults]);
      }

      if (newTotal > 0) setTotalResults(newTotal);
      setHasMore(newResults.length > 0);
    } catch (error) {
      setError('약물 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim().length < 2) {
      setWarning('2글자 이상 검색하세요.');
      return;
    }
    setPage(1);
    setResults([]);
    setHasMore(true);
    setSearchExecuted(false);
    setWarning(null);
    setCurrentSearchTerm(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (currentSearchTerm) {
      fetchMedicineInfo(page === 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearchTerm, page]);

  return (
    <div className="medicine_search">
      <h2 className="title">의약품 정보</h2>
      
      <div className="search_box">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} 
          placeholder="약물 이름을 입력하세요"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {searchExecuted && totalResults > 0 && (
        <p className="total_results_message">총 {totalResults}개의 검색결과가 있습니다.</p>
      )}

      {loading && <p>로딩 중...</p>}
      {error && <p className="error_message">{error}</p>}

      {searchExecuted && !loading && results.length === 0 && !error && (
        <p className="no_results_message">찾으시는 약물 정보가 없습니다.</p>
      )}

      <ul className="medicine_results">
        {results.map((item, index) => (
          <li className="medicine_desc" key={index} ref={index === results.length - 1 ? lastElementRef : null}>
            {item.ITEM_IMAGE && (
              <Image
                src={item.ITEM_IMAGE}
                alt={item.ITEM_NAME}
                width={100}
                height={50}
              />
            )}
            <h3 className='name'>{item.ITEM_NAME}</h3>
            <p className='type'>{item.CLASS_NAME}</p>
            <p className='company'>제조사: {item.ENTP_NAME}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

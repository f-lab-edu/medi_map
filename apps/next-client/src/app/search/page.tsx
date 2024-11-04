"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import '@/styles/pages/search/search.scss';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchExecuted, setSearchExecuted] = useState(false);

  const observer = useRef();

  const fetchMedicineInfo = async (reset = false) => {
    if (searchTerm.length < 2) {
      setWarning('2글자 이상 검색하세요.');
      return;
    }

    setWarning(null);
    setLoading(true);
    setError(null);
    setSearchExecuted(true); 

    try {
      const response = await axios.get('/api/medicine', {
        params: { name: searchTerm, page, limit: 10 },
      });

      const newResults = Array.isArray(response.data.results) ? response.data.results : [];
      const newTotal = response.data.total || 0; 

      if (reset) {
        setResults(newResults);
      } else {
        setResults((prevResults) => [...prevResults, ...newResults]);
      }
      
      setHasMore(newResults.length > 0); 
    } catch (error) {
      setError('약물 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setResults([]);
    setSearchExecuted(false);
    fetchMedicineInfo(true);
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
    if (page > 1) {
      fetchMedicineInfo();
    }
  }, [page]);

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

      {warning && <p className="warning_message">{warning}</p>}
      {loading && <p>로딩 중...</p>}
      {error && <p className="error_message">{error}</p>}

      {searchExecuted && !loading && results.length === 0 && !error && (
        <p className="no_results_message">찾으시는 약물 정보가 없습니다.</p>
      )}

      <ul className="medicine_results">
        {results.map((item, index) => (
          <li className="medicine_desc" key={index} ref={index === results.length - 1 ? lastElementRef : null}>
            <Image
              src={item.ITEM_IMAGE}
              alt={item.ITEM_NAME}
              width={100}
              height={100}
            />
            <h3 className='name'>{item.ITEM_NAME}</h3>
            <p className='type'>{item.CLASS_NAME}</p>
            <p className='company'>제조사: {item.ENTP_NAME}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

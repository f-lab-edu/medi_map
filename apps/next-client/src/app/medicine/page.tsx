'use client';

import Image from 'next/image';
import '@/styles/pages/search/search.scss';
import { axiosInstance } from '@/services/axiosInstance';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_URLS } from '@/constants/urls';
import { MedicineResponse } from '@/dto/MedicineResultDto';

const fetchMedicine = async (medicineName: string): Promise<MedicineResponse> => {
  try {
    const response = await axiosInstance.get(`${API_URLS.MEDICINE_SEARCH}?medicineName=${medicineName}`);
    return response.data;
  } catch (error) {
    console.error('의약품 데이터를 가져오는 중 오류 발생', error);
    throw new Error('의약품 데이터를 가져오는 데 실패했습니다.');
  }
};

export default function MedicinePage() {
  const [medicineName, setMedicineName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: medicineData, isError, error, isFetching } = useQuery<MedicineResponse>({
    queryKey: ['medicineData', searchTerm],
    queryFn: () => fetchMedicine(searchTerm),
    enabled: !!searchTerm,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const handleSearch = () => {
    setSearchTerm(medicineName);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="medicine_search">
      <h2 className="title">약 정보 검색</h2>
      <p className="sub_title">궁금했던 약 정보를 검색해보세요!</p>

      <input
        type="text"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="약 이름을 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>

      {isFetching && <p className='loading_message'>로딩 중..</p>}
      {isError && <p className='error_message'>{error?.message}</p>}

      {medicineData?.results.length ? (
        <ul className="medicine_list">
          {medicineData.results.map((item, index) => (
            <li key={`${item.id}-${item.itemSeq}-${index}`} className="medicine_item">  
              {item.itemImage && (
             <div className="medicine_image">
              <Image
                src={item.itemImage}
                alt={item.itemName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            )}
              <div className="medicine_info">
                <h3 className="name">{item.itemName}</h3>
                <div className="details">
                  <p className="classification">약물 분류: {item.className}</p>
                  <p className="type">전문/일반 구분: {item.etcOtcName}</p>
                  <p className="manufacturer">제조사: {item.entpName}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no_results">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
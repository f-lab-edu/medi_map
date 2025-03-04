'use client';

import '@/styles/pages/search/search.scss';
import { axiosInstance } from '@/services/axiosInstance';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_URLS } from '@/constants/urls';
import { MedicineResultDto } from '@/dto/MedicineResultDto';

const fetchMedicine = async (medicineName: string): Promise<MedicineResultDto> => {
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

  const { data: medicineData } = useQuery<MedicineResultDto>({
    queryKey: ['MedicineResultDto', searchTerm],
    queryFn: () => fetchMedicine(searchTerm),
    enabled: !!searchTerm,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const handleSearch = () => {
    setSearchTerm(medicineName);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        onKeyDown={handleKeyPress}
        placeholder="약 이름을 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>
      {medicineData && (
        <div className="medicine_data">
          <pre>{JSON.stringify(medicineData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
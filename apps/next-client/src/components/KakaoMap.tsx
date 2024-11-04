import React, { useEffect, useState } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { loadKakaoMapScript } from '@/utils/kakaoMapLoader';
import { initializeMap, addMarkers } from '@/utils/mapUtils';

interface KakaoMapProps {
  pharmacies: PharmacyDTO[];
  location: { lat: number; lng: number } | null;
}

type FilterType = 'ALL' | 'OPEN_NOW' | 'NIGHT_PHARMACY';

const KakaoMap: React.FC<KakaoMapProps> = ({ pharmacies, location }) => {
  const [filter, setFilter] = useState<FilterType>('ALL');

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadKakaoMapScript();
        if (location) {
          const filteredPharmacies = applyFilter(pharmacies, filter);
          initializeMap('map', location, (map) => addMarkers(map, filteredPharmacies));
        }
      } catch (error) {
        console.error("Failed to load Kakao Map:", error);
      }
    };
    initialize();
  }, [pharmacies, location, filter]);

  // 약국 목록 필터링
  const applyFilter = (pharmacies: PharmacyDTO[], filter: FilterType): PharmacyDTO[] => {
    const currentTime = getCurrentTime();

    switch (filter) {
      case 'OPEN_NOW':
        return pharmacies.filter(pharmacy => isPharmacyOpenNow(pharmacy, currentTime));
      case 'NIGHT_PHARMACY':
        return pharmacies.filter(isNightPharmacy);
      case 'ALL':
      default:
        return pharmacies;
    }
  };

  // 현재 시간을 HHMM 형식으로 반환
  const getCurrentTime = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    return currentHour * 100 + currentMinute;
  };

  // 현재 시간 기준으로 약국이 영업 중인지 확인
  const isPharmacyOpenNow = (pharmacy: PharmacyDTO, currentTime: number): boolean => {
    const openTime = parseInt(pharmacy.dutyTime1s || '0000', 10);
    const closeTime = parseInt(pharmacy.dutyTime1c || '2400', 10);
    return closeTime < openTime 
      ? currentTime >= openTime || currentTime < closeTime
      : currentTime >= openTime && currentTime < closeTime;
  };

  // 약국이 심야 시간대에 영업하는지 확인
  const isNightPharmacy = (pharmacy: PharmacyDTO) => {
    const closeTime = parseInt(pharmacy.dutyTime1c || '2400', 10);
    return closeTime >= 2400 || closeTime < 600;
  };

  return (
    <div className='map_cont'>
      <div id="map" style={{ width: '100%', height: '600px', marginBottom: '20px' }}></div>
      <ul className="load_info_list">
        <li onClick={() => setFilter('ALL')}>전체</li>
        <li onClick={() => setFilter('OPEN_NOW')}>영업중</li>
        <li onClick={() => setFilter('NIGHT_PHARMACY')}>공공심야약국</li>
      </ul>
    </div>
  );
};

export default KakaoMap;
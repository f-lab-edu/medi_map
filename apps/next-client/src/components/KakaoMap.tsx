import React, { useEffect, useState } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { loadKakaoMapScript } from '@/utils/kakaoMapLoader';

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
          initializeMap('map', filteredPharmacies, location);
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
    const openTime = parseInt(pharmacy.dutyTime1s || '0000', 10); // 개점 시간
    const closeTime = parseInt(pharmacy.dutyTime1c || '2400', 10); // 폐점 시간

    return closeTime < openTime 
      ? currentTime >= openTime || currentTime < closeTime // 야간 영업 시간
      : currentTime >= openTime && currentTime < closeTime; // 일반 영업 시간
  };

  // 약국이 심야 시간대에 영업하는지 확인
  const isNightPharmacy = (pharmacy: PharmacyDTO) => {
    const closeTime = parseInt(pharmacy.dutyTime1c || '2400', 10);
    return closeTime >= 2400 || closeTime < 600; // 심야 영업 시간
  };

  // 약국 위치에 마커를 생성하는 함수
  const createMarker = (map: kakao.maps.Map, pharmacy: PharmacyDTO) => {
    const markerPosition = new kakao.maps.LatLng(pharmacy.wgs84Lat, pharmacy.wgs84Lon);
    return new kakao.maps.Marker({ map, position: markerPosition, title: pharmacy.dutyName });
  };

  // 마커 위에 표시될 인포 윈도우 생성
  const createInfoWindow = (pharmacy: PharmacyDTO) => {
    return new kakao.maps.InfoWindow({
      content: `<div class='info_name'>${pharmacy.dutyName}</div>`, // 약국 이름 표시
    });
  };

  // 지도에 약국 마커와 인포 윈도우 추가
  const addMarkers = (map: kakao.maps.Map, pharmacies: PharmacyDTO[]) => {
    pharmacies.forEach((pharmacy) => {
      const marker = createMarker(map, pharmacy);
      const infoWindow = createInfoWindow(pharmacy);

      kakao.maps.event.addListener(marker, 'mouseover', () => infoWindow.open(map, marker));
      kakao.maps.event.addListener(marker, 'mouseout', () => infoWindow.close());
    });
  };

  // 지도 초기화 함수
  const initializeMap = (
    containerId: string,
    filteredPharmacies: PharmacyDTO[],
    location: { lat: number; lng: number }
  ) => {
    kakao.maps.load(() => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Map container with id "${containerId}" not found`);
        return;
      }

      const options = { center: new kakao.maps.LatLng(location.lat, location.lng), level: 5 };
      const map = new kakao.maps.Map(container, options);

      addMarkers(map, filteredPharmacies);
    });
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
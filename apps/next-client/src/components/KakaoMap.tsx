// components/KakaoMap.tsx

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { loadKakaoMapScript } from '@/utils/kakaoMapLoader';
import { initializeMap, addMarkers } from '@/utils/mapUtils';
import { applyFilter, FilterType } from '@/utils/mapFilterUtils';

interface KakaoMapProps {
  pharmacies: PharmacyDTO[];
  location: { lat: number; lng: number } | null;
  onSearch: (lat: number, lng: number) => Promise<void>;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ pharmacies, location, onSearch }) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);

  // 지도 초기화: 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    const initialize = async () => {
      try {
        await loadKakaoMapScript();
        if (location) {
          initializeMap('map', location, (map) => {
            mapRef.current = map;
            // 초기 마커 추가
            if (pharmacies.length > 0) {
              const filteredPharmacies = applyFilter(pharmacies, filter);
              const newMarkers = addMarkers(map, filteredPharmacies);
              setMarkers(newMarkers);
            }
          });
        }
      } catch (error) {
        console.error("Failed to load Kakao Map:", error);
      }
    };
    initialize();
  }, [location]); // location 변경 시에만 실행

  // 약국 데이터나 필터 변경 시 마커 업데이트
  useEffect(() => {
    if (mapRef.current) {
      const filteredPharmacies = applyFilter(pharmacies, filter);
      const newMarkers = addMarkers(mapRef.current, filteredPharmacies, markers);
      setMarkers(newMarkers);
    }
  }, [pharmacies, filter]);

  const handleSearchInCurrentMap = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const lat = center.getLat();
      const lng = center.getLng();
      onSearch(lat, lng);
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <div className='map_cont'>
      <div id="map" style={{ width: '100%', height: 'calc(100vh - 75px)', marginBottom: '20px' }}></div>
      <button className='map_search' onClick={handleSearchInCurrentMap}>현재 지도에서 검색</button>
      <ul className="load_info_list">
        <li onClick={() => handleFilterChange('ALL')}>전체</li>
        <li onClick={() => handleFilterChange('OPEN_NOW')}>영업중</li>
        <li onClick={() => handleFilterChange('NIGHT_PHARMACY')}>공공심야약국</li>
      </ul>
    </div>
  );
};

export default KakaoMap;

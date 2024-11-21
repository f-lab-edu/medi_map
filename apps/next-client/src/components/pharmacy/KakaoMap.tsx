"use client";

import React, { useEffect, useState, useRef } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { loadKakaoMapScript } from '@/utils/kakaoMapLoader';
import { initializeMap, addMarkers } from '@/utils/mapUtils';
import { applyFilter, FilterType } from '@/utils/mapFilterUtils';
import { ERROR_MESSAGES } from '@/constants/errors';

interface KakaoMapProps {
  pharmacies: PharmacyDTO[];
  location: { lat: number; lng: number } | null;
  onSearch: (lat: number, lng: number) => Promise<void>;
  onPharmacyClick: (pharmacy: PharmacyDTO) => void;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ pharmacies, location, onSearch, onPharmacyClick }) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [mapLoaded, setMapLoaded] = useState(false);

  // Kakao 지도 스크립트 로드
  useEffect(() => {
    const initialize = async () => {
      try {
        await loadKakaoMapScript();
        setMapLoaded(true);
      } catch (error) {
        console.error(ERROR_MESSAGES.KAKAO_MAP_ERROR, error);
      }
    };
    initialize();
  }, []);

  // 지도 초기화 및 위치 설정
  useEffect(() => {
    if (mapLoaded && location && mapRef.current === null) {
      initializeMap('map', location, (map) => {
        mapRef.current = map;
        updateMarkers(pharmacies);  // 초기 마커 설정
      });
    }
  }, [mapLoaded, location]);

  // 약국 데이터나 필터 변경 시 마커 업데이트
  useEffect(() => {
    if (mapRef.current) {
      updateMarkers(pharmacies);
    }
  }, [pharmacies, filter]);

  // 마커를 업데이트하는 함수
  const updateMarkers = (pharmacies: PharmacyDTO[]) => {
    // 기존 마커 제거
    if (Array.isArray(markersRef.current)) {
      markersRef.current.forEach(marker => marker.setMap(null));
    }
    markersRef.current = [];

    // 필터된 약국 목록으로 새로운 마커 추가
    const filteredPharmacies = applyFilter(pharmacies, filter);
    const newMarkers = addMarkers(mapRef.current!, filteredPharmacies, onPharmacyClick); // 클릭 이벤트 전달
    markersRef.current = newMarkers;  // 새 마커 목록을 저장
  };

  // 현재 지도 위치 기준으로 약국 검색
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
      <div id="map" style={{ width: '100%', height: 'calc(100vh - 75px)'}}></div>
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
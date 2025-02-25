'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { loadKakaoMapScript } from '@/utils/kakaoMapLoader';
import { initializeMap, addMarkers } from '@/utils/mapUtils';
import { applyFilter, FilterType } from '@/utils/mapFilterUtils';
import { ERROR_MESSAGES } from '@/constants/errors';

interface KakaoMapProps {
  pharmacies: PharmacyDTO[];
  location: { lat: number; lng: number } | null;
  onSearch: (lat: number, lng: number) => void;  // 검색을 요청할 콜백
  onPharmacyClick: (pharmacy: PharmacyDTO) => void;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  pharmacies,
  location,
  onSearch,
  onPharmacyClick,
}) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [mapLoaded, setMapLoaded] = useState(false);

  // 카카오 맵 스크립트 로드
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

  // 약국 마커 갱신
  const updateMarkers = useCallback(
    (pharmacies: PharmacyDTO[]) => {
      if (Array.isArray(markersRef.current)) {
        markersRef.current.forEach((marker) => marker.setMap(null));
      }
      markersRef.current = [];

      const filteredPharmacies = applyFilter(pharmacies, filter);
      const newMarkers = addMarkers(
        mapRef.current!,
        filteredPharmacies,
        onPharmacyClick
      );
      markersRef.current = newMarkers;
    },
    [filter, onPharmacyClick]
  );

  // 지도 초기화 (최초 로드 & location 변경 시)
  useEffect(() => {
    if (mapLoaded && location && mapRef.current === null) {
      initializeMap('map', location, (map) => {
        mapRef.current = map;
        updateMarkers(pharmacies);
      });
    }
  }, [mapLoaded, location, pharmacies, updateMarkers]);

  // filter 변경 시 마커 재생성
  useEffect(() => {
    if (mapRef.current) {
      updateMarkers(pharmacies);
    }
  }, [pharmacies, filter, updateMarkers]);

  // 현재 지도 중심에서 검색 버튼
  const handleSearchInCurrentMap = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const lat = center.getLat();
      const lng = center.getLng();
      onSearch(lat, lng); // 부모에 콜백
    }
  };

  // 필터 변경
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  // 내 위치에서 검색 버튼
  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // 지도 위치 이동
          if (mapRef.current) {
            const moveLatLon = new kakao.maps.LatLng(latitude, longitude);
            mapRef.current.setCenter(moveLatLon);
          }
          // 부모에 새로운 좌표 전달
          onSearch(latitude, longitude);
        },
        (error) => {
          console.error('현재 위치를 가져오는데 실패했습니다.', error);
        }
      );
    } else {
      console.error('Geolocation API를 지원하지 않는 브라우저입니다.');
    }
  };

  return (
    <div className="map_cont">
      <div id="map" style={{ width: '100%', height: '100vh' }} />
      
      <button className="map_search" onClick={handleSearchInCurrentMap}>
        현재 지도에서 검색
      </button>

      <ul className="load_info_list">
        <li
          className={filter === 'ALL' ? 'selected' : ''}
          onClick={() => handleFilterChange('ALL')}
        >
          전체
        </li>
        <li
          className={filter === 'OPEN_NOW' ? 'selected' : ''}
          onClick={() => handleFilterChange('OPEN_NOW')}
        >
          영업중
        </li>
        <li
          className={filter === 'NIGHT_PHARMACY' ? 'selected' : ''}
          onClick={() => handleFilterChange('NIGHT_PHARMACY')}
        >
          공공심야약국
        </li>
        <li onClick={handleLocationSearch} className="current_location">
          내 위치에서 검색
        </li>
      </ul>
    </div>
  );
};

export default KakaoMap;
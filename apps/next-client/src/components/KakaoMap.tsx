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
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadKakaoMapScript();
        setMapLoaded(true);
      } catch (error) {
        console.error("Failed to load Kakao Map script:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (mapLoaded && location && mapRef.current === null) {
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
  }, [mapLoaded, location, filter, pharmacies]);

  useEffect(() => {
    if (mapRef.current) {
      markers.forEach(marker => marker.setMap(null));
  
      const filteredPharmacies = applyFilter(pharmacies, filter);
      const newMarkers = addMarkers(mapRef.current, filteredPharmacies);
      setMarkers(newMarkers);
    }
  }, [pharmacies, filter, markers]);

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
import React, { useEffect, useState } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { loadKakaoMapScript } from '@/utils/kakaoMapLoader';
import { initializeMap, addMarkers } from '@/utils/mapUtils';
import { applyFilter, FilterType } from '@/utils/mapFilterUtils';

interface KakaoMapProps {
  pharmacies: PharmacyDTO[];
  location: { lat: number; lng: number } | null;
}

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
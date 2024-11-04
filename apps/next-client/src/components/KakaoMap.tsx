import React, { useEffect, useState } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { ERROR_MESSAGES } from '@/constants/errors';

interface KakaoMapProps {
  pharmacies: PharmacyDTO[];
  location: { lat: number; lng: number } | null;
}

type FilterType = 'ALL' | 'OPEN_NOW' | 'NIGHT_PHARMACY';

function loadKakaoMapScript(callback: () => void) {
  if (document.querySelector(`script[src*="sdk.js"]`)) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
  script.async = true;
  script.onload = callback;
  script.onerror = () => console.error(ERROR_MESSAGES.KAKAO_MAP_ERROR);
  document.head.appendChild(script);
}

const KakaoMap: React.FC<KakaoMapProps> = ({ pharmacies, location }) => {
  const [filter, setFilter] = useState<FilterType>('ALL');

  useEffect(() => {
    loadKakaoMapScript(() => {
      if (location && pharmacies.length > 0) {
        initializeMap('map', applyFilter(pharmacies, filter), location);
      }
    });
  }, [pharmacies, location, filter]);

  const applyFilter = (pharmacies: PharmacyDTO[], filter: FilterType) => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTime = currentHour * 100 + currentMinute;
  
    switch (filter) {
      case 'OPEN_NOW':
        return pharmacies.filter(pharmacy => {
          const openTime = parseInt(pharmacy.dutyTime1s || '0000', 10);
          const closeTime = parseInt(pharmacy.dutyTime1c || '2400', 10);
  
          if (closeTime < openTime) {
            return currentTime >= openTime || currentTime < closeTime;
          } else {
            return currentTime >= openTime && currentTime < closeTime;
          }
        });
      case 'NIGHT_PHARMACY':
        return pharmacies.filter(pharmacy => {
          const closeTime = parseInt(pharmacy.dutyTime1c || '2400', 10);
          return closeTime >= 2400 || closeTime < 600;
        });
      case 'ALL':
      default:
        return pharmacies;
    }
  };
  

  const initializeMap = (containerId: string, filteredPharmacies: PharmacyDTO[], location: { lat: number; lng: number }) => {
    window.kakao.maps.load(() => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Map container with id "${containerId}" not found`);
        return;
      }

      const options = { center: new window.kakao.maps.LatLng(location.lat, location.lng), level: 5 };
      const map = new window.kakao.maps.Map(container, options);

      filteredPharmacies.forEach((pharmacy) => {
        const markerPosition = new window.kakao.maps.LatLng(pharmacy.wgs84Lat, pharmacy.wgs84Lon);
        const marker = new window.kakao.maps.Marker({ map, position: markerPosition, title: pharmacy.dutyName });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div class='info_name'>${pharmacy.dutyName}</div>`,
        });

        window.kakao.maps.event.addListener(marker, 'mouseover', () => infoWindow.open(map, marker));
        window.kakao.maps.event.addListener(marker, 'mouseout', () => infoWindow.close());
      });
    });
  };

  return (
    <div className='map_cont'>
      <div id="map" style={{ width: '100%', height: '400px', marginBottom: '20px' }}></div>
      <ul className="load_info_list">
        <li onClick={() => setFilter('ALL')}>전체</li>
        <li onClick={() => setFilter('OPEN_NOW')}>영업중</li>
        <li onClick={() => setFilter('NIGHT_PHARMACY')}>공공심야약국</li>
      </ul>
    </div>
  );
};

export default KakaoMap;

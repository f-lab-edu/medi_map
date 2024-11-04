import React, { useEffect } from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { ERROR_MESSAGES } from '@/constants/errors';

interface KakaoMapProps {
  pharmacies: PharmacyDTO[];
  location: { lat: number; lng: number } | null;
}

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
  useEffect(() => {
    loadKakaoMapScript(() => {
      if (location && pharmacies.length > 0) {
        initializeMap('map', pharmacies, location);
      }
    });
  }, [pharmacies, location]);

  const initializeMap = (containerId: string, pharmacies: PharmacyDTO[], location: { lat: number; lng: number }) => {
    window.kakao.maps.load(() => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Map container with id "${containerId}" not found`);
        return;
      }

      const options = { center: new window.kakao.maps.LatLng(location.lat, location.lng), level: 5 };
      const map = new window.kakao.maps.Map(container, options);

      pharmacies.forEach((pharmacy) => {
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
    <div id="map" style={{ width: '100%', height: '400px', marginBottom: '20px' }}></div>
  );
};

export default KakaoMap;

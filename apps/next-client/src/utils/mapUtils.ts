import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { ERROR_MESSAGES } from '@/constants/errors';

declare global {
  interface Window {
    kakao: typeof kakao;
    markers: kakao.maps.Marker[];
  }
}

// 지도 초기화 함수
export const initializeMap = (
  containerId: string,
  location: { lat: number; lng: number },
  onLoad: (map: kakao.maps.Map) => void
) => {
  if (!window.kakao || !window.kakao.maps) {
    console.error(ERROR_MESSAGES.KAKAO_MAP_ERROR);
    return;
  }

  window.kakao.maps.load(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Map container with id "${containerId}" not found`);
      return;
    }

    const options = { center: new window.kakao.maps.LatLng(location.lat, location.lng), level: 4 };
    const map = new window.kakao.maps.Map(container, options);

    onLoad(map);
  });
};

// 약국 마커 추가 함수
export const addMarkers = (
  map: kakao.maps.Map,
  pharmacies: PharmacyDTO[],
  onPharmacyClick: (pharmacy: PharmacyDTO) => void
): kakao.maps.Marker[] => {
  const markers: kakao.maps.Marker[] = [];

  pharmacies.forEach((pharmacy) => {
    const markerPosition = new kakao.maps.LatLng(pharmacy.wgs84Lat, pharmacy.wgs84Lon);
    const marker = new kakao.maps.Marker({ map, position: markerPosition, title: pharmacy.dutyName });

    const infoWindow = new kakao.maps.InfoWindow({
      content: `<div class='info_name'>${pharmacy.dutyName}</div>`,
    });

    kakao.maps.event.addListener(marker, 'mouseover', () => infoWindow.open(map, marker));
    kakao.maps.event.addListener(marker, 'mouseout', () => infoWindow.close());

    // 마커 클릭 시 약국 정보 전달
    kakao.maps.event.addListener(marker, 'click', () => onPharmacyClick(pharmacy));

    markers.push(marker);
  });

  return markers;
};
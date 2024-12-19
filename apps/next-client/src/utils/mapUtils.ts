import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { ERROR_MESSAGES } from '@/constants/errors';

// 지도 초기화 함수
export const initializeMap = (
  containerId: string,
  location: { lat: number; lng: number },
  onLoad: (map: kakao.maps.Map) => void
) => {
  if (!window.kakao?.maps) {
    console.error(ERROR_MESSAGES.KAKAO_MAP_ERROR);
    return;
  }

  // 카카오 지도 로드 
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
let currentOpenInfoWindow: kakao.maps.InfoWindow | null = null; 

export const addMarkers = (
  map: kakao.maps.Map,
  pharmacies: PharmacyDTO[],
  onPharmacyClick: (pharmacy: PharmacyDTO) => void
): kakao.maps.Marker[] => {
  const markers: kakao.maps.Marker[] = pharmacies.map((pharmacy) => {
    const markerPosition = new kakao.maps.LatLng(pharmacy.wgs84Lat, pharmacy.wgs84Lon);

    const markerImage = new kakao.maps.MarkerImage(
      '/images/marker.png',
      new kakao.maps.Size(29, 28),
      { offset: new kakao.maps.Point(12, 35) }
    );

    const marker = new kakao.maps.Marker({
      map,
      position: markerPosition,
      title: pharmacy.dutyName,
      image: markerImage,
    });

    const infoWindow = new kakao.maps.InfoWindow({
      content: `<div class='info_name'><p>${pharmacy.dutyName}</p></div>`,
    });

    kakao.maps.event.addListener(marker, 'click', () => {
      if (currentOpenInfoWindow) currentOpenInfoWindow.close();

      if (currentOpenInfoWindow === infoWindow) {
        currentOpenInfoWindow = null;
      } else {
        infoWindow.open(map, marker);
        currentOpenInfoWindow = infoWindow;
      }

      onPharmacyClick(pharmacy);
    });

    return marker;
  });

  return markers;
};
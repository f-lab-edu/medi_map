import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { ERROR_MESSAGES } from '@/constants/errors';

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
    const map = new window.kakao.maps.Map(container, options) as kakao.maps.Map;

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
  const markers: kakao.maps.Marker[] = [];

  pharmacies.forEach((pharmacy) => {
    const markerPosition = new kakao.maps.LatLng(pharmacy.wgs84Lat, pharmacy.wgs84Lon);

    const markerImageSrc = '/images/marker.png';
    const markerImageSize = new kakao.maps.Size(29, 28);
    const markerImageOption = { offset: new kakao.maps.Point(12, 35) };
    const markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption);

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
      if (currentOpenInfoWindow && currentOpenInfoWindow !== infoWindow) {
        currentOpenInfoWindow.close();
      }

      if (currentOpenInfoWindow === infoWindow) {
        infoWindow.close();
        currentOpenInfoWindow = null;
      } else {
        infoWindow.open(map, marker);
        currentOpenInfoWindow = infoWindow;
      }

      onPharmacyClick(pharmacy);
    });

    markers.push(marker);
  });

  return markers;
};
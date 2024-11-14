import { PharmacyDTO } from '@/dto/PharmacyDTO';

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
    console.error("Kakao Maps API is not loaded");
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
export const addMarkers = (map: kakao.maps.Map, pharmacies: PharmacyDTO[]) => {
  // 기존 마커 제거
  if (window.markers) {
    window.markers.forEach((marker) => marker.setMap(null));
  }
  window.markers = [];

  pharmacies.forEach((pharmacy) => {
    const markerPosition = new window.kakao.maps.LatLng(pharmacy.wgs84Lat, pharmacy.wgs84Lon);
    const marker = new window.kakao.maps.Marker({ map, position: markerPosition, title: pharmacy.dutyName });

    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `<div class='info_name'>${pharmacy.dutyName}</div>`,
    });

    window.kakao.maps.event.addListener(marker, 'mouseover', () => infoWindow.open(map, marker));
    window.kakao.maps.event.addListener(marker, 'mouseout', () => infoWindow.close());

    window.markers.push(marker);
  });
};

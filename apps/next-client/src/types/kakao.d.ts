declare global {
  interface Window {
    kakao: typeof kakao; 
    markers: kakao.maps.Marker[];
    currentOpenInfoWindow: kakao.maps.InfoWindow | null;
  }
}

declare namespace kakao.maps {
  // 지도 좌표 객체
  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  // 지도 옵션
  interface MapOptions {
    center: LatLng;
    level: number; 
  }

  // 지도 객체
  class Map {
    constructor(container: HTMLElement | null, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
    getCenter(): LatLng;
  }

  // 마커 옵션
  interface MarkerOptions {
    map: Map;
    position: LatLng;
    title?: string;
    image?: MarkerImage;
  }

  // 마커 객체
  class Marker {
    constructor(options: MarkerOptions);
    setPosition(position: LatLng): void;
    setMap(map: Map | null): void;
  }

  // 정보창 옵션
  interface InfoWindowOptions {
    content: string;
  }

  // 정보창 객체
  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
  }

  // 크기 객체
  class Size {
    constructor(width: number, height: number);
  }

  // 포인트 객체 (이미지의 기준점)
  class Point {
    constructor(x: number, y: number);
  }

  // 마커 이미지 옵션
  interface MarkerImageOptions {
    offset: Point;
  }

  // 마커 이미지 객체
  class MarkerImage {
    constructor(src: string, size: Size, options?: MarkerImageOptions);
  }

  // 이벤트 관련 네임스페이스
  namespace event {
    function addListener(
      target: Map | Marker | InfoWindow,
      type: string,
      callback: () => void
    ): void;
  }

  // 유틸리티 관련 네임스페이스
  namespace services {
    namespace Util {
      function getDistance(latlng1: LatLng, latlng2: LatLng): number;
    }
  }

  // 카카오 지도 API 로드 함수
  function load(callback: () => void): void;
}

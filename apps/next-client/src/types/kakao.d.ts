declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  class Map {
    constructor(container: HTMLElement | null, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
    getCenter(): LatLng; // 추가
  }

  interface MarkerOptions {
    map: Map;
    position: LatLng;
    title?: string;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setPosition(position: LatLng): void;
    setMap(map: Map | null): void;
  }

  interface InfoWindowOptions {
    content: string;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
  }

  interface CircleOptions {
    center: LatLng;
    radius: number;
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: 'solid' | 'shortdash' | 'shortdot' | 'shortdashdot' | 'shortdashdotdot' | 'dot' | 'dash' | 'dashdot' | 'longdash' | 'longdashdot' | 'longdashdotdot';
    fillColor?: string;
    fillOpacity?: number;
  }

  // Circle 클래스 추가
  class Circle {
    constructor(options: CircleOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
    getRadius(): number;
  }

  namespace event {
    function addListener(
      target: Map | Marker | InfoWindow,
      type: string,
      callback: () => void
    ): void;
  }

  namespace services {
    namespace Util {
      function getDistance(latlng1: LatLng, latlng2: LatLng): number;
    }
  }

  function load(callback: () => void): void;
}
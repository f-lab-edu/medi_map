declare global {
  interface Window {
    kakao: typeof kakao;
    markers: kakao.maps.Marker[];
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
    getCenter(): LatLng;
  }

  interface MarkerOptions {
    map: Map;
    position: LatLng;
    title?: string;
    image?: MarkerImage;
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

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  interface MarkerImageOptions {
    offset: Point;
  }

  class MarkerImage {
    constructor(src: string, size: Size, options?: MarkerImageOptions);
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
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  }
}

interface JwtToken {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT, JwtToken {} // JwtToken과 DefaultJWT 병합
}

declare global {
  interface Window {
    kakao: {
      maps: KakaoMaps;
    };
  }

  interface KakaoMaps {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (container: HTMLElement | null, options: KakaoMapOptions) => KakaoMap;
    Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
    InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
    event: {
      addListener: (target: KakaoEventTarget, type: string, handler: () => void) => void;
    };
    load: (callback: () => void) => void;
  }

  interface KakaoLatLng {
    getLat: () => number;
    getLng: () => number;
  }

  interface KakaoMapOptions {
    center: KakaoLatLng;
    level: number;
  }

  interface KakaoMap {
    setCenter: (latlng: KakaoLatLng) => void;
    setLevel: (level: number) => void;
  }

  interface KakaoMarkerOptions {
    map: KakaoMap;
    position: KakaoLatLng;
    title: string;
  }

  interface KakaoMarker {
    setMap: (map: KakaoMap | null) => void;
  }

  interface KakaoInfoWindowOptions {
    content: string;
  }

  interface KakaoInfoWindow {
    open: (map: KakaoMap, marker: KakaoMarker) => void;
    close: () => void;
  }

  type KakaoEventTarget = KakaoMap | KakaoMarker | KakaoInfoWindow;
}

export {};
"use client";

import React, { useEffect, useState } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import { PharmacyDataError, LocationError } from '@/error/PharmaciesError';
import { ERROR_MESSAGES } from '@/constants/errors';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import PharmacyTimeList from '@/components/PharmacyTimeList';

async function fetchPharmacies(lat: number, lng: number): Promise<PharmacyDTO[]> {
  const response = await fetch(`/api/pharmacy?lat=${lat}&lng=${lng}`);
  if (!response.ok) throw new PharmacyDataError();
  const data = await response.json();

  if (!Array.isArray(data.item)) throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
  return data.item;
}

// Kakao 지도 API를 로드하는 함수
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

// 약국 데이터로 지도에 마커를 초기화하는 함수
function initializeMap(containerId: string, pharmacies: PharmacyDTO[], location: { lat: number; lng: number }) {
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

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div class='info_name'>${pharmacy.dutyName}</div>`,
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
      window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
    });
  });
}

export default function PharmacyPage() {
  const [pharmacies, setPharmacies] = useState<PharmacyDTO[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 사용자 위치를 가져옴
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setError(new LocationError().message)
      );
    }
  }, []);

  // 위치 기반 약국 데이터를 가져옴
  useEffect(() => {
    if (location) {
      fetchPharmacies(location.lat, location.lng)
        .then((data) => {
          setPharmacies(data);
          setError(null);
        })
        .catch((error) => setError(error instanceof PharmacyDataError ? error.message : ERROR_MESSAGES.PHARMACY_DATA_ERROR));
    }
  }, [location]);

  // Kakao 지도 초기화
  useEffect(() => {
    loadKakaoMapScript(() => {
      if (pharmacies.length > 0 && location) {
        initializeMap('map', pharmacies, location);
      }
    });
  }, [pharmacies, location]);

  return (
    <div>
      <h2 className="title">약국 찾기</h2>
      <div id="map" style={{ width: '100%', height: '400px', marginBottom: '20px' }}></div>

      {error ? (
        <p className="error_message">{error}</p>
      ) : pharmacies.length > 0 ? (
        <ul>
          {pharmacies.map((pharmacy, index) => (
            <li key={index}>
              <h2>{pharmacy.dutyName.trim()}</h2>
              <p>주소: {pharmacy.dutyAddr}</p>
              <p>전화번호: {pharmacy.dutyTel1}</p>
              <PharmacyTimeList pharmacy={pharmacy} />
            </li>
          ))}
        </ul>
      ) : (
        <p>로딩중...</p>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import { PharmacyDataError, LocationError } from '@/error/PharmaciesError';
import { ERROR_MESSAGES } from '@/constants/errors';

interface Pharmacy {
  dutyName: string;
  dutyAddr: string;
  dutyTel1: string;
  dutyTime1s?: string;
  dutyTime1c?: string;
  dutyTime2s?: string;
  dutyTime2c?: string;
  dutyTime3s?: string;
  dutyTime3c?: string;
  dutyTime4s?: string;
  dutyTime4c?: string;
  dutyTime5s?: string;
  dutyTime5c?: string;
  dutyTime6s?: string;
  dutyTime6c?: string;
  dutyTime7s?: string;
  dutyTime7c?: string;
  wgs84Lat: number;
  wgs84Lon: number;
  [key: string]: string | number | undefined;
}

const days = [
  { name: '월요일', start: 'dutyTime1s', close: 'dutyTime1c' },
  { name: '화요일', start: 'dutyTime2s', close: 'dutyTime2c' },
  { name: '수요일', start: 'dutyTime3s', close: 'dutyTime3c' },
  { name: '목요일', start: 'dutyTime4s', close: 'dutyTime4c' },
  { name: '금요일', start: 'dutyTime5s', close: 'dutyTime5c' },
  { name: '토요일', start: 'dutyTime6s', close: 'dutyTime6c' },
  { name: '일요일', start: 'dutyTime7s', close: 'dutyTime7c' },
];

function formatTime(time: string | number): string {
  const timeStr = time.toString().padStart(4, '0');
  return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
}

async function fetchPharmacies(lat: number, lng: number): Promise<Pharmacy[]> {
  const response = await fetch(`/api/pharmacies?lat=${lat}&lng=${lng}`);
  if (!response.ok) throw new PharmacyDataError();
  const data = await response.json();
  if (!Array.isArray(data?.item)) throw new PharmacyDataError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
  return data.item;
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

function initializeMap(containerId: string, pharmacies: Pharmacy[], location: { lat: number; lng: number }) {
  window.kakao.maps.load(() => {
    const container = document.getElementById(containerId);
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
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setError(new LocationError().message)
      );
    }
  }, []);

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
              <div>
                <strong>영업 시간:</strong>
                <ul>
                  {days.map((day) => {
                    const openTime = pharmacy[day.start];
                    const closeTime = pharmacy[day.close];
                    return openTime && closeTime ? (
                      <li key={day.name}>
                        {day.name}: {formatTime(openTime)} - {formatTime(closeTime)}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>로딩중...</p>
      )}
    </div>
  );
}
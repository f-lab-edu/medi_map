"use client";

import React, { useEffect, useState } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import { LocationError } from '@/error/PharmaciesError';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import PharmacyTimeList from '@/components/PharmacyTimeList';
import KakaoMap from '@/components/KakaoMap';
import { usePharmacy } from '@/hooks/usePharmacy';

export default function PharmacyPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // 사용자 위치를 가져옴
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setLocationError(new LocationError().message)
      );
    }
  }, []);

  // 커스텀 훅을 사용하여 약국 데이터 로드
  const { pharmacies, error: pharmacyError, loading } = usePharmacy(location);

  return (
    <div>
      <h2 className="title">약국 찾기</h2>
      <KakaoMap pharmacies={pharmacies} location={location} />

      {locationError ? (
        <p className="error_message">{locationError}</p>
      ) : pharmacyError ? (
        <p className="error_message">{pharmacyError}</p>
      ) : loading ? (
        <p>로딩중...</p>
      ) : (
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
      )}
    </div>
  );
}

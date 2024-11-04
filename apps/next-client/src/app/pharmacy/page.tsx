"use client";

import React from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { usePharmacy } from '@/hooks/usePharmacy';
import PharmacyTimeList from '@/components/PharmacyTimeList';
import KakaoMap from '@/components/KakaoMap';

export default function PharmacyPage() {
  const { location, locationError } = useGeoLocation();
  const { pharmacies, loading, error: pharmacyError } = usePharmacy(location);

  const renderContent = () => {
    if (locationError) return <p className="error_message">{locationError.message}</p>;
    if (pharmacyError) return <p className="error_message">{pharmacyError}</p>;
    if (loading) return <p>로딩중...</p>;
    if (pharmacies.length === 0) return <p>주변에 약국이 없습니다.</p>;

    return (
      <ul className="pharmacies_desc">
        {pharmacies.map((pharmacy) => (
          <li key={pharmacy.id}> 
            <h2>{pharmacy.dutyName.trim()}</h2>
            <p>주소: {pharmacy.dutyAddr}</p>
            <p>전화번호: {pharmacy.dutyTel1}</p>
            <PharmacyTimeList pharmacy={pharmacy} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className='pharmacy_cont'>
      <h2 className="title">약국 찾기</h2>
      <KakaoMap pharmacies={pharmacies} location={location} />
      {renderContent()}
    </div>
  );
}

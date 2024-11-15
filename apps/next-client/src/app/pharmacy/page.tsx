"use client";

import React, { useEffect, useState, useCallback } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import useGeoLocation from '@/hooks/useGeoLocation';
import { usePharmacy } from '@/hooks/usePharmacy';
import PharmacyTimeList from '@/components/pharmacy/PharmacyTimeList';
import KakaoMap from '@/components/pharmacy/KakaoMap';
import PharmacyDetails from '@/components/pharmacy/PharmacyDetails';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { ERROR_MESSAGES } from '@/constants/errors';

export default function PharmacyPage() {
  const { location, locationError } = useGeoLocation();
  const { pharmacies, setPharmacies, loading, error: pharmacyError, setLoading, setError } = usePharmacy();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyDTO | null>(null);

  // 약국 검색 함수
  const handleSearch = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pharmacy?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setPharmacies(data);
    } catch {
      setError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
    }
    setLoading(false);
  }, [setLoading, setPharmacies, setError]);

  // 약국 클릭 핸들러
  const handlePharmacyClick = (pharmacy: PharmacyDTO) => {
    setSelectedPharmacy(pharmacy);
  };

  // 위치 정보가 변경될 때 검색 실행
  useEffect(() => {
    if (location) {
      handleSearch(location.lat, location.lng);
    }
  }, [location, handleSearch]);

  // UI 렌더링 로직
  const renderContent = () => {
    switch (true) {
      case !!locationError:
        return <p className="error_message">{locationError.message}</p>;
      case !!pharmacyError:
        return <p className="error_message">{pharmacyError}</p>;
      case loading:
        return <p>로딩중...</p>;
      case pharmacies.length === 0:
        return <p>주변에 약국이 없습니다.</p>;
      default:
        return (
          <div className="pharmacies_box">
            <ul className="pharmacies_desc">
              {pharmacies.map((pharmacy) => (
                <li key={pharmacy.hpid} onClick={() => handlePharmacyClick(pharmacy)}>
                  <h2>{pharmacy.dutyName.trim()}</h2>
                  <p className="address">{pharmacy.dutyAddr}</p>
                  <PharmacyTimeList pharmacy={pharmacy} />
                  <p className="phone_number">{pharmacy.dutyTel1}</p>
                </li>
              ))}
            </ul>
            {selectedPharmacy && (
              <PharmacyDetails
                pharmacy={selectedPharmacy}
                onClose={() => setSelectedPharmacy(null)}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="pharmacy_cont">
      <KakaoMap
        pharmacies={pharmacies}
        location={location}
        onSearch={handleSearch}
        onPharmacyClick={handlePharmacyClick}
      />
      {renderContent()}
    </div>
  );
}
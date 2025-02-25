'use client';

import React, { useState, useCallback, useEffect } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import useGeoLocation from '@/hooks/useGeoLocation';
import PharmacyTimeList from '@/components/pharmacy/PharmacyTimeList';
import KakaoMap from '@/components/pharmacy/KakaoMap';
import PharmacyDetails from '@/components/pharmacy/PharmacyDetails';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { usePharmacies } from '@/hooks/queries/usePharmacies';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PharmacyPage() {
  const { location: initialLocation, locationError } = useGeoLocation();
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  useEffect(() => {
    if (initialLocation) {
      setSearchLocation(initialLocation);
    }
  }, [initialLocation]);

  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyDTO | null>(null);

  const { 
    data: pharmacies = [], 
    error: pharmacyError, 
    isLoading,
  } = usePharmacies(searchLocation?.lat, searchLocation?.lng);

  const handlePharmacyClick = useCallback((pharmacy: PharmacyDTO) => {
    setSelectedPharmacy(pharmacy);
  }, []);

  const handleSearch = useCallback((lat: number, lng: number) => {
    setSearchLocation({ lat, lng });
  }, []);

  const renderContent = () => {
    if (locationError) {
      return <p className="error_message">{locationError.message}</p>;
    }

    if (pharmacyError) {
      return (
        <p className="error_message">
          {pharmacyError instanceof Error
            ? pharmacyError.message
            : '약국 정보를 가져오는 중 오류가 발생했습니다.'}
        </p>
      );
    }

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!Array.isArray(pharmacies) || pharmacies.length === 0) {
      return <p>주변에 약국이 없습니다.</p>;
    }

    return (
      <div className="pharmacies_box">
        <div className='pharmacies_desc'>
          <p className="pharmacies_count">
            총 <span>{pharmacies.length}</span>개의 약국이 검색되었습니다🍀
          </p>
          <ul className="pharmacies_list">
            {pharmacies.map((pharmacy, index) => (
              <li
                key={`${pharmacy.hpid}-${index}`}
                onClick={() => handlePharmacyClick(pharmacy)}
              >
                <h2>{pharmacy.dutyName.trim()}</h2>
                <p className="address">{pharmacy.dutyAddr}</p>
                <PharmacyTimeList pharmacy={pharmacy} />
                <p className="phone_number">{pharmacy.dutyTel1}</p>
              </li>
            ))}
          </ul>
        </div>

        {selectedPharmacy && (
          <PharmacyDetails
            pharmacy={selectedPharmacy}
            onClose={() => setSelectedPharmacy(null)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="pharmacy_cont">
      <KakaoMap
        pharmacies={pharmacies}
        location={searchLocation}
        onSearch={handleSearch}
        onPharmacyClick={handlePharmacyClick}
      />
      {renderContent()}
    </div>
  );
}
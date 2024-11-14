import React, { useEffect, useCallback } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import useGeoLocation from '@/hooks/useGeoLocation';
import { usePharmacy } from '@/hooks/usePharmacy';
import PharmacyTimeList from '@/components/PharmacyTimeList';
import KakaoMap from '@/components/KakaoMap';

export default function PharmacyPage() {
  const { location, locationError } = useGeoLocation();
  const { pharmacies, setPharmacies, loading, error: pharmacyError, setLoading, setError } = usePharmacy();

  const handleSearch = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pharmacy?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setPharmacies(data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setError('약국 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPharmacies, setError]);

  useEffect(() => {
    if (location) {
      handleSearch(location.lat, location.lng);
    }
  }, [location, handleSearch]);

  const renderContent = () => {
    if (locationError) return <p className="error_message">{locationError.message}</p>;
    if (pharmacyError) return <p className="error_message">{pharmacyError}</p>;
    if (loading) return <p>로딩중...</p>;
    if (pharmacies.length === 0) return <p>주변에 약국이 없습니다.</p>;

    return (
      <ul className="pharmacies_desc">
        {pharmacies.map((pharmacy) => (
          <li key={pharmacy.hpid}>
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
      <KakaoMap pharmacies={pharmacies} location={location} onSearch={handleSearch} />
      {renderContent()}
    </div>
  );
}
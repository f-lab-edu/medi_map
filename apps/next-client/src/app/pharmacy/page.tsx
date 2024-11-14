// src/pages/pharmacy/index.tsx

"use client";

import React, { useEffect, useState, useCallback } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import useGeoLocation from '@/hooks/useGeoLocation';
import { usePharmacy } from '@/hooks/usePharmacy';
import PharmacyTimeList from '@/components/PharmacyTimeList';
import KakaoMap from '@/components/KakaoMap';
import { PharmacyDTO } from '@/dto/PharmacyDTO';

export default function PharmacyPage() {
  const { location, locationError } = useGeoLocation();
  const { pharmacies, setPharmacies, loading, error: pharmacyError, setLoading, setError } = usePharmacy();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyDTO | null>(null);

  const handleSearch = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pharmacy?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      console.log("Pharmacies loaded:", data); // 각 약국의 hpid 확인
      setPharmacies(data);
    } catch (error) {
      setError('약국 데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPharmacies, setError]);

  const handlePharmacyClick = (pharmacy: PharmacyDTO) => {
    console.log("Pharmacy clicked:", pharmacy);
    setSelectedPharmacy(pharmacy); // 클릭한 약국을 선택
  };

  useEffect(() => {
    if (location) {
      handleSearch(location.lat, location.lng);
    }
  }, [location]);

  const renderContent = () => {
    if (locationError) return <p className="error_message">{locationError.message}</p>;
    if (pharmacyError) return <p className="error_message">{pharmacyError}</p>;
    if (loading) return <p>로딩중...</p>;
    if (pharmacies.length === 0) return <p>주변에 약국이 없습니다.</p>;

    return (
      <div className='pharmacies_box'>
        <ul className="pharmacies_desc">
          {pharmacies.map((pharmacy) => (
            <li key={pharmacy.hpid} onClick={() => handlePharmacyClick(pharmacy)}>
              <h2>{pharmacy.dutyName.trim()}</h2>
              <p className='address'>{pharmacy.dutyAddr}</p>
              <PharmacyTimeList pharmacy={pharmacy} />
              <p className='phone_number'>{pharmacy.dutyTel1}</p>
            </li>
          ))}
        </ul>
        {selectedPharmacy && (
          <div className="pharmacies_desc">
            <h3>약국 상세</h3>
            <button onClick={() => setSelectedPharmacy(null)}>닫기</button>
            <div className="pharm_modal_wrap">
              <div className="pharm_name_wrap">
                <p className="pharm_name">{selectedPharmacy.dutyName.trim()}</p>
              </div>
              <div className="pharm_info">
                <div className="open">
                  <span>영업중</span>
                  <div className="no_dot">
                    <span className="time">{selectedPharmacy.dutyTime1s} ~ {selectedPharmacy.dutyTime1c}</span>
                  </div>
                </div>
                <div className="address">
                  <span className="sub">{selectedPharmacy.dutyAddr}</span>
                </div>
                <div className="number">
                  <div className="phone">
                    <span className="title">전화번호</span>
                    <span className="sub">{selectedPharmacy.dutyTel1}</span>
                  </div>
                </div>
              </div>
              <div className="time_table">
                <p className="time_table_title">평일 운영시간</p>
                <div className="time_table_wrap">
                  <table>
                    <tbody>
                      <tr><td className="day">월요일</td><td>{selectedPharmacy.dutyTime1s || '미등록'} - {selectedPharmacy.dutyTime1c || '미등록'}</td></tr>
                      <tr><td className="day">화요일</td><td>{selectedPharmacy.dutyTime2s || '미등록'} - {selectedPharmacy.dutyTime2c || '미등록'}</td></tr>
                      <tr><td className="day">수요일</td><td>{selectedPharmacy.dutyTime3s || '미등록'} - {selectedPharmacy.dutyTime3c || '미등록'}</td></tr>
                      <tr><td className="day">목요일</td><td>{selectedPharmacy.dutyTime4s || '미등록'} - {selectedPharmacy.dutyTime4c || '미등록'}</td></tr>
                      <tr><td className="day">금요일</td><td>{selectedPharmacy.dutyTime5s || '미등록'} - {selectedPharmacy.dutyTime5c || '미등록'}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="time_table">
                <p className="time_table_title">주말 운영시간</p>
                <div className="time_table_wrap">
                  <table>
                    <tbody>
                      <tr><td className="day">토요일</td><td>{selectedPharmacy.dutyTime6s || '정기휴무'} - {selectedPharmacy.dutyTime6c || '정기휴무'}</td></tr>
                      <tr><td className="day">일요일</td><td>{selectedPharmacy.dutyTime7s || '정기휴무'} - {selectedPharmacy.dutyTime7c || '정기휴무'}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='pharmacy_cont'>
      <KakaoMap pharmacies={pharmacies} location={location} onSearch={handleSearch} />
      {renderContent()}
    </div>
  );
}

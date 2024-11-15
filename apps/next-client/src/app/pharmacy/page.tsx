"use client";

import React, { useEffect, useState, useCallback } from 'react';
import '@/styles/pages/pharmacy/pharmacy.scss';
import useGeoLocation from '@/hooks/useGeoLocation';
import { usePharmacy } from '@/hooks/usePharmacy';
import PharmacyTimeList from '@/components/PharmacyTimeList';
import KakaoMap from '@/components/KakaoMap';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { getWeeklyOperatingHours, getTodayOperatingHours, isPharmacyOpenNowToday } from '@/utils/pharmacyUtils';
import { ERROR_MESSAGES } from '@/constants/errors';

export default function PharmacyPage() {
  const { location, locationError } = useGeoLocation();
  const { pharmacies, setPharmacies, loading, error: pharmacyError, setLoading, setError } = usePharmacy();
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyDTO | null>(null);

  const handleSearch = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pharmacy?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setPharmacies(data);
    } catch (error) {
      setError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPharmacies, setError]);

  const handlePharmacyClick = (pharmacy: PharmacyDTO) => {
    setSelectedPharmacy(pharmacy);
  };

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
                <div className={`open ${isPharmacyOpenNowToday(selectedPharmacy) ? 'status-open' : 'status-closed'}`}>
                  <span className={isPharmacyOpenNowToday(selectedPharmacy) ? 'text-open' : 'text-closed'}>
                    {isPharmacyOpenNowToday(selectedPharmacy) ? "영업중" : "미영업"}
                  </span>
                  <div className="no_dot">
                    <span className="time">
                      {getTodayOperatingHours(selectedPharmacy).openTime} ~ {getTodayOperatingHours(selectedPharmacy).closeTime}
                    </span>
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
                      {getWeeklyOperatingHours(selectedPharmacy).map((day) => (
                        <tr key={day.day}>
                          <td className="day">{day.day}</td>
                          <td>{day.openTime || '휴무'} - {day.closeTime || '휴무'}</td>
                        </tr>
                      ))}
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
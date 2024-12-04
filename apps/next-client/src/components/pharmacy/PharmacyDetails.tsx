import React from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { getTodayOperatingHours, getWeeklyOperatingHours, isPharmacyOpenNowToday } from '@/utils/pharmacyUtils';

interface PharmacyDetailsProps {
  pharmacy: PharmacyDTO;
  onClose: () => void;
}

const PharmacyDetails: React.FC<PharmacyDetailsProps> = ({ pharmacy, onClose }) => {
  const isOpen = isPharmacyOpenNowToday(pharmacy);
  const todayHours = getTodayOperatingHours(pharmacy);
  const weeklyHours = getWeeklyOperatingHours(pharmacy);

  return (
    <div className="pharmacies_desc">
      <h3>약국 상세</h3>
      <button onClick={onClose}>닫기</button>
      <div className="pharm_modal_wrap">
        <div className="pharm_name_wrap">
          <p className="pharm_name">{pharmacy.dutyName.trim()}</p>
        </div>
        <div className="pharm_info">
          <div className={`open ${isOpen ? 'status-open' : 'status-closed'}`}>
            <span className={isOpen ? 'text-open' : 'text-closed'}>
              {isOpen ? '영업중' : '미영업'}
            </span>
            <div className="no_dot">
              <span className="time">
                {todayHours.openTime} ~ {todayHours.closeTime}
              </span>
            </div>
          </div>
          <div className="address">
            <span className="sub">{pharmacy.dutyAddr}</span>
          </div>
          <div className="number">
            <div className="phone">
              <span className="title">전화번호</span>
              <span className="sub">{pharmacy.dutyTel1}</span>
            </div>
          </div>
        </div>
        <div className="time_table">
          <p className="time_table_title">평일 운영시간</p>
          <div className="time_table_wrap">
            <table>
              <tbody>
                {weeklyHours.map((day) => (
                  <tr key={day.day}>
                    <td className="day">{day.day}</td>
                    <td>
                      {day.openTime || '휴무'} - {day.closeTime || '휴무'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetails;
import React from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { getTodayOperatingHours, isPharmacyOpenNowToday } from '@/utils/pharmacyUtils';

interface PharmacyTimeListProps {
  pharmacy: PharmacyDTO;
}

const PharmacyTimeList: React.FC<PharmacyTimeListProps> = ({ pharmacy }) => {
  const { openTime, closeTime } = getTodayOperatingHours(pharmacy);
  const isOpen = isPharmacyOpenNowToday(pharmacy);

  return (
    <div className={`pharmacy_time_list ${isOpen ? 'open' : 'closed'}`}>
      <p>
        <span className={isOpen ? 'status_open' : 'status_closed'}>
          {isOpen ? "영업중" : "미영업"}
        </span>
        {openTime} ~ {closeTime}
      </p>
    </div>
  );
};

export default PharmacyTimeList;
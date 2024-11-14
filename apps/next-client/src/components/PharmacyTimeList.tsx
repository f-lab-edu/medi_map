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
    <div className="pharmacy_time_list">
      <p>
        {isOpen ? "영업중" : "미영업"} {openTime} ~ {closeTime}
      </p>
    </div>
  );
};

export default PharmacyTimeList;
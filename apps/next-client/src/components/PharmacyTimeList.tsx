import React from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { getWeeklyOperatingHours } from '@/utils/pharmacyUtils';

interface PharmacyTimeListProps {
  pharmacy: PharmacyDTO;
}

const PharmacyTimeList: React.FC<PharmacyTimeListProps> = ({ pharmacy }) => {
  const weeklyHours = getWeeklyOperatingHours(pharmacy);

  return (
    <div>
      <strong>영업 시간:</strong>
      <ul>
        {weeklyHours.map((day) => (
          <li key={day.day}>
            {day.day}: {day.openTime && day.closeTime ? `${day.openTime} - ${day.closeTime}` : '휴무'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PharmacyTimeList;
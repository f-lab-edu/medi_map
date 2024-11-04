import React from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';

// 요일별 영업 시간 데이터
const days = [
  { name: '월요일', start: 'dutyTime1s', close: 'dutyTime1c' },
  { name: '화요일', start: 'dutyTime2s', close: 'dutyTime2c' },
  { name: '수요일', start: 'dutyTime3s', close: 'dutyTime3c' },
  { name: '목요일', start: 'dutyTime4s', close: 'dutyTime4c' },
  { name: '금요일', start: 'dutyTime5s', close: 'dutyTime5c' },
  { name: '토요일', start: 'dutyTime6s', close: 'dutyTime6c' },
  { name: '일요일', start: 'dutyTime7s', close: 'dutyTime7c' },
];

// 시간을 "HH:MM" 형식으로 포맷
function formatTime(time: string | number): string {
  const timeStr = time.toString().padStart(4, '0');
  return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
}

interface PharmacyTimeListProps {
  pharmacy: PharmacyDTO;
}

const PharmacyTimeList: React.FC<PharmacyTimeListProps> = ({ pharmacy }) => {
  return (
    <div>
      <strong>영업 시간:</strong>
      <ul>
        {days.map((day) => {
          const openTime = pharmacy[day.start];
          const closeTime = pharmacy[day.close];
          return openTime && closeTime ? (
            <li key={day.name}>
              {day.name}: {formatTime(openTime)} - {formatTime(closeTime)}
            </li>
          ) : (
            <li key={day.name}>{day.name}: 휴무</li>
          );
        })}
      </ul>
    </div>
  );
};

export default PharmacyTimeList;
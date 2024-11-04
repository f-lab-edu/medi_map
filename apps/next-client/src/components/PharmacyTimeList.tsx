import React from 'react';
import { PharmacyDTO } from '@/dto/PharmacyDTO';

const days = [
  { name: '월요일', start: 'dutyTime1s', close: 'dutyTime1c' },
  { name: '화요일', start: 'dutyTime2s', close: 'dutyTime2c' },
  { name: '수요일', start: 'dutyTime3s', close: 'dutyTime3c' },
  { name: '목요일', start: 'dutyTime4s', close: 'dutyTime4c' },
  { name: '금요일', start: 'dutyTime5s', close: 'dutyTime5c' },
  { name: '토요일', start: 'dutyTime6s', close: 'dutyTime6c' },
  { name: '일요일', start: 'dutyTime7s', close: 'dutyTime7c' },
];

function formatTime(time: string | number): string {
  const timeStr = time.toString().padStart(4, '0');
  return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
}

export function PharmacyTimeList({ pharmacy }: { pharmacy: PharmacyDTO }) {
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
          ) : null;
        })}
      </ul>
    </div>
  );
}

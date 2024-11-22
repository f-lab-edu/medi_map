import { PharmacyDTO } from '@/dto/PharmacyDTO';
import { TEXTS } from '@/constants/common';

// 요일별 데이터 (일요일 시작)
const DAYS_OF_WEEK = [
  { name: '일요일', start: 'dutyTime7s', close: 'dutyTime7c' },
  { name: '월요일', start: 'dutyTime1s', close: 'dutyTime1c' },
  { name: '화요일', start: 'dutyTime2s', close: 'dutyTime2c' },
  { name: '수요일', start: 'dutyTime3s', close: 'dutyTime3c' },
  { name: '목요일', start: 'dutyTime4s', close: 'dutyTime4c' },
  { name: '금요일', start: 'dutyTime5s', close: 'dutyTime5c' },
  { name: '토요일', start: 'dutyTime6s', close: 'dutyTime6c' },
];

// 시간 형식을 "09:00" 또는 "19:00" 형태로 변환
export function formatTime(time: string | number | undefined): string {
  if (!time) return TEXTS.CLOSED;
  const timeStr = time.toString().padStart(4, '0');
  return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
}

// 요일별 영업 시간 가져오기
export function getWeeklyOperatingHours(pharmacy: PharmacyDTO) {
  return DAYS_OF_WEEK.map((day) => {
    const openTime = pharmacy[day.start];
    const closeTime = pharmacy[day.close];
    return {
      day: day.name,
      openTime: openTime ? formatTime(openTime) : TEXTS.CLOSED,
      closeTime: closeTime ? formatTime(closeTime) : TEXTS.CLOSED,
    };
  });
}

// 오늘의 영업 시간 가져오기
export function getTodayOperatingHours(pharmacy: PharmacyDTO) {
  const todayIndex = new Date().getDay();
  const dayInfo = DAYS_OF_WEEK[todayIndex];
  const openTime = pharmacy[dayInfo.start];
  const closeTime = pharmacy[dayInfo.close];
  return {
    openTime: openTime ? formatTime(openTime) : TEXTS.CLOSED,
    closeTime: closeTime ? formatTime(closeTime) : TEXTS.CLOSED,
  };
}

// 오늘 영업 중인지 확인하기
export function isPharmacyOpenNowToday(pharmacy: PharmacyDTO): boolean {
  const { openTime, closeTime } = getTodayOperatingHours(pharmacy);
  if (openTime === TEXTS.CLOSED || closeTime === TEXTS.CLOSED) return false;

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentTime = currentHour * 100 + currentMinute;

  const open = parseInt(pharmacy[DAYS_OF_WEEK[new Date().getDay()].start] as string || '0000', 10);
  const close = parseInt(pharmacy[DAYS_OF_WEEK[new Date().getDay()].close] as string || '2400', 10);  

  return close < open
    ? currentTime >= open || currentTime < close
    : currentTime >= open && currentTime < close;
}
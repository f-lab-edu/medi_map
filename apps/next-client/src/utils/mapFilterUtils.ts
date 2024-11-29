import { PharmacyDTO } from '@/dto/PharmacyDTO';

export type FilterType = 'ALL' | 'OPEN_NOW' | 'NIGHT_PHARMACY';

// 현재 시간을 HHMM 형식으로 반환
export const getCurrentTime = (): number => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  return currentHour * 100 + currentMinute;
};

// 현재 시간 기준으로 약국이 영업 중인지 확인
export const isPharmacyOpenNow = (pharmacy: PharmacyDTO, currentTime: number): boolean => {
  const openTime = parseInt(pharmacy.dutyTime1s || '0000', 10);
  const closeTime = parseInt(pharmacy.dutyTime1c || '2400', 10);

  // 영업 시간이 없으면 휴무로 간주
  if (!openTime || !closeTime) {
    return false;
  }

  return closeTime < openTime
    ? currentTime >= openTime || currentTime < closeTime
    : currentTime >= openTime && currentTime < closeTime;
};

// 약국이 심야 시간대에 영업하는지 확인
export const isNightPharmacy = (pharmacy: PharmacyDTO): boolean => {
  const openTime = pharmacy.dutyTime1s;
  const closeTime = pharmacy.dutyTime1c;

  // 영업 시간이 없으면 휴무로 간주
  if (!openTime || !closeTime) {
    return false;
  }

  const parsedCloseTime = parseInt(closeTime, 10);
  return parsedCloseTime >= 2400 || parsedCloseTime < 600;
};

// 약국 목록 필터링
export const applyFilter = (pharmacies: PharmacyDTO[], filter: FilterType): PharmacyDTO[] => {
  const currentTime = getCurrentTime();

  switch (filter) {
    case 'OPEN_NOW':
      return pharmacies.filter(pharmacy => isPharmacyOpenNow(pharmacy, currentTime));
    case 'NIGHT_PHARMACY':
      return pharmacies.filter(pharmacy => isNightPharmacy(pharmacy));
    case 'ALL':
    default:
      return pharmacies;
  }
};
export interface PharmacyDTO {
  dutyName: string;       // 약국 이름
  dutyAddr: string;       // 약국 주소
  dutyTel1: string;       // 약국 전화번호
  dutyTime1s?: string;    // 월요일 영업 시작 시간
  dutyTime1c?: string;    // 월요일 영업 종료 시간
  dutyTime2s?: string;    // 화요일 영업 시작 시간
  dutyTime2c?: string;    // 화요일 영업 종료 시간
  dutyTime3s?: string;    // 수요일 영업 시작 시간
  dutyTime3c?: string;    // 수요일 영업 종료 시간
  dutyTime4s?: string;    // 목요일 영업 시작 시간
  dutyTime4c?: string;    // 목요일 영업 종료 시간
  dutyTime5s?: string;    // 금요일 영업 시작 시간
  dutyTime5c?: string;    // 금요일 영업 종료 시간
  dutyTime6s?: string;    // 토요일 영업 시작 시간
  dutyTime6c?: string;    // 토요일 영업 종료 시간
  dutyTime7s?: string;    // 일요일 영업 시작 시간
  dutyTime7c?: string;    // 일요일 영업 종료 시간
  wgs84Lat: number;       // 약국의 위도 좌표
  wgs84Lon: number;       // 약국의 경도 좌표
  [key: string]: string | number | undefined; // 기타 필드 (옵셔널)
}
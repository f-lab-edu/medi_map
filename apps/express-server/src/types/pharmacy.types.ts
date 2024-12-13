export interface PharmacyAPIItem {
  id: number; // 약국 고유 ID
  dutyName: string; // 약국 이름 (API 응답 이름)
  dutyAddr: string; // 약국 주소
  dutyTel1?: string; // 약국 전화번호
  wgs84Lat: number; // 위도
  wgs84Lon: number; // 경도
  dutyTime1s?: string; // 월요일 영업 시작 시간
  dutyTime1c?: string; // 월요일 영업 종료 시간
  dutyTime2s?: string; // 화요일 영업 시작 시간
  dutyTime2c?: string; // 화요일 영업 종료 시간
  dutyTime3s?: string; // 수요일 영업 시작 시간
  dutyTime3c?: string; // 수요일 영업 종료 시간
  dutyTime4s?: string; // 목요일 영업 시작 시간
  dutyTime4c?: string; // 목요일 영업 종료 시간
  dutyTime5s?: string; // 금요일 영업 시작 시간
  dutyTime5c?: string; // 금요일 영업 종료 시간
  dutyTime6s?: string; // 토요일 영업 시작 시간
  dutyTime6c?: string; // 토요일 영업 종료 시간
  dutyTime7s?: string; // 일요일 영업 시작 시간
  dutyTime7c?: string; // 일요일 영업 종료 시간
  hpid?: string; // 약국 고유 식별자
}

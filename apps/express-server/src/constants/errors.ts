export const ERROR_MESSAGES = {
  DATABASE_ERROR: '데이터베이스 오류가 발생했습니다.',
  UPDATE_ERROR: '데이터 업데이트 중 오류가 발생했습니다.',
  API_ERROR: 'API 요청 중 오류가 발생했습니다.',
  DATA_PARSING_ERROR: '데이터 파싱 중 오류가 발생했습니다.',
  VALIDATION_ERROR: '요청한 데이터가 유효하지 않습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  AUTHENTICATION_ERROR: '인증에 실패했습니다.',

  PHARMACY: {
    PHARMACY_DATA_ERROR: '약국 데이터를 불러오는 중 오류가 발생했습니다.',
    VALIDATION_ERROR: '위도와 경도가 필요합니다.',
  },

  MEDICINE: {
    SYNC_MEDICINE_ERROR: '의약품 데이터를 동기화하는 중 오류가 발생했습니다.',
    SYNC_APPROVALS_ERROR: '의약품 상세 데이터를 동기화하는 중 오류가 발생했습니다.',
    FETCH_JOINED_MEDICINES_ERROR: '의약품 기본 정보와 상세 정보를 조회하는 중 오류가 발생했습니다.',
    FETCH_ALL_MEDICINES_ERROR: '모든 의약품 데이터를 페이지네이션 방식으로 조회하는 중 오류가 발생했습니다.',
  }
};

export const SEARCH_ERROR_MESSAGES = {
  API_KEY_MISSING: 'API 키가 설정되지 않았습니다.',
  API_RESPONSE_PARSING_ERROR: 'API 응답을 파싱하는 중 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  MISSING_SEARCH_TERM: '검색어를 입력해 주세요.',
  NO_MEDICINE_FOUND: '약물 정보를 불러오는 데 실패했습니다.',
  SHORT_SEARCH_TERM: '검색어를 2자 이상 입력하거나 필터를 선택해주세요.',
  API_REQUEST_ERROR: 'API 요청 중 오류가 발생했습니다.',
  NO_RESULTS_FOUND: '찾으시는 약물 정보가 없습니다.',
  XML_PARSING_ERROR: 'XML 데이터를 파싱하는 중 오류가 발생했습니다.',
  INVALID_DOC_DATA_FORMAT: '유효하지 않은 docData 형식입니다.',
  SERVER_ERROR: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  CLIENT_ERROR: '잘못된 요청입니다. 다시 시도해주세요.',
}as const;
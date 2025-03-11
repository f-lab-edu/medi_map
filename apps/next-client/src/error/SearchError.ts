import { SEARCH_ERROR_MESSAGES } from '@/constants/searchErrors';

// API 키 누락 에러
export class ApiKeyMissingError extends Error {
  constructor(message: string = SEARCH_ERROR_MESSAGES.API_KEY_MISSING) {
    super(message);
    this.name = 'ApiKeyMissingError';
  }
}

// API 요청 실패 에러
export class ApiRequestError extends Error {
  constructor(message: string = SEARCH_ERROR_MESSAGES.API_REQUEST_ERROR) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// API 응답 파싱 에러
export class ApiResponseParsingError extends Error {
  constructor(message: string = SEARCH_ERROR_MESSAGES.API_RESPONSE_PARSING_ERROR) {
    super(message);
    this.name = 'ApiResponseParsingError';
  }
}

// 검색어가 너무 짧을 때 에러
export class ShortSearchTermError extends Error {
  constructor(message: string = SEARCH_ERROR_MESSAGES.SHORT_SEARCH_TERM) {
    super(message);
    this.name = 'ShortSearchTermError';
  }
}

// 검색 결과가 없을 때 에러
export class NoResultsError extends Error {
  constructor(message: string = SEARCH_ERROR_MESSAGES.NO_RESULTS_FOUND) {
    super(message);
    this.name = 'NoResultsError';
  }
}
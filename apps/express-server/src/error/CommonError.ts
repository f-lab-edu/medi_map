import { ERROR_MESSAGES } from '@/constants/errors';

export class ValidationError extends Error {
  public statusCode: number;

  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class DatabaseError extends Error {
  public statusCode: number;

  constructor(message = ERROR_MESSAGES.DATABASE_ERROR) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
  }
}

export class UpdateError extends Error {
  public statusCode: number;

  constructor(message = ERROR_MESSAGES.UPDATE_ERROR) {
    super(message);
    this.name = 'UpdateError';
    this.statusCode = 500;
  }
}

export class UnexpectedError extends Error {
  public statusCode: number;

  constructor(message = ERROR_MESSAGES.SERVER_ERROR) {
    super(message);
    this.name = 'UnexpectedError';
    this.statusCode = 500;
  }
}

export class APIError extends Error {
  public statusCode: number;

  constructor(message = ERROR_MESSAGES.API_ERROR) {
    super(message);
    this.name = 'APIError';
    this.statusCode = 502;
  }
}

export class DataParsingError extends Error {
  public statusCode: number;

  constructor(message = ERROR_MESSAGES.DATA_PARSING_ERROR) {
    super(message);
    this.name = 'DataParsingError';
    this.statusCode = 422;
  }
}

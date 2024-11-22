import { ERROR_MESSAGES } from '@/constants/errors';

export class ValidationError extends Error {
  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message = ERROR_MESSAGES.DATABASE_ERROR) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class UpdateError extends Error {
  constructor(message = ERROR_MESSAGES.UPDATE_ERROR) {
    super(message);
    this.name = 'UpdateError';
  }
}

export class UnexpectedError extends Error {
  constructor(message = ERROR_MESSAGES.SERVER_ERROR) {
    super(message);
    this.name = 'UnexpectedError';
  }
}

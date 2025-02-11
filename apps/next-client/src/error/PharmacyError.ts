import { ERROR_MESSAGES } from '@/constants/errors';

export class PharmacyDataError extends Error {
  constructor(message: string = ERROR_MESSAGES.PHARMACY_DATA_ERROR) {
    super(message);
    this.name = 'PharmacyDataError';
  }
}

export class LocationError extends Error {
  constructor(message: string = ERROR_MESSAGES.LOCATION_ERROR) {
    super(message);
    this.name = 'LocationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string = ERROR_MESSAGES.REQUSET_ERROR) {
    super(message);
    this.name = 'ValidationError';
  }
}
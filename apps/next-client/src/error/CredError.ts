import { ERROR_MESSAGES } from '@/constants/errors';

export class CredError extends Error {
  constructor(message: string = ERROR_MESSAGES.INVALID_CREDENTIAL) {
    super(message);
    this.name = "CredError";
  }
}
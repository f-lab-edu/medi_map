import { ERROR_MESSAGES } from '@/constants/errors';

export class SignupError extends Error {
  constructor(message = ERROR_MESSAGES.SIGN_UP_ERROR) {
    super(message);
    this.name = "SignupError";
  }
}

export class LoginError extends Error {
  constructor(message = ERROR_MESSAGES.LOGIN_ERROR) {
    super(message);
    this.name = "LoginError";
  }
}
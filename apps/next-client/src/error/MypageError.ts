import { ALERT_MESSAGES } from '@/constants/alertMessage';

export class FetchUsernameError extends Error {
  constructor(message: string = ALERT_MESSAGES.ERROR.FETCH_USERNAME) {
    super(message);
    this.name = "FetchUsernameError";
  }
}

export class UpdateNicknameError extends Error {
  constructor(message: string = ALERT_MESSAGES.ERROR.UPDATE_NICKNAME) {
    super(message);
    this.name = "UpdateNicknameError";
  }
}

export class UpdatePasswordError extends Error {
  constructor(message: string = ALERT_MESSAGES.ERROR.UPDATE_PASSWORD) {
    super(message);
    this.name = "UpdatePasswordError";
  }
}

export class DeleteAccountError extends Error {
  constructor(message: string = ALERT_MESSAGES.ERROR.DELETE_ACCOUNT) {
    super(message);
    this.name = "DeleteAccountError";
  }
}
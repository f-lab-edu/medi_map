import { ALERT_MESSAGES } from "@/constants/alert_message";

export const validateNickname = (nickname: string): string | null => {
  if (!nickname || nickname.length < 3 || nickname.length > 30) {
    return ALERT_MESSAGES.ERROR.AUTH.NICKNAME_LENGTH;
  }
  return null;
};

// 비밀번호 변경 시 유효성 검사 함수
export const validatePasswordChange = ({
  oldPassword,
  newPassword,
  confirmPassword,
}: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): string | null => {
  if (!oldPassword.trim()) {
    return ALERT_MESSAGES.ERROR.AUTH.PASSWORD_REQUIRED;
  }
  if (!newPassword.trim()) {
    return ALERT_MESSAGES.ERROR.AUTH.NEW_PASSWORD_REQUIRED;
  }
  if (!confirmPassword.trim()) {
    return ALERT_MESSAGES.ERROR.AUTH.CONFIRM_PASSWORD_REQUIRED;
  }

  if (newPassword.trim().length < 8) {
    return ALERT_MESSAGES.ERROR.AUTH.PASSWORD_MIN_LENGTH;
  }

  if (newPassword !== confirmPassword) {
    return ALERT_MESSAGES.ERROR.AUTH.PASSWORD_MISMATCH;
  }

  return null;
};
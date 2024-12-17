export const ERROR_MESSAGES = {
  LOGIN_FAILED: "이메일이나 비밀번호를 다시 확인해주세요.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
  INVALID_CREDENTIAL: "유효하지 않은 자격 증명입니다.",
  LOGIN_ERROR: "로그인 중 문제가 발생했습니다.",
  GOOGLE_LOGIN_ERROR: "구글 로그인 중 문제가 발생했습니다.",
  SIGN_UP_ERROR: "회원가입 중 오류가 발생했습니다.",
  EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다.",
  PHARMACY_DATA_ERROR: "약국 데이터를 불러오는 중 오류가 발생했습니다.",
  LOCATION_ERROR: "위치를 가져오는 데 실패했습니다.",
  REQUSET_ERROR: "잘못된 요청입니다. 위도와 경도가 필요합니다.",
  VALIDATION_ERROR: "위도와 경도가 필요합니다.",
  KAKAO_MAP_ERROR: "카카오 지도를 불러오는 중 오류가 발생했습니다.",
  NETWORK_ERROR: "네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해 주세요.",
  GENERIC_ERROR: "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};

export const ALERT_MESSAGES = {
  SUCCESS: {
    NICKNAME_UPDATE: '닉네임이 성공적으로 변경되었습니다.',
    PASSWORD_UPDATE: '비밀번호가 성공적으로 변경되었습니다.',
    ACCOUNT_DELETE: '회원탈퇴가 완료되었습니다.',
  },
  ERROR: {
    FETCH_USERNAME: '닉네임 조회 중 오류가 발생했습니다.',
    UPDATE_NICKNAME: '닉네임 변경 중 오류가 발생했습니다.',
    UPDATE_PASSWORD: '비밀번호 변경 중 오류가 발생했습니다.',
    DELETE_ACCOUNT: '회원탈퇴 중 오류가 발생했습니다.',
    PASSWORD_MISMATCH: '현재 비밀번호랑 다릅니다. 재확인해주세요.',
    PASSWORD_CONFIRMATION_ERROR: '새 비밀번호가 일치하지 않습니다. 다시 확인해주세요.',
    PASSWORD_SAME_AS_OLD: '현재 비밀번호와 새 비밀번호가 같을 수 없습니다.',
    NO_TOKEN: '인증 토큰이 없습니다. 다시 로그인해주세요.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  },
  CONFIRM: {
    ACCOUNT_DELETE: '정말로 회원탈퇴를 하시겠습니까?',
  },
};

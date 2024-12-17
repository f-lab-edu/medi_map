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
